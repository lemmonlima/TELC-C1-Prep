const fallbackData = {
  program: {
    title: "TELC Deutschprogramm C1 Hochschule",
    tagline: "Prüfungsnah. Klar. Hochschulfähig.",
    description: "Basis für ein TELC-inspiriertes Lernprogramm mit Fokus auf C1 Hochschule."
  },
  stats: [
    { label: "Wochen", value: "12", note: "intensive C1-Phase" },
    { label: "Teilbereiche", value: "5", note: "Lese, Sprachbausteine, Hören, Schreiben, Sprechen" },
    { label: "Übungstests", value: "2", note: "Format & Timing" }
  ],
  levels: [
    { id: "B2", name: "B2 Brücke", weeks: 4, focus: "Struktur & Argumentation" },
    { id: "C1", name: "C1 Hochschule", weeks: 8, focus: "Akademische Sprache" }
  ],
  modules: [
    {
      id: "leseverstehen",
      title: "Leseverstehen",
      badge: "Lesen",
      duration: "70'",
      intensity: "3 Aufgaben",
      goals: ["Global + Detail", "Textrekonstruktion", "Selektives Verstehen"],
      accent: "ink",
      url: "tips/leseverstehen/index.html"
    },
    {
      id: "sprachbausteine",
      title: "Sprachbausteine",
      badge: "Lücken",
      duration: "20'",
      intensity: "22 Lücken",
      goals: ["Grammatik", "Lexik", "Rechtschreibung"],
      accent: "ink",
      url: "tips/sprachbausteine/index.html"
    },
    {
      id: "hoeren",
      title: "Hörverstehen",
      badge: "Audio",
      duration: "40'",
      intensity: "3 Teile",
      goals: ["Global + Detail", "Interview MC", "Transfer"],
      accent: "red",
      url: "tips/hoerverstehen/index.html"
    },
    {
      id: "schreiben",
      title: "Schriftlicher Ausdruck",
      badge: "Essay",
      duration: "70'",
      intensity: "350+ Wörter",
      goals: ["2 Zitate Pflicht", "Meinung + Beispiele", "Klare Schlussfolgerung"],
      accent: "ink",
      url: "tips/schriftlicher-ausdruck/index.html"
    },
    {
      id: "sprechen",
      title: "Mündlicher Ausdruck",
      badge: "Oral",
      duration: "20' prep",
      intensity: "9' total",
      goals: ["Kurze Präsentation", "Zusammenfassung Partner", "Diskussion"],
      accent: "red",
      url: "tips/muendlicher-ausdruck/index.html"
    }
  ],
  milestones: [
    { week: "Woche 0", title: "Einstufung", detail: "Diagnose & Zielsetzung" },
    { week: "Woche 3", title: "Schriftlicher Ausdruck", detail: "Textaufbau & Stil" },
    { week: "Woche 6", title: "Mündlicher Ausdruck", detail: "Präsentation & Diskussion" },
    { week: "Woche 8", title: "Übungstest 1", detail: "telc C1 Hochschule" },
    { week: "Woche 12", title: "Prüfungssimulation", detail: "Format & Timing" }
  ],
  sessions: [
    { week: "Woche 1", topic: "Übungsgrammatik C1", output: "Fehleranalyse", skills: ["Schreiben", "Grammatik"] },
    { week: "Woche 2", topic: "Textsorten-Training", output: "Kurzaufsatz", skills: ["Schreiben"] },
    { week: "Woche 4", topic: "Hörstrategien", output: "Notizen", skills: ["Hören"] },
    { week: "Woche 5", topic: "Argumentieren", output: "Pro/Contra", skills: ["Sprechen", "Schreiben"] },
    { week: "Woche 7", topic: "Präsentation", output: "Mündlicher Vortrag", skills: ["Sprechen"] },
    { week: "Woche 9", topic: "Lesen auf C1", output: "Thesenliste", skills: ["Lesen"] }
  ],
  exams: [
    {
      title: "Übungstest 1",
      level: "C1 Hochschule",
      duration: "ca. 210 min",
      parts: ["Leseverstehen", "Hörverstehen", "Schriftlicher Ausdruck", "Mündlicher Ausdruck"],
      goal: "Originales Format"
    },
    {
      title: "Prüfungstraining",
      level: "C1 Hochschule",
      duration: "Simulation",
      parts: ["Zeitmanagement", "Aufgabentypen", "Feedback"],
      goal: "Sicherheit"
    }
  ],
  resources: [
    { type: "PDF", title: "Mündlicher Ausdruck", meta: "TELC-Unterlage" },
    { type: "PDF", title: "Schriftlicher Ausdruck", meta: "TELC-Unterlage" },
    { type: "PDF", title: "Übungsgrammatik C1", meta: "Mittelstufe" },
    { type: "PDF", title: "Prüfungstraining telc C1 Hochschule", meta: "Testbuch" },
    { type: "PDF", title: "Mit Erfolg zu telc C1 Hochschule", meta: "Testbuch" }
  ],
  cta: {
    primary: "Einstufung starten",
    secondary: "Übungstest herunterladen",
    note: "Einführung zur Prüfung: Überblick von Michaela Fröhlich. Schritt für Schritt."
  }
};

