import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutFacadeService } from '../../../services/checkout-facade.service';
import { PaymentInfo } from '../../../../../core/models/order.model';

@Component({
  selector: 'app-payment-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-step.component.html',
  styleUrl: './payment-step.component.css'
})
export class PaymentStepComponent {
  private readonly checkoutFacade = inject(CheckoutFacadeService);

  readonly isProcessing = signal<boolean>(false);

  readonly paymentForm = signal<Partial<PaymentInfo>>({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  readonly isFormValid = computed(() => {
    const form = this.paymentForm();
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const cardNumberDigits = form.cardNumber?.replace(/\D/g, '');
    const cvvDigits = form.cvv?.replace(/\D/g, '');

    return !!(
      form.cardHolder?.trim() &&
      cardNumberDigits && cardNumberDigits.length >= 15 && cardNumberDigits.length <= 16 &&
      form.expiryDate && expiryRegex.test(form.expiryDate) &&
      cvvDigits && (cvvDigits.length === 3 || cvvDigits.length === 4)
    );
  });

  updateField(field: keyof PaymentInfo, value: any): void {
    this.paymentForm.update(prev => ({ ...prev, [field]: value }));
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    this.updateField('cardNumber', formatted.substring(0, 19));
  }

  formatExpiry(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.updateField('expiryDate', value.substring(0, 5));
  }

  prevStep(): void {
    this.checkoutFacade.goToStep('shipping');
  }

  async processPayment(): Promise<void> {
    if (!this.isFormValid() || this.isProcessing()) return;

    this.isProcessing.set(true);
    this.checkoutFacade.setPaymentInfo(this.paymentForm());

    try {
      await this.checkoutFacade.processOrder();
    } catch (error) {
      console.error('Payment processing failed', error);
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      this.isProcessing.set(false);
    }
  }
}
