# Rektion überprüfen (Test) – Documentación Técnica

**Ubicación:** `TELC/WEB/grammatik/ergaenzungen-verbalisierung/rektion/test/`

## Descripción General

El módulo "Rektion überprüfen" es un sistema de test interactivo que permite a los usuarios practicar la rección (regencia) de verbos, nombres y adjetivos en alemán. El sistema carga preguntas desde archivos Markdown, las presenta con campos de selección múltiple, y permite verificar las respuestas al final.

---

## Estructura de Archivos

```
rektion/test/
├── index.html      # Estructura HTML del test
└── test.js         # Lógica completa del sistema
```

### Archivos de Datos (fuentes externas)

El sistema carga datos desde:
- `../../../verben/content.md` - Lista de verbos con rección
- `../../../nomen/content.md` - Lista de nombres con rección  
- `../../../adjektive/content.md` - Lista de adjetivos con rección

---

## Formato de Datos de Entrada

### Formato Markdown

Los archivos de contenido usan un formato específico con tokens semánticos:

```markdown
- {v:arbeiten} {p:an} {d:einem neuen Roman}
- {n:der Anteil} {p:an} {d:der Bevölkerung}
- {adj:gewöhnt} {p:an} {a:das hohe Arbeitstempo}
```

### Tokens Semánticos

El sistema reconoce los siguientes tokens:

| Token | Tipo | Descripción |
|-------|------|-------------|
| `{v:...}` | Verbo | Palabra objetivo para verbos |
| `{n:...}` | Nomen | Palabra objetivo para nombres |
| `{adj:...}` | Adjektiv | Palabra objetivo para adjetivos |
| `{p:...}` | Präposition | Preposición |
| `{a:...}` | Akkusativ | Complemento en acusativo |
| `{d:...}` | Dativ | Complemento en dativo |
| `{g:...}` | Genitiv | Complemento en genitivo |

### Reglas de Parsing

1. **Líneas válidas:** Solo se procesan líneas que empiezan con `- ` (guion seguido de espacio)
2. **Formato:** `- {token1:valor1} {token2:valor2} ...`
3. **Separador opcional:** Puede haber texto antes de los tokens separado por `:`
   - Ejemplo: `- Texto descriptivo: {v:verbo} {p:präposition}`

---

## Arquitectura del Sistema

### Estado Global (`state`)

```javascript
const state = {
  decks: {
    verben: [],      // Preguntas extraídas de verben/content.md
    nomen: [],       // Preguntas extraídas de nomen/content.md
    adjektive: []    // Preguntas extraídas de adjektive/content.md
  },
  pools: {
    prep: {          // Pool de preposiciones por tema
      verben: [],
      nomen: [],
      adjektive: []
    },
    target: {        // Pool de palabras objetivo por tema
      verben: [],
      nomen: [],
      adjektive: []
    },
    kasus: {         // Pool de complementos de caso por tema
      verben: [],
      nomen: [],
      adjektive: []
    }
  },
  currentTopic: "verben"
};
```

### Elementos del DOM

**Controles principales:**
- `test-topic` - Selector de tema (Verben/Nomen/Adjektive)
- `test-count` - Input numérico para cantidad de preguntas
- `test-start` - Botón para iniciar el test
- `test-check` - Botón para verificar respuestas
- `test-reset` - Botón para resetear
- `test-list` - Contenedor donde se renderizan las preguntas
- `test-available` - Label que muestra preguntas disponibles

**Opciones de ocultamiento:**
- `hide-prep` - Checkbox para ocultar preposiciones
- `hide-target` - Checkbox para ocultar palabra objetivo (verbo/nomen/adjektiv)
- `hide-case` - Checkbox para ocultar complementos de caso
- `hide-articles` - Checkbox para ocultar artículos
- `hide-pronouns` - Checkbox para ocultar pronombres

---

## Funciones Principales

### 1. Carga de Datos (`loadDecks()`)

**Propósito:** Carga los archivos Markdown y extrae las preguntas.

