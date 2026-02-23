# CLAUDE.md — TELC C1 Hochschule Prep Site

This file documents the codebase structure, conventions, and workflows for AI assistants working on this repository.

---

## Project Overview

A **static HTML/CSS/JS web application** for preparing the TELC Deutsch C1 Hochschule exam. The site is hosted on **GitHub Pages** (deploys automatically from the `docs/` folder on the `main` branch). There is no build step, no bundler, no framework, and no package manager — everything is vanilla HTML, CSS, and JavaScript.

The primary language of the content is **German** (the exam language). Documentation files in `Indicaciones/` and `docs/` are written in Spanish (the developer's language). Comments in JS are often in Spanish.

**Live site:** Served from `docs/` via GitHub Pages.

---

## Repository Structure

```
TELC-C1-Prep/
├── .github/
│   └── workflows/
│       └── pages.yml          # GitHub Actions: deploys docs/ to GitHub Pages on push to main
├── docs/                      # THE ENTIRE WEBSITE — everything served from here
│   ├── index.html             # Home page (main landing)
│   ├── app.js                 # Home page JS: loads data.json, renders all sections
│   ├── data.json              # Program data: modules, milestones, exams, stats (drives home page)
│   ├── styles.css             # Global stylesheet (~87KB, all components)
│   ├── styles-mobile-ether.css # Mobile/tablet overrides
│   ├── topbar.js              # Navigation bar component (SINGLE SOURCE OF TRUTH for nav)
│   ├── navigation.js          # Smart navigation + scroll preservation
│   ├── scroll-restore.js      # Scroll position restoration utility
│   ├── template-example.html  # Reference template for new pages
│   ├── grammatik/             # Grammar section
│   │   ├── index.html         # Grammar section index
│   │   ├── grammatik.js       # Grammar renderer: parses content.md files + semantic tokens
│   │   ├── labeler.js         # Sentence labeling utility
│   │   └── [topic]/           # One folder per grammar topic
│   │       ├── uebersicht/content.md   # Theory content (Markdown + semantic tokens)
│   │       └── uebungen/content.md     # Exercises content
│   ├── pruefungen/            # Exam practice section
│   │   ├── index.html         # Exam practice index
│   │   ├── GUIA-NUEVO-MODELLTEST.md   # Critical guide for creating new model tests
│   │   ├── shared/            # Shared exam engine (used by all Modelltests)
│   │   │   ├── section-builders.js    # Generates exam section HTML from data
│   │   │   ├── exam-engine.js         # Exam flow/timer engine
│   │   │   ├── pruefung.js            # Scoring and evaluation logic
│   │   │   ├── exam.css               # Exam page styles
│   │   │   └── pruefung.css           # Evaluation styles
│   │   ├── _vorlage/          # Template for new Modelltests (ALWAYS copy from here)
│   │   │   ├── exam-data.js           # Template exam data (fill in content)
│   │   │   └── praesentation-texte.js # Template oral texts
│   │   ├── modell-1/          # Modelltest 1 (complete)
│   │   ├── modell-2/          # Modelltest 2
│   │   ├── modell-3/          # Modelltest 3
│   │   ├── modell-4/          # Modelltest 4
│   │   └── modell-5/          # Modelltest 5
│   ├── texte/                 # Reading/writing texts section
│   │   ├── index.html
│   │   ├── styles-mobile-texte.css
│   │   ├── texte/             # Individual text pages
│   │   └── produktion-ds/     # Writing production pages
│   ├── tips/                  # Exam tips and strategies by section
│   │   └── einfuehrung/       # "Einstufung" (level assessment) entry point
│   ├── woerter/               # Vocabulary flashcard system
│   │   ├── index.html         # Main vocabulary view (graph/tree)
│   │   ├── woerter.json       # Vocabulary data (add words here)
│   │   ├── woerter.js         # Main vocabulary renderer
│   │   ├── woerter-flashcards.html  # Flashcard mode
│   │   ├── woerter-flashcards.js
│   │   ├── solo.html          # Solo study view
│   │   ├── list-view.js       # List view renderer
│   │   ├── mobile-gestures.js # Touch gesture support
│   │   └── node-size-control.js # Graph node sizing
│   └── notizen/               # Notes/phrases section
│       ├── index.html
│       ├── notizen.json       # Notes data
│       ├── notizen.js         # Notes renderer
│       └── notizen-explanations.json # Explanations for notes
├── Grammatik/                 # Source Markdown files for grammar content
│   ├── Angaben.md
│   ├── Angaben-Uebungen.md
│   ├── Attribute.md
│   ├── Ergaenzungen-Uebungen.md
│   └── Reaktionen/
│       └── Reaktionen.md
├── GrammatikBuch.md           # Full grammar reference book in Markdown
├── Indicaciones/              # Developer documentation (in Spanish)
│   ├── Ind.md                 # Quick prompt references
│   ├── disenno estandar.md    # TELC design standards (tokens, colors, CSS conventions)
│   ├── Flashcards-Documentacion.md
│   ├── MultipleMultiple.md
│   ├── Multiplechoice.md
│   ├── Notizen-Explanation-System.md
│   ├── Textvergleich-Documentacion.md
│   ├── Test-Dropdown-Documentacion.md
│   ├── Umformung.md
│   └── Umformung-doble.md
├── auto-commit.sh             # Watches for changes, auto-commits + pushes (local dev tool)
├── integrate-mobile-improvements.sh
├── add-mobile-texte-css.sh
├── test-mobile.html           # Mobile testing page
└── .gitignore                 # Excludes .DS_Store, PDFs, MP3s, Other/
```

---

## Sections of the Site

| Section | Path | Purpose |
|---------|------|---------|
| Start | `/index.html` | Landing page with program overview |
| Grammatik | `/grammatik/` | Grammar topics with theory + exercises |
| Texte | `/texte/` | Reading texts and writing production |
| Notizen | `/notizen/` | Useful phrases and notes |
| Wörter | `/woerter/` | Vocabulary system (flashcards + graph) |
| Prüfungen | `/pruefungen/` | Full mock exam practice (Modelltests) |
| Tips | `/tips/` | Exam strategies and level assessment |

---

## Key Architecture Patterns

### 1. Navigation System (topbar.js + navigation.js)

**All pages use the centralized navigation system.** Never hard-code nav HTML.

- `topbar.js` — Dynamically inserts the `<header class="topbar">` into every page. Calculates relative paths automatically based on page depth.
- `navigation.js` — Handles smart navigation: saves scroll position per page, remembers last-visited page per section, restores scroll on back-navigation.

**To add topbar to a new page:**
```html
<head>
  <style>html,body{background:#12110f}</style>  <!-- Anti-flash style FIRST -->
  <link rel="stylesheet" href="../../styles.css" />
  <script src="../../topbar.js"></script>
  <script src="../../navigation.js"></script>
</head>
<body class="no-js doc-page">
  <!-- topbar is injected automatically -->
  <main class="doc-main">...</main>
</body>
```

Adjust `../../` depth to match file location. Use `template-example.html` as reference.

### 2. Semantic Token System (grammatik.js)

Grammar content files (`content.md`) use a custom token syntax processed by `grammatik.js`'s `formatInline()` function. Tokens wrap text in colored `<span>` elements for visual grammar analysis.

**Token syntax:** `{type:content}`

| Token | Meaning | Color |
|-------|---------|-------|
| `{v:...}` | Verb | Red |
| `{adj:...}` | Adjektiv | Orange |
| `{p:...}` | Präposition | White/Beige |
| `{a:...}` | Akkusativ | Orange |
| `{d:...}` | Dativ | Blue |
| `{g:...}` | Genitiv | Green |
| `{n:...}` | Nomen | Grey |
| `{pred:...}` | Prädikat | Red |
| `{subj:...}` | Subjekt | Blue |
| `{akk:...}` | Akkusativ-Ergänzung | Orange |
| `{dat:...}` | Dativ-Ergänzung | Blue |
| `{gen:...}` | Genitiv-Ergänzung | Green |
| `{prep-erg:...}` | Präpositional-Ergänzung | Purple |
| `{sit:...}` | Situativ-Ergänzung | Teal |
| `{dir:...}` | Direktiv-Ergänzung | Yellow |
| `{exp:...}` | Expansiv-Ergänzung | Pink |
| `{nom-erg:...}` | Nominal-Ergänzung | Grey |
| `{ang-temporal:...}` | Temporal-Angabe | Teal |
| `{ang-kausal:...}` | Kausal-Angabe | Orange |
| `{ang-final:...}` | Final-Angabe | Purple |
| `{ang-kond:...}` | Konditional-Angabe | Blue |
| `{ang-konz:...}` | Konzessiv-Angabe | Pink |
| `{ang-lokal:...}` | Lokal-Angabe | Green |
| `{ang-modal:...}` | Modal-Angabe | Yellow |
| `{ang-instr:...}` | Instrumental-Angabe | Blue |
| `{ang-referenz:...}` | Referenz-Angabe | Purple |
| `{ang-neg:...}` | Negations-Angabe | Grey |
| `{wnb:...}` | Weitführende Nebensätze | Special |
| `{attr:...}` | Attribut | Special |
| `{reihe:X:...}` | Reihe link (A–G) | Link style |

**Example:**
```markdown
- {v:arbeiten} {p:an}: Die Autorin {v:arbeitet} {p:an} {d:einem neuen Roman}.
```

Also supports: `` `code` `` → `<code>`, `**bold**` → `<strong>`, and basic HTML tags (`<br>`, `<em>`, `<strong>`, `<u>`).

### 3. Data-Driven Home Page

`docs/index.html` + `docs/app.js` + `docs/data.json`:
- `data.json` drives all dynamic content on the home page (stats, modules, milestones, sessions, exams, resources, CTA text).
- `app.js` fetches `data.json` and calls `renderAll(data)` on DOMContentLoaded.
- If `data.json` fails to load, `app.js` falls back to `fallbackData` hardcoded in the file.

### 4. Exam Engine (Modelltests)

Each Modelltest in `docs/pruefungen/modell-N/` shares the engine from `docs/pruefungen/shared/`:
- `section-builders.js` — Generates all exam section HTML from content divs. Pages only need content + answers; the builder generates all structure.
- `exam-engine.js` — Manages exam flow and timer.
- `pruefung.js` — Scoring and evaluation logic.
- `exam-data.js` (per modell) — Contains all exam content, questions, answers.
- `praesentation-texte.js` (per modell) — Contains oral exam texts and transcripts.

**CRITICAL: Never create Modelltest files from scratch.** Always copy `_vorlage/` and fill in the `<!-- TODO -->` placeholders. See `GUIA-NUEVO-MODELLTEST.md` for the full guide.

### 5. Vocabulary System (woerter/)

- Data lives in `docs/woerter/woerter.json`.
- Each word entry has: `id`, `word`, `translation`, `explanation`, `erklärung` (German explanation), `examples[]` (with translation), `type`, `tags[]`.
- Optional fields: `sinónimos`, `antonimos`, `parts[]`.
- The `type` field must be one of: `verb`, `nomen`, `adjektiv`, `adverb`, `präposition`, `konjunktion`, `subjunktion`, `partikel`, `pronomen`, `artikel`, `phrase`.
- Examples should be C1-level and use topics relevant to TELC C1 Hochschule.

### 6. Notizen System (notizen/)

- Data in `docs/notizen/notizen.json` (list of phrase entries with `id`, `text`, `explanationId`).
- Explanations in `docs/notizen/notizen-explanations.json` (keyed by `explanationId`).
- Flashcard mode in `docs/notizen/flashcards/`.

---

## Design Standards

See `Indicaciones/disenno estandar.md` for the complete design system. Key rules:

### Colors
- **Background:** `#12110f` (very dark warm black) — always set in `<style>html,body{background:#12110f}</style>` in `<head>` to prevent flash.
- **Primary accent:** Red (`rgba(255, 84, 84, ...)`, `var(--red-600)`)
- **Token colors:** Each semantic token has its specific RGBA color (see token table above).

### CSS Variables (from styles.css)
```css
--radius-md: 14px
--radius-lg: 22px
--shadow: ...
--line: ...
--red-600: ...
```

### Buttons
- Primary: `.btn.primary` — red fill
- Ghost: `.btn.ghost` — transparent, 1px border, `border-radius: 999px` (pill shape)
- Touch targets: minimum `48px` height on mobile

### Typography
- Labels: `font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase`
- All content uses system fonts via CSS

### Consistency rules
- Use `var(--radius-lg)` (22px) for cards and containers
- Use `var(--radius-md)` (14px) for smaller elements
- Red focus/active states: `rgba(255, 84, 84, 0.12)` background, `rgba(255, 84, 84, 0.6)` border

---

## Grammar Content Files

Grammar topics live in `docs/grammatik/[topic]/`:
- `uebersicht/content.md` — Theory/overview page
- `uebungen/content.md` — Exercises page
- Some topics have sub-folders (e.g., `angaben/uebungen/4-1-nominal/content.md`)

Content format: Markdown with semantic tokens. Rendered server-side by `grammatik.js`.

**Grammar topics covered:**
- Adjektivdeklination, Adjektive
- Angaben (Nominal, Temporal, Kausal, Final, Konzessiv, Konditional)
- Attribute, Ergänzungen/Verbalisierung
- Es, Funktionsverbgefüge, Infinitive
- Intransitive/transitive Verben, Konjugationen
- Konjunktiv I & II, Modalverben, Negation
- Nomen, Nominalisierung, Partizipialkonstruktionen
- Passiv, Satzglieder, Verben, Verben mit Präpositionen
- Weiterfühende Nebensätze, Wortarten
- Zusammenfassende Übungen

---

## Exam Structure (TELC C1 Hochschule)

| Part | Time | Description |
|------|------|-------------|
| Leseverstehen | 90 min | 3 parts + Sprachbausteine |
| Pause | 20 min | — |
| Hörverstehen | ~45 min | 3 parts |
| Schriftlicher Ausdruck | 70 min | Essay (350+ words, 2 quotes required) |
| Mündliche Prüfung | ~16 min + 20 min prep | 3 parts |

**Total: 214 points. Pass: ≥128 total, ≥99 written, ≥29 oral.**

Each Modelltest folder (`modell-N/`) contains:
```
index.html                        (exam hub)
exam.html                         (full integrated exam)
exam-data.js                      (all questions + answers)
praesentation-texte.js            (oral section texts + transcripts)
1-leseverstehen-teil-1.html       (LV Teil 1 – Textrekonstruktion)
1-leseverstehen-teil-2.html       (LV Teil 2 – Selektives Verstehen)
1-leseverstehen-teil-3.html       (LV Teil 3 – Detailverstehen)
2-sprachbausteine.html            (Sprachbausteine)
3-hoerverstehen-teil-1.html       (HV Teil 1 – Globalverstehen)
3-hoerverstehen-teil-2.html       (HV Teil 2 – Detailverstehen)
3-hoerverstehen-teil-3.html       (HV Teil 3 – Informationstransfer)
4-schriftlicher-ausdruck.html     (Schriftlicher Ausdruck)
5-muendlich-praesentation.html    (Mündlich – Präsentation)
5-muendlich-zusammenfassung.html  (Mündlich – Zusammenfassung)
5-muendlich-diskussion.html       (Mündlich – Diskussion)
```

---

## Deployment

- **Automatic:** Push to `main` → GitHub Actions (`pages.yml`) deploys `docs/` to GitHub Pages.
- **Manual trigger:** Available via `workflow_dispatch` in GitHub Actions.
- **No build step.** Files are served as-is from `docs/`.
- PDFs, MP3s, and large binary files are `.gitignore`d (stored locally, not in the repo).

---

## Development Workflow

### Adding a new grammar topic

1. Create folder: `docs/grammatik/[topic-name]/`
2. Create `uebersicht/content.md` for theory.
3. Create `uebungen/content.md` for exercises (if needed).
4. Create `index.html` for the section hub (copy structure from existing topic).
5. Link from `docs/grammatik/index.html`.
6. Use semantic tokens throughout content (see token table).

### Adding a new Modelltest

**Always follow `docs/pruefungen/GUIA-NUEVO-MODELLTEST.md`.**

1. Copy `docs/pruefungen/_vorlage/` to `docs/pruefungen/modell-N/`.
2. Edit `exam-data.js` (content, questions, answers).
3. Edit `praesentation-texte.js` (oral texts, transcripts).
4. Fill in `<!-- TODO -->` placeholders in each HTML section file.
5. Link from `docs/pruefungen/index.html`.
6. Never create files from scratch — always use `_vorlage/`.

### Adding vocabulary words

Edit `docs/woerter/woerter.json`. Each entry:
```json
{
  "id": "unique-id",
  "word": "German word",
  "translation": "Spanish translation",
  "explanation": "Spanish explanation of usage",
  "erklärung": "German definition",
  "examples": [
    { "example": "C1-level German sentence.", "translation": "Spanish translation." }
  ],
  "type": "verb|nomen|adjektiv|adverb|...",
  "tags": ["tag1", "tag2"]
}
```

### Adding a new page

Use `docs/template-example.html` as the starting point. Requirements:
1. Anti-flash `<style>html,body{background:#12110f}</style>` as first `<head>` element.
2. Include `topbar.js` and `navigation.js` with correct relative paths.
3. Body class: `no-js doc-page` (or `tips-page` for tips sections).
4. Do not copy the topbar HTML — it is injected by `topbar.js`.
5. Link to `styles.css` with correct relative path.

---

## Conventions and Rules

1. **No build system.** No npm, no bundler, no transpilation. Everything is native browser JS.
2. **No frameworks.** No React, Vue, Angular. Pure vanilla JS.
3. **All JS uses IIFEs or plain functions.** No ES modules (`import`/`export`). The grammar JS (`grammatik.js`) exposes globals.
4. **`'use strict'`** is used in topbar.js and navigation.js.
5. **sessionStorage keys are prefixed `telc_`** to avoid collisions.
6. **Relative paths only.** No absolute paths in HTML (the site must work from any GitHub Pages URL).
7. **HTML lang attribute is `de`** (German) on all pages.
8. **Content quality:** Grammar examples and vocabulary must be at C1 academic level (TELC C1 Hochschule standard).
9. **Content language:** Page content in German, inline comments often in Spanish.
10. **Do not commit PDFs or MP3s** — they are gitignored.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `docs/topbar.js` | Navigation bar — edit to change nav links or CTA |
| `docs/navigation.js` | Scroll preservation and smart navigation |
| `docs/styles.css` | All global styles (~87KB) |
| `docs/grammatik/grammatik.js` | Grammar content renderer + semantic token parser |
| `docs/pruefungen/shared/section-builders.js` | Exam section HTML generator |
| `docs/pruefungen/shared/exam-engine.js` | Exam timer and flow |
| `docs/pruefungen/GUIA-NUEVO-MODELLTEST.md` | Guide for creating new Modelltests |
| `docs/pruefungen/_vorlage/` | Template for new Modelltests |
| `docs/woerter/woerter.json` | Vocabulary data |
| `docs/notizen/notizen.json` | Notes data |
| `docs/data.json` | Home page program data |
| `Indicaciones/disenno estandar.md` | Full design system documentation |
| `.github/workflows/pages.yml` | GitHub Pages deployment |

---

## What to Avoid

- Do not add a package.json, build system, or bundler.
- Do not use ES module syntax (`import`/`export`).
- Do not hardcode topbar HTML into pages — `topbar.js` handles it.
- Do not create Modelltest files from scratch — always copy `_vorlage/`.
- Do not commit PDF, MP3, or other large binary files.
- Do not use absolute paths in HTML `href`/`src` attributes.
- Do not change the `telc_` prefix convention for sessionStorage keys.
- Do not add emojis to page titles or navigation items (content uses them in exercises but navigation should remain clean).
