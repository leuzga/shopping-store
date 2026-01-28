/**
 * Avatar Cropper Service
 *
 * Responsabilidad única: Lógica pura de canvas y transformaciones de imagen
 * - Funciones puras para cálculos sin efectos secundarios
 * - Separación de responsabilidad del componente
 */

export interface CropperState {
  centerX: number;
  centerY: number;
  radius: number;
  isDragging: boolean;
}

/**
 * Inicializar estado del cropper
 * Función pura
 */
export function initializeCropperState(
  canvasWidth: number,
  canvasHeight: number
): CropperState {
  return {
    centerX: canvasWidth / 2,
    centerY: canvasHeight / 2,
    radius: Math.min(canvasWidth, canvasHeight) / 2 - 40,
    isDragging: false
  };
}

/**
 * Verificar si un punto está dentro del círculo selector
 * Función pura
 */
export function isPointInSelector(
  x: number,
  y: number,
  state: CropperState,
  tolerance: number = 15
): boolean {
  const dx = x - state.centerX;
  const dy = y - state.centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= state.radius + tolerance;
}

/**
 * Actualizar posición del selector circular
 * Función pura
 */
export function updateSelectorPosition(
  state: CropperState,
  deltaX: number,
  deltaY: number,
  canvasWidth: number,
  canvasHeight: number
): CropperState {
  let newCenterX = state.centerX + deltaX;
  let newCenterY = state.centerY + deltaY;

  // Mantener dentro de los límites del canvas
  newCenterX = Math.max(state.radius, Math.min(canvasWidth - state.radius, newCenterX));
  newCenterY = Math.max(state.radius, Math.min(canvasHeight - state.radius, newCenterY));

  return { ...state, centerX: newCenterX, centerY: newCenterY };
}

/**
 * Dibujar imagen escalada y selector circular en canvas
 * Función pura en términos de parámetros, con efecto secundario de canvas
 */
export function drawCanvasWithSelector(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  state: CropperState
): void {
  const canvasAspect = canvas.width / canvas.height;
  const imageAspect = image.width / image.height;

  let drawWidth = canvas.width;
  let drawHeight = canvas.height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageAspect > canvasAspect) {
    // Imagen más ancha
    drawWidth = canvas.height * imageAspect;
    offsetX = (canvas.width - drawWidth) / 2;
  } else {
    // Imagen más alta
    drawHeight = canvas.width / imageAspect;
    offsetY = (canvas.height - drawHeight) / 2;
  }

  // Limpiar canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar imagen escalada
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

  // Dibujar overlay oscuro fuera del selector
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.arc(state.centerX, state.centerY, state.radius, 0, Math.PI * 2);
  ctx.fill('evenodd');

  // Dibujar borde del selector
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(state.centerX, state.centerY, state.radius, 0, Math.PI * 2);
  ctx.stroke();

  // Dibujar círculo pequeño en el centro para indicar punto de arrastre
  ctx.fillStyle = '#3B82F6';
  ctx.beginPath();
  ctx.arc(state.centerX, state.centerY, 6, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Generar avatar recortado del área circular seleccionada
 * Función pura en términos de parámetros
 */
export function generateAvatarCrop(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  state: CropperState
): string {
  const canvasAspect = canvas.width / canvas.height;
  const imageAspect = image.width / image.height;

  let drawWidth = canvas.width;
  let drawHeight = canvas.height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageAspect > canvasAspect) {
    drawWidth = canvas.height * imageAspect;
    offsetX = (canvas.width - drawWidth) / 2;
  } else {
    drawHeight = canvas.width / imageAspect;
    offsetY = (canvas.height - drawHeight) / 2;
  }

  const previewCanvas = document.createElement('canvas');
  const previewCtx = previewCanvas.getContext('2d');

  if (!previewCtx) {
    throw new Error('Could not get canvas context');
  }

  const avatarSize = 128;
  previewCanvas.width = avatarSize;
  previewCanvas.height = avatarSize;

  // Calcular escala
  const scaleX = image.width / drawWidth;
  const scaleY = image.height / drawHeight;

  // Convertir coordenadas del selector a coordenadas de imagen original
  const centerX = (state.centerX - offsetX) * scaleX;
  const centerY = (state.centerY - offsetY) * scaleY;
  const radius = state.radius * Math.min(scaleX, scaleY);

  // Dibujar área circular en canvas de preview
  previewCtx.drawImage(
    image,
    Math.max(0, centerX - radius),
    Math.max(0, centerY - radius),
    Math.min(radius * 2, image.width - Math.max(0, centerX - radius)),
    Math.min(radius * 2, image.height - Math.max(0, centerY - radius)),
    Math.max(0, (avatarSize / 2) - radius),
    Math.max(0, (avatarSize / 2) - radius),
    radius * 2,
    radius * 2
  );

  // Aplicar máscara circular
  previewCtx.globalCompositeOperation = 'destination-in';
  previewCtx.fillStyle = '#000000';
  previewCtx.beginPath();
  previewCtx.arc(avatarSize / 2, avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  previewCtx.fill();

  return previewCanvas.toDataURL('image/png');
}
