import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, PaginatedResponse } from '@core/models';
import { API_ENDPOINTS } from '@core/constants';

/**
 * Pure mapping functions (Single Responsibility)
 */
const mapDummyToProduct = (dj: any): Product => ({
  id: dj.id,
  title: dj.title,
  price: dj.price,
  description: dj.description,
  category: dj.category,
  image: dj.thumbnail,
  images: dj.images,
  rating: {
    rate: dj.rating || 0,
    count: dj.reviews?.length || 0
  },
  stock: dj.stock,
  brand: dj.brand,
  reviews: dj.reviews || []
});

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);

  /**
   * Fetch products with real limit and skip
   */
  getProducts(limit: number = 20, skip: number = 0): Observable<{ products: Product[], total: number }> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    return this.http.get<PaginatedResponse<any>>(API_ENDPOINTS.PRODUCTS, { params }).pipe(
      map((res: PaginatedResponse<any>) => ({
        total: res.total,
        products: res.products.map(mapDummyToProduct)
      }))
    );
  }

  /**
   * Get a single product by ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(API_ENDPOINTS.PRODUCT_BY_ID(id)).pipe(
      map(mapDummyToProduct)
    );
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(API_ENDPOINTS.CATEGORIES);
  }

  /**
   * Get products by category with limit and skip
   */
  getProductsByCategory(category: string, limit: number = 20, skip: number = 0): Observable<{ products: Product[], total: number }> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    return this.http.get<PaginatedResponse<any>>(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category), { params }).pipe(
      map((res: PaginatedResponse<any>) => ({
        total: res.total,
        products: res.products.map(mapDummyToProduct)
      }))
    );
  }
}
