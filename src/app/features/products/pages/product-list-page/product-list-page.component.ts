import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';

/**
 * ProductListPageComponent - Página de lista de productos
 *
 * Usa effect en lugar de ngOnInit para:
 * - Disparar animación fade-in después de renderizar
 * - Patrón reactivo moderno de Angular
 */
@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css',
})
export class ProductListPageComponent {
  readonly isVisible = signal(false);

  constructor() {
    // Effect para disparar fade-in animation después de renderizar
    // Reemplaza ngOnInit con reactividad pura
    effect(() => {
      setTimeout(() => {
        this.isVisible.set(true);
      }, 50);
    });
  }
}