**Proceso:**
1. Carga asíncrona de los 3 archivos `.md` usando `fetch()`
2. Parsea cada archivo con `extractQuestions(text, targetTag)`
3. Almacena preguntas en `state.decks`
4. Extrae pools (preposiciones, palabras objetivo, casos) para generar opciones múltiples
5. Habilita controles y actualiza la UI

**Rutas relativas:**
- `../../../verben/content.md`
- `../../../nomen/content.md`
- `../../../adjektive/content.md`

### 2. Extracción de Preguntas (`extractQuestions(text, targetTag)`)

**Parámetros:**
- `text` - Contenido completo del archivo Markdown
- `targetTag` - Tag objetivo según tema: `"v"` (verben), `"n"` (nomen), `"adj"` (adjektive)

**Proceso:**
1. Divide el texto en líneas
2. Filtra líneas que empiezan con `- ` (regex: `/^\-\s+/`)
3. Extrae la parte izquierda (antes de `:`) si existe
4. Extrae la oración completa con tokens
5. Solo incluye líneas que contengan el token objetivo (`{v:...}`, `{n:...}`, o `{adj:...}`)
6. Extrae todos los tokens usando regex: `/\{(v|adj|n|p|a|d|g):([^}]+)\}/g`
7. Construye pools de valores únicos para:
   - Preposiciones (`p`)
   - Palabras objetivo (`v`/`n`/`adj`)
   - Complementos de caso (`a`/`d`/`g`)

**Retorna:**
```javascript
{
  questions: [{ sentence: "..." }],
  prepPool: ["an", "auf", "für", ...],
  targetPool: ["arbeiten", "denken", ...],
  casePool: ["den Termin", "der Bevölkerung", ...]
}
```

### 3. Construcción de Oraciones (`buildSentence(sentence, options, pools, targetTag)`)

**Parámetros:**
- `sentence` - Oración original con tokens
- `options` - Objeto con opciones de ocultamiento
- `pools` - Pools de valores para generar opciones múltiples
- `targetTag` - Tag objetivo (`"v"`, `"n"`, o `"adj"`)

**Proceso:**
1. Busca todos los tokens con regex: `/\{(v|adj|n|p|a|d|g):([^}]+)\}/g`
2. Para cada token:
   - **Preposiciones (`p`):** Si `hidePrepositions` → genera dropdown, sino → marca visual
   - **Palabra objetivo (`v`/`n`/`adj`):** Si `hideTarget` → genera dropdown, sino → marca visual
   - **Casos (`a`/`d`/`g`):** 
     - Si `hideCase` → genera dropdown completo
     - Si `hideArticles` o `hidePronouns` → procesa palabra por palabra para ocultar artículos/pronombres
     - Sino → marca visual
3. Escapa HTML del texto entre tokens
4. Cuenta número de blanks generados

**Retorna:**
```javascript
{
  html: "<span>...</span><select>...</select>...",
  blanks: 3  // Número de campos de selección generados
}
```

### 4. Generación de Opciones Múltiples (`buildOptions(correct, pool, fallback)`)

**Parámetros:**
- `correct` - Respuesta correcta
- `pool` - Pool de valores del mismo tipo (ej: todas las preposiciones)
- `fallback` - Pool alternativo si no hay suficientes opciones

**Proceso:**
1. Normaliza la respuesta correcta (trim + lowercase)
2. Agrega la respuesta correcta al Set
3. Mezcla el pool y agrega valores hasta tener 4 opciones
4. Si no hay suficientes, usa el fallback
5. Mezcla las opciones finales

**Retorna:** Array de 4 opciones (máximo) con la respuesta correcta incluida

### 5. Renderizado de Select (`renderSelect(correct, pool, fallback)`)

**Proceso:**
1. Genera opciones con `buildOptions()`
2. Crea HTML de `<select>` con:
   - Opción vacía por defecto: `<option value="" selected disabled hidden>—</option>`
   - Opciones generadas
   - Atributo `data-answer` con la respuesta correcta normalizada

**Retorna:** String HTML del select completo

### 6. Procesamiento de Tokens de Caso (`renderCaseToken(raw, options, blank, pools)`)

**Propósito:** Procesa complementos de caso palabra por palabra para ocultar artículos/pronombres individualmente.

