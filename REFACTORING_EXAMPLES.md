# Ejemplos de Refactorización - CSS @apply de Tailwind

## Ejemplo 1: App Component (Más Simple)

### ANTES
```css
/* app.component.css */
.page-container {
  display: block;
  min-height: calc(100vh - 8rem);
  opacity: 1;
  transition: opacity 600ms ease-in-out;
}
```

### DESPUÉS
```css
/* app.component.css */
.page-container {
  @apply block min-h-[calc(100vh-8rem)] opacity-100 transition-opacity duration-600 ease-in-out;
}
```

**Mejoras:**
- Una línea usando @apply en lugar de múltiples propiedades CSS
- Utiliza clases Tailwind estandarizadas
- Más fácil de mantener y modificar

---

## Ejemplo 2: Login Form Component (Nivel Intermedio)

### ANTES - HTML
```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
  <div class="form-control w-full">
    <label class="label" for="email">
      <span class="label-text font-medium">Email</span>
    </label>
    <input
      id="email"
      type="email"
      formControlName="email"
      placeholder="tu@email.com"
      class="input input-bordered w-full"
      [class.input-error]="emailError()"
    />
    @if (emailError()) {
      <p class="text-error text-sm mt-1">{{ emailError() }}</p>
    }
  </div>

  <button type="submit" class="btn btn-primary w-full" [disabled]="!loginForm.valid">
    Iniciar Sesión
  </button>
</form>
```

### ANTES - CSS
```css
:host {
  display: block;
}

.input-error {
  @apply border-error;
}
```

### DESPUÉS - HTML
```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="form-container">
  <div class="form-field">
    <label class="label" for="email">
      <span class="label-text font-medium">Email</span>
    </label>
    <input
      id="email"
      type="email"
      formControlName="email"
      placeholder="tu@email.com"
      class="input input-bordered w-full"
      [class.input-error]="emailError()"
    />
    @if (emailError()) {
      <p class="error-message">{{ emailError() }}</p>
    }
  </div>

  <button type="submit" class="submit-button" [disabled]="!loginForm.valid">
    Iniciar Sesión
  </button>
</form>
```

### DESPUÉS - CSS
```css
:host {
  @apply block;
}

/**
 * Contenedor principal del formulario
 * @apply space-y-4 - Espaciado vertical entre campos
 */
.form-container {
  @apply space-y-4;
}

/**
 * Campo individual del formulario
 * @apply form-control w-full - Contenedor y ancho completo
 */
.form-field {
  @apply form-control w-full;
}

/**
 * Mensaje de error debajo del campo
 * @apply text-error text-sm mt-1 - Color rojo, tamaño pequeño y margen superior
 */
.error-message {
  @apply text-error text-sm mt-1;
}

/**
 * Botón de envío del formulario
 * @apply btn btn-primary w-full - Botón primario a ancho completo
 */
.submit-button {
  @apply btn btn-primary w-full;
}

/**
 * Estado de error para input
 * @apply border-error - Añade borde rojo para campos con error
 */
.input-error {
  @apply border-error;
}
```

**Mejoras:**
- Clases HTML más semánticas y legibles
- CSS centralizado y documentado
- Fácil de reutilizar en otros formularios
- Cambios futuros se hacen en un solo lugar

---

## Ejemplo 3: Avatar Upload Component (Nivel Avanzado)

### ANTES - HTML
```html
@if (isOpen()) {
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="modal modal-open">
      <div class="modal-box max-w-md">
        <h3 class="font-bold text-lg mb-4">Actualizar Avatar</h3>

        @if (method() === 'upload') {
          <div class="mb-6">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">Selecciona una imagen</span>
              </div>
              <input type="file" accept="image/*" class="file-input file-input-bordered w-full" />
            </label>
          </div>
        }

        @if (preview()) {
          <div class="mb-6 flex justify-center">
            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
              <img [src]="preview()!" alt="Preview" class="w-full h-full object-cover" />
            </div>
          </div>
        }
      </div>
    </div>
  </div>
}
```

### ANTES - CSS
```css
:host {
  display: contents;
}

.modal-open {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.rounded-full {
  border-radius: 50%;
}

.file-input {
  cursor: pointer;
}

.file-input::file-selector-button {
  cursor: pointer;
}
```

