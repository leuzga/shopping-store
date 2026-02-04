import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';

import { SwiperCarouselComponent } from '../../components/swiper-carousel/swiper-carousel.component';
import { CategorySectionComponent } from '../../components/category-section/category-section.component';
import { PromoBannerComponent } from '../../components/promo-banner/promo-banner.component';
import { HomeDataService, CarouselItem } from '../../services/home-data.service';
import { CategorySection } from '../../components/category-section/category-section.component';
import { PromoBanner } from '../../components/promo-banner/promo-banner.component';
import { ProductFacade } from '@features/products/services/product.facade';
import { Product } from '@core/models';

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
  private readonly productFacade = inject(ProductFacade);

  // Signal-based State
  readonly carouselItems = signal<CarouselItem[]>([]);
  readonly categorySections = signal<CategorySection[]>([]);
  readonly promoBanners = signal<PromoBanner[]>([]);
  readonly isVisible = signal(false);

  constructor() {
    // Effect: Sincronizar productos del API con secciones de categoría
    effect(() => {
      const products = this.productFacade.products();

      // Solo procesar si hay productos cargados
      if (products.length > 0) {
        const sections = this.buildCategorySectionsFromProducts(products);
        this.categorySections.set(sections);
      }
    });
  }

  ngOnInit(): void {
    // Load carousel items and promotions from service
    this.carouselItems.set(this.homeDataService.getCarouselItems());
    this.promoBanners.set(this.homeDataService.getPromoBanners());

    // Load all products from API (194 total) - una sola vez
    this.productFacade.loadProducts(194, 0);

    // Trigger fade-in animation after component is rendered
    setTimeout(() => {
      this.isVisible.set(true);
    }, 50);
  }

  /**
   * Pure function: Agrupa productos por categoría
   * Responsabilidad única: Transformar array plano a Map categorizado
   */
  private groupProductsByCategory(products: Product[]): Map<string, Product[]> {
    const grouped = new Map<string, Product[]>();
    products.forEach(product => {
      const category = product.category;
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(product);
    });
    return grouped;
  }

  /**
   * Pure function: Selecciona productos aleatorios
   * Responsabilidad única: Mezclar y retornar N elementos
   */
  private getRandomProducts(products: Product[], count: number): Product[] {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, products.length));
  }

  /**
   * Pure function: Construye sección de categoría
   * Responsabilidad única: Crear estructura CategorySection
   */
  private buildCategorySection(
    id: number,
    categoryName: string,
    categorySlug: string,
    description: string,
    products: Product[]
  ): CategorySection {
    return {
      id,
      categoryName,
      categorySlug,
      description,
      products
    };
  }

  /**
   * Orquesta la construcción de secciones desde productos reales del API
   * Responsabilidad única: Coordinar transformaciones puras
   */
  private buildCategorySectionsFromProducts(products: Product[]): CategorySection[] {
    const grouped = this.groupProductsByCategory(products);
    const sections: CategorySection[] = [];

    // Mapeando categorías reales del API a secciones de Home
    const categoryMappings = [
      {
        id: 1,
        categoryKeys: ['laptops', 'smartphones', 'tablets', 'mobile-accessories'],
        name: 'Electrónica',
        slug: 'electronics',
        description: 'Última tecnología en dispositivos electrónicos',
      },
      {
        id: 2,
        categoryKeys: ['beauty', 'skin-care', 'fragrances'],
        name: 'Belleza',
        slug: 'beauty',
        description: 'Productos de belleza y cuidado personal',
      },
      {
        id: 3,
        categoryKeys: ['mens-shirts', 'mens-shoes', 'mens-watches', 'womens-dresses', 'womens-shoes', 'womens-watches', 'womens-bags', 'womens-jewellery', 'tops', 'sunglasses', 'sports-accessories'],
        name: 'Moda',
        slug: 'clothing',
        description: 'Ropa y accesorios de moda',
      },
    ];

    // Construir secciones con productos random de cada categoría
    categoryMappings.forEach(mapping => {
      // Agregar todos los productos que coincidan con cualquiera de las subcategorías
      const categoryProducts = mapping.categoryKeys.flatMap(key => grouped.get(key) || []);

      if (categoryProducts.length > 0) {
        // Mostrar máximo 4 productos por sección (random)
        const selectedProducts = this.getRandomProducts(categoryProducts, 4);
        const section = this.buildCategorySection(
          mapping.id,
          mapping.name,
          mapping.slug,
          mapping.description,
          selectedProducts
        );
        sections.push(section);
      }
    });

    return sections;
  }
}
