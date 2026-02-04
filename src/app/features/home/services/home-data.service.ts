import { Injectable, signal, effect, inject } from '@angular/core';
import { CategorySection } from '../components/category-section/category-section.component';
import { PromoBanner } from '../components/promo-banner/promo-banner.component';
import { ProductService } from '@features/products/services/product.service';

/**
 * Extended CarouselItem with category filter support
 */
export interface CarouselItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  ctaLink: string;
  categories?: string[];
  discount?: number;
  productId?: number;
  backState?: { returnTo: string; fragment?: string; label?: string };
}

/**
 * HomeDataService - Provides dummy data for home page components
 *
 * Responsabilidad única: Manage carousel items, category sections, and promotional banners
 * - Signal-based data management
 * - Dummy data for initial display
 * - Ready to be replaced with real API calls
 *
 * Features:
 * - Carousel items signal
 * - Category sections signal
 * - Promo banners signal
 */
@Injectable({
  providedIn: 'root',
})
export class HomeDataService {
  private readonly productService = inject(ProductService);

  // Category Sections - Loaded dynamically from API
  readonly categorySections = signal<CategorySection[]>([]);
  readonly isLoadingCategories = signal(false);

  // Trigger signal for initialization
  private readonly initTrigger = signal(true);

  constructor() {
    // Load categories reactively using effect
    effect(() => {
      if (this.initTrigger()) {
        this.loadCategories();
      }
    }, { allowSignalWrites: true });
  }

  /**
   * Load ALL categories from DummyJSON API - Pure function
   * Handles RxJS subscriptions and state updates reactively
   */
  private loadCategories(): void {
    this.isLoadingCategories.set(true);

    this.productService.getCategories().subscribe({
      next: (categories) => {
        if (!categories || categories.length === 0) {
          console.warn('[HomeDataService] No categories found from API');
          this.isLoadingCategories.set(false);
          return;
        }

        this.processCategoriesData(categories);
      },
      error: (error) => {
        console.error('[HomeDataService] Error loading categories', error);
        this.isLoadingCategories.set(false);
      }
    });
  }

  /**
   * Process categories data and fetch products for each category
   * Pure function: transforms API data into CategorySections
   */
  private processCategoriesData(categories: string[]): void {
    const categorySections: CategorySection[] = [];
    let categoryId = 1;
    let loadedCount = 0;

    categories.forEach((categorySlug) => {
      this.productService.getProductsByCategory(categorySlug, 4, 0).subscribe({
        next: (result) => {
          if (result?.products && result.products.length > 0) {
            const categoryName = this.formatCategoryName(categorySlug);

            categorySections.push({
              id: categoryId++,
              categoryName: categoryName,
              categorySlug: categorySlug,
              description: `Explora nuestra colección de ${categoryName.toLowerCase()}`,
              products: result.products
            });
          }

          loadedCount++;

          // Update signal when all categories are loaded
          if (loadedCount === categories.length) {
            this.categorySections.set(categorySections);
            console.log(`[HomeDataService] Loaded ${categorySections.length} categories from API`);
            this.isLoadingCategories.set(false);
          }
        },
        error: (error) => {
          console.warn(`[HomeDataService] Error loading category: ${categorySlug}`, error);
          loadedCount++;

          if (loadedCount === categories.length) {
            this.categorySections.set(categorySections);
            this.isLoadingCategories.set(false);
          }
        }
      });
    });
  }

  // Carousel Items
  readonly carouselItems = signal<CarouselItem[]>([
    {
      id: 1,
      title: 'Tecnología de Última Generación',
      subtitle: 'Explora nuestros productos electrónicos de máxima calidad',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
      cta: 'Ver Electrónica',
      ctaLink: '/products',
      categories: ['laptops', 'smartphones', 'tablets', 'mobile-accessories'],
    },
    {
      id: 2,
      title: 'Belleza y Cuidado Personal',
      subtitle: 'Descubre cosméticos premium para ti',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=80',
      cta: 'Explorar Belleza',
      ctaLink: '/products',
      categories: ['beauty', 'skin-care', 'fragrances'],
    },
    {
      id: 3,
      title: 'Moda de Temporada',
      subtitle: 'Las últimas tendencias en ropa y accesorios',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
      cta: 'Ver Colección',
      ctaLink: '/products',
      categories: [
        'mens-shirts',
        'mens-shoes',
        'mens-watches',
        'womens-dresses',
        'womens-shoes',
        'womens-watches',
        'womens-bags',
        'womens-jewellery',
        'tops',
        'sunglasses'
      ],
    },
  ]);


  /**
   * Format category slug to display name
   * Pure function: converts kebab-case to Title Case
   */
  private formatCategoryName(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Promotional Banners
  readonly promoBanners = signal<PromoBanner[]>([
    {
      id: 1,
      title: 'Descuento Especial 50%',
      subtitle: 'En productos seleccionados de belleza',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
      backgroundColor: '#E91E63',
      cta: 'Comprar Ahora',
      ctaLink: '/products',
      layout: 'right',
    },
    {
      id: 2,
      title: 'Nueva Colección 2024',
      subtitle: 'Moda exclusiva disponible ahora',
      image: 'https://images.pexels.com/photos/3622619/pexels-photo-3622619.jpeg',
      backgroundColor: '#8B3A4B',
      cta: 'Ver Colección',
      ctaLink: '/categories/clothing',
      layout: 'left',
    },
  ]);


  /**
   * Get carousel items
   */
  getCarouselItems() {
    return this.carouselItems();
  }

  /**
   * Get category sections
   */
  getCategorySections() {
    return this.categorySections();
  }

  /**
   * Get promotional banners
   */
  getPromoBanners() {
    return this.promoBanners();
  }

  /**
   * Get carousel categories by category slug
   * Maps category section slugs to their corresponding carousel item categories
   */
  getCategoriesBySlug(slug: string): string[] {
    const item = this.carouselItems().find((item, index) => {
      // Map carousel item index to category slug
      if (index === 0) return slug === 'electronics';
      if (index === 1) return slug === 'beauty';
      if (index === 2) return slug === 'clothing';
      return false;
    });
    return item?.categories || [];
  }
}
