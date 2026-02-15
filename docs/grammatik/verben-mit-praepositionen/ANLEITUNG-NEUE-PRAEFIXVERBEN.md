# Anleitung: Neues Präfixverb mit allen Präfixformen hinzufügen

**Ziel:** Ein neues Basisverb in `verben-mit-praepositionen.json` eintragen und **alle** im Deutschen existierenden Formen mit Präfixen ergänzen.

**Kontext:** Diese Datei dient der Vorbereitung auf die **TELC C1 Hochschule**-Prüfung. Alle Beispiele, Synonyme und Übersetzungen sollen dem akademischen Niveau C1 entsprechen und typische Kontexte aus Studium, Wissenschaft und Beruf abdecken.

---

## 1. Basisverb in `baseVerbs` eintragen

Am Anfang der JSON-Datei steht das Array `baseVerbs`. Dort den **Infinitiv** des neuen Verbs hinzufügen (kleingeschrieben, alphabetisch einordnen).

```json
"baseVerbs": ["machen", "treffen", "nehmen", "fehlen", "kommen", "tragen", "treiben", "DEIN_VERB"],
```

---

## 2. Welche Präfixformen anlegen?

Nicht jede theoretische Kombination aus Präfix + Verb existiert im Deutschen. Es werden **nur echte, gebräuchliche Verben** eingetragen.

**Wichtig:** Es müssen **alle** im Deutschen existierenden und realen Kombinationen aus Präfix + Basisverb eingetragen werden – keine weglassen. Für jedes Basisverb sind also sämtliche Präfixverben zu erfassen, die es tatsächlich gibt (Duden, DWDS, etc.). Nur nicht existierende Kombinationen werden ausgelassen.

### Häufige Präfixe (Orientierung)

| Präfix   | Typ          | Beispiele (mit machen/nehmen) |
|----------|--------------|--------------------------------|
| ab-      | trennbar     | abmachen, abnehmen             |
| an-      | trennbar     | anmachen, annehmen             |
| auf-     | trennbar     | aufmachen, aufnehmen           |
| aus-     | trennbar     | ausmachen, ausnehmen           |
| be-      | **untrennbar** | — (bei machen nicht üblich), beantragen |
| bei-     | trennbar     | beitragen                      |
| durch-   | trennbar     | durchkommen                    |
| ein-     | trennbar     | einmachen, einnehmen           |
| ent-     | **untrennbar** | entnehmen, entkommen         |
| er-      | **untrennbar** | — (je nach Verb)              |
| her-     | trennbar     | herkommen                      |
| hin-     | trennbar     | hinkommen                      |
| mit-     | trennbar     | mitmachen, mitnehmen           |
| nach-    | trennbar     | nachmachen, nachtragen         |
| über-    | trennbar oder untrennbar | übernehmen (untrennbar), übertreffen (untrennbar) |
| um-      | trennbar     | umkommen                       |
| unter-   | trennbar oder untrennbar | unternehmen (untrennbar)   |
| ver-     | **untrennbar** | vermachen (selten), vernehmen |
| vor-     | trennbar     | vormachen, vortragen           |
| weg-     | trennbar     | wegmachen, wegnehmen           |
| wieder-  | trennbar     | wiedermachen, wiedertreffen    |
| zu-      | trennbar     | zumachen, zunehmen              |
| zurück-  | trennbar     | zurückkommen                   |
| zusammen-| trennbar     | zusammenkommen                 |
| zer-     | **untrennbar** | zertreiben                    |

**Regel:** Nur Verben eintragen, die es wirklich gibt (Duden, DWDS, etc.). **Alle** solchen realen Kombinationen müssen erfasst werden – keine aus Bequemlichkeit weglassen. Bei Unsicherheit: prüfen und ggf. nachschlagen.

---

## 3. Struktur einer Eintragung im Array `words`

### 3.1 Basisverb (ohne Präfix)

- **id:** Infinitiv kleingeschrieben, **ohne Umlaute** (z. B. `uebernehmen` für „übernehmen“).
- **word:** Exakte Schreibweise (mit Umlaut: ä, ö, ü).
- **baseVerb:** Derselbe Infinitiv wie das Basisverb.
- **Kein** Feld `trennbar` (nur bei Präfixverben).
- **translation:** Bedeutung auf Spanisch.
- **type:** `"verb"`.
- **synonyms:** Array von `{ "word": "...", "translation": "..." }` (optional, aber empfohlen).
- **antonyms:** Array wie synonyms (optional).
- **examples:** Array von `{ "example": "Satz auf Deutsch.", "translation": "Oración en español." }` – mindestens 2 Beispiele, **nicht** identisch mit dem Kontext anderer Einträge, Niveau C1.

**Beispiel Basisverb:**

```json
{
  "id": "halten",
  "word": "halten",
  "baseVerb": "halten",
  "translation": "sostener; mantener; parar",
  "type": "verb",
  "synonyms": [
    { "word": "festhalten", "translation": "sostener" },
    { "word": "bewahren", "translation": "mantener" }
  ],
  "antonyms": [
    { "word": "loslassen", "translation": "soltar" }
  ],
  "examples": [
    { "example": "Die Universität hält an ihren Qualitätsstandards fest, trotz finanzieller Engpässe.", "translation": "La universidad mantiene sus estándares de calidad a pesar de las dificultades financieras." },
    { "example": "Der Professor hält seine Sprechstunde jeden Mittwoch von 14 bis 16 Uhr.", "translation": "El profesor mantiene su horario de consulta cada miércoles de 14 a 16 horas." }
  ]
}
```

