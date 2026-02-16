# Sistema de Navegación Centralizado TELC

## Descripción

Este proyecto ahora utiliza un sistema de navegación centralizado que genera automáticamente la barra de navegación en todas las páginas. Esto elimina la duplicación de código y facilita el mantenimiento.

## Archivos del Sistema

### 1. `topbar.js`
Genera dinámicamente la barra de navegación superior con:
- Logo y nombre de sección
- Enlaces de navegación (Start, Grammatik, Texte, Notizen, Wörter, Prüfungen)
- Botón CTA "Einstufung"
- Controles de minimizar y reiniciar

**Características:**
- Calcula automáticamente las rutas relativas según la ubicación de la página
- Detecta la sección actual y ajusta el nombre de la marca
- Genera todos los enlaces de navegación correctamente

### 2. `navigation.js`
Maneja la navegación inteligente y preservación del scroll:
- Guarda la posición de scroll al salir de una página
- Restaura la posición al volver
- Recuerda la última página visitada en cada sección
- Navegación inteligente entre secciones

## Cómo Usar en Páginas Nuevas

Para crear una nueva página HTML, simplemente incluye los scripts en el `<head>`:

```html
<!doctype html>
<html lang="de">
<head>
  <style>html,body{background:#12110f}</style>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Tu Título</title>
  <link rel="stylesheet" href="../styles.css" />
  <!-- TELC Navigation System -->
  <script src="../topbar.js"></script>
  <script src="../navigation.js"></script>
</head>
<body class="no-js doc-page">
  <!-- La barra de navegación se genera automáticamente -->
  
  <main class="doc-main">
    <!-- Tu contenido aquí -->
  </main>

  <footer class="footer">
    <span>TELC – Sección</span>
  </footer>
</body>
</html>
```

**Importante:** Ajusta las rutas relativas (`../topbar.js`) según la profundidad de tu archivo:
- Raíz: `./topbar.js`
- 1 nivel: `../topbar.js`
- 2 niveles: `../../topbar.js`
- 3 niveles: `../../../topbar.js`
- etc.

## Ventajas del Sistema

1. **Mantenimiento Centralizado**: Cambios en la navegación se hacen en un solo lugar
2. **Consistencia**: Todas las páginas tienen exactamente la misma barra de navegación
3. **Menos Código**: Cada página HTML es mucho más pequeña y limpia
4. **Fácil de Actualizar**: Agregar nuevas secciones solo requiere editar `topbar.js`
5. **Navegación Inteligente**: El sistema recuerda dónde estabas en cada sección

## Configuración

Para modificar las secciones de navegación, edita el array `SECTIONS` en `topbar.js`:

```javascript
const SECTIONS = [
  { id: 'start', label: 'Start', path: '/index.html', hash: '#start' },
  { id: 'grammatik', label: 'Grammatik', path: '/grammatik/index.html' },
  // ... más secciones
];
```

Para cambiar el botón CTA, edita `CTA_CONFIG` en `topbar.js`:

```javascript
const CTA_CONFIG = {
  label: 'Einstufung',
  path: '/tips/einfuehrung/index.html'
};
```

## Migración Completada

Todas las 231 páginas HTML del sitio han sido migradas al nuevo sistema. Ya no es necesario:
- Copiar y pegar el HTML de la barra de navegación
- Duplicar los scripts de navegación
- Actualizar manualmente cada página cuando cambia la navegación

## Ejemplo de Plantilla

Consulta `template-example.html` para ver un ejemplo completo de cómo estructurar una nueva página.
