import { Injectable, computed, signal } from '@angular/core';
import { Product } from '@core/models/product.model';

/**
 * SearchStateService - Reactive state management for search
 *
 * Responsabilidad única: Manejar el estado reactivo de búsqueda.
 * Encapsula todos los signals relativos a búsqueda en un único lugar.
 *
 * Solo maneja estado, no lógica de búsqueda ni sincronización.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  // Private writable signals
  private readonly searchResultsState = signal<readonly Product[]>([]);
  private readonly currentQueryState = signal<string>('');
  private readonly indexReadyState = signal<boolean>(false);

  // Public readonly signals
  readonly results = this.searchResultsState.asReadonly();
  readonly query = this.currentQueryState.asReadonly();
  readonly indexReady = this.indexReadyState.asReadonly();

  // Computed signals for convenience
  readonly hasResults = computed(() => this.searchResultsState().length > 0);
  readonly resultCount = computed(() => this.searchResultsState().length);

  constructor() {}

  /**
   * Actualiza los resultados de búsqueda
   * Limpia el query de error automáticamente
   */
  updateResults(products: readonly Product[]): void {
    this.searchResultsState.set(products);
  }

  /**
   * Actualiza el query que se muestra (para feedback al usuario)
   */
  updateQuery(query: string): void {
    this.currentQueryState.set(query);
  }

  /**
   * Marca que el índice está listo para búsquedas
   */
  setIndexReady(ready: boolean): void {
    this.indexReadyState.set(ready);
  }

  /**
   * Limpia todos los estados de búsqueda
   */
  clearAll(): void {
    this.searchResultsState.set([]);
    this.currentQueryState.set('');
  }
}
