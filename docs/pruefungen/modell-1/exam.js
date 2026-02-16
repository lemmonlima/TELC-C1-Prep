/* ═══════════════════════════════════════════════════════
   Exam runner engine — Modellprüfung Simulator
   State machine, timers, section loading, evaluation.
   ═══════════════════════════════════════════════════════ */
'use strict';

const Exam = (() => {

  /* ── Correct answers ─────────────────────────────── */
  const CORRECT = {
    lv1: { 1:'g', 2:'e', 3:'a', 4:'b', 5:'h', 6:'d' },
    lv2: { 7:'a', 8:'d', 9:'c', 10:'a', 11:'d', 12:'e' },
    lv3: { 13:'−', 14:'×', 15:'+', 16:'×', 17:'−', 18:'×', 19:'−', 20:'+', 21:'−', 22:'×', 23:'−', 24:'b' },
    sb:  { 25:'a',26:'d',27:'a',28:'b',29:'d',30:'d',31:'a',32:'b',33:'a',34:'a',35:'c',36:'c',37:'b',38:'c',39:'d',40:'c',41:'c',42:'c',43:'d',44:'d',45:'a',46:'c',47:'a' },
    hv1: { 47:'g',48:'f',49:'c',50:'i',51:'b',52:'d',53:'h',54:'j' },
    hv2: { 55:'a',56:'a',57:'a',58:'c',59:'b',60:'a',61:'a',62:'a',63:'b',64:'c' },
    hv3: {
      65:['jeder vierte','4.','vierte','keine bücher','liest keine','liest nicht'],
      66:['bücher werden','weiter','weiterhin','noch','immer noch','gelesen'],
      '67a':['verfassen','schreiben','eigener','texte'],
      '67b':['kreative verarbeitung','verarbeitung','kreative','methoden'],
      '68a':['lieder','songs','musik'],
      '68b':['theater','stücke','theaterstücke','interviews','hörspiele'],
      69:['alltagskommunikation','interpretation','literatur'],
      '70a':['kreatives schreiben','neue lust','lesen','nicht mehr mittelpunkt'],
      '70b':['kreatives schreiben','neue lust','lesen','mittelpunkt'],
      '71a':['liebe','erste liebe','freundschaft','familie'],
      '71b':['freundschaft','familie','liebe'],
      72:['neues ende','ende','brief','hauptfigur'],
      73:['doppelsinnig','lustig','witzig'],
      74:['autonomie','leser','selbst entscheiden']
    }
  };

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

  function showScreen(id) {
    hideAll();
    $(id).classList.add('active');
  }

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

    if (phase.type === 'ready') {
      showScreen(phase.screen);
      return;
    }

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

      // Load sections via fetch if they have URLs
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

  function nextPhase() {
    stopTimer();
    enterPhase(phaseIdx + 1);
  }

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

      // Remove elements not needed in exam mode
      main.querySelectorAll('.ergebnisse, .submit-section, h1, .lead').forEach(el => el.remove());

      panel.innerHTML = main.innerHTML;
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
        store[key] = btn.dataset.answer; // +, −, ×, or a/b/c
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

    // Theme selection
    saPanel.querySelectorAll('.thema-box').forEach(box => {
      box.addEventListener('click', () => {
        saPanel.querySelectorAll('.thema-box').forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
        answers.sa.thema = box.dataset.thema;
        $('sa-editor').classList.add('show');
        $('sa-thema-title').textContent = box.dataset.thema === 'literatur' ? 'Thema 1: Literatur' : 'Thema 2: Gruppenarbeit';
        updateWordCount();
      });
    });

    // Word count
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

    // Copy for AI evaluation
    $('sa-copy-btn').addEventListener('click', () => {
      if (!answers.sa.thema) { alert('Bitte wählen Sie zuerst ein Thema.'); return; }
      if (!answers.sa.text.trim()) { alert('Bitte schreiben Sie zuerst Ihren Text.'); return; }
      const thema = answers.sa.thema === 'literatur'
        ? 'Thema 1: Literatur\nZitate:\n- "Literatur hat nie etwas Negatives verhindern können."\n- "Literatur bietet mehr Orientierung als alles andere."'
        : 'Thema 2: Gruppenarbeit\nZitate:\n- "Gruppenarbeit kostet doch nur Zeit, weil man alles ausdiskutieren muss."\n- "Teamarbeit bietet dem Einzelnen viel mehr Möglichkeiten."';

      const text = `# TELC C1 Hochschule – Schriftlicher Ausdruck\n\n## THEMA\n${thema}\n\n## MEIN TEXT\n\n${answers.sa.text.trim()}\n\n## BEWERTUNGSKRITERIEN (A=12, B=8, C=4, D=0)\n1. Aufgabengerechtheit (max 12)\n2. Korrektheit (max 12)\n3. Repertoire (max 12)\n4. Kommunikative Gestaltung (max 12)\n\nMaximal: 48 Punkte\n\nBitte bewerten Sie nach jedem Kriterium (A/B/C/D) und geben Sie am Ende:\n\n| Kriterium | Note | Punkte |\n|---|---|---|\n| 1. Aufgabengerechtheit | _/A | _/12 |\n| 2. Korrektheit | _/A | _/12 |\n| 3. Repertoire | _/A | _/12 |\n| 4. Kommunikative Gestaltung | _/A | _/12 |\n| **GESAMT** | | _/48 |`;
      copyText(text, 'sa-copy-msg');
    });
  }

  /* ── Mündlich section handlers ────────────────────── */
  function initMuendlich() {
    // Vorbereitung: topic selection
    const vorPanel = $('tab-vorbereitung');
    vorPanel.querySelectorAll('.thema-box[data-topic]').forEach(box => {
      box.addEventListener('click', () => {
        vorPanel.querySelectorAll('.thema-box[data-topic]').forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
        answers.muendlich.topic = box.dataset.topic;
      });
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

  const DISKUSSION_ZITATE = {
    1: { text:'Die beste Bildung findet ein kluger Mensch auf Reisen.', autor:'Goethe',
         aspekte:['Was bedeutet „Bildung durch Reisen"?','Welche Erfahrungen haben Sie?','Kann man ohne Reisen gebildet werden?','Rolle von Büchern, Internet?'] },
    2: { text:'Am Mut hängt der Erfolg.', autor:'Fontane',
         aspekte:['Ist Mut die wichtigste Voraussetzung?','Rolle anderer Faktoren?','Beispiele aus Erfahrung?','Kann zu viel Mut schaden?'] },
    3: { text:'Auf Kinder wirkt das Vorbild, nicht die Kritik.', autor:'Thiersch',
         aspekte:['Warum Vorbilder wichtiger als Worte?','Rolle konstruktiver Kritik?','Eigene Vorbilder?','Was macht ein gutes Vorbild aus?'] },
    4: { text:'Ohne Leiden bildet sich kein Charakter.', autor:'Feuchtersleben',
         aspekte:['Muss man leiden um zu wachsen?','Positive Erfahrungen?','Beispiele aus Geschichte?','Ist Leiden notwendig?'] },
  };

  /* ── Copy helper ─────────────────────────────────── */
  function copyText(text, msgId) {
    navigator.clipboard.writeText(text).then(() => {
      const msg = $(msgId);
      if (msg) { msg.classList.add('show'); setTimeout(() => msg.classList.remove('show'), 4000); }
    }).catch(err => alert('Fehler beim Kopieren: ' + err));
  }

  /* ── Evaluation ──────────────────────────────────── */
  function evaluateAutoScored() {
    const results = {};

    // LV1: 6 questions, 2 pts each = 12
    results.lv1 = { items: [], max: 12 };
    for (let i = 1; i <= 6; i++) {
      const u = answers.lv1[i] || '—';
      const c = CORRECT.lv1[i];
      const ok = u === c;
      results.lv1.items.push({ q: `Lücke ${i}`, user: u, correct: c, ok });
    }
    results.lv1.earned = results.lv1.items.filter(r => r.ok).length * 2;

    // LV2: 6 questions, 2 pts each = 12
    results.lv2 = { items: [], max: 12 };
    for (let i = 7; i <= 12; i++) {
      const u = answers.lv2[i] || '—';
      const c = CORRECT.lv2[i];
      results.lv2.items.push({ q: `Frage ${i}`, user: u, correct: c, ok: u === c });
    }
    results.lv2.earned = results.lv2.items.filter(r => r.ok).length * 2;

    // LV3: 12 questions (13-23 + 24), 2 pts each = 24
    results.lv3 = { items: [], max: 24 };
    for (let i = 13; i <= 23; i++) {
      const u = answers.lv3[i] || '—';
      const c = CORRECT.lv3[i];
      results.lv3.items.push({ q: `Aussage ${i}`, user: u, correct: c, ok: u === c });
    }
    const u24 = answers.lv3[24] || '—';
    results.lv3.items.push({ q: 'Aufgabe 24', user: u24, correct: 'b', ok: u24 === 'b' });
    results.lv3.earned = results.lv3.items.filter(r => r.ok).length * 2;

    // SB: 23 questions, 1 pt each = 23 (but in real exam worth 48 Prüfungspunkte proportional)
    results.sb = { items: [], max: 48 };
    let sbCorrect = 0;
    for (let i = 25; i <= 47; i++) {
      const u = answers.sb[i] || '—';
      const c = CORRECT.sb[i];
      const ok = u === c;
      if (ok) sbCorrect++;
      results.sb.items.push({ q: `Lücke ${i}`, user: u, correct: c, ok });
    }
    results.sb.earned = Math.round(sbCorrect / 23 * 48);

    // HV1: 8 questions, 2 pts each = 16
    results.hv1 = { items: [], max: 16 };
    for (let i = 47; i <= 54; i++) {
      const u = answers.hv1[i] || '—';
      const c = CORRECT.hv1[i];
      results.hv1.items.push({ q: `Sprecher ${i-46}`, user: u, correct: c, ok: u === c });
    }
    results.hv1.earned = results.hv1.items.filter(r => r.ok).length * 2;

    // HV2: 10 questions, 2 pts each = 20
    results.hv2 = { items: [], max: 20 };
    for (let i = 55; i <= 64; i++) {
      const u = answers.hv2[i] || '—';
      const c = CORRECT.hv2[i];
      results.hv2.items.push({ q: `Frage ${i}`, user: u, correct: c, ok: u === c });
    }
    results.hv2.earned = results.hv2.items.filter(r => r.ok).length * 2;

    // HV3: flexible matching, 14 sub-questions, 20 pts total
    results.hv3 = { items: [], max: 20 };
    let hv3pts = 0;
    const hv3keys = [65,66,'67a','67b','68a','68b',69,'70a','70b','71a','71b',72,73,74];
    const hv3labels = {65:'65',66:'66','67a':'67a','67b':'67b','68a':'68a','68b':'68b',69:'69','70a':'70a','70b':'70b','71a':'71a','71b':'71b',72:'72',73:'73',74:'74'};
    hv3keys.forEach(key => {
      const u = answers.hv3[key] || '';
      const possible = CORRECT.hv3[key] || [];
      let pts = 0;
      if (u) {
        const ul = u.toLowerCase();
        for (const correct of possible) {
          if (ul.includes(correct) || correct.includes(ul)) { pts = 2; break; }
        }
        if (pts === 0) {
          const kw = possible.join(' ').split(' ');
          for (const w of ul.split(' ')) {
            if (w.length > 3 && kw.some(k => k.includes(w) || w.includes(k))) { pts = 1; break; }
          }
        }
      }
      hv3pts += pts;
      results.hv3.items.push({ q: `Frage ${hv3labels[key]}`, user: u || '—', correct: possible.slice(0,2).join(', '), ok: pts === 2, partial: pts === 1 });
    });
    results.hv3.earned = hv3pts;

    return results;
  }

  /* ── Results screen ──────────────────────────────── */
  function showResults() {
    hideAll();
    $('screen-results').classList.add('active');

    const results = evaluateAutoScored();
    const container = $('results-content');
    container.innerHTML = '';

    // Auto-scored sections
    const autoSections = [
      { key:'lv1', title:'Leseverstehen Teil 1' },
      { key:'lv2', title:'Leseverstehen Teil 2' },
      { key:'lv3', title:'Leseverstehen Teil 3' },
      { key:'sb',  title:'Sprachbausteine' },
      { key:'hv1', title:'Hörverstehen Teil 1' },
      { key:'hv2', title:'Hörverstehen Teil 2' },
      { key:'hv3', title:'Hörverstehen Teil 3' },
    ];

    let totalAuto = 0, maxAuto = 0;

    autoSections.forEach(sec => {
      const r = results[sec.key];
      totalAuto += r.earned;
      maxAuto += r.max;

      let html = `<div class="results-section"><h3>${sec.title} — ${r.earned}/${r.max} Punkte</h3>`;
      r.items.forEach(item => {
        const cls = item.ok ? 'correct' : (item.partial ? 'partial' : 'incorrect');
        const rightTxt = item.ok ? '' : ` → ${item.correct}`;
        html += `<div class="review-item ${cls}"><span class="q-label">${item.q}</span><span class="q-user">${item.user}</span><span class="q-correct">${rightTxt}</span></div>`;
      });
      html += '</div>';
      container.innerHTML += html;
    });

    // Auto total
    container.innerHTML += `<div class="results-section"><h3>Automatisch bewertet: ${totalAuto} / ${maxAuto} Punkte</h3></div>`;

    // AI-scored inputs
    container.innerHTML += `
    <div class="results-section">
      <h3>KI-bewertete Teile</h3>
      <p style="margin-bottom:1rem;opacity:0.7;">Geben Sie die Punkte ein, die Ihnen die KI gegeben hat.</p>

      <h4 style="color:var(--accent-ink);margin:1.5rem 0 0.75rem;">Schriftlicher Ausdruck (max. 48)</h4>
      <div class="score-row"><span class="label">Aufgabengerechtheit</span><input class="score-input ai-score" data-part="sa" data-crit="1" type="number" min="0" max="12" placeholder="/12"></div>
      <div class="score-row"><span class="label">Korrektheit</span><input class="score-input ai-score" data-part="sa" data-crit="2" type="number" min="0" max="12" placeholder="/12"></div>
      <div class="score-row"><span class="label">Repertoire</span><input class="score-input ai-score" data-part="sa" data-crit="3" type="number" min="0" max="12" placeholder="/12"></div>
      <div class="score-row"><span class="label">Kommunikative Gestaltung</span><input class="score-input ai-score" data-part="sa" data-crit="4" type="number" min="0" max="12" placeholder="/12"></div>

      <h4 style="color:var(--accent-ink);margin:1.5rem 0 0.75rem;">Mündlich – Präsentation (max. 6)</h4>
      <div class="score-row"><span class="label">Aufgabengerechtheit 1A</span><input class="score-input ai-score" data-part="pres" data-crit="1" type="number" min="0" max="6" placeholder="/6"></div>

      <h4 style="color:var(--accent-ink);margin:1.5rem 0 0.75rem;">Mündlich – Zusammenfassung (max. 4)</h4>
      <div class="score-row"><span class="label">Aufgabengerechtheit 1B</span><input class="score-input ai-score" data-part="zus" data-crit="1" type="number" min="0" max="4" placeholder="/4"></div>

      <h4 style="color:var(--accent-ink);margin:1.5rem 0 0.75rem;">Mündlich – Diskussion (max. 6)</h4>
      <div class="score-row"><span class="label">Aufgabengerechtheit Teil 2</span><input class="score-input ai-score" data-part="disk" data-crit="1" type="number" min="0" max="6" placeholder="/6"></div>

      <h4 style="color:var(--accent-ink);margin:1.5rem 0 0.75rem;">Mündlich – Sprachliche Angemessenheit (max. 32)</h4>
      <div class="score-row"><span class="label">Flüssigkeit</span><input class="score-input ai-score" data-part="sprach" data-crit="1" type="number" min="0" max="8" placeholder="/8"></div>
      <div class="score-row"><span class="label">Repertoire</span><input class="score-input ai-score" data-part="sprach" data-crit="2" type="number" min="0" max="8" placeholder="/8"></div>
      <div class="score-row"><span class="label">Grammatische Richtigkeit</span><input class="score-input ai-score" data-part="sprach" data-crit="3" type="number" min="0" max="8" placeholder="/8"></div>
      <div class="score-row"><span class="label">Aussprache und Intonation</span><input class="score-input ai-score" data-part="sprach" data-crit="4" type="number" min="0" max="8" placeholder="/8"></div>
    </div>

    <div style="text-align:center;margin:2rem 0;">
      <button class="btn primary" id="btn-calculate">Ergebnis berechnen</button>
    </div>
    <div id="certificate-area"></div>`;

    // Calculate button
    setTimeout(() => {
      $('btn-calculate').addEventListener('click', () => {
        let aiTotal = 0;
        document.querySelectorAll('.ai-score').forEach(inp => {
          aiTotal += parseInt(inp.value) || 0;
        });
        const grandTotal = totalAuto + aiTotal;
        const maxTotal = maxAuto + 48 + 6 + 4 + 6 + 32; // SA(48) + Pres(6) + Zus(4) + Disk(6) + Sprach(32)
        const pct = Math.round(grandTotal / maxTotal * 100);

        // Determine pass/fail (60% threshold as placeholder)
        const passed = pct >= 60;
        const grade = pct >= 90 ? 'Sehr gut' : pct >= 75 ? 'Gut' : pct >= 60 ? 'Befriedigend' : pct >= 50 ? 'Ausreichend' : 'Nicht bestanden';

        $('certificate-area').innerHTML = `
        <div class="certificate">
          <h2>TELC Deutsch C1 Hochschule</h2>
          <p class="exam-title">Modellprüfung 1 – Ergebnis</p>
          <div class="total-score">${grandTotal} / ${maxTotal} Punkte (${pct}%)</div>
          <div class="grade ${passed ? 'passed' : 'failed'}">${grade}</div>
          <p style="margin-top:1rem;">${passed ? 'Herzlichen Glückwunsch! Sie haben bestanden.' : 'Leider nicht bestanden. Weiter üben!'}</p>
          <p style="margin-top:1.5rem;opacity:0.7;font-size:0.85rem;">Automatisch bewertet: ${totalAuto}/${maxAuto} | KI-bewertet: ${aiTotal}/${maxTotal - maxAuto}</p>
        </div>`;
        $('certificate-area').scrollIntoView({ behavior: 'smooth' });
      });
    }, 0);
  }

  /* ── Init ─────────────────────────────────────────── */
  function init() {
    // Start button
    $('btn-start').addEventListener('click', () => enterPhase(1)); // → lesen

    // Skip/finish button
    skipBtn().addEventListener('click', () => nextPhase());

    // Break skip
    $('btn-skip-break').addEventListener('click', () => nextPhase());

    // Ready screen buttons
    $('btn-start-hv').addEventListener('click', () => nextPhase());
    $('btn-start-muendlich').addEventListener('click', () => nextPhase());
    $('btn-start-zusammenfassung').addEventListener('click', () => nextPhase());
    $('btn-start-diskussion').addEventListener('click', () => nextPhase());

    // Init embedded section handlers
    initSA();
    initMuendlich();

    // Start at start screen
    enterPhase(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { answers, CORRECT };
})();
