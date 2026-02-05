import { Component, signal, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderFacadeService } from '../../services/order-facade.service';

/**
 * Orders Page Component
 *
 * Responsabilidad única: Página de historial de pedidos
 * - Lista de pedidos previos
 * - Detalle de cada pedido
 * - Sincronizado con localStorage vía OrderFacadeService
 */
@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css'
})
export class OrdersPageComponent {
  private readonly orderFacade = inject(OrderFacadeService);

  readonly isVisible = signal(false);
  readonly orders = this.orderFacade.userOrders;
  readonly selectedOrder = this.orderFacade.selectedOrder;

  constructor() {
    this.initAnimation();
  }

  private initAnimation(): void {
    afterNextRender(() => this.isVisible.set(true));
  }

  onSelectOrder(id: string): void {
    this.orderFacade.selectOrder(id);
  }

  onBackToList(): void {
    this.orderFacade.clearSelection();
  }
}