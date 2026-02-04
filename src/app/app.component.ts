import { Component, effect, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CartDisplayComponent } from './features/cart/components/cart-display';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { ProductReviewsModalComponent } from './features/products/components/product-reviews-modal/product-reviews-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent, FooterComponent, CartDisplayComponent, ToastContainerComponent, ProductReviewsModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
/**
 * AppComponent - Componente raíz de la aplicación
 *
 * Responsabilidad única: Renderizar layout global
 * - Top bar (navegación)
 * - Toast container (notificaciones)
 * - Cart display (carrito)
 * - Product reviews modal (modal de reseñas)
 * - Router outlet (contenido dinámico)
 * - Footer
 *
 * Usa patrón moderno Angular: signals, effects, inject
 * Sin lifecycle hooks - completamente reactivo
 */
export class AppComponent {
  readonly title = 'shoping-store';

  // Signal para controlar opacidad del contenido (transiciones)
  readonly contentOpacity = signal<number>(1);

  // Inyección moderna de Router
  private readonly router = inject(Router);

  constructor() {
    // Effect reactivo que observa cambios de ruta
    // Reemplaza ngOnInit con reactividad pura
    effect(() => {
      // Navegar a cualquier ruta reinicia la opacidad
      this.router.events.subscribe(() => {
        this.contentOpacity.set(1);
      });
    });
  }
}
