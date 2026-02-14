# Präpositional-Ergänzungen Übungen – Documentación Técnica

**Ubicación:** `TELC/WEB/grammatik/ergaenzungen-verbalisierung/uebungen/3-1-praepositional-ergaenzungen/`

## Descripción General

El módulo "Präpositional-Ergänzungen Übungen 3-7" es un sistema interactivo de ejercicios que permite a los usuarios practicar la complementación de Präpositional-Ergänzungen (complementos preposicionales) en alemán. El sistema carga ejercicios desde un archivo Markdown, analiza automáticamente cada palabra dentro de los complementos preposicionales, identifica su tipo gramatical, y genera dropdowns específicos para cada tipo de elemento (preposiciones, artículos, kein, posesivos, adjetivos). Los sustantivos (Nomen) se muestran directamente como texto sin dropdowns.

---

## Estructura de Archivos

```
3-1-praepositional-ergaenzungen/
├── index.html      # Estructura HTML del sistema de ejercicios
├── exercise.js     # Lógica completa del sistema
└── content.md      # Archivo Markdown con todos los ejercicios
```

---

## Formato de Datos de Entrada

### Formato Markdown

El archivo `content.md` contiene los ejercicios organizados por número, usando el siguiente formato:

```markdown
## Übung 3. Ergänzen Sie!

Lückentext: Präpositionen und Kasus-/Endungen ergänzen.

1. Sie freute sich {prep-erg:über die Blumen}, die er ihr geschenkt hatte.
2. Der Hase flieht {prep-erg:vor dem Hund}.
3. Ein Bus ist {prep-erg:mit einem Zug} zusammengestoßen.
6. Viele haben {prep-erg:gegen die erneute Gebührenerhöhung} protestiert.
```

### Tokens Semánticos

El sistema reconoce el siguiente token semántico:

| Token | Tipo | Descripción |
|-------|------|-------------|
| `{prep-erg:...}` | Präpositional-Ergänzung | Marca el contenido completo de un complemento preposicional que debe ser analizado palabra por palabra |

### Reglas de Parsing

1. **Encabezados de ejercicio:** Líneas que empiezan con `## Übung` seguidas de número y título
   - Formato: `## Übung 3. Ergänzen Sie!`
   - Solo se procesan ejercicios: 3, 4, 5, 6, 7

2. **Items de ejercicio:** Líneas que empiezan con número seguido de punto
   - Formato: `1. Contenido...` o `10. Contenido...`

3. **Contenido de Präpositional-Ergänzung:** Todo el contenido dentro de `{prep-erg:...}` se analiza palabra por palabra

---

## Arquitectura del Sistema

### Estado Global (`state`)

```javascript
const state = {
  exercises: {},           // Objeto con todos los ejercicios extraídos
  currentExercise: null,   // Número del ejercicio actual seleccionado
  currentItems: [],        // Array de elementos DOM de los items actuales
  pools: {
    prepositions: [],      // Pool de preposiciones extraídas
    definiteArticles: ["der", "die", "das", "den", "dem", "des"],
    indefiniteArticles: ["ein", "eine", "einen", "einem", "eines", "einer"],
    kein: ["kein", "keine", "keinen", "keinem", "keines", "keiner"],
    possessive: {
      mein: ["mein", "meine", "meinen", "meinem", "meines", "meiner"],
      dein: ["dein", "deine", "deinen", "deinem", "deines", "deiner"],
      sein: ["sein", "seine", "seinen", "seinem", "seines", "seiner"],
      ihr: ["ihr", "ihre", "ihren", "ihrem", "ihres", "ihrer"],
      unser: ["unser", "unsere", "unseren", "unserem", "unseres", "unserer"],
      euer: ["euer", "eure", "euren", "eurem", "eures", "eurer"]
    },
    adjectives: {}         // Se llena dinámicamente con raíces de adjetivos
  }
};
```

### Estructura de Ejercicio

Cada ejercicio tiene la siguiente estructura:

