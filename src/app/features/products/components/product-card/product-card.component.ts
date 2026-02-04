import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '@core/models';
import { PRODUCT_MESSAGES, NOTIFICATION_MESSAGES } from '@core/constants';
import { AuthService, NotificationService } from '@core/services';
import { WishlistService } from '../../services/wishlist.service';
import { ProductModalService } from '../../services/product-modal.service';
import { DEALS_LABELS } from '../../../deals/constants/deals.constants';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly modalService = inject(ProductModalService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly product = input.required<Product>();
  readonly showAddToCart = input<boolean>(true);
  readonly dealLabel = input<string>(); // Optional deal sticker text (e.g. "-30%")

  /**
   * Discount percentage to display (optional)
   */
  readonly discountPercentage = input<number>();

  /**
   * Custom back navigation state for detail page
   */
  readonly backState = input<{ returnTo: string; fragment?: string; label?: string }>();

  /**
   * Event emitted when adding to cart
   */
  readonly addToCart = output<Product>();

  readonly messages = PRODUCT_MESSAGES.LABELS;
  readonly stars = Array(5).fill(0);
  readonly LABELS = DEALS_LABELS;

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly isFavorite = computed(() => this.wishlistService.isFavorite(this.product().id));

  /**
   * Navigate to product detail
   */
  navigateToDetail(): void {
    const state: any = {};

    if (this.discountPercentage()) {
      state.discountPercentage = this.discountPercentage();
    }

    if (this.backState()) {
      state.backState = this.backState();
    }

    this.router.navigate(['/products', this.product().id], { state });
  }

  /**
   * Event handler: Open reviews modal for current product
   * Delegates to ProductModalService
   */
  onOpenReviews(): void {
    const product = this.product();
    this.modalService.open(product);
  }

  /**
   * Event handler: Toggle product favorite status
   * Muestra notificación de éxito/eliminación según la acción
   */
  toggleFavorite(event: Event): void {
    event.stopPropagation();
    const isFavorite = this.isFavorite();
    this.wishlistService.toggleFavorite(this.product().id);

    if (!isFavorite) {
      this.notificationService.showSuccess(
        NOTIFICATION_MESSAGES.WISHLIST.ADD_SUCCESS
      );
    } else {
      this.notificationService.showSuccess(
        NOTIFICATION_MESSAGES.WISHLIST.REMOVE_SUCCESS
      );
    }
  }
}
