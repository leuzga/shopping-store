import { Injectable } from '@angular/core';
import MiniSearch, { type SearchResult } from 'minisearch';
import { Product } from '@core/models/product.model';

/**
 * SearchEngineService - Pure search engine interface
 *
 * Responsabilidad única: Manejar la instancia de MiniSearch y sus operaciones.
 * Todas las operaciones son funciones puras sin estado reactivo.
 *
 * No maneja sincronización de datos ni estado reactivo.
 * Solo proporciona operaciones de búsqueda sobre un índice.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchEngineService {
  private miniSearch: MiniSearch<Product> | null = null;
  private indexedProductCount = 0;

  constructor() {
    this.miniSearch = this.createSearchIndex();
  }

  /**
   * Pure function: Crea una nueva instancia de MiniSearch
   * Configurable para búsqueda de productos
   */
  private createSearchIndex(): MiniSearch<Product> {
    const config = this.getSearchConfiguration();
    return new MiniSearch<Product>(config);
  }

  /**
   * Pure function: Retorna configuración optimizada de MiniSearch
   * Separa la configuración de la instanciación
   */
  private getSearchConfiguration() {
    return {
      idField: 'id',
      // Definimos campos como array de strings (MiniSearch v7 requirement)
      fields: ['title', 'category', 'brand', 'description', 'stock'],
      // Almacenamos el ID para la reconstrucción del objeto
      storeFields: ['id'],
      searchOptions: {
        prefix: true,          // Permite encontrar "cat" dentro de "category" o "caterpillar"
        // Lógica de aproximación (fuzzy):
        // 0.2 permite pequeñas variaciones (typos).
        // Se aplica dinámicamente según la longitud para no dar falsos positivos en 1-2 letras.
        fuzzy: (term: string) => term.length > 2 ? 0.2 : 0,
        // Combinamos resultados exactos y aproximados
        combineWith: 'OR',
        // Boost específico para coincidencias exactas en ciertos campos
        boost: {
          title: 12,
          category: 10,
          brand: 8,
          description: 4,
          stock: 1
        }
      }
    } as any;
  }

  /**
   * Pure function: Ejecuta búsqueda en el índice existente
   *
   * Precondición: El índice debe estar inicializado
   * Retorna array vacío si no hay coincidencias
   */
  search(query: string): SearchResult[] {
    if (!this.miniSearch) {
      return [];
    }

    try {
      return this.miniSearch.search(query) as SearchResult[];
    } catch (error) {
      console.error('[SearchEngine] Error during search:', error);
      return [];
    }
  }

  /**
   * Pure function: Actualiza el índice con nuevos productos
   * NO borra existentes, agrega o reemplaza según el caso
   *
   * @param products - Productos a indexar
   * @param replaceAll - Si true, limpia el índice primero
   */
  updateIndex(products: Product[], replaceAll: boolean = false): void {
    if (!this.miniSearch) {
      return;
    }

    try {
      if (replaceAll) {
        this.miniSearch.removeAll();
      }

      // Agregar productos al índice (evita duplicados automáticamente)
      this.miniSearch.addAll(products as any);
      this.indexedProductCount = this.getIndexedProductCount();
    } catch (error) {
      console.error('[SearchEngine] Error updating index:', error);
    }
  }

  /**
   * Pure function: Retorna cantidad de productos indexados
   * Útil para detectar cambios incrementales
   */
  getIndexedProductCount(): number {
    return this.miniSearch?.documentCount ?? 0;
  }

  /**
   * Getter: Verifica si MiniSearch está inicializado y listo
   */
  isInitialized(): boolean {
    return this.miniSearch !== null;
  }

  /**
   * Getter: Retorna la instancia actual (para operaciones avanzadas)
   * Usar con cuidado para no romper la responsabilidad única
   */
  getInstance(): MiniSearch<Product> | null {
    return this.miniSearch;
  }
}