```javascript
{
  number: "3",           // Número del ejercicio como string
  title: "Übung 3. Ergänzen Sie!",  // Título completo del ejercicio
  items: [                // Array de items del ejercicio
    {
      number: 1,          // Número del item
      original: "Sie freute sich {prep-erg:über die Blumen}, die er ihr geschenkt hatte.",
      type: "dropdown"    // Tipo de ejercicio (siempre "dropdown" para estos ejercicios)
    }
  ]
}
```

### Elementos del DOM

**Controles de configuración:**
- `exercise-select` - Selector dropdown para elegir ejercicio (3-7)
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
1. Hace fetch del archivo `content.md`
2. Parsea el texto con `extractExercises(text)`
3. Almacena los ejercicios en `state.exercises`
4. Inicializa el pool de preposiciones desde `commonPrepositions`
5. Llama a `updateExerciseSelect()` para poblar el selector
6. Maneja errores mostrando mensaje en consola si falla

**Ruta relativa:** `content.md` (mismo directorio)

### 2. Extracción de Ejercicios (`extractExercises(text)`)

**Parámetros:**
- `text` - Contenido completo del archivo Markdown

**Proceso:**
1. Divide el texto en líneas
2. Itera línea por línea manteniendo estado de ejercicio e item actual
3. Detecta encabezados de ejercicio con regex: `/^##\s+Übung\s+(\d+)\./`
4. Solo procesa ejercicios válidos: ["3", "4", "5", "6", "7"]
5. Detecta items con regex: `/^(\d+)\.\s+(.+)$/`
6. Para cada item:
   - Extrae el contenido completo de la oración
   - Busca todos los tokens `{prep-erg:...}` en el contenido
   - Llama a `analyzePrepErgContent()` para cada token encontrado (esto construye los pools dinámicamente)
7. Almacena cada item con su número y contenido original

**Retorna:** Objeto con estructura:
```javascript
{
  "3": { number: "3", title: "...", items: [...] },
  "4": { number: "4", title: "...", items: [...] },
  // ...
}
```

### 3. Análisis de Contenido de Präpositional-Ergänzung (`analyzePrepErgContent(content)`)

**Parámetros:**
- `content` - Contenido dentro de `{prep-erg:...}` (ej: "über die Blumen")

**Proceso:**
1. Divide el contenido en palabras individuales usando `split(/\s+/)`
2. Para cada palabra:
   - Llama a `identifyElementType(word)` para identificar el tipo
   - Si se identifica un tipo (preposición, artículo, kein, posesivo, adjetivo):
     - Agrega el elemento a la lista con su tipo y valor
     - Si es un adjetivo, genera todas sus declinaciones y las agrega al pool
   - Si NO se identifica (es un Nomen u otra palabra):
     - Agrega el elemento como `{ type: "text", value: word }` para mostrarlo directamente
3. Retorna array de elementos con sus tipos

**Retorna:** Array de elementos:
```javascript
[
  { type: "preposition", value: "über" },
  { type: "definiteArticle", value: "die" },
  { type: "text", value: "Blumen" }  // Nomen - se muestra como texto
]
```

### 4. Identificación de Tipo de Elemento (`identifyElementType(word)`)

**Parámetros:**
- `word` - Palabra individual a identificar

**Proceso de Identificación (en orden de prioridad):**

1. **Detección de Nomen (sustantivos):**
   - Si la palabra empieza con mayúscula (y no es la primera palabra de la oración)
   - Y no es una palabra conocida (preposición, artículo)
   - → Retorna `null` (se mostrará como texto, sin dropdown)

2. **Preposiciones:**
   - Normaliza la palabra a minúsculas
   - Verifica si está en `commonPrepositions`
   - → Retorna `{ type: "preposition", value: word }`

3. **Artículos definidos:**
   - Verifica si está en `state.pools.definiteArticles`
   - → Retorna `{ type: "definiteArticle", value: word }`

4. **Artículos indefinidos:**
   - Verifica si está en `state.pools.indefiniteArticles`
   - → Retorna `{ type: "indefiniteArticle", value: word }`

5. **kein:**
   - Verifica si está en `state.pools.kein`
   - → Retorna `{ type: "kein", value: word }`

