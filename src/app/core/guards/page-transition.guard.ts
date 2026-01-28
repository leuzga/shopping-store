import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppComponent } from '../../app.component';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { timer } from 'rxjs';

/**
 * Guard que controla las transiciones de página
 *
 * Responsabilidad única: Retardar la navegación para permitir
 * que el fade out se ejecute completamente antes de cambiar de página
 *
 * Flujo:
 * 1. Guard detecta intento de navegación
 * 2. Retarda 600ms (duración del fade out)
 * 3. Permite que la navegación continúe
 */
@Injectable({
  providedIn: 'root'
})
export class PageTransitionGuard implements CanActivate {

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Esperar 600ms (tiempo del fade out) antes de permitir navegación
    return timer(600).pipe(
      map(() => true)
    );
  }
}
