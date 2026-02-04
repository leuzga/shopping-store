import { Product } from '@core/models';

/**
 * Bundle - Represents a curated kit of products sold together
 */
export interface Bundle {
  id: string;
  name: string;
  description: string;
  category: string;
  products: Product[];
  totalPrice: number;
  discountedPrice: number;
  savings: number;
  discountPercentage: number;
  icon: string;
}
