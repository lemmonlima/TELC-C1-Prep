# Anleitung: Neue Präfixnomen (Nominalisierungen) hinzufügen

**Ziel:** In `nomen-mit-praepositionen.json` **nur Nominalisierungen** der Verben aus `verben-mit-praepositionen.json` eintragen – dieselben Basisverben, dieselben Präfixe. Keine anderen Nomen (z. B. kein „Hörer“ als Nomen zu „hören“; nur echte Nominalisierungen wie „Hören“, „Gehör“ usw., und nur wenn das Verb in unseren Verben vorkommt).

**Kontext:** Diese Datei dient der Vorbereitung auf die **TELC C1 Hochschule**-Prüfung. Alle Beispiele, Synonyme und Übersetzungen sollen dem akademischen Niveau C1 entsprechen und typische Kontexte aus Studium, Wissenschaft und Beruf abdecken.

---

## 1. Grundregel: Nur Nominalisierungen

- Es werden **nur** Nomen aufgenommen, die die **Nominalisierung** eines Verbs aus `verben-mit-praepositionen.json` sind.
- **baseVerbs** in dieser Datei muss **identisch** mit dem Array in `verben-mit-praepositionen.json` sein (keine zusätzlichen Basisverben, keine fehlenden).
- Zu jedem **Präfixverb** aus der Verben-Datei kann es **höchstens einen** Nomen-Eintrag geben – den der passenden Nominalisierung.
- **Nicht** aufnehmen: Nomen, die keine Nominalisierung unserer Verben sind (z. B. „Hörer“ ist nicht die Nominalisierung von „hören“ in unserem Sinne; „Zuhörer“ wäre eine Ableitung, aber nur eintragen, wenn das zugehörige Verb bei uns existiert und wir die Nominalisierung abdecken wollen).

**Kurz:** Nur Nomen, die „das Machen“, „die Anmache“, „die Aufmachung“, „die Abnahme“, „die Ankunft“, „die Rückkehr“ usw. sind – also echte Nominalisierungen zu den Verben, die wir bereits in den Verben haben.

---

## 2. baseVerbs synchron halten

Das Array `baseVerbs` am Anfang der JSON-Datei muss **exakt** dasselbe sein wie in `verben-mit-praepositionen.json`. Wenn dort ein neues Basisverb ergänzt wird, hier dasselbe hinzufügen (alphabetisch). Keine Basisverben nur in der Nomen-Datei.

```json
"baseVerbs": ["machen", "treffen", "nehmen", "fehlen", "kommen", "tragen", "treiben", "stehen"],
```

---

## 3. Welche Nomen anlegen?

- **Basisverb** (z. B. machen, treffen, nehmen): ein Eintrag für die Nominalisierung des **Basisverbs** (z. B. „Machen“, „Treffen“, „Nehmen“).
- **Präfixverben:** Für **jedes** Präfixverb, das in `verben-mit-praepositionen.json` vorkommt, muss **ein** Nomen-Eintrag angelegt werden, sofern im Deutschen eine echte Nominalisierung existiert. Es müssen **alle** real existierenden Nominalisierungen zu unseren Verben erfasst werden – keine weglassen.

**Wichtig:** Alle Kombinationen aus (Basisverb + Präfix), die in der Verben-Datei stehen, haben in der Nomen-Datei ihre Nominalisierung – sofern es sie im Deutschen gibt. Keine dieser Möglichkeiten auslassen.

Die Nominalisierung kann sein:

- **Infinitiv als Nomen:** das Machen, das Mitmachen, das Nachmachen, das Treffen, das Eintreffen, das Nehmen, die Teilnahme (von „teilnehmen“), das Kommen, das Vorkommen, das Tragen, das Treiben, das Stehen.
- **Abgeleitete Form:** -ung (Aufmachung, Aufnahme, Vernehmung, Übertreibung), -e (Anmache, Abnahme, Zunahme, Ausnahme), -t (Ankunft, Herkunft), -(e) (Antrag, Eintrag, Vortrag, Antrieb, Betrieb, Vertrieb, Stand, Abstand, Bestand, Aufstand, Zustand, Widerstand), Rückkehr (zu zurückkommen), Unternehmung (zu unternehmen) usw.

**Wichtig:** Nur Formen eintragen, die es im Deutschen wirklich gibt und die eindeutig die Nominalisierung **unseres** Verbs (aus der Verben-Liste) sind. Von diesen müssen **alle** erfasst werden – jede reale Nominalisierung zu jedem Präfixverb aus der Verben-Datei gehört in die Liste.

