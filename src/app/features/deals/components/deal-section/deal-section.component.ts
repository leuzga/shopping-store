
import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '@core/models';
import { CartService } from '@features/cart/services/cart.service';
import { NotificationService } from '@core/services';
import { ProductCardComponent } from '@features/products/components/product-card/product-card.component';
import { DealSection, DealsDataService } from '../../services/deals-data.service';
import { BundleCardComponent } from '../bundle-card/bundle-card.component';
import { DEALS_LABELS } from '../../constants/deals.constants';

/**
 * DealSectionComponent - Display a section of deals (products or bundles)
 *
 * Responsibility: Display products within a deal category
 * - Show deal header with title, subtitle, and discount range
 * - Display products in responsive grid OR bundles grid
 * - Handle cart additions with notifications
 * - Show empty state when no deals available
 */
@Component({
  selector: 'app-deal-section',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, BundleCardComponent],
  templateUrl: './deal-section.component.html',
  styleUrl: './deal-section.component.css'
})
export class DealSectionComponent {
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  readonly section = input.required<DealSection>();
  readonly LABELS = DEALS_LABELS;

  /**
   * Extract the core Product from DealProduct for ProductCardComponent
   * ProductCard displays the product; discount rendering handled by deal context
   */
  getProduct(dealProduct: any): Product { // Changed type from DealProduct to any as DealProduct import was removed
    return dealProduct.product;
  }

  /**
   * Event handler: Add product to cart
   * Shows success notification when product is added
   */
  onAddToCart(product: Product, discountPercentage?: number): void {
    this.cartService.addToCart(product, 1, discountPercentage);
    this.notificationService.showSuccess(
      `"${product.title}" agregado a carrito`
    );
  }

  /**
   * Helper to round the discount percentage for display
   */
  getRoundedDiscount(percentage: number): number {
    return Math.round(percentage);
  }
}
