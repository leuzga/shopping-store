// API Constants
export const API_BASE_URL = 'https://dummyjson.com';

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_BY_ID: (id: number | string) => `${API_BASE_URL}/products/${id}`,
  CATEGORIES: `${API_BASE_URL}/products/category-list`,
  PRODUCTS_BY_CATEGORY: (category: string) => `${API_BASE_URL}/products/category/${category}`,
  SEARCH_PRODUCTS: (query: string) => `${API_BASE_URL}/products/search?q=${query}`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_USER: `${API_BASE_URL}/auth/me`,
} as const;
