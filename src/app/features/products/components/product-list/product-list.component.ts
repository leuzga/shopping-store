import { Component, inject, signal, computed, effect, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFacade } from '../../services/product.facade';
import { ProductFilterService, type CategoryType } from '../../services/product-filter.service';
import { ProductSortService, type SortType } from '../../services/product-sort.service';
import { ProductSearchService } from '../../services/product-search.service';
import { CartService } from '@features/cart/services/cart.service';
import { Product } from '@core/models';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { PRODUCT_MESSAGES, PAGINATION } from '@core/constants';
import { applyFilters, applySorting } from '../../utils/search.utils';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFilterComponent],
  template: `
    <div class="product-list-container">
      <!-- Persistent Header (Title + Filter + Pagination) -->
      <div class="sticky-header">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 class="product-list-title">{{ messages.TITLES.LIST }}</h1>

          <!-- Right Section: Filter + Pagination -->
          <div class="header-right-section">
            <!-- Product Filter Component -->
            <app-product-filter></app-product-filter>

            <!-- DaisyUI Pagination (Hidden when searching to prevent data mixing) -->
            @if (!searchService.query()) {
              <div class="pagination-join">
                <button class="join-item btn btn-sm md:btn-md" [disabled]="currentPage() === 1" (click)="goToPage(currentPage() - 1)">«</button>
                <button class="join-item btn btn-sm md:btn-md no-animation font-bold">
                  {{ messages.LABELS.PAGE_INFO(currentPage(), displayedTotalPages()) }}
                </button>
                <button class="join-item btn btn-sm md:btn-md" [disabled]="currentPage() === displayedTotalPages()" (click)="goToPage(currentPage() + 1)">»</button>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Product Grid (displays filtered products, pagination uses original products array) -->
      <div class="product-grid" #gridContainer>
        @for (product of displayProducts(); track product.id; let index = $index) {
          <app-product-card
            [product]="product"
            (addToCart)="onAddToCart($event)"
            [id]="'product-' + index"
            [attr.data-product-index]="index" />
        }
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <span class="loading loading-dots loading-lg text-primary"></span>
        </div>
      }

      <!-- Intersection Observer Trigger (Disabled when searching) -->
      @if (!searchService.query()) {
        <div #loadMoreTrigger class="scroll-trigger"></div>
      }

      <!-- End of List -->
      @if (hasReachedEnd() && !isLoading() && !searchService.query()) {
        <div class="end-list-alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>{{ messages.STATUS.END_OF_LIST }} (Total: {{ totalProducts() }} {{ messages.UNIT.PRODUCTS }})</span>
        </div>
      }

      <!-- No Search Results -->
      @if (searchService.query() && displayProducts().length === 0 && !isLoading()) {
        <div class="alert alert-warning shadow-sm mt-8 animate-in fade-in zoom-in duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>No se encontraron productos para "<strong>{{ searchService.query() }}</strong>". Intenta con otros términos.</span>
          <button class="btn btn-sm btn-ghost underline" (click)="searchService.clearSearch()">Limpiar búsqueda</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-list-container {
      @apply max-w-7xl mx-auto px-4 pb-8;
    }

    .sticky-header {
      @apply sticky z-30 py-4 mb-6 transition-all duration-300;
      @apply bg-base-100/95 backdrop-blur-md shadow-sm; /* More opacity to hide scrolling content */
      top: 0; /* Sticky to container top, container has padding */
    }

    @media (min-width: 768px) {
      /* No special top needed if container handles offset */
    }

    .product-list-title {
      @apply text-3xl font-black text-base-content tracking-tight;
    }

    .header-right-section {
      @apply flex items-center gap-4 flex-wrap justify-end;
    }

    .pagination-join {
      @apply join shadow-md bg-base-100 border border-base-200;
    }

    .product-grid {
      @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px];
    }

    .loading-container {
      @apply flex justify-center p-12;
    }

    .scroll-trigger {
      @apply h-10 w-full mt-4;
    }

    .end-list-alert {
      @apply alert alert-info shadow-sm mt-8 border-none bg-base-200;
    }
  `]
})
export class ProductListComponent implements AfterViewInit, OnDestroy {
  readonly facade = inject(ProductFacade);
  private readonly filterService = inject(ProductFilterService);
  private readonly sortService = inject(ProductSortService);
  readonly searchService = inject(ProductSearchService);
  private readonly cartService = inject(CartService);
  @ViewChild('loadMoreTrigger') loadMoreTrigger?: ElementRef;

  // Domain Constants & Bound Facade Signals
  readonly messages = PRODUCT_MESSAGES;
  readonly products = this.facade.products;
  readonly isLoading = this.facade.isLoading;
  readonly hasReachedEnd = this.facade.hasReachedEnd;
  readonly totalProducts = this.facade.totalProducts;

  // Component State
  readonly currentPage = signal<number>(1);
  readonly limit = PAGINATION.DEFAULT_PAGE_SIZE;
  readonly totalPages = computed(() => Math.ceil(this.totalProducts() / this.limit) || 1);

