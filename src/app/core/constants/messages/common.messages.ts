/**
 * Mensajes Comunes
 *
 * Mensajes reutilizables en toda la aplicación
 */

export const COMMON_MESSAGES = {
  // Acciones
  ACTIONS: {
    SAVE: 'Guardar',
    CANCEL: 'Cancelar',
    EDIT: 'Editar',
    DELETE: 'Eliminar',
    CONFIRM: 'Confirmar',
    CLOSE: 'Cerrar',
    BACK: 'Volver',
    BACK_TO_LIST: 'Volver a la lista',
    LOADING: 'Cargando...',
    RETRY: 'Reintentar'
  },

  // Confirmaciones
  CONFIRM: {
    DELETE: '¿Estás seguro de que deseas eliminar esto?',
    DELETE_ADDRESS: '¿Deseas eliminar esta dirección?',
    DELETE_ACCOUNT: '¿Deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
  },

  // Estados
  STATUS: {
    LOADING: 'Cargando...',
    SUCCESS: 'Operación completada',
    ERROR: 'Error en la operación',
    WARNING: 'Advertencia',
    INFO: 'Información'
  },

  // Errores generales
  ERRORS: {
    UNKNOWN: 'Error desconocido',
    NETWORK: 'Error de conexión',
    TIMEOUT: 'La solicitud tardó demasiado tiempo',
    SERVER_ERROR: 'Error del servidor',
    UNAUTHORIZED: 'No autorizado',
    FORBIDDEN: 'Acceso denegado',
    NOT_FOUND: 'No encontrado'
  },

  // Validación general
  VALIDATION: {
    REQUIRED_FIELDS: 'Por favor completa todos los campos requeridos',
    INVALID_FORM: 'Por favor revisa los errores del formulario',
    CHANGES_SAVED: 'Cambios guardados correctamente'
  }
} as const;
