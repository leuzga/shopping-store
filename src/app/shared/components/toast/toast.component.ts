import {
  Component,
  Input,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Toast, IconsService } from '@core/services';

/**
 * ToastComponent - Renderiza un único toast/notificación
 *
 * Responsabilidad única: Renderizar visualmente un toast individual
 * - Recibe un toast como input
 * - Usa signals para reactividad pura
 * - Delega iconos a IconsService (separación de responsabilidades)
 * - Anima barra de progreso
 * - Emite evento dismiss cuando se cierra
 *
 * Características:
 * - Reactivo mediante signals y computed
 * - DomSanitizer para seguridad de HTML/SVG
 * - Sin ciclo de vida innecesario
 * - Función pura para estilos dinámicos
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  private readonly iconsService = inject(IconsService);
  private readonly sanitizer = inject(DomSanitizer);

  @Input() set toast(value: Toast) {
    this.toastSignal.set(value);
  }

  @Input() onDismiss?: () => void;

  // Signals para reactividad pura
  readonly toastSignal = signal<Toast | null>(null);
  private readonly progressSignal = signal<number>(100);
  private readonly dismissClick = signal<number>(0);

  constructor() {
    // Effect reactivo que observa el dismiss click
    effect(() => {
      if (this.dismissClick() > 0) {
        this.onDismiss?.();
      }
    });

    // Effect para iniciar y limpiar la animación del progreso
    // Reemplaza ngOnInit y ngOnDestroy con reactividad pura
    effect((onCleanup) => {
      const duration = 5000;
      const steps = 100;
      const stepDuration = duration / steps;

      const progressInterval = setInterval(() => {
        this.progressSignal.update((current) => {
          const next = current - 1;
          return next <= 0 ? 0 : next;
        });
      }, stepDuration);

      // Cleanup function - se ejecuta cuando el componente se destruye
      onCleanup(() => {
        if (progressInterval) {
          clearInterval(progressInterval);
        }
      });
    });
  }

  // Computed signals derivados del toast
  readonly alertClass = computed(() => {
    const toast = this.toastSignal();
    if (!toast) return '';

    const baseClass = 'animate-slide-in max-w-sm';
    const typeClass = {
      success: 'bg-green-50 border border-green-200',
      error: 'bg-red-50 border border-red-200',
      warning: 'bg-yellow-50 border border-yellow-200',
      info: 'bg-cyan-400/50 border-none',
    }[toast.type] || 'bg-cyan-400/50 border-none';

    return `${baseClass} ${typeClass}`;
  });

  readonly textClass = computed(() => {
    const toast = this.toastSignal();
    if (!toast) return '';

    const typeClass = {
      success: 'text-green-800',
      error: 'text-red-800',
      warning: 'text-yellow-800',
      info: 'text-white',
    }[toast.type] || 'text-white';

    return typeClass;
  });

  readonly iconSvg = computed<SafeHtml>(() => {
    const toast = this.toastSignal();
    if (!toast) return this.sanitizer.bypassSecurityTrustHtml('');

    const svg = this.iconsService.getSvgByType(toast.type);
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });

  readonly progressWidth = computed(() => this.progressSignal());

  readonly message = computed(() => this.toastSignal()?.message || '');

  /**
   * Obtiene el tipo del toast actual
   * Función pura para usar en template
   */
  getToastType(): string {
    return this.toastSignal()?.type || 'info';
  }

  /**
   * Maneja el click de dismiss
   * Actualiza la signal, que dispara el effect
   */
  handleDismiss(): void {
    this.dismissClick.update((current) => current + 1);
  }
}