6. **Posesivos:**
   - Itera sobre `state.pools.possessive`
   - Verifica si la palabra está en alguna de las formas del posesivo
   - → Retorna `{ type: "possessive", base: base, value: word }` (ej: base: "mein")

7. **Adjetivos:**
   - Verifica que termine en `-e`, `-er`, `-es`, `-en`, `-em`
   - Verifica que NO sea un artículo ya identificado
   - Verifica que NO empiece con mayúscula (sería un Nomen)
   - Extrae la raíz del adjetivo removiendo la terminación
   - Si la raíz tiene al menos 3 caracteres → Retorna `{ type: "adjective", root: root, value: word }`

8. **Si no se identifica:**
   - → Retorna `null` (se mostrará como texto)

**Retorna:** Objeto con tipo y valor, o `null` si es un Nomen/otra palabra

### 5. Generación de Declinaciones de Adjetivos (`generateAdjectiveDeclensions(root)`)

**Parámetros:**
- `root` - Raíz del adjetivo (ej: "erneut" de "erneute")

**Proceso:**
1. Itera sobre los tres tipos de declinación: `strong`, `weak`, `mixed`
2. Para cada tipo, itera sobre géneros: `mask` (masculino), `fem` (femenino), `neut` (neutro), `plural`
3. Para cada género, itera sobre casos: `nom` (nominativo), `akk` (acusativo), `dat` (dativo), `gen` (genitivo)
4. Genera la forma: `root + ending` (ej: "erneut" + "er" = "erneuter")
5. Agrega todas las formas únicas a un array
6. Almacena el array en `state.pools.adjectives[root]`

**Retorna:** Array con todas las declinaciones posibles del adjetivo:
```javascript
["erneute", "erneuten", "erneuter", "erneutes", "erneutem", ...]
```

**Tipos de Declinación:**

- **Strong (fuerte):** Sin artículo definido
  - Mask: `-er`, `-en`, `-em`, `-en` (nom, akk, dat, gen)
  - Fem: `-e`, `-e`, `-er`, `-er` (nom, akk, dat, gen)
  - Neut: `-es`, `-es`, `-em`, `-en` (nom, akk, dat, gen)
  - Plural: `-e`, `-e`, `-en`, `-er` (nom, akk, dat, gen)

- **Weak (débil):** Con artículo definido
  - Todos los géneros y casos: `-e`, `-en`, `-en`, `-en`

- **Mixed (mixta):** Con artículo indefinido/posesivo
  - Mask: `-er`, `-en`, `-en`, `-en`
  - Fem: `-e`, `-e`, `-en`, `-en`
  - Neut: `-es`, `-es`, `-en`, `-en`
  - Plural: `-en`, `-en`, `-en`, `-en`

### 6. Construcción de Oraciones (`buildSentence(sentence)`)

**Parámetros:**
- `sentence` - Oración original con tokens `{prep-erg:...}`

**Proceso:**
1. Busca todos los tokens `{prep-erg:...}` en la oración usando regex: `/\{prep-erg:([^}]+)\}/g`
2. Almacena todas las coincidencias con sus índices
3. Reemplaza de atrás hacia adelante (para preservar índices):
   - Para cada token encontrado:
     - Extrae el contenido dentro de `{prep-erg:...}`
     - Llama a `analyzePrepErgContent()` para analizar cada palabra
     - Construye HTML de reemplazo:
       - **Para elementos con tipo identificado:** Genera dropdown con `renderSelect()`
       - **Para elementos tipo "text" (Nomen):** Muestra directamente con `escapeHtml()`
4. Reemplaza el token completo con el HTML generado
5. Cuenta el número de dropdowns generados

**Retorna:**
```javascript
{
  html: "<span>Sie freute sich </span><select>...</select><span> die</span><select>...</select><span> Blumen</span>...",
  blanks: 2  // Número de dropdowns generados
}
```

### 7. Generación de Opciones Múltiples (`buildOptions(correct, pool, fallback)`)

