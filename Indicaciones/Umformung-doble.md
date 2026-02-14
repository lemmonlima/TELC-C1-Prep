# Konditional-Angaben Übung 43 – Documentación Técnica (Umformung doble)

**Ubicación:** `TELC/WEB/grammatik/angaben/uebungen/4-7-konditional/`

## Descripción General

El ejercicio 43 de "Konditional-Angaben" es un sistema interactivo de ejercicios que permite a los usuarios practicar la transformación de oraciones condicionales usando dos adverbios específicos: "dann" (a)) y "sonst"/"andernfalls" (b)). A diferencia de otros ejercicios de texto que tienen un solo campo de entrada, el ejercicio 43 requiere **dos campos de texto por cada item**, etiquetados como "a)" y "b)", donde el usuario debe escribir ambas respuestas.

---

## Estructura de Archivos

```
4-7-konditional/
├── index.html      # Estructura HTML del sistema de ejercicios
├── exercise.js     # Lógica completa del sistema (incluye ejercicio 43)
└── content.md      # Archivo Markdown con todos los ejercicios
```

**Nota:** El ejercicio 43 está integrado en `exercise.js` junto con los ejercicios 42, 44, 45 y 46. No tiene archivos separados.

---

## Formato de Datos de Entrada

### Formato Markdown

El archivo `content.md` contiene el ejercicio 43 con el siguiente formato:

```markdown
## 43. Formen Sie um! Benutzen Sie a) „dann" und b) „sonst" bzw. „andernfalls"!

1. Man darf nur mit angelegtem Gurt losfahren.
   → a) Man muss den Gurt anlegen; {ang-kond:dann} darf man losfahren.
   → b) Man muss den Gurt anlegen; {ang-kond:sonst} darf man nicht losfahren.

2. Nur bei geöffneter Schranke darf man die Eisenbahngleise überqueren.
   → a) Die Schranke muss geöffnet sein; {ang-kond:dann} darf man die Eisenbahngleise überqueren.
   → b) Die Schranke muss geöffnet sein; {ang-kond:sonst} darf man die Eisenbahngleise nicht überqueren.
```

### Tokens Semánticos

El sistema reconoce el siguiente token semántico:

| Token | Tipo | Descripción |
|-------|------|-------------|
| `{ang-kond:...}` | Konditional-Adverb | Marca el adverbio condicional que debe ser insertado (se elimina al mostrar) |

**Nota:** Los tokens `{ang-kond:dann}`, `{ang-kond:sonst}`, `{ang-kond:andernfalls}` se eliminan durante el parsing, y las respuestas completas se almacenan sin estos tokens.

### Reglas de Parsing

1. **Encabezado de ejercicio:** Línea que empieza con `## 43.`
   - Formato: `## 43. Formen Sie um! Benutzen Sie a) „dann" und b) „sonst" bzw. „andernfalls"!`

2. **Items de ejercicio:** Líneas que empiezan con número seguido de punto
   - Formato: `1. Man darf nur mit angelegtem Gurt losfahren.`
   - Esta línea se almacena como `original`

3. **Respuestas a) y b):** Líneas que empiezan con `→ a)` o `→ b)` (con o sin indentación)
   - Formato: `   → a) Man muss den Gurt anlegen; {ang-kond:dann} darf man losfahren.`
   - Formato: `   → b) Man muss den Gurt anlegen; {ang-kond:sonst} darf man nicht losfahren.`
   - Los tokens `{ang-kond:...}` se eliminan durante el parsing
   - Los punto y coma (`;`) se reemplazan automáticamente por comas (`,`)

---

## Arquitectura del Sistema

### Estado Global (`state`)

```javascript
const state = {
  exercises: {},           // Objeto con todos los ejercicios extraídos
  currentExercise: null,   // Número del ejercicio actual seleccionado ("43")
  currentExerciseNumber: null,  // Número como entero
  currentItems: []         // Array de elementos DOM de los items actuales
};
```

### Estructura de Item (Ejercicio 43)

Cada item del ejercicio 43 tiene la siguiente estructura:

```javascript
{
  number: 1,              // Número del item
  original: "Man darf nur mit angelegtem Gurt losfahren.",
  answers: {              // Objeto con ambas respuestas
    a: "Man muss den Gurt anlegen, dann darf man losfahren.",
    b: "Man muss den Gurt anlegen, sonst darf man nicht losfahren."
  },
  type: "multiple-text"   // Tipo especial para ejercicio 43
}
```

