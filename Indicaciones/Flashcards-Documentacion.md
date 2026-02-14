# Rektion schnell trainieren (Flashcards) – Documentación Técnica

**Ubicación:** `TELC/WEB/grammatik/ergaenzungen-verbalisierung/rektion/flashcards/`

## Descripción General

El módulo "Rektion schnell trainieren" es un sistema de tarjetas de memoria (flashcards) interactivo que permite a los usuarios practicar la rección de verbos, nombres y adjetivos en alemán. El sistema carga datos desde archivos Markdown, genera tarjetas con la palabra objetivo en el frente y la preposición correspondiente en el reverso, junto con un ejemplo de uso.

---

## Estructura de Archivos

```
rektion/flashcards/
├── index.html      # Estructura HTML de las flashcards
└── flashcards.js   # Lógica completa del sistema
```

### Archivos de Datos (fuentes externas)

El sistema carga datos desde:
- `../../../verben/content.md` - Lista de verbos con rección
- `../../../nomen/content.md` - Lista de nombres con rección  
- `../../../adjektive/content.md` - Lista de adjetivos con rección

---

## Formato de Datos de Entrada

### Formato Markdown

Los archivos de contenido usan el mismo formato que el Test, con tokens semánticos:

```markdown
- {v:arbeiten} {p:an} {d:einem neuen Roman}
- {n:der Anteil} {p:an} {d:der Bevölkerung}
- {adj:gewöhnt} {p:an} {a:das hohe Arbeitstempo}
```

### Tokens Semánticos

El sistema reconoce los mismos tokens que el Test:

| Token | Tipo | Descripción |
|-------|------|-------------|
| `{v:...}` | Verbo | Palabra objetivo para verbos |
| `{n:...}` | Nomen | Palabra objetivo para nombres |
| `{adj:...}` | Adjektiv | Palabra objetivo para adjetivos |
| `{p:...}` | Präposition | Preposición (requerida para generar tarjeta) |
| `{a:...}` | Akkusativ | Complemento en acusativo |
| `{d:...}` | Dativ | Complemento en dativo |
| `{g:...}` | Genitiv | Complemento en genitivo |

### Reglas de Parsing

1. **Líneas válidas:** Solo se procesan líneas que empiezan con `- ` (guion seguido de espacio)
2. **Requisitos:** La línea debe contener:
   - El token objetivo (`{v:...}`, `{n:...}`, o `{adj:...}`)
   - Al menos una preposición (`{p:...}`)
3. **Formato:** `- {token1:valor1} {token2:valor2} ...`
4. **Separador opcional:** Puede haber texto antes de los tokens separado por `:`
   - Ejemplo: `- Texto descriptivo: {v:verbo} {p:präposition}`

---

## Arquitectura del Sistema

### Estado Global (`state`)

```javascript
const state = {
  decks: {
    verben: [],      // Tarjetas extraídas de verben/content.md
    nomen: [],       // Tarjetas extraídas de nomen/content.md
    adjektive: []    // Tarjetas extraídas de adjektive/content.md
  },
  currentDeck: [],  // Deck actual seleccionado y mezclado
  currentIndex: 0,   // Índice de la tarjeta actual (0-based)
  currentTopic: "verben"  // Tema actual seleccionado
};
```

### Estructura de Tarjeta

Cada tarjeta tiene la siguiente estructura:

```javascript
{
  term: "arbeiten",           // Palabra objetivo (verbo/nomen/adjektiv)
  preps: ["an", "auf"],       // Array de preposiciones asociadas
  example: "Die Autorin {v:arbeitet} {p:an} {d:einem neuen Roman}."  // Ejemplo de uso
}
```

### Elementos del DOM

**Controles de configuración:**
- `flash-topic` - Selector de tema (Verben/Nomen/Adjektive)
- `flash-count` - Input numérico para cantidad de tarjetas
- `flash-start` - Botón para iniciar las flashcards
- `flash-available` - Label que muestra tarjetas disponibles

