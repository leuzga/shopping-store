import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface PromoBanner {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  backgroundColor: string;
  cta: string;
  ctaLink: string;
  layout: 'left' | 'right' | 'full';
}

/**
 * PromoBannerComponent - Promotional banner section
 *
 * Responsabilidad única: Display promotional content with image and text
 * - Flexible layout (left image, right image, full width)
 * - Custom background colors
 * - Call-to-action buttons
 * - Responsive design
 *
 * Features:
 * - Signal-based banner input
 * - Multiple layout options
 * - Custom background styling
 * - Mobile-optimized display
 * - Navigation to deals/offers page
 */
@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promo-banner.component.html',
  styleUrl: './promo-banner.component.css',
})
export class PromoBannerComponent {
  readonly banner = input<PromoBanner | null>(null);
  private readonly router = inject(Router);

  /**
   * Event handler: Navigate to promotional deals/offers page
   * Routes to /deals path for special offers and discounts
   */
  onCtaClick(): void {
    this.router.navigate(['/deals']);
  }
}
