import { Component } from '@angular/core';
import { UI_LABELS } from '../../core/constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  protected readonly footerLabel = UI_LABELS.footer;
}
