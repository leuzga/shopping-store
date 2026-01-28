export interface Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
  readonly image: string; // Mapped from thumbnail
  readonly images?: string[];
  readonly rating: ProductRating;
  readonly stock?: number;
  readonly brand?: string;
  readonly reviews?: Review[];
}

export interface Review {
  readonly rating: number;
  readonly comment: string;
  readonly date: string;
  readonly reviewerName: string;
  readonly reviewerEmail: string;
}

export interface ProductRating {
  readonly rate: number;
  readonly count: number;
}

/**
 * Product filter options for search/listing
 */
export interface ProductFilter {
  readonly category?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly minRating?: number;
  readonly sortBy?: ProductSortOption;
  readonly sortOrder?: 'asc' | 'desc';
}

export type ProductSortOption = 'price' | 'rating' | 'title';

/**
 * Product category
 */
export type ProductCategory =
  | 'electronics'
  | 'jewelery'
  | "men's clothing"
  | "women's clothing";
