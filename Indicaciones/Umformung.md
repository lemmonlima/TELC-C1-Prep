# Kausal-Angaben Übungen – Documentación Técnica

**Ubicación:** `TELC/WEB/grammatik/angaben/uebungen/4-4-kausal/`

## Descripción General

El módulo "Kausal-Angaben Übungen" es un sistema interactivo de ejercicios que permite a los usuarios practicar la transformación entre formas nominales y oraciones causales en alemán. El sistema carga ejercicios desde un archivo Markdown, permite seleccionar qué ejercicio realizar, y ofrece dos tipos de interacción: entrada de texto libre (ejercicios 28-30, 32, 34) y selección múltiple (ejercicio 31).

---

## Estructura de Archivos

```
4-4-kausal/
├── index.html      # Estructura HTML del sistema de ejercicios
├── exercise.js     # Lógica completa del sistema
└── content.md      # Archivo Markdown con todos los ejercicios
```

---

## Formato de Datos de Entrada

### Formato Markdown

El archivo `content.md` contiene los ejercicios organizados por número, usando el siguiente formato:

**Para ejercicios de texto (28-30, 32, 34):**
```markdown
## 28. Formen Sie um!

1. {ang-kausal:Wegen des unerträglichen Straßenlärms} wollen wir hier ausziehen.
   → {ang-kausal:Weil der Straßenlärm unerträglich ist}, wollen wir hier ausziehen.

2. {ang-kausal:Aus Freude über die guten Prüfungsnoten} veranstalteten die Studierenden eine Fete.
   → {ang-kausal:Weil sie sich über die guten Prüfungsnoten freuten}, veranstalteten die Studierenden eine Fete.
```

**Para ejercicio de selección múltiple (31):**
```markdown
## 31. Drücken Sie die Kausalität mit a) „denn" und b) „nämlich" aus!

1. Die Zeitschrift wurde eingestellt, weil es nicht mehr genug Abonnenten gab.
   a) Die Zeitschrift wurde eingestellt, denn es gab nicht mehr genug Abonnenten.
   b) Die Zeitschrift wurde eingestellt; es gab nämlich nicht mehr genug Abonnenten.
```

### Tokens Semánticos

El sistema reconoce el siguiente token semántico:

| Token | Tipo | Descripción |
|-------|------|-------------|
| `{ang-kausal:...}` | Kausal-Angabe | Marca elementos relacionados con causalidad (se elimina al mostrar) |

### Reglas de Parsing

1. **Encabezados de ejercicio:** Líneas que empiezan con `## ` seguidas de número y título
   - Formato: `## 28. Título del ejercicio`
   - Solo se procesan ejercicios: 28, 29, 30, 31, 32, 34

2. **Items de ejercicio:** Líneas que empiezan con número seguido de punto
   - Formato: `1. Contenido...` o `10. Contenido...`

3. **Respuestas en la misma línea:** Si hay una flecha `→` en la misma línea del item
   - Formato: `1. Original → Respuesta`

4. **Respuestas en línea siguiente:** Si la respuesta está en una línea separada
   - Formato: `1. Original` seguido de `   → Respuesta` (con indentación)

5. **Ejercicio 31 (múltiple):** Formato especial con opciones a) y b)
   - Formato: `1. Original` seguido de `   a) Opción a` y `   b) Opción b`

---

## Arquitectura del Sistema

### Estado Global (`state`)

```javascript
const state = {
  exercises: {},           // Objeto con todos los ejercicios extraídos
  currentExercise: null,   // Número del ejercicio actual seleccionado
  currentExerciseNumber: null,  // Número como entero
  currentItems: []         // Array de elementos DOM de los items actuales
};
```

### Estructura de Ejercicio

Cada ejercicio tiene la siguiente estructura:

```javascript
{
  number: "28",           // Número del ejercicio como string
  title: "Formen Sie um!",  // Título del ejercicio
  items: [                // Array de items del ejercicio
    {
      number: 1,          // Número del item
      original: "...",     // Texto original (sin tags semánticos)
      answer: "...",       // Respuesta correcta (sin tags semánticos)
      type: "text"        // Tipo: "text" o "multiple"
    },
    // Para ejercicio 31, los items tienen:
    {
      number: 1,
      original: "...",
      answers: {           // Objeto con opciones a) y b)
        a: "...",
        b: "..."
      },
      type: "multiple"
    }
  ]
}
```

