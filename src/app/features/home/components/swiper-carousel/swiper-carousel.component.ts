import { Component, input, signal, effect, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { CarouselItem } from '../../services/home-data.service';
import { ProductFilterService } from '@features/products/services/product-filter.service';

// Registrar Swiper custom elements
register();

/**
 * SwiperCarouselComponent - Full-width swiper carousel with hero content
 *
 * Responsabilidad única: Display rotating carousel items with gradient background
 * - Swiper carousel with full-width layout
 * - #163550 primary background with blue gradient
 * - Auto-rotating hero content
 * - Call-to-action buttons
 *
 * Features:
 * - Signal-based carousel items input
 * - Signal-based active slide tracking
 * - Responsive full-width design
 * - Smooth transitions with Swiper effects
 * - Touch-friendly navigation
 * - No ngOnInit lifecycle, using effects instead
 */
@Component({
  selector: 'app-swiper-carousel',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './swiper-carousel.component.html',
  styleUrl: './swiper-carousel.component.css',
})
export class SwiperCarouselComponent implements AfterViewInit {
  @ViewChild('swiperContainer', { read: ElementRef }) swiperContainer?: ElementRef;

  readonly items = input<CarouselItem[]>([]);
  readonly activeSlide = signal<number>(0);

  private readonly router = inject(Router);
  private readonly filterService = inject(ProductFilterService);
  private updateTimeout: any;

  constructor() {
    // Track active slide changes using effect
    effect(() => {
      const items = this.items();
      if (items.length > 0) {
        // Effect runs when items change, allows for reactive behavior
        // Trigger update when items change
        this.debouncedUpdateSwiper();
      }
    });
  }

  ngAfterViewInit(): void {
    // Ensure Swiper is ready
    this.updateSwiper();
  }

  onImageLoad(): void {
    // Update Swiper layout when image loads with debounce
    this.debouncedUpdateSwiper();
  }

  private debouncedUpdateSwiper(): void {
    // Clear previous timeout
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    // Debounce the update to avoid too many recalculations
    this.updateTimeout = setTimeout(() => {
      this.updateSwiper();
    }, 100);
  }

  private updateSwiper(): void {
    if (this.swiperContainer) {
      const container = this.swiperContainer.nativeElement as any;
      if (container?.swiper) {
        container.swiper.update();
        container.swiper.updateAutoHeight();
        container.swiper.updateSlides();
      }
    }
  }

  onSlideChange(event: any): void {
    const swiperElement = event.target as any;
    this.activeSlide.set(swiperElement.swiper.activeIndex);

    // Reiniciar animaciones en el nuevo slide
    this.restartAnimations();
  }

  private restartAnimations(): void {
    // Usar requestAnimationFrame para sincronizar con el ciclo de repaint del navegador
    requestAnimationFrame(() => {
      const slides = this.swiperContainer?.nativeElement.querySelectorAll('.hero-slide');
      if (slides && slides.length > 0) {
        const activeSlide = slides[this.activeSlide()];
        if (activeSlide) {
          const animatedElements = [
            activeSlide.querySelector('.hero-title'),
            activeSlide.querySelector('.hero-subtitle'),
            activeSlide.querySelector('.hero-cta')
          ];

          animatedElements.forEach(el => {
            if (el) {
              // Remover clase para detener animación
              el.classList.remove('animate');
              // Forzar reflow - esto obliga al navegador a recalcular estilos
              void el.offsetHeight;
              // Volver a agregar clase para reiniciar animación
              el.classList.add('animate');
            }
          });
        }
      }
    });
  }

  goToSlide(index: number): void {
    const container = this.swiperContainer?.nativeElement as any;
    if (container?.swiper) {
      container.swiper.slideTo(index);
    }
  }

  slidePrev(): void {
    const container = this.swiperContainer?.nativeElement as any;
    if (container?.swiper) {
      container.swiper.slidePrev();
    }
  }

  slideNext(): void {
    const container = this.swiperContainer?.nativeElement as any;
    if (container?.swiper) {
      container.swiper.slideNext();
    }
  }

  scrollToNextSection(): void {
    // Get the current scroll position
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Calculate the target scroll position (scroll down by viewport height)
    const targetScroll = scrollTop + viewportHeight;

    // Smooth scroll to the target position
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }

  navigateToProducts(item: CarouselItem): void {
    // If has productId and discount, navigate to product detail with discount
    if (item.productId && item.discount) {
      this.router.navigate([`/products/${item.productId}`], {
        state: {
          discountPercentage: item.discount,
          backState: item.backState
        }
      });
      return;
    }

    // Otherwise: Apply category filters and navigate to products list
    const hasFilters = item.categories && item.categories.length > 0;

    if (hasFilters) {
      // Clear previous filters and apply new ones
      this.filterService.clearCategories();
      item.categories!.forEach(category => this.filterService.toggleCategory(category));
      this.filterService.applyFilter();
    }

    // Navigate to products page with state indicating initial load size
    this.router.navigate(['/products'], {
      state: { initialLoadSize: hasFilters ? 194 : 20 }
    });
  }
}
