import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartPanelService } from '../../services/cart-panel.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CART_MESSAGES } from '@core/constants/messages';

/**
 * CartDisplayComponent
 * Responsabilidad única: Mostrar panel lateral del carrito con lista de productos
 *
 * - Lee estado de CartService (items, total, isEmpty)
 * - Lee estado de CartPanelService (isOpen)
 * - Renderiza lista de items usando CartItemComponent
 * - Usa @apply directives para CSS limpio
 * - Sin condicionales en template, usa @if para renderización
 */
@Component({
  selector: 'app-cart-display',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  template: `
    @if (cartPanelService.isOpen()) {
      <!-- Cart Panel Backdrop -->
      <div
        class="cart-backdrop"
        (click)="onBackdropClick()"></div>

      <!-- Cart Panel Drawer (side panel) -->
      <div class="cart-panel animate-fade-in">
        <!-- Header -->
        <div class="cart-header">
          <h2 class="cart-title">{{ messages.LABELS.TITLE }}</h2>
          <div class="header-actions">
            @if (!cartService.isEmpty()) {
              <div class="tooltip tooltip-bottom" [attr.data-tip]="messages.ACTIONS.CLEAR_CART">
                <button
                  class="clear-btn"
                  (click)="onClearCart()"
                  [attr.aria-label]="messages.ACTIONS.CLEAR_CART">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            }
            <button
              class="close-btn"
              (click)="cartPanelService.close()"
              aria-label="Close cart panel">
              ✕
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="cart-content">
          @if (cartService.isEmpty()) {
            <div class="empty-state">
              <div class="empty-icon">🛒</div>
              <p class="empty-title">{{ messages.LABELS.EMPTY }}</p>
              <p class="empty-description">{{ messages.DESCRIPTIONS.EMPTY_MESSAGE }}</p>
            </div>
          } @else {
            <div class="items-list">
              @for (item of cartService.items(); track item.id) {
                <app-cart-item [item]="item"></app-cart-item>
              }
            </div>
          }
        </div>

        <!-- Footer Summary -->
        @if (!cartService.isEmpty()) {
          <div class="cart-summary">
            <!-- Free Shipping Badge -->
            <div class="shipping-badge">
              <span class="shipping-icon">🚚</span>
              <span class="shipping-text">{{ messages.DESCRIPTIONS.FREE_SHIPPING }}</span>
            </div>

            <!-- Total -->
            <div class="total-row">
              <span class="total-label">{{ messages.LABELS.TOTAL }}:</span>
              <span class="total-amount">{{ cartService.totalPrice() | currency }}</span>
            </div>
          </div>
        }

        <!-- Actions Footer -->
        <div class="cart-actions">
          <button
            class="btn-continue-shopping"
            (click)="cartPanelService.close()">
            {{ messages.LABELS.CONTINUE_SHOPPING }}
          </button>
          <button
            class="btn-checkout"
            [disabled]="cartService.isEmpty()">
            {{ messages.LABELS.CHECKOUT }}
          </button>
        </div>
      </div>

      <!-- Confirmation Dialog -->
      @if (isConfirmingClearCart()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div class="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-base-200 animate-fade-in">
            <!-- Dialog Title -->
            <h3 class="modal-title">{{ messages.CONFIRMATIONS.CLEAR_CART_TITLE }}</h3>

            <!-- Dialog Message -->
            <p class="dialog-message">
              {{ messages.CONFIRMATIONS.CLEAR_CART_MESSAGE }}
            </p>

            <!-- Dialog Actions -->
            <div class="dialog-actions">
              <button
                class="btn-cancel"
                (click)="cancelClearCart()">
                {{ messages.ACTIONS.CANCEL }}
              </button>
              <button
                class="btn-confirm"
                (click)="confirmClearCart()">
                {{ messages.ACTIONS.CONFIRM }}
              </button>
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    :host {
      @apply contents;
    }

    /* Backdrop overlay */
    .cart-backdrop {
      @apply fixed inset-0 bg-black/50 z-30 animate-fade-in;
    }

    /* Cart panel drawer */
    .cart-panel {
      @apply fixed right-0 top-16 w-full max-w-md bg-base-100 shadow-2xl z-40 flex flex-col border-l border-base-200;
      height: calc(100vh - 4rem);
    }

    /* Header section */
    .cart-header {
      @apply flex justify-between items-center p-4 sm:p-6 border-b border-base-200 bg-base-200/30 flex-shrink-0;
    }

    .cart-title {
      @apply text-xl sm:text-2xl font-black text-base-content;
    }

    .header-actions {
      @apply flex items-center gap-2;
    }

    .clear-btn {
      @apply btn btn-ghost btn-circle btn-sm text-error hover:text-error hover:bg-error/10 border-none bg-transparent;
    }

    .close-btn {
      @apply btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content border-none bg-transparent;
    }

    /* Content section */
    .cart-content {
      @apply flex-1 overflow-y-auto p-4 sm:p-6 space-y-4;
    }

    /* Empty state */
    .empty-state {
      @apply flex flex-col items-center justify-center h-full text-center py-12;
    }

    .empty-icon {
      @apply text-6xl mb-4;
    }

    .empty-title {
      @apply text-lg font-bold text-base-content mb-2;
    }

    .empty-description {
      @apply text-sm text-base-content/60;
    }

    /* Items list */
    .items-list {
      @apply space-y-3;
    }

    /* Summary section */
    .cart-summary {
      @apply p-4 sm:p-6 border-t border-base-200 space-y-4 flex-shrink-0;
    }

    /* Shipping badge */
    .shipping-badge {
      @apply flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20;
    }

    .shipping-icon {
      @apply text-lg;
    }

    .shipping-text {
      @apply text-xs font-bold text-success;
    }

    /* Total row */
    .total-row {
      @apply flex justify-between items-center pt-2;
    }

    .total-label {
      @apply text-sm font-bold text-base-content/70;
    }

    .total-amount {
      @apply text-2xl font-black text-primary;
    }

    /* Actions footer */
    .cart-actions {
      @apply flex gap-3 p-4 sm:p-6 border-t border-base-200 bg-base-200/30 flex-shrink-0;
    }

    .btn-continue-shopping {
      @apply btn btn-ghost btn-sm flex-1 border-none bg-transparent text-base-content;
    }

    .btn-checkout {
      @apply btn btn-secondary btn-sm flex-1 border-none text-white;
    }

    .btn-checkout:disabled {
      @apply opacity-50 cursor-not-allowed;
    }

    /* Scrollbar styling */
    .cart-content::-webkit-scrollbar {
      width: 6px;
    }

    .cart-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .cart-content::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }

    /* Confirmation Dialog Styles */
    .modal-title {
      @apply text-lg sm:text-xl font-black text-base-content mb-3;
    }

    .dialog-message {
      @apply text-sm text-base-content/70 mb-6 leading-relaxed;
    }

    .dialog-actions {
      @apply flex gap-3;
    }

    .btn-cancel {
      @apply btn btn-ghost btn-sm flex-1 border-none bg-transparent text-base-content;
    }

    .btn-confirm {
      @apply btn btn-error btn-sm flex-1 border-none text-white;
    }
  `]
})
export class CartDisplayComponent {
  readonly cartService = inject(CartService);
  readonly cartPanelService = inject(CartPanelService);
  readonly messages = CART_MESSAGES;

  // Confirmation dialog state
  readonly isConfirmingClearCart = signal<boolean>(false);

  /**
   * Event handler: Close panel when clicking backdrop
   */
  onBackdropClick(): void {
    this.cartPanelService.close();
  }

  /**
   * Event handler: Open confirmation dialog for clearing cart
   */
  onClearCart(): void {
    this.isConfirmingClearCart.set(true);
  }

  /**
   * Event handler: Cancel clear cart operation
   */
  cancelClearCart(): void {
    this.isConfirmingClearCart.set(false);
  }

  /**
   * Event handler: Confirm and clear all items from cart
   */
  confirmClearCart(): void {
    this.cartService.clearCart();
    this.isConfirmingClearCart.set(false);
  }
}
