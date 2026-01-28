import { Injectable, signal } from '@angular/core';
import { Product } from '@core/models/product.model';
import { SearchEngineService } from './search-engine.service';
import { ProductFacade } from './product.facade';

/**
 * ProductIndexerService - Synchronization between ProductFacade and SearchEngine
 *
 * Responsabilidad única: Sincronizar datos de ProductFacade con SearchEngineService.
 * Maneja carga inicial e indexación incremental para infinite scroll.
 *
 * No maneja estado reactivo de búsqueda.
 * No ejecuta búsquedas.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductIndexerService {
  // Tracking state
  private indexReadyState = signal<boolean>(false);
  private lastIndexedCount = 0;

  readonly indexReady = this.indexReadyState.asReadonly();

  constructor(
    private searchEngineService: SearchEngineService,
    private productFacade: ProductFacade
  ) {}

  /**
   * Carga todos los productos de ProductFacade e indexa en SearchEngine
   * Solo debe llamarse UNA vez al inicio
   *
   * @param products - Array de productos a indexar
   */
  loadAndIndexProducts(products: Product[]): void {
    if (products.length === 0) {
      // Sin productos, marca como listo pero vacío
      this.indexReadyState.set(true);
      this.lastIndexedCount = 0;
      return;
    }

    // Indexar TODOS los productos (replaceAll = true)
    this.searchEngineService.updateIndex(products, true);
    this.lastIndexedCount = products.length;
    this.indexReadyState.set(true);

    console.log(
      `[ProductIndexer] Initial indexing complete: ${products.length} products indexed`
    );
  }

  /**
   * Agrega nuevos productos al índice sin borrar los existentes
   * Se usa para infinite scroll
   *
   * @param newProducts - Array de nuevos productos a agregar
   */
  appendProducts(newProducts: Product[]): void {
    if (newProducts.length === 0) {
      return;
    }

    // Si no está indexado aún, cargar todos primero
    if (!this.isIndexedReady()) {
      const allProducts = this.productFacade.products();
      this.loadAndIndexProducts(allProducts);
      return;
    }

    // Agregar incrementalmente (replaceAll = false)
    this.searchEngineService.updateIndex(newProducts, false);
    this.lastIndexedCount += newProducts.length;

    console.log(
      `[ProductIndexer] Incremental append: ${newProducts.length} products added. Total: ${this.lastIndexedCount}`
    );
  }

  /**
   * Verifica si el índice está listo para búsquedas
   */
  isIndexedReady(): boolean {
    return this.indexReadyState();
  }

  /**
   * Retorna cantidad de productos actualmente indexados
   */
  getIndexedProductCount(): number {
    return this.searchEngineService.getIndexedProductCount();
  }
}