### Elementos del DOM

**Controles de configuración:**
- `exercise-select` - Selector dropdown para elegir ejercicio
- `exercise-start` - Botón "Starten" para iniciar el ejercicio seleccionado

**Elementos de contenido:**
- `exercise-content` - Contenedor principal del área de ejercicios (oculto inicialmente)
- `exercise-header` - Encabezado que muestra el título del ejercicio
- `exercise-list` - Contenedor donde se renderizan los items del ejercicio

**Controles de acción:**
- `exercise-check` - Botón "Prüfen" para verificar respuestas
- `exercise-reset` - Botón "Zurücksetzen" para resetear respuestas

---

## Funciones Principales

### 1. Carga de Ejercicios (`loadExercises()`)

**Propósito:** Carga el archivo Markdown y extrae todos los ejercicios.

**Proceso:**
1. Hace fetch del archivo `content.md` con `{ cache: "no-store" }` para evitar caché
2. Parsea el texto con `extractExercises(text)`
3. Almacena los ejercicios en `state.exercises`
4. Llama a `updateExerciseSelect()` para poblar el selector
5. Maneja errores mostrando mensaje en el selector si falla

**Ruta relativa:** `content.md` (mismo directorio)

### 2. Extracción de Ejercicios (`extractExercises(text)`)

**Parámetros:**
- `text` - Contenido completo del archivo Markdown

**Proceso:**
1. Divide el texto en líneas
2. Itera línea por línea manteniendo estado de ejercicio e item actual
3. Detecta encabezados de ejercicio con regex: `/^##\s+(\d+)\.\s+(.+)$/`
4. Solo procesa ejercicios válidos: ["28", "29", "30", "31", "32", "34"]
5. Detecta items con regex: `/^(\d+)\.\s+(.+)$/`
6. Para cada item:
   - **Ejercicio 31:** Extrae original completo y prepara objeto `answers` para a) y b)
   - **Otros ejercicios:** Busca flecha `→` en la misma línea o en línea siguiente
7. Maneja líneas de continuación:
   - Líneas que empiezan con `→` (respuesta)
   - Líneas que empiezan con `a)` o `b)` (opciones del ejercicio 31)
   - Líneas con indentación y `→` (respuesta indentada)
8. Elimina tags semánticos `{ang-kausal:...}` usando `removeSemanticTags()`

**Retorna:** Objeto con estructura:
```javascript
{
  "28": { number: "28", title: "...", items: [...] },
  "29": { number: "29", title: "...", items: [...] },
  // ...
}
```

### 3. Actualización del Selector (`updateExerciseSelect()`)

**Proceso:**
1. Limpia el selector y agrega opción por defecto "Bitte wählen..."
2. Itera sobre ejercicios permitidos: ["28", "29", "30", "31", "32", "34"]
3. Solo agrega ejercicios que existen y tienen items
4. Crea elementos `<option>` con valor (número) y texto (label completo)
5. Habilita el selector (`disabled = false`)

**Labels de ejercicios:**
- Definidos en constante `exerciseLabels` con títulos completos

### 4. Renderizado de Ejercicio (`renderExercise()`)

**Proceso:**
1. Verifica que haya un ejercicio seleccionado
2. Obtiene el ejercicio de `state.exercises[state.currentExercise]`
3. Actualiza el encabezado con el título del ejercicio
4. Limpia la lista de items
5. Itera sobre cada item del ejercicio:
   
   **Para ejercicio 31 (múltiple):**
   - Crea estructura con radio buttons
   - Muestra original sin marcar
   - Muestra ambas opciones a) y b) completas como labels clickeables
   - Cada radio button tiene `name="exercise-{número}"` para agrupar por item
   
   **Para otros ejercicios (texto):**
   - Crea estructura con campo de texto
   - Muestra original sin marcar
   - Crea input de texto con `data-answer` conteniendo respuesta correcta
   - Para ejercicio 32: reemplaza `;` con `,` en la respuesta correcta
