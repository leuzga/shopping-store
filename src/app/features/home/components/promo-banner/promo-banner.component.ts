import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
}
