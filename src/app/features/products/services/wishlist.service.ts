import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { StorageService } from '@core/services';
import { STORAGE_KEYS } from '@core/constants';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly storageService = inject(StorageService);
  private readonly STORAGE_KEY: string = STORAGE_KEYS.WISHLIST;

  // Signal to store the list of favorite product IDs
  private readonly favoriteIds = signal<number[]>([]);

  constructor() {
    // Initial load
    const stored = this.storageService.getItem<number[]>(this.STORAGE_KEY);
    this.favoriteIds.set(stored ?? []);

    // Auto-persist favorites when they change
    effect(() => {
      this.storageService.setItem(this.STORAGE_KEY, this.favoriteIds());
    });
  }

  /**
   * Toggle a product in the wishlist (Functional approach)
   */
  toggleFavorite(productId: number): void {
    const current = this.favoriteIds();
    const isFav = current.includes(productId);

    const newList = isFav
      ? current.filter(id => id !== productId)
      : [...current, productId];

    this.favoriteIds.set(newList);
  }

  /**
   * Check if a product is in the wishlist
   */
  isFavorite(productId: number): boolean {
    return this.favoriteIds().includes(productId);
  }

  /**
   * Get the count of favorites
   */
  readonly count = computed(() => this.favoriteIds().length);

  /**
   * Get the list of favorite IDs
   */
  readonly ids = this.favoriteIds.asReadonly();
}
