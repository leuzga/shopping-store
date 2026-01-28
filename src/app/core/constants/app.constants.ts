// Application Constants
export const APP_NAME = 'Shopping Store';

export const STORAGE_KEYS = {
  CART: 'shopping-cart',
  USER: 'auth-user',
  AUTH_TOKEN: 'auth-token',
  ADDRESSES: 'user-addresses',
  THEME: 'app-theme',
  WISHLIST: 'user-wishlist',
} as const;

export const DEBOUNCE_TIME = {
  SEARCH: 300,
  INPUT: 150,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [20, 40, 60] as const,
} as const;
