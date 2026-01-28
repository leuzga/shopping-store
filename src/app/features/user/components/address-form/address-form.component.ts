import { Component, inject, signal, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateAddressInput, Address } from '@features/user/models/address.model';
import { USER_MESSAGES, COMMON_MESSAGES } from '@core/constants/messages';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card bg-base-100 shadow-xl border border-base-200 overflow-visible">
      <div class="card-body p-6">
        <h2 class="text-2xl font-bold mb-6 text-base-content flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ title() }}
        </h2>

        <form [formGroup]="addressForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Street -->
          <div class="form-control md:col-span-2">
            <label class="label">
              <span class="label-text font-semibold">{{ messages.STREET }}</span>
              @if (isFieldInvalid('street')) {
                <span class="label-text-alt text-error animate-fade-in">{{ commonMessages.REQUIRED_FIELDS }}</span>
              }
            </label>
            <input 
              type="text" 
              formControlName="street"
              [placeholder]="placeholders.STREET"
              class="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
              [class.input-error]="isFieldInvalid('street')"
            />
          </div>

          <!-- City -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">{{ messages.CITY }}</span>
            </label>
            <input 
              type="text" 
              formControlName="city"
              [placeholder]="placeholders.CITY"
              class="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
              [class.input-error]="isFieldInvalid('city')"
            />
          </div>

          <!-- State -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">{{ messages.STATE }}</span>
            </label>
            <input 
              type="text" 
              formControlName="state"
              [placeholder]="placeholders.STATE"
              class="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
              [class.input-error]="isFieldInvalid('state')"
            />
          </div>

          <!-- Zipcode -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">{{ messages.ZIPCODE }}</span>
            </label>
            <input 
              type="text" 
              formControlName="zipcode"
              [placeholder]="placeholders.ZIPCODE"
              class="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
              [class.input-error]="isFieldInvalid('zipcode')"
            />
          </div>

          <!-- Country -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">{{ messages.COUNTRY }}</span>
            </label>
            <input 
              type="text" 
              formControlName="country"
              [placeholder]="placeholders.COUNTRY"
              class="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
              [class.input-error]="isFieldInvalid('country')"
            />
          </div>

          <!-- Phone -->
          <div class="form-control md:col-span-2">
            <label class="label">
              <span class="label-text font-semibold">{{ messages.PHONE }}</span>
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input 
                type="tel" 
                formControlName="phone"
                [placeholder]="placeholders.PHONE"
                class="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20"
                [class.input-error]="isFieldInvalid('phone')"
              />
            </div>
          </div>

          <!-- Is Default (only for creating or if not already default) -->
          @if (!isDefaultAddress()) {
            <div class="form-control md:col-span-2">
              <label class="label cursor-pointer justify-start gap-4">
                <input 
                  type="checkbox" 
                  formControlName="isDefault"
                  class="checkbox checkbox-primary" 
                />
                <span class="label-text font-medium">{{ messages.DEFAULT }}</span>
              </label>
            </div>
          }

          <!-- Form Actions -->
          <div class="md:col-span-2 flex justify-end gap-3 mt-4">
            <button 
              type="button" 
              class="btn btn-ghost px-6" 
              (click)="onCancel()"
              [disabled]="isLoading()">
              {{ actions.CANCEL }}
            </button>
            <button 
              type="submit" 
              class="btn btn-primary px-10 relative" 
              [disabled]="addressForm.invalid || isLoading()">
              @if (isLoading()) {
                <span class="loading loading-spinner loading-sm"></span>
              } @else {
                {{ actions.SAVE }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
      animation: fadeIn 0.2s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class AddressFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Inputs & Outputs
  readonly initialData = input<Address | null>(null);
  readonly isLoading = input<boolean>(false);
  readonly submitted = output<CreateAddressInput & { isDefault?: boolean }>();
  readonly cancelled = output<void>();

  // Form
  readonly addressForm: FormGroup = this.fb.group({
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zipcode: ['', [Validators.required]],
    country: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    isDefault: [false]
  });

  // Messages Facade
  readonly messages = USER_MESSAGES.ADDRESS.LABELS;
  readonly placeholders = USER_MESSAGES.ADDRESS.PLACEHOLDERS;
  readonly actions = COMMON_MESSAGES.ACTIONS;
  readonly commonMessages = COMMON_MESSAGES.VALIDATION;

  // Computed signals
  readonly title = signal<string>('');
  readonly isDefaultAddress = signal<boolean>(false);

  ngOnInit(): void {
    const data = this.initialData();
    if (data) {
      this.addressForm.patchValue(data);
      this.title.set(USER_MESSAGES.ADDRESS.TITLES.EDIT);
      this.isDefaultAddress.set(data.isDefault);
    } else {
      this.title.set(USER_MESSAGES.ADDRESS.TITLES.NEW);
      this.isDefaultAddress.set(false);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addressForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      this.submitted.emit(this.addressForm.value);
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
