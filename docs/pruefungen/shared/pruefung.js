/* ═══════════════════════════════════════════════════════
   Shared exam logic — TELC C1 Hochschule
   Navigation, button handling, results, section initializers.
   ═══════════════════════════════════════════════════════ */
'use strict';

const Pruefung = (() => {

  /* ── Navigation chain ──────────────────────────────── */
  const NAV = [
    { file: '1-leseverstehen-teil-1.html',    label: 'LV Teil 1' },
    { file: '1-leseverstehen-teil-2.html',    label: 'LV Teil 2' },
    { file: '1-leseverstehen-teil-3.html',    label: 'LV Teil 3' },
    { file: '2-sprachbausteine.html',         label: 'Sprachbausteine' },
    { file: '3-hoerverstehen-teil-1.html',    label: 'HV Teil 1' },
    { file: '3-hoerverstehen-teil-2.html',    label: 'HV Teil 2' },
    { file: '3-hoerverstehen-teil-3.html',    label: 'HV Teil 3' },
    { file: '4-schriftlicher-ausdruck.html',  label: 'Schriftl. Ausdruck' },
    { file: '5-muendlich-praesentation.html', label: 'Präsentation' },
    { file: '5-muendlich-zusammenfassung.html', label: 'Zusammenfassung' },
    { file: '5-muendlich-diskussion.html',    label: 'Diskussion' },
  ];

  function initNav() {
    const current = location.pathname.split('/').pop();
    const idx = NAV.findIndex(n => n.file === current);
    const next = idx < NAV.length - 1 ? NAV[idx + 1] : null;

    const section = document.querySelector('.submit-section');
    if (!section) return;

    const evalBtn = section.querySelector('#auswerten-btn');
    const copyBtn = section.querySelector('#kopieren-btn');
    section.innerHTML = '';

    const backBtn = document.createElement('a');
    backBtn.className = 'btn secondary';
    backBtn.href = 'index.html';
    backBtn.textContent = '← Übersicht';
    section.appendChild(backBtn);

    if (evalBtn) section.appendChild(evalBtn);
    if (copyBtn) section.appendChild(copyBtn);

    if (next) {
      const nextBtn = document.createElement('a');
      nextBtn.className = 'btn secondary';
      nextBtn.href = next.file;
      nextBtn.textContent = next.label + ' →';
      section.appendChild(nextBtn);
    }
  }

  /* ── Generic button selection ─────────────────────── */
  function initButtons(btnSelector, groupAttr, valueAttr, store, onSelect) {
    document.querySelectorAll(btnSelector).forEach(btn => {
      btn.addEventListener('click', () => {
        const container = btn.closest(`[${groupAttr}]`);
        const group = container?.getAttribute(groupAttr) || btn.getAttribute(groupAttr);
        const value = btn.getAttribute(valueAttr);

        const scope = (container && container !== btn) ? container : btn.parentElement;
        scope.querySelectorAll(btnSelector).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        store[group] = value;
        if (onSelect) onSelect(group, value);
      });
    });
  }

  /* ── Results display ───────────────────────────────── */
  function showResults(items, summary) {
    const container = document.getElementById('ergebnisse');
    const list = document.getElementById('ergebnis-liste');
    const punkte = document.getElementById('punkte');
    if (!container || !list) return;

    list.innerHTML = items.map(r => {
      const cls = r.isCorrect ? 'korrekt' : (r.points > 0 ? 'teilweise' : 'falsch');
      const icon = r.isCorrect ? '✓' : (r.points > 0 ? '◐' : '✗');
      const right = r.isCorrect ? '' : ` Richtig: ${r.correctAnswer}`;
      return `<div class="ergebnis-item ${cls}">
        <span>${r.label}: <strong>${r.userAnswer || '—'}</strong></span>
        <span>${icon}${right}</span>
      </div>`;
    }).join('');

    if (punkte) punkte.textContent = summary;
    container.classList.add('show');
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ── Clipboard helper ──────────────────────────────── */
  function copyToClipboard(text, msgId) {
    navigator.clipboard.writeText(text).then(() => {
      const msg = document.getElementById(msgId);
      if (msg) { msg.classList.add('show'); setTimeout(() => msg.classList.remove('show'), 4000); }
    }).catch(err => alert('Fehler beim Kopieren: ' + err));
  }

  /* ═══════════════════════════════════════════════════════
     AUTO-SCORED SECTION INITIALIZERS
     Each replaces 30-50 lines of inline script with 1 call.
     ═══════════════════════════════════════════════════════ */

  function _initAutoSection(answers, cfg) {
    const store = {};
    initButtons(cfg.btnSel, cfg.groupAttr, cfg.valueAttr, store, cfg.onSelect);

    const evalBtn = document.getElementById('auswerten-btn');
    if (!evalBtn) return;

    evalBtn.addEventListener('click', () => {
      const items = [];
      let earned = 0;
      const keys = Object.keys(answers).sort((a, b) => Number(a) - Number(b));

      keys.forEach(key => {
        const raw = cfg.readFn ? cfg.readFn(store, key) : (store[key] || '—');
        const correct = answers[key];
        const ok = raw === correct;
        if (ok) earned += cfg.pts;

        const display = cfg.displayFn ? cfg.displayFn(raw, correct) : { user: raw, correct };
        items.push({
          label: cfg.labelFn(key),
          userAnswer: display.user,
          correctAnswer: display.correct,
          isCorrect: ok,
          points: ok ? cfg.pts : 0
        });
      });

      const max = cfg.max || keys.length * cfg.pts;
      showResults(items, `${earned} von ${max} Prüfungspunkten (${Math.round(earned / max * 100)}%)`);
    });
  }

  /** Leseverstehen Teil 1 — data-luecke buttons, 6 items × 2 pts */
  function initLV1(answers) {
    _initAutoSection(answers, {
      btnSel: '.antwort-btn', groupAttr: 'data-luecke', valueAttr: 'data-answer',
      labelFn: k => `Lücke ${k}`, pts: 2, max: 12
    });
  }

  /** Leseverstehen Teil 2 — data-frage buttons, 6 items × 2 pts */
  function initLV2(answers) {
    _initAutoSection(answers, {
      btnSel: '.antwort-btn', groupAttr: 'data-frage', valueAttr: 'data-answer',
      labelFn: k => `Frage ${k}`, pts: 2, max: 12
    });
  }

  /** Leseverstehen Teil 3 — symbol-mapped +/−/× buttons */
  function initLV3(answers) {
    const SYM = { '+': 'richtig', '−': 'falsch', '×': 'nicht' };
    const REV = { richtig: '+', falsch: '−', nicht: '×' };
    const store = {};

    initButtons('.aussage[data-aussage] .antwort-btn', 'data-aussage', 'data-answer', store,
      (group, value) => { if (group !== '24') store[group] = SYM[value] || value; }
    );

    const evalBtn = document.getElementById('auswerten-btn');
    if (!evalBtn) return;

    evalBtn.addEventListener('click', () => {
      const items = [];
      let earned = 0;

      for (let i = 13; i <= 23; i++) {
        const user = store[i] || '—';
        const correct = answers[i];
        const ok = user === correct;
        if (ok) earned += 2;
        items.push({
          label: `Aussage ${i}`,
          userAnswer: REV[user] || user,
          correctAnswer: REV[correct] || correct,
          isCorrect: ok, points: ok ? 2 : 0
        });
      }

      const u24 = store[24] || '—';
      const ok24 = u24 === answers[24];
      if (ok24) earned += 2;
      items.push({ label: 'Aufgabe 24', userAnswer: u24, correctAnswer: answers[24], isCorrect: ok24, points: ok24 ? 2 : 0 });

      showResults(items, `${earned} von 24 Prüfungspunkten (${Math.round(earned / 24 * 100)}%)`);
    });
  }

  /** Sprachbausteine — lucke-fill with option-btn, 23 items */
  function initSB(answers) {
    const store = {};

    document.querySelectorAll('.lucke').forEach(lucke => {
      lucke.addEventListener('click', () => {
        const nr = lucke.dataset.lucke;
        const gruppen = document.querySelectorAll('.option-gruppe');
        for (const g of gruppen) {
          const titel = g.querySelector('.option-gruppe-titel');
          if (titel && titel.textContent.trim() === nr) {
            g.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          }
        }
      });
    });

    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nr = btn.dataset.lucke;
        const wert = btn.dataset.wert;
        document.querySelectorAll(`.option-btn[data-lucke="${nr}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const lucke = document.querySelector(`.lucke[data-lucke="${nr}"]`);
        if (lucke) { lucke.textContent = wert; lucke.classList.add('filled'); }
        store[nr] = wert;
      });
    });

    const evalBtn = document.getElementById('auswerten-btn');
    if (!evalBtn) return;

    evalBtn.addEventListener('click', () => {
      const items = [];
      let correct = 0;
      const keys = Object.keys(answers).sort((a, b) => Number(a) - Number(b));

      keys.forEach(key => {
        const user = store[key] || '—';
        const ok = user === answers[key];
        if (ok) correct++;
        items.push({ label: `Lücke ${key}`, userAnswer: user, correctAnswer: answers[key], isCorrect: ok, points: ok ? 1 : 0 });
      });

      showResults(items, `${correct} von ${keys.length} korrekt (${Math.round(correct / keys.length * 100)}%)`);
    });
  }

  /** Hörverstehen Teil 1 — speaker-assignment buttons, 8 items × 1 pt */
  function initHV1(answers) {
    _initAutoSection(answers, {
      btnSel: '.auswahl-btn', groupAttr: 'data-sprecher', valueAttr: 'data-wert',
      labelFn: k => `Sprecher/in ${k - 46}`, pts: 1, max: 8
    });
  }

  /** Hörverstehen Teil 2 — multiple choice buttons, 10 items × 2 pts */
  function initHV2(answers) {
    _initAutoSection(answers, {
      btnSel: '.antwort-btn', groupAttr: 'data-frage', valueAttr: 'data-wert',
      labelFn: k => `Frage ${k}`, pts: 2, max: 20
    });
  }

  /** Hörverstehen Teil 3 — free text with keyword matching */
  function initHV3(answers, questionMap) {
    const store = {};

    document.querySelectorAll('.slide-input').forEach(input => {
      input.addEventListener('input', () => {
        store[input.dataset.nummer] = input.value.trim().toLowerCase();
        input.classList.toggle('filled', input.value.trim().length > 0);
      });
    });

    function checkAnswer(key, userAnswer) {
      if (!userAnswer) return 0;
      const possible = answers[key] || [];
      const ul = userAnswer.toLowerCase();
      for (const c of possible) {
        if (ul.includes(c.toLowerCase()) || c.toLowerCase().includes(ul)) return 2;
      }
      const keywords = possible.join(' ').toLowerCase().split(' ');
      const userWords = ul.split(' ');
      for (const w of userWords) {
        if (w.length > 3 && keywords.some(k => k.includes(w) || w.includes(k))) return 1;
      }
      return 0;
    }

    const evalBtn = document.getElementById('auswerten-btn');
    if (!evalBtn) return;

    evalBtn.addEventListener('click', () => {
      const items = [];
      let totalPoints = 0;
      const qMap = questionMap || Object.fromEntries(Object.keys(answers).map(k => [k, String(k)]));

      Object.keys(qMap).forEach(key => {
        const userAnswer = store[key] || '';
        const points = checkAnswer(key, userAnswer);
        totalPoints += points;
        const possible = answers[key] ? answers[key].slice(0, 2).join(', ') : '';
        items.push({
          label: `Frage ${qMap[key]}`, userAnswer: userAnswer || '—',
          correctAnswer: possible, isCorrect: points === 2, points
        });
      });

      showResults(items, `${totalPoints} von 20 Prüfungspunkten (${Math.round(totalPoints / 20 * 100)}%)`);
    });
  }

  /* ═══════════════════════════════════════════════════════
     AI-SCORED SECTION INITIALIZERS
     Handle UI interactions + generate AI evaluation text.
     ═══════════════════════════════════════════════════════ */

  /** Schriftlicher Ausdruck — theme selection, editor, word count, AI copy */
  function initSA(themen) {
    const textInput = document.getElementById('text-input');
    const wordCountEl = document.getElementById('word-count');
    const kopierenBtn = document.getElementById('kopieren-btn');
    const editorContainer = document.getElementById('editor-container');
    const themaTitle = document.getElementById('selected-thema-title');
    let selectedThema = null;

    document.querySelectorAll('.thema-box').forEach(box => {
      box.addEventListener('click', () => {
        document.querySelectorAll('.thema-box').forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
        selectedThema = box.dataset.thema;
        editorContainer.classList.add('show');
        themaTitle.textContent = themen[selectedThema].title;
        updateWordCount();
      });
    });

    function updateWordCount() {
      const text = textInput.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      wordCountEl.textContent = `${words} Wörter`;
      wordCountEl.className = 'word-count ' + (words >= 350 ? 'ok' : 'warning');
      if (kopierenBtn) kopierenBtn.disabled = words < 350;
    }
    textInput.addEventListener('input', updateWordCount);

    kopierenBtn.addEventListener('click', async () => {
      const t = themen[selectedThema];
      if (!selectedThema || !t) { alert('Bitte wählen Sie zuerst ein Thema.'); return; }
      if (!textInput.value.trim()) { alert('Bitte schreiben Sie zuerst Ihren Text.'); return; }

      const zitate = t.zitate.map(z => `- „${z}"`).join('\n');
      const text = `${_SA_CRITERIA_HEADER}

${t.title}

Zitate zur Orientierung:
${zitate}

${_SA_CRITERIA_TASK}

${textInput.value.trim()}

${_SA_CRITERIA_RUBRIC}`;
      copyToClipboard(text, 'success-msg');
    });
  }

  const _SA_CRITERIA_HEADER = `═══════════════════════════════════════════════════════════════
TELC DEUTSCH C1 HOCHSCHULE – BEWERTUNGSKRITERIEN
SCHRIFTLICHER AUSDRUCK
═══════════════════════════════════════════════════════════════`;

  const _SA_CRITERIA_TASK = `───────────────────────────────────────────────────────────────
AUFGABENSTELLUNG:
───────────────────────────────────────────────────────────────
In einer Seminararbeit sollen Sie das Thema aus unterschiedlichen
Perspektiven beleuchten. Sie können die Zitate zur Orientierung
verwenden, aber auch andere Aspekte darlegen.

- Argumentieren Sie überzeugend und führen Sie Beispiele an.
- Gliedern Sie Ihren Text in Einleitung, Hauptteil und Schluss.
- Mindestens 350 Wörter.

───────────────────────────────────────────────────────────────
MEIN TEXT:
───────────────────────────────────────────────────────────────`;

  const _SA_CRITERIA_RUBRIC = `───────────────────────────────────────────────────────────────
BEWERTUNGSKRITERIEN (A = 12 Punkte, B = 8, C = 4, D = 0)
───────────────────────────────────────────────────────────────

1. AUFGABENGERECHTHEIT (max. 12 Punkte)
   A: Entspricht durchgängig den Anforderungen
   B: Entspricht weitgehend den Anforderungen
   C: Entspricht nur teilweise den Anforderungen
   D: Entspricht (fast) überhaupt nicht

2. KORREKTHEIT (max. 12 Punkte)
   A: Durchgängig dem Zielniveau entsprechend
   B: Größtenteils entsprechend, Fehler (fast) nur in komplexen Strukturen
   C: Auch in einfachen Strukturen mehrere Fehler
   D: Zahlreiche Fehler, Text teilweise unverständlich

3. REPERTOIRE (max. 12 Punkte)
   A: Durchgängig dem Zielniveau entsprechend
   B: An wenigen Stellen sprachliche Einschränkungen
   C: An mehreren Stellen Einschränkungen, häufig einfacher Wortschatz
   D: (Fast) durchgängig sprachliche Einschränkungen

4. KOMMUNIKATIVE GESTALTUNG (max. 12 Punkte)
   A: Entspricht dem geforderten Niveau durchgehend
   B: Entspricht weitgehend, vereinzelte Unklarheiten
   C: Nicht immer klar gestaltet, einige Brüche
   D: An vielen Stellen unklar, unklare Struktur

───────────────────────────────────────────────────────────────
BITTE BEWERTEN SIE:
───────────────────────────────────────────────────────────────
Geben Sie für jedes der 4 Kriterien eine Bewertung (A/B/C/D) mit
Begründung. Berechnen Sie die Gesamtpunktzahl (max. 48 Punkte).

| Kriterium                  | Note | Punkte |
|----------------------------|------|--------|
| 1. Aufgabengerechtheit     | _/A  | _/12   |
| 2. Korrektheit             | _/A  | _/12   |
| 3. Repertoire              | _/A  | _/12   |
| 4. Kommunikative Gestaltung| _/A  | _/12   |
| **GESAMT**                 |      | _/48   |
═══════════════════════════════════════════════════════════════`;

  /** Mündliche Prüfung — Präsentation (Teil 1A) */
  function initPraesentation(themaTexte) {
    document.getElementById('thema-auswahl').addEventListener('change', (e) => {
      const box = document.getElementById('thema-beschreibung');
      const text = document.getElementById('thema-text');
      const wert = e.target.value;
      if (wert && themaTexte[wert]) {
        text.textContent = themaTexte[wert];
        box.classList.remove('hidden');
      } else {
        box.classList.add('hidden');
      }
    });

    document.getElementById('kopieren-btn').addEventListener('click', () => {
      const sel = document.getElementById('thema-auswahl');
      const wert = sel.value;
      const name = sel.options[sel.selectedIndex].text;
      const text = document.getElementById('praesentation-text').value;

      if (!wert) { alert('Bitte wählen Sie zuerst ein Thema aus.'); return; }
      if (!text.trim()) { alert('Bitte schreiben Sie zuerst Ihre Präsentation.'); return; }

      const aiText = `# TELC C1 Hochschule - Mündliche Prüfung: Präsentation (Teil 1A)

## GEWÄHLTES THEMA
${name}

**Vollständige Aufgabe:**
${themaTexte[wert]}

## PRÄSENTATION DES KANDIDATEN

${text}

---

${_MUENDLICH_CRITERIA_PRAESENTATION}`;
      copyToClipboard(aiText, 'kopiert-info');
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
      if (confirm('Möchten Sie wirklich alles zurücksetzen?')) {
        document.getElementById('thema-auswahl').value = '';
        document.getElementById('praesentation-text').value = '';
        document.getElementById('thema-beschreibung').classList.add('hidden');
        document.getElementById('kopiert-info').classList.remove('show');
      }
    });
  }

  /** Mündliche Prüfung — Zusammenfassung (Teil 1B) */
  function initZusammenfassung() {
    let meinThema = null;
    let partnerText = null;

    document.querySelectorAll('.thema-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.thema-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        meinThema = btn.dataset.thema;
        partnerText = getRandomPartnerPraesentation(meinThema);
        document.getElementById('partner-praesentation-text').innerHTML = partnerText.html;
        document.getElementById('partner-praesentation-container').classList.remove('hidden');
        document.getElementById('kopieren-btn').style.display = 'block';
      });
    });

    document.getElementById('kopieren-btn').addEventListener('click', async () => {
      const zusammenfassung = document.getElementById('zusammenfassung-input').value.trim();
      if (!zusammenfassung) { alert('Bitte schreiben Sie zuerst Ihre Zusammenfassung.'); return; }

      const aiText = `# TELC C1 Hochschule - Mündliche Prüfung: Zusammenfassung (Teil 1B)

## PRÄSENTATION DES PARTNERS

**Thema:** ${partnerText.titel}

${partnerText.text}

---

## MEINE ZUSAMMENFASSUNG UND ANSCHLUSSFRAGE(N)

${zusammenfassung}

---

${_MUENDLICH_CRITERIA_ZUSAMMENFASSUNG}`;
      copyToClipboard(aiText, 'success-msg');
    });
  }

  /** Mündliche Prüfung — Diskussion (Teil 2) */
  function initDiskussion(zitate) {
    let selectedZitat = null;

    document.querySelectorAll('.thema-box[data-zitat]').forEach(box => {
      box.addEventListener('click', () => {
        document.querySelectorAll('.thema-box[data-zitat]').forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
        selectedZitat = box.dataset.zitat;

        const z = zitate[selectedZitat];
        const vorschau = document.getElementById('zitat-vorschau');
        const aspekte = document.getElementById('diskussionsaspekte-vorschau');
        aspekte.innerHTML = z.aspekte.map(a => `<li>${a}</li>`).join('');
        vorschau.classList.remove('hidden');
      });
    });

    document.getElementById('kopieren-diskussion-btn').addEventListener('click', () => {
      if (!selectedZitat) { alert('Bitte wählen Sie zuerst ein Diskussionsthema aus.'); return; }
      const z = zitate[selectedZitat];
      const aspekteText = z.aspekte.map((a, i) => `${i + 1}. ${a}`).join('\n');

      const aiText = `# TELC C1 Hochschule - Mündliche Prüfung: Diskussion (Teil 2)

## IHRE ROLLE

Sie sind mein Diskussionspartner in einer TELC C1 Hochschule Prüfung.

**Wichtige Hinweise:**
- Wir führen eine **6-minütige Diskussion** über das unten stehende Zitat
- Sie sollen **aktiv mit mir diskutieren**, nicht nur zuhören
- Stellen Sie mir Fragen, geben Sie Gegenargumente, bringen Sie eigene Beispiele
- Am Ende bewerten Sie mich nach den offiziellen TELC-Kriterien

## DISKUSSIONSTHEMA

**Zitat:**
„${z.text}"

**Autor:** ${z.autor}

**Mögliche Diskussionsaspekte:**
${aspekteText}

---

## SO FUNKTIONIERT DIE DISKUSSION

1. **Ich beginne** mit meiner ersten Stellungnahme zum Zitat
2. **Sie reagieren** darauf: Fragen stellen, Gegenargumente bringen, vertiefen
3. **Wir diskutieren** ca. 6 Minuten hin und her
4. **Sie bewerten** am Ende nach den TELC-Kriterien

**Wichtig:** Fordern Sie mich heraus!

---

${_MUENDLICH_CRITERIA_DISKUSSION}

Ich fange jetzt an!`;
      copyToClipboard(aiText, 'kopiert-info-diskussion');
    });
  }

  /* ── Shared Mündlich criteria text blocks ──────────── */

  const _MUENDLICH_SPRACHLICHE = `### SPRACHLICHE ANGEMESSENHEIT

**2. Flüssigkeit (0-8 Punkte)**
- A (8): Durchgängig flüssig und natürlich | B (5): Weitgehend flüssig | C (2): Teilweise gestört | D (0): Viele Pausen

**3. Repertoire (0-8 Punkte)**
- A (8): C1-Kompetenz durchgängig | B (5): Gelegentliche Einschränkungen | C (2): Oft Einschränkungen | D (0): Fast nur einfache Strukturen

**4. Grammatische Richtigkeit (0-8 Punkte)**
- A (8): Hohes Maß an Korrektheit | B (5): Fehler nur in komplexen Strukturen | C (2): Etliche Fehler | D (0): Zahlreiche Fehler

**5. Aussprache und Intonation (0-8 Punkte)**
- A (8): Klar und natürlich | B (5): Größtenteils klar | C (2): Fehler erfordern erhöhte Aufmerksamkeit | D (0): Zahlreiche Fehler`;

  const _MUENDLICH_BEWERTUNGSTABELLE = `## ZUSAMMENFASSUNG DER BEWERTUNG

| Kriterium                        | Note | Punkte |
|----------------------------------|------|--------|`;

  const _MUENDLICH_CRITERIA_PRAESENTATION = `## OFFIZIELLE TELC BEWERTUNGSKRITERIEN

### INHALTLICHE ANGEMESSENHEIT

**1. Aufgabengerechtheit - Teil 1A Präsentation (0-6 Punkte)**

*Erfüllung der Aufgabe, aktive Beteiligung, Strukturiertheit der Rede, Präzision und Klarheit, strategische Kompetenz*

- **A (6 Punkte):** TN-Leistung entspricht (fast) durchgängig den Anforderungen der jeweiligen Aufgabe.
- **B (4 Punkte):** TN-Leistung entspricht weitgehend den Anforderungen der jeweiligen Aufgabe.
- **C (2 Punkte):** TN-Leistung entspricht den Anforderungen in mehreren Merkmalen nicht.
- **D (0 Punkte):** TN-Leistung entspricht den Anforderungen (fast) überhaupt nicht.

---

${_MUENDLICH_SPRACHLICHE}

---

**Maximal: 38 Punkte** (6 + 8+8+8+8)

## BEWERTUNGSAUFTRAG

Bitte geben Sie für jedes Kriterium:
1. Die Bewertung (A/B/C/D) mit Punktzahl
2. Eine kurze, konkrete Begründung (2-3 Sätze)
3. Spezifische Beispiele aus dem Text
4. Am Ende: Bewertungstabelle, Gesamtnote, Stärken, Verbesserungsvorschläge

---

${_MUENDLICH_BEWERTUNGSTABELLE}
| 1. Aufgabengerechtheit (Teil 1A) | _/A  | _/6    |
| 2. Flüssigkeit                   | _/A  | _/8    |
| 3. Repertoire                    | _/A  | _/8    |
| 4. Grammatische Richtigkeit      | _/A  | _/8    |
| 5. Aussprache und Intonation     | _/A  | _/8    |
| **GESAMT**                       |      | _/38   |`;

  const _MUENDLICH_CRITERIA_ZUSAMMENFASSUNG = `## BEWERTUNGSKRITERIEN

### INHALTLICHE ANGEMESSENHEIT

**Aufgabengerechtheit - Teil 1B Zusammenfassung und Anschlussfragen (0-4 Punkte)**

*Erfüllung der Aufgabe, aktive Beteiligung, Strukturiertheit der Rede, Präzision und Klarheit, strategische Kompetenz*

- **A (4 Punkte):** TN-Leistung entspricht (fast) durchgängig den Anforderungen der jeweiligen Aufgabe.
- **B (2 Punkte):** TN-Leistung entspricht weitgehend den Anforderungen der jeweiligen Aufgabe.
- **C (1 Punkt):** TN-Leistung entspricht den Anforderungen in mehreren Merkmalen nicht.
- **D (0 Punkte):** TN-Leistung entspricht den Anforderungen (fast) überhaupt nicht.

**Aufgabe:**
1. Zusammenfassen, was für Sie besonders bemerkenswert war (NICHT die komplette Präsentation wiederholen!)
2. Mindestens eine Anschlussfrage zum Thema stellen

---

### SPRACHLICHE ANGEMESSENHEIT (gesamt für alle Teile)

Die sprachliche Bewertung (Flüssigkeit, Repertoire, Grammatik, Aussprache) erfolgt für die gesamte mündliche Prüfung, nicht nur für diesen Teil.

---

## BEWERTUNGSAUFTRAG

Bitte geben Sie:
1. **Bewertung Teil 1B (A/B/C/D) mit Punktzahl**
2. **Begründung**
3. **Verbesserungsvorschläge**

**Maximal für Teil 1B: 4 Punkte**

---

${_MUENDLICH_BEWERTUNGSTABELLE}
| 1. Aufgabengerechtheit (Teil 1B) | _/A  | _/4    |
| **GESAMT Teil 1B**               |      | _/4    |`;

  const _MUENDLICH_CRITERIA_DISKUSSION = `## OFFIZIELLE TELC BEWERTUNGSKRITERIEN

### INHALTLICHE ANGEMESSENHEIT

**Aufgabengerechtheit - Teil 2 Diskussion (0-6 Punkte)**

*Erfüllung der Aufgabe, aktive Beteiligung, Strukturiertheit der Rede, Präzision und Klarheit, strategische Kompetenz*

- **A (6 Punkte):** TN-Leistung entspricht (fast) durchgängig den Anforderungen
- **B (4 Punkte):** TN-Leistung entspricht weitgehend den Anforderungen
- **C (2 Punkte):** TN-Leistung entspricht den Anforderungen in mehreren Merkmalen nicht
- **D (0 Punkte):** TN-Leistung entspricht den Anforderungen (fast) überhaupt nicht

${_MUENDLICH_SPRACHLICHE}

**Maximal: 38 Punkte (6 + 32)**

---

## BEWERTUNGSFORMAT (am Ende)

${_MUENDLICH_BEWERTUNGSTABELLE}
| 1. Aufgabengerechtheit (Teil 2)  | _/A  | _/6    |
| 2. Flüssigkeit                   | _/A  | _/8    |
| 3. Repertoire                    | _/A  | _/8    |
| 4. Grammatische Richtigkeit      | _/A  | _/8    |
| 5. Aussprache und Intonation     | _/A  | _/8    |
| **GESAMT**                       |      | _/38   |`;

  /* ── Public API ───────────────────────────────────── */
  return {
    initNav, initButtons, showResults, copyToClipboard,
    initLV1, initLV2, initLV3, initSB, initHV1, initHV2, initHV3,
    initSA, initPraesentation, initZusammenfassung, initDiskussion
  };
})();

// Auto-init navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Pruefung.initNav());
} else {
  Pruefung.initNav();
}