**Nota:** A diferencia de otros ejercicios (que tienen `original` y `answer`), el ejercicio 43 tiene `original` y `answers` con propiedades `a` y `b`.

---

## Funciones Principales

### 1. Extracción de Ejercicios (`extractExercises(text)`)

**Proceso para ejercicio 43:**
1. Detecta el encabezado `## 43.`
2. Para cada item:
   - Extrae la línea con número: `1. Man darf nur...` → `original`
   - Busca líneas con `→ a)` y `→ b)`
   - Extrae el contenido después de `→ a)` y `→ b)`
   - Elimina tokens semánticos `{ang-kond:...}`
   - Reemplaza `;` con `,` en ambas respuestas
   - Almacena en `answers.a` y `answers.b`

**Ejemplo de extracción:**
```javascript
// Input Markdown:
// 1. Man darf nur mit angelegtem Gurt losfahren.
//    → a) Man muss den Gurt anlegen; {ang-kond:dann} darf man losfahren.
//    → b) Man muss den Gurt anlegen; {ang-kond:sonst} darf man nicht losfahren.

// Output:
{
  number: 1,
  original: "Man darf nur mit angelegtem Gurt losfahren.",
  answers: {
    a: "Man muss den Gurt anlegen, dann darf man losfahren.",
    b: "Man muss den Gurt anlegen, sonst darf man nicht losfahren."
  },
  type: "multiple-text"
}
```

### 2. Renderizado de Ejercicio (`renderExercise()`)

**Proceso para ejercicio 43:**
1. Verifica que `state.currentExercise === "43"`
2. Para cada item:
   - Crea estructura HTML con:
     - Número del item
     - Texto original (sin marcar)
     - **Campo de texto a)** con label "a)" y `data-answer` con respuesta a)
     - **Campo de texto b)** con label "b)" y `data-answer` con respuesta b)
     - Área de feedback

**Estructura HTML generada:**
```html
<div class="exercise-item">
  <div class="exercise-item-number">1.</div>
  <div class="exercise-item-content">
    <div class="exercise-original">Man darf nur mit angelegtem Gurt losfahren.</div>
    <div class="exercise-input-wrapper">
      <label class="exercise-input-label">a)</label>
      <input type="text" class="exercise-input" data-answer="Man muss den Gurt anlegen, dann darf man losfahren." placeholder="Ihre Antwort a) eingeben..." />
    </div>
    <div class="exercise-input-wrapper">
      <label class="exercise-input-label">b)</label>
      <input type="text" class="exercise-input" data-answer="Man muss den Gurt anlegen, sonst darf man nicht losfahren." placeholder="Ihre Antwort b) eingeben..." />
    </div>
    <div class="exercise-feedback"></div>
  </div>
</div>
```

### 3. Verificación (`checkExercise()`)

**Proceso para ejercicio 43:**
1. Itera sobre todos los items en `state.currentItems`
2. Para cada item:
   - Obtiene ambos inputs (a) y b))
   - Normaliza ambas respuestas del usuario con `normalizeText()`
   - Normaliza ambas respuestas correctas de `data-answer`
   - Compara cada par de respuestas
   - Si ambas son correctas:
     - Marca item como `is-correct`
     - Muestra "Richtig!" en verde
   - Si alguna es incorrecta o está vacía:
     - Marca item como `is-wrong`
     - **Siempre muestra ambas respuestas correctas** en el formato: `Antworten: a) [respuesta a] | b) [respuesta b]`

**Característica especial:** El feedback siempre muestra ambas respuestas correctas cuando se hace clic en "Prüfen", incluso si los campos están vacíos.

### 4. Reset (`resetExercise()`)

**Proceso:**
1. Itera sobre todos los items
2. Limpia valores de ambos inputs (a) y b))
3. Remueve clases `is-correct` y `is-wrong` de inputs e items
4. Limpia el contenido de feedback

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
4. Reemplaza `;` y `,` por `,` (unificación de puntuación)
5. Normaliza espacios alrededor de comas

**Ejemplo:**
```
"  Die Antwort  ,  richtig  ;  " 
→ "die antwort, richtig,"
```

