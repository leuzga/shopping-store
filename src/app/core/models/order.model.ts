import { CartItem } from './cart.model';

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  deliveryEstimate: string;
}

export interface PaymentInfo {
  cardHolder: string;
  cardNumber: string; // Mock, will be masked
  expiryDate: string;
  cvv: string;
}

export interface DiscountCode {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  isActive: boolean;
  minPurchase?: number;
}

export interface Order {
  id: string;
  userId?: string;
  items: readonly CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentInfo: Partial<PaymentInfo>; // Secure enough for mock
}
