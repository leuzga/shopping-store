/**
 * Address Models
 *
 * Responsabilidad única: Define interfaces para gestión de direcciones
 */

/**
 * Dirección de envío completa
 */
export interface Address {
  readonly id: string;
  readonly userId: string;
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly zipcode: string;
  readonly country: string;
  readonly phone: string;
  readonly isDefault: boolean;
  readonly createdAt: number;
  readonly updatedAt: number;
}

/**
 * Datos para crear nueva dirección
 */
export interface CreateAddressInput {
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly zipcode: string;
  readonly country: string;
  readonly phone: string;
}

/**
 * Datos para actualizar dirección existente
 */
export interface UpdateAddressInput extends CreateAddressInput {
  readonly isDefault?: boolean;
}

/**
 * Estado de direcciones del usuario
 */
export interface AddressState {
  readonly addresses: readonly Address[];
  readonly defaultAddressId: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}
