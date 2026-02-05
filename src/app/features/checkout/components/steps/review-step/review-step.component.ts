import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutFacadeService } from '../../../services/checkout-facade.service';
import { CartService } from '../../../../cart/services/cart.service';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-step.component.html',
  styleUrl: './review-step.component.css'
})
export class ReviewStepComponent {
  private readonly checkoutFacade = inject(CheckoutFacadeService);
  readonly cartService = inject(CartService);

  readonly discountCodeInput = signal<string>('');
  readonly discountError = signal<string | null>(null);
  readonly discountSuccess = signal<string | null>(null);

  readonly items = this.cartService.items;
  readonly appliedDiscountCode = this.checkoutFacade.appliedDiscountCode;

  applyDiscount(): void {
    const code = this.discountCodeInput();
    if (!code) return;

    const result = this.checkoutFacade.applyDiscountCode(code);

    if (result.success) {
      this.discountSuccess.set(result.message);
      this.discountError.set(null);
      this.discountCodeInput.set('');
    } else {
      this.discountError.set(result.message);
      this.discountSuccess.set(null);
    }
  }

  removeDiscount(): void {
    this.checkoutFacade.removeDiscountCode();
    this.discountSuccess.set(null);
    this.discountError.set(null);
  }

  nextStep(): void {
    this.checkoutFacade.goToStep('shipping');
  }
}