**Proceso:**
1. Divide el texto en palabras
2. Para cada palabra:
   - Extrae base y sufijos (ej: "den" → base: "den", tail: "")
   - Si es pronombre y `hidePronouns` → genera dropdown con grupo de pronombres
   - Si es artículo y `hideArticles` → genera dropdown con grupo de artículos
   - Sino → escapa HTML y mantiene visible
3. Une palabras procesadas

### 7. Inicio del Test (`startTest()`)

**Proceso:**
1. Obtiene tema seleccionado y todas las preguntas del tema
2. Lee opciones de ocultamiento de los checkboxes
3. Valida que al menos una opción esté activada
4. Obtiene cantidad solicitada y la limita al máximo disponible
5. Mezcla todas las preguntas
6. Para cada pregunta:
   - Construye la oración con `buildSentence()`
   - Solo incluye si tiene al menos 1 blank generado
   - Agrega hasta alcanzar la cantidad solicitada
7. Renderiza las preguntas seleccionadas
8. Habilita botón de verificación

### 8. Verificación (`checkTest()`)

**Proceso:**
1. Obtiene todos los items del test (`.test-item`)
2. Para cada item:
   - Obtiene todos los selects (`.test-select`)
   - Obtiene el elemento de feedback (`.test-feedback`)
   - Extrae respuestas correctas de `data-answer`
   - Verifica si todas las respuestas están completas
   - Verifica si todas las respuestas son correctas (comparación normalizada)
   - Aplica clases CSS:
     - `is-correct` si todas correctas
     - `is-wrong` si hay errores o incompletas
   - Muestra feedback:
     - "Richtig" si correcto
     - "Antworten: ..." con respuestas correctas si incorrecto

### 9. Reset (`resetTest()`)

**Proceso:**
1. Limpia el contenido de `test-list`
2. Deshabilita botones de verificación y reset

---

## Grupos Predefinidos

### Grupos de Artículos (`articleGroups`)

El sistema reconoce grupos de artículos para generar opciones coherentes:

```javascript
[
  ["definite", ["der", "die", "das", "den", "dem", "des"]],
  ["ein", ["ein", "eine", "einen", "einem", "eines", "einer"]],
  ["kein", ["kein", "keine", "keinen", "keinem", "keines", "keiner"]],
  ["mein", ["mein", "meine", "meinen", "meinem", "meines", "meiner"]],
  // ... más grupos
]
```

### Grupos de Pronombres (`pronounGroups`)

```javascript
[
  ["ich", ["ich", "mich", "mir"]],
  ["du", ["du", "dich", "dir"]],
  ["er", ["er", "ihn", "ihm"]],
  // ... más grupos
]
```

**Uso:** Cuando se oculta un artículo o pronombre, el sistema genera opciones del mismo grupo (ej: si se oculta "der", las opciones incluyen "die", "das", "den", etc.)

---

## Funciones Auxiliares

### `clamp(value, min, max)`
Limita un valor entre mínimo y máximo.

### `shuffle(list)`
Mezcla un array usando algoritmo Fisher-Yates.

### `escapeHtml(value)`
Escapa caracteres HTML especiales (`&`, `<`, `>`, `"`).

### `normalizeOption(value)`
Normaliza opciones: trim + lowercase para comparación.

### `getLeftSide(line)`
Extrae la parte izquierda de una línea antes de `:` (respetando llaves anidadas).

### `getGroup(word, groups)`
Encuentra el grupo al que pertenece una palabra (artículo o pronombre).

### `renderMark(type, raw)`
Genera spans con clases CSS según el tipo de token:
- `mark-verb`, `mark-adj`, `mark-n` - Palabras objetivo
- `mark-prep` - Preposiciones
- `mark-a`, `mark-d`, `mark-g` - Complementos de caso

---

## Clases CSS Utilizadas

### Estructura
- `.test-item` - Contenedor de cada pregunta
- `.test-sentence` - Contenedor de la oración con blanks
- `.test-feedback` - Área de feedback para cada pregunta
- `.test-blank` - Contenedor de cada campo de selección
- `.test-select` - Elemento `<select>` con atributo `data-answer`

### Estados
- `.is-correct` - Aplicada cuando todas las respuestas son correctas
- `.is-wrong` - Aplicada cuando hay errores o respuestas incompletas

