import { Injectable } from '@angular/core';
import { ToastType } from './notification.service';

/**
 * IconsService - Proporciona iconos SVG centralizados
 *
 * Responsabilidad única: Gestionar todos los iconos de la aplicación
 * - Almacena iconos SVG por tipo
 * - Método puro para obtener icono según tipo
 * - Fácil de mantener y extender
 * - Desacoplado del componente
 */
@Injectable({ providedIn: 'root' })
export class IconsService {
  private readonly SVG_CONFIG = {
    success: {
      svg: '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      color: 'text-green-800',
    },
    error: {
      svg: '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      color: 'text-red-800',
    },
    warning: {
      svg: '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 0v2m0-4v2" /></svg>',
      color: 'text-yellow-800',
    },
    info: {
      svg: '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" stroke-width="0.5"/><path d="M12 8v0.01M12 11v5" stroke-width="0.5" /></svg>',
      color: 'text-white',
    },
  };

  /**
   * Obtiene el SVG para un tipo de toast específico
   * Función pura que siempre retorna el mismo resultado para la misma entrada
   */
  getSvgByType(type: ToastType): string {
    return this.SVG_CONFIG[type]?.svg || this.SVG_CONFIG.info.svg;
  }

  /**
   * Obtiene el color del icono para un tipo de toast específico
   * Función pura
   */
  getIconColorByType(type: ToastType): string {
    return this.SVG_CONFIG[type]?.color || this.SVG_CONFIG.info.color;
  }

  /**
   * Obtiene ambos valores (SVG y color) en una sola llamada
   * Más eficiente cuando necesitas ambos
   */
  getIconConfigByType(type: ToastType) {
    return this.SVG_CONFIG[type] || this.SVG_CONFIG.info;
  }
}
