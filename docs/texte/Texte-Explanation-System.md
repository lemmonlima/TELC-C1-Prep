# INSTRUCCIONES PARA CREAR EXPLICACIONES DE PALABRAS

Cuando te envíe palabras, debes hacer TRES cosas:

## 1. MARCAR LA PALABRA EN EL TEXTO
Agregar el token `{expl:id:palabra}` en el texto HTML

## 2. CREAR LA CAJITA DE INFORMACIÓN
Agregar una entrada completa en el archivo JSON con toda la información

## 3. AGREGAR A FLASHCARDS
Crear la tarjeta correspondiente en el sistema de flashcards

---

## CÓMO LEO LAS PALABRAS QUE TE ENVÍO

### Ignorar la palabra „Komma"
Cuando el usuario escribe „Komma" entre palabras, se ignora: es solo un separador o recordatorio, no una palabra a añadir.
**Ejemplo:** `über die Rolle sprechen, Komma. Genauer gesagt, es geht um, Komma. zwangsläufig`
→ Haz cajitas para: über die Rolle sprechen, Genauer gesagt es geht um, zwangsläufig (ignora „Komma")

### Palabras separadas por comas (,)
Cada palabra es una cajita diferente.
**Ejemplo:** `Hemmschwelle, unübersichtliche, Normalität`
→ Haz 3 cajitas separadas

### Palabras con puntos suspensivos (...)
Es UNA SOLA cajita, pero ignora las palabras del medio.
**Ejemplo:** `fange... an`
→ Busca "fange" y "an" en el texto, pero es una sola cajita para el verbo separable "anfangen"

### Phrase con palabras entre paréntesis
La phrase es una cajita, PERO también haz cajitas internas para las palabras en paréntesis.
**Ejemplo:** `möglicherweise Seiten der eigenen Persönlichkeit bekannt(Seiten, Persönlichkeit)`
→ Haz 1 cajita de tipo "phrase" + 2 cajitas internas (una para "Seiten", otra para "Persönlichkeit")

---

## REGLAS IMPORTANTES

### Ejemplos de uso
Las frases de ejemplo DEBEN ser DIFERENTES a la frase original del texto.
❌ NO repitas la misma situación
✅ Crea frases nuevas que muestren otros significados o contextos de la palabra

### Phrases deben tener componentes
Si el tipo es "phrase", SIEMPRE incluye el campo `components` con cada palabra y su tipo.

### Determinar el tipo según la estructura

**Si es VERBO:**
- verb + verb + verb = `"type": "verb"`
- nomen/pronomen + verb + verb = `"type": "verb"`
- nomen/pronomen (artikel) + verb + verb = `"type": "verb"`
- verb + adverb = `"type": "verb"`
- nomen/pronomen + verb + adverb = `"type": "verb"`

**Si es NOMEN:**
- adjektiv + nomen = `"type": "nomen"`
- artikel + adjektiv + nomen = `"type": "nomen"`

**Si es PHRASE:**
- nomen/pronomen + verb + präposition + artikel + ... = `"type": "phrase"`

**Si todos son del mismo tipo:**
- x + x + x = `"type": "x"` (donde x es cualquier tipo, siempre que TODOS sean iguales)

---

## RESUMEN RÁPIDO

1. ¿Hay comas? → Cajitas separadas
2. ¿Hay puntos suspensivos? → Una sola cajita, ignora el medio
3. ¿Hay paréntesis? → Cajita principal + cajitas internas
4. Ejemplos → Siempre diferentes a la frase original
5. Phrases → Siempre con componentes
6. Tipo → Determinar según las reglas de estructura


# Sistema de Explicaciones Interactivas – Texte

**Ubicación:** `TELC/WEB/texte/`

## Descripción General

Sistema interactivo para textos de producción escrita (C1) que permite marcar palabras o frases con dudas lingüísticas y mostrar información detallada al hacer click. El sistema incluye traducciones, explicaciones, ejemplos, conjugaciones, sinónimos, antónimos y más información contextual.

**Característica destacada:** Sistema de colores automático según el tipo de palabra (Wortart), facilitando la identificación visual de verbos, sustantivos, adjetivos, etc.

---

## Estructura del Sistema

### Componentes Principales

1. **HTML** (`text-01.html`): Contiene el texto con tokens de marcado y la leyenda de colores
2. **JSON** (`text-01-explanations.json`): Base de datos con todas las explicaciones
3. **JavaScript** (`text-01.js`): Lógica de procesamiento y visualización
4. **CSS** (`styles.css`): Estilos para palabras marcadas, panel de información y leyenda de colores

---

## Formato de Marcado en el Texto

### Token de Explicación

**Sintaxis:**
```
{expl:id:palabra}
```

**Componentes:**
- `expl`: Prefijo fijo que indica que es una palabra con explicación
- `id`: Identificador único que corresponde a una entrada en el JSON
- `palabra`: Texto visible en el documento (puede incluir espacios)

**Ejemplos:**
```html
<p>Spätestens seit der Pandemie sind Online-Formate {expl:zur-normalitaet-geworden:zur Normalität geworden}.</p>
<p>Die {expl:hemmschwelle:Hemmschwelle}, einfach die Kamera auszuschalten, ist niedrig.</p>
<p>Technische Probleme oder {expl:unuebersichtliche:unübersichtliche} Plattformen können Stress verursachen.</p>
```

**Reglas:**
- Los tokens pueden aparecer en cualquier parte del texto
- El `id` debe coincidir exactamente con una clave en el JSON
- La `palabra` puede ser una palabra simple o una frase completa
- Los tokens se procesan antes de renderizar el HTML

**IMPORTANTE - Unidad Visual:**
- **Frases compuestas que están juntas en el texto deben marcarse como una sola unidad** en un solo token
- Si las palabras forman una unidad conceptual y aparecen consecutivas, deben marcarse juntas: `{expl:id:palabra1 palabra2}`
- Esto asegura que visualmente aparezcan como una sola caja resaltada, tanto en el texto principal como en el panel de información
- **Ejemplo correcto:** `{expl:sinnvoll-sind:sinnvoll sind}` (una sola unidad)
- **Ejemplo incorrecto:** `{expl:sinnvoll-sind:sinnvoll} {expl:sinnvoll-sind:sind}` (dos unidades separadas)

### Verbos Compuestos (Partes Separadas)

En alemán, los verbos pueden estar divididos en varias partes:
- **Verbos separables**: El prefijo se separa (ej: "ab" + "sagen" = "absagen")
- **Verbos con auxiliar**: Verbo auxiliar + participio (ej: "haben" + "gemacht")
- **Verbos modales**: Verbo modal + infinitivo (ej: "muss" + "gehen")

**Solución:** Marcar cada parte del verbo con el mismo `id`. Todas las partes se marcan visualmente y al hacer click en cualquiera de ellas se abre la misma explicación.

**Sintaxis para verbos compuestos:**
```html
<!-- Verbo separable: absagen -->
<p>Ich {expl:absagen-example:muss} die Veranstaltung {expl:absagen-example:ab}{expl:absagen-example:sagen}.</p>

<!-- Verbo con auxiliar: zur Normalität geworden -->
<p>Online-Formate {expl:zur-normalitaet-geworden:sind} ... {expl:zur-normalitaet-geworden:geworden}.</p>

<!-- Verbo modal: können + infinitivo -->
<p>Studierende {expl:koennen-teilnehmen:können} ortsunabhängig {expl:koennen-teilnehmen:teilnehmen}.</p>
```

**Reglas para verbos compuestos:**
- Todas las partes del verbo deben usar el mismo `id`
- Cada parte se marca por separado con su propio token
- Al hacer click en cualquier parte, se abre la misma explicación
- En el JSON, el campo `parts` debe contener todas las partes del verbo
- En la oración, todas las partes se resaltan automáticamente

---

## Estructura del JSON de Explicaciones

### Formato Base

Cada entrada en el JSON tiene la siguiente estructura:

```json
{
  "id-unico": {
    "word": "Palabra o frase en alemán",
    "translation": "Traducción al español",
    "sentence": "Oración completa donde aparece la palabra",
    "sentenceTranslation": "Traducción de la oración completa",
    "explanation": "Explicación detallada del uso y significado",
    "examples": ["Ejemplo 1", "Ejemplo 2"],
    "conjugation": {
      "present": {
        "ich": "forma presente 1ra persona",
        "du": "forma presente 2da persona",
        "er/sie/es": "forma presente 3ra persona",
        "wir": "forma presente 1ra persona plural",
        "ihr": "forma presente 2da persona plural",
        "sie/Sie": "forma presente 3ra persona plural/formal"
      },
      "preterite": {
        "ich": "forma pretérito 1ra persona",
        "du": "forma pretérito 2da persona",
        "er/sie/es": "forma pretérito 3ra persona",
        "wir": "forma pretérito 1ra persona plural",
        "ihr": "forma pretérito 2da persona plural",
        "sie/Sie": "forma pretérito 3ra persona plural/formal"
      },
      "perfect": "forma perfecto (con auxiliar)",
      "infinitive": "infinitivo"
    },
    "baseForm": "forma base sin declinar (solo adjetivos)",
    "synonyms": ["sinónimo 1", "sinónimo 2"],
    "antonyms": ["antónimo 1", "antónimo 2"],
    "type": "tipo de palabra (noun, verb, adjective, phrase, etc.)"
  }
}
```

### Campos Obligatorios

- `word`: Siempre requerido
- `translation`: Siempre requerido
- `sentence`: Siempre requerido
- `sentenceTranslation`: Siempre requerido

### Campos Opcionales

- `explanation`: Explicación detallada
- `examples`: Array de ejemplos de uso
- `conjugation`: Objeto con formas verbales (solo para verbos)
  - **Formato nuevo (recomendado)**: Objeto con `present`, `preterite` (cada uno con pronombres: ich, du, er/sie/es, wir, ihr, sie/Sie), `perfect` e `infinitive` como strings
  - **Formato antiguo (retrocompatibilidad)**: Strings simples para `present`, `preterite`, `perfect`, `infinitive` (solo 3ra persona)
- `baseForm`: Forma base sin declinar (solo para adjetivos)
- `synonyms`: Array de sinónimos
- `antonyms`: Array de antónimos
- `type`: Tipo de palabra
- `parts`: Array de strings con las partes separadas del verbo (para verbos compuestos)
- `components`: Array de objetos con `word` y `type` (solo para `type: "phrase"`). **IMPORTANTE:** Este campo es **OBLIGATORIO** para todas las phrases (`type: "phrase"`). Permite descomponer una frase en sus componentes primarios y mostrar cada palabra con su color correspondiente. Cada objeto tiene:
  - `word`: La palabra o parte de la frase (debe coincidir exactamente con cómo aparece en el texto)
  - `type`: El tipo de palabra (verb, nomen, adjektiv, artikel, pronomen, adverb, präposition, konjunktion, subjunktion, partikel)
  - Ejemplo: `"components": [{"word": "bei", "type": "präposition"}, {"word": "denen", "type": "pronomen"}]`
  - **Regla:** TODAS las phrases deben tener este campo definido para que el sistema muestre la sección "Componentes:" y coloree las palabras en la explicación
- `gender`: Género gramatical (solo para `type: "nomen"` o `type: "noun"`). Ejemplos: `"der (masculino)"`, `"die (femenino)"`, `"das (neutro)"`.
- `case`: Caso en el que aparece el sustantivo en la oración (solo para `type: "nomen"` o `type: "noun"`). Ejemplos: `"Nominativ Singular"`, `"Akkusativ Plural"`.
- `singular`: Forma en singular del sustantivo (solo para `type: "nomen"` o `type: "noun"`).
- `plural`: Forma en plural del sustantivo (solo para `type: "nomen"` o `type: "noun"`).
- `verbType`: Tipo de verbo compuesto. **IMPORTANTE:** Este campo se muestra automáticamente en la caja de información para todos los verbos (`type: "verb"`). Valores posibles:
  - `"separable"` → Trennbar (separable)
  - `"untrennbar"` o `"inseparable"` → Untrennbar (inseparable)
  - `"modal"` → Modalverb (verbo modal)
  - `"reflexive"` o `"reflexiv"` → Reflexiv (reflexivo)
  - `"auxiliary"` → Mit Hilfsverb (con verbo auxiliar)
  - `"separable-modal"` → Trennbar + Modalverb
  - `"separable-auxiliary"` → Trennbar + Mit Hilfsverb
  - `"reflexive-separable"` → Reflexiv + Trennbar
  - `"compound-auxiliary"` → Zusammengesetzt + Mit Hilfsverb
  - `"compound"` → Zusammengesetzt (compuesto)

### Ejemplo Completo - Palabra Simple

```json
{
  "hemmschwelle": {
    "word": "Hemmschwelle",
    "translation": "barrera psicológica, inhibición, umbral de vergüenza/miedo",
    "sentence": "Die Hemmschwelle, einfach die Kamera auszuschalten und nebenbei etwas anderes zu machen, ist niedrig.",
    "sentenceTranslation": "La barrera para simplemente apagar la cámara y hacer otra cosa al mismo tiempo es baja.",
    "explanation": "Sustantivo femenino. Literalmente el 'umbral' a partir del cual te animas a hacer algo. 'Hemmung' = inhibición, freno interno. 'Schwelle' = umbral.",
    "examples": [
      "Die Hemmschwelle ist hoch, jemanden Fremden anzusprechen. = Da mucha cosa hablarle a un desconocido.",
      "Online ist die Hemmschwelle niedriger. = Online la gente se frena menos."
    ],
    "synonyms": ["Hemmung (inhibición)", "Scheu (temor, recelo)"],
    "antonyms": ["Unbefangenheit (desinhibición)", "Selbstsicherheit (seguridad en sí mismo)"],
    "type": "noun"
  }
}
```

### Ejemplo Completo - Verbo Compuesto

```json
{
  "absagen-example": {
    "word": "absagen",
    "translation": "cancelar, anular",
    "sentence": "Ich muss die Veranstaltung absagen, weil ich krank bin.",
    "sentenceTranslation": "Debo cancelar el evento porque estoy enfermo.",
    "explanation": "Verbo separable. El prefijo 'ab-' se separa en presente, pretérito y en oraciones principales. En infinitivo y participio, el verbo está junto: 'absagen', 'abgesagt'.",
    "parts": ["muss", "ab", "sagen"],
    "conjugation": {
      "present": {
        "ich": "sage ab",
        "du": "sagst ab",
        "er/sie/es": "sagt ab",
        "wir": "sagen ab",
        "ihr": "sagt ab",
        "sie/Sie": "sagen ab"
      },
      "preterite": {
        "ich": "sagte ab",
        "du": "sagtest ab",
        "er/sie/es": "sagte ab",
        "wir": "sagten ab",
        "ihr": "sagtet ab",
        "sie/Sie": "sagten ab"
      },
      "perfect": "hat abgesagt",
      "infinitive": "absagen"
    },
    "examples": [
      "Ich sage die Party ab. = Cancelo la fiesta.",
      "Er hat die Einladung abgesagt. = Él canceló la invitación."
    ],
    "synonyms": ["stornieren (cancelar, anular)", "abbrechen (cancelar, interrumpir)"],
    "type": "verb",
    "verbType": "separable-modal"
  }
}
```

**Nota importante sobre `verbType`:**
- El campo `verbType` se muestra automáticamente en la caja de información para todos los verbos
- Aparece como una sección "Tipo de verbo:" con una lista de características
- Para `"separable-modal"`, se mostrará:
  - • Trennbar (separable)
  - • Modalverb (verbo modal)
- Si el verbo no tiene `verbType` definido, esta sección no aparece

**Nota importante sobre `parts`:**
- El array `parts` contiene todas las partes del verbo que aparecen separadas en la oración
- **TODAS las partes se resaltan automáticamente** en la oración completa, independientemente de cuál se tocó
- Todas las partes deben marcarse en el HTML con el mismo `id`
- Ejemplo: Si `parts: ["sind", "zur Normalität geworden"]`, ambas partes se resaltarán en la oración, incluso si solo se hizo click en "sind"

---

## Procesamiento JavaScript

### Función `processExplanationTokens()`

Convierte los tokens `{expl:id:palabra}` en elementos HTML clickeables:

```javascript
function processExplanationTokens(text) {
  const tokenRegex = /\{expl:([^:]+):([^}]+)\}/g;
  return text.replace(tokenRegex, (match, id, word) => {
    return `<span class="explanation-word" data-explanation-id="${id}">${escapeHtml(word)}</span>`;
  });
}
```

**Proceso:**
1. Busca todos los tokens `{expl:id:palabra}` en el texto
2. Los reemplaza con `<span>` con clase `explanation-word`
3. Añade atributo `data-explanation-id` con el ID
4. Escapa el HTML para prevenir XSS

### Función `showExplanation(id)`

Muestra el panel de información con los datos del JSON:

```javascript
function showExplanation(id) {
  const data = explanationsData[id];
  if (!data) return;

  // Rellena los elementos del panel con los datos
  // Resalta la palabra en la oración
  // Muestra traducción, explicación, ejemplos, etc.
}
```

**Proceso:**
1. Busca la entrada en `explanationsData` usando el `id`
2. Resalta la palabra en la oración completa
3. Muestra la oración en alemán y español
4. Renderiza todos los campos disponibles (traducción, explicación, ejemplos, conjugación, etc.)

**Importante - Resaltado de Partes Separadas:**
- Si hay `parts` definidas en el JSON, **SIEMPRE se resaltan TODAS las partes**, independientemente de cuál se tocó
- Esto asegura que cuando un verbo está dividido (ej: "sind" y "zur Normalität geworden"), ambas partes se resalten en la oración
- El `markedText` (texto tocado) también se resalta si no está ya incluido en las partes
- Se evitan duplicados: si una parte ya está resaltada, no se vuelve a resaltar

**Navegación: posición anterior del texto**

- Antes de abrir el panel, el sistema guarda la posición actual de scroll del usuario (`lastScrollPosition`)
- También guarda el elemento clickeado (`lastClickedElement`), que representa la palabra marcada en el texto principal
- En el panel se muestra un botón **"↑ Volver al texto"** que:
  - Hace scroll suave de vuelta a `lastScrollPosition`
  - Vuelve a resaltar visualmente la palabra clickeada con una animación moderada (ver sección de estilos)

**Navegación interna entre cajitas y comportamiento estable de "Volver al texto":**

- `lastScrollPosition` y `lastClickedElement` **solo se actualizan** cuando el usuario hace click en una palabra marcada en el texto principal (las cajitas dentro del documento).
- Si el usuario abre otras explicaciones desde dentro del propio panel (por ejemplo, clicando en un componente de una `phrase` en la sección "Componentes"), estas aperturas se consideran **navegación interna**:
  - No modifican `lastScrollPosition`.
  - No cambian `lastClickedElement`.
- De este modo, aunque el usuario abra varias cajitas encadenadas dentro del panel, el botón **"↑ Volver al texto"** siempre lo lleva de regreso a la posición del texto donde tocó la cajita original.

**Sección "Tipo de verbo" (solo para verbos):**
- Se muestra automáticamente para todos los verbos (`type: "verb"`) que tengan el campo `verbType` definido
- Aparece después de la "Explicación" y antes de los "Ejemplos"
- Muestra las características del verbo en una lista con viñetas:
  - Detecta automáticamente si el verbo es separable, inseparable, modal, reflexivo, con auxiliar, o compuesto
  - Puede mostrar múltiples características si el verbo tiene varias (ej: "separable-modal" muestra "Trennbar" y "Modalverb")
  - Si el verbo no tiene `verbType` definido, esta sección no aparece

### Función `highlightWordInSentence()`

Resalta la palabra (o partes del verbo) en la oración completa:

```javascript
function highlightWordInSentence(sentence, word, parts, markedText) {
  // Si hay partes múltiples del verbo, SIEMPRE resaltar TODAS las partes
  // Esto asegura que todas las partes separadas se resalten, incluso si solo se tocó una
  if (parts && parts.length > 0) {
    parts.forEach(part => {
      // Resaltar cada parte individualmente
    });
  }
  
  // También resaltar el texto exacto marcado si existe
  if (markedText) {
    // Resaltar el texto marcado, evitando duplicados
  }
  
  // Si no hay partes ni markedText, resaltar la palabra completa
}
```

**Características importantes:**
- **Resaltado completo de partes**: Si hay `parts` definidas, TODAS se resaltan, no solo la tocada
- **Evita duplicados**: Usa un sistema de rangos para evitar resaltar la misma palabra dos veces
- **Maneja frases con espacios**: Para frases como "zur Normalität geworden", busca la frase completa
- **Maneja palabras simples**: Para palabras individuales, usa word boundaries para mayor precisión

### Función `renderExplanationDetails(data)`

Genera el HTML para los detalles adicionales:

```javascript
function renderExplanationDetails(data) {
  // Genera secciones para:
  // - Explicación (con palabras coloreadas si es phrase con components)
  // - Componentes (solo para phrases, muestra cada palabra con su color y tipo)
  // - Información nominal (solo para sustantivos, muestra género, caso y formas singular/plural)
  // - Tipo de verbo (solo para verbos, muestra características: trennbar, modal, reflexiv, etc.)
  // - Ejemplos
  // - Conjugación (si es verbo, con tabla completa)
  // - Forma base (si es adjetivo)
  // - Sinónimos
  // - Antónimos
  // - Tipo de palabra
}
```

**Sección "Información nominal" (solo para sustantivos):**

- Se muestra automáticamente para entradas con `type: "nomen"` o `type: "noun"` que tengan al menos uno de los campos `gender`, `case`, `singular` o `plural`
- Aparece después de la "Explicación" / "Componentes" y antes de "Tipo de verbo" / "Ejemplos"
- Contiene:
  - **Género:** Por ejemplo `"die (femenino)"`, `"der (masculino)"`
  - **Caso en la oración:** Por ejemplo `"Nominativ Plural"`, `"Akkusativ Singular"`
  - **Formas singular/plural:** Muestra `singular / plural` si ambos están definidos
- Ejemplo visual en la caja de información:

```text
INFORMACIÓN NOMINAL:
- Género: die (femenino)
- Caso en la oración: Nominativ Singular
- Formas: Hemmschwelle / Hemmschwellen
```

**Sección "Componentes" (solo para phrases):**
- Se muestra automáticamente para todas las phrases (`type: "phrase"`) que tengan el campo `components` definido
- **IMPORTANTE:** El campo `components` es **OBLIGATORIO** para todas las phrases. Sin este campo, la sección "Componentes:" no aparecerá y las palabras no se colorearán en la explicación
- Aparece después de la "Explicación" y antes de los "Ejemplos"
- Muestra cada componente de la frase en una lista:
  - Cada palabra aparece coloreada con su color correspondiente según su tipo
  - Al lado de cada palabra se muestra su tipo entre paréntesis (ej: "bei (Präposition)")
- **Coloreado en la Explicación:** Si la phrase tiene `components`, las palabras mencionadas en el campo `explanation` también se colorean automáticamente con sus colores correspondientes
- **Ejemplos de phrases con components:**
  - `"Hinzu kommt"` → `[{"word": "Hinzu", "type": "adverb"}, {"word": "kommt", "type": "verb"}]`
  - `"bei denen"` → `[{"word": "bei", "type": "präposition"}, {"word": "denen", "type": "pronomen"}]`
  - `"vor allem"` → `[{"word": "vor", "type": "präposition"}, {"word": "allem", "type": "pronomen"}]`
  - `"statt nur eine Notlösung zu sein"` → `[{"word": "statt", "type": "präposition"}, {"word": "nur", "type": "partikel"}, {"word": "eine", "type": "artikel"}, {"word": "Notlösung", "type": "nomen"}, {"word": "zu", "type": "partikel"}, {"word": "sein", "type": "verb"}]`

#### Cajitas dentro de cajitas para phrases

- Una entrada `type: "phrase"` puede tener **cajitas internas clickeables** en la sección "Componentes".
- Cada objeto en `components` puede enlazar a su propia explicación si existe una entrada en el JSON cuyo `word` coincide exactamente con `component.word`.
- Opcionalmente, el componente puede definir su id explícitamente:
  - `{"word": "Seiten", "type": "nomen", "id": "seiten"}`
- Si `id` no está definido:
  - El sistema busca en `explanationsData` una entrada con el mismo `word` y utiliza ese id.
  - Si no encuentra coincidencias, el componente se muestra solo como etiqueta de color (no clickeable).

**Formato visual y comportamiento:**

- Cada componente se renderiza como una pastilla con las mismas clases que las palabras del texto:
  - `class="phrase-component-link explanation-word explanation-word-<tipo>"`
  - `data-explanation-id="[id-detectado]"` (solo si hay explicación asociada).
- Al hacer click (o pulsar Enter/Espacio) sobre una `phrase-component-link`:
  - Se abre el panel de explicación normal de esa palabra hija (p. ej. `seiten` → palabra "Seiten").
  - La phrase original sigue visible detrás; no se pierde.

**Botón "Volver a la Frase":**

- Cuando el usuario abre una cajita hija desde la sección "Componentes" de una phrase, el panel muestra un botón **"← Volver a la Frase"**.
- Al hacer click en ese botón, se vuelve a mostrar la explicación de la phrase (cajita padre) sin cerrar el panel.
- El botón solo aparece cuando la explicación actual se abrió desde un componente de una phrase; si se abrió desde el texto principal, no se muestra.
- Así el usuario puede navegar: texto → phrase → componente → "← Volver a la Frase" → phrase, y desde la phrase seguir usando "↑ Volver al texto" para volver al documento.

**Cómo implementar el botón "Volver a la Frase":**

1. **Variable de estado:** Añadir `let lastParentExplanationId = null;` junto a `lastScrollPosition` y `lastClickedElement`.
2. **Firma de `showExplanation`:** Usar `showExplanation(id, markedText, fromTextClick, parentId)`. Cuando el usuario hace click en un componente de la phrase, llamar `showExplanation(targetId, marked, false, id)` donde `id` es el id de la phrase actual (cajita padre). Cuando el click viene del texto principal, llamar `showExplanation(id, markedText, true)` (sin `parentId`) y en ese caso poner `lastParentExplanationId = null`.
3. **Al mostrar el panel:** Si `lastParentExplanationId` está definido (porque se pasó `parentId` al abrir desde un componente), guardar `lastParentExplanationId = parentId` y mostrar el botón con texto fijo `"← Volver a la Frase"`. Si no hay padre, ocultar el botón.
4. **HTML:** En el header del panel (`.explanation-panel-actions`), añadir un botón con `id="explanation-back-to-parent"` y clases `explanation-back explanation-back-to-parent`, oculto por defecto (`style="display: none;"`). Ejemplo: `<button id="explanation-back-to-parent" class="explanation-back explanation-back-to-parent" type="button" style="display: none;" aria-label="Volver a la cajita de la frase original">← Volver a la Frase</button>`.
5. **Al hacer click en "Volver a la Frase":** Llamar `showExplanation(lastParentExplanationId, null, false)` y poner `lastParentExplanationId = null` para que la phrase se muestre sin el botón de volver a padre.
6. **CSS:** La clase `.explanation-back-to-parent` puede usar `text-transform: none`. Referencia: `TELC/WEB/styles.css` (sección Explanation System Styles).

**Sección "Tipo de verbo":**
- Se muestra automáticamente para todos los verbos (`type: "verb"`)
- Solo aparece si el campo `verbType` está definido en el JSON
- Aparece después de la "Explicación" y antes de los "Ejemplos"
- Muestra las características del verbo en una lista con viñetas:
  - **Trennbar (separable)**: Si el verbo es separable (prefijo se separa)
  - **Untrennbar (inseparable)**: Si el verbo es inseparable (prefijo no se separa)
  - **Modalverb (verbo modal)**: Si es un verbo modal (können, müssen, sollen, etc.)
  - **Reflexiv (reflexivo)**: Si es un verbo reflexivo (requiere pronombre reflexivo: sich, mich, etc.)
  - **Mit Hilfsverb (con verbo auxiliar)**: Si usa verbo auxiliar (haben, sein, werden)
  - **Zusammengesetzt (compuesto)**: Si es un verbo compuesto (sin auxiliar específico)
- Puede mostrar múltiples características si el verbo tiene varias:
  - Ejemplo: `"verbType": "separable-modal"` → muestra "Trennbar" y "Modalverb"
  - Ejemplo: `"verbType": "reflexive-separable"` → muestra "Reflexiv" y "Trennbar"
  - Ejemplo: `"verbType": "compound-auxiliary"` → muestra "Mit Hilfsverb" (no muestra "compuesto" porque ya está incluido en "auxiliary")

---

## Estilos CSS

### Sistema de Colores por Tipo de Palabra (Wortart)

El sistema aplica colores automáticamente según el tipo de palabra definido en el campo `type` del JSON. Cada tipo de palabra tiene un color único para facilitar la identificación visual.

#### Regla General

**IMPORTANTE - Cuándo usar `type: "phrase"` vs tipo específico:**

- **`type: "phrase"`** se usa **SOLO** cuando la palabra o expresión está compuesta de **MÚLTIPLES tipos diferentes** de palabras (Wortarten).
  - Ejemplo: "vor Ort arbeiten" (adverbio + verbo) → `type: "phrase"`
  - Ejemplo: "etwa verpflichtende Gruppenprojekte" (adverbio + adjetivo + sustantivo) → `type: "phrase"`
  - Ejemplo: "bei denen" (preposición + pronombre) → `type: "phrase"`

- **Tipo específico** se usa cuando **TODOS** los componentes son del **mismo tipo**:
  - Ejemplo: "sich treffen" (solo verbos) → `type: "verb"` ✅ NO `type: "phrase"`
  - Ejemplo: "angepasst werden" (solo verbos) → `type: "verb"` ✅ NO `type: "phrase"`
  - Ejemplo: "im Vordergrund stehen" (solo verbo) → `type: "verb"` ✅ NO `type: "phrase"`
  - Ejemplo: "wirkt künstlich" (solo verbo) → `type: "verb"` ✅ NO `type: "phrase"`

**Regla práctica:**
- Si todos los componentes son verbos → `type: "verb"`
- Si todos los componentes son sustantivos → `type: "nomen"`
- Si todos los componentes son adjetivos → `type: "adjektiv"`
- Si hay mezcla de tipos (verbo + adverbio, preposición + sustantivo, etc.) → `type: "phrase"`

**Colores aplicados:**
- **Palabras con tipo específico** (verb, nomen, adjektiv, etc.): Usan el color específico de su tipo
- **Palabras con `type: "phrase"`** (múltiples tipos): Usan el color **rojo estándar** (`.explanation-word-default`)

#### Tipos de Palabra y Colores

| Tipo (type) | Color | Clase CSS | RGB Background | Color Texto |
|-------------|-------|-----------|---------------|-------------|
| **verb** | Verde esmeralda | `.explanation-word-verb` | `rgba(46, 204, 113, 0.24)` | `#d4f4e0` |
| **nomen** / **noun** | Azul | `.explanation-word-nomen` | `rgba(93, 173, 255, 0.25)` | `#d7e9ff` |
| **adjektiv** / **adjective** | Naranja | `.explanation-word-adj` | `rgba(255, 168, 104, 0.24)` | `#ffd7b9` |
| **artikel** / **article** | Verde claro | `.explanation-word-artikel` | `rgba(91, 201, 152, 0.22)` | `#c9f4e3` |
| **pronomen** / **pronoun** | Púrpura | `.explanation-word-pronomen` | `rgba(177, 140, 255, 0.24)` | `#efe2ff` |
| **adverb** | Turquesa | `.explanation-word-adverb` | `rgba(92, 203, 191, 0.24)` | `#d8fff6` |
| **präposition** / **preposition** | Rosa | `.explanation-word-praeposition` | `rgba(255, 126, 189, 0.26)` | `#ffe0f1` |
| **konjunktion** / **conjunction** | Amarillo | `.explanation-word-konjunktion` | `rgba(244, 191, 72, 0.26)` | `#ffe8b5` |
| **subjunktion** / **subjunction** | Verde azulado | `.explanation-word-subjunktion` | `rgba(104, 171, 214, 0.22)` | `#cfe9fb` |
| **partikel** / **particle** | Gris | `.explanation-word-partikel` | `rgba(158, 158, 158, 0.22)` | `#ececec` |
| **phrase** / **compound** / **verb-preposition** | Rojo estándar | `.explanation-word-default` | `rgba(255, 84, 84, 0.15)` | `#ffd6d6` |

#### Ejemplos de Uso

**Verbo simple:**
```json
{
  "lernen": {
    "word": "lernen",
    "type": "verb",
    ...
  }
}
```
→ Se marca con color **verde esmeralda**

**Sustantivo:**
```json
{
  "hemmschwelle": {
    "word": "Hemmschwelle",
    "type": "nomen",
    ...
  }
}
```
→ Se marca con color **azul**

**Adverbio:**
```json
{
  "spaetestens": {
    "word": "Spätestens",
    "type": "adverb",
    ...
  }
}
```
→ Se marca con color **turquesa**

**Verbo compuesto (todos los componentes son verbos):**
```json
{
  "zur-normalitaet-geworden": {
    "word": "zur Normalität geworden",
    "type": "verb",  // ✅ Todos los componentes son verbos
    "verbType": "compound-auxiliary",
    ...
  }
}
```
→ Se marca con color **verde esmeralda** (`.explanation-word-verb`) porque es un verbo

**Frase compuesta (múltiples tipos diferentes):**
```json
{
  "bei-denen": {
    "word": "bei denen",
    "type": "phrase",  // ✅ Preposición + Pronombre (múltiples tipos)
    "components": [
      {
        "word": "bei",
        "type": "präposition"
      },
      {
        "word": "denen",
        "type": "pronomen"
      }
    ],
    ...
  }
}
```
→ Se marca con color **rojo estándar** (`.explanation-word-default`) porque es una frase de múltiples tipos
→ En la caja de información, se muestra una sección "Componentes:" que lista cada palabra con su color correspondiente

### Clase Base `.explanation-word`

Estilo base común para todas las palabras marcadas:

```css
.explanation-word {
  padding: 0.08rem 0.28rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
  font-weight: 600;
  margin-right: 2px;
  display: inline-block;
  border-bottom: 2px solid;
}

@keyframes explanation-word-pulse-keyframes {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.0);
  }
  25% {
    transform: scale(1.06);
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.06);
  }
  50% {
    transform: scale(1.0);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.0);
  }
  75% {
    transform: scale(1.04);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.04);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.0);
  }
}

.explanation-word-pulse {
  animation: explanation-word-pulse-keyframes 0.6s ease-in-out 0s 2;
}
```

**Características comunes:**
- Todas las palabras marcadas comparten el mismo padding, border-radius, cursor y transiciones
- Cada tipo tiene su propio color de fondo, texto y borde
- Hover effect consistente para todos los tipos
- Borde inferior para destacar

### Clase `.word-types-legend`

Leyenda de colores que muestra todos los tipos de palabras disponibles:

```css
.word-types-legend {
  background: var(--surface-100);
  border-radius: var(--radius-lg);
  padding: clamp(20px, 3vw, 28px);
  border: 1px solid var(--line);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
}

.word-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.word-type-example {
  cursor: default;
  pointer-events: none;
  font-weight: 600;
  font-size: 0.95rem;
}
```

**Características:**
- Ubicada en la parte superior del texto, antes del contenido principal
- Muestra todos los tipos de palabras (Wortarten) con sus colores correspondientes
- Diseño responsive con CSS Grid
- Cada tipo se muestra con su nombre subrayado en su color específico
- No es interactiva (solo informativa)

### Clase `.explanation-panel`

Panel integrado en el flujo del documento, debajo del texto:

```css
.explanation-panel {
  background: var(--surface-100);
  border-radius: var(--radius-lg);
  padding: clamp(20px, 3vw, 36px);
  border: 1px solid var(--line);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  margin-top: 32px;
  line-height: 1.7;
}
```

**Características:**
- Integrado en el flujo del documento (no es overlay)
- Estilo similar a la caja del texto principal (`.doc`)
- Margen superior para separarlo del texto
- Sin animación (menos invasivo)

### Botón "Volver al texto" y acciones del header del panel

En el header del panel se ha añadido una zona de acciones con un botón para volver a la posición anterior en el texto:

```css
.explanation-panel-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.explanation-back {
  background: transparent;
  border: 1px solid var(--line-soft);
  color: var(--ink-700);
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 999px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.explanation-back:hover {
  border-color: var(--accent);
  color: var(--accent);
}
```

**Comportamiento:**
- El botón `↑ Volver al texto` se muestra junto al botón de cerrar (×) en el header del panel
- Cuando la explicación se abrió desde un componente de una phrase (cajita dentro de cajita), también aparece el botón **"← Volver a la Frase"**, que vuelve a la explicación de la phrase; ver sección "Cajitas dentro de cajitas para phrases".
- Al hacer click en "Volver al texto":
  - La página hace scroll suave hacia la posición en la que estaba el usuario antes de abrir el panel
  - La palabra que se había clickeado en el texto principal se anima con la clase `.explanation-word-pulse` (pequeño efecto de zoom suave dos veces)

### Botón "Flashcards" sobre el texto principal

Encima de la caja del texto principal (la caja con el texto completo, aprox. 493 palabras) se ha añadido un botón discreto **"Flashcards"** alineado a la derecha:

```css
.text-flashcards-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.text-flashcards-btn {
  background: transparent;
  border: 1px solid var(--line-soft);
  color: var(--ink-700);
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.text-flashcards-btn:hover {
  border-color: var(--accent-soft);
  color: var(--accent);
}
```

**Ubicación:**
- El botón `Flashcards` está **fuera de la caja de información** y **fuera del panel de explicación**
- Se muestra en la parte superior derecha, justo encima de la caja `doc` que contiene el texto marcado

**Comportamiento:**
- Al hacer click abre una página específica de flashcards para el texto actual: `text-01-flashcards.html`
- La navegación es a otra página (no modifica la posición de scroll del texto actual)

**Objetivo didáctico:**
- Permitir pasar del modo lectura del texto completo a un modo de **entrenamiento tipo tarjeta** con todas las palabras marcadas
- Mantener el botón pequeño y no intrusivo, como acceso rápido al módulo de práctica

### Módulo de Flashcards para Texte

El sistema de explicaciones se complementa con un módulo de **flashcards** específico para cada texto, pensado para repasar todas las palabras/frases marcadas.

#### Archivos del módulo

- HTML: `TELC/WEB/texte/text-01-flashcards.html`
- JavaScript: `TELC/WEB/texte/text-01-flashcards.js`
- Datos: `TELC/WEB/texte/text-01-explanations.json` (mismo JSON que usa el panel de explicación)

#### Estructura básica de una flashcard

Cada tarjeta se construye directamente a partir de una entrada del JSON:

```javascript
{
  id: "fortschritt",              // ID en el JSON
  word: "Fortschritt",            // data.word
  translation: "progreso, avance",// data.translation
  sentence: "Während einige ...", // data.sentence
  sentenceTranslation: "...",     // data.sentenceTranslation
  type: "nomen",                  // data.type (para colores)
  parts: ["..."]                  // data.parts (para verbos/expresiones compuestas)
}
```

**Requisitos mínimos para que una entrada se convierta en tarjeta:**
- `word` definido
- `translation` definida
- `sentence` y `sentenceTranslation` definidos  
Si falta alguno de estos campos, la entrada se omite en el mazo de flashcards.

#### Qué muestra cada tarjeta

- **Frente (Front):**
  - Label superior: `"Wort"`
  - Palabra/expresión en alemán (`word`)
  - Subtítulo fijo: `"Übersetzung & Beispiel?"`

- **Reverso (Back):**
  - Traducción principal (`translation`)
  - Bloque de ejemplo con dos líneas:
    - **Oración en alemán** (`sentence`) con la palabra/expresión resaltada
    - **Oración en español** (`sentenceTranslation`)

#### Resaltado y colores en las flashcards

- El resaltado de la palabra en la oración de ejemplo usa la misma lógica que el panel de explicación:
  - Usa `type` y, si existen, `parts` para localizar todas las partes relevantes.
  - Aplica las clases `.explanation-highlight-*` correspondientes al tipo de palabra.
  - Mantiene exactamente los mismos colores y estilo (fondo, borde inferior, padding, radio, peso tipográfico).
- Para verbos compuestos o expresiones con `parts`, **todas las partes** que aparecen en la oración se resaltan (no solo una).

#### Lógica de construcción del mazo (`text-01-flashcards.js`)

1. Carga `text-01-explanations.json` con `fetch(..., { cache: "no-store" })`.
2. Convierte las entradas del JSON a un array de tarjetas (ver estructura arriba).
3. Filtra las entradas que no tienen `word`, `translation`, `sentence` o `sentenceTranslation`.
4. Mezcla el mazo con un `shuffle` tipo Fisher–Yates.
5. Inicializa el estado:
   - `state.deck`: array de tarjetas
   - `state.currentIndex`: índice actual (0-based)

```javascript
const state = {
  deck: [],
  currentIndex: 0
};
```

6. Renderiza la tarjeta actual:
   - Frente: `word`
   - Reverso:
     - `translation` (texto simple)
     - bloque HTML con:
       - oración en alemán con highlight (`sentence`)
       - oración en español debajo (`sentenceTranslation`)

#### Interacción en la página de flashcards

- Controles principales:
  - `Zurück` → tarjeta anterior
  - `Aufdecken` → voltear tarjeta (toggle clase `.is-flipped`)
  - `Weiter` → tarjeta siguiente
  - `Neu mischen` → vuelve a mezclar el mazo y reinicia en la primera tarjeta
- Accesibilidad:
  - La tarjeta tiene `tabindex="0"` y `role="button"`.
  - Teclas `Enter` o `Espacio` también voltean la tarjeta.
- Progreso:
  - Barra de progreso (`.flashcards-progress-bar`) que se rellena según `(índice actual + 1) / total`.
  - Texto `"x / N"` en la parte inferior.

#### Flujo usuario completo con flashcards

1. Usuario lee el texto en `text-01.html`.
2. Si quiere practicar, hace clic en el botón **"Flashcards"** sobre la caja del texto.
3. Se abre `text-01-flashcards.html`:
   - Se cargan todas las entradas del JSON.
   - Se genera un mazo con **todas las palabras/frases marcadas** que tengan datos completos.
   - Se muestran una a una: primero la palabra, luego traducción + oración con resaltado y traducción.
4. El usuario puede:
   - Navegar adelante/atrás.
   - Volver a mezclar el mazo tantas veces como quiera.

Este módulo reutiliza el mismo estándar de colores y tipos (`type`, `parts`) descrito en este documento, garantizando que lo que se ve en el texto, en el panel de explicación y en las flashcards sea coherente.

### Consistencia de Estilos entre Texto Principal y Panel

**IMPORTANTE:** Los estilos de resaltado en el panel de explicación (`.explanation-highlight-*`) deben coincidir exactamente con los estilos del texto principal (`.explanation-word-*`) para mantener consistencia visual.

**Estilos que deben coincidir:**
- `border-bottom: 2px solid` (grosor y estilo del subrayado)
- `padding: 0.08rem 0.28rem` (espaciado interno)
- `border-radius: 6px` (redondeo de esquinas)
- `font-weight: 600` (peso de la fuente)
- Colores de fondo, texto y borde (según el tipo de palabra)

**Clases CSS correspondientes:**
- `.explanation-word-verb` ↔ `.explanation-highlight-verb`
- `.explanation-word-nomen` ↔ `.explanation-highlight-nomen`
- `.explanation-word-adj` ↔ `.explanation-highlight-adj`
- Y así sucesivamente para todos los tipos de palabra

**Nota técnica:** Si se modifica el estilo de `.explanation-word-*`, se debe actualizar también el correspondiente `.explanation-highlight-*` para mantener la consistencia visual.

---

## Flujo de Funcionamiento

### 1. Carga Inicial

```
1. HTML se carga
2. JavaScript se ejecuta (DOMContentLoaded)
3. Se carga el JSON de explicaciones (loadExplanations())
4. Se procesan los tokens en el texto (processTextContent())
5. Se añaden event listeners a las palabras marcadas
```

### 2. Interacción del Usuario

```
1. Usuario hace click en una palabra marcada
2. Se captura el evento click
3. Se obtiene el ID del atributo data-explanation-id
4. Se llama a showExplanation(id)
5. Se busca la entrada en explanationsData
6. Se muestra el panel con toda la información
7. El panel se desplaza automáticamente a la vista
```

### 3. Cierre del Panel

```
1. Usuario hace click en el botón de cerrar (×)
2. O hace click fuera del panel
3. Se llama a hideExplanation()
4. El panel se oculta (display: none)
```

---

## Diseño y UX

### Principios de Diseño

1. **No intrusivo**: Las palabras marcadas son visibles pero no distraen
2. **Accesible**: Click claro, hover feedback, fácil de cerrar
3. **Informativo**: Muestra toda la información relevante de forma organizada
4. **Consistente**: Usa los mismos colores y estilos del sistema TELC
5. **Leyenda visual**: Incluye una leyenda de colores en la parte superior del texto para facilitar la identificación de los tipos de palabras

### Leyenda de Colores (Wortarten – Farben)

**Ubicación:** Parte superior del texto, antes del contenido principal

**Propósito:** Mostrar todos los tipos de palabras (Wortarten) disponibles con sus colores correspondientes, facilitando la identificación visual de las palabras marcadas en el texto.

**Estructura HTML:**
```html
<div class="word-types-legend">
  <h3>Wortarten – Farben</h3>
  <div class="word-types-grid">
    <div class="word-type-item">
      <span class="word-type-example explanation-word explanation-word-verb">Verb</span>
    </div>
    <div class="word-type-item">
      <span class="word-type-example explanation-word explanation-word-nomen">Nomen</span>
    </div>
    <!-- ... más tipos ... -->
    <div class="word-type-item">
      <span class="word-type-example explanation-word explanation-word-default">Phrase</span>
    </div>
  </div>
</div>
```

**Tipos incluidos:**
- **Verb** (Verde esmeralda)
- **Nomen** (Azul)
- **Adjektiv** (Naranja)
- **Artikel** (Verde claro)
- **Pronomen** (Púrpura)
- **Adverb** (Turquesa)
- **Präposition** (Rosa)
- **Konjunktion** (Amarillo)
- **Subjunktion** (Verde azulado)
- **Partikel** (Gris)
- **Phrase** (Rojo estándar)

**Características:**
- Cada tipo se muestra con su nombre escrito y subrayado con su color correspondiente
- Diseño responsive: se adapta a diferentes tamaños de pantalla usando CSS Grid
- Estilo consistente con el resto del sistema TELC
- No es clickeable (solo informativo)
- Aparece antes del texto principal para servir como referencia visual

### Estructura del Panel

```
┌─────────────────────────────────────┐
│ [Palabra]                    [×]     │ ← Header (sticky)
├─────────────────────────────────────┤
│ Oración completa:                   │
│ [Oración en alemán con palabra      │
│  resaltada]                          │
│ [Oración en español]                 │
├─────────────────────────────────────┤
│ Traducción:                          │
│ [Traducción destacada]               │
├─────────────────────────────────────┤
│ Explicación:                         │
│ [Texto explicativo]                  │
│ [Si es phrase: palabras coloreadas] │
├─────────────────────────────────────┤
│ Componentes: (solo para phrases)    │
│ • [bei] (Präposition)               │ ← Coloreado
│ • [denen] (Pronomen)                 │ ← Coloreado
├─────────────────────────────────────┤
│ Tipo de verbo: (solo para verbos)   │
│ • Trennbar (separable)               │
│ • Modalverb (verbo modal)            │
│ • Mit Hilfsverb (con verbo auxiliar) │
├─────────────────────────────────────┤
│ Ejemplos:                            │
│ • Ejemplo 1                          │
│ • Ejemplo 2                          │
├─────────────────────────────────────┤
│ Conjugación: (si aplica)            │
│ ┌─────────┬──────────┬────────────┐ │
│ │ Person  │ Präsens  │ Präteritum │ │
│ ├─────────┼──────────┼────────────┤ │
│ │ ich     │ ...      │ ...        │ │
│ │ du      │ ...      │ ...        │ │
│ │ ...     │ ...      │ ...        │ │
│ └─────────┴──────────┴────────────┘ │
│ Perfekt: ...                         │
│ Infinitiv: ...                       │
├─────────────────────────────────────┤
│ Sinónimos: (si aplica)               │
│ • Sinónimo 1                         │
│ • Sinónimo 2                         │
└─────────────────────────────────────┘
```

---

## Extensibilidad

### Añadir Nuevas Palabras

1. **Añadir entrada en JSON:**
   ```json
   {
     "nuevo-id": {
       "word": "Nueva palabra",
       "translation": "Traducción",
       "sentence": "Oración completa",
       "sentenceTranslation": "Traducción de la oración",
       ...
     }
   }
   ```

2. **Marcar en el HTML:**
   ```html
   <p>Texto con {expl:nuevo-id:Nueva palabra} marcada.</p>
   ```

3. **El sistema automáticamente:**
   - Procesa el token
   - Crea el elemento clickeable
   - Muestra la información al hacer click

### Añadir Phrases con Componentes

**IMPORTANTE:** Para phrases que contienen múltiples tipos de palabras, el campo `components` es **OBLIGATORIO**. Todas las phrases (`type: "phrase"`) deben tener este campo definido.

1. **Añadir entrada en JSON con campo `components` (OBLIGATORIO):**
   ```json
   {
     "bei-denen": {
       "word": "bei denen",
       "translation": "en los que, en las que",
       "sentence": "Oración completa",
       "sentenceTranslation": "Traducción de la oración",
       "explanation": "Pronombre relativo con preposición. 'bei' = en, con + 'denen' (dativo plural).",
       "components": [
         {
           "word": "bei",
           "type": "präposition"
         },
         {
           "word": "denen",
           "type": "pronomen"
         }
       ],
       "type": "phrase"
     }
   }
   ```

2. **El sistema automáticamente:**
   - Muestra una sección "Componentes:" en la caja de información
   - Cada palabra aparece coloreada con su color correspondiente
   - Se muestra el tipo de cada palabra entre paréntesis
   - Las palabras mencionadas en `explanation` también se colorean automáticamente

3. **Reglas para definir `components`:**
   - Cada palabra de la phrase debe estar en el array `components`
   - El campo `word` debe coincidir exactamente con cómo aparece la palabra en el texto (respetando mayúsculas/minúsculas)
   - El campo `type` debe ser uno de los tipos válidos: verb, nomen, adjektiv, artikel, pronomen, adverb, präposition, konjunktion, subjunktion, partikel
   - El orden en el array no importa, pero es recomendable seguir el orden en que aparecen en la frase
   - **Ejemplo completo:** Para "In diesem Zusammenhang":
     ```json
     "components": [
       {"word": "In", "type": "präposition"},
       {"word": "diesem", "type": "pronomen"},
       {"word": "Zusammenhang", "type": "nomen"}
     ]
     ```

### Añadir Verbos Compuestos

1. **Añadir entrada en JSON con campo `parts`:**
   ```json
   {
     "verbo-compuesto": {
       "word": "absagen",
       "translation": "cancelar",
       "sentence": "Ich muss die Veranstaltung absagen.",
       "sentenceTranslation": "Debo cancelar el evento.",
       "parts": ["muss", "ab", "sagen"],
       "verbType": "separable-modal",
       ...
     }
   }
   ```

2. **Marcar todas las partes en el HTML con el mismo ID:**
   ```html
   <p>Ich {expl:verbo-compuesto:muss} die Veranstaltung {expl:verbo-compuesto:ab}{expl:verbo-compuesto:sagen}.</p>
   ```

3. **El sistema automáticamente:**
   - Marca todas las partes visualmente
   - Cualquier parte es clickeable
   - Al hacer click, se abre la misma explicación
   - En la oración, todas las partes se resaltan

### Añadir Nuevos Campos

Para añadir nuevos campos al JSON (ej: "etymology", "usage notes"):

1. **Añadir campo en JSON:**
   ```json
   {
     "palabra": {
       ...
       "etymology": "Origen de la palabra",
       "usageNotes": "Notas de uso"
     }
   }
   ```

2. **Modificar `renderExplanationDetails()`:**
   ```javascript
   if (data.etymology) {
     html += `<div class="explanation-section">
       <p class="explanation-label">Etimología:</p>
       <p>${escapeHtml(data.etymology)}</p>
     </div>`;
   }
   ```

---

## Buenas Prácticas

### IDs en el JSON

- Usar formato kebab-case: `zur-normalitaet-geworden`
- Ser descriptivo pero conciso
- Evitar caracteres especiales
- Mantener consistencia

### Contenido de las Explicaciones

- **Traducción**: Ser precisa y natural en español
- **Explicación**: Incluir contexto y matices
- **Tipo de verbo (verbType)**: Solo para verbos (`type: "verb"`). Se muestra automáticamente en la caja de información. Indica las características del verbo:
  - `"separable"` → Trennbar (separable)
  - `"untrennbar"` o `"inseparable"` → Untrennbar (inseparable)
  - `"modal"` → Modalverb (verbo modal)
  - `"reflexive"` o `"reflexiv"` → Reflexiv (reflexivo)
  - `"auxiliary"` → Mit Hilfsverb (con verbo auxiliar)
  - `"separable-modal"` → Trennbar + Modalverb
  - `"separable-auxiliary"` → Trennbar + Mit Hilfsverb
  - `"reflexive-separable"` → Reflexiv + Trennbar
  - `"compound-auxiliary"` → Zusammengesetzt + Mit Hilfsverb
  - `"compound"` → Zusammengesetzt (compuesto)
- **Ejemplos**: Mostrar usos reales y variados
- **Conjugación**: Solo para verbos, todas las formas relevantes
  - **Formato nuevo**: Tabla con pronombres (ich, du, er/sie/es, wir, ihr, sie/Sie) y tiempos (Präsens, Präteritum, Indirekte Rede)
  - **Indirekte Rede**: Puede ser Konjunktiv I o II, dependiendo del verbo. El sistema no fuerza Konjunktiv I si no es apropiado.
  - **Perfecto e Infinitivo**: Se muestran fuera de la tabla, debajo de ella
- **Sinónimos/Antónimos**: Incluir traducción entre paréntesis
- **Tipo (type)**: Debe coincidir con las categorías de Wortarten para aplicar el color correcto
- **Componentes (components)**: **OBLIGATORIO para todas las phrases** (`type: "phrase"`). Debe contener un array con todos los componentes de la frase, cada uno con su `word` y `type`. Sin este campo, la sección "Componentes:" no aparecerá y las palabras no se colorearán en la explicación

### Estructura de Conjugación con Tabla

La conjugación de verbos se muestra en una **tabla HTML** con diseño claro y organizado. Esta tabla permite visualizar todas las formas verbales de manera sistemática.

#### Características Visuales de la Tabla

**Estructura:**
- **Primera columna**: Pronombres personales (ich, du, er/sie/es, wir, ihr, sie/Sie)
- **Columnas siguientes**: Tiempos verbales (Präsens, Präteritum, Indirekte Rede)
- **Fuera de la tabla**: Perfecto e Infinitivo (mostrados como texto simple debajo de la tabla)

**Diseño:**
- Tabla con bordes redondeados y fondo diferenciado
- Header con fondo más oscuro para destacar los tiempos
- Filas con hover effect para mejor legibilidad
- Estilo consistente con el diseño TELC

**Ejemplo visual:**
```
┌─────────────┬──────────────┬──────────────┬──────────────────┐
│ Person      │ Präsens      │ Präteritum   │ Indirekte Rede   │
├─────────────┼──────────────┼──────────────┼──────────────────┤
│ ich         │ berichte von │ berichtete   │ berichte von     │
│ du          │ berichtest   │ berichtetest │ berichtest von   │
│ er/sie/es   │ berichtet    │ berichtete   │ berichte von     │
│ wir         │ berichten    │ berichteten  │ berichten von    │
│ ihr         │ berichtet    │ berichtetet  │ berichtet von    │
│ sie/Sie    │ berichten    │ berichteten  │ berichten von    │
└─────────────┴──────────────┴──────────────┴──────────────────┘

Perfekt: hat von ... berichtet
Infinitiv: von ... berichten
```

#### Estructura del JSON

```json
"conjugation": {
  "present": {
    "ich": "berichte von",
    "du": "berichtest von",
    "er/sie/es": "berichtet von",
    "wir": "berichten von",
    "ihr": "berichtet von",
    "sie/Sie": "berichten von"
  },
  "preterite": {
    "ich": "berichtete von",
    "du": "berichtetest von",
    "er/sie/es": "berichtete von",
    "wir": "berichteten von",
    "ihr": "berichtetet von",
    "sie/Sie": "berichteten von"
  },
  "perfect": "hat von ... berichtet",
  "infinitive": "von ... berichten"
}
```

#### Reglas y Notas Importantes

**Pronombres:**
- Los pronombres deben usar exactamente las claves: `"ich"`, `"du"`, `"er/sie/es"`, `"wir"`, `"ihr"`, `"sie/Sie"`
- El sistema maneja variantes automáticamente (ej: si no encuentra "sie/Sie", busca "sie" o "Sie")

- Si no está presente, la tabla solo mostrará Präsens y Präteritum

**Perfecto e Infinitivo:**
- Siempre van **fuera de la tabla** como texto simple
- Se muestran en una caja separada debajo de la tabla
- Formato: `"Perfekt: [forma]"` y `"Infinitiv: [forma]"`

**Retrocompatibilidad:**
- El sistema mantiene compatibilidad con el formato antiguo
- Si `present` y `preterite` son strings simples (no objetos), se muestra como lista
- Formato antiguo: `"present": "berichtet von"` (solo 3ra persona)

**Estilos CSS:**
- Clase principal: `.conjugation-table`
- Header: `.conjugation-table thead` (fondo más oscuro)
- Celdas de pronombres: `.conjugation-pronoun` (texto en negrita)
- Sección extra: `.conjugation-extra` (para Perfecto e Infinitivo)

### Marcado en el Texto

- Marcar solo palabras/frases con dudas reales
- No sobrecargar el texto con demasiados marcados
- Usar el ID exacto del JSON
- La palabra marcada debe coincidir con el texto visible

### Principio de Unidad Visual

**Regla fundamental:** Cuando palabras o frases forman una unidad conceptual y aparecen juntas en el texto, deben marcarse como **una sola unidad** en un solo token.

**Objetivo:** Asegurar que visualmente aparezcan como una sola caja resaltada, tanto en el texto principal como en el panel de información.

**Ejemplos correctos:**
```html
<!-- Frase compuesta junta: una sola unidad -->
<p>Damit Online-Veranstaltungen {expl:sinnvoll-sind:sinnvoll sind}, braucht es klare Bedingungen.</p>

<p>Die Didaktik muss {expl:angepasst-werden:angepasst werden}.</p>

<p>Die Kommunikation sollte {expl:verbindlich-organisiert-sein:verbindlich organisiert sein}.</p>
```

**Ejemplos incorrectos (evitar):**
```html
<!-- INCORRECTO: Dos unidades separadas cuando deberían ser una -->
<p>Damit Online-Veranstaltungen {expl:sinnvoll-sind:sinnvoll} {expl:sinnvoll-sind:sind}, braucht es klare Bedingungen.</p>
```

**Cuándo usar una sola unidad:**
- Frases compuestas que aparecen consecutivas: "sinnvoll sind", "angepasst werden", "vorgetragen wird"
- Expresiones fijas que forman un concepto único: "etwa wenn", "nicht zuletzt"
- Verbos con auxiliar cuando el auxiliar y el participio están juntos

**Cuándo usar múltiples tokens (solo para verbos separados):**
- Verbos separables donde las partes están físicamente separadas en la oración
- Ejemplo: `Ich {expl:absagen:muss} die Veranstaltung {expl:absagen:ab}{expl:absagen:sagen}.`
- En estos casos, cada parte se marca por separado pero con el mismo ID

**Resultado visual:**
- ✅ **Correcto:** Una sola caja resaltada para "sinnvoll sind"
- ❌ **Incorrecto:** Dos cajas separadas para "sinnvoll" y "sind" cuando están juntas

### Marcado de Verbos Compuestos

- **Identificar todas las partes**: Verbo auxiliar, prefijo separable, verbo principal, verbo modal
- **Mismo ID para todas las partes**: Todas las partes deben usar el mismo `id` en el HTML
- **Campo `parts` en JSON**: Incluir todas las partes que aparecen separadas en la oración
- **Orden de las partes**: El orden en `parts` no importa, pero debe coincidir con lo que aparece en la oración
- **Ejemplos de tipos**:
  - Verbo separable: `parts: ["ab", "sagen"]`
  - Verbo con auxiliar: `parts: ["ist", "geworden"]`
  - Verbo modal: `parts: ["muss", "gehen"]`
  - Verbo separable + modal: `parts: ["muss", "ab", "sagen"]`

---

## Compatibilidad y Rendimiento

### Navegadores Soportados

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)

