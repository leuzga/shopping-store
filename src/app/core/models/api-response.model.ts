/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  readonly data: T;
  readonly status: number;
  readonly message?: string;
}

/**
 * Paginated API response (Compatible with DummyJSON)
 */
export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * API error response
 */
export interface ApiError {
  readonly status: number;
  readonly message: string;
  readonly errors?: readonly string[];
}

/**
 * Loading state for async operations
 */
export interface LoadingState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
}

/**
 * Create initial loading state
 */
export const createInitialLoadingState = <T>(): LoadingState<T> => ({
  data: null,
  loading: false,
  error: null,
});
