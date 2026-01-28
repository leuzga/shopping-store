import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFilterService, type CategoryType } from '../../services/product-filter.service';
import { ProductSortService, type SortType } from '../../services/product-sort.service';
import { ProductFacade } from '../../services/product.facade';
import { PRODUCT_MESSAGES } from '@core/constants/messages';

/**
 * ProductFilterComponent
 * Responsabilidad única: Mostrar panel de filtros (checkboxes) y ordenamiento
 *
 * - Panel horizontal con checkboxes para filtrar por categoría
 *   - Categorías ordenadas alfabéticamente
 *   - Multi-select: puede seleccionar múltiples categorías
 *   - Reduce cantidad de productos mostrados
 *
 * - Dropdown para ordenamiento
 *   - Dropdown con opciones de ordenamiento
 *   - Reorganiza productos sin cambiar cantidad
 *
 * - Ambos son independientes y pueden combinarse
 * - Usa ProductFilterService y ProductSortService para estado
 * - HTML limpio con @apply directives
 * - Sin textos hardcodeados, usa constantes
 */
@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-controls-wrapper">
      <!-- FILTER BY CATEGORY DROPDOWN -->
      <div class="control-group">
        <div class="dropdown dropdown-end">
          <div class="tooltip tooltip-bottom" [attr.data-tip]="messages.FILTERS.LABEL">
            <button
              class="btn btn-sm btn-ghost btn-circle"
              role="button"
              tabindex="0"
              aria-label="Filter by category">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </button>
          </div>
          <div
            class="dropdown-content z-[1] p-4 shadow bg-base-100 rounded-box w-[48rem] border border-base-200 flex flex-col gap-4"
            tabindex="0">
            <div class="checkbox-grid">
              @for (category of sortedCategories(); track category) {
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="filterService.isSelected(category)"
                    (change)="onCategoryToggle($event, category)"
                    class="checkbox checkbox-primary checkbox-sm"
                  />
                  <span class="label-text">{{ category | titlecase }}</span>
                </label>
              }
            </div>
            <!-- Filter Action Buttons -->
            <div class="filter-actions">
              <button
                class="btn btn-sm btn-primary"
                (click)="onApplyFilter()">
                Filtrar
              </button>
              <button
                class="btn btn-sm btn-ghost"
                (click)="onClearFilter()">
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SORT OPTIONS -->
      <div class="control-group">
        <div class="dropdown dropdown-end">
          <div class="tooltip tooltip-bottom" [attr.data-tip]="messages.SORTS.LABEL">
            <button
              class="btn btn-sm btn-ghost btn-circle"
              role="button"
              tabindex="0"
              aria-label="Sort products">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12l7-7 7 7\"></path>
              </svg>
            </button>
          </div>
          <ul
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-200"
            tabindex="0">
            <li>
              <a
                (click)="onSortChange('none')"
                [class.active]="sortService.selectedSort() === 'none'">
                {{ messages.SORTS.DEFAULT }}
              </a>
            </li>
            <li>
              <a
                (click)="onSortChange('alphabetic')"
                [class.active]="sortService.selectedSort() === 'alphabetic'">
                {{ messages.SORTS.BY_ALPHABETIC }}
              </a>
            </li>
            <li>
              <a
                (click)="onSortChange('price')"
                [class.active]="sortService.selectedSort() === 'price'">
                {{ messages.SORTS.BY_PRICE }}
              </a>
            </li>
            <li>
              <a
                (click)="onSortChange('rating')"
                [class.active]="sortService.selectedSort() === 'rating'">
                {{ messages.SORTS.BY_RATING }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-controls-wrapper {
      @apply flex items-center gap-2;
    }

    .control-group {
      @apply w-auto;
    }

    .tooltip {
      @apply w-auto z-50;
    }

    .tooltip::after {
      @apply z-50;
    }

    .checkbox-grid {
      @apply grid grid-cols-3 gap-3;
    }

    .checkbox-item {
      @apply flex items-center gap-2 cursor-pointer;
    }

    .checkbox-item input[type="checkbox"] {
      @apply checkbox-sm flex-shrink-0;
      width: 18px;
      height: 18px;
      min-width: 18px;
      min-height: 18px;
    }

    .checkbox-item span {
      @apply text-sm font-medium leading-tight;
    }

    .filter-actions {
      @apply flex gap-2 justify-end;
    }

    .filter-actions button {
      @apply text-sm;
    }

    .dropdown-content li a {
      @apply text-sm;
    }

    .dropdown-content li a.active {
      @apply bg-primary text-white;
    }
  `]
})
export class ProductFilterComponent {
  readonly filterService = inject(ProductFilterService);
  readonly sortService = inject(ProductSortService);
  readonly facade = inject(ProductFacade);
  readonly messages = PRODUCT_MESSAGES;

  /**
   * Computed: Categorías ordenadas alfabéticamente
   */
  readonly sortedCategories = computed(() => {
    const categories = this.facade.categories();
    return [...categories].sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
  });

  /**
   * Event handler: Toggle category selection (add/remove)
   */
  onCategoryToggle(event: Event, category: CategoryType): void {
    this.filterService.toggleCategory(category);
  }

  /**
   * Event handler: Apply filter with selected categories
   */
  onApplyFilter(): void {
    this.filterService.applyFilter();
  }

  /**
   * Event handler: Clear all filters
   */
  onClearFilter(): void {
    this.filterService.clearCategories();
  }

  /**
   * Event handler: Change sort option
   */
  onSortChange(sortType: SortType): void {
    this.sortService.setSort(sortType);
  }
}
