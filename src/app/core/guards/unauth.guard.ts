/**
 * Unauthenticated Guard
 *
 * Responsabilidad única: Prevenir que usuarios autenticados accedan a login/signup
 * - Solo usuarios sin autenticación pueden acceder
 * - Redirige a home si ya está autenticado
 */

import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * Guard funcional para rutas que no deben ser accedidas por usuarios autenticados
 * (login, register, forgot-password, etc.)
 */
export const UnauthGuard: CanActivateFn = (
  route,
  state,
  authService: AuthService = inject(AuthService),
  router: Router = inject(Router)
) => {
  // Si está autenticado, redirigir a home
  if (authService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  // Si no está autenticado, permitir acceso
  return true;
};
