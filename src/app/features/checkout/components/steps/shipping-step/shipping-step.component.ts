import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutFacadeService } from '../../../services/checkout-facade.service';
import { ShippingAddress, ShippingMethod } from '../../../../../core/models/order.model';

@Component({
  selector: 'app-shipping-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipping-step.component.html',
  styleUrl: './shipping-step.component.css'
})
export class ShippingStepComponent {
  private readonly checkoutFacade = inject(CheckoutFacadeService);

  readonly shippingMethods = this.checkoutFacade.SHIPPING_METHODS;
  readonly selectedMethod = this.checkoutFacade.selectedShippingMethod;

  // Form state
  readonly addressForm = signal<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Chile' // Default
  });

  readonly isFormValid = computed(() => {
    const form = this.addressForm();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return !!(
      form.firstName?.trim() &&
      form.lastName?.trim() &&
      form.email?.trim() &&
      emailRegex.test(form.email) &&
      form.address?.trim() &&
      form.city?.trim() &&
      form.state?.trim() &&
      form.zipCode?.trim() &&
      this.selectedMethod()
    );
  });

  selectMethod(method: ShippingMethod): void {
    this.checkoutFacade.setShippingMethod(method);
  }

  updateField(field: keyof ShippingAddress, value: any): void {
    this.addressForm.update(prev => ({ ...prev, [field]: value }));
  }

  prevStep(): void {
    this.checkoutFacade.goToStep('review');
  }

  nextStep(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.checkoutFacade.setShippingAddress(this.addressForm());
    this.checkoutFacade.goToStep('payment');
  }
}
