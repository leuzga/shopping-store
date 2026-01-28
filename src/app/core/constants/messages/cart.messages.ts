/**
 * Cart Messages
 * Centralized cart-related messages organized by domain
 */

export const CART_MESSAGES = {
  LABELS: {
    TITLE: 'Mi Carrito',
    EMPTY: 'Tu carrito está vacío',
    CONTINUE_SHOPPING: 'Seguir Comprando',
    CHECKOUT: 'Ir al Checkout',
    TOTAL: 'Total',
    QUANTITY: 'Cantidad',
    PRICE: 'Precio',
    REMOVE: 'Eliminar',
  },
  DESCRIPTIONS: {
    EMPTY_MESSAGE: 'Parece que no has agregado productos aún',
    FREE_SHIPPING: 'Envío Gratis',
  },
  ACTIONS: {
    INCREMENT: 'Aumentar cantidad',
    DECREMENT: 'Disminuir cantidad',
    REMOVE_ITEM: 'Eliminar producto',
    CLEAR_CART: 'Vaciar carrito',
    CONFIRM: 'Confirmar',
    CANCEL: 'Cancelar',
  },
  CONFIRMATIONS: {
    CLEAR_CART_TITLE: 'Vaciar carrito',
    CLEAR_CART_MESSAGE: '¿Estás seguro de que deseas eliminar todos los artículos del carrito? Esta acción no se puede deshacer.',
  },
} as const;
