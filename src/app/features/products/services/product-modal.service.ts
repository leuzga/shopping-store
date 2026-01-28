import { Injectable, signal, computed } from '@angular/core';
import { Product } from '@core/models';

/**
 * ProductModalService
 * Responsabilidad única: Gestionar el estado de la modal de reseñas de productos
 *
 * Usar Signals para estado reactivo
 * Exponer solo métodos públicos para abrir/cerrar
 * Mantener el estado centralizado en un solo lugar
 */
@Injectable({
  providedIn: 'root'
})
export class ProductModalService {
  // Private state signals
  private readonly selectedProductState = signal<Product | null>(null);
  private readonly isOpenState = signal<boolean>(false);

  // Public read-only signals
  readonly selectedProduct = this.selectedProductState.asReadonly();
  readonly isOpen = this.isOpenState.asReadonly();

  // Computed signals
  readonly hasProduct = computed(() => this.selectedProductState() !== null);

  /**
   * Open modal with specific product
   * Pure function: Just updates the signals
   */
  open(product: Product): void {
    this.selectedProductState.set(product);
    this.isOpenState.set(true);
  }

  /**
   * Close modal and clear selected product
   * Pure function: Just updates the signals
   */
  close(): void {
    this.isOpenState.set(false);
    // Clear product after animation completes (optional, for visual clarity)
    setTimeout(() => {
      this.selectedProductState.set(null);
    }, 300);
  }

  /**
   * Reset modal state completely
   */
  reset(): void {
    this.selectedProductState.set(null);
    this.isOpenState.set(false);
  }
}