### Marcas Visuales
- `.mark`, `.mark-verb`, `.mark-adj`, `.mark-n` - Palabras objetivo visibles
- `.mark-prep` - Preposiciones visibles
- `.mark-a`, `.mark-d`, `.mark-g` - Complementos de caso visibles

---

## Flujo de Usuario

1. **Carga inicial:**
   - Sistema carga los 3 archivos Markdown
   - Extrae preguntas y construye pools
   - Habilita controles de configuración

2. **Configuración:**
   - Usuario selecciona tema (Verben/Nomen/Adjektive)
   - Usuario selecciona cantidad de preguntas
   - Usuario marca qué elementos ocultar (preposiciones, palabra objetivo, casos, artículos, pronombres)

3. **Inicio:**
   - Usuario hace clic en "Starten"
   - Sistema genera preguntas aleatorias con blanks según configuración
   - Se muestran las preguntas con campos de selección

4. **Respuesta:**
   - Usuario completa los campos de selección
   - Puede cambiar respuestas antes de verificar

5. **Verificación:**
   - Usuario hace clic en "Prüfen"
   - Sistema compara respuestas normalizadas
   - Muestra feedback visual (verde/rojo) y texto con respuestas correctas

6. **Reset:**
   - Usuario puede hacer clic en "Zurücksetzen" para limpiar y empezar de nuevo

---

## Validaciones y Restricciones

1. **Al menos una opción de ocultamiento:** El sistema requiere que al menos un checkbox esté marcado para generar blanks.

2. **Cantidad de preguntas:** Se limita automáticamente al número disponible en el tema seleccionado.

3. **Preguntas sin blanks:** Si una pregunta no genera blanks según la configuración, se omite automáticamente.

4. **Normalización de respuestas:** Todas las comparaciones se hacen con valores normalizados (trim + lowercase) para evitar errores por mayúsculas/minúsculas o espacios.

5. **Escape HTML:** Todo el contenido se escapa para prevenir XSS.

---

## Características Especiales

### 1. Generación Inteligente de Opciones

El sistema genera opciones múltiples usando:
- Pool del mismo tipo (ej: todas las preposiciones del tema)
- Pool alternativo si no hay suficientes opciones
- Siempre incluye la respuesta correcta
- Máximo 4 opciones por campo

### 2. Procesamiento de Artículos y Pronombres

Cuando se ocultan artículos o pronombres:
- Se procesan palabra por palabra dentro de complementos de caso
- Se reconocen grupos (ej: "der" pertenece al grupo de artículos definidos)
- Las opciones incluyen otras formas del mismo grupo

### 3. Marcas Visuales

Elementos no ocultos se muestran con spans con clases CSS específicas para resaltado visual según tipo.

### 4. Feedback Detallado

Cuando hay errores, el sistema muestra todas las respuestas correctas en el formato: "Antworten: respuesta1, respuesta2, ..."

---

## Dependencias

- **Ninguna librería externa:** El sistema es vanilla JavaScript
- **Fetch API:** Para cargar archivos Markdown
- **CSS:** Requiere estilos definidos en `styles.css` para las clases mencionadas

---

## Notas de Implementación

1. **Cache deshabilitado:** Los archivos se cargan con `{ cache: "no-store" }` para asegurar datos actualizados.

2. **Normalización:** Todas las comparaciones usan valores normalizados para mayor robustez.

3. **Shuffle:** Las preguntas y opciones se mezclan para variar el orden en cada ejecución.

4. **Validación de blanks:** Solo se incluyen preguntas que generan al menos un campo de selección según la configuración.

5. **Manejo de errores:** Si falla la carga de archivos, se muestra mensaje de error en lugar de crashear.

---

## Extensibilidad

Para agregar nuevos temas o tipos de tokens:

1. Agregar entrada en `topicLabels` y `targetTags`
2. Agregar deck en `state.decks` y pools en `state.pools`
3. Agregar opción en el `<select>` de temas en `index.html`
4. Agregar ruta de carga en `loadDecks()`
5. Si es necesario, agregar nuevo tipo de token y su procesamiento en `buildSentence()`

