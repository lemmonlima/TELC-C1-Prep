# Diseño Estándar – Documentación Técnica

**Ubicación:** `TELC/Indicaciones/disenno estandar.md`

## Descripción General

Este documento describe el formato estándar utilizado para crear documentos de contenido gramatical en el sistema TELC. El formato se basa en Markdown con tokens semánticos que permiten colorear y categorizar elementos gramaticales específicos. Este sistema se utiliza en documentos como "Verben mit Rektion – systematisch lernen", "Adjektive mit Rektion – verständlich aufgebaut" y "Satzglieder – strukturiert lernen".

---

## Estructura del Documento

### Formato Markdown Básico

Los documentos utilizan Markdown estándar con las siguientes características:

1. **Encabezados:**
   - `# Título principal` → `<h1>`
   - `## Sección` → `<h2>`
   - `### Subsección` → `<h3>`

2. **Listas:**
   - `- Item de lista` → `<li>` dentro de `<ul>`

3. **Texto en negrita:**
   - `**texto**` → `<strong>texto</strong>`

4. **Código inline:**
   - `` `código` `` → `<code>código</code>`

5. **Líneas vacías:**
   - Se convierten en `<div class="doc-spacer"></div>` para espaciado

---

## Tokens Semánticos

### Sistema de Tokens

Los tokens semánticos utilizan la sintaxis `{tipo:contenido}` y se convierten automáticamente en elementos `<span>` con clases CSS específicas que aplican colores y estilos.

### Formato de Escritura

**Sintaxis:**
```
{tipo:contenido}
```

**Ejemplos:**
```markdown
{v:arbeiten} {p:an} {d:einem neuen Roman}
{adj:ähnlich}: Er ist {d:seinem Bruder} {adj:ähnlich}.
{subj:Wir} {pred:gehen} {dir:zur Vorlesung}.
```

**Reglas:**
- Los tokens pueden aparecer en cualquier parte del texto
- Pueden combinarse múltiples tokens en una misma línea
- El contenido dentro del token puede incluir espacios y caracteres especiales
- Los tokens se procesan en orden secuencial

---

## Tokens Disponibles y sus Colores

### 1. Verben (Verbos)

**Token:** `{v:...}`  
**Clase CSS:** `.mark-verb`  
**Color:**
- Fondo: `rgba(255, 84, 84, 0.22)` (rojo claro)
- Texto: `#ffe1e1` (rosa muy claro)
- Borde inferior: `rgba(255, 84, 84, 0.7)` (rojo)

**Ejemplo:**
```markdown
{v:arbeiten} {p:an} {d:einem neuen Roman}
```
Se renderiza como: `<span class="mark mark-verb">arbeiten</span>`

---

### 2. Adjektive (Adjetivos)

**Token:** `{adj:...}`  
**Clase CSS:** `.mark-adj`  
**Color:**
- Fondo: `rgba(255, 191, 112, 0.18)` (naranja claro)
- Texto: `#ffe0b5` (beige claro)
- Borde inferior: `rgba(255, 191, 112, 0.75)` (naranja)

**Ejemplo:**
```markdown
{adj:ähnlich}: Er ist {d:seinem Bruder} {adj:ähnlich}.
```

---

### 3. Präpositionen (Preposiciones)

**Token:** `{p:...}`  
**Clase CSS:** `.mark-prep`  
**Color:**
- Fondo: `rgba(255, 255, 255, 0.08)` (blanco muy transparente)
- Texto: `#e9e4dc` (beige claro)
- Borde inferior: `rgba(255, 255, 255, 0.4)` (blanco)

**Ejemplo:**
```markdown
{v:arbeiten} {p:an} {d:einem neuen Roman}
```

---

### 4. Kasus (Casos Gramaticales)

#### Akkusativ

