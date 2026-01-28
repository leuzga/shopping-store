import {
  Component,
  inject,
  signal,
  computed,
  effect,
  OnInit,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Product } from '@core/models';
import { ProductService } from '../../services/product.service';
import { CartService } from '@features/cart/services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '@core/services/auth.service';
import { PRODUCT_MESSAGES } from '@core/constants';

import { ProductGalleryComponent } from '../../components/product-gallery/product-gallery.component';

/**
 * ProductDetailPageComponent - Display detailed product information
 *
 * Responsabilidad única: Show comprehensive product details with:
 * - Image gallery with thumbnail selector
 * - Product specifications and information
 * - Cart and wishlist functionality
 * - Quantity selection
 * - Navigation back to product list
 *
 * Features:
 * - Signal-based state management
 * - Reactive image gallery
 * - Quantity bounds checking (min: 1, max: stock)
 * - Add to cart with quantity
 * - Add to favorites with auth check
 * - Back navigation with fallback
 */
@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductGalleryComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css',
})
export class ProductDetailPageComponent implements OnInit {
  // Services Injection
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);

  // Constants
  readonly messages = PRODUCT_MESSAGES;

  // ============================================================================
  // Signal-Based State Management
  // ============================================================================

  /**
   * Product data loaded from API via toSignal
   * Subscribes to route params changes and loads product automatically
   * Works correctly when navigating between different product IDs
   */
  readonly product = toSignal<Product | null>(
    this.route.params.pipe(
      map(params => Number(params['id'])),
      filter((id: number) => id > 0),
      switchMap((id: number) => this.productService.getProductById(id))
    ) as Observable<Product>,
    { initialValue: null }
  );

  /**
   * Currently selected image for display
   * Updated when user clicks thumbnail
   */
  readonly selectedImage = signal<string>('');

  /**
   * Quantity selector state
   * Starts at 1, respects stock limits
   */
  readonly quantity = signal<number>(1);

  /**
   * Loading state for product fetch
   */
  readonly isLoading = computed(() => this.product() === null);

  /**
   * Error state for display
   */
  readonly error = signal<string | null>(null);

  // ============================================================================
  // Computed Signals (Derived State)
  // ============================================================================

  /**
   * Safe gallery images array
   * Returns Product.images[] if populated, fallback to single image
   * API always populates via mapDummyToProduct
   * Ensures array contains only valid string URLs
   */
  readonly galleryImages = computed((): string[] => {
    const product = this.product();
    if (!product) return [];
    const images = (product.images ?? []).filter((img): img is string => Boolean(img));
    return images.length > 0 ? images : (product.image ? [product.image] : []);
  });

  /**
   * Wishlist status for current product
   */
  readonly isFavorite = computed(() =>
    this.wishlistService.isFavorite(this.product()?.id ?? 0)
  );

  /**
   * Authentication status
   */
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  /**
   * Check if product is in cart
   */
  readonly isProductInCart = computed(() =>
    this.cartService.isProductInCart(this.product()?.id ?? 0)
  );

  /**
   * Available stock for current product
   */
  readonly availableStock = computed(
    () => this.product()?.stock ?? 999
  );

  /**
   * Check if increment button should be disabled
   */
  readonly canIncrement = computed(
    () => this.quantity() < this.availableStock()
  );

  /**
   * Check if decrement button should be disabled
   */
  readonly canDecrement = computed(() => this.quantity() > 1);

  // ============================================================================
  // Lifecycle & Effects
  // ============================================================================

  constructor() {
    // Initialize selected image when product/gallery images load or change
    effect(() => {
      const images = this.galleryImages();
      if (images.length > 0) {
        this.selectedImage.set(images[0]);
      }
    });

    // Reset quantity when changing products
    effect(() => {
      const product = this.product();
      if (product) {
        this.quantity.set(1);
      }
    });
  }

  ngOnInit(): void {
    // Lifecycle hook for any additional initialization if needed
  }

  // ============================================================================
  // Event Handlers (Single Responsibility: User Actions)
  // ============================================================================

  /**
   * Handle image selection from gallery
   * Updates selectedImage signal reactively
   */
  onSelectImage(imageUrl: string): void {
    this.selectedImage.set(imageUrl);
  }

  /**
   * Increment quantity with stock limit check
   */
  incrementQuantity(): void {
    if (this.canIncrement()) {
      this.quantity.update((q) => q + 1);
    }
  }

  /**
   * Decrement quantity with minimum bound check
   */
  decrementQuantity(): void {
    if (this.canDecrement()) {
      this.quantity.update((q) => q - 1);
    }
  }

  /**
   * Add product to cart with selected quantity
   * Respects existing cart item quantities (service handles merge)
   */
  onAddToCart(): void {
    const product = this.product();
    const qty = this.quantity();

    if (!product) return;

    this.cartService.addToCart(product, qty);
    // Could add success toast/notification here
  }

  /**
   * Toggle product in wishlist
   * Redirects to login if not authenticated
   */
  onToggleFavorite(): void {
    const productId = this.product()?.id;

    if (!productId) return;

    if (!this.isAuthenticated()) {
      this.router.navigateByUrl(
        `/login?returnUrl=/products/${productId}`
      );
      return;
    }

    this.wishlistService.toggleFavorite(productId);
  }

  /**
   * Navigate back to product list
   * Uses browser history, fallback to /products if no history
   */
  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/products');
    }
  }
}
