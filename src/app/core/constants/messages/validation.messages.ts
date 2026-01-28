/**
 * Mensajes de Validación de Formularios
 *
 * Todos los mensajes de validación centralizados
 * Estructura: [CAMPO][VALIDADOR] = mensaje
 */

export const VALIDATION_MESSAGES = {
  // Campo: Email
  EMAIL: {
    REQUIRED: 'Email es requerido',
    INVALID: 'Email inválido',
    UNIQUE: 'Email ya está registrado'
  },

  // Campo: Contraseña
  PASSWORD: {
    REQUIRED: 'Contraseña es requerida',
    MIN_LENGTH: 'Mínimo 6 caracteres',
    WEAK: 'Contraseña muy débil',
    MATCH: 'Las contraseñas no coinciden'
  },

  // Campo: Confirmar Contraseña
  CONFIRM_PASSWORD: {
    REQUIRED: 'Confirmar contraseña es requerido',
    MISMATCH: 'Las contraseñas no coinciden'
  },

  // Campo: Nombre
  FIRST_NAME: {
    REQUIRED: 'Nombre es requerido',
    MIN_LENGTH: 'Mínimo 2 caracteres',
    MAX_LENGTH: 'Máximo 50 caracteres'
  },

  // Campo: Apellido
  LAST_NAME: {
    REQUIRED: 'Apellido es requerido',
    MIN_LENGTH: 'Mínimo 2 caracteres',
    MAX_LENGTH: 'Máximo 50 caracteres'
  },

  // Campo: Teléfono
  PHONE: {
    REQUIRED: 'Teléfono es requerido',
    INVALID: 'Teléfono inválido (mínimo 7 dígitos)',
    PATTERN: 'Teléfono inválido'
  },

  // Campo: Calle/Dirección
  STREET: {
    REQUIRED: 'Calle es requerida',
    MIN_LENGTH: 'Mínimo 3 caracteres'
  },

  // Campo: Ciudad
  CITY: {
    REQUIRED: 'Ciudad es requerida',
    MIN_LENGTH: 'Mínimo 2 caracteres'
  },

  // Campo: Estado/Provincia
  STATE: {
    REQUIRED: 'Estado es requerido',
    MIN_LENGTH: 'Mínimo 2 caracteres'
  },

  // Campo: Código Postal
  ZIPCODE: {
    REQUIRED: 'Código postal es requerido',
    INVALID: 'Código postal inválido'
  },

  // Campo: País
  COUNTRY: {
    REQUIRED: 'País es requerido'
  }
} as const;
