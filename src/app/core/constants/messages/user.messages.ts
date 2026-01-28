/**
 * Mensajes de Usuario
 *
 * Mensajes relacionados con perfil, dirección y avatar
 */

export const USER_MESSAGES = {
  // Errores generales
  ERRORS: {
    NOT_AUTHENTICATED: 'No hay usuario autenticado'
  },

  // Perfil
  PROFILE: {
    UPDATE_SUCCESS: 'Perfil actualizado correctamente',
    UPDATE_ERROR: 'Error al actualizar perfil',
    LOADING: 'Cargando perfil...'
  },

  // Avatar
  AVATAR: {
    // UI Labels y textos del modal
    MODAL_TITLE: 'Actualizar Avatar',
    UPLOAD_TAB: 'Subir Foto',
    URL_TAB: 'URL de Imagen',
    SELECT_IMAGE: 'Selecciona una imagen',
    FILE_SIZE_INFO: 'Máximo 5MB - JPG, PNG, GIF, WebP',
    ENTER_URL: 'Ingresa URL de imagen',
    URL_HELPER: 'URL completa válida (http:// o https://)',
    LOAD_BUTTON: 'Cargar Imagen',
    SAVE_BUTTON: 'Guardar Avatar',
    // Cropper UI messages
    CROPPER_INSTRUCTION: 'Arrastra el círculo para seleccionar tu avatar',
    CROPPER_HELP: 'El área dentro del círculo será tu foto de perfil',
    PREVIEW_LABEL: 'Vista previa del avatar final',
    // Mensajes de estado
    UPDATE_SUCCESS: 'Avatar actualizado correctamente',
    UPDATE_ERROR: 'Error al actualizar avatar',
    INVALID_FILE: 'Por favor selecciona una imagen válida',
    FILE_TOO_LARGE: 'La imagen no debe exceder 5MB',
    READ_ERROR: 'Error al leer la imagen',
    INVALID_URL: 'URL inválida',
    NO_IMAGE: 'Por favor selecciona o ingresa una imagen'
  },

  // Direcciones
  ADDRESS: {
    ADD_SUCCESS: 'Dirección agregada correctamente',
    ADD_ERROR: 'Error al agregar dirección',
    UPDATE_SUCCESS: 'Dirección actualizada correctamente',
    UPDATE_ERROR: 'Error al actualizar dirección',
    DELETE_SUCCESS: 'Dirección eliminada correctamente',
    DELETE_ERROR: 'Error al eliminar dirección',
    DELETE_CONFIRMATION: '¿Deseas eliminar esta dirección?',
    SET_DEFAULT_SUCCESS: 'Dirección por defecto actualizada',
    SET_DEFAULT_ERROR: 'Error al establecer dirección por defecto',
    NOT_FOUND: 'Dirección no encontrada',
    NO_ADDRESSES: 'No tienes direcciones guardadas',
    MUST_BE_AUTHENTICATED: 'Debe estar autenticado para agregar direcciones',
    // Labels del formulario
    LABELS: {
      STREET: 'Calle / Dirección',
      CITY: 'Ciudad',
      STATE: 'Estado / Provincia',
      ZIPCODE: 'Código Postal',
      COUNTRY: 'País',
      PHONE: 'Teléfono de contacto',
      DEFAULT: 'Establecer como predeterminada'
    },
    // Placeholders
    PLACEHOLDERS: {
      STREET: 'Ej. Av. Siempreviva 123',
      CITY: 'Ej. Springfield',
      STATE: 'Ej. Illinois',
      ZIPCODE: 'Ej. 62704',
      COUNTRY: 'Ej. Estados Unidos',
      PHONE: 'Ej. +52 1 555 123 4567'
    },
    // Títulos de sección
    TITLES: {
      NEW: 'Nueva Dirección',
      EDIT: 'Editar Dirección',
      LIST: 'Mis Direcciones'
    }
  }
} as const;
