/**
 * Login Form Component
 *
 * Responsabilidad única: Renderizar y gestionar formulario de login
 * - Validación reactiva de campos
 * - Emitir eventos de éxito/error
 */

import { Component, output, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { VALIDATION_MESSAGES, AUTH_MESSAGES } from '../../../../core/constants/messages';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  // Outputs
  readonly loginSuccess = output<void>();
  readonly loginError = output<string>();

  // Form
  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  // State
  private readonly submitted = signal(false);
  private readonly isCheckingResult = signal(false);

  // Error messages map (centralizado en constantes)
  private readonly errorMessages: Record<string, Record<string, string>> = {
    email: {
      required: VALIDATION_MESSAGES.EMAIL.REQUIRED,
      email: VALIDATION_MESSAGES.EMAIL.INVALID
    },
    password: {
      required: VALIDATION_MESSAGES.PASSWORD.REQUIRED,
      minlength: VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH
    }
  };

  // Computed states
  readonly isLoading = computed(() => this.authService.loading());

  readonly isFormValid = computed(() => this.loginForm.valid && this.loginForm.dirty);

  /**
   * Obtener mensaje de error para un campo
   */
  private getErrorMessage(fieldName: string): string | null {
    const control = this.loginForm.get(fieldName);
    if (!control || (!control.touched && !this.submitted())) {
      return null;
    }

    const errors = control.errors;
    if (!errors) return null;

    const errorKey = Object.keys(errors)[0];
    return this.errorMessages[fieldName]?.[errorKey] || null;
  }

  readonly emailError = computed(() => this.getErrorMessage('email'));
  readonly passwordError = computed(() => this.getErrorMessage('password'));

  /**
   * Effect: Monitorear resultado del login
   * Se ejecuta cuando isCheckingResult cambia a true
   * Reacciona a cambios en isAuthenticated() y error()
   */
  private readonly loginResultEffect = effect(() => {
    if (!this.isCheckingResult()) {
      return;
    }

    // Reaccionar a cambios en el estado de autenticación
    if (this.authService.isAuthenticated()) {
      this.loginSuccess.emit();
      this.loginForm.reset();
      this.isCheckingResult.set(false);
    } else if (this.authService.error()) {
      this.loginError.emit(this.authService.error() || AUTH_MESSAGES.LOGIN.ERROR);
      this.isCheckingResult.set(false);
    }
  });

  /**
   * Marcar control como tocado
   */
  onFieldBlur(fieldName: string): void {
    const control = this.loginForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }

  /**
   * Enviar formulario de login
   */
  onSubmit(): void {
    // Marcar formulario como enviado
    this.submitted.set(true);

    // Marcar todos los campos como tocados para mostrar errores
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value as { email: string; password: string };

    // Activar monitoreo del resultado antes de iniciar login
    this.isCheckingResult.set(true);

    // Iniciar proceso de login (el effect se encargará de reaccionar al resultado)
    this.authService.login(email, password);
  }
}
