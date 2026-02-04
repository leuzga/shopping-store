import { Injectable, signal } from '@angular/core';
import { UI_LABELS, ContactUsLabels } from '../../../core/constants/ui.constants';

@Injectable({
  providedIn: 'root'
})
export class ContactUsFacade {
  private readonly _labels = signal<ContactUsLabels>(UI_LABELS.contactPage);

  public readonly labels = this._labels.asReadonly();

  // In a real app, this would handle form submission to a backend
  public sendMessage(formData: any): void {
    console.log('Simulando envío de correo:', formData);
    // Add logic for success/error handling as signals if needed
  }
}
