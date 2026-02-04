import { Component, signal, inject, computed } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { UI_LABELS, FooterLabels } from '../../core/constants/ui.constants';
import { FOOTER_DATA } from '../../core/constants/footer.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly labels = signal<FooterLabels>(UI_LABELS.footer);
  protected readonly data = signal(FOOTER_DATA);

  protected readonly brands = computed(() =>
    this.data().brands.map((brand, index) => ({
      ...brand,
      displayName: this.labels().brands[index] || brand.name,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(brand.icon)
    }))
  );

  protected readonly socials = computed(() =>
    this.data().socials.map(social => ({
      ...social,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(social.icon)
    }))
  );
}
