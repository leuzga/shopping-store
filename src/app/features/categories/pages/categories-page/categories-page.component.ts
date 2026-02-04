import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HomeDataService } from '@features/home/services/home-data.service';
import { ProductFilterService } from '@features/products/services/product-filter.service';

/**
 * CategoriesPageComponent - Custom Masonry Layout with Predefined Sizes
 *
 * Responsabilidad única: Display categories in true masonry grid
 * - Predefined category sizes matching reference image design
 * - Custom sizing: mens-shirts, laptops, motorcycle, womens-bags, mens-shoes get specific sizes
 * - Masonry grid with dense packing eliminates gaps
 * - Modern Angular: Signals, no automatic detection needed
 */
@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css',
})
export class CategoriesPageComponent {
  private readonly homeDataService = inject(HomeDataService);
  private readonly filterService = inject(ProductFilterService);
  private readonly router = inject(Router);

  // Signal-based state
  readonly isVisible = signal(false);
  readonly categorySections = this.homeDataService.categorySections;

  /**
   * Predefined category size mapping based on reference image
   * Size 0 = Wide (2x1) - col-span-2
   * Size 1 = Square (1x1) - col-span-1
   * Size 2 = Tall (1x2) - col-span-1 row-span-2
   * Size 3 = Extra Large (2x2) - col-span-2 row-span-2
   */
  private readonly CATEGORY_SIZE_MAP: Record<string, number> = {
    // Large square boxes (2x2)
    'laptops': 3,
    'mens-shirts': 3,
    'mens-shoes': 3,
    'vehicle': 3,
    'tops': 3,              // Changed: now large square
    'beauty': 3,            // Changed: enlarged container to prevent cropping
    'womens-shoes': 3,      // Changed: large square to prevent cropping

    // Rectangular boxes (2x1 wide)
    'motorcycle': 0,
    'sunglasses': 0,
    'groceries': 0,         // Changed: now rectangular

    // Tall boxes (1x2 vertical)
    'womens-dresses': 2,
    'smartphones': 2,
    'mens-watches': 2,      // Changed: now vertical rectangle
    'skin-care': 2,         // Changed: now vertical rectangle
    'tablets': 2,           // Changed: now vertical rectangle

    // Square boxes (1x1) - smaller for detailed items
    'fragrances': 1,        // Kept small to prevent cropping
    'furniture': 1,
    'home-decoration': 1,
    'kitchen-accessories': 1,
    'mobile-accessories': 1,
    'sports-accessories': 1,
    'womens-jewellery': 1,  // Kept small to prevent cropping
    'womens-bags': 1,       // Changed: smaller to prevent cropping
    'womens-watches': 1,
  };

  constructor() {
    // Trigger fade-in animation when categories load
    effect(() => {
      const categories = this.categorySections();
      if (categories.length > 0) {
        setTimeout(() => {
          this.isVisible.set(true);
        }, 50);
      }
    }, { allowSignalWrites: true });
  }

  /**
   * Get card size for a category (0=wide, 1=square, 2=tall, 3=extra-large)
   * Returns predefined size from mapping, defaults to square (1) if not found
   */
  getCardSize(categorySlug: string): number {
    return this.CATEGORY_SIZE_MAP[categorySlug] ?? 1;
  }

  /**
   * Navigate to specific category with filters applied
   * Pure function - no side effects on component state
   */
  navigateToCategory(categorySlug: string, categoryName: string): void {
    // Clear and set category filter
    this.filterService.clearCategories();
    this.filterService.toggleCategory(categoryName.toLowerCase());
    this.filterService.applyFilter();

    // Navigate to products page
    this.router.navigate(['/products']);
  }

  /**
   * Get first product image from category
   * Pure function - derives visual from category data
   */
  getCategoryImage(categorySlug: string): string {
    const section = this.categorySections().find(c => c.categorySlug === categorySlug);
    return section?.products[0]?.image ?? 'https://via.placeholder.com/400x400?text=No+Image';
  }
}