### 3.2 Präfixverb (trennbar oder untrennbar)

Zusätzlich zum Basisverb-Eintrag:

- **id:** Präfix + Stamm, **ohne Umlaute** (z. B. `uebernehmen`, `zurueckkommen`).
- **word:** Exakte Schreibweise (mit Umlaut: ü, ä, ö).
- **baseVerb:** Infinitiv des **Basisverbs** (z. B. `halten`).
- **trennbar:**  
  - `true` = trennbar (Präsens: *ich halte an*).  
  - `false` = untrennbar (Präsens: *ich übernähme* / *ich behalte*).
- **translation**, **type**, **synonyms**, **antonyms**, **examples** wie beim Basisverb.

**Beispiel trennbar:**

```json
{
  "id": "anhalten",
  "word": "anhalten",
  "baseVerb": "halten",
  "trennbar": true,
  "translation": "parar(se); persistir",
  "type": "verb",
  "synonyms": [
    { "word": "stoppen", "translation": "parar" },
    { "word": "andauern", "translation": "persistir" }
  ],
  "examples": [
    { "example": "Die Debatte über Studiengebühren hält seit Jahren an, ohne dass eine Lösung in Sicht ist.", "translation": "El debate sobre las tasas universitarias persiste desde hace años sin que haya una solución a la vista." },
    { "example": "Der Dozent hielt mitten im Vortrag an, um auf eine kritische Frage einzugehen.", "translation": "El docente se detuvo en medio de la ponencia para abordar una pregunta crítica." }
  ]
}
```

**Beispiel untrennbar:**

```json
{
  "id": "behalten",
  "word": "behalten",
  "baseVerb": "halten",
  "trennbar": false,
  "translation": "conservar; mantener; retener",
  "type": "verb",
  "synonyms": [
    { "word": "bewahren", "translation": "conservar" },
    { "word": "aufbewahren", "translation": "guardar" }
  ],
  "examples": [
    { "example": "Die Forschungsgruppe behielt die methodische Kontrolle über alle Versuchsreihen bei.", "translation": "El grupo de investigación mantuvo el control metodológico sobre todas las series de experimentos." },
    { "example": "Trotz der Kritik behielt die Autorin ihre ursprüngliche Argumentationsstruktur bei.", "translation": "A pesar de la crítica, la autora conservó su estructura argumentativa original." }
  ]
}
```

---

## 4. Reihenfolge im Array `words`

- Zuerst den **Eintrag des Basisverbs** (z. B. `halten`).
- Danach **alle Präfixverben** zu diesem Basisverb, am besten alphabetisch nach **id** (z. B. abhalten, anhalten, aufhalten, behalten, …).
- So bleibt die Datei konsistent und gut durchsuchbar.

---

## 5. Regeln für ID und Umlaute

- **id:** Immer **ASCII**:  
  - `ä` → `ae`, `ö` → `oe`, `ü` → `ue`  
  - Beispiele: `uebernehmen`, `zurueckkommen`, `uebertreffen`.
- **word:** Immer die **korrekte deutsche Schreibweise** (mit ä, ö, ü).

---

## 6. Sonderfälle

- **Adjektiv/Partizip als Wort:** Wenn ein von dem Verb abgeleitetes Wort als Adjektiv genutzt wird (z. B. *zuvorkommend* von *zuvorkommen*), kann ein eigener Eintrag mit `"type": "adjective"` und `"trennbar": false` angelegt werden.
- **Zusammengesetzte Präfixe:** z. B. *aufeinandertreffen*, *zusammennehmen* – als ein Wort, ein Eintrag mit passendem `baseVerb`.

---

## 7. Checkliste vor dem Speichern

- [ ] `baseVerbs` um das neue Basisverb ergänzt.
- [ ] Ein Eintrag für das **Basisverb** (ohne Präfix, ohne `trennbar`).
- [ ] **Alle** real existierenden Präfixkombinationen sind erfasst – für **jede** existierende Präfixform ein Eintrag mit `trennbar: true` oder `trennbar: false` (keine weglassen).
- [ ] Alle **id** in ASCII (ue, ae, oe).
- [ ] Alle **word** mit korrekter Rechtschreibung (ü, ä, ö).
- [ ] **examples** nicht identisch mit anderen Einträgen, Niveau C1, mehrere Bedeutungen abgedeckt.
- [ ] **synonyms** / **antonyms** mit Übersetzung wo sinnvoll.
- [ ] Kein Komma nach dem letzten Eintrag im `words`-Array (gültiges JSON).

---

## 8. Kurzreferenz: Felder pro Eintrag

| Feld         | Basisverb | Präfixverb | Pflicht |
|-------------|-----------|------------|--------|
| id          | ✓ (ASCII) | ✓ (ASCII)  | ja     |
| word        | ✓         | ✓          | ja     |
| baseVerb    | ✓         | ✓         | ja     |
| trennbar    | —         | true/false | ja (bei Präfix) |
| translation | ✓         | ✓         | ja     |
| type        | "verb"    | "verb" (oder "adjective") | ja |
| synonyms    | optional  | optional   | nein   |
| antonyms    | optional  | optional   | nein   |
| examples    | ✓ (≥2)    | ✓ (≥2)     | ja     |

Mit dieser Anleitung kannst du ein neues Verb inklusive aller gewünschten Präfixformen konsistent in `verben-mit-praepositionen.json` ergänzen.
