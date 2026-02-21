# Mobile Layout Fix para TELC Texte (produktion-ds)

## 🐛 Problema
En dispositivos móviles, las páginas de textos en `docs/texte/produktion-ds/` presentaban problemas de layout:
- **Topbar duplicado** - Dos headers "TELC Texte" apilados (conflicto HTML estático vs JS dinámico)
- Contenido superpuesto y comprimido
- Word types legend (Wortarten) muy apretado
- Textos difíciles de leer
- Botones pequeños (menor a 44px mínimo táctil)

## ✅ Solución Implementada

### 1. Fix Topbar Duplicado
**Archivos modificados:**
- `docs/topbar.js` - Detección de topbar/controles existentes
- `docs/texte/styles-mobile-texte.css` - CSS defensivo anti-duplicación

**Cambios en topbar.js:**
- `initTopbar()` ahora verifica si el topbar ya existe en el HTML antes de crearlo
- `initTopbarControls()` detecta si los botones ya existen antes de crearlos
- Solo adjunta event handlers (no duplica elementos DOM)
- Compatible con topbars estáticos (HTML) y dinámicos (JS)

**CSS defensivo agregado:**
```css
.topbar ~ .topbar { display: none !important; }
.topbar-show-trigger ~ .topbar-show-trigger { display: none !important; }
```

Ver detalles completos en: **`TOPBAR-DUPLICATION-FIX.md`**

### 2. Archivo CSS Móvil Creado
**Archivo:** `docs/texte/styles-mobile-texte.css` (6.2 KB)

Optimizaciones específicas:
- **Topbar**: Mejor padding con safe-area-inset para dispositivos con notch
- **doc-main**: Reducido padding-top de 72px → 16px en móvil
- **doc-hero**: 
  - Padding reducido: 32px → 20px
  - Título: 1.5rem (más pequeño)
  - Lead text: 0.9rem
- **Word types legend**: 
  - Grid optimizado: minmax(100px, 1fr) en móvil
  - Padding reducido: 28px → 16px
  - Mejor espaciado entre items
- **Textos**:
  - Tamaño base: 0.95rem (más legible)
  - Line-height: 1.6 (mejor legibilidad)
  - Títulos H2: 1.3rem
- **Botones táctiles**: 
  - Mínimo 44x44px (estándar de accesibilidad)
  - Mejor estados active/hover para touch
- **Flashcards panel**: Max-height 75vh para no cubrir toda pantalla
- **Prevention**: overflow-x: hidden para evitar scroll horizontal

### 2. Archivos Actualizados
**Total**: 104 archivos HTML en `produktion-ds/`

El script `add-mobile-texte-css.sh` agregó automáticamente el link al CSS móvil en:
- Todos los archivos `index.html` de textos
- Todos los archivos `*-flashcards.html`

**Ejemplo de cambio:**
```html
<!-- Antes -->
<link rel="stylesheet" href="../../../../styles.css" />

<!-- Después -->
<link rel="stylesheet" href="../../../../styles.css" />
<link rel="stylesheet" href="../../../styles-mobile-texte.css" />
```

### 3. Media Queries Aplicadas
- **≤ 640px**: Optimizaciones principales para móviles típicos
- **≤ 480px**: Ajustes extra para pantallas muy pequeñas
- **Landscape (≤ 900px)**: Optimizaciones para móvil en horizontal
- **Touch devices (hover: none)**: Mejoras específicas para pantallas táctiles

## 🧪 Cómo Probar

### 1. Limpiar caché del navegador
En Chrome/Safari móvil:
- Abrir DevTools (si está disponible)
- O forzar recarga: `Ctrl+Shift+R` / Pull-to-refresh varias veces

### 2. Visitar páginas de prueba
Ejemplos a revisar:
- `docs/texte/produktion-ds/ds-02/soziale-isolation-in-der-modernen-gesellschaft/index.html`
- `docs/texte/produktion-ds/ds-04/gig-economy-und-prekarisierung/index.html`
- Cualquier otro texto en produktion-ds/

### 3. Verificar que funcione:
✅ **Topbar no se superpone** con el contenido
✅ **Wortarten legend se ve organizado** y no apretado
✅ **Textos son legibles** sin hacer zoom
✅ **Botones son fáciles de tocar** (≥44px)
✅ **No hay scroll horizontal** inesperado
✅ **Explanation panel** se abre y cierra correctamente
✅ **Flashcards** funcionan bien en móvil

## 📁 Archivos Importantes

### Modificados:
- `docs/topbar.js` - Fix para topbar duplicado (detección de elementos existentes)
- `docs/texte/styles-mobile-texte.css` - CSS con optimizaciones móviles + CSS defensivo

### Nuevos archivos:
- `docs/texte/styles-mobile-texte.css` - CSS con optimizaciones móviles
- `add-mobile-texte-css.sh` - Script de integración (ya ejecutado)
- `MOBILE-TEXTE-FIX.md` - Esta documentación
- `TOPBAR-DUPLICATION-FIX.md` - Documentación detallada del fix de topbar

### Backups:
Todos los archivos HTML tienen backup con extensión `.bak`

**Para eliminar backups después de probar:**
```bash
find ~/Projects/TELC/docs/texte/produktion-ds -name '*.bak' -delete
```

## 🔄 Si Algo Sale Mal

### Restaurar un archivo individual:
```bash
# Ejemplo:
mv ~/Projects/TELC/docs/texte/produktion-ds/ds-02/soziale-isolation.../index.html.bak \
   ~/Projects/TELC/docs/texte/produktion-ds/ds-02/soziale-isolation.../index.html
```

### Restaurar todos los archivos:
```bash
find ~/Projects/TELC/docs/texte/produktion-ds -name '*.bak' | while read f; do
  mv "$f" "${f%.bak}"
done
```

## 📊 Estadísticas

- **Archivos modificados**: 104 HTML files
- **CSS nuevo**: 1 archivo (6040 bytes)
- **Breakpoints**: 3 principales (640px, 480px, landscape)
- **Reglas CSS**: ~100 reglas móviles
- **Touch targets**: Todos ≥44px (WCAG AA)

## 🎯 Próximos Pasos

1. **Probar en móvil real** - Idealmente en diferentes tamaños (phone, small phone)
2. **Verificar en diferentes navegadores** - Chrome, Safari, Firefox mobile
3. **Confirmar que flashcards funcionen** - Abrir y navegar
4. **Probar explanation panel** - Click en palabras subrayadas
5. **Eliminar backups** si todo funciona bien

## 💡 Notas Técnicas

- **No afecta desktop**: Media queries solo aplican ≤640px
- **Compatible con dark theme**: Usa variables CSS existentes
- **Progressive enhancement**: Funciona sin JS
- **Safe-area-inset**: Compatible con iPhone notch/Dynamic Island
- **Preserva funcionalidad**: Solo mejora layout, no cambia lógica

---

**Creado**: 2026-02-15  
**Afecta**: `docs/texte/produktion-ds/**/*.html`  
**Tipo**: Layout fix / Mobile optimization  
**Status**: ✅ Implementado - Pendiente prueba móvil
