# Vista de Lista - Alineada con Estándar TELC

## ✅ Cambios Aplicados

La vista de lista ahora sigue el **diseño estándar TELC** documentado en `Indicaciones/disenno estandar.md`.

---

## 🎨 Botón de Toggle

### Antes:
```css
background: var(--surface-200);
border-radius: var(--radius-md);
```

### Ahora:
```css
/* Estilo .btn .ghost estándar TELC */
border-radius: 999px;          /* Botones pill-shaped */
background: transparent;
border: 1px solid var(--line);
```

### Estado Activo:
```css
background: var(--red-600);    /* Rojo estándar TELC */
color: #ffffff;
box-shadow: 0 8px 20px rgba(255, 84, 84, 0.25);
```

**Resultado:** El botón ahora se ve idéntico a otros botones TELC (Flashcards, etc.)

---

## 🌈 Colores de Tipos - Sistema de Tokens

Los bordes laterales de los items ahora usan **exactamente los mismos colores** que el sistema de tokens semánticos:

| Tipo | Color | Token Equivalente |
|------|-------|-------------------|
| **Verb** | `rgba(255, 84, 84, 0.8)` | `{v:...}` - Rojo |
| **Nomen** | `rgba(158, 158, 158, 0.6)` | `{n:...}` - Gris |
| **Adjektiv** | `rgba(255, 191, 112, 0.8)` | `{adj:...}` - Naranja |
| **Adverb** | `rgba(92, 203, 191, 0.8)` | Turquesa |
| **Präposition** | `rgba(255, 255, 255, 0.4)` | `{p:...}` - Blanco/Beige |
| **Artikel** | `rgba(91, 201, 152, 0.8)` | Verde |
| **Pronomen** | `rgba(177, 140, 255, 0.8)` | Púrpura |
| **Konjunktion** | `rgba(244, 191, 72, 0.8)` | Amarillo |
| **Subjunktion** | `rgba(93, 173, 255, 0.8)` | Azul |
| **Partikel** | `rgba(158, 158, 158, 0.6)` | Gris |

**Resultado:** Los colores son **consistentes** con el resto del sitio TELC.

---

## 📐 Espaciado y Tipografía

### Labels de Grupo:
```css
font-size: 0.72rem;           /* Estándar TELC para labels */
letter-spacing: 0.14em;       /* Espaciado estándar TELC */
text-transform: uppercase;
```

### Container de Lista:
```css
border-radius: var(--radius-lg);  /* 22px - estándar TELC */
box-shadow: var(--shadow);        /* Sombra estándar TELC */
```

### Botones en Móvil:
```css
min-height: 48px;             /* Touch target estándar */
padding: 12px 20px;           /* Padding estándar TELC móvil */
```

---

## 🔖 Badges y Contadores

### Contador de Tipo:
```css
background: rgba(255, 84, 84, 0.15);  /* Fondo rojo TELC */
border: 1px solid rgba(255, 84, 84, 0.5);
color: var(--red-600);
border-radius: 999px;                 /* Pill-shaped estándar */
```

### Badge de Ejemplos:
```css
background: rgba(255, 84, 84, 0.15);  /* Mismo fondo que tokens */
border: 1px solid rgba(255, 84, 84, 0.4);
```

**Resultado:** Badges coherentes con el sistema visual TELC.

---

## 🎯 Items de Lista

### Estado Normal:
```css
border-left: 4px solid [color-tipo];  /* Borde grueso de color */
border-radius: var(--radius-md);      /* Radio estándar TELC (14px) */
```

### Estado Activo:
```css
background: rgba(255, 84, 84, 0.12);  /* Fondo rojo TELC estándar */
border-color: rgba(255, 84, 84, 0.6);
box-shadow: 0 0 0 2px rgba(255, 84, 84, 0.25);
```

**Resultado:** Feedback visual consistente con otros componentes TELC.

---

## 📋 Comparación Visual

### Antes (Genérico):
```
┌─────────────────────────────────┐
│ [Lista]                         │ ← Botón rectangular
├─────────────────────────────────┤
│ 8 Verben                        │ ← Colores arbitrarios
│ ─ gehen → ir                    │ ← Borde verde (incorrecto)
└─────────────────────────────────┘
```

### Ahora (Estándar TELC):
```
┌─────────────────────────────────┐
│ ( 📋 Lista )                    │ ← Botón pill estándar
├─────────────────────────────────┤
│ ⓔ VERBEN                        │ ← Label estándar TELC
│ ║ gehen → ir       3 ej.        │ ← Borde rojo (correcto)
└─────────────────────────────────┘
   ↑ Borde de 4px color del token {v:...}
```

---

## 🧪 Coherencia con el Sistema

### Elementos que Comparten Estilos:

1. **Botones:**
   - Toggle Lista ⟷ Flashcards
   - Toggle Lista ⟷ Otros `.btn .ghost`

2. **Colores:**
   - Bordes laterales ⟷ Tokens semánticos (`{v:...}`, `{n:...}`, etc.)
   - Badges ⟷ Highlights en documentación

3. **Radios:**
   - Container ⟷ Otras cards (`.module-card`, `.grammar-card`)
   - Botones ⟷ CTAs y botones de acción

4. **Shadows:**
   - Lista ⟷ Panels, cards, modales

---

## ✨ Resultado Final

La vista de lista ahora se siente como una **parte nativa del sitio TELC**:

✅ **Botones** siguen el estilo `.btn .ghost`  
✅ **Colores** del sistema de tokens semánticos  
✅ **Tipografía** y espaciado consistentes  
✅ **Radios** y sombras estándar  
✅ **Feedback visual** coherente  

---

## 📖 Referencias

- **Diseño estándar:** `TELC/Indicaciones/disenno estandar.md`
- **Estilos globales:** `TELC/WEB/styles.css`
- **Sistema de tokens:** `TELC/WEB/grammatik/grammatik.js`

---

**Actualizado:** 2026-02-20 23:05  
**Estado:** ✅ Alineado con estándar TELC