**Token:** `{a:...}`  
**Clase CSS:** `.mark-a`  
**Color:**
- Fondo: `rgba(255, 168, 104, 0.2)` (naranja claro)
- Texto: `#ffd2b2` (melocotón claro)
- Borde inferior: `rgba(255, 168, 104, 0.75)` (naranja)

**Ejemplo:**
```markdown
{v:achten} {p:auf} {a:den Verkehr}
```

#### Dativ

**Token:** `{d:...}`  
**Clase CSS:** `.mark-d`  
**Color:**
- Fondo: `rgba(104, 171, 214, 0.18)` (azul claro)
- Texto: `#cde9fb` (azul muy claro)
- Borde inferior: `rgba(104, 171, 214, 0.75)` (azul)

**Ejemplo:**
```markdown
{v:arbeiten} {p:an} {d:einem neuen Roman}
```

#### Genitiv

**Token:** `{g:...}`  
**Clase CSS:** `.mark-g`  
**Color:**
- Fondo: `rgba(91, 201, 152, 0.18)` (verde claro)
- Texto: `#c6f3e1` (verde muy claro)
- Borde inferior: `rgba(91, 201, 152, 0.75)` (verde)

**Ejemplo:**
```markdown
{v:bedürfen}: Das Symbol {v:bedarf} {g:keiner Erklärung}.
```

---

### 5. Nomen (Sustantivos)

**Token:** `{n:...}`  
**Clase CSS:** `.mark-n`  
**Color:**
- Fondo: `rgba(200, 200, 200, 0.12)` (gris claro)
- Texto: `#e6e1db` (beige grisáceo)
- Borde inferior: `rgba(230, 225, 219, 0.4)` (beige)

**Ejemplo:**
```markdown
Der Delfin {v:ist} {n:ein Säugetier}.
```

---

### 6. Satzglieder (Constituyentes de la Oración)

#### Prädikat (Predicado)

**Token:** `{pred:...}`  
**Clase CSS:** `.mark-praedikat`  
**Color:**
- Fondo: `rgba(255, 84, 84, 0.22)` (rojo claro)
- Texto: `#ffe1e1` (rosa muy claro)
- Borde inferior: `rgba(255, 84, 84, 0.7)` (rojo)

**Ejemplo:**
```markdown
Sie {pred:spielen}. {pred:Hat} er {pred:gewonnen}?
```

#### Subjekt (Sujeto)

**Token:** `{subj:...}`  
**Clase CSS:** `.mark-subjekt`  
**Color:**
- Fondo: `rgba(93, 173, 255, 0.25)` (azul claro)
- Texto: `#d7e9ff` (azul muy claro)
- Borde inferior: `rgba(93, 173, 255, 0.7)` (azul)

**Ejemplo:**
```markdown
{subj:Wir} {pred:gehen} {dir:zur Vorlesung}.
```

#### Akkusativ-Ergänzung

**Token:** `{akk:...}`  
**Clase CSS:** `.mark-akk`  
**Color:**
- Fondo: `rgba(255, 168, 104, 0.24)` (naranja claro)
- Texto: `#ffd7b9` (melocotón claro)
- Borde inferior: `rgba(255, 168, 104, 0.75)` (naranja)

**Ejemplo:**
```markdown
{subj:Das Mädchen} {pred:gab} {dat:seinem Freund} {akk:den Hausschlüssel}.
```

#### Dativ-Ergänzung

**Token:** `{dat:...}`  
**Clase CSS:** `.mark-dat`  
**Color:**
- Fondo: `rgba(104, 171, 214, 0.22)` (azul claro)
- Texto: `#cfe9fb` (azul muy claro)
- Borde inferior: `rgba(104, 171, 214, 0.75)` (azul)

**Ejemplo:**
```markdown
{subj:Das Mädchen} {pred:gab} {dat:seinem Freund} {akk:den Hausschlüssel}.
```

#### Genitiv-Ergänzung

