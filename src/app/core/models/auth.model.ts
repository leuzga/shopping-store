/**
 * Authentication Models
 *
 * Responsabilidad única: Define todas las interfaces y tipos relacionados con autenticación
 */

/**
 * Credenciales de login
 */
export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

/**
 * Datos para registro de nuevo usuario
 */
export interface SignupData extends AuthCredentials {
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly rememberMe?: boolean;
}

/**
 * Usuario autenticado (datos públicos)
 */
export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly avatar?: string;
  readonly createdAt?: number;
}

/**
 * Respuesta de operaciones de autenticación
 */
export interface AuthResponse {
  readonly success: boolean;
  readonly message?: string;
  readonly user?: AuthUser;
  readonly token?: string;
}

/**
 * Estado de autenticación global
 */
export interface AuthState {
  readonly isAuthenticated: boolean;
  readonly user: AuthUser | null;
  readonly token: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly lastLoginTime?: number;
}

/**
 * Proveedores de autenticación social (demo only)
 */
export type SocialProvider = 'google' | 'facebook';

/**
 * Datos para signup con red social (demo)
 */
export interface SocialSignupData {
  readonly provider: SocialProvider;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatar?: string;
}
