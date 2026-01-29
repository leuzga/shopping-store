import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  category: string;
}

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
  imports: [CommonModule, RouterLink],
  templateUrl: './category-section.component.html',
  styleUrl: './category-section.component.css',
})
export class CategorySectionComponent {
  readonly section = input<CategorySection | null>(null);
}