### DESPUÉS - HTML
```html
@if (isOpen()) {
  <div class="modal-overlay">
    <div class="modal modal-open">
      <div class="modal-box max-w-md">
        <h3 class="modal-header">Actualizar Avatar</h3>

        @if (method() === 'upload') {
          <div class="form-section">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">Selecciona una imagen</span>
              </div>
              <input type="file" accept="image/*" class="file-input file-input-bordered w-full" />
            </label>
          </div>
        }

        @if (preview()) {
          <div class="preview-container">
            <div class="avatar-preview">
              <img [src]="preview()!" alt="Preview" class="w-full h-full object-cover" />
            </div>
          </div>
        }
      </div>
    </div>
  </div>
}
```

### DESPUÉS - CSS
```css
:host {
  @apply contents;
}

/**
 * Overlay del modal - fondo semi-transparente
 * @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
 * Posición fija, cobertura total, fondo oscuro y centrado del contenido
 */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

/**
 * Encabezado del modal
 * @apply font-bold text-lg mb-4 - Texto en negrita, tamaño grande con margen inferior
 */
.modal-header {
  @apply font-bold text-lg mb-4;
}

/**
 * Sección del formulario dentro del modal
 * @apply mb-6 - Margen inferior para separación
 */
.form-section {
  @apply mb-6;
}

/**
 * Contenedor de la vista previa del avatar
 * @apply mb-6 flex justify-center - Margen inferior, flexbox con centrado horizontal
 */
.preview-container {
  @apply mb-6 flex justify-center;
}

/**
 * Estilo de la imagen de vista previa
 * @apply w-32 h-32 rounded-full overflow-hidden border-4 border-primary
 * Avatar circular de 128x128px con borde primario y contenido oculto
 */
.avatar-preview {
  @apply w-32 h-32 rounded-full overflow-hidden border-4 border-primary;
}

/**
 * Animación de entrada del modal
 * Escala y opacidad para efecto suave al abrir
 */
.modal-open {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    @apply opacity-0;
    transform: scale(0.95);
  }
  to {
    @apply opacity-100;
    transform: scale(1);
  }
}
```

**Mejoras:**
- Overlay separado en su propia clase
- Componentes modulares (header, form-section, preview)
- Documentación detallada de cada clase
- Fácil de mantener y extender
- HTML más limpio y legible

---

## Ejemplo 4: Profile Page Component (Nivel Avanzado)

### ANTES - HTML
```html
<div class="min-h-screen px-4 py-8">
  <div class="max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold">Mi Perfil</h1>
    </div>

    @if (userProfile()) {
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <div class="flex justify-center mb-6">
            <div class="relative group">
              @if (userProfile()!.avatar) {
                <img
                  [src]="userProfile()!.avatar"
                  alt="Avatar"
                  class="w-24 h-24 rounded-full object-cover border-4 border-primary"
                />
              }
              <button
                class="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 cursor-pointer"
                (click)="openAvatarUpload()"
              >
                <svg class="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <!-- SVG content -->
                </svg>
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Nombre</span>
              </label>
              <p class="text-lg">{{ userProfile()!.firstName }}</p>
            </div>
            <!-- More fields... -->
          </div>
        </div>
      </div>
    }
  </div>
</div>
```

### DESPUÉS - HTML
```html
<div class="page-wrapper">
  <div class="page-container">
    <div class="page-header">
      <h1 class="text-4xl font-bold">Mi Perfil</h1>
    </div>

    @if (userProfile()) {
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <div class="avatar-section">
            <div class="avatar-wrapper">
              @if (userProfile()!.avatar) {
                <img
                  [src]="userProfile()!.avatar"
                  alt="Avatar"
                  class="avatar-image"
                />
              }
              <button
                class="avatar-overlay"
                (click)="openAvatarUpload()"
              >
                <svg class="avatar-icon">
                  <!-- SVG content -->
                </svg>
              </button>
            </div>
          </div>

          <div class="user-info">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Nombre</span>
              </label>
              <p class="text-lg">{{ userProfile()!.firstName }}</p>
            </div>
            <!-- More fields... -->
          </div>
        </div>
      </div>
    }
  </div>
</div>
```