**Elementos de la tarjeta:**
- `flash-stage` - Contenedor principal del área de tarjetas (con atributo `data-empty`)
- `flash-empty` - Mensaje cuando no hay tarjetas activas
- `flashcard` - Contenedor de la tarjeta (con clase `is-flipped` para voltear)
- `flashcard-topic` - Label del tema en el frente
- `flashcard-term` - Palabra objetivo en el frente
- `flashcard-answer` - Preposiciones en el reverso
- `flashcard-example` - Ejemplo de uso en el reverso

**Controles de navegación:**
- `flash-prev` - Botón "Zurück" (anterior)
- `flash-next` - Botón "Weiter" (siguiente)
- `flash-flip` - Botón "Aufdecken" (voltear)
- `flash-exit` - Botón "Beenden" (terminar)

**Indicadores de progreso:**
- `flash-progress-bar` - Barra de progreso visual
- `flash-progress-text` - Texto de progreso (ej: "3 / 10")

---

## Funciones Principales

### 1. Carga de Datos (`loadDecks()`)

**Propósito:** Carga los archivos Markdown y extrae las tarjetas.

**Proceso:**
1. Carga asíncrona de los 3 archivos `.md` usando `fetch()`
2. Parsea cada archivo con `extractCards(text, tag)`
3. Almacena tarjetas en `state.decks`
4. Habilita controles y actualiza la UI
5. Muestra estado vacío inicial

**Rutas relativas:**
- `../../../verben/content.md`
- `../../../nomen/content.md`
- `../../../adjektive/content.md`

### 2. Extracción de Tarjetas (`extractCards(text, tag)`)

**Parámetros:**
- `text` - Contenido completo del archivo Markdown
- `tag` - Tag objetivo según tema: `"v"` (verben), `"n"` (nomen), `"adj"` (adjektive)

**Proceso:**
1. Divide el texto en líneas
2. Filtra líneas que empiezan con `- ` (regex: `/^-\s+/`)
3. Solo incluye líneas que contengan:
   - El token objetivo (`{v:...}`, `{n:...}`, o `{adj:...}`)
   - Al menos una preposición (`{p:...}`)
4. Extrae la parte izquierda (antes de `:`) si existe usando `getLeftSide()`
5. Extrae la parte derecha (después de `:`) como ejemplo
6. Extrae todas las palabras objetivo del lado izquierdo usando regex: `/\{tag:([^}]+)\}/g`
7. Extrae todas las preposiciones del lado izquierdo usando regex: `/\{p:([^}]+)\}/g`
8. Agrupa múltiples palabras objetivo que comparten preposiciones usando un `Map`
9. Si una palabra objetivo aparece en múltiples líneas, combina sus preposiciones
10. Usa el primer ejemplo encontrado para cada palabra objetivo

**Retorna:** Array de objetos tarjeta:
```javascript
[
  {
    term: "arbeiten",
    preps: ["an", "auf"],
    example: "Die Autorin {v:arbeitet} {p:an} {d:einem neuen Roman}."
  },
  // ... más tarjetas
]
```

**Nota importante:** Si una palabra objetivo aparece múltiples veces con diferentes preposiciones, todas se combinan en una sola tarjeta. Por ejemplo:
- `- {v:arbeiten} {p:an} ...`
- `- {v:arbeiten} {p:auf} ...`

Resulta en una tarjeta: `{ term: "arbeiten", preps: ["an", "auf"], ... }`

### 3. Formateo de Texto Inline (`formatInline(value)`)

**Propósito:** Convierte tokens semánticos y formato Markdown en HTML.

**Proceso:**
1. Escapa HTML básico
2. Convierte código inline: `` `texto` `` → `<code>texto</code>`
3. Convierte negrita: `**texto**` → `<strong>texto</strong>`
4. Convierte tokens semánticos a spans con clases CSS:
   - `{v:...}` → `<span class="mark mark-verb">...</span>`
   - `{adj:...}` → `<span class="mark mark-adj">...</span>`
   - `{n:...}` → `<span class="mark mark-n">...</span>`
   - `{p:...}` → `<span class="mark mark-prep">...</span>`
   - `{a:...}` → `<span class="mark mark-a">...</span>`
   - `{d:...}` → `<span class="mark mark-d">...</span>`
   - `{g:...}` → `<span class="mark mark-g">...</span>`

**Retorna:** String HTML formateado

### 4. Actualización de Tarjeta (`updateCard()`)