**Parámetros:**
- `correct` - Respuesta correcta
- `pool` - Pool de valores del mismo tipo (ej: todas las preposiciones)
- `fallback` - Pool alternativo si no hay suficientes opciones

**Proceso:**
1. Normaliza la respuesta correcta (trim + lowercase)
2. Crea un Set y agrega la respuesta correcta
3. Mezcla el pool y agrega valores hasta tener 4 opciones (máximo)
4. Si no hay suficientes, usa el fallback
5. Mezcla las opciones finales

**Retorna:** Array de máximo 4 opciones (siempre incluye la respuesta correcta)

### 8. Renderizado de Select (`renderSelect(correct, pool, fallback)`)

**Proceso:**
1. Genera opciones con `buildOptions()`
2. Crea HTML de `<select>` con:
   - Opción vacía por defecto: `<option value="" selected disabled hidden>—</option>`
   - Opciones generadas (máximo 4)
   - Atributo `data-answer` con la respuesta correcta
   - Atributo `data-correct="true"` en la opción correcta

**Retorna:** String HTML del select completo envuelto en `<span class="test-blank">`

### 9. Actualización del Selector (`updateExerciseSelect()`)

**Proceso:**
1. Limpia el selector y agrega opción por defecto "Bitte wählen..."
2. Itera sobre ejercicios permitidos: ["3", "4", "5", "6", "7"]
3. Solo agrega ejercicios que existen y tienen items
4. Crea elementos `<option>` con valor (número) y texto (título completo)
5. Habilita el selector (`disabled = false`)

### 10. Renderizado de Ejercicio (`renderExercise()`)

**Proceso:**
1. Verifica que haya un ejercicio seleccionado
2. Obtiene el ejercicio de `state.exercises[state.currentExercise]`
3. Actualiza el encabezado con el título del ejercicio
4. Limpia la lista de items
5. Itera sobre cada item del ejercicio:
   - Crea un `div` con clase `exercise-item`
   - Llama a `buildSentence()` para construir la oración con dropdowns
   - Genera HTML con:
     - Número del item
     - Oración con dropdowns y texto (Nomen)
     - Área de feedback
6. Almacena referencias a elementos DOM en `state.currentItems`
7. Muestra el contenido (`display: block`)

### 11. Inicio de Ejercicio (`startExercise()`)

**Proceso:**
1. Obtiene el valor seleccionado del selector
2. Valida que exista el ejercicio en `state.exercises`
3. Actualiza `state.currentExercise`
4. Llama a `renderExercise()` para mostrar los items

### 12. Verificación (`checkExercise()`)

**Proceso:**
1. Itera sobre todos los items en `state.currentItems`
2. Para cada item:
   - Obtiene todos los selects (`.test-select`)
   - Obtiene el elemento de feedback
   - Para cada select:
     - Extrae respuesta correcta de `data-answer`
     - Normaliza respuesta del usuario y correcta
     - Compara ambas respuestas normalizadas
     - Si coinciden: marca como correcto (clase `is-correct`)
     - Si no coinciden: marca como incorrecto (clase `is-wrong`)
   - Si todas las respuestas son correctas:
     - Marca el item como correcto
     - Muestra "Richtig!" en feedback
   - Si hay errores:
     - Marca el item como incorrecto
     - Muestra todas las respuestas correctas en formato: "Antworten: respuesta1, respuesta2, ..."

### 13. Reset (`resetExercise()`)

**Proceso:**
1. Itera sobre todos los items en `state.currentItems`
2. Para cada item:
   - Obtiene todos los selects
   - Limpia valores de selects (`value = ""`)
   - Remueve clases `is-correct` y `is-wrong` de selects
   - Remueve clases `is-correct` y `is-wrong` del item
   - Limpia el contenido de feedback

---

## Pools de Opciones por Tipo

### Preposiciones

**Pool principal:** `commonPrepositions` (constante)
```javascript
["an", "auf", "aus", "bei", "durch", "für", "gegen", "in", "mit", "nach",
 "über", "um", "unter", "von", "vor", "zu", "zwischen", "seit", "trotz",
 "während", "wegen", "ohne", "außer", "bis", "entlang", "gegenüber"]
```

