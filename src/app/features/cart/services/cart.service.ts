import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem, CreateCartItemInput } from '@core/models/cart.model';
import { Product } from '@core/models/product.model';
import { STORAGE_KEYS } from '@core/constants/app.constants';

/**
 * CartService - Signal-based cart state management with localStorage persistence
 *
 * Uses Angular signals for reactive state management and automatic
 * persistence to localStorage via effects.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = STORAGE_KEYS.CART;

  // Private writable signal for cart items
  private readonly cartItems = signal<readonly CartItem[]>(this.loadFromStorage());

  // Public readonly signal exposing cart items
  readonly items = this.cartItems.asReadonly();

  // Computed signals for derived state
  readonly totalItems = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (this.getDiscountedPrice(item) * item.quantity), 0)
  );

  readonly isEmpty = computed(() => this.cartItems().length === 0);

  readonly itemCount = computed(() => this.cartItems().length);

  // Auto-persist to localStorage whenever cart changes
  private readonly persistEffect = effect(() => {
    const items = this.cartItems();
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to persist cart to localStorage:', error);
    }
  });

  /**
   * Load cart items from localStorage
   */
  private loadFromStorage(): readonly CartItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  }

  /**
   * Generate unique cart item ID
   */
  private generateCartItemId(): string {
    return `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get the discounted price of a cart item
   * If no discount, returns the original price
   */
  getDiscountedPrice(cartItem: CartItem): number {
    if (!cartItem.discountPercentage || cartItem.discountPercentage <= 0) {
      return cartItem.price;
    }
    return cartItem.price * (1 - cartItem.discountPercentage / 100);
  }

  /**
   * Get total discount amount across all items with discounts
   * Returns the sum of (original price - discounted price) * quantity
   */
  getTotalDiscount(): number {
    return this.cartItems().reduce((total, item) => {
      if (!item.discountPercentage || item.discountPercentage <= 0) {
        return total;
      }
      const discountAmount = item.price - this.getDiscountedPrice(item);
      return total + (discountAmount * item.quantity);
    }, 0);
  }

  /**
   * Add a product to the cart
   * If the product already exists, increment its quantity
   * Optionally includes discount from deals page
   */
  addToCart(product: Product, quantity: number = 1, discountPercentage?: number): void {
    this.cartItems.update(items => {
      const existingIndex = items.findIndex(item => item.productId === product.id);

      if (existingIndex >= 0) {
        // Update quantity immutably, preserve existing discount
        return items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity, discountPercentage: discountPercentage ?? item.discountPercentage }
            : item
        );
      }

      // Add new item immutably
      const newItem: CartItem = {
        id: this.generateCartItemId(),
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity,
        image: product.image,
        discountPercentage,
      };

      return [...items, newItem];
    });
  }

  /**
   * Remove an item from the cart by its cart item ID
   */
  removeFromCart(cartItemId: string): void {
    this.cartItems.update(items =>
      items.filter(item => item.id !== cartItemId)
    );
  }

  /**
   * Remove an item from the cart by product ID
   */
  removeProductFromCart(productId: number): void {
    this.cartItems.update(items =>
      items.filter(item => item.productId !== productId)
    );
  }

  /**
   * Update the quantity of a cart item
   * Removes the item if quantity is 0 or less
   */
  updateQuantity(cartItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }

    this.cartItems.update(items =>
      items.map(item =>
        item.id === cartItemId
          ? { ...item, quantity }
          : item
      )
    );
  }

  /**
   * Increment the quantity of a cart item by 1
   */
  incrementQuantity(cartItemId: string): void {
    this.cartItems.update(items =>
      items.map(item =>
        item.id === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  /**
   * Decrement the quantity of a cart item by 1
   * Removes the item if quantity becomes 0
   */
  decrementQuantity(cartItemId: string): void {
    const item = this.cartItems().find(i => i.id === cartItemId);

    if (item && item.quantity <= 1) {
      this.removeFromCart(cartItemId);
      return;
    }

    this.cartItems.update(items =>
      items.map(i =>
        i.id === cartItemId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );
  }

  /**
   * Clear all items from the cart
   */
  clearCart(): void {
    this.cartItems.set([]);
  }

  /**
   * Get a cart item by its ID
   */
  getItemById(cartItemId: string): CartItem | undefined {
    return this.cartItems().find(item => item.id === cartItemId);
  }

  /**
   * Check if a product is already in the cart
   */
  isProductInCart(productId: number): boolean {
    return this.cartItems().some(item => item.productId === productId);
  }

  /**
   * Get the quantity of a specific product in the cart
   */
  getProductQuantity(productId: number): number {
    const item = this.cartItems().find(i => i.productId === productId);
    return item?.quantity ?? 0;
  }

  /**
   * Get cart item by product ID
   */
  getCartItemByProductId(productId: number): CartItem | undefined {
    return this.cartItems().find(item => item.productId === productId);
  }
}
