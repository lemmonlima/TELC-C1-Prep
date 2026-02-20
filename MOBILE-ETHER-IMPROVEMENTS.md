# Mejoras Móviles para el Grafo Interactivo "Ether"

Este documento describe las mejoras implementadas para optimizar la experiencia móvil del grafo interactivo usado en:
- **Wörter** (mapa etéreo de palabras)
- **Präfixverben** (verbos con prefijos en estrella)

## 📱 Problemas Resueltos

### 1. **Touch Targets Demasiado Pequeños**
- ✅ Nodos ahora tienen mínimo 44px × 44px (WCAG recomendado)
- ✅ En pantallas < 480px, los nodos son 48px × 48px
- ✅ Padding y font-size incrementados para mejor visibilidad

### 2. **Zoom y Pan Incómodos**
- ✅ **Pinch-to-zoom** completo con 2 dedos
- ✅ **Doble tap** para zoom in/out rápido
- ✅ Pan optimizado sin conflictos con scroll de página
- ✅ Botones de zoom opcionales (+/−/reset)

### 3. **Panel de Detalle Problemático**
- ✅ Panel ahora es **slide-up** desde abajo en móvil
- ✅ Máximo 65-70% de altura de pantalla
- ✅ Gesto de **arrastre hacia abajo para cerrar**
- ✅ Handle visual para indicar que es arrastrable
- ✅ Botón "Volver al nodo" más grande y visible

### 4. **Conflicto Touch con Scroll**
- ✅ `touch-action: none` en el stage
- ✅ Body scroll lock cuando se interactúa con el grafo
- ✅ Umbral de pan (6px) para distinguir tap de arrastre

### 5. **Tipografía y Contraste**
- ✅ Font sizes aumentados en móvil
- ✅ Contraste mejorado con bordes más gruesos
- ✅ Backdrop blur incrementado para legibilidad
- ✅ Tablas de ejemplos optimizadas

### 6. **Otros Ajustes**
- ✅ Safe areas (iPhone notch, etc.)
- ✅ Landscape mode optimizado
- ✅ Reduce motion support
- ✅ Dark mode ajustes adicionales

---

## 🚀 Instalación

### Paso 1: Incluir el CSS

Agrega este `<link>` en **TODAS** las páginas que usan el grafo ether:

```html
<!-- Después de styles.css -->
<link rel="stylesheet" href="/styles-mobile-ether.css">
```

**Archivos a modificar:**
- `docs/woerter/index.html`
- `docs/woerter/solo.html`
- `docs/grammatik/verben-mit-praepositionen/index.html`
- `docs/grammatik/verben-mit-praepositionen/karte.html`

### Paso 2: Incluir el JavaScript (Opcional pero Recomendado)

Agrega este `<script>` **después** del script principal:

#### Para Wörter:
```html
<!-- En docs/woerter/index.html y solo.html -->
<script src="woerter.js"></script>
<script src="mobile-gestures.js"></script>
<script>
  // Activar mejoras móviles después de buildEther
  document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que buildEther cree el state
    setTimeout(() => {
      const stage = document.querySelector('.woerter-ether-stage');
      const panel = document.querySelector('.woerter-panel');
      
      if (stage && window.etherState) {
        // Agregar pinch-to-zoom y gestos
        enhanceMobileGestures(window.etherState, applyView);
        
        // Mejorar panel móvil
        if (panel) {
          enhanceMobilePanel(panel);
        }
        
        // Opcional: botones de zoom
        // addMobileZoomControls(window.etherState, applyView, stage);
      }
    }, 500);
  });
</script>
```

#### Para Präfixverben:
```html
<!-- En docs/grammatik/verben-mit-praepositionen/index.html y karte.html -->
<script src="verben-mit-praepositionen.js"></script>
<script src="mobile-gestures.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const stage = document.querySelector('.woerter-ether-stage');
      const panel = document.querySelector('.woerter-panel');
      
      if (stage && window.etherState) {
        enhanceMobileGestures(window.etherState, applyView);
        
        if (panel) {
          enhanceMobilePanel(panel);
        }
      }
    }, 500);
  });
</script>
```

### Paso 3: Exponer el State (Modificación de JS)

Para que `mobile-gestures.js` pueda acceder al state, necesitas exportarlo en `buildEther`:

#### En `woerter.js` y `verben-mit-praepositionen.js`:

**Al final de la función `buildEther`, antes del return/cierre:**

```javascript
// Exponer state globalmente para mobile-gestures
window.etherState = state;
```

**Ubicación exacta:**
- Busca la función `buildEther(container, entries, ...)`
- Al final, justo antes del cierre de la función (después de todos los event listeners)
- Agrega: `window.etherState = state;`

---

## 📂 Archivos Creados

```
docs/
├── styles-mobile-ether.css          # CSS para mejoras móviles
├── woerter/
│   ├── mobile-gestures.js           # JS para gestos móviles (Wörter)
│   ├── index.html                   # [MODIFICAR: agregar <link> y <script>]
│   ├── solo.html                    # [MODIFICAR: agregar <link> y <script>]
│   └── woerter.js                   # [MODIFICAR: exponer etherState]
└── grammatik/
    └── verben-mit-praepositionen/
        ├── mobile-gestures.js       # JS para gestos móviles (Verben)
        ├── index.html               # [MODIFICAR: agregar <link> y <script>]
        ├── karte.html               # [MODIFICAR: agregar <link> y <script>]
        └── verben-mit-praepositionen.js  # [MODIFICAR: exponer etherState]
```

---

## ⚙️ Configuración Opcional