**Pool dinámico:** `state.pools.prepositions` (se inicializa desde `commonPrepositions`)

**Fallback:** `commonPrepositions`

### Artículos Definidos

**Pool:** `state.pools.definiteArticles`
```javascript
["der", "die", "das", "den", "dem", "des"]
```

**Fallback:** El mismo pool

### Artículos Indefinidos

**Pool:** `state.pools.indefiniteArticles`
```javascript
["ein", "eine", "einen", "einem", "eines", "einer"]
```

**Fallback:** El mismo pool

### kein

**Pool:** `state.pools.kein`
```javascript
["kein", "keine", "keinen", "keinem", "keines", "keiner"]
```

**Fallback:** El mismo pool

### Posesivos

**Pool:** `state.pools.possessive[base]` (donde `base` es: mein, dein, sein, ihr, unser, euer)

**Ejemplo para "mein":**
```javascript
["mein", "meine", "meinen", "meinem", "meines", "meiner"]
```

**Fallback:** El mismo pool del posesivo

### Adjetivos

**Pool:** `state.pools.adjectives[root]` (se genera dinámicamente)

**Proceso de generación:**
1. Se identifica la raíz del adjetivo (ej: "erneut" de "erneute")
2. Se generan todas las declinaciones posibles usando `generateAdjectiveDeclensions()`
3. Se almacenan en `state.pools.adjectives["erneut"]`

**Ejemplo para "erneut":**
```javascript
["erneute", "erneuten", "erneuter", "erneutes", "erneutem", ...]
```

**Fallback:** Array vacío (no hay fallback para adjetivos)

---

## Funciones Auxiliares

