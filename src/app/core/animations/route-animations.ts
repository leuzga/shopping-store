import { trigger, transition, style, animate } from '@angular/animations';

/**
 * Fade In/Out animation for route transitions
 *
 * Responsabilidad única: Animar transiciones de rutas con fade suave
 *
 * - :enter - Página nueva aparece con fade in (opacity 0 → 1)
 * - :leave - Página vieja desaparece con fade out (opacity 1 → 0)
 * - Duración: 800ms para visualizar claramente la transición
 * - Easing: ease-in-out para transición suave
 */
export const slideInOutAnimation = trigger('slideInOut', [
  // Transición de entrada: Página nueva fade in
  transition(':enter', [
    style({ opacity: 0 }),
    animate(
      '800ms ease-in-out',
      style({ opacity: 1 })
    )
  ]),

  // Transición de salida: Página vieja fade out
  transition(':leave', [
    animate(
      '800ms ease-in-out',
      style({ opacity: 0 })
    )
  ])
]);
