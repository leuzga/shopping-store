import { Product } from './product.model';

/**
 * Cart item representing a product in the shopping cart
 */
export interface CartItem {
  readonly id: string;
  readonly productId: number;
  readonly title: string;
  readonly price: number;
  readonly quantity: number;
  readonly image: string;
  readonly discountPercentage?: number;
}

/**
 * Cart state interface
 */
export interface CartState {
  readonly items: readonly CartItem[];
  readonly lastUpdated: number;
}

/**
 * Helper type for creating a cart item from a product
 */
export type CreateCartItemInput = Pick<Product, 'id' | 'title' | 'price' | 'image'>;

/**
 * Cart operation result
 */
export interface CartOperationResult {
  readonly success: boolean;
  readonly message?: string;
  readonly item?: CartItem;
}
