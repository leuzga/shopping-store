import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '@core/services';
import { ToastComponent } from '../toast/toast.component';

/**
 * ToastContainerComponent - Renderiza el contenedor de notificaciones
 *
 * Responsabilidad única: Gestionar la visualización de múltiples toasts
 * - Se coloca en AppComponent para ser global
 * - Posición fija: top-right
 * - Renderiza múltiples ToastComponent dinámicamente
 * - Se suscribe a notificationService.notifications() signal
 * - Usa patrón reactivo con callbacks en lugar de eventos
 *
 * Patrón reactivo:
 * - No hay @Output() ni eventos
 * - Usa callbacks (funciones puras) pasadas como inputs
 * - El componente hijo dispara effects que ejecutan los callbacks
 */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
})
export class ToastContainerComponent {
  readonly notificationService = inject(NotificationService);

  /**
   * Método puro que retorna una función callback
   * Se usa para pasar al componente hijo
   * Patrón funcional: Higher-Order Function
   */
  createDismissCallback = (id: string): (() => void) => {
    return () => this.notificationService.dismiss(id);
  };
}
