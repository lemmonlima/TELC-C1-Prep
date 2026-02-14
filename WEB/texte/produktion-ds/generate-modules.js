#!/usr/bin/env node
/**
 * Generates DS module pages (text style) for each lowest-level topic.
 * Run: node generate-modules.js
 */
const fs = require("fs");
const path = require("path");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const modules = [
  { ds: "01", parent: "Bildung und Hochschule", topics: ["Studiengebühren und Hochschulfinanzierung", "NC und Hochschulzugang", "Digitale Lehre und Online-Studium", "Prüfungsdruck und mentale Gesundheit", "Künstliche Intelligenz im Studium", "Internationalisierung der Hochschulen"] },
  { ds: "02", parent: "Gesellschaft und Zusammenleben", topics: ["Soziale Isolation in der modernen Gesellschaft", "Familie, Partnerschaft und neue Beziehungsformen", "Rollenbilder, Geschlecht und Identität", "Schönheitsideale und sozialer Druck", "Generationenkonflikte und Wertewandel"] },
  { ds: "03", parent: "Migration, Integration und Mehrsprachigkeit", topics: ["Integration im Hochschulkontext", "Sprachpolitik und Bildungschancen", "Anerkennung ausländischer Abschlüsse", "Diskriminierung und Chancengleichheit", "Fachkräftemigration"] },
  { ds: "04", parent: "Arbeitswelt und Wirtschaft", topics: ["Fachkräftemangel und Ausbildung", "Automatisierung und Arbeitsplatzsicherheit", "Homeoffice und Work-Life-Balance", "Praktika und Berufseinstieg", "Gig Economy und Prekarisierung"] },
  { ds: "05", parent: "Umwelt, Klima und Nachhaltigkeit", topics: ["Energiewende und erneuerbare Energien", "Abhängigkeit von fossilen Energieträgern", "Verkehrswende und Mobilität", "Nachhaltiger Konsum", "Klimagerechtigkeit"] },
  { ds: "06", parent: "Politik, Demokratie und Öffentlichkeit", topics: ["Politische Partizipation junger Menschen", "Populismus und Polarisierung", "Medien und Meinungsbildung", "Freiheit der Meinungsäußerung", "Religion und Politik"] },
  { ds: "07", parent: "Medien, Information und Wissenschaft", topics: ["Fake News und Desinformation", "Algorithmen und Filterblasen", "Wikipedia und Wissensvermittlung", "Wissenschaftskommunikation", "Datenschutz im digitalen Alltag"] },
  { ds: "08", parent: "Gesundheit und Psychologie", topics: ["Stress und Burnout bei Studierenden", "Schlafmangel und Leistungsfähigkeit", "Psychische Gesundheit und Prävention", "Legasthenie und Dyskalkulie", "Körperbild und Selbstwahrnehmung"] },
  { ds: "09", parent: "Technologie, KI und Ethik", topics: ["KI in Bildung und Alltag", "Digitale Überwachung", "Deepfakes und Vertrauen", "Technologischer Fortschritt und Verantwortung"] }
];

const ROOT = "../../../../";
const baseDir = __dirname;
const text07Dir = path.join(baseDir, "..", "text-07");

const mainJsTemplate = fs.readFileSync(path.join(text07Dir, "text-07.js"), "utf8");
const flashcardsJsTemplate = fs.readFileSync(path.join(text07Dir, "text-07-flashcards.js"), "utf8");

const ds01Html = fs.readFileSync(path.join(baseDir, "ds-01", "index.html"), "utf8");
const scriptMatches = ds01Html.match(/<script>([\s\S]*?)<\/script>/g);
const navScript = scriptMatches[0].replace(/<\/?script>/g, "");
const topbarScript = scriptMatches[1].replace(/<\/?script>/g, "");

