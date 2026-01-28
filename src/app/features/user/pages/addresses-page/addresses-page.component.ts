/**
 * Addresses Page Component
 *
 * Responsabilidad única: Página de gestión de direcciones
 * - CRUD completo de direcciones
 * - Protegida por AuthGuard
 */

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressService } from '@features/user/services/address.service';
import { CreateAddressInput, Address } from '@features/user/models/address.model';
import { USER_MESSAGES } from '@core/constants/messages';
import { AddressFormComponent } from '@features/user/components/address-form/address-form.component';

@Component({
  selector: 'app-addresses-page',
  standalone: true,
  imports: [CommonModule, AddressFormComponent],
  templateUrl: './addresses-page.component.html',
  styleUrl: './addresses-page.component.css'
})
export class AddressesPageComponent implements OnInit {
  private readonly addressService = inject(AddressService);

  // Animation state
  readonly isVisible = signal(false);

  // UI State
  readonly showAddForm = signal<boolean>(false);
  readonly editingAddressId = signal<string | null>(null);

  ngOnInit() {
    // Trigger fade-in animation
    setTimeout(() => {
      this.isVisible.set(true);
    }, 50);
  }

  // Address data
  readonly addresses = computed(() => this.addressService.allAddresses());
  readonly defaultAddressId = computed(() => this.addressService.currentDefaultAddressId());
  readonly isLoading = computed(() => this.addressService.loading());
  readonly error = computed(() => this.addressService.error());

  // Derived state
  readonly editingAddress = computed(() => {
    const id = this.editingAddressId();
    return id ? this.addresses().find(a => a.id === id) || null : null;
  });

  /**
   * Mostrar formulario para agregar dirección
   */
  onAddAddress(): void {
    this.editingAddressId.set(null);
    this.showAddForm.set(true);
  }

  /**
   * Procesar envío de formulario de dirección
   */
  onAddressFormSubmit(input: CreateAddressInput): void {
    const editId = this.editingAddressId();
    if (editId) {
      this.addressService.updateAddress(editId, input);
    } else {
      this.addressService.addAddress(input);
    }
    this.showAddForm.set(false);
    this.editingAddressId.set(null);
  }

  /**
   * Editar dirección existente
   */
  onEditAddress(addressId: string): void {
    this.editingAddressId.set(addressId);
    this.showAddForm.set(true);
  }

  /**
   * Eliminar dirección
   */
  onDeleteAddress(addressId: string): void {
    if (confirm(USER_MESSAGES.ADDRESS.DELETE_CONFIRMATION)) {
      this.addressService.deleteAddress(addressId);
    }
  }

  /**
   * Establecer dirección como predeterminada
   */
  onSetDefault(addressId: string): void {
    this.addressService.setDefaultAddress(addressId);
  }

  /**
   * Cancelar formulario
   */
  onCancelForm(): void {
    this.showAddForm.set(false);
    this.editingAddressId.set(null);
  }

  /**
   * Limpiar error
   */
  clearError(): void {
    this.addressService.clearError();
  }
}
