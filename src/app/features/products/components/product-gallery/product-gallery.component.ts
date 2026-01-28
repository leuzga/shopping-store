import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ProductGalleryComponent - Image gallery with thumbnail selector
 *
 * Responsabilidad única: Display product images with interactive thumbnail selection
 *
 * Features:
 * - Large image display
 * - Horizontal thumbnail scroll
 * - Active thumbnail highlighting
 * - Click handler for image selection
 * - Keyboard accessible
 */
@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.css',
})
export class ProductGalleryComponent {
  /**
   * Array of image URLs to display
   * Required input - gallery cannot function without images
   */
  readonly images = input.required<string[]>();

  /**
   * Currently selected image URL
   * Required input - determines which image is displayed large
   */
  readonly selectedImage = input.required<string>();

  /**
   * Product title for alt text and accessibility
   * Required input - ensures proper semantic HTML
   */
  readonly productTitle = input.required<string>();

  /**
   * Emitted when user clicks a thumbnail
   * Payload: selected image URL
   */
  readonly imageSelected = output<string>();

  /**
   * Handle thumbnail click event
   * Pure function: no internal state modifications
   *
   * @param imageUrl - URL of clicked thumbnail
   */
  onThumbnailClick(imageUrl: string): void {
    this.imageSelected.emit(imageUrl);
  }

  /**
   * Check if given image is currently selected
   * Pure function for template conditionals
   *
   * @param imageUrl - URL to check
   * @returns true if image matches selected image
   */
  isSelected(imageUrl: string): boolean {
    return imageUrl === this.selectedImage();
  }
}
