import { Injectable, signal } from '@angular/core';
import { UI_LABELS, AboutUsLabels } from '../../../core/constants/ui.constants';

@Injectable({
  providedIn: 'root'
})
export class AboutUsFacade {
  private readonly _labels = signal<AboutUsLabels>(UI_LABELS.aboutPage);

  public readonly labels = this._labels.asReadonly();

  // In a real app with dynamic content, we could add methods to load data here
}