**Propósito:** Actualiza el contenido visual de la tarjeta actual.

**Proceso:**
1. Verifica que haya tarjetas en el deck actual
2. Obtiene la tarjeta en `state.currentIndex`
3. Actualiza elementos del DOM:
   - `flashcard-topic` - Label del tema
   - `flashcard-term` - Palabra objetivo (frente)
   - `flashcard-answer` - Preposiciones unidas con " / " (reverso)
   - `flashcard-example` - Ejemplo formateado con `formatInline()` (reverso)
4. Asegura que la tarjeta no esté volteada (remueve `is-flipped`)
5. Actualiza barra de progreso: `(índice + 1) / total`
6. Actualiza texto de progreso: `"3 / 10"`
7. Habilita/deshabilita botones de navegación:
   - `prevButton` deshabilitado si `currentIndex === 0`
   - `nextButton` deshabilitado si `currentIndex >= length - 1`

### 5. Inicio de Flashcards (`startFlashcards()`)

**Proceso:**
1. Obtiene tema seleccionado y todas las tarjetas del tema
2. Obtiene cantidad solicitada y la limita al máximo disponible
3. Actualiza `state.currentTopic`
4. Mezcla todas las tarjetas con `shuffle()`
5. Selecciona las primeras N tarjetas según cantidad solicitada
6. Establece `state.currentDeck` y `state.currentIndex = 0`
7. Cambia a estado activo con `setActiveState()`
8. Actualiza la tarjeta con `updateCard()`

### 6. Voltear Tarjeta (`flipCard()`)

**Proceso:**
1. Verifica que haya tarjetas en el deck
2. Alterna la clase `is-flipped` en el elemento `flashcard`
3. La clase `is-flipped` activa la animación CSS de volteo 3D

**Eventos que activan el volteo:**
- Click en el botón "Aufdecken"
- Click en la tarjeta misma
- Tecla Enter o Espacio cuando la tarjeta tiene foco

### 7. Navegación (`goNext()` y `goPrev()`)

**`goNext()`:**
- Incrementa `state.currentIndex` si no está en el último elemento
- Llama a `updateCard()` para actualizar la vista

**`goPrev()`:**
- Decrementa `state.currentIndex` si no está en el primer elemento
- Llama a `updateCard()` para actualizar la vista

**Validación:** Ambas funciones verifican límites antes de cambiar el índice.

### 8. Reset (`resetFlashcards()`)

**Proceso:**
1. Limpia `state.currentDeck` (array vacío)
2. Resetea `state.currentIndex` a 0
3. Cambia a estado vacío con `setEmptyState()`
4. Actualiza la tarjeta (mostrará "0 / 0")

### 9. Estados de la UI

**Estado Vacío (`setEmptyState(message)`):**
- Establece `stage.dataset.empty = "true"`
- Muestra mensaje en `flash-empty`
- Remueve clase `is-flipped` de la tarjeta

**Estado Activo (`setActiveState()`):**
- Establece `stage.dataset.empty = "false"`
- Remueve clase `is-flipped` de la tarjeta

---

## Funciones Auxiliares

### `clamp(value, min, max)`
Limita un valor entre mínimo y máximo.

### `shuffle(list)`
Mezcla un array usando algoritmo Fisher-Yates. Retorna una copia mezclada sin modificar el original.

### `escapeHtml(value)`
Escapa caracteres HTML especiales (`&`, `<`, `>`, `"`).

### `getLeftSide(line)` (función interna en `extractCards`)
Extrae la parte izquierda de una línea antes de `:` (respetando llaves anidadas en tokens).

### `updateTopicOptions()`
Actualiza el texto de las opciones del selector de temas para mostrar el conteo:
- Ejemplo: "Verben (45)" en lugar de solo "Verben"

### `updateAvailable()`
Actualiza la UI según el tema seleccionado:
- Muestra cantidad disponible
- Ajusta límites del input de cantidad
- Habilita/deshabilita botón de inicio

---

## Clases CSS Utilizadas