### `escapeHtml(value)`
Escapa caracteres HTML especiales para prevenir XSS:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`

### `normalizeOption(value)`
Normaliza opciones para comparación:
- Trim (elimina espacios al inicio y final)
- Convierte a minúsculas

**Ejemplo:**
```
"  Die  " → "die"
```

### `shuffle(list)`
Mezcla un array usando algoritmo Fisher-Yates.

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
- `.exercise-original` - Oración con dropdowns y texto (Nomen)
- `.exercise-feedback` - Área de feedback para cada item

### Dropdowns
- `.test-blank` - Contenedor de cada campo de selección
- `.test-select` - Elemento `<select>` con atributo `data-answer`

### Estados
- `.is-correct` - Aplicada cuando todas las respuestas son correctas
  - Borde verde, fondo verde claro
- `.is-wrong` - Aplicada cuando hay errores
  - Borde rojo, fondo rojo claro

### Feedback
- `.feedback-correct` - Texto de feedback correcto (verde)
- `.feedback-wrong` - Texto de feedback incorrecto (rojo)

### Controles
- `.exercise-actions` - Contenedor de botones de acción
- `.btn`, `.btn-primary`, `.btn-ghost` - Estilos de botones del sistema
- `.flashcards-field` - Contenedor del selector de ejercicios
- `.section-head` - Encabezado de sección con título y descripción

---

## Flujo de Usuario

1. **Carga inicial:**
   - Sistema carga `content.md`
   - Extrae todos los ejercicios (3-7)
   - Analiza todos los tokens `{prep-erg:...}` para construir pools
   - Puebla el selector con ejercicios disponibles
   - Habilita el selector

2. **Selección de ejercicio:**
   - Usuario selecciona un ejercicio del dropdown (3-7)
   - El botón "Starten" se habilita automáticamente
   - Usuario hace clic en "Starten"

3. **Visualización de ejercicios:**
   - Sistema muestra el título del ejercicio
   - Renderiza todos los items del ejercicio en orden
   - Para cada item:
     - Muestra la oración con dropdowns para elementos identificados
     - Muestra Nomen directamente como texto (sin dropdowns)
     - Cada dropdown contiene máximo 4 opciones del mismo tipo

4. **Completar ejercicios:**
   - Usuario selecciona opciones en los dropdowns
   - Puede cambiar respuestas antes de verificar

5. **Verificación:**
   - Usuario hace clic en "Prüfen"
   - Sistema compara respuestas normalizadas
   - Muestra feedback visual:
     - Verde: Todas las respuestas correctas
     - Rojo: Hay errores, muestra todas las respuestas correctas

6. **Reset:**
   - Usuario puede hacer clic en "Zurücksetzen" en cualquier momento
   - Sistema limpia todas las respuestas y feedback
   - Permite intentar de nuevo

---

## Características Especiales

### 1. Identificación Automática de Tipos

El sistema identifica automáticamente el tipo de cada palabra dentro de `{prep-erg:...}`:

- **Preposiciones:** Compara con lista de preposiciones comunes
- **Artículos:** Compara con listas predefinidas
- **kein:** Compara con lista predefinida
- **Posesivos:** Identifica la base (mein, dein, etc.) y todas sus formas
- **Adjetivos:** Detecta terminaciones típicas y extrae la raíz
- **Nomen:** Detecta mayúscula inicial y los excluye de dropdowns

### 2. Generación Dinámica de Declinaciones de Adjetivos

Para cada adjetivo encontrado:
- Extrae la raíz (ej: "erneut" de "erneute")
- Genera todas las declinaciones posibles según:
  - Tipo de declinación (strong, weak, mixed)
  - Género (masculino, femenino, neutro, plural)
  - Caso (nominativo, acusativo, dativo, genitivo)
- Almacena todas las formas en el pool del adjetivo
- Solo muestra opciones de ese pool en el dropdown

### 3. Pools Separados por Tipo

Cada tipo de elemento tiene su propio pool:
- Preposiciones solo muestran preposiciones
- Artículos definidos solo muestran artículos definidos
- Cada posesivo solo muestra sus propias formas
- Cada adjetivo solo muestra sus propias declinaciones

### 4. Exclusión de Nomen

Los Nomen (sustantivos) se identifican por:
- Empezar con mayúscula
- No ser palabras conocidas (preposiciones, artículos)

Los Nomen se muestran directamente como texto, sin dropdowns ni paréntesis.

### 5. Máximo 4 Opciones por Dropdown

Cada dropdown contiene máximo 4 opciones:
- Siempre incluye la respuesta correcta
- Las otras 3 opciones se seleccionan aleatoriamente del pool del mismo tipo
- Si no hay suficientes opciones en el pool, se usa el fallback

### 6. Normalización de Respuestas

Todas las comparaciones usan valores normalizados:
- Trim (elimina espacios)
- Minúsculas
- Esto permite que respuestas como "Die" y "die" sean consideradas iguales

---

## Validaciones y Restricciones

1. **Ejercicios permitidos:** Solo se procesan ejercicios 3, 4, 5, 6, 7

2. **Selección requerida:** El usuario debe seleccionar un ejercicio antes de iniciar

3. **Normalización:** Todas las comparaciones usan texto normalizado para mayor flexibilidad

4. **Escape HTML:** Todo el contenido se escapa para prevenir XSS

5. **Manejo de errores:** Si falla la carga del archivo, se muestra mensaje de error en consola

6. **Nomen siempre como texto:** Los Nomen nunca tienen dropdowns, siempre se muestran directamente

---

## Dependencias

- **Ninguna librería externa:** El sistema es vanilla JavaScript
- **Fetch API:** Para cargar el archivo Markdown
- **CSS:** Requiere estilos definidos en `styles.css` para las clases mencionadas

---

## Notas de Implementación

1. **Cache deshabilitado:** El archivo se carga con fetch estándar (sin cache: "no-store" explícito, pero se puede agregar si es necesario)

2. **Normalización:** Todas las comparaciones usan valores normalizados para mayor robustez

3. **Shuffle:** Las opciones se mezclan para variar el orden en cada renderizado

4. **Pools dinámicos:** Los pools de adjetivos se construyen dinámicamente durante el análisis inicial

5. **Identificación de Nomen:** La identificación de Nomen se basa en mayúscula inicial, lo que es una heurística pero funciona para la mayoría de casos en alemán

6. **Generación de declinaciones:** El sistema genera todas las declinaciones posibles de un adjetivo, incluso si no todas se usan en el ejercicio específico

---

## Ejemplo de Funcionamiento

**Datos de entrada (content.md):**
```markdown
## Übung 3. Ergänzen Sie!

