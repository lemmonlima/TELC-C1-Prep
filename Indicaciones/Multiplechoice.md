# Temporal-Angaben Übung 26 – Documentación Técnica

**Ubicación:** `TELC/WEB/grammatik/angaben/uebungen/4-3-temporal/`

## Descripción General

El ejercicio 26 de "Temporal-Angaben" es un sistema interactivo de selección múltiple que permite a los usuarios practicar la inserción de adverbios temporales en alemán. A diferencia de los ejercicios 22, 23 y 25 (que usan entrada de texto libre), el ejercicio 26 utiliza dropdowns (menús desplegables) con opciones múltiples, similar al sistema "Rektion überprüfen (Test)". El ejercicio está integrado en el mismo sistema que los otros ejercicios de Temporal-Angaben, compartiendo el selector de ejercicios y los botones de control.

---

## Estructura de Archivos

```
4-3-temporal/
├── index.html      # Estructura HTML del sistema de ejercicios
├── exercise.js     # Lógica completa del sistema (incluye ejercicio 26)
└── content.md      # Archivo Markdown con todos los ejercicios
```

**Nota:** El ejercicio 26 está integrado en `exercise.js` junto con los ejercicios 22, 23 y 25. No tiene archivos separados.

---

## Formato de Datos de Entrada

### Formato Markdown

El archivo `content.md` contiene el ejercicio 26 con el siguiente formato:

```markdown
## 26. Setzen Sie passende Adverbien ein!

1. Heute telefoniert man, {ang-temporal:früher} schrieb man Briefe.
2. Du musst diese Arbeit zuerst zu Ende bringen. {ang-temporal:Dann} kannst du dich ausruhen.
3. Am Wochenende herrscht wieder starker Ausflugsverkehr auf dieser Straße; {ang-temporal:bis dahin} müssen die Reparaturarbeiten abgeschlossen sein.
4. Das letzte Mal sind wir uns in Köln am Bahnhof begegnet. {ang-temporal:Seitdem} habe ich nichts mehr von ihm gehört.
5. Die Prüfung beginnt um 10 Uhr. Kommen Sie bitte schon um 9 Uhr 30, denn Sie bekommen {ang-temporal:vorher} eine kurze Einführung in den Ablauf der Prüfung.
6. Wenn Sie die Gasheizung reinigen wollen, müssen Sie {ang-temporal:zuerst} den Gashahn zudrehen; {ang-temporal:dann} dürfen Sie das Gerät öffnen.
9. Mit meinem Telefonanschluss kann man nicht {ang-temporal:zugleich/gleichzeitig} telefonieren und ein Fax senden. Man muss eines nach dem anderen machen.
```

### Tokens Semánticos

El sistema reconoce el siguiente token semántico:

| Token | Tipo | Descripción |
|-------|------|-------------|
| `{ang-temporal:...}` | Temporal-Adverb | Marca el adverbio temporal que debe ser insertado (se reemplaza con dropdown) |

### Respuestas Múltiples

El sistema soporta respuestas múltiples válidas separadas por `/`:
- Formato: `{ang-temporal:zugleich/gleichzeitig}`
- Ambas opciones (`zugleich` y `gleichzeitig`) se consideran correctas
- Se almacenan en el atributo `data-answer` separadas por coma: `"zugleich,gleichzeitig"`

### Reglas de Parsing

1. **Encabezado de ejercicio:** Línea que empieza con `## 26.`
   - Formato: `## 26. Setzen Sie passende Adverbien ein!`

2. **Items de ejercicio:** Líneas que empiezan con número seguido de punto
   - Formato: `1. Frase con {ang-temporal:adverbio}...`
   - Cada línea es un item independiente (no hay respuestas en líneas separadas)

3. **Extracción de pool:** Durante el parsing, todos los adverbios temporales se extraen y se almacenan en un pool global
   - Se procesan todas las variantes (incluyendo opciones separadas por `/`)
   - El pool se usa para generar opciones múltiples en los dropdowns

---

## Arquitectura del Sistema

### Estado Global (`state`)

```javascript
const state = {
  exercises: {},           // Objeto con todos los ejercicios extraídos
  currentExercise: null,   // Número del ejercicio actual seleccionado ("26")
  currentExerciseNumber: null,  // Número como entero
  currentItems: [],        // Array de elementos DOM de los items actuales
  adverbPool: []          // Pool de adverbios temporales para ejercicio 26
};
```

