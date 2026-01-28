import { Component, input, inject } from '@angular/core';
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
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
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