**Token:** `{gen:...}`  
**Clase CSS:** `.mark-gen`  
**Color:**
- Fondo: `rgba(91, 201, 152, 0.22)` (verde claro)
- Texto: `#c9f4e3` (verde muy claro)
- Borde inferior: `rgba(91, 201, 152, 0.75)` (verde)

**Ejemplo:**
```markdown
Der Kranke bedarf {gen:ärztlicher Hilfe}.
```

#### Präpositional-Ergänzung

**Token:** `{prep-erg:...}`  
**Clase CSS:** `.mark-prep-erg`  
**Color:**
- Fondo: `rgba(177, 140, 255, 0.24)` (púrpura claro)
- Texto: `#efe2ff` (púrpura muy claro)
- Borde inferior: `rgba(177, 140, 255, 0.75)` (púrpura)

**Ejemplo:**
```markdown
Ich interessiere mich {prep-erg:für alte Musik}.
```

#### Situativ-Ergänzung

**Token:** `{sit:...}`  
**Clase CSS:** `.mark-situativ`  
**Color:**
- Fondo: `rgba(92, 203, 191, 0.24)` (turquesa claro)
- Texto: `#d8fff6` (turquesa muy claro)
- Borde inferior: `rgba(92, 203, 191, 0.7)` (turquesa)

**Ejemplo:**
```markdown
Die Insel Rügen liegt {sit:in der Ostsee}.
```

#### Direktiv-Ergänzung

**Token:** `{dir:...}`  
**Clase CSS:** `.mark-direktiv`  
**Color:**
- Fondo: `rgba(244, 191, 72, 0.26)` (amarillo claro)
- Texto: `#ffe8b5` (amarillo muy claro)
- Borde inferior: `rgba(244, 191, 72, 0.75)` (amarillo)

**Ejemplo:**
```markdown
{subj:Wir} {pred:gehen} {dir:zur Vorlesung}.
```

#### Expansiv-Ergänzung

**Token:** `{exp:...}`  
**Clase CSS:** `.mark-expansiv`  
**Color:**
- Fondo: `rgba(255, 126, 189, 0.26)` (rosa claro)
- Texto: `#ffe0f1` (rosa muy claro)
- Borde inferior: `rgba(255, 126, 189, 0.75)` (rosa)

**Ejemplo:**
```markdown
Der Eintritt kostet {exp:einen Euro}.
```

#### Nominal-Ergänzung

**Token:** `{nom-erg:...}`  
**Clase CSS:** `.mark-nominal`  
**Color:**
- Fondo: `rgba(158, 158, 158, 0.22)` (gris)
- Texto: `#ececec` (gris claro)
- Borde inferior: `rgba(158, 158, 158, 0.55)` (gris)

**Ejemplo:**
```markdown
Margret ist {nom-erg:Lehrerin}.
```

---

### 7. Angaben (Complementos Circunstanciales)

#### Temporal-Angabe

**Token:** `{ang-temporal:...}`  
**Clase CSS:** `.mark-ang-temporal`  
**Color:**
- Fondo: `rgba(92, 203, 191, 0.24)` (turquesa claro)
- Texto: `#d8fff6` (turquesa muy claro)
- Borde inferior: `rgba(92, 203, 191, 0.75)` (turquesa)

**Ejemplo:**
```markdown
Wir gehen {ang-temporal:jeden Tag} zur Vorlesung.
```

#### Kausal-Angabe

**Token:** `{ang-kausal:...}`  
**Clase CSS:** `.mark-ang-kausal`  
**Color:**
- Fondo: `rgba(255, 164, 93, 0.26)` (naranja claro)
- Texto: `#ffe0c2` (melocotón claro)
- Borde inferior: `rgba(255, 164, 93, 0.75)` (naranja)

**Ejemplo:**
```markdown
{ang-kausal:Wegen des Gewitters} blieb ich im Haus.
```

#### Final-Angabe