function mainHtml(opts) {
  const { title, parentTitle, dsNum, slug, root } = opts;
  return `<!doctype html>
<html lang="de">
<head>
  <style>html,body{background:#12110f}</style>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>DS ${dsNum} – ${title}</title>
  <link rel="stylesheet" href="${root}styles.css" />
  <script>${navScript}</script>
  <script>${topbarScript}</script>
</head>
<body class="no-js doc-page">
  <header class="topbar">
    <div class="brand">
      <span class="brand-mark">TELC</span>
      <span class="brand-name">Texte</span>
    </div>
    <nav class="nav">
      <a href="${root}index.html#start">Start</a>
      <a href="${root}grammatik/index.html">Grammatik</a>
      <a href="${root}index.html">Texte</a>
      <a href="${root}notizen/index.html">Notizen</a>
      <a href="${root}woerter/index.html">Wörter</a>
      <a href="${root}tips/index.html">Tips</a>
    </nav>
    <a class="cta" href="${root}tips/einfuehrung/index.html">Einstufung</a>
  </header>

  <main class="doc-main">
    <section class="doc-hero">
      <div class="doc-hero-text reveal">
        <div class="eyebrow">Modul DS ${dsNum} – ${parentTitle}</div>
        <h1>${title}</h1>
        <p class="lead">Argumentativer Text im telc-Format (Einleitung – Argumentation – Abwägung – Schluss).</p>
      </div>
    </section>

    <section class="doc-section">
      <div class="text-flashcards-bar">
        <button id="text-flashcards" class="text-flashcards-btn" type="button">Flashcards</button>
      </div>
      <div class="word-types-legend">
        <h3>Wortarten – Farben</h3>
        <div class="word-types-grid">
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-verb">Verb</span></div>
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-nomen">Nomen</span></div>
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-adj">Adjektiv</span></div>
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-artikel">Artikel</span></div>
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-pronomen">Pronomen</span></div>
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-adverb">Adverb</span></div>
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-praeposition">Präposition</span></div>
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-konjunktion">Konjunktion</span></div>
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-subjunktion">Subjunktion</span></div>
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-partikel">Partikel</span></div>
          <div class="word-type-item"><span class="word-type-example explanation-word explanation-word-default">Phrase</span></div>
        </div>
      </div>
      <div class="doc doc-relaxed" id="text-content">
        <p id="word-count" style="font-size:0.9rem; color:#c7c0b6; margin-bottom:12px;"></p>
      </div>

      <div id="explanation-panel" class="explanation-panel" style="display: none;">
        <div class="explanation-panel-header">
          <h3 id="explanation-word"></h3>
          <div class="explanation-panel-actions">
            <button id="explanation-back-to-parent" class="explanation-back explanation-back-to-parent" type="button" style="display: none;" aria-label="Volver a la cajita de la frase original">← Volver a la Frase</button>
            <button id="explanation-back" class="explanation-back" type="button">↑ Volver al texto</button>
            <button id="explanation-close" class="explanation-close" aria-label="Cerrar">&times;</button>
          </div>
        </div>
        <div class="explanation-panel-content">
          <div class="explanation-sentence">
            <p class="explanation-label">Oración completa:</p>
            <p id="explanation-sentence-de" class="explanation-text-de"></p>
            <p id="explanation-sentence-es" class="explanation-text-es"></p>
          </div>
          <div class="explanation-translation">
            <p class="explanation-label">Traducción:</p>
            <p id="explanation-translation"></p>
          </div>
          <div id="explanation-details"></div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <a href="../index.html">← Modul DS ${dsNum}</a>
  </footer>

  <script defer src="${slug}.js"></script>
  <script>
    (function () {
      const container = document.getElementById("text-content");
      const counterEl = document.getElementById("word-count");
      if (!container || !counterEl) return;
      const text = container.textContent || "";
      const words = text.trim().split(/\\s+/).filter(Boolean);
      counterEl.textContent = words.length + " Wörter";
    })();
  </script>
  <script>
    (() => {
      document.documentElement.classList.add("no-flash");
      const storageKey = "telc-scroll:" + location.pathname + location.search;
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      const save = () => { sessionStorage.setItem(storageKey, String(window.scrollY || window.pageYOffset || 0)); };
      const restore = () => { const saved = sessionStorage.getItem(storageKey); if (saved == null) return; const y = Number(saved); if (!Number.isNaN(y)) window.scrollTo(0, y); };
      const scheduleRestore = () => { restore(); requestAnimationFrame(restore); setTimeout(restore, 60); setTimeout(restore, 220); };
      window.addEventListener("pagehide", save);
      window.addEventListener("beforeunload", save);
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") save(); });
      document.addEventListener("click", (e) => { const link = e.target.closest("a"); if (!link || !link.href) return; try { const u = new URL(link.href, location.href); if (u.origin === location.origin) save(); } catch (_) {} });
      window.addEventListener("pageshow", scheduleRestore);
      window.addEventListener("load", scheduleRestore);
    })();
  </script>
</body>
</html>
`;
}