6. Almacena referencias a elementos DOM en `state.currentItems`
7. Muestra el contenido (`display: block`)

### 5. Inicio de Ejercicio (`startExercise()`)

**Proceso:**
1. Obtiene el valor seleccionado del selector
2. Valida que exista el ejercicio en `state.exercises`
3. Actualiza `state.currentExercise` y `state.currentExerciseNumber`
4. Llama a `renderExercise()` para mostrar los items

### 6. Verificación (`checkExercise()`)

**Proceso:**
1. Itera sobre todos los items en `state.currentItems`
2. Obtiene el elemento de feedback de cada item

   **Para ejercicio 31 (múltiple):**
   - Busca todos los radio buttons del item
   - Verifica si hay alguno seleccionado
   - Si no hay selección: marca como incorrecto y muestra mensaje
   - Si hay selección: marca como correcto (ambas opciones son válidas)
   - Marca visualmente la opción seleccionada como correcta
   
   **Para otros ejercicios (texto):**
   - Obtiene el input de texto
   - Normaliza la respuesta del usuario con `normalizeText()`
   - Normaliza la respuesta correcta del `data-answer`
   - Compara ambas respuestas normalizadas
   - Si coinciden: marca como correcto (verde) y muestra "Richtig!"
   - Si no coinciden: marca como incorrecto (rojo) y muestra la respuesta correcta

3. Aplica clases CSS:
   - `is-correct` - Para items correctos (borde verde, fondo verde claro)
   - `is-wrong` - Para items incorrectos (borde rojo, fondo rojo claro)
   - `is-correct` / `is-wrong` en inputs - Para resaltar campos individuales

### 7. Reset (`resetExercise()`)

**Proceso:**
1. Itera sobre todos los items en `state.currentItems`

   **Para ejercicio 31:**
   - Desmarca todos los radio buttons
   - Remueve clase `is-selected-correct` de los labels
   
   **Para otros ejercicios:**
   - Limpia valores de inputs de texto
   - Remueve clases `is-correct` y `is-wrong` de los inputs

2. Remueve clases `is-correct` y `is-wrong` de los items
3. Limpia el contenido de feedback

---

## Funciones Auxiliares

