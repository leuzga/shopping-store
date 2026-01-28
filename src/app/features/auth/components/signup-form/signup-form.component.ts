/**
 * Signup Form Component
 *
 * Responsabilidad única: Formulario de registro de nuevo usuario
 * - Validación de campos (email único, contraseñas coinciden)
 * - Emitir eventos de éxito/error
 */

import { Component, output, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { EmailValidationService } from '../../../../core/services/email-validation.service';
import { VALIDATION_MESSAGES, AUTH_MESSAGES } from '../../../../core/constants/messages';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css'
})
export class SignupFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly emailValidator = inject(EmailValidationService);

  // Outputs
  readonly signupSuccess = output<void>();
  readonly signupError = output<string>();

  // Form
  readonly signupForm: FormGroup = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email], this.emailValidator.validate.bind(this.emailValidator)],
      phone: ['', [Validators.required, Validators.pattern(/^\d{7,}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    {
      validators: this.passwordMatchValidator.bind(this)
    }
  );

  // Computed states
  readonly isLoading = computed(() => this.authService.loading());
  readonly formValid = computed(() => this.signupForm.valid);

  private readonly showErrors = signal(false);
  private readonly isCheckingResult = signal(false);

  // Error messages map (centralizado en constantes)
  private readonly errorMessages: Record<string, Record<string, string>> = {
    firstName: {
      required: VALIDATION_MESSAGES.FIRST_NAME.REQUIRED,
      minlength: VALIDATION_MESSAGES.FIRST_NAME.MIN_LENGTH
    },
    lastName: {
      required: VALIDATION_MESSAGES.LAST_NAME.REQUIRED,
      minlength: VALIDATION_MESSAGES.LAST_NAME.MIN_LENGTH
    },
    email: {
      required: VALIDATION_MESSAGES.EMAIL.REQUIRED,
      email: VALIDATION_MESSAGES.EMAIL.INVALID,
      uniqueEmail: VALIDATION_MESSAGES.EMAIL.UNIQUE
    },
    phone: {
      required: VALIDATION_MESSAGES.PHONE.REQUIRED,
      pattern: VALIDATION_MESSAGES.PHONE.INVALID
    },
    password: {
      required: VALIDATION_MESSAGES.PASSWORD.REQUIRED,
      minlength: VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH
    },
    confirmPassword: {
      required: VALIDATION_MESSAGES.CONFIRM_PASSWORD.REQUIRED,
      passwordMismatch: VALIDATION_MESSAGES.PASSWORD.MATCH
    }
  };

  /**
   * Obtener mensaje de error para un campo
   */
  private getErrorMessage(fieldName: string): string | null {
    const control = this.signupForm.get(fieldName);
    if (!control || (!control.touched && !this.showErrors())) {
      return null;
    }

    const errors = control.errors;
    if (!errors) return null;

    const errorKey = Object.keys(errors)[0];
    return this.errorMessages[fieldName]?.[errorKey] || null;
  }

  /**
   * Obtener mensaje de error para confirmPassword considerando errores del formulario
   */
  private getConfirmPasswordError(): string | null {
    const control = this.signupForm.get('confirmPassword');
    if (!control || (!control.touched && !this.showErrors())) {
      return null;
    }

    if (control.hasError('required')) {
      return this.errorMessages['confirmPassword']?.['required'] || null;
    }

    if (this.signupForm.hasError('passwordMismatch')) {
      return this.errorMessages['confirmPassword']?.['passwordMismatch'] || null;
    }

    return null;
  }

  readonly firstNameError = computed(() => this.getErrorMessage('firstName'));
  readonly lastNameError = computed(() => this.getErrorMessage('lastName'));
  readonly emailError = computed(() => this.getErrorMessage('email'));
  readonly phoneError = computed(() => this.getErrorMessage('phone'));
  readonly passwordError = computed(() => this.getErrorMessage('password'));
  readonly confirmPasswordError = computed(() => this.getConfirmPasswordError());

  /**
   * Validador: Verificar que las contraseñas coincidan
   */
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Effect: Monitorear resultado del signup
   * Se ejecuta cuando isCheckingResult cambia a true
   * Reacciona a cambios en isAuthenticated() y error()
   */
  private readonly signupResultEffect = effect(() => {
    if (!this.isCheckingResult()) {
      return;
    }

    // Reaccionar a cambios en el estado de autenticación
    if (this.authService.isAuthenticated()) {
      this.signupSuccess.emit();
      this.signupForm.reset();
      this.isCheckingResult.set(false);
    } else if (this.authService.error()) {
      this.signupError.emit(this.authService.error() || AUTH_MESSAGES.SIGNUP.ERROR);
      this.isCheckingResult.set(false);
    }
  });

  /**
   * Marcar control como tocado
   */
  onFieldBlur(fieldName: string): void {
    const control = this.signupForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }

  /**
   * Enviar formulario de registro
   */
  onSubmit(): void {
    // Marcar todos los campos como tocados para mostrar errores
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key)?.markAsTouched();
    });

    this.showErrors.set(true);

    if (this.signupForm.invalid) {
      return;
    }

    const { firstName, lastName, email, phone, password } = this.signupForm.value as {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
    };
    // Activar monitoreo del resultado antes de iniciar signup
    this.isCheckingResult.set(true);

    // Iniciar proceso de signup (el effect se encargará de reaccionar al resultado)
    this.authService.signup({
      firstName,
      lastName,
      email,
      phone,
      password
    });
  }
}