---

## 4. Struktur eines Eintrags im Array `words`

Jeder Eintrag ist ein Objekt mit:

| Feld          | Pflicht | Beschreibung |
|---------------|--------|----------------|
| **id**        | ja     | Eindeutige ID, **kleingeschrieben**, **ohne Umlaute** (ä→ae, ö→oe, ü→ue). Entspricht meist dem Nomen in Kleinbuchstaben: z. B. `anmache`, `aufmachung`, `abnahme`, `ankunft`, `rueckkehr`, `uebernahme`. |
| **word**      | ja     | Das Nomen in **korrekter Schreibung**, **großgeschrieben** (Anmache, Aufmachung, Abnahme, Ankunft, Rückkehr, Übernahme). |
| **artikel**   | ja     | `"der"`, `"die"` oder `"das"`. |
| **baseVerb**  | ja     | Infinitiv des **Basisverbs** (wie in verben-mit-praepositionen.json), kleingeschrieben: z. B. `machen`, `treffen`, `nehmen`, `kommen`. |
| **translation** | ja   | Bedeutung auf Spanisch. |
| **type**      | ja     | Immer `"nomen"`. |
| **synonyms**  | optional | Array von `{ "word": "...", "translation": "..." }`. |
| **antonyms**  | optional | Array von `{ "word": "...", "translation": "..." }`. |
| **examples**  | ja     | Array von `{ "example": "Satz auf Deutsch.", "translation": "Oración en español." }` – mindestens 2, Niveau C1, **nicht** identisch mit anderen Einträgen. |

---

## 5. Beispiele

### 5.1 Nominalisierung des Basisverbs (ohne Präfix)

```json
{
  "id": "machen",
  "word": "Machen",
  "artikel": "das",
  "baseVerb": "machen",
  "translation": "el hacer; la realización",
  "type": "nomen",
  "synonyms": [
    { "word": "Tun", "translation": "el hacer" },
    { "word": "Handeln", "translation": "la acción" }
  ],
  "antonyms": [
    { "word": "Unterlassen", "translation": "la omisión" }
  ],
  "examples": [
    { "example": "Das bloße Machen ohne Planung führt selten zu nachhaltigen Ergebnissen.", "translation": "El mero hacer sin planificación rara vez conduce a resultados sostenibles." },
    { "example": "Im Machen liegt oft mehr Weisheit als im endlosen Planen.", "translation": "En el hacer suele haber más sabiduría que en la planificación interminable." }
  ]
}
```

### 5.2 Nominalisierung eines Präfixverbs – Infinitiv als Nomen

```json
{
  "id": "mitmachen",
  "word": "Mitmachen",
  "artikel": "das",
  "baseVerb": "machen",
  "translation": "participación",
  "type": "nomen",
  "synonyms": [
    { "word": "Teilnahme", "translation": "la participación" },
    { "word": "Beteiligung", "translation": "la implicación" }
  ],
  "antonyms": [
    { "word": "Fernbleiben", "translation": "la ausencia" }
  ],
  "examples": [
    { "example": "Das aktive Mitmachen in Seminaren fördert den Lernprozess.", "translation": "La participación activa en seminarios fomenta el proceso de aprendizaje." },
    { "example": "Ohne das Mitmachen aller Beteiligten kann das Projekt nicht gelingen.", "translation": "Sin la participación de todos los involucrados el proyecto no puede tener éxito." }
  ]
}
```

### 5.3 Nominalisierung eines Präfixverbs – abgeleitete Form (-ung, -e, -t, usw.)

```json
{
  "id": "aufmachung",
  "word": "Aufmachung",
  "artikel": "die",
  "baseVerb": "machen",
  "translation": "diseño; presentación externa",
  "type": "nomen",
  "synonyms": [
    { "word": "Gestaltung", "translation": "el diseño" },
    { "word": "Erscheinungsbild", "translation": "la apariencia" }
  ],
  "examples": [
    { "example": "Die professionelle Aufmachung der Publikation trägt zur Glaubwürdigkeit bei.", "translation": "El diseño profesional de la publicación contribuye a la credibilidad." },
    { "example": "Die auffällige Aufmachung des Produkts zog die Blicke auf sich.", "translation": "La llamativa presentación del producto atrajo las miradas." }
  ]
}
```

