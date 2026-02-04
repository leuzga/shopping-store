import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductRating } from '@core/models';
import { DealProduct } from '../models/deal-product.model';
import { Bundle } from '../models/bundle.model';

export interface DealSection {
  id: number;
  title: string;
  subtitle: string;
  minDiscount: number;
  maxDiscount: number;
  products: DealProduct[];
  icon: string;
  bundles?: Bundle[];
}

@Injectable({ providedIn: 'root' })
export class DealsDataService {
  readonly dealSections = signal<DealSection[]>([]);
  readonly allDeals = signal<DealProduct[]>([]);
  readonly isLoading = signal(false);

  private readonly API_URL = 'https://dummyjson.com/products?limit=100';

  constructor(private http: HttpClient) { }

  /**
   * Load all products from API, enrich with discount data (deals-exclusive)
   * Does NOT modify main Product model - discount only exists here
   */
  async loadDeals(): Promise<void> {
    this.isLoading.set(true);

    try {
      // Fetch raw products from DummyJSON API
      const response = await this.http.get<any>(`${this.API_URL}`).toPromise();
      const rawProducts = response?.products || [];

      // Map raw API data to Product interface using existing pattern
      const products = rawProducts.map((dp: any) => this.mapDummyToProduct(dp));

      // Enrich products with discount data - deals-exclusive enrichment
      const dealProducts = products
        .filter((p: Product) => {
          // Find discount from raw API data for this product
          const raw = rawProducts.find((r: any) => r.id === p.id);
          return raw?.discountPercentage > 0;
        })
        .map((p: Product) => {
          const raw = rawProducts.find((r: any) => r.id === p.id);
          const discount = raw?.discountPercentage || 0;
          return {
            product: p,
            discountPercentage: discount,
            originalPrice: p.price,
            discountedPrice: p.price * (1 - discount / 100)
          } as DealProduct;
        });

      this.allDeals.set(dealProducts);

      // Create creative bundles
      const bundles = this.createCreativeBundles(products);

      // Organize into TWO sections (Flash Sale removed)
      const sections: DealSection[] = [
        {
          id: 1,
          title: 'Ofertas de la Semana',
          subtitle: 'Selección Premium - Renovada Semanalmente',
          minDiscount: 10,
          maxDiscount: 49,
          products: dealProducts.filter((dp: DealProduct) =>
            dp.discountPercentage >= 10 && dp.discountPercentage < 50
          ),
          icon: '🏷️'
        },
        {
          id: 2,
          title: 'Kits y Bundles',
          subtitle: 'Ahorra más comprando en paquete',
          minDiscount: 20,
          maxDiscount: 29,
          products: dealProducts.filter((dp: DealProduct) =>
            dp.discountPercentage >= 20 && dp.discountPercentage < 30
          ),
          icon: '📦',
          bundles: bundles
        }
      ];

      this.dealSections.set(sections);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Create creative bundles by grouping related products
   */
  private createCreativeBundles(products: Product[]): Bundle[] {
    const bundles: Bundle[] = [];

    // 🍳 Kit de Cocina Completo
    const kitchenProducts = products.filter(p =>
      p.category === 'kitchen-accessories' || p.category === 'groceries'
    ).slice(0, 4);
    if (kitchenProducts.length >= 3) {
      bundles.push(this.createBundle(
        'kitchen-bundle',
        "Chef's Essential Bundle",
        'Todo lo que necesitas para tu cocina',
        'kitchen',
        kitchenProducts,
        '🍳',
        25
      ));
    }

    // 💄 Kit de Maquillaje Profesional (was Salon Pro)
    const beautyProducts = products.filter(p =>
      p.category === 'beauty' || p.category === 'skin-care'
    ).slice(0, 4);
    if (beautyProducts.length >= 3) {
      bundles.push(this.createBundle(
        'beauty-bundle',
        'Makeup Artist Kit',
        'Todo lo necesario para un look espectacular',
        'beauty',
        beautyProducts,
        '💄',
        22
      ));
    }

    // ... (Grooming bundle stays same) ...

    // ... (Self care bundle stays same) ...

    // 🎧 Kit de Audio Premium (was Fitness)
    const techProducts = products.filter(p =>
      p.category === 'mobile-accessories'
    ).slice(0, 3);
    if (techProducts.length >= 2) {
      bundles.push(this.createBundle(
        'tech-bundle',
        'Audio Tech Pack',
        'Sonido de alta calidad donde vayas',
        'tech',
        techProducts,
        '🎧',
        26
      ));
    }

    // 🏠 Kit de Decoración del Hogar
    const homeProducts = products.filter(p =>
      p.category === 'home-decoration' || p.category === 'furniture'
    ).slice(0, 4);
    if (homeProducts.length >= 3) {
      bundles.push(this.createBundle(
        'home-bundle',
        'Home Refresh Bundle',
        'Renueva tu espacio con estilo',
        'home',
        homeProducts,
        '🏠',
        23
      ));
    }

    return bundles;
  }

  /**
   * Helper to create a bundle with calculated pricing
   */
  private createBundle(
    id: string,
    name: string,
    description: string,
    category: string,
    products: Product[],
    icon: string,
    discountPercentage: number
  ): Bundle {
    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    const discountedPrice = totalPrice * (1 - discountPercentage / 100);
    const savings = totalPrice - discountedPrice;

    return {
      id,
      name,
      description,
      category,
      products,
      totalPrice,
      discountedPrice,
      savings,
      discountPercentage,
      icon
    };
  }

  /**
   * Map raw DummyJSON product to internal Product interface
   * Replicates logic from ProductService without modification
   */
  private mapDummyToProduct(dj: any): Product {
    return {
      id: dj.id,
      title: dj.title,
      price: dj.price,
      description: dj.description,
      category: dj.category,
      image: dj.thumbnail,
      images: dj.images,
      rating: { rate: dj.rating || 0, count: dj.reviews?.length || 0 } as ProductRating,
      stock: dj.stock,
      brand: dj.brand,
      reviews: dj.reviews || []
    };
  }

  /**
   * Get a bundle by its ID
   * Ensures deals are loaded before searching
   */
  getBundleById(id: string): Observable<Bundle | undefined> {
    // Return observable that ensures data is loaded
    return new Observable(observer => {
      const findBundle = () => {
        const sections = this.dealSections();
        for (const section of sections) {
          if (section.bundles) {
            const bundle = section.bundles.find((b: Bundle) => b.id === id);
            if (bundle) return bundle;
          }
        }
        return undefined;
      };

      // If data already loaded, return immediately
      if (this.allDeals().length > 0) {
        observer.next(findBundle());
        observer.complete();
        return;
      }

      // precise load if not loaded
      this.loadDeals().then(() => {
        observer.next(findBundle());
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }
}
