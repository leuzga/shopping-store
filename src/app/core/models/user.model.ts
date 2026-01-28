/**
 * User model matching DummyJSON API response
 */
export interface User {
  readonly id: number;
  readonly email: string;
  readonly username: string;
  readonly password?: string;
  readonly name: UserName;
  readonly address: UserAddress;
  readonly phone: string;
}

export interface UserName {
  readonly firstname: string;
  readonly lastname: string;
}

export interface UserAddress {
  readonly city: string;
  readonly street: string;
  readonly number: number;
  readonly zipcode: string;
  readonly geolocation: Geolocation;
}

export interface Geolocation {
  readonly lat: string;
  readonly long: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  readonly isAuthenticated: boolean;
  readonly user: User | null;
  readonly token: string | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

/**
 * Login response from API
 */
export interface LoginResponse {
  readonly token: string;
}
