# Guía completa para crear un nuevo Modelltest TELC C1 Hochschule

> Esta guía documenta **todo** lo necesario para rellenar un Modelltest (2–5) a partir de las plantillas existentes. No necesitas modificar código, CSS ni lógica — solo contenido y datos.

---

## Tabla de contenidos

1. [Resumen del examen TELC C1 Hochschule](#1-resumen-del-examen-telc-c1-hochschule)
2. [Estructura de puntos y calificación](#2-estructura-de-puntos-y-calificación)
3. [Archivos que debes editar por Modelltest](#3-archivos-que-debes-editar-por-modelltest)
4. [Instrucciones por sección (con longitudes exactas)](#4-instrucciones-por-sección)
5. [Formato de exam-data.js](#5-formato-de-exam-datajs)
6. [Formato de praesentation-texte.js](#6-formato-de-praesentation-textejs)
7. [Temas típicos TELC C1 Hochschule](#7-temas-típicos-telc-c1-hochschule)
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

Para cada `modell-N/` (N = 2, 3, 4, 5), debes editar:

### Archivos HTML (reemplazar `<!-- TODO -->` con contenido)

| Archivo | Qué rellenar |
|---------|-------------|
| `1-leseverstehen-teil-1.html` | Título, texto con lücken, 8+1 opciones (a–h, z) |
| `1-leseverstehen-teil-2.html` | Título, 5 absätze (a–e), 6 preguntas |
| `1-leseverstehen-teil-3.html` | Título, texto largo, 11 aussagen + 1 pregunta global |
| `2-sprachbausteine.html` | Título, texto con 23 lücken, 4 opciones c/u |
| `3-hoerverstehen-teil-1.html` | Tema, 10 aussagen (a–j) |
| `3-hoerverstehen-teil-2.html` | Tema, 10 preguntas con 3 opciones c/u |
| `3-hoerverstehen-teil-3.html` | Tema, folien/slides con lücken |
| `4-schriftlicher-ausdruck.html` | 2 temas con 2 citas c/u |
| `5-muendlich-praesentation.html` | 6 temas (2 por participante A/B/C) |
| `5-muendlich-zusammenfassung.html` | Actualizar botones con nombres de temas de Teil 1A |
| `5-muendlich-diskussion.html` | 4 citas con autor + aspectos de discusión |

### Archivos JavaScript (actualizar datos)

| Archivo | Qué rellenar |
|---------|-------------|
| `exam-data.js` | Respuestas correctas + temas SA + citas diskussion |
| `praesentation-texte.js` | 6 textos de presentación (~350–400 palabras c/u) |

### Lo que NO debes tocar

- `index.html` — ya genera el menú automáticamente
- `exam.html` — ya carga todo automáticamente
- Nada en `shared/` — `pruefung.js`, `pruefung.css`, `exam-engine.js`, `exam.css`
- Los botones de respuesta (a–h, a–e, +/−/×) — ya están en las plantillas
- La sección `<div class="ergebnisse">` — ya existe
- Los `<script>` al final — solo actualizar los valores de respuestas

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

**Cómo rellenar la plantilla:**

1. Reemplaza `<!-- TODO: Titel -->` con el título del texto:

```html
<h3>Tu Título Aquí</h3>
```

2. Reemplaza `<!-- TODO: Text con ... -->` con los párrafos. Usa `<span class="luecke">N</span>` para cada hueco:

```html
<p>Texto antes del hueco. <span class="luecke">0</span> Texto después del hueco.
<span class="luecke">1</span> Más texto aquí.</p>

<h4>Subtítulo opcional</h4>
<p>Otro párrafo con <span class="luecke">2</span> y <span class="luecke">3</span></p>
```

3. Reemplaza cada `<!-- TODO: Satz X -->` con la oración correspondiente:

```html
<span>Esta es la oración que podría ir en algún hueco.</span>
```

4. Actualiza las respuestas en el `<script>`:

```javascript
Pruefung.initLV1({ 1:'g', 2:'e', 3:'a', 4:'b', 5:'h', 6:'d' });
```

**Reglas del contenido:**
- El texto debe ser académico/científico (nivel C1 Hochschule)
- Debe tener subtítulos (`<h4>`) para dividir el texto
- Las oraciones a–h deben ser gramaticalmente coherentes con el texto
- 2 oraciones son distractores (no encajan en ningún hueco)
- La opción `z` es siempre el ejemplo para la Lücke 0

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

**Cómo rellenar:**

1. Título del texto:

```html
<h3>Seniorenstudium: Fürs Lernen ist es nie zu spät</h3>
```

2. Cada párrafo va dentro de su `<div class="absatz">`:

```html
<div class="absatz">
  <span class="absatz-label">Absatz a</span>
  <p>Texto completo del párrafo a aquí...</p>
</div>
```

3. Las preguntas empiezan con "In welchem Abschnitt…":

```html
<div class="frage-text">… drückt sich der Autor polemisch aus?</div>
```

4. Respuestas:

```javascript
Pruefung.initLV2({ 7:'a', 8:'d', 9:'c', 10:'a', 11:'d', 12:'e' });
```

**Reglas del contenido:**
- Las preguntas son sobre funciones comunicativas (ironía, recomendación, pronóstico, advertencia, cita, humor, etc.)
- Cada párrafo debe tener un tono/función diferente
- El texto debe ser opinativo/argumentativo (no puramente informativo)

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

**Cómo rellenar:**

1. Título y texto con párrafos:

```html
<h3>„Sprachbad" im Kindergarten</h3>
<p><em>Introducción en cursiva (opcional).</em></p>
<p>Primer párrafo...</p>
<p>Segundo párrafo...</p>
<!-- ... más párrafos ... -->
```

2. Las 11 Aussagen (13–23) — la estructura de botones ya existe en la plantilla. Solo rellena el texto:

```html
<div class="aussage-text">Immersion ist eine Methode zur Förderung der zweiten Muttersprache.</div>
```

3. La pregunta global (24) — 3 opciones de título:

```html
<button class="antwort-btn" data-answer="a">a) Título opción A</button>
<button class="antwort-btn" data-answer="b">b) Título opción B</button>
<button class="antwort-btn" data-answer="c">c) Título opción C</button>
```

4. Respuestas — usa `richtig`/`falsch`/`nicht` para 13–23 y letra para 24:

```javascript
Pruefung.initLV3({
  13:'falsch', 14:'nicht', 15:'richtig', 16:'nicht', 17:'falsch', 18:'nicht',
  19:'falsch', 20:'richtig', 21:'falsch', 22:'nicht', 23:'falsch', 24:'b'
});
```

**Reglas del contenido:**
- El texto debe ser informativo/periodístico/académico
- Mezcla equilibrada: ~4 richtig, ~4 falsch, ~3 nicht im Text
- Las afirmaciones "nicht im Text" deben ser plausibles pero no mencionadas
- La opción de título correcta debe reflejar la idea central (no parcial)

---

### 4.4 Sprachbausteine — Grammatik und Lexik

**Tipo:** Texto con 23 huecos (numerados 25–47). Cada hueco tiene 4 opciones (a/b/c/d). Evalúa gramática y vocabulario.

**Longitudes de referencia (Modell 1 — "Neue Ergebnisse aus der Altersforschung"):**

| Elemento | Palabras aprox. |
|----------|----------------:|
| **Texto total** (7 párrafos, sin contar huecos) | **~250** |
| Opciones por hueco | 1–4 palabras c/u |

**Cómo rellenar:**

1. Título y texto con huecos usando `<span class="lucke">`:

```html
<h3>Título del texto</h3>
<p>Texto <span class="lucke" data-lucke="25">____</span> más texto
<span class="lucke" data-lucke="26">____</span> continúa...</p>
```

2. Opciones — cada grupo de 4 botones:

```html
<div class="option-gruppe">
  <div class="option-gruppe-titel">25</div>
  <div class="optionen-grid">
    <button class="option-btn" data-lucke="25" data-wert="a">an</button>
    <button class="option-btn" data-lucke="25" data-wert="b">bei</button>
    <button class="option-btn" data-lucke="25" data-wert="c">durch</button>
    <button class="option-btn" data-lucke="25" data-wert="d">fest</button>
  </div>
</div>
```

3. Respuestas:

```javascript
Pruefung.initSB({
  25:'a',26:'d',27:'a',28:'b',29:'d',30:'d',31:'a',32:'b',33:'a',34:'a',
  35:'c',36:'c',37:'b',38:'c',39:'d',40:'c',41:'c',42:'c',43:'d',44:'d',
  45:'a',46:'c',47:'a'
});
```

**Tipos de gramática que se evalúan:**
- Preposiciones (an, bei, auf, für, mit, trotz, wegen...)
- Orden de palabras (posición del verbo, Adjektivdeklination)
- Konjunktiv I/II (sei, wäre, würde, könnte...)
- Temporale Konnektoren (während, nachdem, indem, seitdem...)
- Wortbildung (vermutlich vs. vermeintlich vs. vermeidlich...)
- Artikelgebrauch y Kasusendungen
- Präpositionalphrasen idiomáticas (zum Trotz, zufolge, Angaben nach...)

---

### 4.5 Hörverstehen Teil 1 — Globalverstehen

**Tipo:** 8 hablantes cortos sobre un tema. Asignar afirmaciones (a–j) a hablantes (1–8). Sobran 2 afirmaciones. Se escucha **una sola vez**.

**Longitudes de referencia (Modell 1 — "Studentische Lebensformen"):**

| Elemento | Palabras aprox. |
|----------|----------------:|
| Tema (título) | 2–5 |
| Cada Aussage (a–j) | **~10–20** |
| Total: 10 aussagen | ~130 |

**Cómo rellenar:**

1. El tema:

```html
<p><strong>Thema:</strong> Studentische Lebensformen</p>
```

2. Las 10 afirmaciones (a–j):

```html
<div class="aussage-item">
  <div class="aussage-label">a</div>
  <div>Viele Studierende wohnen lieber allein, obwohl es relativ teuer ist.</div>
</div>
```

3. Los 8 hablantes ya tienen su estructura de botones. Solo actualiza las respuestas:

```javascript
Pruefung.initHV1({ 47:'g', 48:'f', 49:'c', 50:'i', 51:'b', 52:'d', 53:'h', 54:'j' });
```

> **Nota:** Los números de pregunta son 47–54 (Sprecher 1 = Aufgabe 47, etc.)

---

### 4.6 Hörverstehen Teil 2 — Detailverstehen

**Tipo:** Entrevista/Radiosendung. 10 preguntas (55–64) con 3 opciones (a/b/c). Se escucha **una sola vez**.

**Longitudes de referencia (Modell 1 — "Interview Prof. Beutelspacher"):**

| Elemento | Palabras aprox. |
|----------|----------------:|
| Cada pregunta (stem) | ~5–10 |
| Cada opción (a/b/c) | ~8–15 |

**Cómo rellenar:**

1. El tema:

```html
<p><strong>Thema:</strong> Interview zum Jahr der Mathematik mit Prof. Albrecht Beutelspacher</p>
```

2. Cada pregunta con 3 opciones:

```html
<div class="frage-box">
  <div class="frage-nummer">55. Herr Beutelspacher ist</div>
  <div class="antwort-buttons">
    <button class="antwort-btn" data-frage="55" data-wert="a">a) begeistert, wenn er die Lösung begreift.</button>
    <button class="antwort-btn" data-frage="55" data-wert="b">b) fasziniert von Menschen, die verstehen.</button>
    <button class="antwort-btn" data-frage="55" data-wert="c">c) glücklich, wenn er Mathematik erklären kann.</button>
  </div>
</div>
```

3. Respuestas:

```javascript
Pruefung.initHV2({ 55:'a', 56:'a', 57:'a', 58:'c', 59:'b', 60:'a', 61:'a', 62:'a', 63:'b', 64:'c' });
```

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

**Cómo rellenar:**

1. Cada slide con sus inputs:

```html
<div class="slide-box">
  <div class="slide-titel">Título del Slide</div>
  <div class="slide-content">
    <p><strong>Subtítulo</strong></p>
    <span class="input-label">65.</span>
    <input type="text" class="slide-input" data-nummer="65" placeholder="Pista/hint…">
  </div>
</div>
```

2. Para preguntas divididas (a/b):

```html
<li>
  <span class="input-label">67a.</span>
  <input type="text" class="slide-input" data-nummer="67a" placeholder="Primera forma">
</li>
<li>
  <span class="input-label">67b.</span>
  <input type="text" class="slide-input" data-nummer="67b" placeholder="Segunda forma">
</li>
```

3. Las respuestas son **arrays de keywords** (se acepta cualquier match parcial):

```javascript
Pruefung.initHV3({
  65: ['jeder vierte', '4.', 'vierte', 'keine bücher', 'liest keine'],
  66: ['bücher werden', 'weiter', 'weiterhin', 'noch', 'immer noch', 'gelesen'],
  '67a': ['verfassen', 'schreiben', 'eigener', 'texte'],
  '67b': ['kreative verarbeitung', 'verarbeitung', 'kreative', 'methoden'],
  // ... etc
}, {
  65:'65', 66:'66', '67a':'67 (Teil 1)', '67b':'67 (Teil 2)',
  // ... labels para mostrar en resultados
});
```

> **Importante:** El segundo objeto es un mapa de labels para mostrar en los resultados. Es obligatorio.

**Regla de scoring keywords:**
- Match completo (2 pts si es pregunta de 2 pts) = full
- Match parcial (1 pt si es pregunta de 2 pts) = partial
- Sin match = 0

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

**Cómo rellenar:**

1. Los 2 temas con citas:

```html
<div class="thema-box" data-thema="clave_tema_1">
  <h3>Thema 1: Nombre del Tema</h3>
  <div class="zitat">„Primera cita aquí."</div>
  <div class="zitat">„Segunda cita (opinión contraria)."</div>
</div>
```

2. Configuración en el `<script>`:

```javascript
Pruefung.initSA({
  clave_tema_1: {
    title: 'Thema 1: Nombre',
    zitate: ['Primera cita.', 'Segunda cita.']
  },
  clave_tema_2: {
    title: 'Thema 2: Nombre',
    zitate: ['Tercera cita.', 'Cuarta cita.']
  }
});
```

**Temas típicos del SA:**
- Literatur / Medien
- Bildung / Erziehung
- Gruppenarbeit / Teamarbeit
- Technologie / Digitalisierung
- Umwelt / Nachhaltigkeit
- Wissenschaft / Ethik

---

### 4.9 Mündliche Prüfung Teil 1A — Präsentation

**Tipo:** Elegir 1 de 2 temas, preparar 20 min, presentar ~3 min. 3 participantes (A, B, C) × 2 temas = 6 temas total.

**Cómo rellenar:**

1. Cada participante con 2 temas:

```html
<div class="teilnehmer-box">
  <div class="teilnehmer-titel">Teilnehmer/in A</div>
  <div class="thema-box">
    <div class="thema-label">Thema 1</div>
    <div class="thema-text">
      <p>Pregunta/tema completo aquí.</p>
    </div>
  </div>
  <div class="thema-box">
    <div class="thema-label">Thema 2</div>
    <div class="thema-text">
      <p>Segundo tema aquí.</p>
    </div>
  </div>
</div>
```

2. El select y la configuración JS:

```javascript
Pruefung.initPraesentation({
  'a1': 'Texto completo del tema A1.',
  'a2': 'Texto completo del tema A2.',
  'b1': 'Texto completo del tema B1.',
  'b2': 'Texto completo del tema B2.',
  'c1': 'Texto completo del tema C1.',
  'c2': 'Texto completo del tema C2.'
});
```

**Temas típicos de presentación (Modell 1 como referencia):**

| Participante | Tema 1 | Tema 2 |
|--------------|--------|--------|
| A | Erfindung (invención importante) | Universitäres System (sistema universitario) |
| B | Erfahrungen zur Studienwahl (experiencias de carrera) | Künstlerische Fächer (materias artísticas) |
| C | Kulturelle Unterschiede Sprachenlernen | Natur- vs. Geisteswissenschaften |

---

### 4.10 Mündliche Prüfung Teil 1B — Zusammenfassung

**IMPORTANTE: Este archivo SÍ necesita cambios.** No es genérico — referencia directamente los temas de Teil 1A y carga los textos de `praesentation-texte.js`.

**Cómo funciona (flujo del estudiante):**
1. El estudiante elige cuál tema presentó ÉL en Teil 1A (ej: "a1: Erfindungen")
2. El sistema le muestra un texto de presentación DIFERENTE (aleatorio de los otros 5)
3. El estudiante debe resumir ese texto (como si hubiera escuchado a su compañero)

**Relación Teil 1A → Teil 1B → praesentation-texte.js:**

```
Teil 1A (praesentation.html)     praesentation-texte.js          Teil 1B (zusammenfassung.html)
─────────────────────────────    ──────────────────────────       ────────────────────────────────
Tema a1: "Erfindungen"      →   Texto a1: presentación sobre  →  Botón "Thema 1: Erfindungen"
                                 el internet (~340 palabras)
Tema a2: "Universitätssystem"→   Texto a2: presentación sobre  →  Botón "Thema 2: Universitätssystem"
                                 Hochschulsystem (~370 pal.)
Tema b1: "Studien-/Berufswahl"→ Texto b1: presentación sobre  →  Botón "Thema 1: Studien-/Berufswahl"
                                 elección de carrera (~360 pal.)
... (6 temas en total)
```

**Qué debes actualizar en `5-muendlich-zusammenfassung.html`:**

Los textos de los botones deben coincidir con los temas de Teil 1A:

```html
<h3 style="...">Teilnehmer/in A - Themen:</h3>
<div class="thema-auswahl-grid">
  <button class="thema-btn" data-thema="a1">Thema 1: Erfindungen</button>
  <button class="thema-btn" data-thema="a2">Thema 2: Universitätssystem</button>
</div>

<h3 style="...">Teilnehmer/in B - Themen:</h3>
<div class="thema-auswahl-grid">
  <button class="thema-btn" data-thema="b1">Thema 1: Studien-/Berufswahl</button>
  <button class="thema-btn" data-thema="b2">Thema 2: Künstlerische Fächer</button>
</div>

<h3 style="...">Teilnehmer/in C - Themen:</h3>
<div class="thema-auswahl-grid">
  <button class="thema-btn" data-thema="c1">Thema 1: Fremdsprachen lernen</button>
  <button class="thema-btn" data-thema="c2">Thema 2: Natur- vs Geisteswissenschaften</button>
</div>
```

> Las claves `data-thema="a1"`, `"a2"`, etc. **deben** coincidir con las claves en `praesentation-texte.js`.

**Qué debes crear en `praesentation-texte.js`:**

Un texto de presentación completo (350–450 palabras) por cada tema de Teil 1A. Cada texto simula lo que un compañero habría presentado sobre ese tema. Ver [sección 6](#6-formato-de-praesentation-textejs) para el formato exacto.

**Ejemplo de coherencia (Modell 1):**

| Teil 1A tema | praesentation-texte.js texto | Teil 1B botón |
|-------------|------------------------------|---------------|
| a1: „Welche Erfindung halten Sie für besonders wichtig?" | Presentación sobre el Internet como invención (340 pal.) | „Thema 1: Erfindungen" |
| a2: „Beschreiben Sie das System der universitären Ausbildung…" | Presentación sobre el sistema universitario alemán (370 pal.) | „Thema 2: Universitätssystem" |
| b1: „Beschreiben Sie, welche Erfahrungen…" | Presentación sobre el camino hacia Gesundheitswissenschaften (360 pal.) | „Thema 1: Studien-/Berufswahl" |
| b2: „Welche künstlerischen Fächer…?" | Presentación sobre Musik, Kunst, Theater en la escuela (400 pal.) | „Thema 2: Künstlerische Fächer" |
| c1: „Wie man Fremdsprachen lernt…" | Presentación sobre diferencias culturales en 3 países (400 pal.) | „Thema 1: Fremdsprachen lernen" |
| c2: „Welche Fächer sind wichtiger…?" | Presentación sobre Natur- vs. Geisteswissenschaften (450 pal.) | „Thema 2: Natur- vs Geisteswissenschaften" |

---

### 4.11 Mündliche Prüfung Teil 2 — Diskussion

**Tipo:** 4 citas de autores famosos con aspectos de discusión. ~6 min de discusión con compañero.

**Cómo rellenar:**

1. Las 4 citas con autor y aspectos:

```html
<div class="zitat-box">
  <div class="zitat-nummer">Diskussionsthema 1</div>
  <div class="zitat-text">„La cita aquí."</div>
  <div class="zitat-autor">— Nombre del Autor (1800–1870), Profesión</div>
  <div class="diskussionsfragen">
    <h4>Mögliche Diskussionsaspekte:</h4>
    <ul>
      <li>Aspecto 1?</li>
      <li>Aspecto 2?</li>
      <li>Aspecto 3?</li>
      <li>Aspecto 4?</li>
    </ul>
  </div>
</div>
```

2. La configuración JS:

```javascript
Pruefung.initDiskussion({
  1: { text:'Cita 1.', autor:'Autor 1 (años), profesión',
       aspekte:['Aspecto 1?','Aspecto 2?','Aspecto 3?','Aspecto 4?'] },
  2: { text:'Cita 2.', autor:'Autor 2',
       aspekte:['...','...','...','...'] },
  3: { text:'Cita 3.', autor:'Autor 3',
       aspekte:['...','...','...','...'] },
  4: { text:'Cita 4.', autor:'Autor 4',
       aspekte:['...','...','...','...'] }
});
```

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

> **Atención LV3:** Usa los símbolos Unicode `−` (minus sign) y `×` (multiplication sign), NO el guión `-` ni la letra `x`.

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

### HTML (contenido)

- [ ] `1-leseverstehen-teil-1.html` — Texto (~250 palabras) + 8+1 opciones + respuestas
- [ ] `1-leseverstehen-teil-2.html` — Texto 5 párrafos (~700 palabras) + 6 preguntas + respuestas
- [ ] `1-leseverstehen-teil-3.html` — Texto largo (~1100 palabras) + 11 aussagen + 1 global + respuestas
- [ ] `2-sprachbausteine.html` — Texto (~250 palabras) + 23 lücken × 4 opciones + respuestas
- [ ] `3-hoerverstehen-teil-1.html` — Tema + 10 aussagen + respuestas
- [ ] `3-hoerverstehen-teil-2.html` — Tema + 10 preguntas × 3 opciones + respuestas
- [ ] `3-hoerverstehen-teil-3.html` — Slides + 10+ lücken + keywords + labels
- [ ] `4-schriftlicher-ausdruck.html` — 2 temas × 2 citas + config JS
- [ ] `5-muendlich-praesentation.html` — 6 temas (A1,A2,B1,B2,C1,C2) + config JS
- [ ] `5-muendlich-zusammenfassung.html` — Botones actualizados con los nombres de temas de Teil 1A (a1, a2, b1, b2, c1, c2)
- [ ] `5-muendlich-diskussion.html` — 4 citas con autor + aspectos + config JS

### JavaScript (datos)

- [ ] `exam-data.js` — Todas las respuestas correctas (lv1, lv2, lv3, sb, hv1, hv2, hv3)
- [ ] `exam-data.js` — themaTexte (6 textos de presentación resumidos)
- [ ] `exam-data.js` — saThemen (2 temas SA con citas)
- [ ] `exam-data.js` — diskussionZitate (4 citas con aspectos)
- [ ] `praesentation-texte.js` — 6 textos completos (350–450 palabras c/u) con versión `text` y `html`
- [ ] `praesentation-texte.js` — Función `getRandomPartnerPraesentation` (copiar idéntica)

### Verificación

- [ ] Las respuestas en el `<script>` de cada HTML coinciden con `exam-data.js`
- [ ] Los números de pregunta son consecutivos y correctos (1–6, 7–12, 13–24, 25–47, 47–54, 55–64, 65–74)
- [ ] Los temas de SA en el HTML coinciden con los de `exam-data.js`
- [ ] Los temas de presentación en el HTML coinciden con `exam-data.js` y `praesentation-texte.js`
- [ ] Las citas de diskussion en el HTML coinciden con `exam-data.js`
- [ ] Los caracteres especiales están correctos: `−` (Unicode minus), `×` (Unicode times), `„"` (comillas alemanas)

---

## Resumen rápido

| Esfuerzo | Porcentaje |
|----------|-----------|
| Rellenar HTML con contenido de PDFs | 90% |
| Actualizar exam-data.js con respuestas | 5% |
| Escribir/copiar praesentation-texte.js | 5% |

**No necesitas:** cambiar lógica, crear componentes, modificar CSS, tocar archivos compartidos.
