/**
 * Profile Page Component
 *
 * Responsabilidad única: Página de perfil de usuario
 * - Protegida por AuthGuard (solo usuarios autenticados)
 * - Muestra y permite editar datos del perfil
 */

import { Component, inject, computed, signal, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '@features/user/services/user.service';
import { AvatarUploadComponent } from '@features/user/components/avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarUploadComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  private readonly userService = inject(UserService);

  @ViewChild(AvatarUploadComponent) avatarUpload?: AvatarUploadComponent;

  // Animation state
  readonly isVisible = signal(false);

  readonly userProfile = computed(() => this.userService.userProfile());
  readonly isUpdating = computed(() => this.userService.updating());

  ngOnInit() {
    // Trigger fade-in animation
    setTimeout(() => {
      this.isVisible.set(true);
    }, 50);
  }

  /**
   * Abrir modal de actualización de avatar
   */
  openAvatarUpload(): void {
    this.avatarUpload?.open();
  }

  /**
   * Manejar actualización de avatar
   */
  onAvatarUpdated(avatarData: string): void {
    this.userService.updateAvatar(avatarData);
  }
}
