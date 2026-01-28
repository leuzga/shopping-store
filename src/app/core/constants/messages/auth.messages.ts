/**
 * Mensajes de Autenticación
 *
 * Todos los mensajes relacionados con autenticación centralizado
 * Facilita internacionalización y mantenimiento
 */

export const AUTH_MESSAGES = {
  // Errores de login
  LOGIN: {
    INVALID_CREDENTIALS: 'Email o contraseña incorrecta',
    ERROR: 'Error al iniciar sesión',
    TOOLTIP: 'Iniciar Sesión'
  },

  // Errores de registro
  SIGNUP: {
    EMAIL_EXISTS: 'El email ya está registrado',
    ERROR: 'Error al registrarse'
  },

  // Errores generales de autenticación
  ERRORS: {
    NOT_AUTHENTICATED: 'No hay usuario autenticado',
    INVALID_TOKEN: 'Token inválido o expirado'
  },

  // Mensajes de éxito
  SUCCESS: {
    LOGIN: 'Inicio de sesión exitoso',
    SIGNUP: 'Registro exitoso, ¡bienvenido!',
    LOGOUT: 'Sesión cerrada correctamente'
  }
} as const;
