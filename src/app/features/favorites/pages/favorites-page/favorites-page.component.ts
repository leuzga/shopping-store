import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WishlistService } from '@features/products/services/wishlist.service';
import { ProductService } from '@features/products/services/product.service';
import { CartService } from '@features/cart/services/cart.service';
import { NotificationService } from '@core/services';
import { NOTIFICATION_MESSAGES } from '@core/constants';
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
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.css'
})
export class FavoritesPageComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

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
   * Muestra notificación de éxito cuando se agrega un producto
   */
  onAddToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.notificationService.showSuccess(
      NOTIFICATION_MESSAGES.CART.ADD_SUCCESS
    );
  }
}
