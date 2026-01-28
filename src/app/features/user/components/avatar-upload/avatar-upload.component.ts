/**
 * Avatar Upload Component
 *
 * Responsabilidad única: Modal para actualizar avatar del usuario
 * - Subir imagen desde dispositivo
 * - Ingresar URL de imagen
 * - Guardar o cancelar
 */

import { Component, inject, signal, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USER_MESSAGES } from '@core/constants/messages';
import { DelayService } from '@core/services/delay.service';
import { AvatarCropperComponent } from './avatar-cropper.component';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [CommonModule, AvatarCropperComponent],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.css'
})
export class AvatarUploadComponent {
  private readonly delayService = inject(DelayService);

  // Outputs
  readonly avatarUpdated = output<string>();
  readonly closed = output<void>();

  // State
  readonly isOpen = signal(false);
  private readonly preview = signal<string | null>(null);
  private readonly isLoading = signal(false);

  // Expose signals to template
  readonly loading = this.isLoading;

  // Expose messages to template
  readonly modalTitle = signal(USER_MESSAGES.AVATAR.MODAL_TITLE);

  /**
   * Effect: Simular guardado de avatar con delay
   */
  private readonly savingAvatarEffect = effect(() => {
    if (!this.isLoading()) {
      return;
    }

    const image = this.preview();
    if (!image) {
      this.isLoading.set(false);
      return;
    }

    this.delayService.execute(() => {
      this.avatarUpdated.emit(image);
      this.close();
      this.isLoading.set(false);
    }, 300).subscribe();
  });

  /**
   * Abrir modal
   */
  open(): void {
    this.isOpen.set(true);
    this.preview.set(null);
  }

  /**
   * Cerrar modal
   */
  public close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  /**
   * Manejar guardado desde el cropper
   */
  onImageSaved(imageBase64: string): void {
    this.preview.set(imageBase64);
    this.isLoading.set(true);
  }

  /**
   * Manejar cancelación desde el cropper
   */
  onCropperCancelled(): void {
    this.close();
  }
}