**Token:** `{ang-final:...}`  
**Clase CSS:** `.mark-ang-final`  
**Color:**
- Fondo: `rgba(177, 140, 255, 0.24)` (púrpura claro)
- Texto: `#efe2ff` (púrpura muy claro)
- Borde inferior: `rgba(177, 140, 255, 0.75)` (púrpura)

**Ejemplo:**
```markdown
Ich fahre {ang-final:zur Erholung} an die See.
```

#### Konditional-Angabe

**Token:** `{ang-kond:...}`  
**Clase CSS:** `.mark-ang-konditional`  
**Color:**
- Fondo: `rgba(93, 173, 255, 0.25)` (azul claro)
- Texto: `#d7e9ff` (azul muy claro)
- Borde inferior: `rgba(93, 173, 255, 0.75)` (azul)

**Ejemplo:**
```markdown
{ang-kond:Bei diesem Lärm} kann ich nicht lernen.
```

#### Konzessiv-Angabe

**Token:** `{ang-konz:...}`  
**Clase CSS:** `.mark-ang-konzessiv`  
**Color:**
- Fondo: `rgba(255, 126, 189, 0.26)` (rosa claro)
- Texto: `#ffe0f1` (rosa muy claro)
- Borde inferior: `rgba(255, 126, 189, 0.75)` (rosa)

**Ejemplo:**
```markdown
{ang-konz:Trotz des Regens} gehen wir spazieren.
```

#### Lokal-Angabe

**Token:** `{ang-lokal:...}`  
**Clase CSS:** `.mark-ang-lokal`  
**Color:**
- Fondo: `rgba(121, 216, 138, 0.24)` (verde claro)
- Texto: `#def9e6` (verde muy claro)
- Borde inferior: `rgba(121, 216, 138, 0.75)` (verde)

**Ejemplo:**
```markdown
Das Mädchen gab ihm den Schlüssel {ang-lokal:im Auto}.
```

#### Modal-Angabe

**Token:** `{ang-modal:...}`  
**Clase CSS:** `.mark-ang-modal`  
**Color:**
- Fondo: `rgba(244, 191, 72, 0.26)` (amarillo claro)
- Texto: `#ffe8b5` (amarillo muy claro)
- Borde inferior: `rgba(244, 191, 72, 0.75)` (amarillo)

**Ejemplo:**
```markdown
Otto musste {ang-modal:schwer} arbeiten.
```

#### Instrumental-Angabe

**Token:** `{ang-instr:...}`  
**Clase CSS:** `.mark-ang-instrumental`  
**Color:**
- Fondo: `rgba(122, 215, 255, 0.24)` (azul claro)
- Texto: `#dff5ff` (azul muy claro)
- Borde inferior: `rgba(122, 215, 255, 0.7)` (azul)

**Ejemplo:**
```markdown
Wir waschen uns die Hände {ang-instr:mit Seife}.
```

#### Referenz-Angabe

**Token:** `{ang-referenz:...}`  
**Clase CSS:** `.mark-ang-referenz`  
**Color:**
- Fondo: `rgba(196, 155, 255, 0.24)` (púrpura claro)
- Texto: `#f1e6ff` (púrpura muy claro)
- Borde inferior: `rgba(196, 155, 255, 0.75)` (púrpura)

**Ejemplo:**
```markdown
{ang-referenz:Meiner Meinung nach} ist das zu schwer.
```

#### Negations-Angabe

**Token:** `{ang-neg:...}`  
**Clase CSS:** `.mark-ang-negation`  
**Color:**
- Fondo: `rgba(158, 158, 158, 0.22)` (gris)
- Texto: `#ececec` (gris claro)
- Borde inferior: `rgba(158, 158, 158, 0.55)` (gris)

**Ejemplo:**
```markdown
{ang-kausal:Warum} habt ihr {ang-neg:nicht} auf mich gewartet?
```

---

## Procesamiento de Tokens

### Función `formatInline()`

La función `formatInline()` en `grammatik.js` procesa los tokens semánticos en el siguiente orden:

