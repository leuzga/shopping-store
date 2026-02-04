import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactUsFacade } from '../../facades/contact-us.facade';

@Component({
  selector: 'app-contact-us-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-us-page.component.html',
  styleUrl: './contact-us-page.component.css'
})
export class ContactUsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(ContactUsFacade);

  protected readonly labels = this.facade.labels;

  protected readonly contactForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]]
  });

  protected onSubmit(): void {
    if (this.contactForm.valid) {
      this.facade.sendMessage(this.contactForm.value);
      this.contactForm.reset();
      // Add success feedback if needed
    }
  }
}