### `escapeHtml(value)`
Escapa caracteres HTML especiales para prevenir XSS:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`

### `normalizeText(text)`
Normaliza texto para comparación:
1. Trim (elimina espacios al inicio y final)
2. Convierte a minúsculas
3. Normaliza espacios múltiples a uno solo
4. Reemplaza `;` y `,` por `,` (para ejercicio 32)
5. Normaliza espacios alrededor de comas

**Ejemplo:**
```
"  Die Antwort  ,  richtig  ;  " 
→ "die antwort, richtig,"
```

### `removeSemanticTags(text)`
Elimina tags semánticos `{ang-kausal:...}` del texto, dejando solo el contenido.

**Ejemplo:**
```
"{ang-kausal:Weil es regnet} gehen wir nicht."
→ "Weil es regnet gehen wir nicht."
```

---

## Clases CSS Utilizadas

### Estructura Principal
- `.exercise-panel` - Contenedor principal del panel de ejercicios
- `.exercise-setup` - Área de configuración (selector + botón)
- `.exercise-content` - Contenedor del contenido (oculto inicialmente)
- `.exercise-header` - Encabezado con título del ejercicio
- `.exercise-list` - Lista de items del ejercicio

### Items de Ejercicio
- `.exercise-item` - Contenedor de cada item individual
- `.exercise-item-number` - Número del item (ej: "1.")
- `.exercise-item-content` - Contenido del item
- `.exercise-original` - Texto original sin marcar
- `.exercise-input-wrapper` - Contenedor del campo de texto
- `.exercise-input` - Campo de texto para respuesta
- `.exercise-feedback` - Área de feedback para cada item

### Ejercicio 31 (Múltiple)
- `.exercise-multiple-choice` - Contenedor de opciones múltiples
- `.exercise-option-label` - Label clickeable para cada opción
- `.exercise-radio` - Radio button para selección
- `.exercise-option-text` - Texto de la opción completa

### Estados
- `.is-correct` - Aplicada cuando la respuesta es correcta
  - Borde verde, fondo verde claro
- `.is-wrong` - Aplicada cuando la respuesta es incorrecta
  - Borde rojo, fondo rojo claro
- `.is-selected-correct` - Para opciones seleccionadas correctas (ejercicio 31)

### Feedback
- `.feedback-correct` - Texto de feedback correcto (verde)
- `.feedback-wrong` - Texto de feedback incorrecto (rojo)

### Controles
- `.exercise-actions` - Contenedor de botones de acción
- `.btn`, `.btn-primary`, `.btn-ghost` - Estilos de botones del sistema

---

## Flujo de Usuario

1. **Carga inicial:**
   - Sistema carga `content.md`
   - Extrae todos los ejercicios (28-34)
   - Puebla el selector con ejercicios disponibles
   - Habilita el selector

2. **Selección de ejercicio:**
   - Usuario selecciona un ejercicio del dropdown
   - El botón "Starten" se habilita automáticamente
   - Usuario hace clic en "Starten"

3. **Visualización de ejercicios:**
   - Sistema muestra el título del ejercicio
   - Renderiza todos los items del ejercicio en orden
   - Para ejercicios de texto: muestra original + campo de texto
   - Para ejercicio 31: muestra original + opciones a) y b) con radio buttons

4. **Completar ejercicios:**
   - **Ejercicios de texto:** Usuario escribe la respuesta en el campo de texto
   - **Ejercicio 31:** Usuario selecciona una opción (a) o b))

5. **Verificación:**
   - Usuario hace clic en "Prüfen"
   - Sistema compara respuestas normalizadas
   - Muestra feedback visual:
     - Verde: Respuesta correcta
     - Rojo: Respuesta incorrecta con respuesta correcta mostrada

6. **Reset:**
   - Usuario puede hacer clic en "Zurücksetzen" en cualquier momento
   - Sistema limpia todas las respuestas y feedback
   - Permite intentar de nuevo

---

## Características Especiales

### 1. Normalización de Respuestas

El sistema normaliza tanto las respuestas del usuario como las correctas antes de comparar:
- Elimina diferencias de mayúsculas/minúsculas
- Normaliza espacios múltiples
- Maneja puntuación (especialmente `;` vs `,` para ejercicio 32)

Esto permite que respuestas como "Die Antwort, richtig" y "die antwort,richtig" sean consideradas iguales.

### 2. Manejo Especial del Ejercicio 32

El ejercicio 32 requiere usar comas en lugar de punto y coma. El sistema:
- Reemplaza automáticamente `;` con `,` en las respuestas correctas al renderizar
- Normaliza ambas respuestas durante la verificación

### 3. Ejercicio 31: Selección Múltiple

El ejercicio 31 es único porque:
- Muestra ambas opciones completas (a) y b))
- Usuario solo selecciona una opción (no escribe)
- Ambas opciones son válidas (cualquier selección es correcta)
- Usa radio buttons agrupados por item (`name="exercise-{número}"`)

### 4. Eliminación de Tags Semánticos

Todos los textos se muestran sin tags semánticos `{ang-kausal:...}`:
- El original se muestra limpio
- Las respuestas correctas se almacenan sin tags
- Esto permite que el usuario vea el texto tal como debe escribirlo

### 5. Orden No Randomizado

Los ejercicios se muestran en el orden exacto del archivo Markdown:
- No hay mezcla aleatoria
- Mantiene la secuencia didáctica original
- Facilita la referencia al material fuente

---

## Validaciones y Restricciones

1. **Ejercicios permitidos:** Solo se procesan ejercicios 28, 29, 30, 31, 32, 34 (el 33 no está incluido)

2. **Selección requerida:** Para ejercicio 31, se valida que el usuario haya seleccionado una opción antes de marcar como correcto

3. **Normalización:** Todas las comparaciones usan texto normalizado para mayor flexibilidad

4. **Escape HTML:** Todo el contenido se escapa para prevenir XSS

5. **Manejo de errores:** Si falla la carga del archivo, se muestra mensaje de error en lugar de crashear

---

## Dependencias

- **Ninguna librería externa:** El sistema es vanilla JavaScript
- **Fetch API:** Para cargar el archivo Markdown
- **CSS:** Requiere estilos definidos en `styles.css` para las clases mencionadas

---

## Notas de Implementación

1. **Cache deshabilitado:** El archivo se carga con `{ cache: "no-store" }` para asegurar datos actualizados

2. **Obtención de elementos DOM:** Los elementos se obtienen dentro de `DOMContentLoaded` para evitar errores de elementos no encontrados

3. **Verificación de elementos:** Se valida que todos los elementos requeridos existan antes de continuar

4. **Normalización flexible:** La normalización permite variaciones en espacios y puntuación sin afectar la corrección

5. **Feedback inmediato:** El feedback se muestra inmediatamente después de verificar, con colores distintivos

6. **Reset completo:** El reset limpia tanto valores como estados visuales (clases CSS)

---

## Diferencias con Otros Sistemas

| Característica | Kausal-Angaben | Rektion Test | Rektion Flashcards |
|----------------|----------------|--------------|-------------------|
| **Tipo de interacción** | Texto libre + Selección | Selección múltiple | Volteo de tarjeta |
| **Verificación** | Comparación de texto | Comparación de selecciones | No hay verificación |
| **Orden** | Fijo (no randomizado) | Aleatorio | Aleatorio |
| **Cantidad** | Todos los items | Selección de cantidad | Selección de cantidad |
| **Ejercicios múltiples** | Sí (28-34) | No | No |
| **Tipos de ejercicio** | Texto + Múltiple | Solo selección | Solo visualización |

---

## Extensibilidad

Para agregar nuevos ejercicios o funcionalidades:

1. **Nuevo ejercicio:**
   - Agregar número en array `allowedExercises` en `updateExerciseSelect()`
   - Agregar número en array de validación en `extractExercises()`
   - Agregar label en `exerciseLabels`
   - El formato en `content.md` debe seguir las reglas de parsing

2. **Nuevo tipo de ejercicio:**
   - Agregar lógica en `extractExercises()` para detectar el nuevo formato
   - Agregar tipo en estructura de item (`type: "nuevo-tipo"`)
   - Agregar renderizado en `renderExercise()` para el nuevo tipo
   - Agregar verificación en `checkExercise()` para el nuevo tipo
   - Agregar reset en `resetExercise()` para el nuevo tipo

3. **Nuevo token semántico:**
   - Agregar función para eliminar el nuevo token (similar a `removeSemanticTags()`)
   - Aplicar en `extractExercises()` donde corresponda

4. **Nuevas validaciones:**
   - Agregar lógica en `checkExercise()` según necesidades específicas

---

## Ejemplo de Uso del Sistema

**Datos de entrada (content.md):**
```markdown
## 28. Formen Sie um!

