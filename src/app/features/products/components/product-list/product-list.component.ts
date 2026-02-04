import { Component, inject, signal, computed, effect, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductFacade } from '../../services/product.facade';
import { ProductFilterService, type CategoryType } from '../../services/product-filter.service';
import { ProductSortService, type SortType } from '../../services/product-sort.service';
import { ProductSearchService } from '../../services/product-search.service';
import { CartService } from '@features/cart/services/cart.service';
import { NotificationService } from '@core/services';
import { Product } from '@core/models';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { PRODUCT_MESSAGES, PAGINATION, NOTIFICATION_MESSAGES } from '@core/constants';
import { applyFilters, applySorting } from '../../utils/search.utils';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFilterComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements AfterViewInit, OnDestroy {
  readonly facade = inject(ProductFacade);
  private readonly filterService = inject(ProductFilterService);
  private readonly sortService = inject(ProductSortService);
  readonly searchService = inject(ProductSearchService);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  @ViewChild('loadMoreTrigger') loadMoreTrigger?: ElementRef;

  // Domain Constants & Bound Facade Signals
  readonly messages = PRODUCT_MESSAGES;
  readonly products = this.facade.products;
  readonly isLoading = this.facade.isLoading;
  readonly hasReachedEnd = this.facade.hasReachedEnd;
  readonly totalProducts = this.facade.totalProducts;

  // Component State
  readonly currentPage = signal<number>(1);
  readonly limit = signal<number>(this.getInitialLimit());
  readonly totalPages = computed(() => Math.ceil(this.totalProducts() / this.limit()) || 1);

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
    Math.ceil(this.displayedTotalProducts() / this.limit()) || 1
  );

  private observer?: IntersectionObserver;
  private scrollObserver?: IntersectionObserver;

  constructor() {
    this.initializeProductLoading();
    this.setupScrollSyncEffect();
  }

  /**
   * Pure function: Get initial limit from router state or use default
   * Responsibility: Determine page size based on navigation context
   */
  private getInitialLimit(): number {
    const state = this.router.getCurrentNavigation()?.extras?.state || {};
    return (state as any)?.initialLoadSize || PAGINATION.DEFAULT_PAGE_SIZE;
  }

  /**
   * Pure function: Initialize first product load
   * Responsibility: Load first batch of products on component init
   */
  private initializeProductLoading(): void {
    this.facade.loadProducts(this.limit(), 0);
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
    return Math.floor(index / this.limit()) + 1;
  }

  /**
   * Pure function: Get the first product index of a page
   * Responsibility: Calculate starting index for pagination
   */
  private getFirstProductIndexOfPage(page: number): number {
    return (page - 1) * this.limit();
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
      this.facade.loadProducts(this.limit(), apiSkip, false);
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
        this.facade.loadProducts(this.limit(), this.products().length);
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
   * Muestra notificación de éxito cuando se agrega un producto
   */
  onAddToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.notificationService.showSuccess(
      NOTIFICATION_MESSAGES.CART.ADD_SUCCESS
    );
  }
}
