import { Component, effect, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DealsDataService } from '../../services/deals-data.service';
import { DealSectionComponent } from '../../components/deal-section/deal-section.component';
import { SwiperCarouselComponent } from '@features/home/components/swiper-carousel/swiper-carousel.component';
import { CarouselItem } from '@features/home/services/home-data.service';
import { DEALS_LABELS } from '../../constants/deals.constants';

/**
 * DealsPageComponent - Main deals page with carousel and deal sections
 *
 * Responsibility: Display promotional deals organized by discount tier
 * - Carousel of featured deals
 * - Three deal sections: Flash Sale, Weekly Deals, Bundles
 * - Loading and empty states
 * - Modern Angular patterns: signals, effects, inject
 */
@Component({
  selector: 'app-deals-page',
  standalone: true,
  imports: [CommonModule, DealSectionComponent, SwiperCarouselComponent],
  templateUrl: './deals-page.component.html',
  styleUrl: './deals-page.component.css'
})
export class DealsPageComponent {
  readonly dealsService = inject(DealsDataService);

  readonly isVisible = signal(false);
  readonly dealSections = this.dealsService.dealSections;
  readonly allDeals = this.dealsService.allDeals;
  readonly isLoading = this.dealsService.isLoading;

  // Carousel items for featured deals
  readonly carouselItems = signal<CarouselItem[]>([]);

  readonly route = inject(ActivatedRoute);

  constructor() {
    // Scroll to section if fragment is present
    const fragment = toSignal(this.route.fragment);

    effect(() => {
      const frag = fragment();
      const sections = this.dealSections();

      if (frag && sections.length > 0) {
        const targetId = frag === 'bundles' ? 'bundles-section' :
          (frag === 'weekly-deals' ? 'weekly-deals' : null);

        if (targetId) {
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 300);
        }
      }
    });

    // Load deals on component init
    effect(() => {
      this.dealsService.loadDeals();
      setTimeout(() => {
        this.isVisible.set(true);
      }, 50);
    });

    // Transform all deals into carousel items
    effect(() => {
      const deals = this.allDeals();
      this.carouselItems.set(
        deals.slice(0, 3).map((dealProduct, idx) => {
          const roundedDiscount = Math.round(dealProduct.discountPercentage);
          return {
            id: idx + 1,
            title: dealProduct.product.title,
            subtitle: `${roundedDiscount}% OFF - Limited time`, // Subtitle can stay dynamic
            image: dealProduct.product.image,
            cta: DEALS_LABELS.BUNDLE.VIEW_DETAILS,
            ctaLink: '/products',
            categories: [dealProduct.product.category],
            discount: roundedDiscount,
            productId: dealProduct.product.id,
            backState: { returnTo: '/deals', label: DEALS_LABELS.SECTION.BACK_TO_DEALS }
          };
        })
      );
    });
  }
}
