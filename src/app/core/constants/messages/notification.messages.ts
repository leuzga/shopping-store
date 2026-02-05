export const NOTIFICATION_MESSAGES = {
  // Carrito
  CART: {
    ADD_SUCCESS: 'Producto agregado al carrito',
    REMOVE_SUCCESS: 'Producto removido del carrito',
    CLEAR_SUCCESS: 'Carrito vacío',
    ADD_ERROR: 'Error al agregar al carrito',
    REMOVE_ERROR: 'Error al remover del carrito',
  },
  // Favoritos
  WISHLIST: {
    ADD_SUCCESS: 'Agregado a favoritos',
    REMOVE_SUCCESS: 'Removido de favoritos',
    ADD_ERROR: 'Error al agregar a favoritos',
    REMOVE_ERROR: 'Error al remover de favoritos',
  },
  // Autenticación
  AUTH: {
    LOGIN_SUCCESS: '¡Bienvenido!',
    LOGIN_ERROR: 'Error al iniciar sesión',
    LOGOUT_SUCCESS: 'Sesión cerrada',
    SIGNUP_SUCCESS: 'Cuenta creada exitosamente',
    SIGNUP_ERROR: 'Error al crear la cuenta',
  },
  // Perfil
  PROFILE: {
    UPDATE_SUCCESS: 'Perfil actualizado',
    UPDATE_ERROR: 'Error al actualizar perfil',
  },
  // Contacto
  CONTACT: {
    SUCCESS: 'Mensaje Enviado, pronto le contactaremos...',
  },
} as const;
