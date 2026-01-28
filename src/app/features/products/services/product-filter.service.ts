import { Injectable, signal } from '@angular/core';

/**
 * Category Type
 * Tipo para filtro de categoría
 */
export type CategoryType = string;

/**
 * ProductFilterService
 * Responsabilidad única: Gestionar estado de filtros de productos por categoría
 *
 * - Signals para estado reactivo
 * - Métodos puros: toggleCategory(), isSelected(), clearCategories()
 * - Expone señales read-only
 * - Solo filtra por categoría (reducir cantidad de productos)
 * - Ordenamientos están en ProductSortService
 * - Multi-select: puede haber múltiples categorías seleccionadas
 */
@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {
  // UI State: What checkboxes are currently selected (before filtering)
  private readonly selectedCategoriesState = signal<CategoryType[]>([]);

  // Applied State: What categories are actively filtering products
  private readonly appliedFilterState = signal<CategoryType[]>([]);

  // Public read-only signals
  readonly selectedCategories = this.selectedCategoriesState.asReadonly();
  readonly appliedFilter = this.appliedFilterState.asReadonly();

  /**
   * Toggle category selection in UI (add if not selected, remove if selected)
   * Pure function: Only updates UI state, doesn't filter yet
   */
  toggleCategory(category: CategoryType): void {
    const current = this.selectedCategoriesState();
    if (current.includes(category)) {
      // Remove category
      this.selectedCategoriesState.set(current.filter(c => c !== category));
    } else {
      // Add category
      this.selectedCategoriesState.set([...current, category]);
    }
  }

  /**
   * Check if category is selected in UI
   */
  isSelected(category: CategoryType): boolean {
    return this.selectedCategoriesState().includes(category);
  }

  /**
   * Apply filter: Copy selected categories to applied filter
   * This actually triggers the filtering action
   */
  applyFilter(): void {
    this.appliedFilterState.set([...this.selectedCategoriesState()]);
  }

  /**
   * Clear all selected categories and applied filter
   */
  clearCategories(): void {
    this.selectedCategoriesState.set([]);
    this.appliedFilterState.set([]);
  }
}