1. {ang-kausal:Wegen des Lärms} ziehen wir um.
   → {ang-kausal:Weil es laut ist}, ziehen wir um.

2. {ang-kausal:Aus Freude} feiern wir.
   → {ang-kausal:Weil wir uns freuen}, feiern wir.
```

**Estructura extraída:**
```javascript
{
  "28": {
    number: "28",
    title: "Formen Sie um!",
    items: [
      {
        number: 1,
        original: "Wegen des Lärms ziehen wir um.",
        answer: "Weil es laut ist, ziehen wir um.",
        type: "text"
      },
      {
        number: 2,
        original: "Aus Freude feiern wir.",
        answer: "Weil wir uns freuen, feiern wir.",
        type: "text"
      }
    ]
  }
}
```

**Flujo:**
1. Usuario selecciona "28. Formen Sie um!" del selector
2. Usuario hace clic en "Starten"
3. Sistema muestra:
   - Item 1: "Wegen des Lärms ziehen wir um." + campo de texto
   - Item 2: "Aus Freude feiern wir." + campo de texto
4. Usuario escribe respuestas en los campos
5. Usuario hace clic en "Prüfen"
6. Sistema compara y muestra feedback (verde/rojo)
7. Usuario puede hacer clic en "Zurücksetzen" para limpiar y volver a intentar

