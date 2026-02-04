import { Component, inject, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { DealsDataService } from '../../services/deals-data.service';
import { ProductCardComponent } from '@features/products/components/product-card/product-card.component';
import { DEALS_LABELS } from '../../constants/deals.constants';
import { Bundle } from '../../models/bundle.model';
import { CartService } from '@features/cart/services/cart.service';
import { NotificationService } from '@core/services';
import { Product } from '@core/models';

@Component({
  selector: 'app-bundle-detail-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './bundle-detail-page.component.html',
  styleUrl: './bundle-detail-page.component.css'
})
export class BundleDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly dealsService = inject(DealsDataService);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  readonly LABELS = DEALS_LABELS;

  /**
   * Resolve the bundle from the route 'id' parameter
   * Uses switchMap to handle id changes
   */
  readonly bundle = toSignal<Bundle | undefined>(
    this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.dealsService.getBundleById(id))
    )
  );

  /**
   * Computed flag to check if bundle is loading or not found
   */
  readonly isLoading = computed(() => !this.bundle());

  /**
   * Go back to deals page
   */
  goBack(): void {
    this.router.navigate(['/deals'], { fragment: 'bundles' });
  }

  /**
   * Add the entire bundle to cart
   * Iterates through all products in the bundle and adds them
   */
  onAddBundleToCart(): void {
    const currentBundle = this.bundle();
    if (!currentBundle) return;

    // Apply the discount to each item
    currentBundle.products.forEach(product => {
      this.cartService.addToCart(product, 1, currentBundle.discountPercentage);
    });

    this.notificationService.showSuccess(
      `Bundle "${currentBundle.name}" agregado al carrito`
    );
  }

  /**
   * Navigate to specific product detail
   * Maintains the context of the deal discount
   */
  onViewProduct(product: Product): void {
    const currentBundle = this.bundle();
    const discount = currentBundle ? currentBundle.discountPercentage : 0;

    this.router.navigate(['/products', product.id], {
      state: { discountPercentage: discount }
    });
  }
}