### `removeSemanticTags(text)`
Elimina tokens semánticos `{ang-kond:...}` del texto, dejando solo el contenido.

**Ejemplo:**
```
"Man muss den Gurt anlegen; {ang-kond:dann} darf man losfahren."
→ "Man muss den Gurt anlegen; dann darf man losfahren."
```

---

## Clases CSS Utilizadas

### Estructura Principal
- `.exercise-panel` - Contenedor principal del panel de ejercicios
- `.exercise-content` - Contenedor del contenido
- `.exercise-item` - Contenedor de cada item individual
- `.exercise-item-number` - Número del item (ej: "1.")
- `.exercise-item-content` - Contenido del item

### Campos de Entrada
- `.exercise-original` - Texto original sin marcar
- `.exercise-input-wrapper` - Contenedor de cada campo de texto (con label)
- `.exercise-input-label` - Label para "a)" o "b)"
- `.exercise-input` - Campo de texto para respuesta
- `.exercise-feedback` - Área de feedback para cada item

### Estados
- `.is-correct` - Aplicada cuando ambas respuestas son correctas
  - Borde verde, fondo verde claro
- `.is-wrong` - Aplicada cuando alguna respuesta es incorrecta o está vacía
  - Borde rojo, fondo rojo claro
- `.is-correct` / `.is-wrong` en inputs - Para resaltar campos individuales

### Feedback
- `.feedback-correct` - Texto de feedback correcto (verde)
- `.feedback-wrong` - Texto de feedback incorrecto (rojo)

---

## Flujo de Usuario

1. **Carga inicial:**
   - Sistema carga `content.md`
   - Extrae todos los ejercicios (42-46)
   - Usuario selecciona ejercicio 43 del dropdown

2. **Inicio de ejercicio:**
   - Usuario hace clic en "Starten"
   - Sistema renderiza todos los items del ejercicio 43

3. **Visualización de ejercicios:**
   - Sistema muestra cada item con:
     - Texto original
     - Campo de texto etiquetado "a)" para respuesta con "dann"
     - Campo de texto etiquetado "b)" para respuesta con "sonst"/"andernfalls"

4. **Completar ejercicios:**
   - Usuario escribe la respuesta a) en el primer campo
   - Usuario escribe la respuesta b) en el segundo campo
   - Puede completar todos los items antes de verificar

5. **Verificación:**
   - Usuario hace clic en "Prüfen"
   - Sistema compara ambas respuestas normalizadas para cada item
   - Muestra feedback visual:
     - Verde: Ambas respuestas correctas → "Richtig!"
     - Rojo: Alguna incorrecta o vacía → "Antworten: a) [respuesta a] | b) [respuesta b]"
   - **Importante:** El feedback siempre muestra ambas respuestas correctas, incluso si los campos están vacíos

6. **Reset:**
   - Usuario puede hacer clic en "Zurücksetzen" en cualquier momento
   - Sistema limpia todas las respuestas y feedback
   - Permite intentar de nuevo

---

## Características Especiales

### 1. Dos Campos de Texto por Item

A diferencia de otros ejercicios que tienen un solo campo de entrada, el ejercicio 43 requiere dos campos:
- **Campo a):** Para la respuesta que usa "dann"
- **Campo b):** Para la respuesta que usa "sonst" o "andernfalls"

Ambos campos deben completarse correctamente para que el item se marque como correcto.

### 2. Reemplazo Automático de Punto y Coma

El sistema reemplaza automáticamente los punto y coma (`;`) por comas (`,`) en las respuestas durante el parsing:
- Input: `Man muss den Gurt anlegen; dann darf man losfahren.`
- Almacenado: `Man muss den Gurt anlegen, dann darf man losfahren.`

Esto asegura consistencia en las respuestas correctas.

### 3. Feedback Siempre Visible

Cuando el usuario hace clic en "Prüfen", el sistema **siempre muestra ambas respuestas correctas** en el feedback, incluso si:
- Los campos están vacíos
- Solo una respuesta es incorrecta
- Ambas respuestas son incorrectas

Formato del feedback:
- Si ambas correctas: `Richtig!`
- Si alguna incorrecta: `Antworten: a) [respuesta a] | b) [respuesta b]`

### 4. Normalización de Respuestas