  /**
   * Computed signal: Apply search + filter + sort locally after data is consumed
   * Responsibility: Apply search results (if any), then filter (reduce quantity), then sort (reorganize)
   * Does NOT affect data loading logic, only visual presentation
   * Execution order: Search results (if active) → Filter categories (multi-select) → Apply sort → Display
   *
   * Uses pure utility functions for filtering and sorting
   * Verifies search index is ready before displaying search results
   */
  readonly displayProducts = computed(() => {
    const products = this.products();
    const searchResults = this.searchService.results();
    const appliedFilter = this.filterService.appliedFilter();
    const sortType = this.sortService.selectedSort();
    const indexReady = this.searchService.indexReady();

    // STEP 1: Determine source (Search Results vs Full List)
    const currentQuery = this.searchService.query();
    const hasSearchActive = currentQuery.trim().length > 0;

    // If search is active but index isn't ready, show nothing yet to be safe
    if (hasSearchActive && !indexReady) {
      return [];
    }

    // If search is active, ONLY use search results. Do NOT fallback to full products.
    // This maintains the "Sandbox" isolation requested.
    const productsToTransform = hasSearchActive ? [...searchResults] : products;

    // STEP 2: Apply category filter (pure function from search.utils)
    const filtered = applyFilters(productsToTransform, appliedFilter);

    // STEP 3: Apply sort (pure function from search.utils)
    return applySorting(filtered, sortType);
  });

  /**
   * Computed signal: Total displayed products after filtering
   * Responsibility: Calculate correct page count based on filtered results
   */
  readonly displayedTotalProducts = computed(() => this.displayProducts().length);

  /**
   * Computed signal: Total pages based on displayed (filtered) products
   * Responsibility: Show correct pagination for filtered product set
   */
  readonly displayedTotalPages = computed(() =>
    Math.ceil(this.displayedTotalProducts() / this.limit) || 1
  );

  private observer?: IntersectionObserver;
  private scrollObserver?: IntersectionObserver;

  constructor() {
    this.initializeProductLoading();
    this.setupScrollSyncEffect();
  }

  /**
   * Pure function: Initialize first product load
   * Responsibility: Load first batch of products on component init
   */
  private initializeProductLoading(): void {
    this.facade.loadProducts(this.limit, 0);
  }

  /**
   * Pure function: Setup effect to re-sync scroll observer when products change
   * Responsibility: Keep IntersectionObserver updated with new DOM elements
   */
  private setupScrollSyncEffect(): void {
    effect(() => {
      // Trigger re-sync whenever products array changes
      this.products();

      // Re-setup observers after products are rendered
      if (typeof document !== 'undefined') {
        setTimeout(() => {
          this.setupScrollPageSync();
        }, 0);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.setupScrollPageSync();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.scrollObserver?.disconnect();
  }

  // ============================================================================
  // Pure Functions (Single Responsibility: Data Transformation)
  // ============================================================================

  /**
   * Pure function: Calculate current page from product index
   * Responsibility: Determine which page a product belongs to
   */
  private calculatePageFromIndex(index: number): number {
    return Math.floor(index / this.limit) + 1;
  }

  /**
   * Pure function: Get the first product index of a page
   * Responsibility: Calculate starting index for pagination
   */
  private getFirstProductIndexOfPage(page: number): number {
    return (page - 1) * this.limit;
  }


  // ============================================================================
  // Event Handlers (Single Responsibility: Navigation & Sync)
  // ============================================================================

  /**
   * Handle manual page navigation
   * Responsibility: Navigate to specific page and scroll smoothly
   * Uses displayed (filtered) products for page calculations
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.displayedTotalPages()) return;

    const firstProductIndex = this.getFirstProductIndexOfPage(page);
    this.currentPage.set(page);

    // Try to scroll to first product of the target page
    const targetElement = document.getElementById(`product-${firstProductIndex}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // If products not loaded yet, load them first
      // Note: Load from original products offset, not filtered offset
      const apiSkip = Math.min(firstProductIndex, this.products().length);
      this.facade.loadProducts(this.limit, apiSkip, false);
      setTimeout(() => {
        document.getElementById(`product-${firstProductIndex}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }

  /**
   * Setup infinite scroll: Load more products when near end of list
   * Responsibility: Trigger loading when user scrolls to bottom
   */
  private setupIntersectionObserver(): void {
    if (!this.loadMoreTrigger) return;
    this.observer = new IntersectionObserver((entries) => {
      // Logic check: only load more if NOT searching
      if (entries[0].isIntersecting && !this.isLoading() && !this.hasReachedEnd() && !this.searchService.query()) {
        this.facade.loadProducts(this.limit, this.products().length);
      }
    }, { rootMargin: '400px' });
    this.observer.observe(this.loadMoreTrigger.nativeElement);
  }

  /**
   * Setup scroll page sync: Track which page is currently visible
   * Responsibility: Update pagination UI as user scrolls through products
   */
  private setupScrollPageSync(): void {
    this.scrollObserver?.disconnect();
    this.scrollObserver = new IntersectionObserver((entries) => {
      // Find the first visible product
      const visibleEntry = entries.find(e => e.isIntersecting);
      if (visibleEntry) {
        const productIndex = parseInt(visibleEntry.target.getAttribute('data-product-index') || '0');
        const newPage = this.calculatePageFromIndex(productIndex);

        if (this.currentPage() !== newPage) {
          this.currentPage.set(newPage);
        }
      }
    }, { threshold: 0.1 });

    // Observe all products currently in the DOM
    document.querySelectorAll('[data-product-index]').forEach(el => {
      this.scrollObserver?.observe(el);
    });
  }

  /**
   * Handle adding product to cart
   */
  onAddToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    console.log(`Added "${product.title}" to cart`);
  }
}
