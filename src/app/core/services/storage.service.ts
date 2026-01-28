/**
 * Storage Service
 *
 * Responsabilidad única: Abstracción de persistencia de datos
 * - Encapsula localStorage (reemplazable por IndexedDB, SessionStorage, etc.)
 * - Manejo centralizado de errores de almacenamiento
 * - Serialización/deserialización de datos
 * - Operaciones atómicas (get/set/remove)
 *
 * Ventajas:
 * - Fácil cambio de backend de almacenamiento
 * - Control centralizado de errores
 * - Testeable sin necesidad de mock manual de localStorage
 * - Puede agregar características (compresión, encriptación, TTL)
 */

import { Injectable } from '@angular/core';

export interface StorageOptions {
  /**
   * Tiempo de vida en milisegundos (para implementación futura)
   */
  ttl?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_PREFIX = 'app-';

  /**
   * Guardar datos en localStorage
   * Serializa automáticamente objetos a JSON
   * Función pura en intención (no tiene side effects externos visibles al caller)
   *
   * @param key Clave de almacenamiento (sin prefijo)
   * @param value Valor a almacenar (puede ser cualquier tipo)
   * @param options Opciones de almacenamiento
   * @returns true si se guardó exitosamente
   */
  setItem<T>(key: string, value: T, options?: StorageOptions): boolean {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serialized = JSON.stringify(value);
      localStorage.setItem(prefixedKey, serialized);
      return true;
    } catch (error) {
      console.error(`Error storing key "${key}":`, error);
      // En producción podrías enviar a logging service
      return false;
    }
  }

  /**
   * Recuperar datos de localStorage
   * Deserializa automáticamente JSON a objetos
   * Función pura en intención
   *
   * @param key Clave de almacenamiento (sin prefijo)
   * @param defaultValue Valor por defecto si no existe
   * @returns Valor almacenado o defaultValue
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const stored = localStorage.getItem(prefixedKey);

      if (stored === null) {
        return defaultValue ?? null;
      }

      return JSON.parse(stored) as T;
    } catch (error) {
      console.error(`Error retrieving key "${key}":`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Eliminar dato de localStorage
   * Función pura en intención
   *
   * @param key Clave a eliminar (sin prefijo)
   * @returns true si se eliminó exitosamente
   */
  removeItem(key: string): boolean {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error(`Error removing key "${key}":`, error);
      return false;
    }
  }

  /**
   * Verificar si una clave existe en localStorage
   * Función pura
   *
   * @param key Clave a verificar (sin prefijo)
   * @returns true si la clave existe
   */
  hasItem(key: string): boolean {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      return localStorage.getItem(prefixedKey) !== null;
    } catch (error) {
      console.error(`Error checking key "${key}":`, error);
      return false;
    }
  }

  /**
   * Limpiar todos los datos con el prefijo de la app
   * Función destructiva - usar con cuidado
   *
   * @returns Cantidad de claves eliminadas
   */
  clearAll(): number {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      return keysToRemove.length;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return 0;
    }
  }

  /**
   * Obtener todas las claves almacenadas (con prefijo)
   * Función pura
   *
   * @returns Array de claves sin prefijo
   */
  keys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX)) {
          keys.push(key.replace(this.STORAGE_PREFIX, ''));
        }
      }
      return keys;
    } catch (error) {
      console.error('Error reading storage keys:', error);
      return [];
    }
  }

  /**
   * Obtener tamaño aproximado del almacenamiento usado
   * Función pura
   *
   * @returns Tamaño aproximado en caracteres
   */
  getSize(): number {
    try {
      let size = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX)) {
          const value = localStorage.getItem(key);
          if (value) {
            size += key.length + value.length;
          }
        }
      }
      return size;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  /**
   * Agregar prefijo a la clave para evitar colisiones
   * Función pura
   *
   * @param key Clave sin prefijo
   * @returns Clave con prefijo
   */
  private getPrefixedKey(key: string): string {
    return `${this.STORAGE_PREFIX}${key}`;
  }
}
