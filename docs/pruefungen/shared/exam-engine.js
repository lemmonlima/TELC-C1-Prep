/* ═══════════════════════════════════════════════════════
   Exam runner engine — TELC C1 Hochschule Simulator
   State machine, timers, section loading, evaluation.

   Expects EXAM_DATA global (from exam-data.js):
     { title, correct, themaTexte, saThemen, diskussionZitate, hvTranskript }
   ═══════════════════════════════════════════════════════ */
'use strict';

const Exam = (() => {

  const CORRECT = EXAM_DATA.correct;

  /* ── Phase definitions ───────────────────────────── */
  const PHASES = [
    { id:'start', type:'screen' },
    { id:'lesen', type:'timed', time:90*60, label:'Leseverstehen + Sprachbausteine',
      tabs:[
        { id:'lv1', label:'LV Teil 1', url:'1-leseverstehen-teil-1.html' },
        { id:'lv2', label:'LV Teil 2', url:'1-leseverstehen-teil-2.html' },
        { id:'lv3', label:'LV Teil 3', url:'1-leseverstehen-teil-3.html' },
        { id:'sb',  label:'Sprachbausteine', url:'2-sprachbausteine.html' },
      ]},
    { id:'break1', type:'break', time:20*60, label:'Pause' },
    { id:'hv_ready', type:'ready', screen:'screen-hv-ready' },
    { id:'hv', type:'timed', time:45*60, label:'Hörverstehen',
      tabs:[
        { id:'hv1', label:'HV Teil 1', url:'3-hoerverstehen-teil-1.html' },
        { id:'hv2', label:'HV Teil 2', url:'3-hoerverstehen-teil-2.html' },
        { id:'hv3', label:'HV Teil 3', url:'3-hoerverstehen-teil-3.html' },
      ]},
    { id:'sa', type:'timed', time:70*60, label:'Schriftlicher Ausdruck',
      tabs:[{ id:'sa', label:'Schriftlicher Ausdruck' }] },
    { id:'muendlich_ready', type:'ready', screen:'screen-muendlich-ready' },
    { id:'vorbereitung', type:'timed', time:20*60, label:'Vorbereitung (Mündlich)',
      tabs:[{ id:'vorbereitung', label:'Vorbereitung' }] },
    { id:'praesentation', type:'timed', time:210, label:'Präsentation (Teil 1A)',
      tabs:[{ id:'praesentation', label:'Präsentation' }] },
    { id:'zusammenfassung_ready', type:'ready', screen:'screen-zusammenfassung-ready' },
    { id:'zusammenfassung', type:'timed', time:4*60, label:'Zusammenfassung (Teil 1B)',
      tabs:[{ id:'zusammenfassung', label:'Zusammenfassung' }] },
    { id:'diskussion_ready', type:'ready', screen:'screen-diskussion-ready' },
    { id:'diskussion', type:'timed', time:390, label:'Diskussion (Teil 2)',
      tabs:[{ id:'diskussion', label:'Diskussion' }] },
    { id:'results', type:'screen' },
  ];

  /* ── State ────────────────────────────────────────── */
  let phaseIdx = 0;
  let timerInterval = null;
  let timeRemaining = 0;
  const answers = { lv1:{}, lv2:{}, lv3:{}, sb:{}, hv1:{}, hv2:{}, hv3:{}, sa:{thema:null,text:''}, muendlich:{} };
  const aiScores = {};
  let partnerPraesentation = null;
  let selectedDiskussionThema = null;

  /* ── DOM refs ─────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const bar      = () => $('exam-bar');
  const tabsEl   = () => $('exam-tabs');
  const content  = () => $('exam-content');
  const timerEl  = () => $('timer');
  const labelEl  = () => $('phase-label');
  const skipBtn  = () => $('btn-skip');

  /* ── Helpers ──────────────────────────────────────── */
  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function hideAll() {
    document.querySelectorAll('.exam-screen').forEach(s => s.classList.remove('active'));
    bar().classList.add('hidden');
    tabsEl().classList.add('hidden');
    content().classList.add('hidden');
  }

  function showScreen(id) { hideAll(); $(id).classList.add('active'); }

  /* ── Timer ────────────────────────────────────────── */
  function startTimer(seconds, onTick, onDone) {
    stopTimer();
    timeRemaining = seconds;
    onTick(timeRemaining);
    timerInterval = setInterval(() => {
      timeRemaining--;
      onTick(timeRemaining);
      if (timeRemaining <= 0) { stopTimer(); onDone(); }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  /* ── Phase management ─────────────────────────────── */
  function enterPhase(idx) {
    phaseIdx = idx;
    const phase = PHASES[idx];
    if (!phase) return;

    if (phase.type === 'screen') {
      if (phase.id === 'start') showScreen('screen-start');
      else if (phase.id === 'results') showResults();
      return;
    }

    if (phase.type === 'break') {
      showScreen('screen-break');
      startTimer(phase.time,
        sec => $('break-timer').textContent = fmt(sec),
        () => nextPhase()
      );
      return;
    }

    if (phase.type === 'ready') { showScreen(phase.screen); return; }

    if (phase.type === 'timed') {
      hideAll();
      bar().classList.remove('hidden');
      content().classList.remove('hidden');
      labelEl().textContent = phase.label;

      if (phase.tabs && phase.tabs.length > 1) {
        tabsEl().classList.remove('hidden');
        content().classList.remove('no-tabs');
        buildTabs(phase.tabs);
        showTab(phase.tabs[0].id);
      } else if (phase.tabs && phase.tabs.length === 1) {
        content().classList.add('no-tabs');
        showTab(phase.tabs[0].id);
      }

      const loadPromises = (phase.tabs || [])
        .filter(t => t.url)
        .map(t => loadSection(t.id, t.url));
      Promise.all(loadPromises);

      startTimer(phase.time,
        sec => {
          timerEl().textContent = fmt(sec);
          timerEl().classList.toggle('warning', sec <= 300);
        },
        () => nextPhase()
      );
    }
  }

  function nextPhase() { stopTimer(); enterPhase(phaseIdx + 1); }

  /* ── Tabs ─────────────────────────────────────────── */
  function buildTabs(tabs) {
    const el = tabsEl();
    el.innerHTML = '';
    tabs.forEach(t => {
      const btn = document.createElement('button');
      btn.textContent = t.label;
      btn.dataset.tab = t.id;
      btn.addEventListener('click', () => showTab(t.id));
      el.appendChild(btn);
    });
  }

  function showTab(tabId) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = $(`tab-${tabId}`);
    if (panel) panel.classList.add('active');
    tabsEl().querySelectorAll('button').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });
  }

  /* ── Section loading via fetch ────────────────────── */
  async function loadSection(tabId, url) {
    const panel = $(`tab-${tabId}`);
    if (!panel || panel.dataset.loaded) return;

    try {
      const res = await fetch(url);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const main = doc.querySelector('main');
      if (!main) return;

      const sectionType = main.dataset.section;
      if (sectionType && typeof SectionBuilder !== 'undefined' && SectionBuilder[sectionType]) {
        SectionBuilder[sectionType](panel, main, { exam: true });
      } else {
        main.querySelectorAll('.ergebnisse, .submit-section, h1, .lead').forEach(el => el.remove());
        panel.innerHTML = main.innerHTML;
      }

      panel.dataset.loaded = 'true';
      initSectionHandlers(tabId, panel);
    } catch (e) {
      panel.innerHTML = `<div class="aufgabe-box"><p>Fehler beim Laden: ${e.message}</p></div>`;
    }
  }

  /* ── Handler initialization for loaded sections ──── */
  function initSectionHandlers(tabId, container) {
    const store = answers[tabId] || (answers[tabId] = {});

    // .antwort-btn inside [data-luecke] (LV1)
    container.querySelectorAll('[data-luecke] .antwort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const frage = btn.closest('[data-luecke]');
        const key = frage.dataset.luecke;
        frage.querySelectorAll('.antwort-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        store[key] = btn.dataset.answer;
      });
    });

    // .antwort-btn inside [data-frage] parent (LV2)
    container.querySelectorAll('[data-frage] .antwort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const frage = btn.closest('[data-frage]');
        const key = frage.dataset.frage;
        frage.querySelectorAll('.antwort-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        store[key] = btn.dataset.answer;
      });
    });

    // .antwort-btn with data-frage ON the button itself (HV2)
    container.querySelectorAll('.antwort-btn[data-frage][data-wert]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.frage;
        container.querySelectorAll(`.antwort-btn[data-frage="${key}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        store[key] = btn.dataset.wert;
      });
    });

    // .antwort-btn inside [data-aussage] (LV3)
    container.querySelectorAll('[data-aussage] .antwort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const aussage = btn.closest('[data-aussage]');
        const key = aussage.dataset.aussage;
        aussage.querySelectorAll('.antwort-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        store[key] = btn.dataset.answer;
      });
    });

    // .auswahl-btn (HV1 speakers)
    container.querySelectorAll('.auswahl-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sprecher = btn.dataset.sprecher;
        container.querySelectorAll(`.auswahl-btn[data-sprecher="${sprecher}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        store[sprecher] = btn.dataset.wert;
      });
    });

    // .option-btn (Sprachbausteine)
    container.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nr = btn.dataset.lucke;
        container.querySelectorAll(`.option-btn[data-lucke="${nr}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const lucke = container.querySelector(`.lucke[data-lucke="${nr}"]`);
        if (lucke) { lucke.textContent = btn.dataset.wert; lucke.classList.add('filled'); }
        store[nr] = btn.dataset.wert;
      });
    });

    // .lucke click → scroll to option group (Sprachbausteine)
    container.querySelectorAll('.lucke').forEach(lucke => {
      lucke.addEventListener('click', () => {
        const nr = lucke.dataset.lucke;
        container.querySelectorAll('.option-gruppe').forEach(g => {
          const titel = g.querySelector('.option-gruppe-titel');
          if (titel && titel.textContent.trim() === nr) {
            g.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      });
    });

    // .slide-input (HV3)
    container.querySelectorAll('.slide-input').forEach(input => {
      input.addEventListener('input', () => {
        store[input.dataset.nummer] = input.value.trim().toLowerCase();
        input.classList.toggle('filled', input.value.trim().length > 0);
      });
    });
  }

  /* ── SA section handlers ─────────────────────────── */
  function initSA() {
    const saPanel = $('tab-sa');

    saPanel.querySelectorAll('.thema-box').forEach(box => {
      box.addEventListener('click', () => {
        saPanel.querySelectorAll('.thema-box').forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
        answers.sa.thema = box.dataset.thema;
        $('sa-editor').classList.add('show');
        const t = EXAM_DATA.saThemen[box.dataset.thema];
        $('sa-thema-title').textContent = t ? t.title : box.dataset.thema;
        updateWordCount();
      });
    });

    const textarea = $('sa-text');
    textarea.addEventListener('input', () => {
      answers.sa.text = textarea.value;
      updateWordCount();
    });

    function updateWordCount() {
      const text = textarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const el = $('sa-word-count');
      el.textContent = `${words} Wörter`;
      el.className = 'word-count ' + (words >= 350 ? 'ok' : 'warning');
    }

    $('sa-copy-btn').addEventListener('click', () => {
      if (!answers.sa.thema) { alert('Bitte wählen Sie zuerst ein Thema.'); return; }
      if (!answers.sa.text.trim()) { alert('Bitte schreiben Sie zuerst Ihren Text.'); return; }
      const t = EXAM_DATA.saThemen[answers.sa.thema];
      const themaStr = t
        ? `${t.title}\nZitate:\n${t.zitate.map(z => `- "${z}"`).join('\n')}`
        : answers.sa.thema;

      const text = `# TELC C1 Hochschule – Schriftlicher Ausdruck\n\n## THEMA\n${themaStr}\n\n## MEIN TEXT\n\n${answers.sa.text.trim()}\n\n## BEWERTUNGSKRITERIEN (A=12, B=8, C=4, D=0)\n1. Aufgabengerechtheit (max 12)\n2. Korrektheit (max 12)\n3. Repertoire (max 12)\n4. Kommunikative Gestaltung (max 12)\n\nMaximal: 48 Punkte\n\nBitte bewerten Sie nach jedem Kriterium (A/B/C/D) und geben Sie am Ende:\n\n| Kriterium | Note | Punkte |\n|---|---|---|\n| 1. Aufgabengerechtheit | _/A | _/12 |\n| 2. Korrektheit | _/A | _/12 |\n| 3. Repertoire | _/A | _/12 |\n| 4. Kommunikative Gestaltung | _/A | _/12 |\n| **GESAMT** | | _/48 |`;
      copyText(text, 'sa-copy-msg');
    });
  }

  /* ── Mündlich section handlers ────────────────────── */
  function initMuendlich() {
    const THEMA_TEXTE = EXAM_DATA.themaTexte;
    const DISKUSSION_ZITATE = EXAM_DATA.diskussionZitate;

    // Vorbereitung: topic selection
    const vorPanel = $('tab-vorbereitung');
    vorPanel.querySelectorAll('.thema-box[data-topic]').forEach(box => {
      box.addEventListener('click', () => {
        vorPanel.querySelectorAll('.thema-box[data-topic]').forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
        answers.muendlich.topic = box.dataset.topic;
      });
    });

    // Präsentation: copy for AI evaluation
    $('praesentation-copy-btn').addEventListener('click', () => {
      const topic = answers.muendlich.topic;
      if (!topic) { alert('Kein Thema gewählt (Vorbereitung).'); return; }
      const text = $('praesentation-text').value.trim();
      if (!text) { alert('Bitte schreiben Sie zuerst Ihre Präsentation.'); return; }

      const aufgabe = THEMA_TEXTE[topic] || topic;
      const aiText = `# TELC C1 Hochschule – Mündliche Prüfung: Präsentation (Teil 1A)\n\n## GEWÄHLTES THEMA\n${aufgabe}\n\n## PRÄSENTATION DES KANDIDATEN\n\n${text}\n\n---\n\n## OFFIZIELLE TELC BEWERTUNGSKRITERIEN\n\n### INHALTLICHE ANGEMESSENHEIT\n\n**1. Aufgabengerechtheit – Teil 1A Präsentation (0-6 Punkte)**\n\n- **A (6):** Entspricht durchgängig | **B (4):** Weitgehend | **C (2):** Mehrere Merkmale nicht | **D (0):** Überhaupt nicht\n\n### SPRACHLICHE ANGEMESSENHEIT\n**2. Flüssigkeit (0-8)** | **3. Repertoire (0-8)** | **4. Grammatik (0-8)** | **5. Aussprache (0-8)**\n\n| Kriterium | Note | Punkte |\n|---|---|---|\n| 1. Aufgabengerechtheit (Teil 1A) | _/A | _/6 |\n| 2. Flüssigkeit | _/A | _/8 |\n| 3. Repertoire | _/A | _/8 |\n| 4. Grammatische Richtigkeit | _/A | _/8 |\n| 5. Aussprache und Intonation | _/A | _/8 |\n| **GESAMT** | | _/38 |`;
      copyText(aiText, 'praesentation-copy-msg');
    });

    // Zusammenfassung ready: copy partner text
    $('btn-copy-partner').addEventListener('click', () => {
      const topic = answers.muendlich.topic;
      if (!topic) { alert('Sie müssen zuerst in der Vorbereitung ein Thema wählen.'); return; }
      partnerPraesentation = getRandomPartnerPraesentation(topic);
      const text = `Bitte lies den folgenden Text laut und deutlich vor, als ob du eine Präsentation hältst. Lies langsam und klar:\n\n---\n\n${partnerPraesentation.text}\n\n---\n\nLies diesen Text jetzt laut vor.`;
      copyText(text, 'msg-partner-copied');
    });

    // Zusammenfassung: textarea handler
    $('zusammenfassung-text').addEventListener('input', function() {
      answers.muendlich.zusammenfassung = this.value;
    });

    // Zusammenfassung: copy for evaluation
    $('zusammenfassung-copy-btn').addEventListener('click', () => {
      const text = answers.muendlich.zusammenfassung || '';
      if (!text.trim()) { alert('Bitte schreiben Sie zuerst Ihre Zusammenfassung.'); return; }
      const partner = partnerPraesentation ? partnerPraesentation.titel : 'Unbekannt';
      const aiText = `# TELC C1 Hochschule – Mündliche Prüfung: Zusammenfassung (Teil 1B)\n\n## PRÄSENTATION DES PARTNERS\nThema: ${partner}\n\n## MEINE ZUSAMMENFASSUNG\n\n${text}\n\n## BEWERTUNG\nAufgabengerechtheit Teil 1B (0-4 Punkte)\n- A (4): Entspricht durchgängig\n- B (2): Weitgehend\n- C (1): Teilweise\n- D (0): Nicht\n\nBitte bewerten Sie und geben Sie die Punktzahl.`;
      copyText(aiText, 'zusammenfassung-copy-msg');
    });

    // Diskussion ready: topic selection
    $('screen-diskussion-ready').querySelectorAll('.thema-box[data-zitat]').forEach(box => {
      box.addEventListener('click', () => {
        $('screen-diskussion-ready').querySelectorAll('.thema-box[data-zitat]').forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
        selectedDiskussionThema = box.dataset.zitat;
      });
    });

    // Diskussion ready: copy
    $('btn-copy-diskussion').addEventListener('click', () => {
      if (!selectedDiskussionThema) { alert('Bitte wählen Sie ein Thema.'); return; }
      const z = DISKUSSION_ZITATE[selectedDiskussionThema];
      const aspekte = z.aspekte.map((a,i) => `${i+1}. ${a}`).join('\n');
      const aiText = `# TELC C1 Hochschule – Mündliche Prüfung: Diskussion (Teil 2)\n\n## IHRE ROLLE\nSie sind mein Diskussionspartner. Wir führen eine 6-minütige Diskussion.\n- Diskutieren Sie aktiv mit mir\n- Stellen Sie Fragen und Gegenargumente\n- Bewerten Sie mich am Ende\n\n## ZITAT\n„${z.text}"\n— ${z.autor}\n\n## ASPEKTE\n${aspekte}\n\n## BEWERTUNG AM ENDE\n| Kriterium | Note | Punkte |\n|---|---|---|\n| 1. Aufgabengerechtheit (Teil 2) | _/A | _/6 |\n| 2. Flüssigkeit | _/A | _/8 |\n| 3. Repertoire | _/A | _/8 |\n| 4. Grammatische Richtigkeit | _/A | _/8 |\n| 5. Aussprache und Intonation | _/A | _/8 |\n| **GESAMT** | | _/38 |\n\nIch fange jetzt an!`;
      copyText(aiText, 'msg-diskussion-copied');
    });
  }

  /* ── Copy helper ─────────────────────────────────── */
  function copyText(text, msgId) {
    navigator.clipboard.writeText(text).then(() => {
      const msg = $(msgId);
      if (msg) { msg.classList.add('show'); setTimeout(() => msg.classList.remove('show'), 4000); }
    }).catch(err => alert('Fehler beim Kopieren: ' + err));
  }

  /* ── Official TELC C1 Hochschule scoring ─────────── */
  const HV3_MAX = { 65:2, 66:2, '67a':1, '67b':1, '68a':1, '68b':1, 69:2, '70a':1, '70b':1, '71a':1, '71b':1, 72:2, 73:2, 74:2 };

  function checkHV3(key, userAnswer) {
    if (!userAnswer) return 0;
    const possible = CORRECT.hv3[key] || [];
    const ul = userAnswer.toLowerCase();
    const max = HV3_MAX[key] || 2;
    for (const c of possible) {
      if (ul.includes(c) || c.includes(ul)) return max;
    }
    const kw = possible.join(' ').split(' ');
    for (const w of ul.split(' ')) {
      if (w.length > 3 && kw.some(k => k.includes(w) || w.includes(k))) return Math.max(1, max - 1);
    }
    return 0;
  }

  /* ── Evaluation ──────────────────────────────────── */
  function evaluateAutoScored() {
    const results = {};

    // LV1: 6 items × 2 pts = 12
    results.lv1 = { items: [], max: 12 };
    for (let i = 1; i <= 6; i++) {
      const u = answers.lv1[i] || '—';
      const c = CORRECT.lv1[i];
      results.lv1.items.push({ q: `Lücke ${i}`, user: u, correct: c, ok: u === c });
    }
    results.lv1.earned = results.lv1.items.filter(r => r.ok).length * 2;

    // LV2: 6 items × 2 pts = 12
    results.lv2 = { items: [], max: 12 };
    for (let i = 7; i <= 12; i++) {
      const u = answers.lv2[i] || '—';
      const c = CORRECT.lv2[i];
      results.lv2.items.push({ q: `Frage ${i}`, user: u, correct: c, ok: u === c });
    }
    results.lv2.earned = results.lv2.items.filter(r => r.ok).length * 2;

    // LV3: 12 items × 2 pts = 24
    results.lv3 = { items: [], max: 24 };
    for (let i = 13; i <= 23; i++) {
      const u = answers.lv3[i] || '—';
      const c = CORRECT.lv3[i];
      results.lv3.items.push({ q: `Aussage ${i}`, user: u, correct: c, ok: u === c });
    }
    const u24 = answers.lv3[24] || '—';
    results.lv3.items.push({ q: 'Aufgabe 24', user: u24, correct: 'b', ok: u24 === 'b' });
    results.lv3.earned = results.lv3.items.filter(r => r.ok).length * 2;

    // SB: 22 pts (1 per item, cap at 22)
    results.sb = { items: [], max: 22 };
    let sbCorrect = 0;
    for (let i = 25; i <= 47; i++) {
      const u = answers.sb[i] || '—';
      const c = CORRECT.sb[i];
      const ok = u === c;
      if (ok) sbCorrect++;
      results.sb.items.push({ q: `Lücke ${i}`, user: u, correct: c, ok });
    }
    results.sb.earned = Math.min(sbCorrect, 22);

    // HV1: 8 items × 1 pt = 8
    results.hv1 = { items: [], max: 8 };
    for (let i = 47; i <= 54; i++) {
      const u = answers.hv1[i] || '—';
      const c = CORRECT.hv1[i];
      results.hv1.items.push({ q: `Sprecher ${i-46}`, user: u, correct: c, ok: u === c });
    }
    results.hv1.earned = results.hv1.items.filter(r => r.ok).length;

    // HV2: 10 items × 2 pts = 20
    results.hv2 = { items: [], max: 20 };
    for (let i = 55; i <= 64; i++) {
      const u = answers.hv2[i] || '—';
      const c = CORRECT.hv2[i];
      results.hv2.items.push({ q: `Frage ${i}`, user: u, correct: c, ok: u === c });
    }
    results.hv2.earned = results.hv2.items.filter(r => r.ok).length * 2;

    // HV3: max 20 pts
    results.hv3 = { items: [], max: 20 };
    let hv3pts = 0;
    const hv3keys = [65, 66, '67a', '67b', '68a', '68b', 69, '70a', '70b', '71a', '71b', 72, 73, 74];
    hv3keys.forEach(key => {
      const u = answers.hv3[key] || '';
      const possible = CORRECT.hv3[key] || [];
      const maxPts = HV3_MAX[key] || 2;
      const pts = checkHV3(key, u);
      hv3pts += pts;
      results.hv3.items.push({
        q: `Frage ${key}`, user: u || '—',
        correct: possible.slice(0, 2).join(', '),
        ok: pts === maxPts, partial: pts > 0 && pts < maxPts
      });
    });
    results.hv3.earned = Math.min(hv3pts, 20);

    return results;
  }

  /* ── Results screen ──────────────────────────────── */
  function showResults() {
    hideAll();
    $('screen-results').classList.add('active');

    const results = evaluateAutoScored();
    const container = $('results-content');
    container.innerHTML = '';

    const lvTotal = results.lv1.earned + results.lv2.earned + results.lv3.earned;
    const sbTotal = results.sb.earned;
    const hvTotal = results.hv1.earned + results.hv2.earned + results.hv3.earned;
    const autoTotal = lvTotal + sbTotal + hvTotal;

    container.innerHTML += `
    <div class="results-section">
      <h3>Automatisch bewertet</h3>
      <div class="score-row"><span class="label">Leseverstehen</span><span class="value">${lvTotal} / 48</span></div>
      <div class="score-row"><span class="label">Sprachbausteine</span><span class="value">${sbTotal} / 22</span></div>
      <div class="score-row"><span class="label">Hörverstehen</span><span class="value">${hvTotal} / 48</span></div>
      <div class="score-row" style="font-weight:700;border-top:2px solid var(--border-subtle,#2a2825);padding-top:0.75rem;">
        <span class="label">Gesamt (automatisch)</span><span class="value">${autoTotal} / 118</span>
      </div>
    </div>

    <div class="results-section">
      <h3>KI-bewertete Teile</h3>
      <p style="margin-bottom:1rem;opacity:0.7;">Geben Sie die Punkte ein, die Ihnen die KI gegeben hat.</p>
      <h4 style="color:var(--accent-ink);margin:1.5rem 0 0.75rem;">Schriftlicher Ausdruck (max. 48)</h4>
      <p style="opacity:0.6;font-size:0.85rem;margin-bottom:0.5rem;">Skala: A=12 / B=8 / C=4 / D=0</p>
      <div class="score-row"><span class="label">Aufgabengerechtheit</span><input class="score-input ai-score" data-group="sa" type="number" min="0" max="12" placeholder="/12"></div>
      <div class="score-row"><span class="label">Korrektheit</span><input class="score-input ai-score" data-group="sa" type="number" min="0" max="12" placeholder="/12"></div>
      <div class="score-row"><span class="label">Repertoire</span><input class="score-input ai-score" data-group="sa" type="number" min="0" max="12" placeholder="/12"></div>
      <div class="score-row"><span class="label">Kommunikative Gestaltung</span><input class="score-input ai-score" data-group="sa" type="number" min="0" max="12" placeholder="/12"></div>
      <h4 style="color:var(--accent-ink);margin:1.5rem 0 0.75rem;">Mündlich – Inhaltliche Angemessenheit (max. 16)</h4>
      <div class="score-row"><span class="label">Präsentation (Teil 1A)</span><input class="score-input ai-score" data-group="muend-inhalt" type="number" min="0" max="6" placeholder="/6"></div>
      <div class="score-row"><span class="label">Zusammenfassung (Teil 1B)</span><input class="score-input ai-score" data-group="muend-inhalt" type="number" min="0" max="4" placeholder="/4"></div>
      <div class="score-row"><span class="label">Diskussion (Teil 2)</span><input class="score-input ai-score" data-group="muend-inhalt" type="number" min="0" max="6" placeholder="/6"></div>
      <h4 style="color:var(--accent-ink);margin:1.5rem 0 0.75rem;">Mündlich – Sprachliche Angemessenheit (max. 32)</h4>
      <p style="opacity:0.6;font-size:0.85rem;margin-bottom:0.5rem;">Skala: A=8 / B=5 / C=2 / D=0</p>
      <div class="score-row"><span class="label">Flüssigkeit</span><input class="score-input ai-score" data-group="muend-sprach" type="number" min="0" max="8" placeholder="/8"></div>
      <div class="score-row"><span class="label">Repertoire</span><input class="score-input ai-score" data-group="muend-sprach" type="number" min="0" max="8" placeholder="/8"></div>
      <div class="score-row"><span class="label">Grammatische Richtigkeit</span><input class="score-input ai-score" data-group="muend-sprach" type="number" min="0" max="8" placeholder="/8"></div>
      <div class="score-row"><span class="label">Aussprache und Intonation</span><input class="score-input ai-score" data-group="muend-sprach" type="number" min="0" max="8" placeholder="/8"></div>
    </div>

    <div style="text-align:center;margin:2rem 0;">
      <button class="btn primary" id="btn-calculate">Ergebnis berechnen</button>
    </div>
    <div id="certificate-area"></div>

    <hr style="border:none;border-top:2px solid var(--border-subtle,#2a2825);margin:3rem 0;">
    <h2 style="margin-bottom:1.5rem;">Antworten im Detail</h2>`;

    const sections = [
      { key:'lv1', title:'Leseverstehen Teil 1' },
      { key:'lv2', title:'Leseverstehen Teil 2' },
      { key:'lv3', title:'Leseverstehen Teil 3' },
      { key:'sb',  title:'Sprachbausteine' },
      { key:'hv1', title:'Hörverstehen Teil 1' },
      { key:'hv2', title:'Hörverstehen Teil 2' },
      { key:'hv3', title:'Hörverstehen Teil 3' },
    ];

    sections.forEach(sec => {
      const r = results[sec.key];
      let html = `<div class="results-section"><h3>${sec.title} — ${r.earned}/${r.max} Punkte</h3>`;
      r.items.forEach(item => {
        const cls = item.ok ? 'correct' : (item.partial ? 'partial' : 'incorrect');
        const rightTxt = item.ok ? '' : ` → ${item.correct}`;
        html += `<div class="review-item ${cls}"><span class="q-label">${item.q}</span><span class="q-user">${item.user}</span><span class="q-correct">${rightTxt}</span></div>`;
      });
      html += '</div>';
      container.innerHTML += html;
    });

    container.innerHTML += `
    <div style="text-align:center;margin:3rem 0 1rem;">
      <a href="../index.html" class="btn secondary" style="display:inline-block;">&larr; Alle Prüfungen</a>
    </div>`;

    // Calculate button
    setTimeout(() => {
      $('btn-calculate').addEventListener('click', () => {
        let saScore = 0, muendInhalt = 0, muendSprach = 0;
        document.querySelectorAll('.ai-score').forEach(inp => {
          const v = parseFloat(inp.value) || 0;
          const g = inp.dataset.group;
          if (g === 'sa') saScore += v;
          else if (g === 'muend-inhalt') muendInhalt += v;
          else if (g === 'muend-sprach') muendSprach += v;
        });

        const muendTotal = muendInhalt + muendSprach;
        const schriftlich = lvTotal + sbTotal + hvTotal + saScore;
        const muendlich = muendTotal;
        const grandTotal = schriftlich + muendlich;

        const schriftlichPass = schriftlich >= 99;
        const muendlichPass = muendlich >= 29;
        const totalPass = grandTotal >= 128;
        const passed = schriftlichPass && muendlichPass && totalPass;

        let grade, gradeClass;
        if (grandTotal >= 193) { grade = 'Sehr gut'; gradeClass = 'passed'; }
        else if (grandTotal >= 172) { grade = 'Gut'; gradeClass = 'passed'; }
        else if (grandTotal >= 151) { grade = 'Befriedigend'; gradeClass = 'passed'; }
        else if (grandTotal >= 128 && passed) { grade = 'Ausreichend'; gradeClass = 'passed'; }
        else { grade = 'Nicht bestanden'; gradeClass = 'failed'; }

        if (grandTotal >= 128 && !passed) { grade = 'Nicht bestanden'; gradeClass = 'failed'; }

        let failReasons = '';
        if (!totalPass) failReasons += `<li>Gesamtpunktzahl unter 128 (${grandTotal})</li>`;
        if (!schriftlichPass) failReasons += `<li>Schriftliche Prüfung unter 99 Punkte (${schriftlich}/166)</li>`;
        if (!muendlichPass) failReasons += `<li>Mündliche Prüfung unter 29 Punkte (${muendlich}/48)</li>`;

        $('certificate-area').innerHTML = `
        <div class="certificate">
          <h2>TELC Deutsch C1 Hochschule</h2>
          <p class="exam-title">${EXAM_DATA.title} – Ergebnis</p>
          <div class="grade ${gradeClass}">${grade}</div>
          <div class="total-score">${grandTotal} / 214 Punkte</div>
          <div style="text-align:left;margin:2rem auto;max-width:400px;">
            <div class="score-row"><span class="label">Schriftliche Prüfung</span><span class="value ${schriftlichPass ? 'correct' : 'incorrect'}">${schriftlich} / 166</span></div>
            <div class="score-row" style="padding-left:1.5rem;opacity:0.8;"><span class="label">Leseverstehen</span><span class="value">${lvTotal}/48</span></div>
            <div class="score-row" style="padding-left:1.5rem;opacity:0.8;"><span class="label">Sprachbausteine</span><span class="value">${sbTotal}/22</span></div>
            <div class="score-row" style="padding-left:1.5rem;opacity:0.8;"><span class="label">Hörverstehen</span><span class="value">${hvTotal}/48</span></div>
            <div class="score-row" style="padding-left:1.5rem;opacity:0.8;"><span class="label">Schriftlicher Ausdruck</span><span class="value">${saScore}/48</span></div>
            <div class="score-row"><span class="label">Mündliche Prüfung</span><span class="value ${muendlichPass ? 'correct' : 'incorrect'}">${muendlich} / 48</span></div>
            <div class="score-row" style="padding-left:1.5rem;opacity:0.8;"><span class="label">Inhalt</span><span class="value">${muendInhalt}/16</span></div>
            <div class="score-row" style="padding-left:1.5rem;opacity:0.8;"><span class="label">Sprache</span><span class="value">${muendSprach}/32</span></div>
          </div>
          ${passed
            ? '<p style="margin-top:1rem;color:#22c55e;">Herzlichen Glückwunsch! Sie haben die Prüfung bestanden.</p>'
            : `<div style="margin-top:1rem;color:var(--accent-red,#e63946);text-align:left;max-width:400px;margin-left:auto;margin-right:auto;">
                <p><strong>Nicht bestanden:</strong></p><ul style="margin:0.5rem 0 0 1.5rem;">${failReasons}</ul>
               </div>`}
          <p style="margin-top:2rem;opacity:0.5;font-size:0.8rem;">
            Notenstufen: sehr gut (193–214) · gut (172–192) · befriedigend (151–171) · ausreichend (128–150)<br>
            Bestehen: ≥128 gesamt, ≥99 schriftlich (60%), ≥29 mündlich (60%)
          </p>
        </div>`;
        $('certificate-area').scrollIntoView({ behavior: 'smooth' });
      });
    }, 0);
  }

  /* ── HV Transcript copy ─────────────────────────────── */
  function initHVTranskript() {
    const transkript = EXAM_DATA.hvTranskript;
    if (!transkript || transkript.startsWith('/*')) return;

    const screen = $('screen-hv-ready');
    const btnGroup = screen.querySelector('.btn-group');
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn secondary';
    copyBtn.id = 'btn-copy-hv-transkript';
    copyBtn.textContent = 'Transkript kopieren';
    btnGroup.appendChild(copyBtn);

    const feedback = document.createElement('p');
    feedback.className = 'copy-feedback';
    feedback.textContent = '✓ Transkript kopiert!';
    btnGroup.after(feedback);

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(transkript).then(() => {
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 2500);
      });
    });
  }

  /* ── Init ─────────────────────────────────────────── */
  function init() {
    $('btn-start').addEventListener('click', () => enterPhase(1));
    skipBtn().addEventListener('click', () => nextPhase());

    $('btn-end-exam').addEventListener('click', () => {
      if (confirm('Möchten Sie die gesamte Prüfung jetzt beenden und zu den Ergebnissen gehen?')) {
        stopTimer();
        enterPhase(PHASES.length - 1);
      }
    });

    $('btn-skip-break').addEventListener('click', () => nextPhase());
    $('btn-start-hv').addEventListener('click', () => nextPhase());
    $('btn-start-muendlich').addEventListener('click', () => nextPhase());
    $('btn-start-zusammenfassung').addEventListener('click', () => nextPhase());
    $('btn-start-diskussion').addEventListener('click', () => nextPhase());

    initSA();
    initMuendlich();
    initHVTranskript();
    enterPhase(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { answers, CORRECT };
})();
