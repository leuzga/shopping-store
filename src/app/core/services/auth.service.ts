/**
 * Authentication Service
 *
 * Responsabilidad única: Gestionar estado de autenticación con Signals
 * - Gestionar login/signup/logout
 * - Persistir datos en localStorage automáticamente
 * - Proporcionar signals reactivas para acceso al estado
 */

import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { AuthUser, SignupData, SocialProvider, SocialSignupData } from '@core/models/auth.model';
import { STORAGE_KEYS } from '@core/constants/app.constants';
import { AUTH_MESSAGES } from '@core/constants/messages/auth.messages';
import { UserRepositoryService } from '@core/services/user-repository.service';
import { StorageService } from '@core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userRepository = inject(UserRepositoryService);
  private readonly storageService = inject(StorageService);

  // Claves de almacenamiento
  private readonly STORAGE_KEY_USER = STORAGE_KEYS.USER;
  private readonly STORAGE_KEY_TOKEN = STORAGE_KEYS.AUTH_TOKEN;

  // Signals privados (estado interno)
  private readonly currentUser = signal<AuthUser | null>(this.loadUserFromStorage());
  private readonly authToken = signal<string | null>(this.loadTokenFromStorage());
  private readonly isLoading = signal<boolean>(false);
  private readonly authError = signal<string | null>(null);

  // Signals públicos (acceso de solo lectura)
  readonly user = this.currentUser.asReadonly();
  readonly token = this.authToken.asReadonly();
  readonly loading = this.isLoading.asReadonly();
  readonly error = this.authError.asReadonly();

  // Signals computados (estado derivado)
  readonly isAuthenticated = computed(() =>
    this.currentUser() !== null && this.authToken() !== null
  );

  readonly userDisplayName = computed(() => {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : null;
  });

  // Estado de autenticación combinado
  readonly authState = computed(() => ({
    isAuthenticated: this.isAuthenticated(),
    user: this.currentUser(),
    token: this.authToken(),
    isLoading: this.isLoading(),
    error: this.authError(),
  }));

  /**
   * Effect: Auto-persistencia del usuario en localStorage
   * Se ejecuta automáticamente cuando currentUser cambia
   */
  private readonly userPersistEffect = effect(() => {
    const user = this.currentUser();
    if (user) {
      this.storageService.setItem(this.STORAGE_KEY_USER, user);
    } else {
      this.storageService.removeItem(this.STORAGE_KEY_USER);
    }
  });

  /**
   * Effect: Auto-persistencia del token en localStorage
   * Se ejecuta automáticamente cuando authToken cambia
   */
  private readonly tokenPersistEffect = effect(() => {
    const token = this.authToken();
    if (token) {
      this.storageService.setItem(this.STORAGE_KEY_TOKEN, token);
    } else {
      this.storageService.removeItem(this.STORAGE_KEY_TOKEN);
    }
  });

  constructor() {
    // Inicialización ya realizada en las definiciones de signal
  }

  /**
   * Cargar usuario desde localStorage
   */
  private loadUserFromStorage(): AuthUser | null {
    return this.storageService.getItem<AuthUser>(this.STORAGE_KEY_USER);
  }

  /**
   * Cargar token desde localStorage
   */
  private loadTokenFromStorage(): string | null {
    return this.storageService.getItem<string>(this.STORAGE_KEY_TOKEN);
  }

  /**
   * Generar token mock (en producción sería del servidor)
   */
  private generateMockToken(): string {
    return `mock-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Login con email y password
   * Simula llamada a API con delay de 500ms
   */
  login(email: string, password: string): void {
    this.isLoading.set(true);
    this.authError.set(null);

    // Simular latencia de API
    setTimeout(() => {
      const user = this.userRepository.findByEmail(email);

      if (user) {
        // Login exitoso (en real app, verificaríamos password en servidor)
        this.currentUser.set(user);
        this.authToken.set(this.generateMockToken());
        this.isLoading.set(false);
      } else {
        // Login fallido
        this.authError.set(AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS);
        this.isLoading.set(false);
      }
    }, 500);
  }

  /**
   * Signup/Registro de nuevo usuario
   */
  signup(data: SignupData): void {
    this.isLoading.set(true);
    this.authError.set(null);

    setTimeout(() => {
      // Validar que el email no exista ya
      if (this.userRepository.findByEmail(data.email)) {
        this.authError.set(AUTH_MESSAGES.SIGNUP.EMAIL_EXISTS);
        this.isLoading.set(false);
        return;
      }

      // Crear nuevo usuario
      const authUser = this.userRepository.create({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`
      });

      this.currentUser.set(authUser);
      this.authToken.set(this.generateMockToken());
      this.isLoading.set(false);
    }, 500);
  }

  /**
   * Signup con red social (demo visual)
   * Solo simula el flujo, no realiza OAuth2 real
   */
  socialSignup(provider: SocialProvider, data: Partial<SignupData>): void {
    this.isLoading.set(true);
    this.authError.set(null);

    setTimeout(() => {
      // Auto-generar datos de usuario desde datos sociales
      const authUser = this.userRepository.create({
        email: data.email || `user-${Date.now()}@${provider}.local`,
        firstName: data.firstName || 'Social',
        lastName: data.lastName || 'User',
        phone: data.phone || '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}${Date.now()}`
      });

      this.currentUser.set(authUser);
      this.authToken.set(this.generateMockToken());
      this.isLoading.set(false);
    }, 800);
  }

  /**
   * Logout - limpiar estado de autenticación
   */
  logout(): void {
    this.currentUser.set(null);
    this.authToken.set(null);
    this.authError.set(null);
  }

  /**
   * Limpiar mensaje de error
   */
  clearError(): void {
    this.authError.set(null);
  }

  /**
   * Actualizar datos del usuario autenticado
   * (usado por UserService)
   */
  updateUser(updates: Partial<AuthUser>): void {
    const current = this.currentUser();
    if (current) {
      this.currentUser.set({ ...current, ...updates });
    }
  }
}