1. Sie freute sich {prep-erg:über die Blumen}, die er ihr geschenkt hatte.
6. Viele haben {prep-erg:gegen die erneute Gebührenerhöhung} protestiert.
```

**Proceso de análisis para item 1:**
1. Extrae contenido: "über die Blumen"
2. Analiza cada palabra:
   - "über" → Identificado como preposición
   - "die" → Identificado como artículo definido
   - "Blumen" → Empieza con mayúscula, no es palabra conocida → Nomen → `null`
3. Construye HTML:
   - `[dropdown-über]` (pool: preposiciones)
   - `[dropdown-die]` (pool: artículos definidos)
   - `Blumen` (texto directo, sin dropdown)

**Proceso de análisis para item 6:**
1. Extrae contenido: "gegen die erneute Gebührenerhöhung"
2. Analiza cada palabra:
   - "gegen" → Preposición
   - "die" → Artículo definido
   - "erneute" → Adjetivo (raíz: "erneut")
   - "Gebührenerhöhung" → Nomen → `null`
3. Genera declinaciones de "erneut": ["erneute", "erneuten", "erneuter", "erneutes", ...]
4. Construye HTML:
   - `[dropdown-gegen]` (pool: preposiciones)
   - `[dropdown-die]` (pool: artículos definidos)
   - `[dropdown-erneute]` (pool: declinaciones de "erneut")
   - `Gebührenerhöhung` (texto directo)

**Resultado visual:**
```
1. Sie freute sich [dropdown] [dropdown] Blumen, die er ihr geschenkt hatte.
6. Viele haben [dropdown] [dropdown] [dropdown] Gebührenerhöhung protestiert.
```

---

## Extensibilidad

Para agregar nuevos tipos de elementos o modificar el comportamiento:

1. **Nuevo tipo de elemento:**
   - Agregar lógica en `identifyElementType()` para detectar el nuevo tipo
   - Agregar pool correspondiente en `state.pools`
   - Agregar caso en `buildSentence()` para manejar el nuevo tipo

2. **Nuevas preposiciones:**
   - Agregar a `commonPrepositions`

3. **Nuevos posesivos:**
   - Agregar entrada en `state.pools.possessive` con todas sus formas

4. **Modificar declinaciones de adjetivos:**
   - Modificar `adjectiveDeclensions` para agregar/remover tipos o formas

5. **Cambiar número máximo de opciones:**
   - Modificar el límite en `buildOptions()` (actualmente 4)

---

## Diferencias con Otros Sistemas

| Característica | Präpositional-Ergänzungen | Test-Dropdown | Umformung |
|----------------|--------------------------|---------------|-----------|
| **Tipo de interacción** | Dropdowns múltiples por tipo | Dropdowns múltiples | Texto libre |
| **Identificación automática** | Sí (por tipo gramatical) | No (manual) | No |
| **Pools por tipo** | Sí (separados) | Sí (por tema) | No |
| **Nomen** | Se muestran como texto | Pueden tener dropdown | Texto libre |
| **Adjetivos** | Declinaciones generadas | No aplica | No aplica |
| **Máximo opciones** | 4 por dropdown | 4 por dropdown | N/A |
| **Selector de ejercicios** | Sí (3-7) | No | Sí (variable) |

---

## Consideraciones de Diseño

1. **Interfaz limpia:** Los Nomen se muestran directamente sin elementos visuales adicionales

2. **Dropdowns contextuales:** Cada dropdown solo muestra opciones del mismo tipo, facilitando la selección correcta

3. **Feedback detallado:** Muestra todas las respuestas correctas cuando hay errores

4. **Orden preservado:** Los ejercicios se muestran en el orden exacto del archivo Markdown

5. **Espaciado:** Los dropdowns y texto se espacian correctamente para mantener la legibilidad de la oración

