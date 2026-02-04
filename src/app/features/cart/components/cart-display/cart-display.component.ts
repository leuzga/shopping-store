import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartPanelService } from '../../services/cart-panel.service';
import { NotificationService } from '@core/services';
import { CartItemComponent } from '../cart-item';
import { CART_MESSAGES, NOTIFICATION_MESSAGES } from '@core/constants/messages';

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
  templateUrl: './cart-display.component.html',
  styleUrl: './cart-display.component.css'
})
export class CartDisplayComponent {
  readonly cartService = inject(CartService);
  readonly cartPanelService = inject(CartPanelService);
  private readonly notificationService = inject(NotificationService);
  readonly messages = CART_MESSAGES;

  // Confirmation dialog state
  readonly isConfirmingClearCart = signal<boolean>(false);

  /**
   * Get total discount amount across all cart items
   * Used to display "Ahorro Total" in cart summary
   */
  getTotalDiscount(): number {
    return this.cartService.getTotalDiscount();
  }

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
   * Muestra notificación de carrito vaciado
   */
  confirmClearCart(): void {
    this.cartService.clearCart();
    this.isConfirmingClearCart.set(false);
    this.notificationService.showSuccess(
      NOTIFICATION_MESSAGES.CART.CLEAR_SUCCESS
    );
  }
}