### Estructura Principal
- `.flashcards-stage` - Contenedor principal con atributo `data-empty`
- `.flashcards-empty` - Mensaje cuando no hay tarjetas activas
- `.flashcard` - Contenedor de la tarjeta con efecto de volteo
- `.flashcard-inner` - Contenedor interno para el efecto 3D
- `.flashcard-face` - Cara de la tarjeta (frente o reverso)
- `.flashcard-front` - Cara frontal de la tarjeta
- `.flashcard-back` - Cara trasera de la tarjeta

### Contenido de la Tarjeta
- `.flashcard-label` - Label del tema o "Antwort"
- `.flashcard-term` - Palabra objetivo (frente)
- `.flashcard-prompt` - Texto "Präposition?" en el frente
- `.flashcard-answer` - Preposiciones (reverso)
- `.flashcard-example` - Ejemplo de uso formateado (reverso)

### Estados
- `.is-flipped` - Clase aplicada cuando la tarjeta está volteada (activa animación CSS)

### Progreso
- `.flashcards-progress` - Contenedor de la barra de progreso
- `.flashcards-progress-bar` - Barra visual de progreso (width se actualiza dinámicamente)
- `.flashcards-meta` - Contenedor del texto de progreso

### Controles
- `.flashcards-controls` - Contenedor de botones de navegación

### Marcas Visuales (en ejemplos)
- `.mark`, `.mark-verb`, `.mark-adj`, `.mark-n` - Palabras objetivo
- `.mark-prep` - Preposiciones
- `.mark-a`, `.mark-d`, `.mark-g` - Complementos de caso

---

## Flujo de Usuario

1. **Carga inicial:**
   - Sistema carga los 3 archivos Markdown
   - Extrae tarjetas y cuenta disponibles
   - Habilita controles de configuración
   - Muestra estado vacío: "Thema und Anzahl wählen, dann starten."

2. **Configuración:**
   - Usuario selecciona tema (Verben/Nomen/Adjektive)
   - Sistema muestra cantidad disponible
   - Usuario selecciona cantidad de tarjetas (1 a máximo disponible)
   - Sistema ajusta automáticamente si se excede el máximo

3. **Inicio:**
   - Usuario hace clic en "Starten"
   - Sistema mezcla todas las tarjetas del tema
   - Selecciona las primeras N según cantidad solicitada
   - Muestra la primera tarjeta con la palabra objetivo en el frente

4. **Estudio:**
   - Usuario ve la palabra objetivo (ej: "arbeiten")
   - Usuario intenta recordar la preposición
   - Usuario hace clic en "Aufdecken" o en la tarjeta para voltear
   - Ve la respuesta: preposiciones (ej: "an / auf") y ejemplo de uso

5. **Navegación:**
   - Usuario puede usar "Zurück" para ver tarjeta anterior
   - Usuario puede usar "Weiter" para ver siguiente tarjeta
   - La barra de progreso muestra posición actual (ej: "3 / 10")
   - Los botones se deshabilitan en los extremos

6. **Finalización:**
   - Usuario puede hacer clic en "Beenden" en cualquier momento
   - Sistema resetea y vuelve al estado de configuración

---

## Características Especiales

### 1. Agrupación Inteligente

Si una palabra objetivo aparece múltiples veces en el archivo con diferentes preposiciones, el sistema las combina en una sola tarjeta:

**Ejemplo:**
```markdown
- {v:arbeiten} {p:an} {d:einem neuen Roman}
- {v:arbeiten} {p:auf} {a:ein Projekt}
```

**Resultado:** Una tarjeta con `preps: ["an", "auf"]`

### 2. Múltiples Preposiciones

Las tarjetas pueden tener múltiples preposiciones válidas, mostradas separadas por " / ":
- Ejemplo: "an / auf / für"

### 3. Ejemplos Formateados

Los ejemplos se formatean automáticamente:
- Tokens semánticos se convierten en spans con clases CSS
- Código inline y negrita se convierten a HTML
- Permite resaltado visual de diferentes elementos gramaticales

### 4. Animación de Volteo

La tarjeta usa CSS 3D transforms para el efecto de volteo:
- Clase `.is-flipped` activa la rotación
- El efecto es puramente CSS, sin JavaScript adicional

### 5. Accesibilidad

- La tarjeta tiene `tabindex="0"` para navegación por teclado
- `role="button"` para lectores de pantalla
- `aria-label="Karte aufdecken"` para descripción
- Soporte para Enter y Espacio para voltear

