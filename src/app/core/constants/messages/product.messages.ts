/**
 * Mensajes de Productos
 */
export const PRODUCT_MESSAGES = {
  TITLES: {
    LIST: 'Catálogo de Productos',
    DETAILS: 'Detalles del Producto',
    SEARCH_RESULTS: 'Resultados de Búsqueda'
  },
  LABELS: {
    PRICE: 'Precio',
    CATEGORY: 'Categoría',
    RATING: 'Calificación',
    REVIEWS: 'Reseñas',
    LOAD_MORE: 'Cargar más productos',
    ADD_TO_CART: 'Agregar al carrito',
    VIEW_DETAILS: 'Ver detalles',
    PAGE_INFO: (current: number, total: number) => `Página ${current} / ${total}`
  },
  STATUS: {
    LOADING: 'Cargando productos...',
    LOADING_PRODUCT: 'Cargando producto...',
    NO_PRODUCTS: 'No se encontraron productos.',
    PRODUCT_NOT_FOUND: 'Producto no encontrado',
    ERROR_LOADING: 'Error al cargar los productos. Por favor intenta de nuevo.',
    END_OF_LIST: 'Has llegado al final del catálogo.'
  },
  UNIT: {
    PRODUCTS: 'productos'
  },
  FILTERS: {
    LABEL: 'Filtrar por categoría',
    DEFAULT: 'Sin filtro',
  },
  SORTS: {
    LABEL: 'Ordenar por',
    DEFAULT: 'Sin orden',
    BY_ALPHABETIC: 'Alfabético (A-Z)',
    BY_PRICE: 'Precio',
    BY_RATING: 'Calificación (Mayor a Menor)',
  }
} as const;
