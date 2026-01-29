import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';

import { SwiperCarouselComponent } from '../../components/swiper-carousel/swiper-carousel.component';
import { CategorySectionComponent } from '../../components/category-section/category-section.component';
import { PromoBannerComponent } from '../../components/promo-banner/promo-banner.component';
import { HomeDataService, CarouselItem } from '../../services/home-data.service';
import { CategorySection } from '../../components/category-section/category-section.component';
import { PromoBanner } from '../../components/promo-banner/promo-banner.component';

/**
 * HomePageComponent - Main home page container
 *
 * Responsabilidad única: Orchestrate home page layout with hero, categories, and promos
 * - Hero carousel carousel display
 * - Multiple category sections
 * - Promotional banners between sections
 * - Responsive full-width layout
 *
 * Features:
 * - Signal-based data management
 * - Integrates with HomeDataService
 * - Composable sub-components
 * - Responsive design
 */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    SwiperCarouselComponent,
    CategorySectionComponent,
    PromoBannerComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  // Services Injection
  private readonly homeDataService = inject(HomeDataService);

  // Signal-based State
  readonly carouselItems = signal<CarouselItem[]>([]);
  readonly categorySections = signal<CategorySection[]>([]);
  readonly promoBanners = signal<PromoBanner[]>([]);
  readonly isVisible = signal(false);

  ngOnInit(): void {
    // Load data from service
    this.carouselItems.set(this.homeDataService.getCarouselItems());
    this.categorySections.set(this.homeDataService.getCategorySections());
    this.promoBanners.set(this.homeDataService.getPromoBanners());

    // Trigger fade-in animation after component is rendered
    setTimeout(() => {
      this.isVisible.set(true);
    }, 50);
  }
}
