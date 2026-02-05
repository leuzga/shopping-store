import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutFacadeService, CheckoutStep } from '../../services/checkout-facade.service';
import { ReviewStepComponent } from '../../components/steps/review-step/review-step.component';
import { ShippingStepComponent } from '../../components/steps/shipping-step/shipping-step.component';
import { PaymentStepComponent } from '../../components/steps/payment-step/payment-step.component';
import { ConfirmationStepComponent } from '../../components/steps/confirmation-step/confirmation-step.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReviewStepComponent,
    ShippingStepComponent,
    PaymentStepComponent,
    ConfirmationStepComponent
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css'
})
export class CheckoutPageComponent {
  readonly checkoutFacade = inject(CheckoutFacadeService);

  readonly currentStep = this.checkoutFacade.currentStep;
  readonly total = this.checkoutFacade.total;

  readonly steps: { id: CheckoutStep; label: string; icon: string }[] = [
    { id: 'review', label: 'Resumen', icon: '📋' },
    { id: 'shipping', label: 'Envío', icon: '🚚' },
    { id: 'payment', label: 'Pago', icon: '💳' },
    { id: 'confirmation', label: 'Éxito', icon: '✅' }
  ];

  isStepActive(stepId: CheckoutStep): boolean {
    return this.currentStep() === stepId;
  }

  isStepCompleted(stepId: CheckoutStep): boolean {
    const stepOrder: CheckoutStep[] = ['review', 'shipping', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(this.currentStep());
    const stepIndex = stepOrder.indexOf(stepId);
    return stepIndex < currentIndex;
  }

  goToStep(step: CheckoutStep): void {
    const stepOrder: CheckoutStep[] = ['review', 'shipping', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(this.currentStep());
    const targetIndex = stepOrder.indexOf(step);

    // Only allow going back or to previous completed steps, unless it's confirmation which is end-state
    if (targetIndex < currentIndex && this.currentStep() !== 'confirmation') {
      this.checkoutFacade.goToStep(step);
    }
  }
}
