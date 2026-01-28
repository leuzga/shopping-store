/**
 * Login Page Component
 *
 * Responsabilidad única: Página de login
 * - Protegida por UnauthGuard (no accesible si está autenticado)
 * - Contiene LoginFormComponent y SocialSignupComponent
 * - Redirige a home tras login exitoso
 */

import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { SocialSignupComponent } from '../../components/social-signup/social-signup.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginFormComponent, SocialSignupComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Animation state
  readonly isVisible = signal(false);

  // Computed states
  readonly isLoading = computed(() => this.authService.loading());
  readonly error = computed(() => this.authService.error());

  ngOnInit() {
    // Trigger fade-in animation
    setTimeout(() => {
      this.isVisible.set(true);
    }, 50);
  }

  /**
   * Manejador: Login exitoso
   */
  onLoginSuccess(): void {
    // Obtener URL de retorno desde query params o ir a home
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigateByUrl(returnUrl);
  }

  /**
   * Manejador: Error en login (emitido por LoginFormComponent)
   */
  onLoginError(errorMessage: string): void {
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