```json
{
  "id": "ankunft",
  "word": "Ankunft",
  "artikel": "die",
  "baseVerb": "kommen",
  "translation": "llegada",
  "type": "nomen",
  "synonyms": [
    { "word": "Eintreffen", "translation": "el arribo" },
    { "word": "Ankommen", "translation": "la llegada" }
  ],
  "antonyms": [
    { "word": "Abfahrt", "translation": "la partida" }
  ],
  "examples": [
    { "example": "Die verspätete Ankunft der Referentin führte zu einer Umstrukturierung des Konferenzprogramms.", "translation": "La llegada tardía de la ponente llevó a una reestructuración del programa de la conferencia." },
    { "example": "Bei Ankunft der Delegation wurde ein offizieller Empfang im Rektorat organisiert.", "translation": "A la llegada de la delegación se organizó una recepción oficial en el rectorado." }
  ]
}
```

```json
{
  "id": "rueckkehr",
  "word": "Rückkehr",
  "artikel": "die",
  "baseVerb": "kommen",
  "translation": "regreso",
  "type": "nomen",
  "synonyms": [
    { "word": "Heimkehr", "translation": "el regreso a casa" },
    { "word": "Wiederkehr", "translation": "el retorno" }
  ],
  "examples": [
    { "example": "Nach der Rückkehr aus dem Auslandssemester fiel die akademische Wiedereingliederung zunächst schwer.", "translation": "Tras el regreso del semestre en el extranjero la reintegración académica resultó difícil al principio." },
    { "example": "Die Rückkehr zur Präsenzlehre nach der Pandemie erforderte eine grundlegende Neuorganisation.", "translation": "El regreso a la enseñanza presencial tras la pandemia requirió una reorganización fundamental." }
  ]
}
```

---

## 6. ID und Umlaute

- **id:** Immer **ASCII**, kleingeschrieben:  
  - ä → ae, ö → oe, ü → ue  
  - Beispiele: `uebernahme`, `uebertreibung`, `rueckkehr`, `herkunft`.
- **word:** Immer die **korrekte deutsche Schreibweise** des Nomens, großgeschrieben (Übernahme, Übertreibung, Rückkehr, Herkunft).

---

## 7. Reihenfolge im Array `words`

- Zuerst alle Einträge zum **ersten** baseVerb (z. B. machen: Machen, Anmache, Aufmachung, Mitmachen, Nachmachen, …).
- Dann alle zum **zweiten** baseVerb (treffen, …), usw.
- Innerhalb eines Basisverbs: sinnvoll alphabetisch nach **id** oder nach Präfix (Basis, dann an-, auf-, aus-, …).

---

## 8. Checkliste vor dem Speichern

- [ ] **baseVerbs** ist identisch mit `verben-mit-praepositionen.json`.
- [ ] **Alle** real existierenden Nominalisierungen zu den Verben aus der Verben-Datei sind erfasst (keine weglassen).
- [ ] Es gibt **nur Nominalisierungen** zu Verben aus der Verben-Datei (keine anderen Nomen wie „Hörer“ o. Ä.).
- [ ] Jeder Nomen-Eintrag hat **artikel** (der/die/das), **baseVerb**, **word** (Großschreibung), **translation**, **type**: `"nomen"`, **examples** (mind. 2, C1, nicht identisch mit anderen).
- [ ] **id** kleingeschrieben und in ASCII (ue, ae, oe).
- [ ] **word** mit korrekter Rechtschreibung (Umlaute erlaubt).
- [ ] Kein Komma nach dem letzten Eintrag im `words`-Array (gültiges JSON).

---

## 9. Kurzreferenz: Felder pro Eintrag

| Feld         | Pflicht | Hinweis |
|--------------|--------|--------|
| id           | ja     | Klein, ASCII (ue, ae, oe). |
| word         | ja     | Nomen, Großschreibung, korrekte Rechtschreibung. |
| artikel      | ja     | der / die / das. |
| baseVerb     | ja     | Infinitiv aus verben-mit-praepositionen.json. |
| translation  | ja     | Spanisch. |
| type         | ja     | Immer `"nomen"`. |
| synonyms     | nein   | Array aus { word, translation }. |
| antonyms     | nein   | Array aus { word, translation }. |
| examples     | ja     | Mind. 2, C1, nicht identisch mit anderen Einträgen. |

Mit dieser Anleitung bleiben die Einträge in `nomen-mit-praepositionen.json` auf **Nominalisierungen** der Verben aus `verben-mit-praepositionen.json` beschränkt – dieselben Basisverben, dieselben Präfixe, keine Zufallsnomen wie „Hörer“.
