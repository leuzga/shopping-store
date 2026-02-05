import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutFacadeService } from '../../../services/checkout-facade.service';

@Component({
  selector: 'app-confirmation-step',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation-step.component.html',
  styleUrl: './confirmation-step.component.css'
})
export class ConfirmationStepComponent {
  private readonly checkoutFacade = inject(CheckoutFacadeService);
  protected readonly Math = Math;

  // Note: We'd typically get the last order from the facade or state
  // For this mock, we just show success. 
  // In a real app we might retrieve it by ID from localStorage here.
}
