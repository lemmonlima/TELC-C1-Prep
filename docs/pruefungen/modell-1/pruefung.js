/* ═══════════════════════════════════════════════════════
   Shared exam logic — Modellprüfung
   Provides: navigation, button handling, results display.
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

  /** Build the sticky bottom navigation. Call once per page. */
  function initNav() {
    const current = location.pathname.split('/').pop();
    const idx = NAV.findIndex(n => n.file === current);
    const prev = idx > 0 ? NAV[idx - 1] : null;
    const next = idx < NAV.length - 1 ? NAV[idx + 1] : null;

    const section = document.querySelector('.submit-section');
    if (!section) return;

    // Clear existing navigation buttons (keep evaluate button if present)
    const evalBtn = section.querySelector('#auswerten-btn');
    const copyBtn = section.querySelector('#kopieren-btn');
    section.innerHTML = '';

    // Back to overview
    const backBtn = document.createElement('a');
    backBtn.className = 'btn secondary';
    backBtn.href = 'index.html';
    backBtn.textContent = '← Übersicht';
    section.appendChild(backBtn);

    // Re-add evaluate button if it existed
    if (evalBtn) section.appendChild(evalBtn);
    if (copyBtn) section.appendChild(copyBtn);

    // Next section
    if (next) {
      const nextBtn = document.createElement('a');
      nextBtn.className = 'btn secondary';
      nextBtn.href = next.file;
      nextBtn.textContent = next.label + ' →';
      section.appendChild(nextBtn);
    }
  }

  /* ── Generic button selection ─────────────────────── */

  /**
   * Wire up click-to-select on buttons inside a container.
   * @param {string} btnSelector  – CSS selector for the buttons
   * @param {string} groupAttr    – data attribute that groups buttons (e.g. 'data-frage')
   * @param {string} valueAttr    – data attribute holding the answer value (e.g. 'data-answer')
   * @param {object} store        – plain object where answers are stored: store[group] = value
   * @param {function} [onSelect] – optional callback(group, value)
   */
  function initButtons(btnSelector, groupAttr, valueAttr, store, onSelect) {
    document.querySelectorAll(btnSelector).forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest(`[${groupAttr}]`)?.getAttribute(groupAttr)
                   || btn.getAttribute(groupAttr);
        const value = btn.getAttribute(valueAttr);

        // Deselect siblings
        const parent = btn.closest(`[${groupAttr}]`) || btn.parentElement;
        parent.querySelectorAll(btnSelector).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        store[group] = value;
        if (onSelect) onSelect(group, value);
      });
    });
  }

  /* ── Results display ──────────────────────────────── */

  /**
   * Render evaluation results in the standard format.
   * @param {Array<{label:string, userAnswer:string, correctAnswer:string, isCorrect:boolean, points?:number}>} items
   * @param {string} summary – e.g. "5 von 6 richtig (83%)"
   */
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

  /* ── Public API ───────────────────────────────────── */
  return { initNav, initButtons, showResults };
})();

// Auto-init navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Pruefung.initNav());
} else {
  Pruefung.initNav();
}
