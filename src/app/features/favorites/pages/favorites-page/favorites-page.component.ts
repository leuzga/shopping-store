import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WishlistService } from '@features/products/services/wishlist.service';
import { ProductService } from '@features/products/services/product.service';
import { CartService } from '@features/cart/services/cart.service';
import { ProductCardComponent } from '@features/products/components/product-card/product-card.component';
import { Product } from '@core/models';

/**
 * FavoritesPageComponent - Display user's favorite products
 *
 * Similar to ProductListComponent but shows only favorited products
 * Allows users to:
 * - View all their favorite products
 * - Remove products from favorites (by clicking heart)
 * - Add products to cart
 *
 * Data Flow:
 * 1. Loads all products from API using ProductService
 * 2. Gets favorite IDs from WishlistService
 * 3. Filters products to show only favorites
 * 4. Updates reactively when favorites change
 */
@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="favorites-container">
      <!-- Header Section -->
      <div class="favorites-header">
        <h1 class="favorites-title">Mis Favoritos</h1>
        @if (displayProducts().length > 0) {
          <span class="favorite-count">{{ displayProducts().length }} producto{{ displayProducts().length !== 1 ? 's' : '' }}</span>
        }
      </div>

      <!-- Empty State -->
      @if (displayProducts().length === 0) {
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h2 class="empty-title">No tienes favoritos</h2>
          <p class="empty-description">Marca productos con el corazón para agregarlos a favoritos</p>
          <a routerLink="/products" class="btn btn-primary btn-lg">
            Explorar Productos
          </a>
        </div>
      }

      <!-- Favorites Grid -->
      @if (displayProducts().length > 0) {
        <div class="favorites-grid">
          @for (product of displayProducts(); track product.id; let index = $index) {
            <app-product-card
              [product]="product"
              (addToCart)="onAddToCart($event)"
              [id]="'favorite-' + index"
              [attr.data-product-index]="index" />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      @apply block h-[calc(100vh-4rem)];
    }

    .favorites-container {
      @apply h-full w-full max-w-7xl mx-auto px-4 py-8 flex flex-col;
    }

    .favorites-header {
      @apply flex items-center justify-between mb-8 gap-4;
    }

    .favorites-title {
      @apply text-3xl md:text-4xl font-bold text-base-content;
    }

    .favorite-count {
      @apply text-sm md:text-base text-base-content/70 font-medium;
    }

    /* Empty State Styles */
    .empty-state {
      @apply flex flex-col items-center justify-center flex-1 py-16 px-4;
    }

    .empty-icon {
      @apply h-24 w-24 text-base-300 mb-4;
    }

    .empty-title {
      @apply text-2xl font-bold text-base-content mb-2;
    }

    .empty-description {
      @apply text-base-content/60 mb-6 text-center;
    }

    /* Grid Styles */
    .favorites-grid {
      @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6;
    }
  `]
})
export class FavoritesPageComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  /**
   * Signal: All products loaded from API
   * Uses toSignal to convert Observable to Signal
   * Maps the response to extract just the products array
   * Loads all products with a large limit to get complete list
   */
  private readonly allProducts = toSignal(
    this.productService.getProducts(10000, 0).pipe(
      map(response => response.products)
    ),
    { initialValue: [] }
  );

  /**
   * Computed signal: Get favorite product IDs
   */
  readonly favoriteIds = computed(() => this.wishlistService.ids());

  /**
   * Computed signal: Filter products by favorite IDs
   * Shows only products that are in the wishlist
   * Updates reactively when favorites change
   */
  readonly displayProducts = computed(() => {
    const favorites = this.favoriteIds();
    const allProducts = this.allProducts();

    // If no favorites, return empty array
    if (favorites.length === 0) {
      return [];
    }

    // Create a Set for O(1) lookup performance
    const favoriteIdSet = new Set(favorites);

    // Filter all products by favorite IDs
    return allProducts.filter(product => favoriteIdSet.has(product.id));
  });

  /**
   * Handle adding product to cart
   */
  onAddToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }
}