### Estructura de Item (Ejercicio 26)

Cada item del ejercicio 26 tiene la siguiente estructura:

```javascript
{
  number: 1,              // Número del item
  sentence: "Heute telefoniert man, {ang-temporal:früher} schrieb man Briefe.",
  type: "dropdown"        // Tipo especial para ejercicio 26
}
```

**Nota:** A diferencia de los ejercicios 22, 23, 25 (que tienen `original` y `answer`), el ejercicio 26 solo tiene `sentence` porque la respuesta está embebida en el texto con el token semántico.

---

## Funciones Principales

### 1. Extracción de Ejercicios (`extractExercises(text)`)

**Proceso para ejercicio 26:**

1. Detecta el encabezado `## 26.`
2. Para cada línea que empieza con número seguido de punto:
   - Extrae el número del item
   - Guarda la oración completa con tokens semánticos
   - Extrae todos los adverbios temporales usando regex: `/\{ang-temporal:([^}]+)\}/g`
   - Procesa opciones múltiples separadas por `/`
   - Agrega todos los adverbios al `adverbSet` (pool global)
3. Al finalizar, convierte el `adverbSet` en array y lo almacena en `state.adverbPool`

**Código relevante:**
```javascript
if (currentExercise === "26") {
  const itemMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
  if (itemMatch) {
    const sentence = itemMatch[2];
    
    // Extract all temporal adverbs for the pool
    const adverbRegex = /\{ang-temporal:([^}]+)\}/g;
    let adverbMatch;
    while ((adverbMatch = adverbRegex.exec(sentence)) !== null) {
      const adverbText = adverbMatch[1].trim();
      const adverbs = adverbText.split('/').map(a => a.trim());
      adverbs.forEach(adv => {
        if (adv) adverbSet.add(adv);
      });
    }
    
    currentItem = {
      number: parseInt(itemNum, 10),
      sentence: sentence,
      type: "dropdown"
    };
  }
}
```

### 2. Construcción de Oraciones con Dropdowns (`buildSentence26(sentence)`)

**Propósito:** Reemplaza cada token `{ang-temporal:...}` con un dropdown HTML.

**Proceso:**

1. Busca todos los tokens con regex: `/\{ang-temporal:([^}]+)\}/g`
2. Para cada token encontrado:
   - Extrae el adverbio (puede tener múltiples opciones separadas por `/`)
   - Separa las opciones múltiples: `adverb.split('/').map(a => a.trim())`
   - Toma la primera opción como `primaryAnswer` para generar opciones
   - Une todas las opciones con coma para `data-answer`: `correctAnswers.join(',')`
   - Genera opciones múltiples usando `buildOptions()` con el pool de adverbios
   - Crea HTML del `<select>` con:
     - Opción vacía por defecto: `<option value="" selected disabled hidden>—</option>`
     - Opciones generadas (máximo 4)
     - Atributo `data-answer` con todas las respuestas correctas separadas por coma
3. Escapa HTML del texto entre tokens
4. Retorna el HTML completo con dropdowns insertados

**Ejemplo de salida:**
```html
Heute telefoniert man, 
<span class="test-blank">
  <select class="test-select" data-answer="früher">
    <option value="" selected disabled hidden>—</option>
    <option value="früher">früher</option>
    <option value="dann">dann</option>
    <option value="vorher">vorher</option>
    <option value="später">später</option>
  </select>
</span>
 schrieb man Briefe.
```

### 3. Generación de Opciones Múltiples (`buildOptions(correct, pool, fallback)`)

**Parámetros:**
- `correct` - Respuesta correcta (normalizada)
- `pool` - Pool de adverbios temporales del ejercicio
- `fallback` - Pool alternativo (en este caso, el mismo pool)

**Proceso:**

1. Crea un Set con la respuesta correcta normalizada
2. Mezcla el pool y agrega valores hasta tener 4 opciones (máximo)
3. Si no hay suficientes, usa el fallback
4. Mezcla las opciones finales para orden aleatorio
5. Retorna array de opciones (máximo 4) con la respuesta correcta incluida

**Características:**
- Siempre incluye la respuesta correcta
- Máximo 4 opciones por dropdown
- Orden aleatorio para evitar patrones predecibles
- Normalización: todas las opciones se comparan en lowercase

