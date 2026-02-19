# Guía completa para crear un nuevo Modelltest TELC C1 Hochschule

> Esta guía documenta **todo** lo necesario para crear un Modelltest a partir de la carpeta `_vorlage/` (plantilla). Los HTML usan **SectionBuilder** para generar todo el boilerplate — solo necesitas rellenar los `<!-- TODO -->` con contenido y las respuestas correctas. **NUNCA crear archivos desde cero** — siempre copiar `_vorlage/`.

---

## Tabla de contenidos

1. [Resumen del examen TELC C1 Hochschule](#1-resumen-del-examen-telc-c1-hochschule)
2. [Estructura de puntos y calificación](#2-estructura-de-puntos-y-calificación)
3. [Archivos que debes editar por Modelltest](#3-archivos-que-debes-editar-por-modelltest)
   - 3.1: exam.html — El archivo más importante y peligroso
   - 3.2: Consistencia de datos — CRÍTICO
4. [Instrucciones por sección (con longitudes exactas)](#4-instrucciones-por-sección)
   - 4.1–4.9: Cada sección del examen
   - 4.10: **Teil 1B — Zusammenfassung** (relación con Teil 1A y praesentation-texte.js)
   - 4.11: Teil 2 — Diskussion
5. [Formato de exam-data.js](#5-formato-de-exam-datajs)
6. [Formato de praesentation-texte.js](#6-formato-de-praesentation-textejs)
   - 6.1: [Hörverstehen Transkripte](#61-hörverstehen-transkripte) (campo `hvTranskript` en exam-data.js)
7. [Temas TELC C1 Hochschule — Catálogo completo](#7-temas-típicos-telc-c1-hochschule--catálogo-completo)
   - 7.1: Los 15 campos temáticos generales
   - 7.2: Temas concretos por campo (~150 temas)
   - 7.3: Qué temas van en qué sección
   - 7.4: Pool de autores para citas
   - 7.5: Temas para Schriftlicher Ausdruck
   - 7.6: Temas para Mündliche Präsentation
8. [Checklist final](#8-checklist-final)

---

## 1. Resumen del examen TELC C1 Hochschule

| Parte | Tiempo | Descripción |
|-------|--------|-------------|
| **Leseverstehen** (Leer) | 90 min | 3 partes + Sprachbausteine |
| **Pausa** | 20 min | |
| **Hörverstehen** (Escuchar) | ~45 min | 3 partes |
| **Schriftlicher Ausdruck** (Escribir) | 70 min | 1 ensayo |
| **Mündliche Prüfung** (Hablar) | ~16 min + 20 min prep | 3 partes |

**Total posible:** 214 puntos

### Requisitos para aprobar

| Criterio | Mínimo |
|----------|--------|
| Puntuación total | ≥ 128 puntos |
| Prueba escrita (LV + SB + HV + SA) | ≥ 99 puntos (60% de 166) |
| Prueba oral (MP) | ≥ 29 puntos (60% de 48) |

### Escala de notas

| Nota | Puntos |
|------|--------|
| Sehr gut (Muy bien) | 193–214 |
| Gut (Bien) | 172–192 |
| Befriedigend (Satisfactorio) | 151–171 |
| Ausreichend (Suficiente) | 128–150 |
| Nicht bestanden (No aprobado) | < 128 |

---

## 2. Estructura de puntos y calificación

### Secciones con corrección automática (118 puntos)

| Sección | Preguntas | Puntos por pregunta | Total |
|---------|-----------|--------------------:|------:|
| **LV Teil 1** (Textrekonstruktion) | 1–6 | 2 pts c/u | **12** |
| **LV Teil 2** (Selektives Verstehen) | 7–12 | 2 pts c/u | **12** |
| **LV Teil 3** (Detailverstehen) | 13–24 (11 aussagen + 1 global) | 2 pts c/u | **24** |
| **Sprachbausteine** | 25–47 (23 preguntas) | 1 pt c/u (máx 22) | **22** |
| **HV Teil 1** (Globalverstehen) | 47–54 (8 sprecher) | 1 pt c/u | **8** |
| **HV Teil 2** (Detailverstehen) | 55–64 (10 preguntas) | 2 pts c/u | **20** |
| **HV Teil 3** (Informationstransfer) | 65–74 (variable sub-items) | 1–2 pts c/u | **20** |

### Secciones con evaluación IA (96 puntos)

**Schriftlicher Ausdruck — 48 puntos:**
- Aufgabengerechtheit (Adecuación): 0–12
- Korrektheit (Corrección): 0–12
- Repertoire (Repertorio lingüístico): 0–12
- Kommunikative Gestaltung (Diseño comunicativo): 0–12

**Mündliche Prüfung — 48 puntos:**
- Präsentation (Teil 1A): 0–6 pts
- Zusammenfassung (Teil 1B): 0–4 pts
- Diskussion (Teil 2): 0–6 pts
- Flüssigkeit: 0–8 pts
- Repertoire: 0–8 pts
- Grammatische Richtigkeit: 0–8 pts
- Aussprache und Intonation: 0–8 pts

---

## 3. Archivos que debes editar por Modelltest

### Paso 1: Copiar la plantilla

```bash
cp -r _vorlage/ modell-N/
```

Luego reemplazar `N` por el número del modell en todos los archivos (títulos, h1, data-modell).

### Paso 2: Entender la arquitectura

Cada HTML usa **SectionBuilder** (`shared/section-builders.js`), que genera automáticamente toda la estructura repetitiva. Los archivos HTML solo contienen los **datos únicos** dentro de `<div data-content="..." hidden>`.

La plantilla `_vorlage/` ya tiene la estructura correcta con marcadores `<!-- TODO -->`. Solo hay que rellenar el contenido.

### Los 15 archivos por Modelltest

| Archivo | Qué rellenar |
|---------|-------------|
| `index.html` | Solo cambiar `N` por el número del modell (3 lugares: title, h1, link exam.html) |
| `exam.html` | Cambiar `N` + rellenar SA themes + presentation themes + diskussion quotes (ver sección 3.1) |
| `1-leseverstehen-teil-1.html` | `data-content="text"`: título + texto con lücken; `data-content="options"`: 9 oraciones (a–h, z) |
| `1-leseverstehen-teil-2.html` | `data-content="text"`: título + 5 absätze; `data-content="fragen"`: 6 preguntas |
| `1-leseverstehen-teil-3.html` | `data-content="text"`: título + texto largo; `data-content="aussagen"`: 11 enunciados; `data-content="global"`: 3 opciones |
| `2-sprachbausteine.html` | `data-content="text"`: título + texto con 23 lücken; `data-content="optionen"`: 23 grupos × 4 opciones |
| `3-hoerverstehen-teil-1.html` | `data-content="thema"`: tema; `data-content="aussagen"`: 10 aussagen (a–j) |
| `3-hoerverstehen-teil-2.html` | `data-content="thema"`: tema; `data-content="fragen"`: 10 preguntas con stem + 3 opciones |
| `3-hoerverstehen-teil-3.html` | `data-content="thema"`: tema; `data-content="slides"`: 6–7 slide-box divs con inputs |
| `4-schriftlicher-ausdruck.html` | `data-content="themen"`: 2 temas con 2 citas c/u |
| `5-muendlich-praesentation.html` | `data-content="teilnehmer"`: 3 bloques de temas; `data-content="select"`: opciones dropdown |
| `5-muendlich-zusammenfassung.html` | `data-content="themen"`: botones con nombres de temas de Teil 1A |
| `5-muendlich-diskussion.html` | `data-content="zitate"`: 4 citas completas; `data-content="simulation"`: 4 cajas cortas |
| `exam-data.js` | Respuestas correctas + hvTranskript + temas SA + citas diskussion |
| `praesentation-texte.js` | 6 textos de presentación (~350–400 palabras c/u, con `text` y `html`) |

### 3.1 exam.html — El archivo más importante y peligroso

`exam.html` es el examen simulado completo (~340 líneas). La plantilla ya está lista. Lo que SÍ hay que cambiar:

| Zona del archivo | Qué cambiar | Marcado con |
|------------------|-------------|-------------|
| `<title>`, `<h1>`, `<p class="subtitle">` | Número del modell `N` | `<!-- TODO: Cambiar N -->` |
| `screen-diskussion-ready` | 4 citas de diskussion | `<!-- TODO: 4 citas -->` |
| `tab-sa` (`.themen-container`) | 2 temas SA con citas | `<!-- TODO: 2 temas -->` |
| `tab-vorbereitung` (`.themen-container`) | 6 temas de präsentation (A1,A2,B1,B2,C1,C2) | `<!-- TODO: 3 Teilnehmer -->` |

Lo que **NO** hay que cambiar en exam.html:
- Exam bar, tabs, timer, buttons
- Screens: start, break, hv-ready, muendlich-ready, zusammenfassung-ready
- Tab panels: praesentation, zusammenfassung, diskussion (son genéricos)
- Tab panels: lv1–hv3 (se llenan automáticamente via fetch)
- Scripts al final
- Cualquier `id=""` attribute

### 3.2 Consistencia de datos — CRÍTICO

Algunos datos aparecen en **múltiples archivos** y DEBEN ser idénticos. Si no coinciden, el examen se rompe:

| Dato | Archivos donde aparece | Consecuencia de inconsistencia |
|------|------------------------|-------------------------------|
| **SA themes + citas** | `4-schriftlicher-ausdruck.html` + `exam.html` (tab-sa) + `exam-data.js` (saThemen) | Temas diferentes en standalone vs examen; copy-to-AI copia cita incorrecta |
| **6 presentation themes** | `5-muendlich-praesentation.html` + `exam.html` (tab-vorbereitung) + `exam-data.js` (themaTexte) + `praesentation-texte.js` (claves a1–c2) + `5-muendlich-zusammenfassung.html` (botones) | Botones no coinciden con textos; zusammenfassung muestra tema equivocado |
| **4 diskussion citas** | `5-muendlich-diskussion.html` (zitate + simulation) + `exam.html` (screen-diskussion-ready) + `exam-data.js` (diskussionZitate) | Citas diferentes en standalone vs examen |
| **Respuestas correctas** | `Pruefung.initXXX()` en cada HTML standalone + `exam-data.js` (correct) | Standalone da respuesta diferente al examen simulado |

**Workflow recomendado para evitar inconsistencias:**
1. Primero crear todo el contenido (textos, temas, citas, respuestas) en un documento separado
2. Rellenar `exam-data.js` primero (fuente de verdad)
3. Copiar los mismos datos a los HTML standalone y a exam.html
4. Verificar con la checklist de la sección 8

### Lo que NO debes tocar

- **Nada en `shared/`** — `pruefung.js`, `pruefung.css`, `section-builders.js`, `exam-engine.js`, `exam.css`
- **Estructura HTML fuera de `<div data-content>`** — el builder genera todo lo demás
- **IDs de elementos** — `section-root`, `exam-bar`, `screen-start`, etc. son usados por JS
- **Orden de `<script>` tags** — el orden importa (especialmente `praesentation-texte.js` ANTES de los shared scripts en zusammenfassung.html)
- **Clases CSS** — `luecke` (LV1), `lucke` (SB), `absatz`, `slide-box`, `zitat-box`, etc.

### Funcionalidades automáticas (generadas por shared/)

Estas features se generan automáticamente sin necesidad de cambiar nada por Modelltest:

- **Navegación entre secciones** — `section-builders.js` genera links prev/next y "← Modellprüfung" usando `data-section` del `<main>`.
- **Botón "Transkript kopieren"** — `exam-engine.js` inyecta automáticamente un botón en `screen-hv-ready` que copia el `hvTranskript`. Si es placeholder (`/* TODO */`), el botón aparece deshabilitado.
- **Botón "Alle Prüfungen"** — `exam-engine.js` genera un link de vuelta a `pruefungen/index.html` en la pantalla de resultados.

---

## 4. Instrucciones por sección

### 4.1 Leseverstehen Teil 1 — Textrekonstruktion

**Tipo:** Texto académico con 6 huecos. Se asignan oraciones (a–h) a los huecos (1–6). Sobran 2 oraciones.

**Longitudes de referencia (Modell 1 — "Vom Abakus bis zur Z3"):**

| Elemento | Palabras aprox. |
|----------|----------------:|
| Texto completo (sin opciones) | **~250** |
| Párrafo 1 (con Lücke 0, 1) | ~40 |
| Párrafo 2 + subtítulo (con Lücke 2, 3) | ~55 |
| Párrafo 3 (con Lücke 4, 5) | ~85 |
| Párrafo 4 + subtítulo (con Lücke 6) | ~70 |
| Cada opción (a–h) | ~10–25 |

**Estructura del archivo** (`data-section="lv1"`):

```html
<main class="pruefung-container" id="section-root" data-section="lv1" data-modell="N">

  <div data-content="text" hidden>
    <h3>Título del Texto</h3>
    <p>Primer párrafo con <span class="luecke">0</span> y <span class="luecke">1</span></p>
    <h4>Subtítulo</h4>
    <p>Segundo párrafo con <span class="luecke">2</span> y <span class="luecke">3</span></p>
    <!-- más párrafos con Lücken 4, 5, 6 -->
  </div>

  <div data-content="options" hidden>
    <div data-key="a">Oración que podría ir en algún hueco.</div>
    <div data-key="b">Otra oración posible.</div>
    <!-- c, d, e, f, g, h -->
    <div data-key="z">Oración de ejemplo para Lücke 0. <strong>(Beispiel für Lücke 0)</strong></div>
  </div>

</main>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.lv1(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initLV1({ 1:'g', 2:'e', 3:'a', 4:'b', 5:'h', 6:'d' });
</script>
```

**Reglas del contenido:**
- El texto debe ser académico/científico (nivel C1 Hochschule)
- Debe tener subtítulos (`<h4>`) para dividir el texto
- Las oraciones a–h deben ser gramaticalmente coherentes con el texto
- 2 oraciones son distractores (no encajan en ningún hueco)
- La opción `z` es siempre el ejemplo para la Lücke 0

**Claves para crear buen contenido LV1:**
- El texto debe tener estructura **lineal/cronológica** clara (ej: historia de un invento, evolución de un concepto)
- Cada oración-hueco debe ser un **puente lógico** entre ideas — al quitarla, el texto pierde conexión
- Los 2 distractores deben ser temáticamente plausibles pero gramaticalmente o semánticamente incompatibles con los huecos restantes
- Estrategia del estudiante: lee todo primero, busca señales (pronombres, conectores, campos semánticos). Las oraciones deben recompensar esa lectura atenta

---

### 4.2 Leseverstehen Teil 2 — Selektives Verstehen

**Tipo:** Texto largo dividido en 5 párrafos (a–e). 6 preguntas tipo "In welchem Abschnitt…" con respuesta a–e. Cada párrafo puede responder varias preguntas.

**Longitudes de referencia (Modell 1 — "Seniorenstudium"):**

| Elemento | Palabras aprox. |
|----------|----------------:|
| **Texto total** (5 absätze) | **~700** |
| Absatz a | ~200 |
| Absatz b | ~120 |
| Absatz c | ~175 |
| Absatz d | ~110 |
| Absatz e | ~100 |
| Cada pregunta | ~5–10 |

**Estructura del archivo** (`data-section="lv2"`):

```html
<main class="pruefung-container" id="section-root" data-section="lv2" data-modell="N">

  <div data-content="text" hidden>
    <h3>Título del Texto</h3>
    <div class="absatz">
      <span class="absatz-label">Absatz a</span>
      <p>Texto completo del párrafo a...</p>
    </div>
    <div class="absatz">
      <span class="absatz-label">Absatz b</span>
      <p>Texto completo del párrafo b...</p>
    </div>
    <!-- absatz c, d, e -->
  </div>

  <div data-content="fragen" hidden>
    <div data-frage="7">… drückt sich der Autor polemisch aus?</div>
    <div data-frage="8">… gibt der Autor eine Empfehlung?</div>
    <!-- preguntas 9–12 -->
  </div>

</main>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.lv2(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initLV2({ 7:'a', 8:'d', 9:'c', 10:'a', 11:'d', 12:'e' });
</script>
```

**Reglas del contenido:**
- Las preguntas son sobre funciones comunicativas (ironía, recomendación, pronóstico, advertencia, cita, humor, etc.)
- Cada párrafo debe tener un tono/función diferente
- El texto debe ser opinativo/argumentativo (no puramente informativo)

**Claves para crear buen contenido LV2:**
- Cada párrafo debe tener una **función comunicativa diferenciada**: polémica, ironía, recomendación explícita, pronóstico, advertencia, cita de experto, humor, queja, defensa, etc.
- Las preguntas siguen el formato "In welchem Abschnitt..." — deben referirse a funciones, NO a datos concretos
- Un párrafo puede responder varias preguntas (ej: un párrafo irónico que también contiene una advertencia)
- Ejemplos de funciones comunicativas para preguntas: *drückt sich polemisch aus, gibt eine Empfehlung, macht einen Vorschlag, weist auf eine Gefahr hin, zitiert eine Studie, stellt eine Prognose auf, verwendet Ironie*

---

### 4.3 Leseverstehen Teil 3 — Detailverstehen

**Tipo:** Texto largo. 11 afirmaciones (richtig/falsch/nicht im Text) + 1 pregunta de comprensión global (a/b/c).

**Longitudes de referencia (Modell 1 — "Sprachbad im Kindergarten"):**

| Elemento | Palabras aprox. |
|----------|----------------:|
| **Texto total** (12 párrafos) | **~1100** |
| Einleitung (cursiva) | ~30 |
| Párrafos del cuerpo | ~80–130 cada uno |
| Cada Aussage (13–23) | ~10–20 |
| Pregunta global (24) | 3 opciones de título |

**Estructura del archivo** (`data-section="lv3"`):

```html
<main class="pruefung-container" id="section-root" data-section="lv3" data-modell="N">

  <div data-content="text" hidden>
    <h3>„Sprachbad" im Kindergarten</h3>
    <p><em>Introducción en cursiva (opcional).</em></p>
    <p>Primer párrafo...</p>
    <p>Segundo párrafo...</p>
    <!-- más párrafos -->
  </div>

  <div data-content="aussagen" hidden>
    <div data-aussage="13">Immersion ist eine Methode zur Förderung der zweiten Muttersprache.</div>
    <div data-aussage="14">Die Kinder singen auch deutsche Lieder.</div>
    <!-- aussagen 15–23 -->
  </div>

  <div data-content="global" hidden>
    <div data-option="a">Fremdsprachenunterricht in deutschen Kindergärten</div>
    <div data-option="b">„Sprachbad" im Kindergarten</div>
    <div data-option="c">Der Begriff der Immersion</div>
  </div>

</main>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.lv3(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initLV3({
    13:'falsch', 14:'nicht', 15:'richtig', 16:'nicht', 17:'falsch', 18:'nicht',
    19:'falsch', 20:'richtig', 21:'falsch', 22:'nicht', 23:'falsch', 24:'b'
  });
</script>
```

**Reglas del contenido:**
- El texto debe ser informativo/periodístico/académico
- Mezcla equilibrada: ~4 richtig, ~4 falsch, ~3 nicht im Text
- Las afirmaciones "nicht im Text" deben ser plausibles pero no mencionadas
- La opción de título correcta debe reflejar la idea central (no parcial)

**Claves para crear buen contenido LV3:**
- **richtig**: La afirmación reformula algo del texto con sinónimos — nunca copia exacta
- **falsch**: La afirmación contradice algo del texto (dato cambiado, relación invertida, cuantificación alterada). El estudiante debe detectar la diferencia sutil
- **nicht im Text**: El tema es plausible y relacionado, pero simplemente **no se menciona** en el texto. No es falso — es ausente. Esta distinción es la trampa principal
- Las afirmaciones deben seguir aproximadamente el **orden del texto** (Aussage 13 → primeros párrafos, Aussage 23 → últimos párrafos)
- La pregunta global (24) ofrece 3 títulos: uno demasiado específico, uno demasiado general/tangencial, y el correcto que captura la idea central

---

### 4.4 Sprachbausteine — Grammatik und Lexik

**Tipo:** Texto con 23 huecos (numerados 25–47). Cada hueco tiene 4 opciones (a/b/c/d). Evalúa gramática y vocabulario.

**Longitudes de referencia (Modell 1 — "Neue Ergebnisse aus der Altersforschung"):**

| Elemento | Palabras aprox. |
|----------|----------------:|
| **Texto total** (7 párrafos, sin contar huecos) | **~250** |
| Opciones por hueco | 1–4 palabras c/u |

**Estructura del archivo** (`data-section="sb"`):

```html
<main class="pruefung-container" id="section-root" data-section="sb" data-modell="N">

  <div data-content="text" hidden>
    <h3>Título del texto</h3>
    <p>Texto <span class="lucke" data-lucke="25">____</span> más texto
    <span class="lucke" data-lucke="26">____</span> continúa...</p>
    <!-- más párrafos con Lücken hasta 47 -->
  </div>

  <div data-content="optionen" hidden>
    <div data-lucke="25">
      <span data-wert="a">an</span>
      <span data-wert="b">bei</span>
      <span data-wert="c">durch</span>
      <span data-wert="d">fest</span>
    </div>
    <div data-lucke="26">
      <span data-wert="a">opción a</span>
      <span data-wert="b">opción b</span>
      <span data-wert="c">opción c</span>
      <span data-wert="d">opción d</span>
    </div>
    <!-- div por cada Lücke 27–47 -->
  </div>

</main>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.sb(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initSB({
    25:'a',26:'d',27:'a',28:'b',29:'d',30:'d',31:'a',32:'b',33:'a',34:'a',
    35:'c',36:'c',37:'b',38:'c',39:'d',40:'c',41:'c',42:'c',43:'d',44:'d',
    45:'a',46:'c',47:'a'
  });
</script>
```

**Tipos de gramática que se evalúan:**
- Preposiciones (an, bei, auf, für, mit, trotz, wegen...)
- Orden de palabras (posición del verbo, Adjektivdeklination)
- Konjunktiv I/II (sei, wäre, würde, könnte...)
- Temporale Konnektoren (während, nachdem, indem, seitdem...)
- Wortbildung (vermutlich vs. vermeintlich vs. vermeidlich...)
- Artikelgebrauch y Kasusendungen
- Präpositionalphrasen idiomáticas (zum Trotz, zufolge, Angaben nach...)

**Categorías adicionales de SB (de los tips):**
- **Feste Verb-Präposition-Verbindungen:** sich beschäftigen mit, verfügen über, beitragen zu, hinweisen auf
- **Funktionsverbgefüge:** in Betracht ziehen, zur Verfügung stellen, in Anspruch nehmen
- **Kollokationen:** eine Rolle spielen, Einfluss ausüben, Rücksicht nehmen
- **Relativpronomen/Relativsätze:** derer, deren, wessen, wobei, worauf
- **Partizipialkonstruktionen:** die oben erwähnte Studie, die sich daraus ergebenden Folgen
- **Modalpartikeln/Abtönungspartikeln en contexto académico**

**Claves para crear buen contenido SB:**
- El texto debe ser coherente y legible también SIN los huecos (como texto real)
- Cada hueco debe tener **exactamente 1 opción correcta** — las otras 3 suenan plausibles pero fallan gramaticalmente o semánticamente
- Variar categorías gramaticales: no poner 10 preposiciones seguidas. Mezclar preposiciones, conectores, verbos, Konjunktiv, etc.
- Las opciones incorrectas deben ser del mismo tipo (si la correcta es una preposición, las 3 incorrectas también deben ser preposiciones)

---

### 4.5 Hörverstehen Teil 1 — Globalverstehen

**Tipo:** 8 hablantes cortos sobre un tema. Asignar afirmaciones (a–j) a hablantes (1–8). Sobran 2 afirmaciones. Se escucha **una sola vez**.

**Longitudes de referencia (Modell 1 — "Studentische Lebensformen"):**

| Elemento | Palabras aprox. |
|----------|----------------:|
| Tema (título) | 2–5 |
| Cada Aussage (a–j) | **~10–20** |
| Total: 10 aussagen | ~130 |

**Estructura del archivo** (`data-section="hv1"`):

```html
<main class="pruefung-container" id="section-root" data-section="hv1" data-modell="N">

  <div data-content="thema" hidden>Studentische Lebensformen</div>

  <div data-content="aussagen" hidden>
    <div data-key="a">Viele Studierende wohnen lieber allein, obwohl es relativ teuer ist.</div>
    <div data-key="b">Für mich gehört es dazu, mit anderen zusammenzuwohnen.</div>
    <!-- c, d, e, f, g, h, i, j -->
  </div>

</main>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.hv1(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initHV1({ 47:'g', 48:'f', 49:'c', 50:'i', 51:'b', 52:'d', 53:'h', 54:'j' });
</script>
```

> **Nota:** Los números de pregunta son 47–54 (Sprecher 1 = Aufgabe 47, etc.)

**Claves para crear buen contenido HV1:**
- Los 8 hablantes dan **opiniones personales** sobre un tema amplio (ej: formas de vivienda estudiantil, uso de tecnología, experiencias universitarias)
- Cada hablante dura ~30-60 seg. y expresa **una posición clara** que se puede resumir en una afirmación
- Las 10 afirmaciones (a–j) deben ser reformulaciones con sinónimos, NO copias literales de lo que dicen
- Los 2 distractores sobrantes deben ser temáticamente plausibles (sobre el mismo tema) pero no coincidir con ningún hablante
- Estrategia del estudiante: leer todas las afirmaciones primero, luego escuchar. Las afirmaciones deben recompensar esa pre-lectura

---

### 4.6 Hörverstehen Teil 2 — Detailverstehen

**Tipo:** Entrevista/Radiosendung. 10 preguntas (55–64) con 3 opciones (a/b/c). Se escucha **una sola vez**.

**Longitudes de referencia (Modell 1 — "Interview Prof. Beutelspacher"):**

| Elemento | Palabras aprox. |
|----------|----------------:|
| Cada pregunta (stem) | ~5–10 |
| Cada opción (a/b/c) | ~8–15 |

**Estructura del archivo** (`data-section="hv2"`):

```html
<main class="pruefung-container" id="section-root" data-section="hv2" data-modell="N">

  <div data-content="thema" hidden>Interview zum Jahr der Mathematik mit Prof. Beutelspacher</div>

  <div data-content="fragen" hidden>
    <div data-frage="55">
      <div class="stem">Herr Beutelspacher ist</div>
      <div data-wert="a">begeistert, wenn er die Lösung begreift.</div>
      <div data-wert="b">fasziniert von Menschen, die verstehen.</div>
      <div data-wert="c">glücklich, wenn er Mathematik erklären kann.</div>
    </div>
    <div data-frage="56">
      <div class="stem">Ein Fünfeck</div>
      <div data-wert="a">gelingt ihm nur selten spontan.</div>
      <div data-wert="b">ist ohne Hilfsmittel einfach zu konstruieren.</div>
      <div data-wert="c">kann jeder freihändig zeichnen.</div>
    </div>
    <!-- preguntas 57–64 con misma estructura -->
  </div>

</main>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.hv2(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initHV2({ 55:'a', 56:'a', 57:'a', 58:'c', 59:'b', 60:'a', 61:'a', 62:'a', 63:'b', 64:'c' });
</script>
```

**Claves para crear buen contenido HV2:**
- Formato: **entrevista o reportaje radiofónico** con un experto sobre un tema específico
- Las preguntas siguen el **orden cronológico** del audio — pregunta 55 sobre el inicio, pregunta 64 sobre el final
- Cada pregunta tiene 3 opciones: una correcta, una que **contradice** lo dicho, y una que **distorsiona** o **no se menciona**
- Las opciones incorrectas deben usar vocabulario del audio para crear confusión (sinónimos engañosos)
- Las preguntas deben requerir **comprensión de detalle** — no bastan impresiones generales

---

### 4.7 Hörverstehen Teil 3 — Informationstransfer

**Tipo:** Vortrag/conferencia académica. El estudiante tiene folien/slides con información faltante. Rellenar 10 lücken (65–74) con palabras clave. Se escucha **una sola vez**.

**Longitudes de referencia (Modell 1 — "Literatur im Unterricht DaF"):**

| Elemento | Descripción |
|----------|-------------|
| Slides/Folien | 6–7 slides con estructura de lista/bullets |
| Lücken | 10 campos de texto (algunos divididos en a/b) |
| Respuestas | Keywords (1–3 palabras), evaluadas con keyword matching |

**Estructura de puntos HV3 (detalle):**

| Pregunta | Puntos |
|----------|-------:|
| 65, 66, 69, 72, 73, 74 | 2 pts c/u |
| 67a, 67b, 68a, 68b, 70a, 70b, 71a, 71b | 1 pt c/u |
| **Total** | **20 pts** |

**Estructura del archivo** (`data-section="hv3"`):

```html
<main class="pruefung-container" id="section-root" data-section="hv3" data-modell="N">

  <div data-content="thema" hidden>Gastvortrag „Literatur im Unterricht DaF"</div>

  <div data-content="slides" hidden>
    <div class="slide-box">
      <div class="slide-titel">Título del Slide</div>
      <div class="slide-content">
        <p><strong>Subtítulo</strong></p>
        <span class="input-label">65.</span>
        <input type="text" class="slide-input" data-nummer="65" placeholder="Pista/hint…">
      </div>
    </div>

    <div class="slide-box">
      <div class="slide-titel">Otro Slide</div>
      <div class="slide-content">
        <p>Contenido con preguntas divididas:</p>
        <ul>
          <li>
            <span class="input-label">67a.</span>
            <input type="text" class="slide-input" data-nummer="67a" placeholder="Primera forma">
          </li>
          <li>
            <span class="input-label">67b.</span>
            <input type="text" class="slide-input" data-nummer="67b" placeholder="Segunda forma">
          </li>
        </ul>
      </div>
    </div>
    <!-- más slides hasta cubrir Lücken 65–74 -->
  </div>

</main>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.hv3(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initHV3({
    65: ['jeder vierte', '4.', 'vierte', 'keine bücher', 'liest keine'],
    66: ['bücher werden', 'weiter', 'weiterhin', 'noch', 'immer noch', 'gelesen'],
    '67a': ['verfassen', 'schreiben', 'eigener', 'texte'],
    '67b': ['kreative verarbeitung', 'verarbeitung', 'kreative', 'methoden'],
    // ... keywords para 68a–74
  }, {
    65:'65', 66:'66', '67a':'67 (Teil 1)', '67b':'67 (Teil 2)',
    // ... labels para mostrar en resultados
  });
</script>
```

> **Importante:** El segundo objeto de `initHV3` es un mapa de labels para los resultados. Es obligatorio.

**Regla de scoring keywords:**
- Match completo (2 pts si es pregunta de 2 pts) = full
- Match parcial (1 pt si es pregunta de 2 pts) = partial
- Sin match = 0

**Claves para crear buen contenido HV3:**
- Formato: **conferencia académica/Gastvortrag** con soporte visual (slides/Folien)
- Los slides dan contexto y estructura — los huecos son **palabras clave** (1-3 palabras) que solo se obtienen del audio
- Las respuestas deben ser **extraíbles directamente** del audio (no interpretación ni inferencia)
- Las preguntas divididas (67a/67b) piden dos datos relacionados del mismo contexto (ej: dos métodos, dos causas)
- Lista de keywords alternativas generosa: incluir sinónimos, formas abreviadas y variantes ortográficas que el matching acepte

---

### 4.8 Schriftlicher Ausdruck

**Tipo:** Elegir 1 de 2 temas. Escribir un ensayo argumentativo de mínimo 350 palabras con Einleitung, Hauptteil, Schluss.

**Longitudes de referencia:**

| Elemento | Detalle |
|----------|---------|
| Temas | 2 temas a elegir |
| Citas por tema | 2 citas contrapuestas |
| Longitud mínima | 350 palabras |
| Tiempo | 70 minutos |

**Estructura del archivo** (`data-section="sa"`):

```html
<main class="pruefung-container" id="section-root" data-section="sa" data-modell="N">

  <div data-content="themen" hidden>
    <div data-thema="literatur">
      <h3>Thema 1: Literatur</h3>
      <div class="zitat">„Literatur hat nie etwas Negatives verhindern können."</div>
      <div class="zitat">„Literatur bietet mehr Orientierung als alles andere."</div>
    </div>
    <div data-thema="gruppenarbeit">
      <h3>Thema 2: Gruppenarbeit</h3>
      <div class="zitat">„Gruppenarbeit kostet doch nur Zeit."</div>
      <div class="zitat">„Teamarbeit bietet dem Einzelnen viel mehr Möglichkeiten."</div>
    </div>
  </div>

</main>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.sa(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initSA({
    literatur: {
      title: 'Thema 1: Literatur',
      zitate: ['Literatur hat nie etwas Negatives verhindern können.', 'Literatur bietet mehr Orientierung als alles andere.']
    },
    gruppenarbeit: {
      title: 'Thema 2: Gruppenarbeit',
      zitate: ['Gruppenarbeit kostet doch nur Zeit.', 'Teamarbeit bietet dem Einzelnen viel mehr Möglichkeiten.']
    }
  });
</script>
```

> **Nota:** Las claves del objeto en `initSA` (ej: `literatur`, `gruppenarbeit`) deben coincidir con los `data-thema` del HTML.

**Temas típicos del SA:**
- Literatur / Medien
- Bildung / Erziehung
- Gruppenarbeit / Teamarbeit
- Technologie / Digitalisierung
- Umwelt / Nachhaltigkeit
- Wissenschaft / Ethik

**Bewertungskriterien SA — 48 puntos (4 × 12):**

Cada criterio se califica A/B/C/D. Esto es lo que la IA usa para evaluar:

| Criterio | A = 12 | B = 8 | C = 4 | D = 0 |
|----------|--------|-------|-------|-------|
| **1. Aufgabengerechtheit** | Tema tratado de forma completa. Argumentación diferenciada con introducción, desarrollo y conclusión claros. | Tema tratado en gran parte. Argumentación con estructura reconocible pero alguna deficiencia. | Tema tratado solo parcialmente o argumentación simple/incompleta. | Tema incorrecto, desviación total, o texto demasiado corto. |
| **2. Korrektheit** | Alto grado de corrección gramatical. Errores solo esporádicos en estructuras complejas. | Algunos errores en estructuras complejas; las simples son correctas. | Errores frecuentes también en estructuras simples. | Errores graves que dificultan la comprensión. |
| **3. Repertoire** | Vocabulario variado y preciso. Sinónimos, nominalizaciones, expresiones académicas. | Vocabulario adecuado con alguna repetición o simplificación. | Vocabulario simple y/o repetitivo en varios puntos. | Vocabulario muy limitado; comprensión afectada. |
| **4. Kommunikative Gestaltung** | Conectores y referencias adecuados. Coherencia a nivel de párrafo y texto. | Conectores más simples o pequeñas imprecisiones puntuales. | Conectores poco claros o solo conexiones simples en varios puntos. | Rupturas y/o conexiones poco claras. Estructura textual confusa. |

**Estructura esperada del ensayo:**
1. **Einleitung** (~50 pal.) — Interés, contexto, pregunta central. Sin argumentos ni opinión propia.
2. **Hauptteil** (~250 pal.) — Retomar citas de la tarea. Pro/contra con esquema: tesis → argumento → ejemplo. Objetividad (Konjunktiv I para citas ajenas).
3. **Schluss/Fazit** (~50 pal.) — Resumen breve, opinión propia fundamentada, posible perspectiva futura. Sin argumentos nuevos.

---

### 4.9 Mündliche Prüfung Teil 1A — Präsentation

**Tipo:** Elegir 1 de 2 temas, preparar 20 min, presentar ~3 min. 3 participantes (A, B, C) × 2 temas = 6 temas total.

**Estructura del archivo** (`data-section="praesentation"`):

```html
<main class="pruefung-container" id="section-root" data-section="praesentation" data-modell="N">

  <div data-content="teilnehmer" hidden>
    <div class="teilnehmer-box">
      <div class="teilnehmer-titel">Teilnehmer/in A</div>
      <div class="thema-box">
        <div class="thema-label">Thema 1</div>
        <div class="thema-text"><p>Pregunta/tema completo aquí.</p></div>
      </div>
      <div class="thema-box">
        <div class="thema-label">Thema 2</div>
        <div class="thema-text"><p>Segundo tema aquí.</p></div>
      </div>
    </div>
    <!-- teilnehmer-box para B y C con misma estructura -->
  </div>

  <div data-content="select" hidden>
    <optgroup label="Teilnehmer/in A">
      <option value="a1">Thema 1: Resumen corto del tema</option>
      <option value="a2">Thema 2: Resumen corto del tema</option>
    </optgroup>
    <optgroup label="Teilnehmer/in B">
      <option value="b1">Thema 1: ...</option>
      <option value="b2">Thema 2: ...</option>
    </optgroup>
    <optgroup label="Teilnehmer/in C">
      <option value="c1">Thema 1: ...</option>
      <option value="c2">Thema 2: ...</option>
    </optgroup>
  </div>

</main>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.praesentation(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initPraesentation({
    'a1': 'Texto completo del tema A1.',
    'a2': 'Texto completo del tema A2.',
    'b1': 'Texto completo del tema B1.',
    'b2': 'Texto completo del tema B2.',
    'c1': 'Texto completo del tema C1.',
    'c2': 'Texto completo del tema C2.'
  });
</script>
```

> **Nota:** Las claves del select (`a1`, `a2`, `b1`...) deben coincidir con las claves en `initPraesentation` y en `praesentation-texte.js`.

**Temas típicos de presentación (Modell 1 como referencia):**

| Participante | Tema 1 | Tema 2 |
|--------------|--------|--------|
| A | Erfindung (invención importante) | Universitäres System (sistema universitario) |
| B | Erfahrungen zur Studienwahl (experiencias de carrera) | Künstlerische Fächer (materias artísticas) |
| C | Kulturelle Unterschiede Sprachenlernen | Natur- vs. Geisteswissenschaften |

**Bewertungskriterien MP — 48 puntos total (todas las partes juntas):**

Los criterios se dividen en *inhaltliche* (contenido) y *sprachliche* (lingüística). Es útil para crear temas y para la evaluación con IA:

**Inhaltliche Angemessenheit (16 pts):**

| Parte | A (máx) | B | C | D = 0 |
|-------|---------|---|---|-------|
| **1A Präsentation** | 6 — Clara, detallada, bien estructurada. Preguntas contestadas adecuadamente. | 4 | 2 | 0 |
| **1B Zusammenfassung** | 4 — Aspectos principales mencionados de forma estructurada. Preguntas de comprensión o seguimiento. | 2 | 1 | 0 |
| **2 Diskussion** | 6 — Participación activa, aportar argumentos, preguntar, defender posiciones, involucrar al compañero. | 4 | 2 | 0 |

**Sprachliche Angemessenheit (32 pts — 4 criterios × 8 pts):**

| Criterio | A = 8 | B = 5 | C = 2 | D = 0 |
|----------|-------|-------|-------|-------|
| **Flüssigkeit** | Muy fluido, ritmo constante, sin búsqueda de palabras. | Mayormente fluido, alguna pausa posible. | Algunas pausas buscando palabras. | Pausas numerosas, comprensión afectada. |
| **Repertoire** | Variado, parafraseo sin problemas. | A veces vocabulario simple o repeticiones. | Frecuentemente simple y/o repetitivo. | Predominantemente simple. |
| **Grammatische Richtigkeit** | Alto grado de corrección. | Algunos errores en estructuras complejas. | Errores numerosos. | Errores que afectan la comprensión. |
| **Aussprache & Intonation** | Clara, natural, matices de significado mediante entonación. | Errores ocasionales en pronunciación/acentuación. | Errores que exigen concentración extra del oyente. | Errores numerosos, comprensión afectada. |

> **Para el creador de contenido:** Los temas de presentación deben ser lo suficientemente ricos para hablar ~3 min con argumentos, ejemplos y experiencias. Las citas de discusión deben ser lo bastante ambiguas para permitir posiciones contrarias.

---

### 4.10 Mündliche Prüfung Teil 1B — Zusammenfassung

**IMPORTANTE: Este archivo SÍ necesita cambios.** No es genérico — referencia directamente los temas de Teil 1A y carga los textos de `praesentation-texte.js`.

**Cómo funciona (flujo del estudiante):**
1. El estudiante elige cuál tema presentó ÉL en Teil 1A (ej: "a1: Erfindungen")
2. El sistema le muestra un texto de presentación DIFERENTE (aleatorio de los otros 5)
3. El estudiante debe resumir ese texto (como si hubiera escuchado a su compañero)

**Estructura del archivo** (`data-section="zusammenfassung"`):

```html
<main class="pruefung-container" id="section-root" data-section="zusammenfassung" data-modell="N">

  <div data-content="themen" hidden>
    <h3 style="margin-top: 0; color: var(--accent-ink, #457b9d);">Teilnehmer/in A - Themen:</h3>
    <div class="thema-auswahl-grid">
      <button class="thema-btn" data-thema="a1">Thema 1: Erfindungen</button>
      <button class="thema-btn" data-thema="a2">Thema 2: Universitätssystem</button>
    </div>

    <h3 style="margin-top: 1.5rem; color: var(--accent-ink, #457b9d);">Teilnehmer/in B - Themen:</h3>
    <div class="thema-auswahl-grid">
      <button class="thema-btn" data-thema="b1">Thema 1: Studien-/Berufswahl</button>
      <button class="thema-btn" data-thema="b2">Thema 2: Künstlerische Fächer</button>
    </div>

    <h3 style="margin-top: 1.5rem; color: var(--accent-ink, #457b9d);">Teilnehmer/in C - Themen:</h3>
    <div class="thema-auswahl-grid">
      <button class="thema-btn" data-thema="c1">Thema 1: Fremdsprachen lernen</button>
      <button class="thema-btn" data-thema="c2">Thema 2: Natur- vs Geisteswissenschaften</button>
    </div>
  </div>

</main>
<script src="praesentation-texte.js"></script>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.zusammenfassung(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initZusammenfassung();
</script>
```

> Las claves `data-thema="a1"`, `"a2"`, etc. **deben** coincidir con las claves en `praesentation-texte.js`.
> Este archivo carga `praesentation-texte.js` **antes** de `section-builders.js`.

**Relación Teil 1A → Teil 1B → praesentation-texte.js:**

```
Teil 1A (praesentation.html)     praesentation-texte.js          Teil 1B (zusammenfassung.html)
─────────────────────────────    ──────────────────────────       ────────────────────────────────
Tema a1: "Erfindungen"      →   Texto a1: presentación sobre  →  Botón "Thema 1: Erfindungen"
                                 el internet (~340 palabras)
Tema a2: "Universitätssystem"→   Texto a2: presentación sobre  →  Botón "Thema 2: Universitätssystem"
                                 Hochschulsystem (~370 pal.)
... (6 temas en total)
```

**Qué debes crear en `praesentation-texte.js`:**

Un texto de presentación completo (350–450 palabras) por cada tema de Teil 1A. Cada texto simula lo que un compañero habría presentado sobre ese tema. Ver [sección 6](#6-formato-de-praesentation-textejs) para el formato exacto.

---

### 4.11 Mündliche Prüfung Teil 2 — Diskussion

**Tipo:** 4 citas de autores famosos con aspectos de discusión. ~6 min de discusión con compañero.

**Estructura del archivo** (`data-section="diskussion"`):

```html
<main class="pruefung-container" id="section-root" data-section="diskussion" data-modell="N">

  <div data-content="zitate" hidden>
    <div class="zitat-box">
      <div class="zitat-nummer">Diskussionsthema 1</div>
      <div class="zitat-text">„Die beste Bildung findet ein kluger Mensch auf Reisen."</div>
      <div class="zitat-autor">— Johann Wolfgang von Goethe (1749–1832), Dichter</div>
      <div class="diskussionsfragen">
        <h4>Mögliche Diskussionsaspekte:</h4>
        <ul>
          <li>Was bedeutet „Bildung durch Reisen"?</li>
          <li>Welche Erfahrungen haben Sie selbst gemacht?</li>
          <li>Kann man auch ohne Reisen gebildet werden?</li>
          <li>Welche Rolle spielen Bücher, Internet, persönliche Begegnungen?</li>
        </ul>
      </div>
    </div>
    <!-- zitat-box 2, 3, 4 con misma estructura -->
  </div>

  <div data-content="simulation" hidden>
    <div class="thema-box" data-zitat="1">
      <h3>Diskussionsthema 1</h3>
      <div class="zitat">„Die beste Bildung findet ein kluger Mensch auf Reisen."</div>
      <p style="text-align: right; font-style: italic; opacity: 0.7; margin-top: 0.5rem;">— Goethe</p>
    </div>
    <!-- thema-box 2, 3, 4 -->
  </div>

</main>
<script src="../shared/section-builders.js"></script>
<script src="../shared/pruefung.js"></script>
<script>
  SectionBuilder.diskussion(document.getElementById('section-root'), document.getElementById('section-root'));
  Pruefung.initDiskussion({
    1: { text:'Die beste Bildung findet ein kluger Mensch auf Reisen.', autor:'Johann Wolfgang von Goethe (1749–1832), Dichter',
         aspekte:['Was bedeutet „Bildung durch Reisen"?','Welche Erfahrungen haben Sie selbst gemacht?','Kann man auch ohne Reisen gebildet werden?','Welche Rolle spielen Bücher, Internet, persönliche Begegnungen?'] },
    2: { text:'Cita 2.', autor:'Autor 2 (años), profesión',
         aspekte:['Aspecto 1?','Aspecto 2?','Aspecto 3?','Aspecto 4?'] },
    3: { text:'Cita 3.', autor:'Autor 3',
         aspekte:['...','...','...','...'] },
    4: { text:'Cita 4.', autor:'Autor 4',
         aspekte:['...','...','...','...'] }
  });
</script>
```

> **Nota:** `data-content="zitate"` contiene la versión completa (con aspectos de discusión). `data-content="simulation"` contiene una versión resumida que se usa en el modo simulación de discusión. Ambos deben tener las mismas citas.

**Citas típicas:**
- Autores alemanes clásicos: Goethe, Schiller, Fontane, Kant, Hegel, Nietzsche, Hesse
- Temas: Bildung, Charakter, Mut, Freiheit, Wissen, Sprache, Kultur
- Siempre incluir años de nacimiento/muerte y profesión

---

## 5. Formato de exam-data.js

Este archivo contiene **todas las respuestas** para el modo examen simulado. Formato exacto:

```javascript
/* Modellprüfung N — Exam data (answers, themes, quotes) */
'use strict';

const EXAM_DATA = {
  title: 'Modellprüfung N',

  correct: {
    lv1: { 1:'g', 2:'e', 3:'a', 4:'b', 5:'h', 6:'d' },
    lv2: { 7:'a', 8:'d', 9:'c', 10:'a', 11:'d', 12:'e' },
    lv3: { 13:'−', 14:'×', 15:'+', 16:'×', 17:'−', 18:'×',
           19:'−', 20:'+', 21:'−', 22:'×', 23:'−', 24:'b' },
    sb:  { 25:'a',26:'d',27:'a',28:'b',29:'d',30:'d',31:'a',32:'b',
           33:'a',34:'a',35:'c',36:'c',37:'b',38:'c',39:'d',40:'c',
           41:'c',42:'c',43:'d',44:'d',45:'a',46:'c',47:'a' },
    hv1: { 47:'g',48:'f',49:'c',50:'i',51:'b',52:'d',53:'h',54:'j' },
    hv2: { 55:'a',56:'a',57:'a',58:'c',59:'b',60:'a',61:'a',62:'a',63:'b',64:'c' },
    hv3: {
      65:['keyword1','keyword2','keyword3'],
      66:['keyword1','keyword2'],
      '67a':['keyword1','keyword2'],
      '67b':['keyword1','keyword2'],
      '68a':['keyword1'],
      '68b':['keyword1','keyword2'],
      69:['keyword1','keyword2'],
      '70a':['keyword1','keyword2'],
      '70b':['keyword1','keyword2'],
      '71a':['keyword1','keyword2'],
      '71b':['keyword1','keyword2'],
      72:['keyword1','keyword2'],
      73:['keyword1'],
      74:['keyword1','keyword2']
    }
  },

  themaTexte: {
    a1: 'Texto completo del tema A1.',
    a2: 'Texto completo del tema A2.',
    b1: 'Texto completo del tema B1.',
    b2: 'Texto completo del tema B2.',
    c1: 'Texto completo del tema C1.',
    c2: 'Texto completo del tema C2.'
  },

  saThemen: {
    clave1: {
      title: 'Thema 1: Nombre',
      zitate: ['Cita 1.', 'Cita 2.']
    },
    clave2: {
      title: 'Thema 2: Nombre',
      zitate: ['Cita 3.', 'Cita 4.']
    }
  },

  hvTranskript: `Hörverstehen Teil 1

Sie hören die Meinungen von acht Personen...

Sprecher 1: ...
...
Sprecher 8: ...

Hörverstehen Teil 2

Sie hören eine Radiosendung...

Moderator: ...
Entrevistado: ...

Hörverstehen Teil 3

Sie hören einen Vortrag...

Dozent/Referent: ...

Ende des Subtests Hörverstehen.`,

  diskussionZitate: {
    1: { text:'Cita 1.', autor:'Autor',
         aspekte:['Aspecto 1','Aspecto 2','Aspecto 3','Aspecto 4'] },
    2: { text:'Cita 2.', autor:'Autor',
         aspekte:['...','...','...','...'] },
    3: { text:'Cita 3.', autor:'Autor',
         aspekte:['...','...','...','...'] },
    4: { text:'Cita 4.', autor:'Autor',
         aspekte:['...','...','...','...'] }
  }
};
```

> **`hvTranskript`**: Texto plano con el transkript completo del audio del Hörverstehen. Si el campo no existe o empieza con `/*`, el botón "Transkript kopieren" no aparece en la pantalla de preparación del HV. Se muestra en `screen-hv-ready` para que el usuario lo copie y use con un TTS o para seguir el audio.

### Notas sobre los valores de respuesta

| Sección | Formato de respuesta |
|---------|---------------------|
| LV1 | Letras `'a'`–`'h'` |
| LV2 | Letras `'a'`–`'e'` |
| LV3 (13–23) | Símbolos: `'+'` (richtig), `'−'` (falsch), `'×'` (nicht im Text) |
| LV3 (24) | Letra `'a'`, `'b'` o `'c'` |
| SB | Letras `'a'`–`'d'` |
| HV1 | Letras `'a'`–`'j'` |
| HV2 | Letras `'a'`–`'c'` |
| HV3 | Arrays de strings (keywords en minúsculas) |

> **Atención LV3 — dos formatos diferentes:**
> - En `exam-data.js`: usar símbolos `'+'` (richtig), `'−'` (falsch), `'×'` (nicht im Text). Unicode real, NO guión `-` ni letra `x`.
> - En `Pruefung.initLV3()` del standalone HTML: usar strings `'richtig'`, `'falsch'`, `'nicht'`.
> - El engine traduce automáticamente entre ambos formatos. **No mezclarlos.**

---

## 6. Formato de praesentation-texte.js

Contiene 6 textos de presentación para la práctica de Zusammenfassung. Formato:

```javascript
const praesentationTexte = {
  a1: {
    titel: 'Teilnehmer A - Título del tema',
    text: `Texto plano de la presentación...
    
    Segundo párrafo...
    
    Tercer párrafo...`,
    html: `<div class="praesentation-titel">Teilnehmer A - Título</div>
<p>Primer párrafo con <strong>palabras clave</strong>...</p>

<p>Segundo párrafo...</p>`
  },
  a2: { /* ... */ },
  b1: { /* ... */ },
  b2: { /* ... */ },
  c1: { /* ... */ },
  c2: { /* ... */ }
};

function getRandomPartnerPraesentation(meinThema) {
  const verfuegbareThemen = Object.keys(praesentationTexte).filter(key => key !== meinThema);
  const randomThema = verfuegbareThemen[Math.floor(Math.random() * verfuegbareThemen.length)];
  return praesentationTexte[randomThema];
}
```

### Longitudes de los textos de presentación (Modell 1 como referencia)

| Clave | Tema | Palabras aprox. |
|-------|------|----------------:|
| a1 | Internet como invención importante | ~340 |
| a2 | Sistema universitario alemán | ~370 |
| b1 | Experiencias hacia la elección de carrera | ~360 |
| b2 | Materias artísticas en la escuela | ~400 |
| c1 | Diferencias culturales en el aprendizaje de idiomas | ~400 |
| c2 | Ciencias naturales vs. humanidades | ~450 |

**Rango ideal: 350–450 palabras** (~3 minutos a 100–130 wpm hablando)

---

## 6.1. Hörverstehen Transkripte

Para facilitar la práctica, cada Modelltest puede incluir la transcripción completa del audio del Hörverstehen. El transkript se guarda directamente en `exam-data.js` como un campo de texto.

### Dónde se guarda

En el archivo `exam-data.js` de cada modell, dentro del campo `hvTranskript`. El ejemplo completo real está en `modell-1/exam-data.js`.

> **Estado actual:** Los modell-2 a modell-5 ya tienen la estructura del transkript con todas las instrucciones oficiales pre-escritas. Solo falta rellenar el contenido hablado (marcado con `/* TODO */`).

### Formato del transkript

El transkript es un template literal (backticks) con el texto plano completo. Las instrucciones oficiales del audio son **siempre las mismas** en todos los Modelltests (son estándar TELC). La estructura exacta que ya está en cada `exam-data.js`:

```
Hörverstehen Teil 1

Sie hören die Meinungen von acht Personen. Sie hören die Meinungen nur einmal. Entscheiden Sie beim Hören, welche Aussage A bis J zu welcher Person passt. Zwei Aussagen passen nicht. Markieren Sie Ihre Lösungen für die Aufgaben 47 bis 54 auf dem Antwortbogen. Lesen Sie jetzt die Aussagen A bis J. Sie haben dazu eine Minute Zeit.

Sprecher 1: [texto completo de lo que dice]

Sprecher 2: [texto completo]

Sprecher 3: [texto completo]

Sprecher 4: [texto completo]

Sprecher 5: [texto completo]

Sprecher 6: [texto completo]

Sprecher 7: [texto completo]

Sprecher 8: [texto completo]


Hörverstehen Teil 2

Sie hören eine Radiosendung. Sie hören die Sendung nur einmal. Entscheiden Sie beim Hören, welche Aussage A, B oder C am besten passt. Markieren Sie Ihre Lösungen für die Aufgaben 55 bis 64 auf dem Antwortbogen. Lesen Sie jetzt die Aufgaben 55 bis 64. Sie haben dazu drei Minuten Zeit.

Moderator: [pregunta/introducción]

Entrevistado: [respuesta completa]

Moderator: [siguiente pregunta]
...


Hörverstehen Teil 3

Sie hören einen Vortrag. Sie hören den Vortrag nur einmal. Sie haben Handzettel mit den Folien der Präsentation erhalten. Schreiben Sie die fehlenden Informationen stichwortartig in die freien Zeilen 65 bis 74 in der rechten Spalte. Die Lösung 0 ist ein Beispiel. Lesen Sie jetzt die Stichworte. Sie haben dazu eine Minute Zeit.

Dozent: [introducción]

Referent/in: [vortrag completo]

Ende des Subtests Hörverstehen.
```

> **⚠ IMPORTANTE:** Las instrucciones en alemán (los párrafos que empiezan con "Sie hören...") **NO se tocan**. Son idénticas en todos los Modelltests. Solo se rellena el contenido hablado después de cada bloque de instrucciones.

**Puntos clave del formato:**
- Separar los 3 Teile con líneas en blanco (doble salto)
- Cada Sprecher/intervención como `Nombre: texto completo`
- Las instrucciones del audio ya están escritas — **no modificarlas**
- NO incluir timestamps ni marcadores de tiempo
- El texto debe ser la **transcripción fiel** del audio, no un resumen

**Ejemplo real:** Ver `modell-1/exam-data.js` — contiene el transkript completo (~3249 palabras) del Übungstest 1 de telc.

### Cómo funciona el botón

**No necesitas hacer nada.** `exam-engine.js` inyecta automáticamente un botón "Transkript kopieren" en la pantalla `screen-hv-ready` (la que aparece después de la pausa de 20 min, antes del Hörverstehen).

- Si `hvTranskript` tiene contenido real → el botón funciona y copia al portapapeles.
- Si `hvTranskript` es un placeholder (`/* TODO */`) → el botón aparece **deshabilitado** con el mensaje "Transkript noch nicht verfügbar".

### Longitudes de referencia

Un hablante nativo de alemán habla en promedio **150–180 palabras por minuto**.

| Sección | Palabras (Modell 1, solo diálogos) | Duración aprox. (a 150–180 wpm) |
|---------|-----------------------------------:|---------------------------------:|
| HV Teil 1 (8 Sprecher) | **993** | ~6–7 min |
| HV Teil 2 (Interview) | **1155** | ~6–8 min |
| HV Teil 3 (Vortrag) | **1101** | ~6–7 min |
| **Total** | **~3249** | **~18–22 min** |

> Conteo hecho con script Python sobre `modell-1/exam-data.js`, excluyendo las instrucciones del audio ("Sie hören...") y contando solo desde el primer Sprecher/Moderator/Dozent. La prueba entera de Hörverstehen dura ~40–45 min, pero eso incluye tiempo para leer las preguntas, pensar y responder.

### Consejos para escribir transcripciones realistas

**HV Teil 1 (8 sprecher):**
- Cada Sprecher debe sonar como una persona real hablando espontáneamente
- Usa marcadores del lenguaje oral: "also", "ja", "ich muss ehrlich sagen", "klar"
- Cada persona debe tener un estilo ligeramente diferente
- Longitud: ~100–120 palabras por Sprecher

**HV Teil 2 (interview):**
- Diálogo natural entre Moderator y Expert/in
- El Moderator hace preguntas, el experto responde con detalle
- Usa transiciones conversacionales: "Das ist eine gute Frage", "Vielen Dank"
- El experto debe responder directamente a las preguntas del examen

**HV Teil 3 (vortrag):**
- Estilo académico pero comprensible
- Estructura clara: introducción → puntos principales → conclusión
- Usa conectores: "Zunächst", "Kommen wir zu", "Zusammenfassend"
- Las palabras clave de las respuestas deben aparecer claramente en el texto

---

### Estructura del texto de presentación

Cada texto debe tener:

1. **Begrüßung + Themenvorstellung** (~30 palabras): "Guten Tag! Heute möchte ich über X sprechen. Ich werde zunächst A erklären, dann B diskutieren und schließlich C zusammenfassen."
2. **Einleitung/Kontext** (~50 palabras): Contextualización del tema.
3. **Hauptteil** (~250 palabras): 2–3 argumentos principales con ejemplos.
4. **Gegenargumente** (opcional, ~50 palabras): Perspectiva contraria.
5. **Schluss/Fazit** (~40 palabras): Conclusión y "Vielen Dank!"

### Versión HTML

La versión `html` es idéntica al `text` pero con markup:
- Título en `<div class="praesentation-titel">`
- Párrafos en `<p>`
- Palabras clave en `<strong>`

---

## 7. Temas típicos TELC C1 Hochschule — Catálogo completo

El examen TELC C1 Hochschule está orientado al **contexto académico/universitario (Hochschule)**. A diferencia del TELC C1 general, los textos y tareas siempre tienen un enfoque científico, universitario o de debate intelectual.

---

### 7.1 Los 15 campos temáticos generales

Estos son los grandes campos de donde salen TODOS los temas de TODAS las secciones del examen:

| # | Campo temático (DE) | Campo temático (ES) | Frecuencia |
|---|---------------------|---------------------|------------|
| 1 | **Bildung & Erziehung** | Educación y formación | Muy alta |
| 2 | **Wissenschaft & Forschung** | Ciencia e investigación | Muy alta |
| 3 | **Sprache & Kommunikation** | Lengua y comunicación | Alta |
| 4 | **Gesellschaft & Soziales** | Sociedad y temas sociales | Alta |
| 5 | **Medien & Digitalisierung** | Medios y digitalización | Alta |
| 6 | **Arbeit & Beruf** | Trabajo y profesión | Media-alta |
| 7 | **Umwelt & Nachhaltigkeit** | Medio ambiente y sostenibilidad | Media |
| 8 | **Kultur & Kunst** | Cultura y arte | Media |
| 9 | **Gesundheit & Medizin** | Salud y medicina | Media |
| 10 | **Psychologie & Verhalten** | Psicología y comportamiento | Media |
| 11 | **Wirtschaft & Ökonomie** | Economía | Media |
| 12 | **Geschichte & Politik** | Historia y política | Media |
| 13 | **Philosophie & Ethik** | Filosofía y ética | Media |
| 14 | **Technologie & Innovation** | Tecnología e innovación | Media |
| 15 | **Mobilität & Internationales** | Movilidad e internacionalización | Media |

---

### 7.2 Temas concretos por campo (con ejemplos reales)

#### 1. Bildung & Erziehung
- Seniorenstudium / Lebenslanges Lernen (aprender toda la vida)
- Bologna-Prozess y la reforma universitaria
- Duales Studium (estudio dual: empresa + universidad)
- Frühkindliche Bildung / Kindergarten (educación temprana)
- Schulreformen (reformas escolares)
- Analphabetismus in Industrieländern (analfabetismo)
- E-Learning vs. Präsenzunterricht (online vs. presencial)
- Numerus clausus y acceso a la universidad
- Studiengebühren (tasas universitarias): pro y contra
- Inklusion im Bildungssystem (educación inclusiva)
- PISA-Studien y rendimiento escolar internacional
- Begabtenförderung vs. Chancengleichheit (talento vs. igualdad)

#### 2. Wissenschaft & Forschung
- Geschichte der Technik (ej: "Vom Abakus bis zur Z3")
- Forschungsethik (ética en la investigación)
- Interdisziplinäre Forschung (investigación interdisciplinar)
- Tierversuche in der Forschung (experimentación animal)
- Plagiate in der Wissenschaft (plagio académico)
- Peer-Review-Verfahren (proceso de revisión por pares)
- Open Access vs. Verlagswesen (acceso abierto vs. editoriales)
- Gentechnik / Biotechnologie (ingeniería genética)
- Raumfahrt und Weltraumforschung (investigación espacial)
- Wissenschaftskommunikation (divulgación científica)

#### 3. Sprache & Kommunikation
- Immersion / Sprachbad (ej: "Sprachbad im Kindergarten")
- Mehrsprachigkeit (multilingüismo)
- Deutsch als Fremdsprache (DaF) / Deutsch als Zweitsprache (DaZ)
- Sprachenpolitik in der EU (política lingüística)
- Anglizismen in der deutschen Sprache
- Gebärdensprache (lengua de signos)
- Sprachverfall vs. Sprachwandel (deterioro vs. evolución)
- Akademisches Schreiben (escritura académica)
- Rhetorik und Präsentationstechniken
- Gendergerechte Sprache (lenguaje inclusivo)

#### 4. Gesellschaft & Soziales
- Demografischer Wandel (cambio demográfico) — ej: "Altersforschung"
- Migration und Integration
- Generationenkonflikte (conflictos generacionales)
- Ehrenamtliches Engagement (voluntariado)
- Soziale Ungleichheit (desigualdad social)
- Urbanisierung vs. Landflucht (urbanización vs. éxodo rural)
- Alternde Gesellschaft (sociedad envejecida)
- Obdachlosigkeit (personas sin hogar)
- Gender Pay Gap (brecha salarial de género)
- Inklusion von Menschen mit Behinderung

#### 5. Medien & Digitalisierung
- Fake News / Desinformation
- Soziale Medien: Einfluss auf Jugendliche
- Datenschutz und Privatsphäre (protección de datos)
- Künstliche Intelligenz (inteligencia artificial)
- Medienkompetenz (competencia mediática)
- Digitalisierung der Hochschulen
- Algorithmen und Filterblasen (burbujas de filtro)
- Cybermobbing (acoso digital)
- Streaming vs. traditionelle Medien
- Big Data in Wissenschaft und Gesellschaft

#### 6. Arbeit & Beruf
- Berufswahl und Studienwahl (elección de carrera)
- Work-Life-Balance
- Homeoffice / Remote-Arbeit (teletrabajo)
- Fachkräftemangel (escasez de profesionales)
- Gig-Economy / Freelancing
- Praktika und Berufseinstieg (prácticas e inserción laboral)
- Automatisierung und Arbeitsplätze
- Gleichberechtigung im Beruf (igualdad en el trabajo)
- Burnout und Stress am Arbeitsplatz
- Unternehmensgründung / Start-ups

#### 7. Umwelt & Nachhaltigkeit
- Klimawandel (cambio climático)
- Erneuerbare Energien (energías renovables)
- Nachhaltiger Konsum (consumo sostenible)
- Plastikverbrauch / Müllvermeidung
- Biodiversität (biodiversidad)
- Stadtplanung und grüne Städte
- Elektromobilität (movilidad eléctrica)
- Lebensmittelverschwendung (desperdicio alimentario)
- Ökologischer Fußabdruck (huella ecológica)
- Wasser als Ressource

#### 8. Kultur & Kunst
- Literatur im Unterricht (ej: "Literatur im Unterricht DaF")
- Kunst- und Musikunterricht in Schulen
- Interkulturalität (interculturalidad)
- Museums- und Kulturpolitik
- Kreativwirtschaft (industria creativa)
- Kulturelles Erbe / UNESCO-Welterbe
- Theater und Schauspiel
- Film und Filmanalyse
- Buchmarkt und Lesekultur
- Populärkultur vs. Hochkultur

#### 9. Gesundheit & Medizin
- Altersforschung (ej: "Neue Ergebnisse aus der Altersforschung")
- Psychische Gesundheit / Mental Health
- Ernährung und Lebensstil
- Impfungen und Impfskepsis
- Gesundheitssystem: privat vs. gesetzlich
- Stressmanagement für Studierende
- Suchtprävention (prevención de adicciones)
- Telemedizin (telemedicina)
- Sport und Gesundheit
- Schlafforschung (investigación del sueño)

#### 10. Psychologie & Verhalten
- Lernpsychologie (psicología del aprendizaje)
- Motivation und Selbstdisziplin
- Prokrastination (procrastinación)
- Resilienz (resiliencia)
- Gruppendynamik (dinámica de grupo)
- Entscheidungsfindung (toma de decisiones)
- Kreativität und Innovation
- Emotionale Intelligenz
- Vorurteile und Stereotype (prejuicios)
- Glücksforschung (investigación sobre la felicidad)

#### 11. Wirtschaft & Ökonomie
- Globalisierung: Vor- und Nachteile
- Sharing Economy (economía colaborativa)
- Grundeinkommen (renta básica universal)
- Wirtschaftswachstum vs. Nachhaltigkeit
- Handelsbeziehungen (relaciones comerciales)
- Unternehmensethik (ética empresarial)
- Innovation und Wettbewerb (competencia)
- Entwicklungshilfe (ayuda al desarrollo)
- Armut und Reichtum
- Finanzkompetenz (educación financiera)

#### 12. Geschichte & Politik
- Zeitgeschichte des 20. Jahrhunderts
- Europäische Integration (integración europea)
- Demokratie und Meinungsfreiheit
- Menschenrechte (derechos humanos)
- Wissenschaftsgeschichte (historia de la ciencia)
- Erinnerungskultur (cultura de la memoria)
- Politische Partizipation (participación política)
- Wahlverhalten junger Menschen
- Föderalismus in Deutschland
- Kolonialismus und seine Folgen

#### 13. Philosophie & Ethik
- Bioethik (ej: Genforschung, Sterbehilfe)
- KI-Ethik (ética de la inteligencia artificial)
- Freiheit vs. Sicherheit
- Gerechtigkeit (justicia)
- Verantwortung der Wissenschaft
- Fortschritt und Moral
- Tierethik / Tierrechte
- Wahrheit und Lüge in der Gesellschaft
- Bildung als Wert (valor de la educación)
- Toleranz und Pluralismus

#### 14. Technologie & Innovation
- Internet als Erfindung (ej: praesentation-texte a1)
- Robotik und Automatisierung
- Smart Cities / Intelligente Städte
- 3D-Druck (impresión 3D)
- Weltraumtechnologie
- Nanotechnologie
- Erneuerbare Energietechnologien
- Virtuelle Realität (VR) / Augmented Reality (AR)
- Quantencomputer
- Medizintechnik (tecnología médica)

#### 15. Mobilität & Internationales
- Auslandsstudium (estudios en el extranjero)
- Erasmus / akademischer Austausch
- Kulturschock (choque cultural)
- Reisen als Bildung (ej: Goethe-Zitat)
- Internationale Zusammenarbeit
- Brain Drain / Brain Gain (fuga/ganancia de cerebros)
- Sprachreisen (viajes lingüísticos)
- Interkulturelle Kompetenz
- Weltweite Hochschulkooperationen
- Visum und Aufenthaltserlaubnis für Studierende

---

### 7.3 Qué temas van en qué sección

No todos los temas son aptos para todas las secciones. Aquí la distribución:

| Sección | Tipo de tema | Campos más frecuentes |
|---------|--------------|----------------------|
| **LV Teil 1** (Textrekonstruktion) | Texto informativo/histórico con estructura lineal | 2, 14, 12, 1 |
| **LV Teil 2** (Selektives Verstehen) | Texto opinativo/argumentativo con funciones comunicativas claras | 1, 4, 3, 8 |
| **LV Teil 3** (Detailverstehen) | Texto largo periodístico/científico con detalles | 1, 3, 9, 7, 2 |
| **Sprachbausteine** | Texto informativo con gramática C1 (científico/estadístico) | 2, 9, 4, 11 |
| **HV Teil 1** (8 Sprecher) | Tema de vida estudiantil/cotidiana con opiniones | 1, 4, 6, 15 |
| **HV Teil 2** (Interview) | Entrevista con experto sobre tema académico | 2, 1, 3, 8, 10 |
| **HV Teil 3** (Vortrag) | Conferencia/ponencia universitaria | 3, 8, 1, 2, 10 |
| **SA** (Schriftlicher Ausdruck) | Debate con 2 citas contrapuestas | 1, 5, 6, 13, 4 |
| **MP Teil 1A** (Präsentation) | Temas abiertos para presentar/argumentar | 1, 14, 6, 8, 3, 2 |
| **MP Teil 2** (Diskussion) | Cita filosófica/literaria para debatir | 13, 1, 12, 8 |

> Los números refieren a los 15 campos de la sección 7.1.

---

### 7.4 Pool de autores para citas (Diskussion)

| Autor | Años | Profesión | Citas de ejemplo |
|-------|------|-----------|-----------------|
| Johann Wolfgang von Goethe | 1749–1832 | Dichter | „Die beste Bildung findet ein kluger Mensch auf Reisen." / „Es ist nicht genug zu wissen, man muss auch anwenden." |
| Friedrich Schiller | 1759–1805 | Dichter | „Der Mensch ist nur da ganz Mensch, wo er spielt." / „Wer nicht mehr liebt und nicht mehr irrt, der lasse sich begraben." |
| Theodor Fontane | 1819–1898 | Schriftsteller | „Am Mut hängt der Erfolg." |
| Immanuel Kant | 1724–1804 | Philosoph | „Habe Mut, dich deines eigenen Verstandes zu bedienen!" / „Aufklärung ist der Ausgang des Menschen aus seiner selbstverschuldeten Unmündigkeit." |
| Wilhelm von Humboldt | 1767–1835 | Bildungsreformer | „Im Grunde sind es die Verbindungen mit Menschen, die dem Leben seinen Wert geben." |
| Hermann Hesse | 1877–1962 | Schriftsteller | „Man muss das Unmögliche versuchen, um das Mögliche zu erreichen." |
| Georg Christoph Lichtenberg | 1742–1799 | Physiker/Aphoristiker | „Ich weiß nicht, ob es besser wird, wenn es anders wird. Aber es muss anders werden, wenn es besser werden soll." |
| Albert Einstein | 1879–1955 | Physiker | „Phantasie ist wichtiger als Wissen, denn Wissen ist begrenzt." / „Probleme kann man niemals mit derselben Denkweise lösen, durch die sie entstanden sind." |
| Heinrich Thiersch | 1817–1885 | Theologe | „Auf Kinder wirkt das Vorbild, nicht die Kritik." |
| Ernst von Feuchtersleben | 1806–1849 | Arzt/Schriftsteller | „Ohne Leiden bildet sich kein Charakter." |
| Arthur Schopenhauer | 1788–1860 | Philosoph | „Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt." |
| Friedrich Nietzsche | 1844–1900 | Philosoph | „Wer ein Warum zu leben hat, erträgt fast jedes Wie." |
| Marie von Ebner-Eschenbach | 1830–1916 | Schriftstellerin | „Wer nichts für andere tut, tut nichts für sich." |
| Konfuzius | 551–479 v. Chr. | Philosoph | „Der Weg ist das Ziel." / „Lernen ohne zu denken ist nutzlos. Denken ohne zu lernen ist gefährlich." |
| Seneca | 4 v. Chr.–65 n. Chr. | Philosoph | „Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer." |
| Hannah Arendt | 1906–1975 | Politologin | „Niemand hat das Recht zu gehorchen." |
| Willy Brandt | 1913–1992 | Politiker | „Der beste Weg, die Zukunft vorauszusagen, ist, sie zu gestalten." |

---

### 7.5 Temas específicos para Schriftlicher Ausdruck (citas contrapuestas)

El SA siempre presenta 2 temas con 2 citas opuestas cada uno. Aquí hay combinaciones típicas:

| Tema | Cita A (positiva/pro) | Cita B (negativa/contra) |
|------|----------------------|-------------------------|
| Literatur | „Literatur bietet mehr Orientierung als alles andere." | „Literatur hat nie etwas Negatives verhindern können." |
| Teamarbeit | „Teamarbeit bietet dem Einzelnen viel mehr Möglichkeiten." | „Gruppenarbeit kostet doch nur Zeit." |
| Digitalisierung | „Digitale Medien eröffnen völlig neue Bildungschancen." | „Digitale Medien machen oberflächlich und abhängig." |
| Reisen/Bildung | „Reisen bildet mehr als jedes Buch." | „Wahre Bildung findet am Schreibtisch statt." |
| Tradition | „Traditionen geben Halt und Orientierung." | „Traditionen hindern uns am Fortschritt." |
| Spezialisierung | „Nur wer sich spezialisiert, kann Großes erreichen." | „Ein breites Wissen ist wichtiger als Spezialisierung." |
| Wissenschaft | „Wissenschaft ist die Lösung für alle Probleme der Menschheit." | „Wissenschaft schafft neue Probleme, statt alte zu lösen." |
| Noten/Bewertung | „Noten sind ein wichtiger Leistungsanreiz." | „Noten zerstören die Freude am Lernen." |
| Pflichtfächer | „Alle Studierenden sollten Pflichtkurse in Ethik belegen." | „Jeder sollte selbst entscheiden, was er lernt." |
| Mehrsprachigkeit | „Mehrsprachigkeit ist die Schlüsselkompetenz des 21. Jahrhunderts." | „Es reicht, eine Fremdsprache gut zu beherrschen." |

---

### 7.6 Temas específicos para Mündliche Präsentation

Los temas de presentación son siempre preguntas abiertas que permiten argumentar. Patrones típicos:

**Tipo "Beschreiben Sie…" (descriptivo):**
- Beschreiben Sie das System der universitären Ausbildung in einem Land Ihrer Wahl.
- Beschreiben Sie, welche Erfahrungen Sie zu Ihrer Studien- oder Berufswahl bewogen haben.
- Beschreiben Sie die Medienlandschaft in Ihrem Heimatland.
- Beschreiben Sie, wie sich die Arbeitswelt in den letzten Jahren verändert hat.

**Tipo "Welche… halten Sie für…?" (valorativo):**
- Welche Erfindung halten Sie für besonders wichtig?
- Welche künstlerischen Fächer sollten im Schulunterricht gelehrt werden?
- Welche Eigenschaften sind für den beruflichen Erfolg am wichtigsten?
- Welche Rolle spielen soziale Medien im akademischen Kontext?

**Tipo "Vergleichen Sie…" (comparativo):**
- Welche Fächer sind für die Menschheit wichtiger: Natur- oder Geisteswissenschaften?
- Was ist wichtiger: Theorie oder Praxis im Studium?
- Auslandsstudium oder Studium im Heimatland — was hat mehr Vorteile?
- Ist Online-Lernen genauso effektiv wie Präsenzunterricht?

**Tipo "Wie…?" (explicativo):**
- Wie man Fremdsprachen lernt und lehrt, ist kulturell unterschiedlich. Beschreiben Sie Unterschiede.
- Wie hat das Internet die akademische Forschung verändert?
- Wie können Hochschulen inklusiver werden?
- Wie beeinflusst der Klimawandel unser tägliches Leben?

> **Regla:** Siempre 3 participantes (A, B, C) × 2 temas cada uno. Los temas deben ser variados (no repetir el mismo campo temático).

---

## 8. Checklist final

Para cada nuevo Modelltest, verifica:

### HTML (contenido en `<div data-content>` + respuestas en `<script>`)

- [ ] `1-leseverstehen-teil-1.html` — `data-content="text"` (~250 pal.) + `data-content="options"` (a–h, z) + `Pruefung.initLV1()`
- [ ] `1-leseverstehen-teil-2.html` — `data-content="text"` (5 absätze ~700 pal.) + `data-content="fragen"` (6) + `Pruefung.initLV2()`
- [ ] `1-leseverstehen-teil-3.html` — `data-content="text"` (~1100 pal.) + `data-content="aussagen"` (11) + `data-content="global"` (3) + `Pruefung.initLV3()`
- [ ] `2-sprachbausteine.html` — `data-content="text"` (23 lücken) + `data-content="optionen"` (23 × 4) + `Pruefung.initSB()`
- [ ] `3-hoerverstehen-teil-1.html` — `data-content="thema"` + `data-content="aussagen"` (a–j) + `Pruefung.initHV1()`
- [ ] `3-hoerverstehen-teil-2.html` — `data-content="thema"` + `data-content="fragen"` (10 × 3) + `Pruefung.initHV2()`
- [ ] `3-hoerverstehen-teil-3.html` — `data-content="thema"` + `data-content="slides"` (con inputs) + `Pruefung.initHV3()`
- [ ] `4-schriftlicher-ausdruck.html` — `data-content="themen"` (2 × 2 citas) + `Pruefung.initSA()`
- [ ] `5-muendlich-praesentation.html` — `data-content="teilnehmer"` + `data-content="select"` + `Pruefung.initPraesentation()`
- [ ] `5-muendlich-zusammenfassung.html` — `data-content="themen"` (botones a1–c2 de Teil 1A) + `Pruefung.initZusammenfassung()`
- [ ] `5-muendlich-diskussion.html` — `data-content="zitate"` + `data-content="simulation"` + `Pruefung.initDiskussion()`

### JavaScript (datos)

- [ ] `exam-data.js` — Todas las respuestas correctas (lv1, lv2, lv3, sb, hv1, hv2, hv3)
- [ ] `exam-data.js` — hvTranskript (transkript completo del audio HV)
- [ ] `exam-data.js` — themaTexte (6 textos de presentación resumidos)
- [ ] `exam-data.js` — saThemen (2 temas SA con citas)
- [ ] `exam-data.js` — diskussionZitate (4 citas con aspectos)
- [ ] `praesentation-texte.js` — 6 textos completos (350–450 palabras c/u) con versión `text` y `html`
- [ ] `praesentation-texte.js` — Función `getRandomPartnerPraesentation` (copiar idéntica)

### Hörverstehen (transcripción)

- [ ] `exam-data.js` — `hvTranskript` rellenado con el texto completo del audio (~3250 palabras: HV1 ~993 + HV2 ~1155 + HV3 ~1101)
- [ ] El botón "Transkript kopieren" aparece habilitado en `screen-hv-ready` (se inyecta automáticamente por `exam-engine.js`)

### Estructura (no modificar — solo verificar que se copió bien de _vorlage/)

- [ ] Cada HTML tiene `<main ... data-section="XXX" data-modell="N">` correcto
- [ ] Cada HTML llama `SectionBuilder.XXX(...)` seguido de `Pruefung.initXXX(...)` en el `<script>`
- [ ] Los scripts cargan en orden: `section-builders.js` → `pruefung.js` → `<script>` inline
- [ ] `zusammenfassung.html` carga `praesentation-texte.js` **antes** de `section-builders.js`
- [ ] `exam.html` no tiene IDs modificados ni estructura alterada

### Verificación de consistencia (la más importante)

- [ ] Las respuestas en el `<script>` de cada HTML coinciden con `exam-data.js`
- [ ] Los números de pregunta son consecutivos y correctos (1–6, 7–12, 13–24, 25–47, 47–54, 55–64, 65–74)
- [ ] **SA themes**: `4-schriftlicher-ausdruck.html` = `exam.html` (tab-sa) = `exam-data.js` (saThemen)
- [ ] **Presentation themes**: `5-muendlich-praesentation.html` = `exam.html` (tab-vorbereitung) = `exam-data.js` (themaTexte) = `praesentation-texte.js` claves = `5-muendlich-zusammenfassung.html` botones
- [ ] **Diskussion quotes**: `5-muendlich-diskussion.html` (zitate + simulation) = `exam.html` (screen-diskussion-ready) = `exam-data.js` (diskussionZitate)
- [ ] Las claves en `praesentation-texte.js` (a1, a2, b1, b2, c1, c2) coinciden con los `data-thema` y `value` de ambos archivos mündlich
- [ ] LV3 exam-data.js usa `+`/`−`/`×` (Unicode), standalone usa `richtig`/`falsch`/`nicht`
- [ ] Los caracteres especiales están correctos: `−` (Unicode minus), `×` (Unicode times), `„"` (comillas alemanas)

---

## Resumen rápido

```bash
# Paso 1: Copiar plantilla
cp -r _vorlage/ modell-N/

# Paso 2: Buscar y reemplazar N por el número real
# (en títulos, h1, data-modell, subtitles)

# Paso 3: Rellenar contenido (ver tabla abajo)

# Paso 4: Verificar consistencia (checklist arriba)
```

| Esfuerzo | Porcentaje |
|----------|-----------|
| Rellenar `<div data-content>` con contenido (11 secciones) | 70% |
| Rellenar `exam.html` (SA themes + presentation themes + diskussion quotes) | 5% |
| Actualizar respuestas en `Pruefung.initXXX()` de cada standalone | 5% |
| Actualizar `exam-data.js` (respuestas + hvTranskript) | 5% |
| Escribir/copiar `praesentation-texte.js` (6 textos × ~400 pal) | 5% |
| Escribir `hvTranskript` (~3250 palabras: HV1 ~993 + HV2 ~1155 + HV3 ~1101) | 5% |
| Verificar consistencia entre archivos (sección 3.2) | 5% |

**No necesitas:** cambiar lógica, crear componentes, modificar CSS, tocar archivos en `shared/`, agregar botones de navegación ni botones de copiar transkript.

**Workflow seguro:** Copiar `_vorlage/` → rellenar TODOs → verificar consistencia. Cada archivo de la plantilla tiene marcadores `<!-- TODO -->` y `⚠ CONSISTENCIA` para guiar exactamente qué cambiar y qué dejar intacto.