Todas las comparaciones usan texto normalizado para mayor flexibilidad:
- Elimina diferencias de mayúsculas/minúsculas
- Normaliza espacios múltiples
- Unifica puntuación (`;` y `,` → `,`)

Esto permite que respuestas como "Die Antwort, richtig" y "die antwort,richtig" sean consideradas iguales.

### 5. Eliminación de Tokens Semánticos

Todos los textos se muestran sin tokens semánticos `{ang-kond:...}`:
- El original se muestra limpio
- Las respuestas correctas se almacenan sin tokens
- Esto permite que el usuario vea el texto tal como debe escribirlo

---

## Validaciones y Restricciones

1. **Ejercicio específico:** Solo se procesa el ejercicio 43 cuando `state.currentExercise === "43"`

2. **Ambas respuestas requeridas:** Para que un item se marque como correcto, ambas respuestas (a) y b)) deben ser correctas

3. **Normalización:** Todas las comparaciones usan texto normalizado para mayor flexibilidad

4. **Escape HTML:** Todo el contenido se escapa para prevenir XSS

5. **Feedback siempre visible:** El feedback siempre muestra las respuestas correctas al hacer clic en "Prüfen"

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

| Característica | Ejercicio 43 (Umformung doble) | Otros ejercicios (Umformung) |
|----------------|-------------------------------|------------------------------|
| **Campos de entrada** | 2 por item (a) y b)) | 1 por item |
| **Tipo de respuesta** | Doble transformación | Transformación simple |
| **Feedback** | Siempre muestra ambas respuestas | Muestra respuesta única |
| **Estructura de datos** | `answers: { a: "...", b: "..." }` | `answer: "..."` |
| **Parsing** | Extrae líneas `→ a)` y `→ b)` | Extrae línea `→ Respuesta` |

---

## Extensibilidad

Para adaptar este formato a otros ejercicios similares:

1. **Nuevo ejercicio con formato doble:**
   - Agregar número en array `allowedExercises` en `updateExerciseSelect()`
   - Agregar número en array de validación en `extractExercises()`
   - Agregar label en `exerciseLabels`
   - Modificar `extractExercises()` para detectar formato `→ a)` y `→ b)`
   - Agregar condición `if (currentExercise === "XX")` en `renderExercise()`, `checkExercise()`, y `resetExercise()`

2. **Modificar formato de feedback:**
   - Editar la lógica en `checkExercise()` donde se construye el mensaje de feedback

3. **Nuevas validaciones:**
   - Agregar lógica en `checkExercise()` según necesidades específicas

---

## Ejemplo de Uso del Sistema

**Datos de entrada (content.md):**
```markdown
## 43. Formen Sie um! Benutzen Sie a) „dann" und b) „sonst" bzw. „andernfalls"!

1. Man darf nur mit angelegtem Gurt losfahren.
   → a) Man muss den Gurt anlegen; {ang-kond:dann} darf man losfahren.
   → b) Man muss den Gurt anlegen; {ang-kond:sonst} darf man nicht losfahren.
```

**Estructura extraída:**
```javascript
{
  "43": {
    number: "43",
    title: "Formen Sie um! Benutzen Sie a) „dann" und b) „sonst" bzw. „andernfalls"!",
    items: [
      {
        number: 1,
        original: "Man darf nur mit angelegtem Gurt losfahren.",
        answers: {
          a: "Man muss den Gurt anlegen, dann darf man losfahren.",
          b: "Man muss den Gurt anlegen, sonst darf man nicht losfahren."
        },
        type: "multiple-text"
      }
    ]
  }
}
```

**Flujo:**
1. Usuario selecciona "43. Formen Sie um!..." del selector
2. Usuario hace clic en "Starten"
3. Sistema muestra:
   - Item 1: "Man darf nur mit angelegtem Gurt losfahren." + campo a) + campo b)
4. Usuario escribe respuestas en ambos campos
5. Usuario hace clic en "Prüfen"
6. Sistema compara y muestra feedback:
   - Si ambas correctas: "Richtig!" (verde)
   - Si alguna incorrecta: "Antworten: a) Man muss den Gurt anlegen, dann darf man losfahren. | b) Man muss den Gurt anlegen, sonst darf man nicht losfahren." (rojo)
7. Usuario puede hacer clic en "Zurücksetzen" para limpiar y volver a intentar