1. **Escape HTML:** Previene XSS escapando caracteres especiales
2. **Código inline:** Procesa `` `código` ``
3. **Negrita:** Procesa `**texto**`
4. **Tokens semánticos:** Reemplaza cada token con su `<span>` correspondiente

### Orden de Procesamiento

Los tokens se procesan en este orden específico (importante para evitar conflictos):

1. `{v:...}` → Verben
2. `{adj:...}` → Adjektive
3. `{p:...}` → Präpositionen
4. `{a:...}` → Akkusativ
5. `{d:...}` → Dativ
6. `{g:...}` → Genitiv
7. `{n:...}` → Nomen
8. `{pred:...}` → Prädikat
9. `{subj:...}` → Subjekt
10. `{akk:...}` → Akkusativ-Ergänzung
11. `{dat:...}` → Dativ-Ergänzung
12. `{gen:...}` → Genitiv-Ergänzung
13. `{prep-erg:...}` → Präpositional-Ergänzung
14. `{sit:...}` → Situativ-Ergänzung
15. `{dir:...}` → Direktiv-Ergänzung
16. `{exp:...}` → Expansiv-Ergänzung
17. `{nom-erg:...}` → Nominal-Ergänzung
18. `{ang-temporal:...}` → Temporal-Angabe
19. `{ang-kausal:...}` → Kausal-Angabe
20. `{ang-final:...}` → Final-Angabe
21. `{ang-kond:...}` → Konditional-Angabe
22. `{ang-konz:...}` → Konzessiv-Angabe
23. `{ang-lokal:...}` → Lokal-Angabe
24. `{ang-modal:...}` → Modal-Angabe
25. `{ang-instr:...}` → Instrumental-Angabe
26. `{ang-referenz:...}` → Referenz-Angabe
27. `{ang-neg:...}` → Negations-Angabe

---

## Estructura de Documentos de Referencia

### Verben mit Rektion – systematisch lernen

**Estructura típica:**
```markdown
# Verben mit Rektion – systematisch lernen

## 1) Was bedeutet Rektion?
Ein Verb "regiert" eine bestimmte Präposition oder einen Fall.
**Beispiel:** {v:sich freuen} {p:über} {a:den Anruf} / {p:auf} {a:die Ferien}
- Ich {v:freue} mich {p:über} {a:den Anruf}.
- Wir {v:freuen} uns {p:auf} {a:die Ferien}.

## 2) Kernlisten nach Präpositionen

### a) + {p:an} {d:Dativ}
- {v:arbeiten} {p:an}: Die Autorin {v:arbeitet} {p:an} {d:einem neuen Roman}.
- {v:sich orientieren} {p:an}: Wir {v:orientieren} uns {p:an} {d:der Mittellinie}.
```

**Características:**
- Organización por preposiciones
- Ejemplos completos con tokens
- Separación clara entre verbo, preposición y caso

---

### Adjektive mit Rektion – verständlich aufgebaut

**Estructura típica:**
```markdown
# Adjektive mit Rektion – verständlich aufgebaut

## 1) Adjektive mit Dativ (ohne Präposition)
- {adj:ähnlich}: Er ist {d:seinem Bruder} {adj:ähnlich}.
- {adj:behilflich}: Der Assistent war {d:mir} {adj:behilflich}.

## 3) Adjektive + Präposition (Kernliste)
**{p:von} {d:Dativ}**
- {adj:abhängig} {p:von}: Die Entscheidung ist {adj:abhängig} {p:von} {d:dem Ausgang}.
```

**Características:**
- Organización por tipo de rección
- Ejemplos con adjetivo marcado
- Separación entre adjetivo, preposición y caso

---

### Satzglieder – strukturiert lernen

