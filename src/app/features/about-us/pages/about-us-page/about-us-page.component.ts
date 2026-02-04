import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AboutUsFacade } from '../../facades/about-us.facade';

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.css'
})
export class AboutUsPageComponent {
  private readonly facade = inject(AboutUsFacade);

  protected readonly labels = this.facade.labels;
  protected readonly heroImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070';
}
