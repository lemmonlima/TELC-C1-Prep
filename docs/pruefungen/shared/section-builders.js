/* ═══════════════════════════════════════════════════════
   Section builders — TELC C1 Hochschule
   Generate section HTML from content data divs.
   Each HTML file only needs content + answers; all
   surrounding structure (instructions, buttons, results)
   is generated here.

   Usage (standalone page):
     SectionBuilder.lv1(root, root);
     Pruefung.initLV1(answers);

   Usage (exam engine):
     SectionBuilder.lv1(panel, parsedMain, { exam: true });
   ═══════════════════════════════════════════════════════ */
'use strict';

const SectionBuilder = (() => {

  /* ── Section navigation order ───────────────────── */
  const NAV = [
    { id: 'lv1', file: '1-leseverstehen-teil-1.html', label: 'LV Teil 1' },
    { id: 'lv2', file: '1-leseverstehen-teil-2.html', label: 'LV Teil 2' },
    { id: 'lv3', file: '1-leseverstehen-teil-3.html', label: 'LV Teil 3' },
    { id: 'sb',  file: '2-sprachbausteine.html',      label: 'Sprachbausteine' },
    { id: 'hv1', file: '3-hoerverstehen-teil-1.html',  label: 'HV Teil 1' },
    { id: 'hv2', file: '3-hoerverstehen-teil-2.html',  label: 'HV Teil 2' },
    { id: 'hv3', file: '3-hoerverstehen-teil-3.html',  label: 'HV Teil 3' },
    { id: 'sa',  file: '4-schriftlicher-ausdruck.html', label: 'Schriftl. Ausdruck' },
    { id: 'praesentation',    file: '5-muendlich-praesentation.html',    label: 'Präsentation' },
    { id: 'zusammenfassung',  file: '5-muendlich-zusammenfassung.html',  label: 'Zusammenfassung' },
    { id: 'diskussion',       file: '5-muendlich-diskussion.html',       label: 'Diskussion' },
  ];

  /* ── Shared fragments ──────────────────────────── */

  function ergebnisse() {
    return `<div class="ergebnisse" id="ergebnisse">
      <h3>Ihre Ergebnisse</h3>
      <div id="ergebnis-liste"></div>
      <p style="margin-top:1.5rem;font-size:1.1rem;font-weight:bold;" id="punkte"></p>
    </div>`;
  }

  function submit() {
    return `<div class="submit-section">
      <button class="btn primary" id="auswerten-btn">Antworten überprüfen</button>
    </div>`;
  }

  function audioNote() {
    return `<div class="audio-note">
      <strong>⚠️ Hinweis:</strong> Die Audiodateien sind in diesem Test nicht verfügbar.
      Sie benötigen die offiziellen TELC Audio-CDs oder das Original-Testmaterial, um diesen Teil zu üben.
    </div>`;
  }

  function sectionNav(sectionId) {
    const idx = NAV.findIndex(n => n.id === sectionId);
    const prev = idx > 0 ? NAV[idx - 1] : null;
    const next = idx < NAV.length - 1 ? NAV[idx + 1] : null;
    let html = '<nav class="section-nav">';
    html += '<a href="index.html" class="section-nav-back">&larr; Modellprüfung</a>';
    html += '<div class="section-nav-links">';
    if (prev) html += `<a href="${prev.file}" class="section-nav-link prev">&larr; ${prev.label}</a>`;
    if (next) html += `<a href="${next.file}" class="section-nav-link next">${next.label} &rarr;</a>`;
    html += '</div></nav>';
    return html;
  }

  function header(modell, teil, lead, opts) {
    if (opts?.exam) return '';
    const sectionId = opts?._sectionId || '';
    return sectionNav(sectionId)
      + `<h1>Modellprüfung ${modell} – ${teil}</h1>\n<p class="lead">${lead}</p>`;
  }

  function footer(opts) {
    if (opts?.exam) return '';
    const sectionId = opts?._sectionId || '';
    return ergebnisse() + submit() + sectionNav(sectionId);
  }

  function buttons(letters, attrName, attrValue, valueAttr) {
    return letters.map(l =>
      `<button class="${attrName}" ${valueAttr}="${l}">${l}</button>`
    ).join('\n          ');
  }

  /* ═══════════════════════════════════════════════════
     LV1 — Leseverstehen Teil 1
     Textrekonstruktion: 6 Zuordnungsaufgaben (a-h)
     ═══════════════════════════════════════════════════ */
  function lv1(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const textEl = source.querySelector('[data-content="text"]');
    const optsEl = source.querySelector('[data-content="options"]');

    let html = header(modell, 'Leseverstehen Teil 1', 'Textrekonstruktion: 6 Zuordnungsaufgaben', opts);

    html += `<div class="aufgabe-box">
      <h2>Aufgabe</h2>
      <p>Lesen Sie den folgenden Text. Welche der Sätze <strong>a–h</strong> gehören in die Lücken <strong>1–6</strong>? Es gibt jeweils nur eine richtige Lösung. Zwei Sätze können nicht zugeordnet werden.</p>
      <p><em>Lücke (0) ist ein Beispiel.</em></p>
    </div>`;

    html += `<div class="text-box">${textEl.innerHTML}</div>`;

    html += `<div class="aufgabe-box"><h3>Wählen Sie die passenden Sätze</h3><div class="optionen" id="optionen">`;
    for (const key of 'abcdefghz') {
      const el = optsEl.querySelector(`[data-key="${key}"]`);
      if (el) {
        html += `<div class="option-item" data-option="${key}">
          <span class="option-label">${key}</span>
          <span>${el.innerHTML}</span>
        </div>`;
      }
    }
    html += `</div></div>`;

    html += `<div class="aufgabe-box"><h3>Ihre Antworten</h3>`;
    for (let i = 1; i <= 6; i++) {
      html += `<div class="frage" data-luecke="${i}">
        <div class="frage-nummer">Lücke ${i}</div>
        <div class="antwort-select">
          ${['a','b','c','d','e','f','g','h'].map(l => `<button class="antwort-btn" data-answer="${l}">${l}</button>`).join('\n          ')}
        </div>
      </div>`;
    }
    html += `</div>`;

    html += footer(opts);
    target.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════
     LV2 — Leseverstehen Teil 2
     Selektives Verstehen: 6 Zuordnungsaufgaben (a-e)
     ═══════════════════════════════════════════════════ */
  function lv2(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const textEl = source.querySelector('[data-content="text"]');
    const fragenEl = source.querySelector('[data-content="fragen"]');

    let html = header(modell, 'Leseverstehen Teil 2', 'Selektives Verstehen: 6 Zuordnungsaufgaben', opts);

    html += `<div class="aufgabe-box">
      <h2>Aufgabe</h2>
      <p>Lesen Sie den folgenden Text. In welchem Textabsatz <strong>a–e</strong> finden Sie die Antworten auf die Fragen <strong>7–12</strong>?</p>
      <p>Es gibt jeweils nur eine richtige Lösung. Jeder Absatz kann Antworten auf mehrere Fragen enthalten.</p>
      <p><em>Beispiel: Frage 0 → Antwort b</em></p>
    </div>`;

    html += `<div class="text-box">${textEl.innerHTML}</div>`;

    html += `<div class="aufgabe-box"><h3>Fragen</h3><div class="fragen-container">`;
    fragenEl.querySelectorAll('[data-frage]').forEach(f => {
      const nr = f.dataset.frage;
      html += `<div class="frage" data-frage="${nr}">
        <div class="frage-nummer">${nr}. In welchem Abschnitt …</div>
        <div class="frage-text">${f.innerHTML}</div>
        <div class="antwort-select">
          ${['a','b','c','d','e'].map(l => `<button class="antwort-btn" data-answer="${l}">${l}</button>`).join('\n          ')}
        </div>
      </div>`;
    });
    html += `</div></div>`;

    html += footer(opts);
    target.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════
     LV3 — Leseverstehen Teil 3
     Detailverstehen: 11 Aussagen + 1 Globalverstehen
     ═══════════════════════════════════════════════════ */
  function lv3(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const textEl = source.querySelector('[data-content="text"]');
    const aussagenEl = source.querySelector('[data-content="aussagen"]');
    const globalEl = source.querySelector('[data-content="global"]');

    let html = header(modell, 'Leseverstehen Teil 3', 'Detailverstehen: 11 Aussagen + 1 Globalverstehen', opts);

    html += `<div class="aufgabe-box">
      <h2>Aufgabe</h2>
      <p>Lesen Sie den folgenden Text und die Aussagen 13–23. Welche der Aussagen sind <strong>richtig (+)</strong>, <strong>falsch (−)</strong> oder <strong>gar nicht im Text enthalten (×)</strong>?</p>
      <p>Es gibt jeweils nur eine richtige Lösung.</p>
      <div class="legende">
        <div class="legende-item"><span class="legende-symbol">+</span><span>richtig</span></div>
        <div class="legende-item"><span class="legende-symbol">−</span><span>falsch</span></div>
        <div class="legende-item"><span class="legende-symbol">×</span><span>nicht im Text</span></div>
      </div>
    </div>`;

    html += `<div class="text-box">${textEl.innerHTML}</div>`;

    html += `<div class="aufgabe-box"><h3>Aussagen 13–23</h3><div class="aussagen-container">`;
    aussagenEl.querySelectorAll('[data-aussage]').forEach(a => {
      const nr = a.dataset.aussage;
      html += `<div class="aussage" data-aussage="${nr}">
        <div class="aussage-nummer">${nr}.</div>
        <div class="aussage-text">${a.innerHTML}</div>
        <div class="antwort-select">
          <button class="antwort-btn" data-answer="+">+ richtig</button>
          <button class="antwort-btn" data-answer="−">− falsch</button>
          <button class="antwort-btn" data-answer="×">× nicht im Text</button>
        </div>
      </div>`;
    });
    html += `</div></div>`;

    html += `<div class="aufgabe-box">
      <h3>Globalverstehen – Aufgabe 24</h3>
      <p><strong>Welche der Überschriften a, b oder c trifft die Aussage des Textes am besten?</strong></p>
      <div class="aussage" data-aussage="24"><div class="antwort-select">`;
    globalEl.querySelectorAll('[data-option]').forEach(o => {
      html += `<button class="antwort-btn" data-answer="${o.dataset.option}">${o.dataset.option}) ${o.innerHTML}</button>`;
    });
    html += `</div></div></div>`;

    html += footer(opts);
    target.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════
     SB — Sprachbausteine
     Grammatik und Lexik: 22 Aufgaben
     ═══════════════════════════════════════════════════ */
  function sb(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const textEl = source.querySelector('[data-content="text"]');
    const optionenEl = source.querySelector('[data-content="optionen"]');

    let html = header(modell, 'Sprachbausteine', 'Grammatik und Lexik: 22 Aufgaben', opts);

    html += `<div class="aufgabe-box">
      <h2>Aufgabe</h2>
      <p>Lesen Sie den folgenden Text. Welche Lösung (a, b, c oder d) ist jeweils richtig?</p>
      <p><strong>Klicken Sie auf die unterstrichenen Lücken im Text und wählen Sie die passende Option.</strong></p>
    </div>`;

    html += `<div class="text-box">${textEl.innerHTML}</div>`;

    html += `<div class="optionen-box"><h3>Auswahloptionen</h3>`;
    optionenEl.querySelectorAll('[data-lucke]').forEach(g => {
      const nr = g.dataset.lucke;
      html += `<div class="option-gruppe">
        <div class="option-gruppe-titel">${nr}</div>
        <div class="optionen-grid">`;
      g.querySelectorAll('[data-wert]').forEach(o => {
        html += `<button class="option-btn" data-lucke="${nr}" data-wert="${o.dataset.wert}">${o.innerHTML}</button>`;
      });
      html += `</div></div>`;
    });
    html += `</div>`;

    html += footer(opts);
    target.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════
     HV1 — Hörverstehen Teil 1
     Globalverstehen: 8 Personen zuordnen (a-j)
     ═══════════════════════════════════════════════════ */
  function hv1(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const themaEl = source.querySelector('[data-content="thema"]');
    const aussagenEl = source.querySelector('[data-content="aussagen"]');

    let html = header(modell, 'Hörverstehen Teil 1', 'Globalverstehen: 8 Personen zuordnen', opts);
    html += audioNote();

    html += `<div class="aufgabe-box">
      <h2>Aufgabe</h2>
      <p><strong>Thema:</strong> ${themaEl.textContent}</p>
      <p>Sie hören die Meinungen von acht Personen. Sie hören die Meinungen <strong>nur einmal</strong>.</p>
      <p>Entscheiden Sie beim Hören, welche Aussage (a–j) zu welcher Person (Sprecher/-in 1–8) passt.</p>
      <p><strong>Zwei Aussagen passen nicht.</strong></p>
    </div>`;

    html += `<div class="aussagen-box"><h3>Aussagen a–j</h3>`;
    aussagenEl.querySelectorAll('[data-key]').forEach(a => {
      html += `<div class="aussage-item">
        <div class="aussage-label">${a.dataset.key}</div>
        <div>${a.innerHTML}</div>
      </div>`;
    });
    html += `</div>`;

    html += `<div class="sprecher-container">`;
    const letters = 'abcdefghij'.split('');
    for (let i = 0; i < 8; i++) {
      const nr = 47 + i;
      html += `<div class="sprecher-box">
        <div class="sprecher-titel">Sprecher/in ${i + 1} (Aufgabe ${nr})</div>
        <div class="auswahl-buttons">
          ${letters.map(l => `<button class="auswahl-btn" data-sprecher="${nr}" data-wert="${l}">${l}</button>`).join('\n          ')}
        </div>
      </div>`;
    }
    html += `</div>`;

    html += footer(opts);
    target.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════
     HV2 — Hörverstehen Teil 2
     Detailverstehen: 10 Fragen zum Interview (a/b/c)
     ═══════════════════════════════════════════════════ */
  function hv2(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const themaEl = source.querySelector('[data-content="thema"]');
    const fragenEl = source.querySelector('[data-content="fragen"]');

    let html = header(modell, 'Hörverstehen Teil 2', 'Detailverstehen: 10 Fragen zum Interview', opts);
    html += audioNote();

    html += `<div class="aufgabe-box">
      <h2>Aufgabe</h2>
      <p><strong>Thema:</strong> ${themaEl.textContent}</p>
      <p>Sie hören eine Radiosendung. Sie hören die Sendung <strong>nur einmal</strong>.</p>
      <p>Entscheiden Sie beim Hören, welche Aussage (a, b oder c) am besten passt.</p>
    </div>`;

    html += `<div class="frage-container">`;
    fragenEl.querySelectorAll('[data-frage]').forEach(f => {
      const nr = f.dataset.frage;
      const stem = f.querySelector('.stem')?.textContent || '';
      html += `<div class="frage-box">
        <div class="frage-nummer">${nr}. ${stem}</div>
        <div class="antwort-buttons">`;
      f.querySelectorAll('[data-wert]').forEach(o => {
        html += `<button class="antwort-btn" data-frage="${nr}" data-wert="${o.dataset.wert}">${o.dataset.wert}) ${o.innerHTML}</button>`;
      });
      html += `</div></div>`;
    });
    html += `</div>`;

    html += footer(opts);
    target.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════
     HV3 — Hörverstehen Teil 3
     Informationstransfer: Lücken in Folien
     Slides HTML is unique per test, kept verbatim.
     ═══════════════════════════════════════════════════ */
  function hv3(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const themaEl = source.querySelector('[data-content="thema"]');
    const slidesEl = source.querySelector('[data-content="slides"]');

    let html = header(modell, 'Hörverstehen Teil 3', 'Informationstransfer: 10 Lücken in Folien', opts);
    html += audioNote();

    html += `<div class="aufgabe-box">
      <h2>Aufgabe</h2>
      <p><strong>Thema:</strong> ${themaEl.textContent}</p>
      <p>Sie hören einen Vortrag. Sie hören den Vortrag <strong>nur einmal</strong>.</p>
      <p>Sie haben Handzettel mit den Folien der Präsentation erhalten. Schreiben Sie die fehlenden Informationen <strong>stichwortartig</strong> in die freien Zeilen 65–74.</p>
    </div>`;

    html += `<div class="slides-container">${slidesEl.innerHTML}</div>`;

    if (!opts.exam) {
      html += `<div class="ergebnisse" id="ergebnisse">
        <h3>Ihre Ergebnisse</h3>
        <p style="margin-bottom:1rem;font-size:0.9rem;color:var(--ink-600);">
          <strong>Hinweis:</strong> Diese automatische Bewertung ist nur eine Orientierung. Die tatsächliche Bewertung berücksichtigt auch synonyme und sinngemäße Antworten.
        </p>
        <div id="ergebnis-liste"></div>
        <p style="margin-top:1.5rem;font-size:1.1rem;font-weight:bold;" id="punkte"></p>
      </div>`;
      html += submit();
    }

    target.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════
     SA — Schriftlicher Ausdruck
     ═══════════════════════════════════════════════════ */
  function sa(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const themenEl = source.querySelector('[data-content="themen"]');

    let html = header(modell, 'Schriftlicher Ausdruck', '70 Minuten • Mindestens 350 Wörter', opts);

    html += `<div class="aufgabe-box">
      <h2>Aufgabenstellung</h2>
      <p>In einer Seminararbeit sollen Sie ein Thema aus unterschiedlichen Perspektiven beleuchten.</p>
      <p><strong>Anforderungen:</strong></p>
      <ul>
        <li>Sie können die unten stehenden Zitate zur Orientierung verwenden, aber auch andere Aspekte des Themas darlegen.</li>
        <li>Argumentieren Sie überzeugend und führen Sie Beispiele an.</li>
        <li>Gliedern Sie Ihren Text in <strong>Einleitung, Hauptteil und Schluss</strong>.</li>
        <li>Mindestens <strong>350 Wörter</strong>.</li>
      </ul>
    </div>`;

    html += `<div class="aufgabe-box"><h2>Wählen Sie ein Thema</h2><div class="themen-container">`;
    themenEl.querySelectorAll('[data-thema]').forEach(t => {
      const key = t.dataset.thema;
      const title = t.querySelector('h3')?.textContent || key;
      html += `<div class="thema-box" data-thema="${key}"><h3>${title}</h3>`;
      t.querySelectorAll('.zitat').forEach(z => {
        html += `<div class="zitat">${z.innerHTML}</div>`;
      });
      html += `</div>`;
    });
    html += `</div></div>`;

    html += `<div class="editor-container" id="editor-container">
      <div class="aufgabe-box">
        <h2 id="selected-thema-title">Ihr Text</h2>
        <textarea id="text-input" placeholder="Schreiben Sie hier Ihren Text..."></textarea>
        <div class="word-count" id="word-count">0 Wörter</div>
      </div>
    </div>
    <div class="success-msg" id="success-msg">
      ✓ Text wurde in die Zwischenablage kopiert! Sie können ihn jetzt in eine KI einfügen zur Evaluation.
    </div>
    <div class="submit-section">
      <button class="btn primary" id="kopieren-btn" disabled>📋 Für Evaluation kopieren</button>
    </div>`;

    target.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════
     Präsentation — Mündliche Prüfung Teil 1A
     ═══════════════════════════════════════════════════ */
  function praesentation(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const teilnehmerEl = source.querySelector('[data-content="teilnehmer"]');
    const selectEl = source.querySelector('[data-content="select"]');

    let html = header(modell, 'Mündliche Prüfung', 'Teil 1A: Präsentation (ca. 3 Minuten)', opts);

    html += `<div class="info-box">
      <p><strong>Vorbereitung:</strong> 20 Minuten</p>
      <p><strong>Präsentation:</strong> ca. 3 Minuten pro Teilnehmer/in</p>
      <p><strong>Hinweis:</strong> Sie können sich Notizen machen (Stichworte, keinen zusammenhängenden Text).</p>
    </div>`;

    html += `<div class="aufgabe-box">
      <h2>Aufgabe</h2>
      <p>In einer Lehrveranstaltung Ihrer Universität sollen Sie eine Präsentation halten.</p>
      <p><strong>Wählen Sie eines der Themen aus.</strong></p>
      <p>Sie können sich Notizen machen (Stichworte, keinen zusammenhängenden Text). Denken Sie auch an eine Einleitung und einen Schluss bzw. ein Fazit.</p>
      <p>Ihre Präsentation soll gut gegliedert sein und das Thema verständlich und ausführlich darstellen.</p>
      <p>Im Anschluss werden Ihnen Fragen gestellt.</p>
    </div>`;

    html += `<div class="themen-container">${teilnehmerEl.innerHTML}</div>`;

    html += `<div class="aufgabe-box">
      <h3>Tipps für die Präsentation</h3>
      <ul style="line-height:1.8;">
        <li><strong>Einleitung:</strong> Thema vorstellen, eventuell persönlichen Bezug herstellen</li>
        <li><strong>Hauptteil:</strong> Strukturiert argumentieren, Beispiele nennen, verschiedene Aspekte beleuchten</li>
        <li><strong>Schluss:</strong> Zusammenfassung, Fazit oder eigene Position klar formulieren</li>
        <li><strong>Sprache:</strong> Klar und verständlich sprechen, Fachbegriffe erklären</li>
        <li><strong>Zeit:</strong> Ca. 3 Minuten - nicht zu kurz, nicht zu lang</li>
      </ul>
    </div>`;

    html += `<div class="aufgabe-box" style="margin-top:3rem;">
      <h2>Ihre Präsentation vorbereiten</h2>
      <p>Wählen Sie ein Thema aus und schreiben Sie Ihre Präsentation. Sie können dann alles kopieren und an eine KI zur Bewertung senden.</p>
      <div style="margin:1.5rem 0;">
        <label for="thema-auswahl" style="display:block;font-weight:bold;margin-bottom:0.5rem;">Gewähltes Thema:</label>
        <select id="thema-auswahl" style="width:100%;padding:0.75rem;background:var(--bg-secondary,#12110f);border:1px solid var(--border-subtle,#2a2825);border-radius:4px;color:inherit;font-family:inherit;font-size:1rem;">
          <option value="">-- Bitte wählen Sie ein Thema --</option>
          ${selectEl.innerHTML}
        </select>
      </div>
      <div id="thema-beschreibung" class="hidden" style="margin:1.5rem 0;padding:1rem;background:var(--panel-bg,#1a1916);border-left:3px solid var(--accent-ink,#457b9d);border-radius:4px;">
        <strong>Vollständige Aufgabe:</strong>
        <p id="thema-text" style="margin-top:0.5rem;line-height:1.6;"></p>
      </div>
      <div style="margin:1.5rem 0;">
        <label for="praesentation-text" style="display:block;font-weight:bold;margin-bottom:0.5rem;">Ihre Präsentation (Stichworte oder Volltext):</label>
        <textarea id="praesentation-text" rows="15" placeholder="Schreiben Sie hier Ihre Präsentation als Stichworte oder als vollständigen Text..."></textarea>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem;">
        <button id="kopieren-btn" class="btn primary">Alles kopieren (für KI-Bewertung)</button>
        <button id="reset-btn" class="btn secondary">Zurücksetzen</button>
      </div>
      <div id="kopiert-info" class="success-msg">
        Text wurde in die Zwischenablage kopiert! Fügen Sie ihn jetzt in eine KI ein (z.B. ChatGPT, Claude).
      </div>
    </div>
    <div class="submit-section"></div>`;

    target.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════
     Zusammenfassung — Mündliche Prüfung Teil 1B
     ═══════════════════════════════════════════════════ */
  function zusammenfassung(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const themenEl = source.querySelector('[data-content="themen"]');

    let html = header(modell, 'Mündliche Prüfung', 'Teil 1B: Zusammenfassung und Anschlussfragen (ca. 2 Minuten)', opts);

    html += `<div class="info-box">
      <p><strong>📝 Ablauf:</strong></p>
      <ol style="margin:0.5rem 0;padding-left:1.5rem;">
        <li>Sie hören die Präsentation Ihres Partners/Ihrer Partnerin</li>
        <li>Sie fassen zusammen, was für Sie besonders bemerkenswert war</li>
        <li>Sie stellen mindestens eine Frage zum Thema</li>
      </ol>
      <p style="margin-top:0.75rem;"><strong>⏱️ Zeit:</strong> ca. 2 Minuten</p>
    </div>`;

    html += `<div class="aufgabe-box">
      <h2>Schritt 1: Welches Thema haben SIE präsentiert?</h2>
      <p>Wählen Sie das Thema, das Sie in Teil 1A präsentiert haben. Sie werden dann eine <strong>andere</strong> Präsentation zur Zusammenfassung erhalten.</p>
      <div class="meine-praesentation-box">${themenEl.innerHTML}</div>
    </div>`;

    html += `<div id="partner-praesentation-container" class="hidden">
      <div class="aufgabe-box">
        <h2>Schritt 2: Hören Sie die Präsentation Ihres Partners</h2>
        <p>Lesen Sie die folgende Präsentation und machen Sie sich Notizen.</p>
      </div>
      <div class="partner-praesentation-box" id="partner-praesentation-text"></div>
      <div class="aufgabe-box">
        <h2>Schritt 3: Ihre Zusammenfassung</h2>
        <p>Fassen Sie zusammen, was für Sie besonders bemerkenswert war. Stellen Sie auch mindestens eine Anschlussfrage.</p>
        <textarea id="zusammenfassung-input" placeholder="Schreiben Sie hier Ihre Zusammenfassung und Anschlussfrage(n)..."></textarea>
      </div>
      <div class="aufgabe-box">
        <h3>Bewertungskriterien (werden beim Kopieren hinzugefügt)</h3>
        <p style="font-size:0.95rem;line-height:1.7;">
          <strong>Aufgabengerechtheit - Teil 1B (0-4 Punkte):</strong><br>
          A (4): Entspricht durchgängig | B (2): Weitgehend | C (1): Teilweise | D (0): Nicht
        </p>
        <p style="font-size:0.9rem;margin-top:0.75rem;color:var(--ink-600);">
          Plus: Sprachliche Angemessenheit (Flüssigkeit, Repertoire, Grammatik, Aussprache) wird gesamt bewertet.
        </p>
      </div>
      <div class="success-msg" id="success-msg">
        ✓ Text wurde kopiert! Fügen Sie ihn jetzt in eine KI ein zur Bewertung.
      </div>
    </div>
    <div class="submit-section">
      <button class="btn primary" id="kopieren-btn" style="display:none;">📋 Für Evaluation kopieren</button>
    </div>`;

    target.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════
     Diskussion — Mündliche Prüfung Teil 2
     ═══════════════════════════════════════════════════ */
  function diskussion(target, source, opts = {}) {
    const modell = source.dataset.modell || '?';
    const zitateEl = source.querySelector('[data-content="zitate"]');
    const simEl = source.querySelector('[data-content="simulation"]');

    let html = header(modell, 'Mündliche Prüfung', 'Teil 2: Diskussion (6 Minuten)', opts);

    html += `<div class="info-box">
      <p><strong>⏱️ Dauer:</strong> ca. 6 Minuten</p>
      <p><strong>👥 Format:</strong> Diskussion mit Ihrem/Ihrer Prüfungspartner/in</p>
      <p><strong>📝 Hinweis:</strong> Keine Vorbereitungszeit - Sie erhalten das Thema direkt im Prüfungsraum</p>
    </div>`;

    html += `<div class="aufgabe-box">
      <h2>Aufgabe</h2>
      <p>Diskutieren Sie mit Ihrer Partnerin oder Ihrem Partner über eine der folgenden Aussagen:</p>
      <ul style="line-height:1.8;margin:1rem 0;">
        <li>Wie verstehen Sie diese Aussage?</li>
        <li>Inwiefern teilen Sie diese Ansicht?</li>
        <li>Geben Sie dazu Gründe und Beispiele an.</li>
        <li>Gehen Sie auch auf die Argumente Ihrer Partnerin/Ihres Partners ein.</li>
      </ul>
      <p><strong>Es soll ein Austausch von Argumenten stattfinden.</strong></p>
    </div>`;

    html += `<div class="zitat-container">${zitateEl.innerHTML}</div>`;

    html += `<div class="aufgabe-box">
      <h3>Tipps für die Diskussion</h3>
      <ul style="line-height:1.8;">
        <li><strong>Aktiv zuhören:</strong> Auf die Argumente des Partners eingehen</li>
        <li><strong>Klar argumentieren:</strong> Beispiele und Begründungen nennen</li>
        <li><strong>Respektvoll bleiben:</strong> Auch bei unterschiedlichen Meinungen</li>
        <li><strong>Nachfragen:</strong> „Wie meinst du das?" / „Könntest du ein Beispiel nennen?"</li>
        <li><strong>Position einnehmen:</strong> Eigene Meinung klar vertreten, aber auch Kompromisse zeigen</li>
        <li><strong>Sprache:</strong> Redemittel nutzen wie „Meiner Meinung nach...", „Ich sehe das anders, weil..."</li>
      </ul>
    </div>`;

    html += `<div class="aufgabe-box" style="margin-top:3rem;">
      <h2>Diskussionssimulation mit KI</h2>
      <p>Wählen Sie ein Diskussionsthema und kopieren Sie die Aufgabe. Eine KI wird dann als Ihr Diskussionspartner agieren und Sie nach TELC C1 Standards bewerten.</p>
      <div class="themen-container">${simEl.innerHTML}</div>
      <div id="zitat-vorschau" class="hidden" style="margin:1.5rem 0;padding:1rem;background:var(--panel-bg,#1a1916);border-left:3px solid var(--accent-ink,#457b9d);border-radius:4px;">
        <strong>Mögliche Diskussionsaspekte:</strong>
        <ul id="diskussionsaspekte-vorschau" style="margin-top:0.5rem;line-height:1.6;"></ul>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem;">
        <button id="kopieren-diskussion-btn" class="btn primary">📋 Diskussionsaufgabe kopieren (für KI)</button>
      </div>
      <div id="kopiert-info-diskussion" class="success-msg">
        ✓ Aufgabe wurde in die Zwischenablage kopiert! Fügen Sie sie jetzt in eine KI ein (z.B. ChatGPT, Claude) um die Diskussion zu beginnen.
      </div>
    </div>
    <div class="submit-section"></div>`;

    target.innerHTML = html;
  }

  /* ── Public API ────────────────────────────────── */
  return { lv1, lv2, lv3, sb, hv1, hv2, hv3, sa, praesentation, zusammenfassung, diskussion };
})();