async function loadData() {
  try {
    const response = await fetch("data.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load data.json");
    }
    return await response.json();
  } catch (err) {
    return fallbackData;
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

function renderLevels(levels) {
  const container = document.getElementById("level-chips");
  if (!container) return;
  container.innerHTML = "";

  levels.forEach((level, index) => {
    const chip = document.createElement("span");
    chip.className = "chip reveal";
    chip.style.setProperty("--delay", `${80 + index * 60}ms`);
    chip.textContent = `${level.id} - ${level.name}`;
    container.appendChild(chip);
  });
}

function renderStats(stats) {
  const container = document.getElementById("stats-grid");
  if (!container) return;
  container.innerHTML = "";

  stats.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "stat reveal";
    card.style.setProperty("--delay", `${120 + index * 80}ms`);

    const value = document.createElement("strong");
    value.textContent = item.value;

    const label = document.createElement("span");
    label.textContent = item.label;

    const note = document.createElement("span");
    note.textContent = item.note;
    note.style.display = "block";
    note.style.color = "#2c2c2c";
    note.style.fontSize = "0.85rem";

    card.appendChild(value);
    card.appendChild(label);
    card.appendChild(note);
    container.appendChild(card);
  });
}

function renderModules(modules) {
  const container = document.getElementById("modules-grid");
  if (!container) return;
  container.innerHTML = "";

  const tipsIcons = { lesen: "📖", hoeren: "🎧", schreiben: "✍️", sprechen: "🗣️" };

  modules.forEach((module, index) => {
    const card = document.createElement(module.url ? "a" : "article");
    card.className = `module-card ${module.accent} reveal tips-card${module.url ? " module-link" : ""}`;
    card.style.setProperty("--delay", `${80 + index * 70}ms`);
    if (module.url) {
      card.href = module.url;
    }

    const kpi = document.createElement("div");
    kpi.className = "tips-kpi";
    kpi.innerHTML = `<span class="tips-icon">${tipsIcons[module.id] || "📌"}</span><div><span class="badge">${module.badge}</span><h3>${module.title}</h3><span>${module.duration} · ${module.intensity}</span></div>`;

    const list = document.createElement("ul");
    list.className = "module-goals";
    module.goals.forEach((goal) => {
      const item = document.createElement("li");
      item.textContent = goal;
      list.appendChild(item);
    });

    card.appendChild(kpi);
    card.appendChild(list);
    container.appendChild(card);
  });
}

function renderMilestones(items) {
  const container = document.getElementById("milestone-list");
  if (!container) return;
  container.innerHTML = "";

  items.forEach((item, index) => {
    const block = document.createElement("div");
    block.className = "timeline-item reveal";
    block.style.setProperty("--delay", `${80 + index * 80}ms`);

    const heading = document.createElement("strong");
    heading.textContent = `${item.week} - ${item.title}`;

    const detail = document.createElement("div");
    detail.textContent = item.detail;

    block.appendChild(heading);
    block.appendChild(detail);
    container.appendChild(block);
  });
}

function renderSessions(items) {
  const container = document.getElementById("session-list");
  if (!container) return;
  container.innerHTML = "";

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "session-card reveal";
    card.style.setProperty("--delay", `${120 + index * 70}ms`);

    const title = document.createElement("strong");
    title.textContent = `${item.week} - ${item.topic}`;

    const output = document.createElement("span");
    output.textContent = `Output: ${item.output}`;

    const skills = document.createElement("span");
    skills.textContent = `Skills: ${item.skills.join(", ")}`;

    card.appendChild(title);
    card.appendChild(output);
    card.appendChild(skills);
    container.appendChild(card);
  });
}

function renderExams(items) {
  const container = document.getElementById("exam-grid");
  if (!container) return;
  container.innerHTML = "";

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "exam-card reveal";
    card.style.setProperty("--delay", `${80 + index * 70}ms`);

    const title = document.createElement("h3");
    title.textContent = item.title;

    const meta = document.createElement("div");
    meta.className = "module-meta";
    meta.innerHTML = `<span>Level ${item.level}</span><span>${item.duration}</span>`;

    const list = document.createElement("ul");
    item.parts.forEach((part) => {
      const li = document.createElement("li");
      li.textContent = part;
      list.appendChild(li);
    });

    const goal = document.createElement("strong");
    goal.textContent = `Ziel: ${item.goal}`;

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(list);
    card.appendChild(goal);
    container.appendChild(card);
  });
}

function renderResources(items) {
  const container = document.getElementById("resource-list");
  if (!container) return;
  container.innerHTML = "";

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "resource-card reveal";
    card.style.setProperty("--delay", `${80 + index * 70}ms`);

    const type = document.createElement("span");
    type.textContent = item.type;
    type.style.fontWeight = "700";

    const title = document.createElement("strong");
    title.textContent = item.title;

    const meta = document.createElement("span");
    meta.textContent = item.meta;

    card.appendChild(type);
    card.appendChild(title);
    card.appendChild(meta);

    if (item.url) {
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "resource-card-link";
      link.appendChild(card.cloneNode(true));
      container.appendChild(link);
    } else {
      container.appendChild(card);
    }
  });
}

function renderCta(cta) {
  setText("cta-title", cta.primary);
  setText("cta-note", cta.note);
  const primary = document.getElementById("cta-primary");
  const secondary = document.getElementById("cta-secondary");
  if (primary) primary.textContent = cta.primary;
  if (secondary) {
    secondary.textContent = cta.secondary;
    secondary.href = "#uebungstest";
  }
}

function renderAll(data) {
  setText("program-title", data.program.title);
  setText("program-tagline", data.program.tagline);
  setText("program-desc", data.program.description);

  renderLevels(data.levels || []);
  renderStats(data.stats || []);
  renderModules(data.modules || []);
  renderMilestones(data.milestones || []);
  renderSessions(data.sessions || []);
  renderExams(data.exams || []);
  renderResources(data.resources || []);
  renderCta(data.cta || {});
}

document.addEventListener("DOMContentLoaded", async () => {
  document.body.classList.remove("no-js");
  const data = await loadData();
  renderAll(data);
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});
