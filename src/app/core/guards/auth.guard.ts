/**
 * Authentication Guard
 *
 * Responsabilidad única: Proteger rutas que requieren autenticación
 * - Solo usuarios autenticados pueden acceder
 * - Redirige a login si no está autenticado
 */

import { Injectable, inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * Guard funcional para rutas que requieren autenticación
 */
export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authService: AuthService = inject(AuthService),
  router: Router = inject(Router)
) => {
  // Verificar si el usuario está autenticado
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado, redirigir a login con la URL de retorno
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
