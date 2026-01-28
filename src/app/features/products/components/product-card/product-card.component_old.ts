import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
      <div class="product-badge">{{ product().category }}</div>

      <!-- Favorite Toggle (Only for authenticated users) -->
      @if (isAuthenticated()) {
        <button
          class="favorite-btn"
          [class.is-favorite]="isFavorite()"
          (click)="toggleFavorite($event)"
          aria-label="Toggle favorite">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" [attr.fill]="isFavorite() ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      }

      <!-- Product Image -->
      <figure class="product-figure">
        <img
          [src]="product().image"
          [alt]="product().title"
          class="product-img group-hover:scale-105" />
      </figure>

      <!-- Card Body -->
      <div class="product-body">
        <h2 class="product-title" [title]="product().title">
          {{ product().title }}
        </h2>

        <p class="product-description">
          {{ product().description }}
        </p>

        <!-- Rating & Price -->
        <div class="product-info-row">
          <button
            class="product-rating cursor-pointer hover:bg-base-200/50 p-1 rounded-lg transition-colors group/rating border-none bg-transparent"
            (click)="onOpenReviews()"
            [attr.aria-label]="'Ver reseñas de ' + product().title">
            <div class="rating-container">
              @for (star of stars; track $index) {
                <div class="star-mask" [class.opacity-20]="$index + 1 > product().rating.rate"></div>
              }
            </div>
            <span class="text-sm text-base-content/60 font-medium group-hover/rating:text-primary transition-colors">({{ product().rating.count }})</span>
          </button>
          <div class="product-price">{{ product().price | currency }}</div>
        </div>

        <!-- Actions -->
        <div class="product-actions">
          <button class="btn-add-to-cart" (click)="addToCart.emit(product())">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {{ messages.ADD_TO_CART }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      @apply card bg-base-100 shadow-sm border border-base-200 transition-all duration-300 overflow-hidden;
      @apply hover:shadow-xl hover:border-primary/20;
      font-size: 1rem;
    }

    .product-badge {
      @apply badge absolute top-1 right-1 z-10 capitalize border-none shadow-sm font-bold py-3 px-2;
      @apply bg-warning/60 text-primary;
      font-size: 0.9rem;
    }

    .product-figure {
      @apply px-6 pt-6 bg-white flex items-center justify-center h-48 overflow-hidden;
    }

    .product-img {
      @apply h-full w-auto object-contain transition-transform duration-500;
    }

    .product-body {
      @apply card-body p-4 gap-2;
    }

    .product-title {
      @apply card-title font-bold line-clamp-2 h-12 items-start;
      font-size: 1rem;
      line-height: 1.2;
    }

    .product-description {
      @apply text-base-content/60 line-clamp-2 h-12;
      font-size: 1rem;
      line-height: 1.4;
    }

    .product-info-row {
      @apply flex items-center justify-between mt-2;
    }

    .product-rating {
      @apply flex items-center gap-2;
    }

    .rating-container {
      @apply rating rating-half;
    }

    .star-mask {
      @apply mask mask-star-2 bg-warning w-6 h-6;
    }

    .product-price {
      @apply font-black text-primary;
      font-size: 1.1rem;
    }

    .product-actions {
      @apply card-actions mt-2;
    }

    .btn-add-to-cart {
      @apply btn btn-sm btn-block border-none text-white transition-all duration-300 bg-secondary;
      font-size: 1rem;
    }

    .btn-add-to-cart:hover {
      @apply bg-secondary/90 shadow-md scale-[1.02];
    }

    .favorite-btn {
      @apply absolute top-1 left-1 z-20 btn btn-ghost btn-circle btn-sm text-base-content/40 transition-all duration-300;
      @apply hover:bg-transparent hover:text-red-500 hover:scale-110;
    }

    .favorite-btn.is-favorite {
      @apply text-red-500 scale-100;
      filter: drop-shadow(0 0 2px rgba(239, 68, 68, 0.4));
    }
  `]
})
export class ProductCardComponent {
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly modalService = inject(ProductModalService);

  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  readonly messages = PRODUCT_MESSAGES.LABELS;
  readonly stars = Array(5).fill(0);

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly isFavorite = computed(() => this.wishlistService.isFavorite(this.product().id));

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