function flashcardsHtml(opts) {
  const { title, parentTitle, dsNum, slug, root } = opts;
  return `<!doctype html>
<html lang="de">
<head>
  <style>html,body{background:#12110f}</style>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>DS ${dsNum} – ${title} – Flashcards</title>
  <link rel="stylesheet" href="${root}styles.css" />
  <script>${navScript}</script>
  <script>${topbarScript}</script>
</head>
<body class="no-js doc-page">
  <header class="topbar">
    <div class="brand">
      <span class="brand-mark">TELC</span>
      <span class="brand-name">Texte</span>
    </div>
    <nav class="nav">
      <a href="${root}index.html#start">Start</a>
      <a href="${root}grammatik/index.html">Grammatik</a>
      <a href="${root}index.html">Texte</a>
      <a href="${root}notizen/index.html">Notizen</a>
      <a href="${root}woerter/index.html">Wörter</a>
      <a href="${root}tips/index.html">Tips</a>
      <a href="index.html">${title}</a>
    </nav>
    <a class="cta" href="${root}tips/einfuehrung/index.html">Einstufung</a>
  </header>

  <main class="doc-main">
    <section class="doc-hero">
      <div class="doc-hero-text reveal">
        <div class="eyebrow">Modul DS ${dsNum} – Flashcards</div>
        <h1>${title}</h1>
        <p class="lead">Trainiere Wortschatz mit Karten (sobald Wörter markiert sind).</p>
      </div>
    </section>

    <section id="flashcards" class="section">
      <div class="section-head reveal">
        <h2>Flashcards</h2>
        <p>Alle markierten Wörter des Textes als Karten. Derzeit sind noch keine Wörter markiert.</p>
      </div>

      <div class="flashcards-panel reveal">
        <div class="flashcards-stage" id="flash-stage" data-empty="true">
          <div class="flashcards-empty" id="flash-empty">Cargando palabras del texto…</div>
          <div class="flashcard" id="flashcard" tabindex="0" role="button" aria-label="Karte aufdecken">
            <div class="flashcard-inner">
              <div class="flashcard-face flashcard-front">
                <div class="flashcard-label" id="flashcard-label">Wort</div>
                <div class="flashcard-term" id="flashcard-term">—</div>
                <div class="flashcard-prompt">Übersetzung &amp; Beispiel?</div>
              </div>
              <div class="flashcard-face flashcard-back">
                <div class="flashcard-label">Antwort</div>
                <div class="flashcard-answer" id="flashcard-answer">—</div>
                <div class="flashcard-example" id="flashcard-example">—</div>
              </div>
            </div>
          </div>
          <div class="flashcards-progress">
            <div class="flashcards-progress-bar" id="flash-progress-bar"></div>
          </div>
          <div class="flashcards-meta">
            <span id="flash-progress-text">0 / 0</span>
          </div>
          <div class="flashcards-controls">
            <button class="btn ghost" id="flash-prev" type="button">Zurück</button>
            <button class="btn ghost" id="flash-flip" type="button">Aufdecken</button>
            <button class="btn ghost" id="flash-next" type="button">Weiter</button>
            <button class="btn ghost" id="flash-exit" type="button">Neu mischen</button>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <a href="../index.html">← Modul DS ${dsNum}</a>
  </footer>

  <script defer src="${slug}-flashcards.js"></script>
  <script>
    (() => {
      document.documentElement.classList.add("no-flash");
      const storageKey = "telc-scroll:" + location.pathname + location.search;
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      const save = () => { sessionStorage.setItem(storageKey, String(window.scrollY || window.pageYOffset || 0)); };
      const restore = () => { const saved = sessionStorage.getItem(storageKey); if (saved == null) return; const y = Number(saved); if (!Number.isNaN(y)) window.scrollTo(0, y); };
      const scheduleRestore = () => { restore(); requestAnimationFrame(restore); setTimeout(restore, 60); setTimeout(restore, 220); };
      window.addEventListener("pagehide", save);
      window.addEventListener("beforeunload", save);
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") save(); });
      document.addEventListener("click", (e) => { const link = e.target.closest("a"); if (!link || !link.href) return; try { const u = new URL(link.href, location.href); if (u.origin === location.origin) save(); } catch (_) {} });
      window.addEventListener("pageshow", scheduleRestore);
      window.addEventListener("load", scheduleRestore);
    })();
  </script>
</body>
</html>
`;
}

const allLinks = [];

for (const m of modules) {
  const dsDir = path.join(baseDir, `ds-${m.ds}`);
  for (const topic of m.topics) {
    const slug = slugify(topic);
    const topicDir = path.join(dsDir, slug);
    fs.mkdirSync(topicDir, { recursive: true });

    const opts = { title: topic, parentTitle: m.parent, dsNum: m.ds, slug, root: ROOT };

    fs.writeFileSync(path.join(topicDir, "index.html"), mainHtml(opts));
    fs.writeFileSync(path.join(topicDir, `${slug}-flashcards.html`), flashcardsHtml(opts));

    const mainJs = mainJsTemplate.replace(/text-07/g, slug);
    fs.writeFileSync(path.join(topicDir, `${slug}.js`), mainJs);

    const flashcardsJs = flashcardsJsTemplate.replace(/text-07/g, slug).replace(/Text 7/g, "Text");
    fs.writeFileSync(path.join(topicDir, `${slug}-flashcards.js`), flashcardsJs);

    fs.writeFileSync(path.join(topicDir, `${slug}-explanations.json`), "{}");

    allLinks.push({ ds: m.ds, topic, slug, href: `produktion-ds/ds-${m.ds}/${slug}/index.html` });
  }
}

fs.writeFileSync(path.join(baseDir, "ds-module-links.json"), JSON.stringify(allLinks, null, 2));
console.log(`Generated ${allLinks.length} module pages.`);
