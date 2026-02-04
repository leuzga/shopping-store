import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductCardComponent } from '@features/products/components/product-card/product-card.component';
import { Product } from '@core/models';
import { NOTIFICATION_MESSAGES } from '@core/constants';
import { NotificationService } from '@core/services';
import { ProductFilterService } from '@features/products/services/product-filter.service';
import { HomeDataService } from '../../services/home-data.service';

export interface CategorySection {
  id: number;
  categoryName: string;
  categorySlug: string;
  description: string;
  products: Product[];
}

/**
 * CategorySectionComponent - Display products grouped by category
 *
 * Responsabilidad única: Show product cards for a specific category
 * - Responsive grid layout (1-4 columns)
 * - Product cards with images, prices, ratings
 * - View all button for category navigation
 * - Category title and description
 *
 * Features:
 * - Signal-based category section input
 * - Responsive product grid
 * - Product card styling
 * - View all category link
 */
@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './category-section.component.html',
  styleUrl: './category-section.component.css',
})
export class CategorySectionComponent {
  readonly section = input<CategorySection | null>(null);
  private readonly notificationService = inject(NotificationService);
  private readonly filterService = inject(ProductFilterService);
  private readonly router = inject(Router);
  private readonly homeDataService = inject(HomeDataService);

  /**
   * Event handler: Navigate to products with category filters applied
   * Applies the same filters as carousel buttons for consistent navigation
   */
  onViewAllCategory(): void {
    const slug = this.section()?.categorySlug;
    if (!slug) return;

    // Get the correct categories for this section from carousel items
    const categories = this.homeDataService.getCategoriesBySlug(slug);
    const hasCategories = categories && categories.length > 0;

    if (hasCategories) {
      this.filterService.clearCategories();
      categories.forEach(cat => this.filterService.toggleCategory(cat));
      this.filterService.applyFilter();
    }

    this.router.navigate(['/products'], {
      state: { initialLoadSize: hasCategories ? 194 : 20 }
    });
  }

  /**
   * Event handler: Add product to cart
   * Muestra notificación de éxito cuando se hace click en "Ver Detalles"
   */
  onAddToCart(product: Product): void {
    this.notificationService.showSuccess(
      `"${product.title}" agregado a favoritos`
    );
  }
}
