import { Component, computed, effect, signal, HostListener, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { CartService } from '@features/cart/services/cart.service';
import { CartPanelService } from '@features/cart/services/cart-panel.service';
import { ProductSearchService } from '@features/products/services/product-search.service';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@features/user/services/user.service';
import { DEBOUNCE_TIME } from '@core/constants/app.constants';
import { AUTH_MESSAGES } from '@core/constants/messages/auth.messages';
import { WishlistService } from '@features/products/services/wishlist.service';

/**
 * TopBarComponent - Main navigation bar for the shopping store
 *
 * Features:
 * - Responsive hamburger menu
 * - Logo and brand name
 * - Search bar with debounced input
 * - User menu dropdown
 * - Shopping cart with item count badge and total
 *
 * Uses Angular 19 modern patterns:
 * - Signals for reactive state
 * - inject() instead of constructor
 * - toSignal() for RxJS integration
 * - effect() for side effects
 */
@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  // Service injection using inject() function (no constructor)
  private readonly cartService = inject(CartService);
  private readonly cartPanelService = inject(CartPanelService);
  readonly searchService = inject(ProductSearchService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);

  // Message constants
  readonly authMessages = AUTH_MESSAGES;

  // Local UI state signals
  readonly searchQuery = signal<string>('');
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly isSearchFocused = signal<boolean>(false);
  readonly isScrolled = signal<boolean>(false);

  constructor() {
    // Sync local query with service query (bidirectional-ish)
    effect(() => {
      const serviceQuery = this.searchService.query();
      // Solo actualizamos si es diferente para evitar loops, aunque signals ya lo manejan
      untracked(() => {
        if (this.searchQuery() !== serviceQuery) {
          console.log('[TopBar] Syncing from service:', serviceQuery);
          this.searchQuery.set(serviceQuery);
        }
      });
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  // Computed signals derived from cart service
  readonly cartCount = computed(() => this.cartService.totalItems());
  readonly cartTotal = computed(() => this.cartService.totalPrice());
  readonly hasItemsInCart = computed(() => this.cartCount() > 0);
  readonly cartItems = computed(() => this.cartService.items());

  // Computed signals derived from wishlist service
  readonly favoriteCount = computed(() => this.wishlistService.count());
  readonly hasFavorites = computed(() => this.favoriteCount() > 0);

  // Auth state
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly currentUser = computed(() => this.authService.user());
  readonly userDisplayName = computed(() => this.authService.userDisplayName());

  // User initial for avatar (functional computation)
  readonly userInitial = computed(() => {
    const name = this.userDisplayName();
    if (!name || name.length === 0) return 'U';
    return name.charAt(0).toUpperCase();
  });

  // User avatar from localStorage or user profile
  readonly userAvatar = computed(() => {
    const user = this.currentUser();
    if (!user) return null;

    // Intentar obtener del localStorage primero
    const localStorageAvatar = this.userService.getAvatarFromLocalStorage(user.id);
    if (localStorageAvatar) return localStorageAvatar;

    // Si no hay en localStorage, obtener del usuario si existe
    return user.avatar || null;
  });

  // Manual search trigger only

  // No automatic effect for search - user must trigger manually

  /**
   * Handle search input changes
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    console.log('[TopBar] Input:', target.value);
    this.searchQuery.set(target.value);
  }

  /**
   * Handle search form submission
   */
  onSearchSubmit(): void {
    const query = this.searchQuery();
    console.log('[TopBar] Submit:', query);
    if (query.trim()) {
      this.searchService.performSearch(query);
      // Navigate to products page to show filtered results
      this.router.navigate(['/products']);
    }
  }

  /**
   * Toggle mobile menu visibility
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  /**
   * Handle search input focus
   */
  onSearchFocus(): void {
    this.isSearchFocused.set(true);
  }

  /**
   * Handle search input blur
   */
  onSearchBlur(): void {
    this.isSearchFocused.set(false);
  }

  /**
   * Clear search input and results
   */
  clearSearch(): void {
    this.searchQuery.set('');
    this.searchService.clearSearch();
  }

  /**
   * Handle logout action
   */
  onLogout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }

  /**
   * Event handler: Open cart panel
   */
  onOpenCart(): void {
    this.cartPanelService.open();
  }
}
