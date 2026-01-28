import { Component, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Review } from '@core/models';
import { ProductModalService } from '../../services/product-modal.service';

/**
 * ProductReviewsModalComponent
 * Responsabilidad única: Renderizar modal de reseñas de producto
 *
 * - Usa ProductModalService para estado centralizado
 * - No recibe @input, lee directamente del servicio
 * - Modal se renderiza una sola vez en la página (no en cada tarjeta)
 * - Posicionamiento fixed a nivel de app, no afectado por scroll
 */
@Component({
  selector: 'app-product-reviews-modal',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    @if (modalService.isOpen()) {
      <!-- Modal Backdrop -->
      <div
        class="modal-backdrop"
        (click)="onBackdropClick()"></div>

      <!-- Modal Container - Centered on viewport -->
      <div class="modal-container">
        <div class="modal-box animate-fade-in">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-header-text">
                <h3 class="modal-title">{{ modalService.selectedProduct()?.title }}</h3>
                <div class="modal-rating-group">
                  <div class="rating rating-sm">
                    @for (star of [1,2,3,4,5]; track $index) {
                      <div class="star-item" [class.opacity-20]="$index + 1 > (modalService.selectedProduct()?.rating?.rate || 0)"></div>
                    }
                  </div>
                  <span class="rating-value">{{ modalService.selectedProduct()?.rating?.rate || 0 }}</span>
                  <span class="rating-count">({{ modalService.selectedProduct()?.rating?.count || 0 }})</span>
                </div>
              </div>
              <button
                class="btn btn-ghost btn-circle btn-sm flex-shrink-0"
                (click)="modalService.close()"
                aria-label="Close modal">
                ✕
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <!-- Rating Breakdown -->
            <section>
              <h4 class="section-title">Distribución de Calificaciones</h4>
              <div class="rating-stats-group">
                @for (stat of ratingStats(); track stat.stars) {
                  <div class="rating-stat-row">
                    <span class="rating-stat-label">{{ stat.stars }} estrellas</span>
                    <progress
                      class="progress progress-warning flex-1 h-2"
                      [value]="stat.percentage"
                      max="100"></progress>
                    <span class="rating-stat-count">{{ stat.count }}</span>
                  </div>
                }
              </div>
            </section>

            <!-- Reviews List -->
            <section>
              <div class="reviews-header">
                <h4 class="section-title">Opiniones de Usuarios</h4>
                <span class="reviews-subtitle">Más recientes primero</span>
              </div>

              <div class="reviews-list">
                @for (review of sortedReviews(); track $index) {
                  <div class="review-item">
                    <div class="review-header">
                      <div class="review-info">
                        <div class="review-name">{{ review.reviewerName }}</div>
                        <div class="rating rating-xs block mt-1">
                          @for (rStar of [1,2,3,4,5]; track $index) {
                            <div class="star-item" [class.opacity-20]="$index + 1 > review.rating"></div>
                          }
                        </div>
                      </div>
                      <span class="review-date">{{ review.date | date:'dd MMM' }}</span>
                    </div>
                    <p class="review-comment">"{{ review.comment }}"</p>
                  </div>
                } @empty {
                  <div class="reviews-empty">
                    <p>No hay comentarios para este producto.</p>
                  </div>
                }
              </div>
            </section>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button
              class="btn btn-xs sm:btn-sm btn-ghost capitalize"
              (click)="modalService.close()">
              Cerrar Reseñas
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      @apply contents;
    }

    /* Modal Backdrop - Semi-transparent overlay */
    .modal-backdrop {
      @apply fixed inset-0 bg-black/50 z-40 animate-fade-in;
    }

    /* Modal Container - Fixed to viewport, centered */
    .modal-container {
      @apply fixed inset-0 z-50 flex items-center justify-center p-4;
    }

    /* Modal Box - Responsive sizing */
    .modal-box {
      @apply w-full max-w-2xl max-h-[90vh] bg-base-100 rounded-2xl border border-base-200 shadow-2xl overflow-hidden flex flex-col;
    }

    /* Header */
    .modal-header {
      @apply p-4 sm:p-6 border-b border-base-200 bg-base-200/30 flex-shrink-0;
    }

    .modal-header-content {
      @apply flex justify-between items-start gap-2;
    }

    .modal-header-text {
      @apply flex-1 min-w-0;
    }

    .modal-title {
      @apply text-lg sm:text-xl font-black text-base-content tracking-tight mb-2 line-clamp-2;
    }

    .modal-rating-group {
      @apply flex items-center gap-2 flex-wrap;
    }

    .star-item {
      @apply mask mask-star-2 bg-warning w-4 h-4;
    }

    .rating.rating-xs .star-item {
      @apply w-3 h-3;
    }

    .rating-value {
      @apply text-xs sm:text-sm font-bold text-base-content;
    }

    .rating-count {
      @apply text-xs text-base-content/60;
    }

    /* Content Area */
    .modal-content {
      @apply p-4 sm:p-6 space-y-6 sm:space-y-8 flex-1 overflow-y-auto;
    }

    .section-title {
      @apply text-xs sm:text-sm font-bold uppercase tracking-wider text-base-content/50 mb-4 px-1;
    }

    /* Rating Stats */
    .rating-stats-group {
      @apply space-y-2 sm:space-y-3;
    }

    .rating-stat-row {
      @apply flex items-center gap-2 sm:gap-4;
    }

    .rating-stat-label {
      @apply text-xs font-bold w-16 sm:w-20;
    }

    .rating-stat-count {
      @apply text-xs text-base-content/60 w-8 sm:w-10 text-right;
    }

    /* Reviews Section */
    .reviews-header {
      @apply flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 px-1;
    }

    .reviews-subtitle {
      @apply text-xs text-base-content/40 hidden sm:inline;
    }

    .reviews-list {
      @apply space-y-3 sm:space-y-4;
    }

    .review-item {
      @apply p-3 sm:p-4 rounded-xl bg-base-200/50 border border-base-300 transition-colors hover:bg-base-200;
    }

    .review-header {
      @apply flex justify-between items-start mb-2 gap-2;
    }

    .review-info {
      @apply flex-1 min-w-0;
    }

    .review-name {
      @apply font-bold text-xs sm:text-sm text-base-content truncate;
    }

    .review-date {
      @apply text-[10px] text-base-content/40 font-medium px-2 py-1 bg-base-300 rounded-full whitespace-nowrap flex-shrink-0;
    }

    .review-comment {
      @apply text-xs sm:text-sm italic text-base-content/80 leading-relaxed line-clamp-3;
    }

    .reviews-empty {
      @apply text-center py-8 sm:py-12 bg-base-200/30 rounded-2xl border-2 border-dashed border-base-300;
    }

    .reviews-empty p {
      @apply text-xs sm:text-sm text-base-content/40 font-medium;
    }

    /* Footer */
    .modal-footer {
      @apply p-4 bg-base-200/30 border-t border-base-200 text-center flex-shrink-0;
    }

    /* Scrollbar */
    .modal-content::-webkit-scrollbar {
      width: 6px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.1);
      border-radius: 10px;
    }
  `]
})
export class ProductReviewsModalComponent {
  readonly modalService = inject(ProductModalService);

  /**
   * Pure function: Calculate rating statistics from product reviews
   * Responsibility: Data transformation only
   */
  readonly ratingStats = computed(() => {
    const product = this.modalService.selectedProduct();
    if (!product) return [];

    const reviews = product.reviews || [];
    const stats = [5, 4, 3, 2, 1].map(stars => {
      const count = reviews.filter((r: Review) => Math.round(r.rating) === stars).length;
      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
      return { stars, count, percentage };
    });
    return stats;
  });

  /**
   * Pure function: Sort reviews by date (newest first)
   * Responsibility: Data transformation only
   */
  readonly sortedReviews = computed(() => {
    const product = this.modalService.selectedProduct();
    if (!product) return [];

    const reviews = product.reviews || [];
    return [...reviews].sort((a: Review, b: Review) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  /**
   * Event handler: Close modal when clicking backdrop
   */
  onBackdropClick(): void {
    this.modalService.close();
  }
}