### 6. Progreso Visual

- Barra de progreso que se llena proporcionalmente
- Texto de progreso muestra posición actual y total
- Botones de navegación se deshabilitan en extremos

---

## Validaciones y Restricciones

1. **Cantidad de tarjetas:** Se limita automáticamente al número disponible en el tema seleccionado.

2. **Navegación:** Los botones "Zurück" y "Weiter" se deshabilitan en los extremos para prevenir índices inválidos.

3. **Estado vacío:** Si no hay tarjetas disponibles, se muestra mensaje y se deshabilita el botón de inicio.

4. **Volteo:** Solo funciona si hay tarjetas en el deck actual.

5. **Manejo de errores:** Si falla la carga de archivos, se muestra mensaje de error en lugar de crashear.

---

## Dependencias

- **Ninguna librería externa:** El sistema es vanilla JavaScript
- **Fetch API:** Para cargar archivos Markdown
- **CSS 3D Transforms:** Para el efecto de volteo de la tarjeta
- **CSS:** Requiere estilos definidos en `styles.css` para las clases mencionadas

---

## Notas de Implementación

1. **Cache deshabilitado:** Los archivos se cargan con `{ cache: "no-store" }` para asegurar datos actualizados.

2. **Shuffle:** Las tarjetas se mezclan antes de seleccionar las N solicitadas para variar el orden.

3. **Agrupación:** El uso de `Map` en `extractCards()` permite combinar eficientemente múltiples ocurrencias de la misma palabra objetivo.

4. **Formateo inline:** Los ejemplos se formatean en tiempo real, no se almacenan pre-formateados.

5. **Estado persistente:** El estado se mantiene durante la sesión, permitiendo navegar libremente entre tarjetas.

6. **Event listeners múltiples:** La tarjeta puede voltearse mediante click directo, botón dedicado, o teclado (Enter/Espacio).

---

## Diferencias con el Test

| Característica | Flashcards | Test |
|----------------|------------|------|
| **Interacción** | Volteo de tarjeta | Campos de selección múltiple |
| **Respuesta** | Mostrar/ocultar | Seleccionar de opciones |
| **Verificación** | No hay verificación automática | Comparación de respuestas |
| **Navegación** | Anterior/Siguiente | Solo reset |
| **Agrupación** | Combina múltiples preposiciones | No agrupa |
| **Ejemplos** | Siempre visibles en reverso | No se muestran |
| **Progreso** | Barra visual + texto | No hay indicador |

---

## Extensibilidad

Para agregar nuevos temas o funcionalidades:

1. **Nuevo tema:**
   - Agregar entrada en `topicLabels`
   - Agregar deck en `state.decks`
   - Agregar opción en el `<select>` de temas en `index.html`
   - Agregar ruta de carga en `loadDecks()`

2. **Nuevo tipo de token:**
   - Agregar regex en `formatInline()` para convertir a HTML
   - Agregar clase CSS correspondiente

3. **Nueva funcionalidad:**
   - Agregar función en `flashcards.js`
   - Conectar con event listeners en `DOMContentLoaded`
   - Actualizar UI según sea necesario

---

## Ejemplo de Uso del Sistema

**Datos de entrada (verben/content.md):**
```markdown
- {v:arbeiten} {p:an} {d:einem neuen Roman}
- {v:denken} {p:an} {a:die Zukunft}
- {v:arbeiten} {p:auf} {a:ein Projekt}
```

**Tarjetas generadas:**
```javascript
[
  {
    term: "arbeiten",
    preps: ["an", "auf"],
    example: "Die Autorin {v:arbeitet} {p:an} {d:einem neuen Roman}."
  },
  {
    term: "denken",
    preps: ["an"],
    example: "{v:Denkst} du oft {p:an} {a:deine Heimat}?"
  }
]
```

**Flujo:**
1. Usuario selecciona "Verben" y cantidad "2"
2. Sistema mezcla y selecciona 2 tarjetas
3. Usuario ve "arbeiten" en el frente
4. Usuario voltea y ve "an / auf" + ejemplo formateado
5. Usuario navega a siguiente tarjeta
6. Usuario ve "denken" en el frente
7. Usuario voltea y ve "an" + ejemplo formateado