### 4. Renderizado del Ejercicio (`renderExercise()`)

**Proceso para ejercicio 26:**

1. Verifica que `state.currentExercise === "26"`
2. Para cada item:
   - Crea un `div` con clase `test-item` (diferente de `exercise-item` usado en otros ejercicios)
   - Llama a `buildSentence26(item.sentence)` para generar HTML con dropdowns
   - Construye estructura HTML:
     ```html
     <div class="test-item">
       <div class="test-sentence">
         1. [HTML con dropdowns]
       </div>
       <div class="test-feedback"></div>
     </div>
     ```
3. Agrega todos los items al DOM
4. Muestra el contenido del ejercicio

**Diferencia con otros ejercicios:**
- Ejercicios 22, 23, 25: Usan `exercise-item` y campos de texto (`<input>`)
- Ejercicio 26: Usa `test-item` y dropdowns (`<select>`)

### 5. Verificación (`checkExercise()`)

**Proceso para ejercicio 26:**

1. Para cada item (`.test-item`):
   - Obtiene todos los dropdowns (`.test-select`)
   - Obtiene el elemento de feedback (`.test-feedback`)
   - Para cada dropdown:
     - Normaliza la respuesta del usuario: `normalizeOption(select.value)`
     - Extrae respuestas correctas del `data-answer` (separadas por coma)
     - Normaliza todas las respuestas correctas
     - Verifica si la respuesta del usuario está en la lista de respuestas correctas
     - Si está vacío: marca `allComplete = false`
     - Si es correcta: agrega clase `is-correct`, remueve `is-wrong`
     - Si es incorrecta: agrega clase `is-wrong`, remueve `is-correct`, guarda respuesta correcta
   - Si todas están completas y correctas:
     - Agrega clase `is-correct` al item
     - Muestra feedback: "Richtig!"
   - Si hay errores o incompletas:
     - Agrega clase `is-wrong` al item
     - Muestra feedback con respuestas correctas: "Antworten: respuesta1 oder respuesta2"

**Manejo de respuestas múltiples:**
```javascript
const correctAnswersList = select.dataset.answer.split(',').map(a => normalizeOption(a.trim()));
const isCorrect = correctAnswersList.includes(userAnswer);
```

### 6. Reset (`resetExercise()`)

**Proceso para ejercicio 26:**

1. Para cada item:
   - Obtiene todos los dropdowns (`.test-select`)
   - Obtiene el elemento de feedback
   - Para cada dropdown:
     - Resetea el valor: `select.value = ""`
     - Remueve clases de estado: `select.classList.remove("is-correct", "is-wrong")`
   - Remueve clases del item: `itemDiv.classList.remove("is-correct", "is-wrong")`
   - Limpia el feedback: `feedback.innerHTML = ""`

---

## Funciones Auxiliares

### `normalizeOption(value)`
Normaliza opciones para comparación: trim + lowercase.
```javascript
function normalizeOption(value) {
  return value.trim().toLowerCase();
}
```

### `shuffle(list)`
Mezcla un array usando algoritmo Fisher-Yates.
```javascript
function shuffle(list) {
  const array = list.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
```

### `escapeHtml(value)`
Escapa caracteres HTML especiales (`&`, `<`, `>`, `"`).

---

## Clases CSS Utilizadas

### Estructura
- `.test-item` - Contenedor de cada pregunta (ejercicio 26)
- `.test-sentence` - Contenedor de la oración con dropdowns
- `.test-feedback` - Área de feedback para cada pregunta
- `.test-blank` - Contenedor de cada dropdown
- `.test-select` - Elemento `<select>` con atributo `data-answer`

### Estados
- `.is-correct` - Aplicada cuando la respuesta es correcta
- `.is-wrong` - Aplicada cuando la respuesta es incorrecta o está incompleta

### Feedback
- `.feedback-correct` - Mensaje de respuesta correcta
- `.feedback-wrong` - Mensaje de respuesta incorrecta con respuestas correctas

**Nota:** El ejercicio 26 comparte estilos con el sistema "Rektion überprüfen (Test)" debido a su formato similar con dropdowns.

---

## Flujo de Usuario

1. **Carga inicial:**
   - Sistema carga `content.md`
   - Extrae todos los ejercicios (22, 23, 25, 26)
   - Para el ejercicio 26, extrae todos los adverbios temporales y construye el pool
   - Habilita el selector de ejercicios

