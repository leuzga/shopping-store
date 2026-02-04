import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Bundle } from '../../models/bundle.model';
import { DEALS_LABELS } from '../../constants/deals.constants';

/**
 * BundleCardComponent - Display a product bundle/kit with minimalist design
 *
 * Responsibility: Show bundle information and allow navigation to details
 * - Display bundle name, description, and icon
 * - Show product images from the bundle
 * - Display pricing with savings calculation
 * - Navigate to detail page when clicked
 */
@Component({
  selector: 'app-bundle-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bundle-card.component.html',
  styleUrl: './bundle-card.component.css'
})
export class BundleCardComponent {
  private readonly router = inject(Router);

  readonly bundle = input.required<Bundle>();
  readonly LABELS = DEALS_LABELS;

  /**
   * Navigate to bundle detail page
   */
  onViewDetails(): void {
    this.router.navigate(['/deals/bundle', this.bundle().id]);
  }
}