### Optimizaciones

- El JSON se carga una sola vez al inicio
- Los tokens se procesan una sola vez
- El panel se muestra/oculta sin recargar
- Animaciones CSS (mejor rendimiento que JS)

### Accesibilidad

- Botón de cerrar con `aria-label`
- Contraste adecuado en todos los elementos
- Navegación por teclado (futuro)
- Screen reader friendly (futuro)

---

## Estructura de Archivos

### Text 1 – Digitale Vorlesungen

```
TELC/WEB/texte/
├── index.html                       (página principal de Texte)
└── text-01/
    ├── text-01.html                 (texto con marcados + leyenda + botón Flashcards + panel de explicación)
    ├── text-01.js                   (lógica de procesamiento de tokens y panel de explicación)
    ├── text-01-explanations.json    (base de datos de explicaciones para Text 1)
    ├── text-01-flashcards.html      (página de flashcards para Text 1)
    └── text-01-flashcards.js        (lógica de flashcards para Text 1)
```

### Text 2 – Hörverstehen mit Orhan

Para el Hörverstehen escrito se replica exactamente la misma estructura modular en una carpeta propia:

```
TELC/WEB/texte/
└── text-02/
    ├── hoerverstehen-01.html            (texto completo de Hörverstehen 1–3, con:
    │                                      - contenedor `#text-content`
    │                                      - contador de palabras
    │                                      - barra con botón "Flashcards"
    │                                      - leyenda de colores "Wortarten – Farben"
    │                                      - panel integrado de explicaciones `#explanation-panel`)
    ├── hoerverstehen-01.js              (misma lógica que `text-01.js`, adaptada para cargar
    │                                      `hoerverstehen-01-explanations.json` y procesar
    │                                      los tokens `{expl:id:palabra}` de este texto)
    ├── hoerverstehen-01-explanations.json  (base de datos de explicaciones específica para este texto;
    │                                         misma estructura que `text-01-explanations.json`)
    ├── hoerverstehen-01-flashcards.html (página de flashcards para el Hörverstehen:
    │                                      usa el mismo diseño y componentes que `text-01-flashcards.html`)
    └── hoerverstehen-01-flashcards.js   (lógica de flashcards:
                                           - carga `hoerverstehen-01-explanations.json`
                                           - construye mazo con todas las entradas que tengan
                                             `word`, `translation`, `sentence`, `sentenceTranslation`
                                           - usa el mismo sistema de colores y highlight que el panel)
