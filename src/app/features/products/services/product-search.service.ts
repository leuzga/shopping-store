import { Injectable, effect, inject } from '@angular/core';
import { Product } from '@core/models/product.model';
import { SearchEngineService } from './search-engine.service';
import { SearchStateService } from './search-state.service';
import { ProductIndexerService } from './product-indexer.service';
import { ProductFacade } from './product.facade';

/**
 * ProductSearchService - Orquestador del flujo completo de búsqueda
 *
 * Responsabilidad única: Orquestar el flujo de búsqueda combinando:
 * 1. SearchEngineService (búsqueda pura)
 * 2. SearchStateService (estado reactivo)
 * 3. ProductIndexerService (sincronización de datos)
 * 4. ProductFacade (fuente de datos)
 *
 * No contiene lógica de búsqueda, solo orquestación.
 * Las funciones puras son delegadas a otros servicios.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {
  private readonly searchEngineService = inject(SearchEngineService);
  private readonly searchStateService = inject(SearchStateService);
  private readonly productIndexerService = inject(ProductIndexerService);
  private readonly productFacade = inject(ProductFacade);

  // Exponer solo lo necesario
  readonly results = this.searchStateService.results;
  readonly query = this.searchStateService.query;
  readonly indexReady = this.searchStateService.indexReady;
  readonly hasResults = this.searchStateService.hasResults;
  readonly resultCount = this.searchStateService.resultCount;

  // Local tracking: avoid re-triggering effect when setting indexReady
  private hasInitiallyIndexed = false;
  private lastProcessedProductCount = 0;

  constructor() {
    this.setupProductSynchronization();
    this.setupSearchReaction();
  }

  /**
   * Configurar reacción automática a cambios en query o índice
   * Se dispara cuando:
   * 1. Usuario escribe (cambia query)
   * 2. Índice se termina de cargar (cambia indexReady)
   */
  private setupSearchReaction(): void {
    effect(() => {
      const query = this.searchStateService.query();
      const indexReady = this.searchStateService.indexReady();

      // Si no hay query, no hacemos nada (la limpieza la maneja clearAll/performSearch)
      if (!query.trim()) return;

      // Si el índice no está listo, esperamos
      if (!indexReady) return;

      // Si tenemos query y el índice está listo, buscamos
      this.executeSearch(query);
    });
  }

  /**
   * Configurar sincronización automática de productos
   * Se dispara cuando ProductFacade carga nuevos productos
   *
   * Flujo:
   * 1. ProductFacade.products() cambia
   * 2. Detectamos si es primera carga o incremental (usando state local)
   * 3. Indexamos en SearchEngine
   * 4. Marcamos indexReady solo UNA vez
   *
   * Nota: Usamos estado local (hasInitiallyIndexed) para evitar que
   * setIndexReady() cause re-ejecución del effect
   */
  private setupProductSynchronization(): void {
    effect(() => {
      const products = this.productFacade.products();

      // Primera carga: indexar todos los productos
      if (!this.hasInitiallyIndexed && products.length > 0) {
        console.log(`[ProductSearch] Initial load detected. Indexing ${products.length} products...`);
        this.productIndexerService.loadAndIndexProducts(products);
        this.searchStateService.setIndexReady(true);
        this.hasInitiallyIndexed = true;
        this.lastProcessedProductCount = products.length;

        console.log(`[ProductSearch] Indexing success: ${this.productIndexerService.getIndexedProductCount()} total products in index`);
      }
      // Infinite scroll: agregar productos incrementalmente
      else if (this.hasInitiallyIndexed && products.length > this.lastProcessedProductCount) {
        const newProductsCount = products.length - this.lastProcessedProductCount;
        const newProducts = products.slice(
          this.lastProcessedProductCount,
          products.length
        );

        this.productIndexerService.appendProducts(newProducts);
        this.lastProcessedProductCount = products.length;

        console.log(
          `[ProductSearch] Incremental products indexed: ${newProductsCount} new products added`
        );
      }
    });
  }

  /**
   * Solicitar búsqueda con el query proporcionado
   *
   * SOLO actualiza el estado del query.
   * La ejecución real sucede en el effect setupSearchReaction
   */
  performSearch(query: string): void {
    // PASO 1: Validar y normalizar entrada (pure function)
    const cleanQuery = this.cleanQuery(query);

    // PASO 2: Actualizar state (esto disparará el effect si corresponde)
    this.searchStateService.updateQuery(cleanQuery);

    // PASO 3: Si query es vacío, limpiar resultados inmediatamente
    if (!cleanQuery.trim()) {
      this.searchStateService.clearAll();
    }
  }

  /**
   * Lógica interna de ejecución de búsqueda
   * Se llama desde el effect cuando todo está listo
   */
  private executeSearch(query: string): void {
    // Verificar que el índice existe (redundante con indexReady pero seguro)
    const indexedCount = this.productIndexerService.getIndexedProductCount();
    console.log(`[ProductSearch] Executing search for: "${query}". Index size: ${indexedCount}`);

    if (indexedCount === 0) {
      console.warn('[ProductSearch] Index empty during execution. Returning empty.');
      this.searchStateService.updateResults([]);
      return;
    }

    try {
      const searchResults = this.searchEngineService.search(query);

      // Convertir SearchResult[] a Product[]
      const products = this.convertSearchResultsToProducts(searchResults);

      // Actualizar estado
      this.searchStateService.updateResults(products);

      console.log(`[ProductSearch] Search for "${query}" returned ${products.length} results`);
    } catch (error) {
      console.error('[ProductSearch] Error during search execution:', error);
      this.searchStateService.updateResults([]);
    }
  }

  /**
   * Pure function: Convertir resultados de MiniSearch a Product[]
   * Mapea IDs de resultados a objetos Product completos
   */
  private convertSearchResultsToProducts(searchResults: any[]): Product[] {
    const allProducts = this.productFacade.products();
    console.log(`[ProductSearch] Mapping ${searchResults.length} results from ${allProducts.length} known products`);

    return searchResults
      .map(result => {
        const product = allProducts.find((p: Product) => p.id == result.id);
        if (!product) console.warn(`[ProductSearch] Result ID ${result.id} not found in facade!`);
        return product;
      })
      .filter((p): p is Product => p !== undefined);
  }

  /**
   * Pure function: Limpiar y normalizar query
   * - Trim whitespace
   * - Convert to lowercase
   * - Remove special characters
   */
  private cleanQuery(query: string): string {
    return query
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, '');
  }

  /**
   * Limpiar búsqueda completamente
   * Útil cuando user navega o cambia de página
   */
  clearSearch(): void {
    this.searchStateService.clearAll();
  }
}