**Estructura típica:**
```markdown
# Satzglieder – strukturiert lernen

## 1) Was sind Satzglieder?
Wir unterscheiden drei Arten von Satzgliedern:

### 1. Prädikate
Sie {pred:spielen}. {pred:Hat} er {pred:gewonnen}?

### 2. Ergänzungen
Beispiel:
{subj:Wir} {pred:gehen} {dir:zur Vorlesung}.
{subj:Nominativ-Ergänzung} (= {subj:Subjekt}) · {dir:Direktiv-Ergänzung} {dir:(wohin?)}
```

**Características:**
- Organización por tipo de Satzglied
- Ejemplos completos con múltiples tokens
- Explicaciones teóricas con tokens integrados

---

## Reglas de Escritura

### 1. Uso de Tokens en Ejemplos

**Correcto:**
```markdown
- {v:arbeiten} {p:an}: Die Autorin {v:arbeitet} {p:an} {d:einem neuen Roman}.
```

**Incorrecto:**
```markdown
- arbeiten an: Die Autorin arbeitet an einem neuen Roman.
```

### 2. Tokens Múltiples en una Línea

Los tokens pueden combinarse libremente:
```markdown
{subj:Das Mädchen} {pred:gab} {dat:seinem Freund} {akk:den Hausschlüssel}.
```

### 3. Tokens con Contenido Complejo

El contenido dentro de los tokens puede incluir espacios y palabras múltiples:
```markdown
{prep-erg:für alte Musik}
{ang-kausal:Wegen des Gewitters}
{d:einem neuen Roman}
```

### 4. Tokens en Encabezados

Los tokens funcionan en encabezados:
```markdown
### a) + {p:an} {d:Dativ}
```

### 5. Tokens en Listas

Los tokens funcionan dentro de items de lista:
```markdown
- {v:arbeiten} {p:an}: Die Autorin {v:arbeitet} {p:an} {d:einem neuen Roman}.
- {v:sich orientieren} {p:an}: Wir {v:orientieren} uns {p:an} {d:der Mittellinie}.
```

---

## Estilos CSS

### Clase Base `.mark`

Todas las clases de tokens heredan de `.mark`:

```css
.mark {
  /* Estilos base comunes */
  padding: 2px 4px;
  border-radius: 4px;
  border-bottom: 2px solid;
  font-weight: 500;
}
```

### Esquema de Colores

El sistema utiliza un esquema de colores consistente:

- **Rojo/Rosa:** Verben, Prädikate
- **Azul:** Subjekt, Dativ, Konditional-Angabe
- **Naranja/Amarillo:** Akkusativ, Modal-Angabe, Direktiv
- **Verde:** Genitiv, Lokal-Angabe
- **Púrpura:** Präpositional-Ergänzung, Final-Angabe, Referenz-Angabe
- **Turquesa:** Situativ, Temporal-Angabe
- **Rosa:** Expansiv, Konzessiv-Angabe
- **Gris:** Nomen, Nominal-Ergänzung, Negations-Angabe
- **Blanco/Beige:** Präpositionen, Adjektive

---

## Ejemplos Completos

### Ejemplo 1: Verben mit Rektion

```markdown
## 2) Kernlisten nach Präpositionen

### a) + {p:an} {d:Dativ}
- {v:arbeiten} {p:an}: Die Autorin {v:arbeitet} {p:an} {d:einem neuen Roman}.
- {v:sich orientieren} {p:an}: Wir {v:orientieren} uns {p:an} {d:der Mittellinie}.
- {v:erinnern} {p:an} / {v:sich erinnern} {p:an}: Ich {v:erinnere} dich {p:an} {a:den Termin}.
```

### Ejemplo 2: Adjektive mit Rektion

```markdown
## 3) Adjektive + Präposition (Kernliste)
**{p:von} {d:Dativ}**
- {adj:abhängig} {p:von}: Die Entscheidung ist {adj:abhängig} {p:von} {d:dem Ausgang}.
- {adj:enttäuscht} {p:von}: Sind Sie {p:von} {d:dem Film} {adj:enttäuscht}?
```

