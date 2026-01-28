/**
 * Register Page Component
 *
 * Responsabilidad única: Página de registro
 * - Protegida por UnauthGuard
 * - Contiene SignupFormComponent y SocialSignupComponent
 */

import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';
import { SocialSignupComponent } from '../../components/social-signup/social-signup.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SignupFormComponent, SocialSignupComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Animation state
  readonly isVisible = signal(false);

  readonly isLoading = computed(() => this.authService.loading());
  readonly error = computed(() => this.authService.error());

  ngOnInit() {
    // Trigger fade-in animation
    setTimeout(() => {
      this.isVisible.set(true);
    }, 50);
  }

  /**
   * Manejador: Registro exitoso
   */
  onSignupSuccess(): void {
    this.router.navigate(['/profile']);
  }

  /**
   * Manejador: Error en registro (emitido por SignupFormComponent)
   */
  onSignupError(errorMessage: string): void {
    // El error ya está siendo manejado por AuthService
    // Solo mostramos la alerta que ya está en el template
  }

  /**
   * Limpiar error
   */
  clearError(): void {
    this.authService.clearError();
  }
}
