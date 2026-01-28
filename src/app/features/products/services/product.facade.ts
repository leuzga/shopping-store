import { Injectable, inject, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from './product.service';
import { Product } from '@core/models';
import { PRODUCT_MESSAGES } from '@core/constants';

/**
 * ProductFacade - Single Responsibility: Encapsulate product data operations
 *
 * Converts RxJS Observables to Signals for reactive state management
 * Handles pagination, filtering, and error management
 * Exposes read-only signals for components to bind to
 */
@Injectable({
  providedIn: 'root'
})
export class ProductFacade {
  private readonly productService = inject(ProductService);

  // ============================================================================
  // Private State Signals (Internal writable signals)
  // ============================================================================

  private readonly loadRequestState = signal<{ limit: number; skip: number; append: boolean } | null>(null);
  private readonly productsState = signal<Product[]>([]);
  private readonly isLoadingState = signal<boolean>(false);
  private readonly totalProductsState = signal<number>(0);
  private readonly reachedEndState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  // ============================================================================
  // Public Read-only Signals (Exposed to components)
  // ============================================================================

  readonly products = this.productsState.asReadonly();
  readonly isLoading = this.isLoadingState.asReadonly();
  readonly totalProducts = this.totalProductsState.asReadonly();
  readonly hasReachedEnd = this.reachedEndState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // ============================================================================
  // API Data as Signal (Categories)
  // ============================================================================

  readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });


  // ============================================================================
  // Constructor: Initialize reactive effects
  // ============================================================================

  constructor() {
    this.initializeLoadProductsEffect();
  }

  /**
   * Pure function: Initialize the effect that reacts to load requests
   * Responsibility: Set up reactive dependency tracking
   */
  private initializeLoadProductsEffect(): void {
    effect(() => {
      const request = this.loadRequestState();
      if (!request) return;

      this.isLoadingState.set(true);
      this.errorState.set(null);

      // Subscribe to Observable and update signals
      const subscription = this.productService
        .getProducts(request.limit, request.skip)
        .subscribe({
          next: (response) => this.handleProductsSuccess(response, request.append),
          error: (error) => this.handleProductsError(error),
          complete: () => this.isLoadingState.set(false)
        });

      // Return cleanup function for effect
      return () => subscription.unsubscribe();
    });
  }

  // ============================================================================
  // Pure Functions (Single Responsibility: Data Transformation)
  // ============================================================================

  /**
   * Pure function: Merge unique products from current and fresh lists
   * Responsibility: De-duplicate and combine product arrays
   */
  private mergeUnique(current: Product[], fresh: Product[]): Product[] {
    const existingIds = new Set(current.map(p => p.id));
    const uniqueFresh = fresh.filter(p => !existingIds.has(p.id));
    return [...current, ...uniqueFresh].sort((a, b) => a.id - b.id);
  }

  /**
   * Pure function: Determine if we've reached the end of pagination
   * Responsibility: Pagination logic
   */
  private checkHasReachedEnd(currentLength: number, total: number): boolean {
    return currentLength >= total;
  }


  // ============================================================================
  // Event Handlers (Single Responsibility: State Updates)
  // ============================================================================

  /**
   * Handle successful product fetch
   * Responsibility: Update products and pagination state
   */
  private handleProductsSuccess(
    response: { products: Product[]; total: number },
    append: boolean
  ): void {
    this.totalProductsState.set(response.total);

    const current = this.productsState();
    const newList = append
      ? this.mergeUnique(current, response.products)
      : response.products;

    this.productsState.set(newList);
    this.reachedEndState.set(this.checkHasReachedEnd(newList.length, response.total));
  }

  /**
   * Handle product fetch error
   * Responsibility: Error handling and notification
   */
  private handleProductsError(error: any): void {
    console.error(PRODUCT_MESSAGES.STATUS.ERROR_LOADING, error);
    this.errorState.set(PRODUCT_MESSAGES.STATUS.ERROR_LOADING);
    this.isLoadingState.set(false);
  }

  // ============================================================================
  // Public API (Single Responsibility: Triggering data loads)
  // ============================================================================

  /**
   * Load a batch of products
   * Responsibility: Initiate product loading with pagination parameters
   */
  loadProducts(limit: number, skip: number, append: boolean = true): void {
    if (this.isLoadingState() || (this.reachedEndState() && append)) return;
    this.loadRequestState.set({ limit, skip, append });
  }

  /**
   * Reset pagination state
   * Responsibility: Clear product list and pagination state
   */
  resetPagination(): void {
    this.productsState.set([]);
    this.reachedEndState.set(false);
    this.totalProductsState.set(0);
    this.errorState.set(null);
  }
}
