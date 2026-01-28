import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '@core/models';
import { PRODUCT_MESSAGES } from '@core/constants';
import { AuthService } from '@core/services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductModalService } from '../../services/product-modal.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="product-card group">
      <!-- Badge Category -->
      <div class="product-badge bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 text-xs font-medium rounded-none absolute top-2 left-2">
        {{ product().category }}
      </div>

      <!-- Favorite Toggle -->
      @if (isAuthenticated()) {
        <button
          class="favorite-btn absolute top-2 right-2 p-1 bg-white/80 hover:bg-white transition-colors rounded-full border-none cursor-pointer"
          [class.is-favorite]="isFavorite()"
          (click)="toggleFavorite($event)"
          aria-label="Toggle favorite">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" [attr.fill]="isFavorite() ? '#f59e0b' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      }

      <!-- Product Image -->
      <figure class="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer" (click)="navigateToDetail()">
        <img
          [src]="product().image"
          [alt]="product().title"
          class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-102" />
      </figure>

      <!-- Card Body -->
      <div class="p-4">
        <h2 class="font-sans font-semibold text-lg text-gray-800 truncate" [title]="product().title">
          {{ product().title }}
        </h2>

        <p class="text-sm text-gray-600 mt-1 line-clamp-2">
          {{ product().description }}
        </p>

        <!-- Rating & Price -->
        <div class="flex justify-between items-center mt-3">
          <div class="flex items-center gap-1">
            <div class="rating rating-sm">
              @for (star of stars; track $index) {
                <input type="radio" name="rating-{{ product().id }}" class="mask mask-star-2" [checked]="$index + 1 <= product().rating.rate" disabled />
              }
            </div>
            <span class="text-xs text-gray-500 ml-1">({{ product().rating.count }})</span>
          </div>
          <div class="font-bold text-lg text-gray-900">
            {{ product().price | currency }}
          </div>
        </div>

        <!-- Add to Cart Button -->
        <button
          class="w-full mt-4 py-2 px-4 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 border border-indigo-200 rounded-none hover:bg-indigo-100 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          (click)="addToCart.emit(product())">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {{ messages.ADD_TO_CART }}
        </button>
      </div>
    </div>

  `,
  styles: [`
      .product-card {
      background: white;
      border-radius: 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }

    .favorite-btn.is-favorite svg {
      color: #f59e0b;
    }

    /* DaisyUI rating override */
    .rating input[type="radio"].mask-star-2 {
      -webkit-mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M12 .288l2.833 8.718h9.167l-7.417 5.389 2.833 8.718-7.416-5.388-7.417 5.388 2.833-8.718-7.416-5.389h9.167z'/%3e%3c/svg%3e");
      mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M12 .288l2.833 8.718h9.167l-7.417 5.389 2.833 8.718-7.416-5.388-7.417 5.388 2.833-8.718-7.416-5.389h9.167z'/%3e%3c/svg%3e");
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductCardComponent {
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly modalService = inject(ProductModalService);
  private readonly router = inject(Router);

  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  readonly messages = PRODUCT_MESSAGES.LABELS;
  readonly stars = Array(5).fill(0);

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly isFavorite = computed(() => this.wishlistService.isFavorite(this.product().id));

  /**
   * Event handler: Navigate to product detail page
   * Routes to /products/:id when image is clicked
   */
  navigateToDetail(): void {
    this.router.navigate(['/products', this.product().id]);
  }

  /**
   * Event handler: Open reviews modal for current product
   * Delegates to ProductModalService
   */
  onOpenReviews(): void {
    this.modalService.open(this.product());
  }

  /**
   * Event handler: Toggle product favorite status
   */
  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggleFavorite(this.product().id);
  }
}
