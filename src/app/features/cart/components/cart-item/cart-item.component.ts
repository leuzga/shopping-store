import { Component, input, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '@core/models';
import { CartService } from '../../services/cart.service';
import { CART_MESSAGES } from '@core/constants/messages';

/**
 * CartItemComponent
 * Responsabilidad única: Renderizar un item del carrito con controles de cantidad
 *
 * - Recibe CartItem como input
 * - Emite eventos de actualización de cantidad
 * - Usa CartService para operaciones de cantidad
 * - HTML limpio con @apply directives
 */
@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-item">
      <!-- Product Image -->
      <div class="item-image">
        <img [src]="item().image" [alt]="item().title" />
      </div>

      <!-- Item Details -->
      <div class="item-details">
        <h3 class="item-title">{{ item().title }}</h3>
        <p class="item-price">{{ item().price | currency }}</p>
      </div>

      <!-- Quantity Controls -->
      <div class="quantity-controls">
        <button
          class="quantity-btn"
          (click)="decrementQuantity()"
          [attr.aria-label]="messages.ACTIONS.DECREMENT">
          −
        </button>
        <span class="quantity-value">{{ item().quantity }}</span>
        <button
          class="quantity-btn"
          (click)="incrementQuantity()"
          [attr.aria-label]="messages.ACTIONS.INCREMENT">
          +
        </button>
      </div>

      <!-- Subtotal -->
      <div class="item-subtotal">
        {{ (item().price * item().quantity) | currency }}
      </div>

      <!-- Remove Button -->
      <button
        class="remove-btn"
        (click)="removeFromCart()"
        [attr.aria-label]="messages.ACTIONS.REMOVE_ITEM">
        ✕
      </button>
    </div>
  `,
  styles: [`
    .cart-item {
      @apply flex items-center gap-3 p-3 rounded-lg bg-base-200/50 border border-base-300 transition-all hover:bg-base-200;
    }

    .item-image {
      @apply flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white flex items-center justify-center;
    }

    .item-image img {
      @apply w-full h-full object-contain;
    }

    .item-details {
      @apply flex-1 min-w-0;
    }

    .item-title {
      @apply text-sm font-bold text-base-content line-clamp-2;
    }

    .item-price {
      @apply text-xs text-base-content/60 mt-1;
    }

    .quantity-controls {
      @apply flex items-center gap-2 bg-base-100 rounded-lg p-1 border border-base-300;
    }

    .quantity-btn {
      @apply w-6 h-6 flex items-center justify-center hover:bg-primary hover:text-white transition-colors rounded text-xs font-bold border-none bg-transparent;
    }

    .quantity-value {
      @apply w-8 text-center text-sm font-bold;
    }

    .item-subtotal {
      @apply font-bold text-sm text-primary min-w-fit;
    }

    .remove-btn {
      @apply flex-shrink-0 btn btn-ghost btn-xs text-error hover:bg-error/10 border-none bg-transparent;
    }
  `]
})
export class CartItemComponent {
  private readonly cartService = inject(CartService);

  readonly item = input.required<CartItem>();
  readonly messages = CART_MESSAGES;

  /**
   * Event handler: Increment product quantity
   */
  incrementQuantity(): void {
    this.cartService.incrementQuantity(this.item().id);
  }

  /**
   * Event handler: Decrement product quantity
   */
  decrementQuantity(): void {
    this.cartService.decrementQuantity(this.item().id);
  }

  /**
   * Event handler: Remove product from cart
   */
  removeFromCart(): void {
    this.cartService.removeFromCart(this.item().id);
  }
}
