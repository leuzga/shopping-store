/**
 * Social Signup Component
 *
 * Responsabilidad única: Proporcionar botones para signup simulado con redes sociales
 * - Simula flujo de Google y Facebook (demo visual, sin OAuth2 real)
 * - Auto-genera datos de usuario
 */

import { Component, output, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { SocialProvider } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-social-signup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-signup.component.html',
  styleUrl: './social-signup.component.css'
})
export class SocialSignupComponent {
  private readonly authService = inject(AuthService);

  // Output
  readonly signupSuccess = output<void>();

  // State
  private readonly isCheckingResult = signal(false);

  // Computed
  readonly isLoading = computed(() => this.authService.loading());

  /**
   * Effect: Monitorear resultado del signup social
   * Se ejecuta cuando isCheckingResult cambia a true
   * Reacciona a cambios en isAuthenticated()
   */
  private readonly socialSignupResultEffect = effect(() => {
    if (!this.isCheckingResult()) {
      return;
    }

    // Reaccionar a cambios en el estado de autenticación
    if (this.authService.isAuthenticated()) {
      this.signupSuccess.emit();
      this.isCheckingResult.set(false);
    }
  });

  /**
   * Simular signup con Google
   */
  onGoogleSignup(): void {
    const mockGoogleData = {
      email: `google-user-${Date.now()}@gmail.com`,
      firstName: 'Google',
      lastName: 'User'
    };

    this.isCheckingResult.set(true);
    this.authService.socialSignup('google', mockGoogleData);
  }

  /**
   * Simular signup con Facebook
   */
  onFacebookSignup(): void {
    const mockFacebookData = {
      email: `facebook-user-${Date.now()}@facebook.com`,
      firstName: 'Facebook',
      lastName: 'User'
    };

    this.isCheckingResult.set(true);
    this.authService.socialSignup('facebook', mockFacebookData);
  }
}
