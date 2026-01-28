/**
 * User Service
 *
 * Responsabilidad única: Gestionar perfil de usuario autenticado
 * - Sincronizar con AuthService
 * - Permitir actualización de datos de perfil
 * - Mantener estado reactivo con Signals
 */

import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { AuthUser } from '@core/models/auth.model';
import { AuthService } from '@core/services/auth.service';
import { UserRepositoryService } from '@core/services/user-repository.service';
import { USER_MESSAGES } from '@core/constants/messages';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly authService = inject(AuthService);
  private readonly userRepository = inject(UserRepositoryService);

  // Signals privados
  private readonly currentUserProfile = signal<AuthUser | null>(null);
  private readonly isUpdating = signal<boolean>(false);
  private readonly updateError = signal<string | null>(null);

  // Signals públicos
  readonly userProfile = this.currentUserProfile.asReadonly();
  readonly updating = this.isUpdating.asReadonly();
  readonly error = this.updateError.asReadonly();

  // Signals computados
  readonly hasProfile = computed(() => this.currentUserProfile() !== null);
  readonly userFullName = computed(() => {
    const user = this.currentUserProfile();
    return user ? `${user.firstName} ${user.lastName}` : null;
  });

  /**
   * Effect: Sincronizar perfil con AuthService
   * Cuando el usuario autenticado cambia, actualizar el perfil local
   */
  private readonly syncProfileEffect = effect(() => {
    const authUser = this.authService.user();
    this.currentUserProfile.set(authUser);
  });

  constructor() {
    // La sincronización ocurre automáticamente via effect
  }

  /**
   * Actualizar datos del perfil del usuario
   * Simula un call a API con delay de 500ms
   */
  updateProfile(updates: Partial<AuthUser>): void {
    const current = this.currentUserProfile();
    if (!current) {
      this.updateError.set(USER_MESSAGES.ERRORS.NOT_AUTHENTICATED);
      return;
    }

    this.isUpdating.set(true);
    this.updateError.set(null);

    // Simular latencia de API
    setTimeout(() => {
      try {
        // Actualizar usuario através del repositorio (operación inmutable)
        const updatedUser = this.userRepository.update(current.id, updates);

        if (updatedUser) {
          // Actualizar estado local
          this.currentUserProfile.set(updatedUser);

          // Actualizar en AuthService también
          this.authService.updateUser(updatedUser);
        }

        this.isUpdating.set(false);
      } catch (error) {
        this.updateError.set(USER_MESSAGES.PROFILE.UPDATE_ERROR);
        this.isUpdating.set(false);
      }
    }, 500);
  }

  /**
   * Actualizar avatar del usuario
   * Acepta imagen en base64 o URL
   * Persiste en localStorage para mantener el avatar entre sesiones
   */
  updateAvatar(avatarData: string): void {
    const current = this.currentUserProfile();
    if (!current) {
      this.updateError.set(USER_MESSAGES.ERRORS.NOT_AUTHENTICATED);
      return;
    }

    this.isUpdating.set(true);
    this.updateError.set(null);

    // Simular latencia de API
    setTimeout(() => {
      try {
        // Actualizar avatar através del repositorio (operación inmutable)
        const updatedUser = this.userRepository.update(current.id, { avatar: avatarData });

        if (updatedUser) {
          // Actualizar estado local
          this.currentUserProfile.set(updatedUser);

          // Actualizar en AuthService también
          this.authService.updateUser(updatedUser);

          // Persistir avatar en localStorage
          this.persistAvatarToLocalStorage(updatedUser.id, avatarData);
        }

        this.isUpdating.set(false);
      } catch (error) {
        this.updateError.set(USER_MESSAGES.AVATAR.UPDATE_ERROR);
        this.isUpdating.set(false);
      }
    }, 500);
  }

  /**
   * Obtener avatar del usuario desde localStorage
   * Si existe, retorna los datos del avatar
   */
  getAvatarFromLocalStorage(userId: string): string | null {
    try {
      const key = `user_avatar_${userId}`;
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading avatar from localStorage:', error);
      return null;
    }
  }

  /**
   * Persistir avatar en localStorage
   */
  private persistAvatarToLocalStorage(userId: string, avatarData: string): void {
    try {
      const key = `user_avatar_${userId}`;
      localStorage.setItem(key, avatarData);
    } catch (error) {
      console.error('Error saving avatar to localStorage:', error);
    }
  }

  /**
   * Obtener perfil actual del usuario
   */
  getProfile(): AuthUser | null {
    return this.currentUserProfile();
  }

  /**
   * Limpiar error
   */
  clearError(): void {
    this.updateError.set(null);
  }
}
