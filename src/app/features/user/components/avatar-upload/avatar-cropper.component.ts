import { Component, inject, signal, output, input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { USER_MESSAGES, COMMON_MESSAGES } from '@core/constants/messages';

@Component({
  selector: 'app-avatar-cropper',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent],
  template: `
    <div class="flex flex-col gap-4">
      <!-- Tabs -->
      <div class="tabs tabs-boxed bg-base-200 p-1">
        <button 
          class="tab flex-1 transition-all duration-200" 
          [class.tab-active]="activeTab() === 'file'"
          (click)="setActiveTab('file')">
          {{ uploadTab() }}
        </button>
        <button 
          class="tab flex-1 transition-all duration-200" 
          [class.tab-active]="activeTab() === 'url'"
          (click)="setActiveTab('url')">
          {{ urlTab() }}
        </button>
      </div>

      <!-- File Input -->
      @if (activeTab() === 'file') {
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-medium">{{ selectImage() }}</span>
          </label>
          <input 
            type="file" 
            class="file-input file-input-bordered file-input-primary w-full"
            (change)="onFileSelected($event)" 
            accept="image/*" />
          <p class="mt-2 text-xs text-base-content/60">{{ fileSizeInfo() }}</p>
        </div>
      }

      <!-- URL Input -->
      @if (activeTab() === 'url') {
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-medium">{{ enterUrl() }}</span>
          </label>
          <div class="join">
            <input 
              type="text" 
              class="input input-bordered join-item w-full focus:outline-none" 
              [ngModel]="imageUrl()"
              (ngModelChange)="imageUrl.set($event)"
              placeholder="https://example.com/image.jpg" />
            <button 
              class="btn btn-primary join-item" 
              (click)="loadImageFromUrl()"
              [disabled]="!imageUrl().trim()">
              {{ loadButton() }}
            </button>
          </div>
          <p class="mt-2 text-xs text-base-content/60">{{ urlHelper() }}</p>
        </div>
      }

      <!-- Cropper -->
      @if (showCropper()) {
        <div class="mt-4 flex flex-col items-center gap-4">
          <p class="text-sm font-medium text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ cropperInstruction() }}
          </p>
          
          <div class="cropper-wrapper w-full max-h-[400px] overflow-hidden rounded-xl border-2 border-dashed border-base-300 bg-base-200">
            <image-cropper
              [imageChangedEvent]="imageChangedEvent()"
              [imageURL]="imageUrlForCropper()"
              [maintainAspectRatio]="true"
              [aspectRatio]="1"
              [roundCropper]="true"
              [alignImage]="'center'"
              [output]="'base64'"
              [format]="'png'"
              [imageQuality]="92"
              (imageCropped)="onImageCropped($event)"
              (imageLoaded)="onImageLoaded($event)"
              (cropperReady)="onCropperReady()"
              (loadImageFailed)="onLoadImageFailed()"
            ></image-cropper>
          </div>
        </div>
      }

      <!-- Preview -->
      @if (croppedImage()) {
        <div class="mt-6 flex flex-col items-center gap-2 py-4 border-y border-base-200">
          <span class="text-sm font-bold opacity-70">{{ previewLabel() }}</span>
          <div class="avatar">
            <div class="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img [src]="croppedImage()" alt="Preview" />
            </div>
          </div>
        </div>
      }

      <!-- Actions -->
      <div class="mt-6 flex justify-end gap-3">
        <button class="btn btn-ghost" (click)="onCancel()">{{ cancelButton() }}</button>
        <button 
          class="btn btn-primary px-8" 
          (click)="onSave()" 
          [disabled]="!croppedImage()">
          {{ saveButton() }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .cropper-wrapper ::ng-deep .ngx-ic-cropper {
      max-height: 400px;
    }
  `]
})
export class AvatarCropperComponent implements OnDestroy {
  // Services
  private readonly sanitizer = inject(DomSanitizer);

  // Outputs
  readonly imageSaved = output<string>();
  readonly cancelled = output<void>();

  // State Signals
  readonly activeTab = signal<'file' | 'url'>('file');
  readonly imageChangedEvent = signal<Event | null>(null);
  readonly imageUrl = signal<string>('');
  readonly imageUrlForCropper = signal<string>('');
  readonly croppedImage = signal<SafeUrl | null>(null);
  readonly showCropper = signal<boolean>(false);

  // Message Signals
  readonly uploadTab = signal(USER_MESSAGES.AVATAR.UPLOAD_TAB);
  readonly urlTab = signal(USER_MESSAGES.AVATAR.URL_TAB);
  readonly selectImage = signal(USER_MESSAGES.AVATAR.SELECT_IMAGE);
  readonly fileSizeInfo = signal(USER_MESSAGES.AVATAR.FILE_SIZE_INFO);
  readonly enterUrl = signal(USER_MESSAGES.AVATAR.ENTER_URL);
  readonly urlHelper = signal(USER_MESSAGES.AVATAR.URL_HELPER);
  readonly loadButton = signal(USER_MESSAGES.AVATAR.LOAD_BUTTON);
  readonly cropperInstruction = signal(USER_MESSAGES.AVATAR.CROPPER_INSTRUCTION);
  readonly previewLabel = signal(USER_MESSAGES.AVATAR.PREVIEW_LABEL);
  readonly saveButton = signal(USER_MESSAGES.AVATAR.SAVE_BUTTON);
  readonly cancelButton = signal(COMMON_MESSAGES.ACTIONS.CANCEL);

  ngOnDestroy() {
    this.reset();
  }

  setActiveTab(tab: 'file' | 'url') {
    this.activeTab.set(tab);
    this.reset();
  }

  onFileSelected(event: Event) {
    this.imageChangedEvent.set(event);
    this.showCropper.set(true);
  }

  loadImageFromUrl() {
    const url = this.imageUrl().trim();
    if (!url) return;

    this.imageUrlForCropper.set(url);
    this.showCropper.set(true);
    this.imageChangedEvent.set(null);
  }

  onImageCropped(event: ImageCroppedEvent) {
    const previewUrl = event.objectUrl || event.base64;

    if (previewUrl) {
      this.croppedImage.set(this.sanitizer.bypassSecurityTrustUrl(previewUrl));
      // Store the base64 or objectUrl for saving
      this.currentImageBase64 = event.base64 || event.objectUrl || '';
    }
  }

  private currentImageBase64: string = '';

  onImageLoaded(image: LoadedImage) {
    console.log('Image loaded');
  }

  onCropperReady() {
    console.log('Cropper ready');
  }

  onLoadImageFailed() {
    alert(USER_MESSAGES.AVATAR.READ_ERROR);
    this.reset();
  }

  onCancel() {
    this.reset();
    this.cancelled.emit();
  }

  onSave() {
    if (this.currentImageBase64) {
      this.imageSaved.emit(this.currentImageBase64);
      this.reset();
    }
  }

  private reset() {
    this.imageChangedEvent.set(null);
    this.imageUrl.set('');
    this.imageUrlForCropper.set('');
    this.croppedImage.set(null);
    this.showCropper.set(false);
    this.currentImageBase64 = '';
  }
}
