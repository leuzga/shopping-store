/**
 * Email Validation Service
 *
 * Responsabilidad única: Centralizar toda validación de emails
 * - Validar formato de email
 * - Verificar unicidad de email (no duplicados)
 * - Operación pura para composición en validadores reactivos
 *
 * Beneficios:
 * - Single source of truth para lógica de validación
 * - Reutilizable en componentes, servicios y validadores
 * - Fácil de mockear en tests
 */

import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { UserRepositoryService } from './user-repository.service';

@Injectable({
  providedIn: 'root'
})
export class EmailValidationService implements AsyncValidator {
  private readonly userRepository = inject(UserRepositoryService);

  /**
   * Validar formato de email usando expresión regular simple
   * Función pura - sin side effects
   *
   * @param email Email a validar
   * @returns true si el formato es válido
   */
  isValidFormat(email: string): boolean {
    // RFC 5322 simplified pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Verificar si un email ya existe en la base de datos
   * Función pura - retorna boolean directamente
   *
   * @param email Email a verificar
   * @returns true si el email ya existe
   */
  emailExists(email: string): boolean {
    return this.userRepository.findByEmail(email) !== null;
  }

  /**
   * Validador asincrónico para formularios reactivos
   * Verifica que el email no esté duplicado
   * Compatible con FormBuilder y FormControl
   *
   * @param control Control del formulario a validar
   * @returns Observable con ValidationErrors o null
   */
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    const email = control.value as string;

    // Simular latencia de API
    return of(email).pipe(
      delay(300),
      map(() => {
        // Verificar que el email existe
        if (this.emailExists(email)) {
          return { 'emailTaken': { value: email } };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Función helper para usar en componentes que necesitan lógica síncrona
   * Combina validación de formato y existencia
   *
   * @param email Email a validar
   * @returns Objeto con información de validación
   */
  validateEmail(email: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!email) {
      errors.push('Email is required');
      return { valid: false, errors };
    }

    if (!this.isValidFormat(email)) {
      errors.push('Email format is invalid');
    }

    if (this.emailExists(email)) {
      errors.push('Email already registered');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Obtener mensaje de error amigable para la UI
   * Función pura
   *
   * @param email Email que tiene error
   * @returns Mensaje de error descriptivo
   */
  getErrorMessage(email: string): string {
    if (!email) {
      return 'Email is required';
    }

    if (!this.isValidFormat(email)) {
      return 'Email format is invalid';
    }

    if (this.emailExists(email)) {
      return 'Email already registered';
    }

    return '';
  }
}
