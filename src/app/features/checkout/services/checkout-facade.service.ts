import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@features/cart/services/cart.service';
import {
  DiscountCode,
  Order,
  PaymentInfo,
  ShippingAddress,
  ShippingMethod
} from '@core/models/order.model';
import { STORAGE_KEYS } from '@core/constants/app.constants';

export type CheckoutStep = 'review' | 'shipping' | 'payment' | 'confirmation';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFacadeService {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  // Steps state
  private readonly currentStepSignal = signal<CheckoutStep>('review');
  readonly currentStep = this.currentStepSignal.asReadonly();

  // Checkout Data state
  private readonly shippingAddressSignal = signal<ShippingAddress | null>(null);
  private readonly selectedShippingMethodSignal = signal<ShippingMethod | null>(null);
  private readonly paymentInfoSignal = signal<Partial<PaymentInfo> | null>(null);
  private readonly appliedDiscountCodeSignal = signal<DiscountCode | null>(null);

  readonly shippingAddress = this.shippingAddressSignal.asReadonly();
  readonly selectedShippingMethod = this.selectedShippingMethodSignal.asReadonly();
  readonly paymentInfo = this.paymentInfoSignal.asReadonly();
  readonly appliedDiscountCode = this.appliedDiscountCodeSignal.asReadonly();

  // Hardcoded active discount codes for simulation
  private readonly ACTIVE_DISCOUNT_CODES: DiscountCode[] = [
    { code: 'SAVE10', type: 'PERCENTAGE', value: 10, isActive: true, minPurchase: 50 },
    { code: 'WELCOME', type: 'FIXED', value: 5, isActive: true },
    { code: 'FLASH20', type: 'PERCENTAGE', value: 20, isActive: true, minPurchase: 100 },
    { code: 'EXPIRED', type: 'PERCENTAGE', value: 15, isActive: false }
  ];

  // Shipping methods
  readonly SHIPPING_METHODS: ShippingMethod[] = [
    { id: 'standard', name: 'Envío Estándar', price: 5.99, deliveryEstimate: '3-5 días hábiles' },
    { id: 'express', name: 'Envío Express', price: 12.99, deliveryEstimate: '1-2 días hábiles' },
    { id: 'free', name: 'Envío Gratis', price: 0, deliveryEstimate: '5-7 días hábiles' }
  ];

  // Totals calculations
  readonly subtotal = computed(() => this.cartService.totalPrice());

  readonly discountAmount = computed(() => {
    const discount = this.appliedDiscountCode();
    const currentSubtotal = this.subtotal();

    if (!discount) return 0;

    if (discount.minPurchase && currentSubtotal < discount.minPurchase) return 0;

    return discount.type === 'PERCENTAGE'
      ? (currentSubtotal * discount.value) / 100
      : discount.value;
  });

  readonly shippingCost = computed(() => this.selectedShippingMethod()?.price ?? 0);

  readonly total = computed(() =>
    this.subtotal() - this.discountAmount() + this.shippingCost()
  );

  // Actions
  goToStep(step: CheckoutStep): void {
    this.currentStepSignal.set(step);
  }

  setShippingAddress(address: ShippingAddress): void {
    this.shippingAddressSignal.set(address);
  }

  setShippingMethod(method: ShippingMethod): void {
    this.selectedShippingMethodSignal.set(method);
  }

  setPaymentInfo(info: Partial<PaymentInfo>): void {
    this.paymentInfoSignal.set(info);
  }

  applyDiscountCode(code: string): { success: boolean, message: string } {
    const foundCode = this.ACTIVE_DISCOUNT_CODES.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!foundCode) {
      return { success: false, message: 'Código no válido' };
    }

    if (!foundCode.isActive) {
      return { success: false, message: 'Este código ha expirado' };
    }

    if (foundCode.minPurchase && this.subtotal() < foundCode.minPurchase) {
      return { success: false, message: `Compra mínima requerida: $${foundCode.minPurchase}` };
    }

    this.appliedDiscountCodeSignal.set(foundCode);
    return { success: true, message: 'Código aplicado correctamente' };
  }

  removeDiscountCode(): void {
    this.appliedDiscountCodeSignal.set(null);
  }

  async processOrder(): Promise<Order | null> {
    const address = this.shippingAddress();
    const method = this.selectedShippingMethod();
    const payment = this.paymentInfo();

    if (!address || !method || !payment) {
      return null;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      items: this.cartService.items(),
      shippingAddress: address,
      shippingMethod: method,
      subtotal: this.subtotal(),
      shippingCost: this.shippingCost(),
      discountAmount: this.discountAmount(),
      discountCode: this.appliedDiscountCode()?.code,
      total: this.total(),
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      paymentInfo: {
        cardHolder: payment.cardHolder,
        cardNumber: `**** **** **** ${payment.cardNumber?.slice(-4)}`
      }
    };

    this.saveOrderToHistory(newOrder);
    this.cartService.clearCart();
    this.resetCheckoutState();
    this.goToStep('confirmation');

    return newOrder;
  }

  private saveOrderToHistory(order: Order): void {
    try {
      const existingOrdersJson = localStorage.getItem('order-history');
      const existingOrders: Order[] = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];
      localStorage.setItem('order-history', JSON.stringify([order, ...existingOrders]));
    } catch (error) {
      console.error('Failed to save order to history:', error);
    }
  }

  private resetCheckoutState(): void {
    this.shippingAddressSignal.set(null);
    this.selectedShippingMethodSignal.set(null);
    this.paymentInfoSignal.set(null);
    this.appliedDiscountCodeSignal.set(null);
  }
}
