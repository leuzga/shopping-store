/**
 * Address Service
 *
 * Responsabilidad única: Gestionar direcciones de usuario
 * - CRUD completo (Create, Read, Update, Delete)
 * - Persistir en localStorage automáticamente
 * - Estado reactivo con Signals y Effects
 */

import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Address, CreateAddressInput, UpdateAddressInput } from '@features/user/models/address.model';
import { AuthService } from '@core/services/auth.service';
import { STORAGE_KEYS } from '@core/constants/app.constants';
import { USER_MESSAGES } from '@core/constants/messages';

interface AddressStorageData {
  addresses: Address[];
  defaultAddressId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly STORAGE_KEY = STORAGE_KEYS.ADDRESSES;
  private readonly authService = inject(AuthService);

  // Signals privados
  private readonly addresses = signal<readonly Address[]>(this.loadAddressesFromStorage());
  private readonly defaultAddressId = signal<string | null>(this.loadDefaultAddressIdFromStorage());
  private readonly isLoading = signal<boolean>(false);
  private readonly addressError = signal<string | null>(null);

  // Signals públicos
  readonly allAddresses = this.addresses.asReadonly();
  readonly currentDefaultAddressId = this.defaultAddressId.asReadonly();
  readonly loading = this.isLoading.asReadonly();
  readonly error = this.addressError.asReadonly();

  // Signals computados
  readonly defaultAddress = computed(() => {
    const defaultId = this.defaultAddressId();
    return defaultId ? this.addresses().find(a => a.id === defaultId) : null;
  });

  readonly addressCount = computed(() => this.addresses().length);

  /**
   * Effect: Auto-persistencia de direcciones en localStorage
   * Se ejecuta cuando addresses o defaultAddressId cambian
   */
  private readonly persistEffect = effect(() => {
    const addrs = this.addresses();
    const defaultId = this.defaultAddressId();

    try {
      const data: AddressStorageData = {
        addresses: [...addrs],
        defaultAddressId: defaultId
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error persisting addresses:', error);
    }
  });

  constructor() {
    // Las direcciones se cargan automáticamente desde localStorage
  }

  /**
   * Cargar direcciones desde localStorage
   */
  private loadAddressesFromStorage(): readonly Address[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data: AddressStorageData = JSON.parse(stored);
        return data.addresses || [];
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
    return [];
  }

  /**
   * Cargar ID de dirección predeterminada desde localStorage
   */
  private loadDefaultAddressIdFromStorage(): string | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data: AddressStorageData = JSON.parse(stored);
        return data.defaultAddressId || null;
      }
    } catch (error) {
      console.error('Error loading default address ID:', error);
    }
    return null;
  }

  /**
   * Generar ID único para dirección
   */
  private generateAddressId(): string {
    return `addr-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Obtener ID del usuario autenticado
   */
  private getCurrentUserId(): string {
    const user = this.authService.user();
    return user?.id || '';
  }

  /**
   * Agregar nueva dirección
   */
  addAddress(input: CreateAddressInput, setAsDefault: boolean = false): void {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.addressError.set(USER_MESSAGES.ADDRESS.MUST_BE_AUTHENTICATED);
      return;
    }

    const newAddress: Address = {
      id: this.generateAddressId(),
      userId,
      ...input,
      isDefault: setAsDefault || this.addresses().length === 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Actualizar lista de direcciones (inmutable)
    this.addresses.update(addrs => [...addrs, newAddress]);

    // Actualizar dirección predeterminada si es necesario
    if (newAddress.isDefault) {
      this.defaultAddressId.set(newAddress.id);
    }

    this.addressError.set(null);
  }

  /**
   * Actualizar dirección existente
   */
  updateAddress(id: string, input: UpdateAddressInput): void {
    const address = this.addresses().find(a => a.id === id);
    if (!address) {
      this.addressError.set(USER_MESSAGES.ADDRESS.NOT_FOUND);
      return;
    }

    // Actualizar lista inmutablemente
    this.addresses.update(addrs =>
      addrs.map(addr =>
        addr.id === id
          ? {
            ...addr,
            ...input,
            updatedAt: Date.now()
          }
          : addr
      )
    );

    // Si se actualiza la dirección predeterminada
    if (input.isDefault) {
      this.setDefaultAddress(id);
    }

    this.addressError.set(null);
  }

  /**
   * Eliminar dirección
   */
  deleteAddress(id: string): void {
    const addressToDelete = this.addresses().find(a => a.id === id);
    if (!addressToDelete) {
      this.addressError.set(USER_MESSAGES.ADDRESS.NOT_FOUND);
      return;
    }

    // Eliminar de la lista
    this.addresses.update(addrs => addrs.filter(a => a.id !== id));

    // Si era la dirección predeterminada, establecer la primera disponible
    if (this.defaultAddressId() === id) {
      const remaining = this.addresses();
      if (remaining.length > 0) {
        this.defaultAddressId.set(remaining[0].id);
      } else {
        this.defaultAddressId.set(null);
      }
    }

    this.addressError.set(null);
  }

  /**
   * Establecer dirección como predeterminada
   */
  setDefaultAddress(id: string): void {
    if (!this.addresses().find(a => a.id === id)) {
      this.addressError.set(USER_MESSAGES.ADDRESS.NOT_FOUND);
      return;
    }

    // Actualizar todas las direcciones: solo una es predeterminada
    this.addresses.update(addrs =>
      addrs.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );

    // Actualizar ID predeterminado
    this.defaultAddressId.set(id);

    this.addressError.set(null);
  }

  /**
   * Obtener dirección por ID
   */
  getAddressById(id: string): Address | undefined {
    return this.addresses().find(a => a.id === id);
  }

  /**
   * Obtener todas las direcciones del usuario actual
   */
  getUserAddresses(): readonly Address[] {
    return this.addresses();
  }

  /**
   * Limpiar error
   */
  clearError(): void {
    this.addressError.set(null);
  }

  /**
   * Limpiar todas las direcciones (logout)
   */
  clearAddresses(): void {
    this.addresses.set([]);
    this.defaultAddressId.set(null);
  }
}
