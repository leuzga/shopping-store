import { Injectable, computed, inject, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

/**
 * NotificationService - Maneja notificaciones tipo toast
 *
 * Responsabilidad única: Gestionar un stack de notificaciones toast
 * - Máximo 3 notificaciones simultáneas (FIFO)
 * - Auto-dismiss después de 5 segundos (configurable)
 * - Métodos públicos: showSuccess, showError, showWarning, showInfo
 * - Permite dismiss manual y automático
 *
 * Patrón: Sigue el mismo patrón que CartService y WishlistService
 * - Signals para estado reactivo
 * - Computed para valores derivados
 * - Métodos puros sin side effects externos
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly toastIdCounter = signal<number>(0);
  private readonly toasts = signal<Toast[]>([]);

  readonly notifications = this.toasts.asReadonly();
  readonly count = computed(() => this.toasts().length);
  readonly hasNotifications = computed(() => this.toasts().length > 0);

  private readonly MAX_TOASTS = 3;
  private readonly DEFAULT_DURATION = 5000; // 5 segundos

  /**
   * Mostrar notificación de éxito
   */
  showSuccess(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  /**
   * Mostrar notificación de error
   */
  showError(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  /**
   * Mostrar notificación de advertencia
   */
  showWarning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Mostrar notificación informativa
   */
  showInfo(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  /**
   * Cerrar una notificación específica
   */
  dismiss(id: string): void {
    this.toasts.update((prev) => prev.filter((toast) => toast.id !== id));
  }

  /**
   * Cerrar todas las notificaciones
   */
  dismissAll(): void {
    this.toasts.set([]);
  }

  /**
   * Método privado: mostrar toast con lógica de stack
   */
  private show(message: string, type: ToastType, duration?: number): void {
    // Si alcanzamos el máximo de toasts, eliminar el primero (FIFO)
    if (this.toasts().length >= this.MAX_TOASTS) {
      this.toasts.update((prev) => [...prev.slice(1)]);
    }

    // Generar ID único
    const id = `toast-${this.toastIdCounter()}`;
    this.toastIdCounter.update((prev) => prev + 1);

    // Crear toast
    const toast: Toast = { id, message, type };

    // Agregar al stack
    this.toasts.update((prev) => [...prev, toast]);

    // Auto-dismiss después del tiempo especificado
    const finalDuration = duration ?? this.DEFAULT_DURATION;
    setTimeout(() => this.dismiss(id), finalDuration);
  }
}