### Ejemplo 3: Satzglieder

```markdown
### 2. Ergänzungen
Beispiel:
{subj:Wir} {pred:gehen} {dir:zur Vorlesung}. {dir:In die Mensa}. {dir:Nach Hause}.
{subj:Nominativ-Ergänzung} (= {subj:Subjekt}) · {dir:Direktiv-Ergänzung} {dir:(wohin?)}
```

---

## Notas de Implementación

1. **Procesamiento Secuencial:** Los tokens se procesan en orden específico para evitar conflictos de regex.

2. **Escape HTML:** Todo el contenido se escapa antes de procesar tokens para prevenir XSS.

3. **Preservación de Formato:** Los tokens no afectan el formato Markdown (listas, encabezados, etc.).

4. **Compatibilidad:** Los tokens funcionan en todos los contextos Markdown (párrafos, listas, encabezados).

5. **Rendimiento:** El procesamiento es eficiente gracias a regex optimizado.

---

## Extensibilidad

Para agregar nuevos tokens:

1. **Agregar regex en `formatInline()`:**
   ```javascript
   line = line.replace(/\{nuevo-token:([^}]+)\}/g, '<span class="mark mark-nuevo-token">$1</span>');
   ```

2. **Agregar CSS en `styles.css`:**
   ```css
   .mark-nuevo-token {
     background: rgba(r, g, b, 0.2);
     color: #color-texto;
     border-bottom-color: rgba(r, g, b, 0.7);
   }
   ```

3. **Documentar en este archivo:** Agregar la nueva sección con ejemplos.

---

## Referencias

- **Archivo de procesamiento:** `TELC/WEB/grammatik/grammatik.js`
- **Archivo de estilos:** `TELC/WEB/styles.css`
- **Documentos de ejemplo:**
  - `TELC/WEB/grammatik/verben/content.md`
  - `TELC/WEB/grammatik/adjektive/content.md`
  - `TELC/WEB/grammatik/satzglieder/uebersicht/content.md`

---

## Resumen de Tokens

| Token | Tipo | Color Principal |
|-------|------|-----------------|
| `{v:...}` | Verben | Rojo |
| `{adj:...}` | Adjektive | Naranja |
| `{p:...}` | Präpositionen | Blanco/Beige |
| `{a:...}` | Akkusativ | Naranja |
| `{d:...}` | Dativ | Azul |
| `{g:...}` | Genitiv | Verde |
| `{n:...}` | Nomen | Gris |
| `{pred:...}` | Prädikat | Rojo |
| `{subj:...}` | Subjekt | Azul |
| `{akk:...}` | Akkusativ-Ergänzung | Naranja |
| `{dat:...}` | Dativ-Ergänzung | Azul |
| `{gen:...}` | Genitiv-Ergänzung | Verde |
| `{prep-erg:...}` | Präpositional-Ergänzung | Púrpura |
| `{sit:...}` | Situativ-Ergänzung | Turquesa |
| `{dir:...}` | Direktiv-Ergänzung | Amarillo |
| `{exp:...}` | Expansiv-Ergänzung | Rosa |
| `{nom-erg:...}` | Nominal-Ergänzung | Gris |
| `{ang-temporal:...}` | Temporal-Angabe | Turquesa |
| `{ang-kausal:...}` | Kausal-Angabe | Naranja |
| `{ang-final:...}` | Final-Angabe | Púrpura |
| `{ang-kond:...}` | Konditional-Angabe | Azul |
| `{ang-konz:...}` | Konzessiv-Angabe | Rosa |
| `{ang-lokal:...}` | Lokal-Angabe | Verde |
| `{ang-modal:...}` | Modal-Angabe | Amarillo |
| `{ang-instr:...}` | Instrumental-Angabe | Azul |
| `{ang-referenz:...}` | Referenz-Angabe | Púrpura |
| `{ang-neg:...}` | Negations-Angabe | Gris |

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0

