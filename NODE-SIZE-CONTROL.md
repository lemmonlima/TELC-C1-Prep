# 🎛️ Control de Tamaño de Nodos - Grafo Ether

## ✨ Nueva Funcionalidad

Ahora puedes **ajustar el tamaño de los nodos en vivo** con botones simples!

### 📍 Dónde está:
- Aparece en la barra de controles del grafo (arriba)
- Junto a los filtros de tipo y búsqueda
- Disponible en todas las vistas (Wörter y Präfixverben)

### 🎯 Cómo usar:

1. **Busca el control** "Tamaño nodos" en la barra de controles
2. **Haz clic en un botón** de tamaño:
   - **XS** - Extra pequeño (0.7x)
   - **S** - Pequeño (0.85x)
   - **M** - Normal (1.0x) - _por defecto_
   - **L** - Grande (1.25x)
   - **XL** - Extra grande (1.5x)
   - **XXL** - Gigante (1.8x)

3. **El cambio es inmediato** - los nodos se redimensionan al instante
4. **Tu preferencia se guarda** - la próxima vez que abras la página, recordará tu elección

---

## 🍋 Problema Resuelto

### Antes:
- En Wörter (muchos nodos): difícil tocar el nodo correcto
- Tamaño fijo: no se podía ajustar

### Ahora:
- **Ajusta según tu necesidad**: si están muy juntos → usa XL o XXL
- **Persiste**: no tienes que cambiarlo cada vez
- **Funciona en móvil y escritorio**

---

## 📱 Recomendaciones

### Para Wörter (muchos nodos):
- **Móvil**: L o XL
- **Tablet**: M o L
- **Escritorio**: S o M

### Para Präfixverben (pocos nodos):
- **Móvil**: M o L
- **Tablet**: S o M
- **Escritorio**: XS o S

---

## 🔧 Detalles Técnicos

### Archivos creados:
- ✅ `docs/woerter/node-size-control.js` (3.4 KB)
- ✅ `docs/grammatik/verben-mit-praepositionen/node-size-control.js` (copia)
- ✅ Estilos integrados en `docs/styles-mobile-ether.css`

### Cómo funciona:
- Usa CSS custom property `--node-scale`
- Se aplica via `transform: scale()`
- Guarda en `localStorage` con clave `telc-ether-node-size`
- Auto-carga al iniciar la página

### Integración:
- ✅ Todos los HTML ya incluyen `node-size-control.js`
- ✅ Se inicializa automáticamente (DOMContentLoaded + setTimeout)
- ✅ No requiere cambios en `woerter.js` o `verben-mit-praepositionen.js`

---

## 🎨 UI/UX

### Aspecto visual:
- Fondo gris suave
- Botones con hover effect
- Botón activo resaltado en rojo
- Label muestra el tamaño actual (M, L, XL, etc.)

### Responsivo:
- Desktop: botones más pequeños
- Móvil: botones 44px+ para touch-friendly
- Se adapta al ancho disponible

---

## 🐛 Troubleshooting

### No veo el control:
1. Recarga con Ctrl+Shift+R (limpiar caché)
2. Verifica consola: debería decir "🍋 Creando control de tamaño de nodos"
3. Comprueba que `node-size-control.js` se cargó (DevTools → Network)

### Los nodos no cambian de tamaño:
1. Haz clic en diferentes botones (S, M, L) para probar
2. Inspecciona un nodo (DevTools) → debería tener `transform: scale(...)`
3. Verifica que `--node-scale` esté en `:root` (Computed styles)

### El tamaño no se guarda:
- Comprueba que localStorage esté habilitado
- Abre DevTools → Application → Local Storage → busca `telc-ether-node-size`
- Debería tener un valor como "m", "l", "xl", etc.

---

## 🚀 Uso Programático (Opcional)

Si quieres controlar el tamaño desde código:

```javascript
// Acceder al control
const control = window.nodeSizeControl;

// Cambiar tamaño
control.setSize('xl'); // xs, s, m, l, xl, xxl

// Obtener tamaño actual
console.log(control.getSize()); // "xl"

// Ver todos los tamaños disponibles
console.log(control.getSizes());
```

---

## 📊 Comparación de Tamaños

| Tamaño | Escala | Uso recomendado |
|--------|--------|------------------|
| XS | 0.7x | Escritorio con muchos nodos |
| S | 0.85x | Escritorio normal |
| M | 1.0x | Default - balance |
| L | 1.25x | Móvil con muchos nodos |
| XL | 1.5x | Móvil - máxima usabilidad |
| XXL | 1.8x | Pantallas pequeñas / accesibilidad |

---

## ✅ Estado

**✅ COMPLETO Y ACTIVO**

- ✅ JavaScript creado y copiado
- ✅ Estilos agregados
- ✅ HTML actualizados (4 archivos)
- ✅ Funciona en escritorio y móvil
- ✅ Guarda preferencia
- ✅ Auto-inicializa

---

## 🎉 Pruébalo!

1. Abre `/woerter/` en tu navegador
2. Busca "Tamaño nodos" en los controles
3. Haz clic en **XL** o **XXL**
4. Los nodos deberían crecer inmediatamente
5. Recarga la página → debería mantener el tamaño XL/XXL

---

**¿Sugerencias?** Si quieres más tamaños, otros nombres, o un slider en lugar de botones, solo dime! 🍋