2. **Selección:**
   - Usuario selecciona "26. Setzen Sie passende Adverbien ein!" del dropdown
   - Hace clic en "Starten"

3. **Renderizado:**
   - Sistema renderiza todas las frases del ejercicio 26
   - Cada `{ang-temporal:...}` se reemplaza con un dropdown
   - Cada dropdown tiene 4 opciones (máximo) generadas del pool de adverbios
   - La respuesta correcta siempre está incluida en las opciones

4. **Completado:**
   - Usuario selecciona adverbios de los dropdowns
   - Puede cambiar respuestas antes de verificar

5. **Verificación:**
   - Usuario hace clic en "Prüfen"
   - Sistema compara respuestas normalizadas
   - Muestra feedback visual (verde/rojo) en cada dropdown
   - Muestra mensaje de éxito o respuestas correctas

6. **Reset:**
   - Usuario puede hacer clic en "Zurücksetzen" para limpiar y empezar de nuevo

---

## Características Especiales

### 1. Pool de Adverbios

El sistema construye un pool global de todos los adverbios temporales del ejercicio 26:
- Se extraen durante el parsing
- Se procesan opciones múltiples (separadas por `/`)
- Se almacenan en `state.adverbPool`
- Se usan para generar opciones múltiples en los dropdowns

### 2. Respuestas Múltiples

El sistema soporta múltiples respuestas correctas:
- Formato en Markdown: `{ang-temporal:zugleich/gleichzeitig}`
- Se almacenan en `data-answer` como: `"zugleich,gleichzeitig"`
- Cualquiera de las opciones se acepta como correcta durante la verificación

### 3. Generación Inteligente de Opciones

- Máximo 4 opciones por dropdown
- Siempre incluye la respuesta correcta
- Las otras opciones se seleccionan aleatoriamente del pool
- Orden aleatorio para evitar patrones

### 4. Integración con Otros Ejercicios

El ejercicio 26 está completamente integrado en el mismo sistema que los ejercicios 22, 23, 25:
- Comparte el mismo selector de ejercicios
- Comparte los mismos botones de control ("Prüfen", "Zurücksetzen")
- Usa la misma estructura HTML base
- Solo difiere en el formato de interacción (dropdowns vs. texto)

---

## Validaciones y Restricciones

1. **Normalización de respuestas:** Todas las comparaciones se hacen con valores normalizados (trim + lowercase) para evitar errores por mayúsculas/minúsculas o espacios.

2. **Escape HTML:** Todo el contenido se escapa para prevenir XSS.

3. **Pool mínimo:** Si el pool de adverbios es muy pequeño, las opciones pueden repetirse, pero siempre habrá al menos la respuesta correcta.

4. **Respuestas múltiples:** El sistema acepta cualquiera de las opciones válidas separadas por `/` como correcta.

---

## Dependencias

- **Ninguna librería externa:** El sistema es vanilla JavaScript
- **Fetch API:** Para cargar el archivo Markdown
- **CSS:** Requiere estilos definidos en `styles.css` para las clases mencionadas (compartidos con el sistema de Test de Rektion)

---

## Notas de Implementación

1. **Cache deshabilitado:** El archivo se carga con `{ cache: "no-store" }` para asegurar datos actualizados.

2. **Normalización:** Todas las comparaciones usan valores normalizados para mayor robustez.

3. **Shuffle:** Las opciones se mezclan para variar el orden en cada renderizado.

4. **Clases CSS compartidas:** El ejercicio 26 usa las mismas clases CSS que el sistema "Rektion überprüfen (Test)" debido a su formato similar con dropdowns.

5. **Detección de tipo:** El sistema detecta automáticamente el tipo de ejercicio (`"26"` vs. otros) para aplicar el formato correcto (dropdowns vs. texto).

---

## Extensibilidad

Para modificar el ejercicio 26:

1. **Agregar más adverbios:** Simplemente agregar más items al `content.md` con el formato correcto.

2. **Cambiar número de opciones:** Modificar la condición en `buildOptions()` de `options.size < 4` al número deseado.

3. **Modificar pool:** El pool se construye automáticamente, pero se puede personalizar en `extractExercises()` si es necesario.

4. **Agregar más ejercicios con dropdowns:** Seguir el mismo patrón del ejercicio 26, agregando detección en `renderExercise()` y `checkExercise()`.