### Deshabilitar Botones de Zoom

Si prefieres solo gestos (pinch/doble tap) sin botones:

Simplemente **NO llames** `addMobileZoomControls(...)` en el script de activación.

### Personalizar Umbrales

En `mobile-gestures.js` puedes ajustar:

```javascript
// Umbral para cerrar panel (línea ~185)
const threshold = 100; // Cambiar a 150 para hacer más difícil cerrar

// Umbral para doble tap (línea ~26)
doubleTapThreshold: 300 // ms entre taps

// Límites de zoom (línea ~96)
const newZoom = Math.max(0.3, Math.min(3, ...)); // Min 0.3x, Max 3x
```

---

## 🧪 Testing

### Probar en Móvil Real:
1. Abre la página en tu teléfono
2. Prueba gestos:
   - **Un dedo**: pan (arrastrar el mapa)
   - **Dos dedos**: pinch-to-zoom
   - **Doble tap**: zoom in/out
   - **Tap en nodo**: abrir panel
   - **Arrastre panel hacia abajo**: cerrar panel

### Probar en Chrome DevTools:
1. F12 → Toggle device toolbar
2. Seleccionar dispositivo móvil (iPhone, Android)
3. Habilitar "Touch" mode
4. Probar gestos con el mouse (simula un dedo)

---

## 🐛 Troubleshooting

### El pinch-to-zoom no funciona
- ✅ Verifica que `window.etherState` esté definido (console.log)
- ✅ Confirma que `mobile-gestures.js` se cargó después de `woerter.js`
- ✅ Revisa la consola para errores

### El panel no se cierra arrastrando
- ✅ Solo funciona en dispositivos táctiles reales (no DevTools)
- ✅ Debe arrastrarse desde el tope del panel
- ✅ Requiere arrastre > 100px hacia abajo

### Los nodos siguen pequeños
- ✅ Verifica que `styles-mobile-ether.css` se cargó
- ✅ Comprueba que está **después** de `styles.css` en el HTML
- ✅ Limpia caché del navegador (Ctrl+Shift+R)

### El scroll de la página se activa al arrastrar el grafo
- ✅ Confirma que el stage tiene la clase `woerter-ether-stage--touch`
- ✅ Verifica que `touch-action: none` se aplicó (DevTools → Computed)

---

## 📊 Ventajas de las Mejoras

| Antes | Después |
|-------|---------|
| Nodos ~32px | Nodos 44-48px (touch-friendly) |
| Solo wheel-zoom | Pinch + doble tap + botones |
| Pan conflictuaba con scroll | Pan aislado con body-lock |
| Panel tapaba todo el grafo | Panel 65% altura, arrastrable |
| Difícil leer en móvil | Tipografía 15-20% más grande |
| Sin feedback visual | Sombras, bordes, contraste mejorado |

---

## 🎨 Personalización de Estilos

Si quieres ajustar colores, tamaños, etc., edita `styles-mobile-ether.css`:

```css
/* Ejemplo: Hacer el panel más transparente */
@media (max-width: 768px) {
  .woerter-panel {
    background: rgba(26, 25, 22, 0.95); /* Más transparente */
  }
}

/* Ejemplo: Nodos aún más grandes */
@media (max-width: 480px) {
  .woerter-node {
    min-width: 56px;
    min-height: 56px;
    font-size: 1.2rem;
  }
}
```

---

## 🔮 Próximas Mejoras (Opcional)

Ideas para futuras iteraciones:

- [ ] Vibración háptica al seleccionar nodo (si `navigator.vibrate`)
- [ ] Swipe horizontal para cambiar entre nodos seleccionados
- [ ] Minimizar panel con un botón en lugar de solo arrastre
- [ ] Persistir zoom/pan en localStorage
- [ ] Tutorial overlay en primera visita móvil

---

## 📝 Notas Técnicas

- **No duplica lógica**: Todo el core del grafo sigue en `woerter.js` / `verben-mit-praepositionen.js`
- **Progressive enhancement**: Si `mobile-gestures.js` no carga, el grafo sigue funcionando
- **Clases coherentes**: Usa las mismas clases CSS (`woerter-*`) en ambas secciones
- **Mantiene accesibilidad**: Botones con `type="button"`, roles ARIA intactos
- **Performance**: Gestos usan `passive: false` solo cuando necesario
- **Safe areas**: Respeta notch, barras de navegación iOS/Android

---

## ✅ Checklist de Implementación

- [ ] `styles-mobile-ether.css` creado en `docs/`
- [ ] `mobile-gestures.js` copiado a `woerter/` y `verben-mit-praepositionen/`
- [ ] `<link>` agregado en todos los HTML relevantes
- [ ] `<script>` de activación agregado en todos los HTML relevantes
- [ ] `window.etherState = state;` agregado en `woerter.js`
- [ ] `window.etherState = state;` agregado en `verben-mit-praepositionen.js`
- [ ] Probado en móvil real (iOS y Android si es posible)
- [ ] Probado en Chrome DevTools con device toolbar
- [ ] Verificado que no rompe funcionalidad de escritorio
- [ ] Cache limpiado y probado en diferentes viewports

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la consola del navegador (errores JS)
2. Verifica que todos los archivos se cargaron (Network tab)
3. Comprueba el orden de los `<script>` y `<link>`
4. Prueba en modo incógnito (sin extensions)

Si todo falla, comparte:
- URL de la página
- Dispositivo y navegador
- Screenshot o video del problema
- Mensajes de error en la consola

---

**¡Listo!** El grafo ether ahora debería ser 100% usable en móviles. 🎉
