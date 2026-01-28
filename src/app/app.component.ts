import { Component, effect, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CartDisplayComponent } from './features/cart/components/cart-display/cart-display.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent, FooterComponent, CartDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'shoping-store';

  // Signal to control page content opacity for transitions
  readonly contentOpacity = signal<number>(1);

  constructor(private router: Router) {
    // Setup route change detection for fade transition effect
    this.setupRouteTransitions();
  }

  /**
   * Setup fade transition when routes change
   */
  private setupRouteTransitions(): void {
    effect(() => {
      // Fade in when component loads
      this.contentOpacity.set(1);
    });
  }
}
