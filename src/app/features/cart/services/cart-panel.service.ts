import { Injectable, signal } from '@angular/core';

/**
 * CartPanelService
 * Responsabilidad única: Gestionar estado de apertura/cierre del panel lateral del carrito
 *
 * Usa Signals para reactividad
 * Expone métodos puros: toggle(), open(), close()
 */
@Injectable({
  providedIn: 'root'
})
export class CartPanelService {
  private readonly isOpenState = signal<boolean>(false);

  // Public read-only signal
  readonly isOpen = this.isOpenState.asReadonly();

  /**
   * Toggle the cart panel open/closed state
   */
  toggle(): void {
    this.isOpenState.update(state => !state);
  }

  /**
   * Open the cart panel
   */
  open(): void {
    this.isOpenState.set(true);
  }

  /**
   * Close the cart panel
   */
  close(): void {
    this.isOpenState.set(false);
  }
}
