import { Injectable, computed, signal, inject } from '@angular/core';
import { Order } from '@core/models/order.model';
import { STORAGE_KEYS } from '@core/constants/app.constants';
import { AuthService } from '@core/services/auth.service';

/**
 * OrderFacadeService - Manages order history and persistence
 *
 * Responsibility:
 * - Load/Save orders from/to localStorage
 * - Manage order history state using signals
 * - Filter orders by current user
 */
@Injectable({
  providedIn: 'root'
})
export class OrderFacadeService {
  private readonly authService = inject(AuthService);

  // Private signals for state management
  private readonly ordersSignal = signal<Order[]>(this.loadOrdersFromStorage());
  private readonly selectedOrderIdSignal = signal<string | null>(null);

  // Public read-only signals
  readonly allOrders = this.ordersSignal.asReadonly();

  /**
   * Filter orders for the current user
   */
  readonly userOrders = computed(() => {
    const user = this.authService.user();
    if (!user) return [];

    // In a real app, the API would filter. Here we simulate it.
    // We filter by userId if present, otherwise we show all for the session (simulation)
    return this.ordersSignal().filter(order => !order.userId || order.userId === user.id);
  });

  /**
   * The currently selected order object
   */
  readonly selectedOrder = computed(() => {
    const id = this.selectedOrderIdSignal();
    return id ? this.ordersSignal().find(o => o.id === id) ?? null : null;
  });

  /**
   * Save a new order to history
   */
  saveOrder(order: Order): void {
    const user = this.authService.user();
    const orderWithUser = { ...order, userId: user?.id };

    this.ordersSignal.update(orders => [orderWithUser, ...orders]);
    this.persistOrders();
  }

  /**
   * Set the selected order by ID
   */
  selectOrder(orderId: string | null): void {
    this.selectedOrderIdSignal.set(orderId);
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.selectedOrderIdSignal.set(null);
  }

  /**
   * Persistence logic
   */
  private loadOrdersFromStorage(): Order[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('[OrderFacade] Error loading orders:', error);
      return [];
    }
  }

  private persistOrders(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.ordersSignal()));
    } catch (error) {
      console.error('[OrderFacade] Error persisting orders:', error);
    }
  }
}