```

### Patrón general para nuevos textos

Para cada nuevo texto de Texte/Hörverstehen se recomienda:

```
TELC/WEB/texte/
└── text-XX/
    ├── <slug>.html                  (texto + leyenda + botón Flashcards + panel explicación)
    ├── <slug>.js                    (lógica de tokens + panel explicación)
    ├── <slug>-explanations.json     (base de datos de explicaciones)
    ├── <slug>-flashcards.html       (página de flashcards para ese texto)
    └── <slug>-flashcards.js         (lógica de flashcards basada en el JSON)
```

Donde `<slug>` es un identificador corto y consistente del texto (por ejemplo `text-01`, `hoerverstehen-01`, etc.).

---

## Ejemplo de Uso Completo

### 1. HTML

```html
<p>Die {expl:hemmschwelle:Hemmschwelle}, einfach die Kamera auszuschalten, ist niedrig.</p>
```

### 2. JSON

```json
{
  "hemmschwelle": {
    "word": "Hemmschwelle",
    "translation": "barrera psicológica, inhibición",
    "sentence": "Die Hemmschwelle, einfach die Kamera auszuschalten, ist niedrig.",
    "sentenceTranslation": "La barrera para simplemente apagar la cámara es baja.",
    "explanation": "Sustantivo femenino. Literalmente el 'umbral' a partir del cual te animas a hacer algo.",
    "examples": ["Ejemplo 1", "Ejemplo 2"],
    "type": "noun"
  }
}
```

### 3. Resultado

- La palabra "Hemmschwelle" aparece marcada en rojo
- Al hacer click, se abre el panel con toda la información
- El usuario puede leer la explicación, ejemplos, etc.
- Puede cerrar el panel haciendo click en × o fuera del panel

---

## Referencias

- **Archivo de estilos:** `TELC/WEB/styles.css` (sección "Explanation System Styles")
- **Archivo JavaScript:** `TELC/WEB/texte/text-01.js`
- **Archivo JSON:** `TELC/WEB/texte/text-01-explanations.json`
- **Documentación de diseño:** `TELC/Indicaciones/disenno estandar.md`

---

---

## Estándar de Colores por Tipo de Palabra

### Principio Fundamental

**IMPORTANTE - Regla de clasificación:**

**`type: "phrase"`** se usa **SOLO** cuando la palabra o expresión está compuesta de **MÚLTIPLES tipos diferentes** de palabras (Wortarten).

**Si TODOS los componentes son del mismo tipo**, se usa ese tipo específico:
- Todos verbos → `type: "verb"` (color verde esmeralda de verbo)
- Todos sustantivos → `type: "nomen"` (color azul de sustantivo)
- Todos adjetivos → `type: "adjektiv"` (color naranja de adjetivo)
- Mezcla de tipos → `type: "phrase"` (color rojo estándar)

**Ejemplos:**
- ✅ `"sich treffen"` → `type: "verb"` (solo verbos)
- ✅ `"angepasst werden"` → `type: "verb"` (solo verbos)
- ✅ `"im Vordergrund stehen"` → `type: "verb"` (solo verbo)
- ❌ `"vor Ort arbeiten"` → `type: "phrase"` (adverbio + verbo = múltiples tipos)
- ❌ `"bei denen"` → `type: "phrase"` (preposición + pronombre = múltiples tipos)

### Tabla de Colores Completos

| Wortart | Tipo (type) | Color | Clase CSS | RGB Background | RGB Border | Color Texto |
|---------|-------------|-------|-----------|----------------|------------|-------------|
| **Verb** | `verb` | Verde esmeralda | `.explanation-word-verb` | `rgba(46, 204, 113, 0.24)` | `rgba(46, 204, 113, 0.75)` | `#d4f4e0` |
| **Nomen** | `nomen` o `noun` | Azul | `.explanation-word-nomen` | `rgba(93, 173, 255, 0.25)` | `rgba(93, 173, 255, 0.7)` | `#d7e9ff` |
| **Adjektiv** | `adjektiv` o `adjective` | Naranja | `.explanation-word-adj` | `rgba(255, 168, 104, 0.24)` | `rgba(255, 168, 104, 0.75)` | `#ffd7b9` |
| **Artikel** | `artikel` o `article` | Verde claro | `.explanation-word-artikel` | `rgba(91, 201, 152, 0.22)` | `rgba(91, 201, 152, 0.75)` | `#c9f4e3` |
| **Pronomen** | `pronomen` o `pronoun` | Púrpura | `.explanation-word-pronomen` | `rgba(177, 140, 255, 0.24)` | `rgba(177, 140, 255, 0.75)` | `#efe2ff` |
| **Adverb** | `adverb` | Turquesa | `.explanation-word-adverb` | `rgba(92, 203, 191, 0.24)` | `rgba(92, 203, 191, 0.75)` | `#d8fff6` |
| **Präposition** | `präposition` o `preposition` | Rosa | `.explanation-word-praeposition` | `rgba(255, 126, 189, 0.26)` | `rgba(255, 126, 189, 0.75)` | `#ffe0f1` |
| **Konjunktion** | `konjunktion` o `conjunction` | Amarillo | `.explanation-word-konjunktion` | `rgba(244, 191, 72, 0.26)` | `rgba(244, 191, 72, 0.75)` | `#ffe8b5` |
| **Subjunktion** | `subjunktion` o `subjunction` | Verde azulado | `.explanation-word-subjunktion` | `rgba(70, 200, 200, 0.24)` | `rgba(70, 200, 200, 0.75)` | `#b8f0f0` |
| **Partikel** | `partikel` o `particle` | Gris | `.explanation-word-partikel` | `rgba(158, 158, 158, 0.22)` | `rgba(158, 158, 158, 0.55)` | `#ececec` |
| **Compuestas** | `phrase`, `compound`, `verb-preposition`, etc. | Rojo estándar | `.explanation-word-default` | `rgba(255, 84, 84, 0.15)` | `rgba(255, 84, 84, 0.6)` | `#ffd6d6` |

