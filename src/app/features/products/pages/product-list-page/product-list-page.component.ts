import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductReviewsModalComponent } from '../../components/product-reviews-modal/product-reviews-modal.component';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, ProductListComponent, ProductReviewsModalComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css',
})
export class ProductListPageComponent implements OnInit {
  readonly isVisible = signal(false);

  ngOnInit() {
    // Trigger fade-in animation after component is rendered
    setTimeout(() => {
      this.isVisible.set(true);
    }, 50);
  }
}