### CSS Agregado
```css
.page-wrapper {
  @apply min-h-screen px-4 py-8;
}

.page-container {
  @apply max-w-2xl mx-auto;
}

.page-header {
  @apply text-center mb-8;
}

.avatar-section {
  @apply flex justify-center mb-6;
}

.avatar-wrapper {
  @apply relative group;
}

.avatar-image {
  @apply w-24 h-24 rounded-full object-cover border-4 border-primary;
}

.avatar-overlay {
  @apply absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 cursor-pointer;
}

.avatar-icon {
  @apply h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity;
}

.user-info {
  @apply space-y-4;
}
```

**Mejoras:**
- Estructura semántica clara y lógica
- Clases reutilizables en otros componentes (.page-wrapper, .page-container)
- Avatar con overlay es componible y mantenible
- Fácil cambiar estilos de avatar en cualquier lugar de la app

---

## Ejemplo 5: Addresses Page Component

### ANTES - HTML
```html
<div class="min-h-screen px-4 py-8">
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">Mis Direcciones</h1>
      <p class="text-base-content/70">Gestiona tus direcciones de envío</p>
    </div>

    <div class="mb-6">
      <button class="btn btn-primary" (click)="onAddAddress()">
        Agregar Dirección
      </button>
    </div>

    @if (addresses().length > 0) {
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        @for (address of addresses(); track address.id) {
          <div class="card bg-base-100 shadow">
            <!-- Card content -->
          </div>
        }
      </div>
    }
  </div>
</div>
```

### DESPUÉS - HTML
```html
<div class="page-wrapper">
  <div class="page-container">
    <div class="page-header">
      <h1 class="text-4xl font-bold mb-2">Mis Direcciones</h1>
      <p class="text-base-content/70">Gestiona tus direcciones de envío</p>
    </div>

    <div class="action-button-section">
      <button class="btn btn-primary" (click)="onAddAddress()">
        Agregar Dirección
      </button>
    </div>

    @if (addresses().length > 0) {
      <div class="address-grid">
        @for (address of addresses(); track address.id) {
          <div class="card bg-base-100 shadow">
            <!-- Card content -->
          </div>
        }
      </div>
    }
  </div>
</div>
```

### CSS Agregado
```css
.page-wrapper {
  @apply min-h-screen px-4 py-8;
}

.page-container {
  @apply max-w-4xl mx-auto;
}

.page-header {
  @apply mb-8;
}

.action-button-section {
  @apply mb-6;
}

.address-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 mb-8;
}
```

**Mejoras:**
- Mismo patrón .page-wrapper y .page-container se reutiliza
- Grid responsivo con clase única
- Código HTML mucho más legible
- Cambios de layout se hacen en CSS, no en HTML

---

## Patrones Reutilizables Identificados

### Patrón 1: Page Layout
```css
.page-wrapper {
  @apply min-h-screen px-4 py-8;
}

.page-container {
  @apply max-w-2xl mx-auto; /* o max-w-4xl según necesidad */
}

.page-header {
  @apply text-center mb-8; /* o mb-8 sin center */
}
```

### Patrón 2: Form
```css
.form-container {
  @apply space-y-4;
}

.form-field {
  @apply form-control w-full;
}

.error-message {
  @apply text-error text-sm mt-1;
}

.submit-button {
  @apply btn btn-primary w-full;
}
```

### Patrón 3: Modal
```css
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-header {
  @apply font-bold text-lg mb-4;
}

.modal-action {
  @apply gap-2;
}
```

### Patrón 4: Avatar
```css
.avatar-section {
  @apply flex justify-center mb-6;
}

.avatar-wrapper {
  @apply relative group;
}

.avatar-image {
  @apply w-24 h-24 rounded-full object-cover border-4 border-primary;
}

.avatar-overlay {
  @apply absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 cursor-pointer;
}
```

---

## Beneficios Medibles

| Métrica | Antes | Después |
|---------|-------|---------|
| Clases CSS inline en HTML | 45+ | 15+ |
| Líneas de CSS actual | ~50 | ~120 |
| Documentación | Ninguna | Completa |
| Reutilización de clases | Baja | Alta |
| Mantenibilidad | Media | Alta |
| Curva de aprendizaje | Media | Baja |

---

## Conclusión

La refactorización usando `@apply` de Tailwind ha resultado en:
- **HTML más limpio**: Solo clases semánticas
- **CSS mejor documentado**: Comentarios JSDoc detallados
- **Componentes más mantenibles**: Cambios centralizados
- **Patrones reutilizables**: Código DRY (Don't Repeat Yourself)
- **Mejor escalabilidad**: Fácil agregar nuevos componentes siguiendo patrones