### Cómo Aplicar los Colores

El sistema aplica automáticamente los colores basándose en el campo `type` del JSON:

```json
{
  "palabra": {
    "word": "lernen",
    "type": "verb",  // ← Esto determina el color
    ...
  }
}
```

**Reglas de aplicación:**
1. Si `type` es exactamente uno de los tipos simples (verb, nomen, adjektiv, etc.), se aplica el color específico de ese tipo
2. Si `type` es exactamente `"phrase"` o `"compound"` (sin tipo específico), se aplica el color rojo estándar
3. **IMPORTANTE:** Los guiones en el ID (ej: `"zur-normalitaet-geworden"`) NO afectan el color. Solo el campo `type` determina el color.
4. Si todos los componentes de una expresión son del mismo tipo (ej: solo verbos), debe usar ese tipo específico, NO `"phrase"`
5. El sistema acepta tanto nombres en alemán como en inglés (ej: `verb` o `Verb`, `nomen` o `noun`)
6. Los colores se aplican tanto en el texto principal (palabras marcadas) como en el panel de explicación (resaltado de la oración)

### Ejemplos de Colores Aplicados

**Verbo:**
```json
{
  "lernen": {
    "type": "verb"
  }
}
```
→ Color: **Verde esmeralda** (`.explanation-word-verb`)

