/**
 * User Repository Service
 *
 * Responsabilidad única: Abstracción de acceso a datos de usuarios
 * - Encapsula MOCK_USERS_DATABASE
 * - Proporciona operaciones inmutables
 * - Reemplazable por HTTP service sin cambiar consumers
 *
 * Principios:
 * - Immutability: Retorna copias, nunca referencias
 * - Pure functions: Sin efectos secundarios
 * - Single Responsibility: Solo acceso a datos
 */

import { Injectable } from '@angular/core';
import { AuthUser } from '@core/models/auth.model';
import { MOCK_USERS_DATABASE } from '@core/services/mock-users.database';

export interface UserRepository {
  findByEmail(email: string): AuthUser | null;
  findById(id: string): AuthUser | null;
  create(user: Omit<AuthUser, 'id' | 'createdAt'>): AuthUser;
  update(id: string, updates: Partial<AuthUser>): AuthUser | null;
  getAll(): AuthUser[];
}

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService implements UserRepository {
  /**
   * Convertir MockUser a AuthUser (copia inmutable)
   */
  private mapToAuthUser(mockUser: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
    createdAt: number;
  }): AuthUser {
    return {
      id: mockUser.id,
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      phone: mockUser.phone,
      avatar: mockUser.avatar,
      createdAt: mockUser.createdAt
    };
  }

  /**
   * Buscar usuario por email - operación pura
   * @param email Email a buscar
   * @returns Copia del usuario o null
   */
  findByEmail(email: string): AuthUser | null {
    const mockUser = MOCK_USERS_DATABASE.findByEmail(email);
    return mockUser ? this.mapToAuthUser(mockUser) : null;
  }

  /**
   * Buscar usuario por ID - operación pura
   * @param id ID del usuario
   * @returns Copia del usuario o null
   */
  findById(id: string): AuthUser | null {
    const mockUser = MOCK_USERS_DATABASE.findById(id);
    return mockUser ? this.mapToAuthUser(mockUser) : null;
  }

  /**
   * Crear nuevo usuario - operación funcional
   * @param user Datos del usuario (sin id ni createdAt)
   * @returns Usuario creado con id y createdAt
   */
  create(user: Omit<AuthUser, 'id' | 'createdAt'>): AuthUser {
    const newMockUser = MOCK_USERS_DATABASE.addUser({
      email: user.email,
      password: `mock-password-${Math.random().toString(36).substring(7)}`,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`
    });

    return this.mapToAuthUser(newMockUser);
  }

  /**
   * Actualizar usuario - operación inmutable
   * Retorna copia actualizada sin mutar base de datos
   * @param id ID del usuario a actualizar
   * @param updates Cambios a aplicar
   * @returns Usuario actualizado o null si no existe
   */
  update(id: string, updates: Partial<AuthUser>): AuthUser | null {
    const existingUser = this.findById(id);
    if (!existingUser) {
      return null;
    }

    // Crear nuevo objeto combinando existente con actualizaciones
    const updatedUser: AuthUser = {
      ...existingUser,
      ...updates,
      // Preservar id y createdAt (no permitir cambios)
      id: existingUser.id,
      createdAt: existingUser.createdAt
    };

    // Actualizar en el mock database para persistencia real
    MOCK_USERS_DATABASE.updateUser(id, updates);

    return updatedUser;
  }

  /**
   * Obtener todos los usuarios - operación pura
   * @returns Array de copias de usuarios
   */
  getAll(): AuthUser[] {
    return MOCK_USERS_DATABASE.getAllUsers().map(mockUser =>
      this.mapToAuthUser(mockUser as any)
    );
  }
}
