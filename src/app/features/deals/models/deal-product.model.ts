import { Product } from '@core/models';

/**
 * DealProduct - Product enriched with discount information
 * Used exclusively within the deals module
 * Does NOT extend Product interface to maintain data isolation
 */
export interface DealProduct {
  readonly product: Product;
  readonly discountPercentage: number;
  readonly originalPrice: number;
  readonly discountedPrice: number;
}