**Sustantivo:**
```json
{
  "hemmschwelle": {
    "type": "nomen"
  }
}
```
→ Color: **Azul** (`.explanation-word-nomen`)

**Adverbio:**
```json
{
  "spaetestens": {
    "type": "adverb"
  }
}
```
→ Color: **Turquesa** (`.explanation-word-adverb`)

**Frase compuesta:**
```json
{
  "zur-normalitaet-geworden": {
    "type": "phrase"
  }
}
```
→ Color: **Rojo estándar** (`.explanation-word-default`)

### Función `getWordTypeClass()` y `getHighlightClass()`

El JavaScript incluye funciones que mapean el tipo a la clase CSS correspondiente:

```javascript
function getWordTypeClass(data) {
  if (!data || !data.type) return 'explanation-word-default';
  
  const type = data.type.toLowerCase();
  
  // IMPORTANTE: "phrase" solo se usa para palabras compuestas de MÚLTIPLES tipos diferentes
  // Si todos los componentes son del mismo tipo (ej: solo verbos), debe usar ese tipo específico
  // Ejemplo: "sich treffen" (solo verbos) → type: "verb", NO "phrase"
  // Ejemplo: "vor Ort arbeiten" (verbo + adverbio) → type: "phrase" (múltiples tipos)
  
  // Solo "phrase" y "compound" (sin tipo específico) usan el color estándar rojo
  // NO tratamos los guiones como indicador de frase compuesta
  if (type === 'phrase' || type === 'compound') {
    return 'explanation-word-default';
  }
  
  // Mapeo de tipos a clases CSS
  const typeMap = {
    'verb': 'explanation-word-verb',
    'nomen': 'explanation-word-nomen',
    'noun': 'explanation-word-nomen',
    // ... etc
  };
  
  return typeMap[type] || 'explanation-word-default';
}
```

**Lógica importante:**
- La función `getWordTypeClass()` se usa para el texto principal
- La función `getHighlightClass()` se usa para el panel de información
- Ambas funciones siguen la misma lógica: solo `type: "phrase"` o `type: "compound"` usan el color rojo estándar
- Los guiones en el ID (ej: `"zur-normalitaet-geworden"`) NO afectan el color, solo el campo `type`
- Si `type: "verb"`, siempre se aplica el color verde esmeralda de verbo, independientemente de si es un verbo simple o compuesto

---

**Última actualización:** Diciembre 2024  
**Versión:** 2.0 (con sistema de colores por Wortart)
