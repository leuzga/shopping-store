/**
 * DummyJSON API Models
 *
 * Interfaces para los datos de https://dummyjson.com/
 * Usando tipos inmutables (readonly)
 */

/**
 * Producto del DummyJSON
 */
export interface Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
  readonly image: string;
  readonly rating?: {
    readonly rate: number;
    readonly count: number;
  };
}

/**
 * Categoría del DummyJSON
 */
export type Category = string;

/**
 * Carrito del DummyJSON
 */
export interface Cart {
  readonly id: number;
  readonly userId: number;
  readonly date: string;
  readonly products: readonly CartProduct[];
}

/**
 * Producto en el carrito
 */
export interface CartProduct {
  readonly productId: number;
  readonly quantity: number;
}

/**
 * Usuario del DummyJSON
 */
export interface User {
  readonly id: number;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly name: {
    readonly firstname: string;
    readonly lastname: string;
  };
  readonly address: {
    readonly city: string;
    readonly street: string;
    readonly number: number;
    readonly zipcode: string;
    readonly geolocation: {
      readonly lat: string;
      readonly long: string;
    };
  };
  readonly phone: string;
}

/**
 * Respuesta de login (simulada)
 */
export interface LoginResponse {
  readonly token: string;
  readonly userId: number;
}

/**
 * Errores de API
 */
export interface ApiError {
  readonly status: number;
  readonly message: string;
  readonly timestamp: number;
}

/**
 * Respuesta genérica con paginación
 */
export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}
