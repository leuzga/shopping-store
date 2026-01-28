import { Product } from '@core/models/product.model';

/**
 * Pure utility functions for search, filtering, and sorting
 * These functions have no side effects and are fully testable in isolation
 *
 * Principles:
 * - No state mutations (returns new arrays)
 * - No external dependencies (pure parameters only)
 * - Deterministic (same input = same output)
 * - Single responsibility (one function = one transformation)
 */

/**
 * Pure function: Normalize search query for MiniSearch
 * - Trim whitespace
 * - Convert to lowercase
 * - Remove special characters (keep only word characters and spaces)
 *
 * @param query - Raw user input from search field
 * @returns Normalized query ready for MiniSearch
 *
 * Examples:
 * - "  Essence Mascara  " → "essence mascara"
 * - "iPad Pro!" → "ipad pro"
 * - "price > $50" → "price  50"
 */
export function normalizeSearchQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, '');
}

/**
 * Pure function: Apply category filter to products
 * - Filters by included categories (OR logic if multiple)
 * - Returns new array without mutation
 *
 * @param products - Array of products to filter
 * @param categories - Array of category names to include (case-sensitive)
 * @returns Filtered products matching any category
 *
 * Examples:
 * - applyFilters([ipad, essence, shirt], ['beauty']) → [essence]
 * - applyFilters([ipad, essence], []) → [ipad, essence] (no filter = all)
 * - applyFilters([ipad, essence], ['electronics', 'beauty']) → [ipad, essence]
 */
export function applyFilters(products: Product[], categories: readonly string[]): Product[] {
  if (categories.length === 0) {
    return products;
  }

  return products.filter(product =>
    categories.includes(product.category)
  );
}

/**
 * Pure function: Sort products alphabetically by title (A-Z)
 * - Case-insensitive
 * - Uses locale-aware comparison (Spanish 'es' locale)
 * - Does not mutate original array
 *
 * @param products - Array of products to sort
 * @returns New array sorted alphabetically by title
 *
 * Examples:
 * - sortByAlphabetic([essence, apple, shirt]) → [apple, essence, shirt]
 * - sortByAlphabetic([iPhone, iPad]) → [iPad, iPhone] (locale-aware)
 */
export function sortByAlphabetic(products: Product[]): Product[] {
  return [...products].sort((a, b) =>
    a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
  );
}

/**
 * Pure function: Sort products by price (ascending, lowest first)
 * - Handles missing price as 0
 * - Does not mutate original array
 *
 * @param products - Array of products to sort
 * @returns New array sorted by price ascending
 *
 * Examples:
 * - sortByPrice([{p: 50}, {p: 20}, {p: 30}]) → [{p: 20}, {p: 30}, {p: 50}]
 * - sortByPrice([{p: 50}, {p: null}]) → [{p: null}, {p: 50}]
 */
export function sortByPrice(products: Product[]): Product[] {
  return [...products].sort((a, b) =>
    (a.price || 0) - (b.price || 0)
  );
}

/**
 * Pure function: Sort products by rating (descending, highest first)
 * - Handles missing rating as 0
 * - Sorts by rate property of rating object
 * - Does not mutate original array
 *
 * @param products - Array of products to sort
 * @returns New array sorted by rating descending (highest first)
 *
 * Examples:
 * - sortByRating([{r: 4.5}, {r: 3.8}, {r: 4.2}]) → [{r: 4.5}, {r: 4.2}, {r: 3.8}]
 * - sortByRating([{r: 4.5}, {r: null}]) → [{r: 4.5}, {r: null}]
 */
export function sortByRating(products: Product[]): Product[] {
  return [...products].sort((a, b) =>
    (b.rating?.rate || 0) - (a.rating?.rate || 0)
  );
}

/**
 * Pure function: Apply sorting based on sort type
 * - Delegates to specific sort functions
 * - Returns unsorted array if sort type is 'none'
 *
 * @param products - Array of products to sort
 * @param sortType - Type of sorting to apply ('alphabetic' | 'price' | 'rating' | 'none')
 * @returns New array sorted according to type, or original if type is 'none'
 *
 * Examples:
 * - applySorting(products, 'alphabetic') → sorts A-Z
 * - applySorting(products, 'price') → sorts by price low-high
 * - applySorting(products, 'rating') → sorts by rating high-low
 * - applySorting(products, 'none') → returns unsorted
 */
export function applySorting(
  products: Product[],
  sortType: 'alphabetic' | 'price' | 'rating' | 'none'
): Product[] {
  switch (sortType) {
    case 'alphabetic':
      return sortByAlphabetic(products);
    case 'price':
      return sortByPrice(products);
    case 'rating':
      return sortByRating(products);
    case 'none':
    default:
      return products;
  }
}

/**
 * Pure function: Apply complete transformation pipeline
 * Combines filtering and sorting in correct order
 *
 * @param products - Input products
 * @param categories - Categories to filter by
 * @param sortType - Type of sorting to apply
 * @returns Filtered and sorted products
 *
 * Execution order:
 * 1. Filter by categories (reduce quantity)
 * 2. Apply sorting (reorganize)
 *
 * Examples:
 * - transform(allProducts, ['beauty'], 'price') → beauty products sorted by price
 * - transform(allProducts, [], 'alphabetic') → all products sorted A-Z
 */
export function transformProducts(
  products: Product[],
  categories: readonly string[],
  sortType: 'alphabetic' | 'price' | 'rating' | 'none'
): Product[] {
  // Step 1: Apply filters
  const filtered = applyFilters(products, categories);

  // Step 2: Apply sorting
  return applySorting(filtered, sortType);
}
