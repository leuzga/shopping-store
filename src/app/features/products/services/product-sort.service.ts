import { Injectable, signal } from '@angular/core';

/**
 * Sort Types
 * Tipos de ordenamientos disponibles para productos
 */
export type SortType = 'none' | 'alphabetic' | 'price' | 'rating';

export interface SortOption {
  id: SortType;
  label: string;
}

/**
 * ProductSortService
 * Responsabilidad única: Gestionar estado de ordenamientos de productos
 *
 * - Signals para estado reactivo
 * - Métodos puros: setSort(), getSort()
 * - Expone señales read-only
 */
@Injectable({
  providedIn: 'root'
})
export class ProductSortService {
  private readonly selectedSortState = signal<SortType>('none');

  // Public read-only signal
  readonly selectedSort = this.selectedSortState.asReadonly();

  /**
   * Set the active sort option
   * Pure function: Only updates signal
   */
  setSort(sortType: SortType): void {
    this.selectedSortState.set(sortType);
  }

  /**
   * Get current sort type
   */
  getSort(): SortType {
    return this.selectedSortState();
  }

  /**
   * Reset sort to none
   */
  resetSort(): void {
    this.selectedSortState.set('none');
  }
}
