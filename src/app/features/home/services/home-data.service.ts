import { Injectable, signal } from '@angular/core';
import { CategorySection } from '../components/category-section/category-section.component';
import { PromoBanner } from '../components/promo-banner/promo-banner.component';

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

  // Category Sections
  readonly categorySections = signal<CategorySection[]>([
    {
      id: 1,
      categoryName: 'Electrónica',
      categorySlug: 'electronics',
      description: 'Última tecnología en dispositivos electrónicos',
      products: [
        {
          id: 6,
          title: 'Wireless Headphones',
          price: 99.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
          rating: { rate: 4.3, count: 250 },
          category: 'electronics',
        },
        {
          id: 8,
          title: 'Tablet',
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&q=80',
          rating: { rate: 4.5, count: 320 },
          category: 'electronics',
        },
        {
          id: 9,
          title: 'Smartphone',
          price: 699.99,
          image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&q=80',
          rating: { rate: 4.8, count: 500 },
          category: 'electronics',
        },
        {
          id: 10,
          title: 'Smartwatch',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
          rating: { rate: 4.4, count: 180 },
          category: 'electronics',
        },
      ],
    },
    {
      id: 2,
      categoryName: 'Belleza',
      categorySlug: 'beauty',
      description: 'Productos de belleza y cuidado personal',
      products: [
        {
          id: 1,
          title: 'Essence Mascara Lash Princess',
          price: 9.99,
          image: 'https://images.unsplash.com/photo-1606611013016-969c19d14ce1?w=300&q=80',
          rating: { rate: 4.5, count: 450 },
          category: 'beauty',
        },
        {
          id: 2,
          title: 'Red Lipstick',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1586894797929-aef4fef381b1?w=300&q=80',
          rating: { rate: 4.2, count: 380 },
          category: 'beauty',
        },
        {
          id: 3,
          title: 'Eye Shadow Palette',
          price: 34.99,
          image: 'https://images.unsplash.com/photo-1511214314862-34bbafe34edd?w=300&q=80',
          rating: { rate: 4.6, count: 520 },
          category: 'beauty',
        },
        {
          id: 4,
          title: 'Face Cleanser',
          price: 15.99,
          image: 'https://images.unsplash.com/photo-1596573514060-59ec9bdabe49?w=300&q=80',
          rating: { rate: 4.3, count: 290 },
          category: 'beauty',
        },
      ],
    },
    {
      id: 3,
      categoryName: 'Moda',
      categorySlug: 'clothing',
      description: 'Ropa y accesorios de moda',
      products: [
        {
          id: 11,
          title: 'Slim Fit Jeans',
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1542821956-1c4d760501a2?w=300&q=80',
          rating: { rate: 4.4, count: 380 },
          category: 'clothing',
        },
        {
          id: 12,
          title: 'T-Shirt',
          price: 19.99,
          image: 'https://images.unsplash.com/photo-1488554896566-007d1d784e3e?w=300&q=80',
          rating: { rate: 4.1, count: 200 },
          category: 'clothing',
        },
        {
          id: 13,
          title: 'Hoodie',
          price: 59.99,
          image: 'https://images.unsplash.com/photo-1556994740432-5c8dc1f9de13?w=300&q=80',
          rating: { rate: 4.5, count: 320 },
          category: 'clothing',
        },
        {
          id: 14,
          title: 'Casual Shoes',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&q=80',
          rating: { rate: 4.3, count: 280 },
          category: 'clothing',
        },
      ],
    },
  ]);

  // Promotional Banners
  readonly promoBanners = signal<PromoBanner[]>([
    {
      id: 1,
      title: 'Descuento Especial 50%',
      subtitle: 'En productos seleccionados de belleza',
      image: 'https://images.unsplash.com/photo-1596462502278-af96a14a730d?w=500&q=80',
      backgroundColor: '#E91E63',
      cta: 'Comprar Ahora',
      ctaLink: '/products',
      layout: 'right',
    },
    {
      id: 2,
      title: 'Nueva Colección 2024',
      subtitle: 'Moda exclusiva disponible ahora',
      image: 'https://images.unsplash.com/photo-1445205170230-053b3aff42d5?w=500&q=80',
      backgroundColor: '#2196F3',
      cta: 'Ver Colección',
      ctaLink: '/categories/clothing',
      layout: 'left',
    },
  ]);

  constructor() {}

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
}
