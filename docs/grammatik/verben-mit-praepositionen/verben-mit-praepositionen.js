const TYPE_LABELS = {
  verb: "Verb",
  nomen: "Nomen",
  noun: "Nomen",
  adjektiv: "Adjektiv",
  adjective: "Adjektiv",
  artikel: "Artikel",
  article: "Artikel",
  pronomen: "Pronomen",
  pronoun: "Pronomen",
  adverb: "Adverb",
  präposition: "Präposition",
  preposition: "Präposition",
  konjunktion: "Konjunktion",
  conjunction: "Konjunktion",
  subjunktion: "Subjunktion",
  subjunction: "Subjunktion",
  partikel: "Partikel",
  particle: "Partikel",
  phrase: "Phrase",
  compound: "Phrase"
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeParts(parts) {
  if (!Array.isArray(parts)) return null;
  const cleaned = parts
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);
  return cleaned.length ? cleaned : null;
}

function getHighlightClassForType(type) {
  if (!type) return "explanation-highlight";
  const typeLower = String(type).toLowerCase();
  const typeMap = {
    verb: "explanation-highlight-verb",
    nomen: "explanation-highlight-nomen",
    noun: "explanation-highlight-nomen",
    adjektiv: "explanation-highlight-adj",
    adjective: "explanation-highlight-adj",
    artikel: "explanation-highlight-artikel",
    pronomen: "explanation-highlight-pronomen",
    adverb: "explanation-highlight-adverb",
    präposition: "explanation-highlight-praeposition",
    preposition: "explanation-highlight-praeposition",
    konjunktion: "explanation-highlight-konjunktion",
    subjunktion: "explanation-highlight-subjunktion",
    partikel: "explanation-highlight-partikel",
    phrase: "explanation-highlight",
    compound: "explanation-highlight"
  };
  return typeMap[typeLower] || "explanation-highlight";
}

function getHighlightClass(entry) {
  if (!entry || !entry.type) return "explanation-highlight";
  const type = String(entry.type).toLowerCase();
  if (type === "phrase" || type === "compound") return "explanation-highlight";
  return getHighlightClassForType(type);
}

function generateVerbForms(infinitive, trennbar) {
  const forms = [infinitive];
  
  // Separar prefijo si es trennbar
  let prefix = "";
  let stem = infinitive;
  
  if (trennbar) {
    const prefixes = ["ab", "an", "auf", "aus", "bei", "ein", "mit", "nach", "vor", "weg", "zu", "zurück", "zusammen", "hin", "her", "fort", "weiter", "los"];
    for (const p of prefixes) {
      if (infinitive.startsWith(p)) {
        prefix = p;
        stem = infinitive.slice(p.length);
        break;
      }
    }
  }
  
  // Obtener raíz del verbo
  let root = stem.replace(/en$/, "").replace(/n$/, "");
  
  // Presente - todas las personas
  forms.push(root + "e");       // ich
  forms.push(root + "st");      // du
  forms.push(root + "t");       // er/sie/es
  forms.push(stem);             // wir/sie/Sie (infinitivo)
  forms.push(root + "et");      // ihr (para verbos que terminan en -t, -d)
  
  // Variantes con cambio vocálico común (e->i, e->ie, a->ä)
  if (root.includes("e")) {
    const rootI = root.replace(/e([^e]*)$/, "i$1");
    const rootIe = root.replace(/e([^e]*)$/, "ie$1");
    forms.push(rootI + "st");
    forms.push(rootI + "t");
    forms.push(rootIe + "st");
    forms.push(rootIe + "t");
  }
  if (root.includes("a")) {
    const rootUmlaut = root.replace(/a([^a]*)$/, "ä$1");
    forms.push(rootUmlaut + "st");
    forms.push(rootUmlaut + "t");
  }
  
  // Participio pasado
  if (trennbar && prefix) {
    forms.push(prefix + "ge" + root + "t");
    forms.push(prefix + "ge" + root + "en");
    forms.push(prefix + "ge" + root + "et");
  } else if (!infinitive.match(/^(be|ge|er|ver|zer|ent|emp|miss|wider)/)) {
    forms.push("ge" + root + "t");
    forms.push("ge" + root + "en");
    forms.push("ge" + root + "et");
  } else {
    forms.push(root + "t");
    forms.push(root + "en");
    forms.push(root + "et");
  }
  
  // Pretérito (formas regulares)
  forms.push(root + "te");
  forms.push(root + "test");
  forms.push(root + "ten");
  forms.push(root + "tet");
  
  // Pretérito (formas irregulares comunes)
  // Solo agregamos las más comunes para no sobrecargar
  
  // Infinitivo con "zu"
  if (trennbar && prefix) {
    forms.push(prefix + "zu" + stem);
  } else {
    forms.push("zu" + stem);
  }
  
  return [...new Set(forms)];
}

function generateNounForms(noun, artikel) {
  const forms = [noun];
  const lower = noun.toLowerCase();
  
  // Plural común
  forms.push(noun + "n");
  forms.push(noun + "en");
  forms.push(noun + "e");
  forms.push(noun + "s");
  forms.push(noun + "er");
  
  // Genitivo singular (masculino y neutro)
  if (artikel === "der" || artikel === "das") {
    forms.push(noun + "s");
    forms.push(noun + "es");
  }
  
  // Dativo plural (siempre termina en -n)
  if (!noun.endsWith("n")) {
    forms.push(noun + "en");
    forms.push(noun + "n");
  }
  
  // Formas con Umlaut en plural (común en alemán)
  if (noun.includes("a") || noun.includes("o") || noun.includes("u")) {
    const withUmlautA = noun.replace(/a/g, "ä");
    const withUmlautO = noun.replace(/o/g, "ö");
    const withUmlautU = noun.replace(/u/g, "ü");
    
    [withUmlautA, withUmlautO, withUmlautU].forEach(form => {
      if (form !== noun) {
        forms.push(form);
        forms.push(form + "e");
        forms.push(form + "en");
        forms.push(form + "n");
      }
    });
  }
  
  // Sustantivos femeninos que terminan en -e suelen hacer plural en -en
  if (artikel === "die" && noun.endsWith("e")) {
    forms.push(noun + "n");
  }
  
  // Sustantivos que terminan en -ung, -heit, -keit hacen plural en -en
  if (noun.match(/(ung|heit|keit|ion|tät|schaft)$/i)) {
    forms.push(noun + "en");
  }
  
  // Sustantivos neutros que terminan en -nis hacen plural en -nisse
  if (noun.endsWith("nis")) {
    forms.push(noun + "se");
    forms.push(noun + "sen");
  }
  
  return [...new Set(forms)];
}

function getAllWordForms(entry) {
  const forms = [];
  const word = typeof entry.word === "string" ? entry.word.trim() : "";
  
  if (!word) return forms;
  
  forms.push(word);
  forms.push(word.toLowerCase());
  
  const type = String(entry.type || "").toLowerCase();
  
  if (type === "verb") {
    const verbForms = generateVerbForms(word.toLowerCase(), entry.trennbar);
    forms.push(...verbForms);
    
    // También versión capitalizada para inicio de oración
    verbForms.forEach(form => {
      forms.push(form.charAt(0).toUpperCase() + form.slice(1));
    });
  } else if (type === "nomen" || type === "noun") {
    const nounForms = generateNounForms(word, entry.artikel);
    forms.push(...nounForms);
  }
  
  return [...new Set(forms)];
}

function highlightWordInSentence(sentence, word, parts, markedText, entry) {
  let highlighted = sentence;
  const highlightClass = getHighlightClass(entry);
  
  // Generar todas las formas posibles de la palabra
  const allForms = getAllWordForms(entry);
  
  // Crear un Set con todas las formas a marcar (incluyendo parts y markedText)
  const formsToMark = new Set();
  
  // Agregar formas generadas automáticamente
  allForms.forEach(form => {
    if (form && form.length >= 2) {
      formsToMark.add(form.toLowerCase());
    }
  });
  
  // Agregar parts si existen
  if (parts && parts.length > 0) {
    parts.forEach(part => {
      if (part && part.trim()) {
        formsToMark.add(part.trim().toLowerCase());
      }
    });
  }
  
  // Agregar markedText si existe
  if (markedText && markedText.trim()) {
    formsToMark.add(markedText.trim().toLowerCase());
  }
  
  // Convertir a array y ordenar por longitud descendente
  const sortedForms = Array.from(formsToMark).sort((a, b) => b.length - a.length);
  
  // Marcar todas las formas en una sola pasada
  sortedForms.forEach(form => {
    const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const hasSpaces = form.includes(" ");
    const re = hasSpaces 
      ? new RegExp(`(${escaped})`, "gi")
      : new RegExp(`\\b(${escaped})\\b`, "gi");
    
    highlighted = highlighted.replace(re, (match) => {
      // Si ya está marcado, no volver a marcar
      if (match.includes("<span") || match.includes("</span>")) {
        return match;
      }
      return `<span class=\"${highlightClass}\">${match}</span>`;
    });
  });
  
  return highlighted;
}

function shouldHighlight(entry) {
  if (!entry) return false;
  const parts = normalizeParts(entry.parts);
  if (parts && parts.length) return true;
  const word = typeof entry.word === "string" ? entry.word.trim() : "";
  if (!word) return false;
  const type = String(entry.type || "").toLowerCase();
  if (type === "phrase") return false;
  return true;
}

function renderHighlightedText(text, entry) {
  if (!text) return "";
  if (!shouldHighlight(entry)) return escapeHtml(text);
  const parts = normalizeParts(entry.parts);
  const word = typeof entry.word === "string" ? entry.word.trim() : "";
  const type = String(entry.type || "").toLowerCase();
  const markedText = type === "phrase" && parts ? "" : word;
  return highlightWordInSentence(text, word, parts, markedText, entry);
}

function parseExample(ex) {
  if (typeof ex === "object" && ex !== null && "example" in ex) {
    return { example: ex.example, translation: ex.translation || "" };
  }
  if (typeof ex === "string") {
    const idx = ex.indexOf(" = ");
    if (idx !== -1) return { example: ex.slice(0, idx).trim(), translation: ex.slice(idx + 3).trim() };
    return { example: ex, translation: "" };
  }
  return { example: String(ex || ""), translation: "" };
}

function renderExamplesTable(examples, entry) {
  if (!examples || examples.length === 0) {
    return `<div class=\"explanation-section\"><p class=\"explanation-label\">Beispiele:</p><p class=\"woerter-panel-empty\">Noch keine Beispiele.</p></div>`;
  }
  const rows = examples
    .map((ex) => {
      const { example, translation } = parseExample(ex);
      const exampleHtml = renderHighlightedText(example, entry);
      return `<tr><td class=\"examples-cell-example\">${exampleHtml}</td><td class=\"examples-cell-translation\">${escapeHtml(translation)}</td></tr>`;
    })
    .join("");
  return `<div class=\"explanation-section\"><p class=\"explanation-label\">Beispiele:</p><table class=\"examples-table\"><thead><tr><th scope=\"col\">Beispiel</th><th scope=\"col\">Übersetzung</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function normalizeEntry(raw, index) {
  if (typeof raw === "string") {
    return {
      id: slugify(raw) || `woerter-${index}`,
      word: raw,
      baseVerb: "",
      translation: "",
      explanation: "",
      erklärung: "",
      examples: [],
      type: "",
      tags: []
    };
  }
  const word = raw.word || raw.text || "";
  return {
    id: raw.id || slugify(word) || `woerter-${index}`,
    word,
    baseVerb: raw.baseVerb || "",
    artikel: raw.artikel || "",
    trennbar: raw.trennbar,
    translation: raw.translation || "",
    explanation: raw.explanation || "",
    erklärung: raw.erklärung || "",
    examples: Array.isArray(raw.examples) ? raw.examples : [],
    type: raw.type || "",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    parts: raw.parts,
    synonyms: Array.isArray(raw.synonyms) ? raw.synonyms : [],
    antonyms: Array.isArray(raw.antonyms) ? raw.antonyms : []
  };
}

function normalizeForSimilarity(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-zäöüß]/g, "")
    .trim();
}

function buildBigrams(value) {
  const clean = normalizeForSimilarity(value);
  if (!clean) return new Set();
  if (clean.length < 2) return new Set([clean]);
  const out = new Set();
  for (let i = 0; i < clean.length - 1; i += 1) {
    out.add(clean.slice(i, i + 2));
  }
  return out;
}

function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  let intersect = 0;
  a.forEach((val) => {
    if (b.has(val)) intersect += 1;
  });
  const union = a.size + b.size - intersect;
  return union ? intersect / union : 0;
}

function computeSimilarity(a, b) {
  let score = 0;
  if (a.type && b.type && String(a.type).toLowerCase() === String(b.type).toLowerCase()) {
    score += 0.35;
  }
  const tagsA = new Set((a.tags || []).map((t) => String(t).toLowerCase()));
  const tagsB = new Set((b.tags || []).map((t) => String(t).toLowerCase()));
  if (tagsA.size && tagsB.size) {
    score += 0.45 * jaccard(tagsA, tagsB);
  }
  const gramsA = buildBigrams(a.word);
  const gramsB = buildBigrams(b.word);
  score += 0.2 * jaccard(gramsA, gramsB);
  return Math.min(score, 1);
}

function createPanelEmpty(panel) {
  panel.innerHTML = `
    <div class=\"woerter-panel-empty\">
      Klicke auf einen Knoten, um Übersetzung, Erklärung und Beispiele zu sehen.
    </div>
  `;
}

function renderPanel(entry, panel) {
  if (!entry) return createPanelEmpty(panel);
  const typeLabel = entry.type ? TYPE_LABELS[String(entry.type).toLowerCase()] || entry.type : "";
  let html = `
    <div class=\"woerter-panel-header\">
      <span class=\"woerter-panel-word\" data-type=\"${escapeHtml(entry.type || "")}\">${escapeHtml(entry.word)}</span>
      <div class=\"woerter-panel-actions\">
        ${typeLabel ? `<span class=\"woerter-panel-type\">${escapeHtml(typeLabel)}</span>` : ""}
        <button class=\"woerter-panel-back\" type=\"button\" data-action=\"back\">Zurück zum Knoten</button>
      </div>
    </div>
    <div class=\"explanation-section\">
      <p class=\"explanation-label\">Übersetzung:</p>
      <p class=\"woerter-panel-translation\">${escapeHtml(entry.translation || "Noch keine Übersetzung.")}</p>
    </div>
  `;
  if (entry.artikel) {
    html += `
      <div class=\"explanation-section\">
        <p class=\"explanation-label\">Artikel:</p>
        <p>${escapeHtml(entry.artikel)}</p>
      </div>
    `;
  }
  if (entry.trennbar === true || entry.trennbar === false) {
    html += `
      <div class=\"explanation-section\">
        <p class=\"explanation-label\">Verbart:</p>
        <p>${entry.trennbar ? "Trennbar" : "Untrennbar"}</p>
      </div>
    `;
  }
  html += renderExamplesTable(entry.examples, entry);
  const renderSynAntTable = (items) => {
    const rows = items
      .map(
        (it) =>
          `<tr><td>${escapeHtml(it.word || "")}</td><td>${escapeHtml(it.translation || "")}</td></tr>`
      )
      .join("");
    return `<table class=\"examples-table\"><thead><tr><th scope=\"col\">Wort</th><th scope=\"col\">Übersetzung</th></tr></thead><tbody>${rows}</tbody></table>`;
  };
  if (entry.synonyms && entry.synonyms.length) {
    html += `
      <div class=\"explanation-section\">
        <p class=\"explanation-label\">Synonyme:</p>
        ${renderSynAntTable(entry.synonyms)}
      </div>
    `;
  }
  if (entry.antonyms && entry.antonyms.length) {
    html += `
      <div class=\"explanation-section\">
        <p class=\"explanation-label\">Antonyme:</p>
        ${renderSynAntTable(entry.antonyms)}
      </div>
    `;
  }
  if (entry.erklärung) {
    html += `
      <div class=\"explanation-section\">
        <p class=\"explanation-label\">Erklärung (DE):</p>
        <p>${escapeHtml(entry.erklärung)}</p>
      </div>
    `;
  }
  if (entry.explanation) {
    html += `
      <div class=\"explanation-section\">
        <p class=\"explanation-label\">Erklärung:</p>
        <p>${escapeHtml(entry.explanation)}</p>
      </div>
    `;
  }
  if (entry.tags && entry.tags.length) {
    const tags = entry.tags
      .map((tag) => `<span class=\"woerter-tag\">${escapeHtml(tag)}</span>`)
      .join("");
    html += `
      <div class=\"explanation-section\">
        <p class=\"explanation-label\">Schlüssel:</p>
        <div class=\"woerter-tags\">${tags}</div>
      </div>
    `;
  }
  panel.innerHTML = html;
}

function buildTypeFilters(entries, container, onChange) {
  const types = Array.from(
    new Set(entries.map((entry) => String(entry.type || "").toLowerCase()).filter(Boolean))
  );
  if (!types.length) return { activeTypes: new Set() };

  const activeTypes = new Set(types);
  const allButton = document.createElement("button");
  allButton.className = "woerter-filter is-active";
  allButton.type = "button";
  allButton.textContent = "Alle";
  container.appendChild(allButton);

  const buttons = new Map();
  types.forEach((type) => {
    const btn = document.createElement("button");
    btn.className = "woerter-filter is-active";
    btn.type = "button";
    btn.dataset.type = type;
    btn.textContent = TYPE_LABELS[type] || type;
    container.appendChild(btn);
    buttons.set(type, btn);
  });

  function syncAllButton() {
    const allActive = activeTypes.size === types.length;
    allButton.classList.toggle("is-active", allActive);
  }

  allButton.addEventListener("click", () => {
    activeTypes.clear();
    types.forEach((type) => activeTypes.add(type));
    buttons.forEach((btn) => btn.classList.add("is-active"));
    syncAllButton();
    onChange(activeTypes);
  });

  buttons.forEach((btn, type) => {
    btn.addEventListener("click", () => {
      if (activeTypes.has(type)) {
        activeTypes.delete(type);
        btn.classList.remove("is-active");
      } else {
        activeTypes.add(type);
        btn.classList.add("is-active");
      }
      syncAllButton();
      onChange(activeTypes);
    });
  });

  return { activeTypes };
}

function buildNodes(entries, nodesLayer, onSelect) {
  const nodes = entries.map((entry, index) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "woerter-node";
    node.textContent = entry.word;
    if (entry.type) node.dataset.type = String(entry.type).toLowerCase();
    node.dataset.id = entry.id;
    nodesLayer.appendChild(node);
    const nodeData = {
      entry,
      el: node,
      id: entry.id,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      dragging: false,
      dragMoved: false,
      suppressClick: false,
      visible: true,
      seed: (index + 1) * 11.7
    };
    node.addEventListener("click", () => {
      if (nodeData.suppressClick) {
        nodeData.suppressClick = false;
        return;
      }
      onSelect(nodeData);
    });
    return nodeData;
  });
  return nodes;
}

function createEdges(nodes, svgLayer) {
  const edges = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const typeA = String(nodes[i].entry.type || "").toLowerCase();
      const typeB = String(nodes[j].entry.type || "").toLowerCase();
      if (!typeA || !typeB || typeA !== typeB) continue;
      const weight = computeSimilarity(nodes[i].entry, nodes[j].entry);
      if (weight < 0.22) continue;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.classList.add("woerter-ether-link");
      line.style.opacity = String(Math.min(0.8, 0.18 + weight * 0.9));
      line.style.strokeWidth = String(0.6 + weight * 1.8);
      svgLayer.appendChild(line);
      edges.push({ source: nodes[i], target: nodes[j], weight, line });
    }
  }
  return edges;
}

function createEdgesStar(nodes, centerNode, svgLayer) {
  const edges = [];
  nodes.forEach((node) => {
    if (node === centerNode) return;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList.add("woerter-ether-link");
    line.style.opacity = "0.6";
    line.style.strokeWidth = "1.2";
    svgLayer.appendChild(line);
    edges.push({ source: node, target: centerNode, weight: 1, line });
  });
  return edges;
}

// Configuración de órbitas múltiples para el layout estrella
const ORBIT_CONFIG = [
  { radius: 150, maxNodes: 8 },
  { radius: 240, maxNodes: 14 },
  { radius: 340, maxNodes: 20 },
  { radius: 450, maxNodes: 28 },
  { radius: 570, maxNodes: 36 }
];

function seedPositionsStar(state, centerNode) {
  const { width, height } = state.bounds;
  const centerX = width / 2;
  const centerY = height / 2;
  const nodes = state.nodes;
  const others = nodes.filter((n) => n !== centerNode);
  
  centerNode.x = centerX;
  centerNode.y = centerY;
  centerNode.vx = 0;
  centerNode.vy = 0;
  
  // Distribuir nodos en múltiples órbitas
  const orbits = [];
  let remainingNodes = [...others];
  
  for (const config of ORBIT_CONFIG) {
    if (remainingNodes.length === 0) break;
    const nodesForOrbit = remainingNodes.splice(0, config.maxNodes);
    orbits.push({ radius: config.radius, nodes: nodesForOrbit });
  }
  
  // Si aún quedan nodos, agregarlos a órbitas adicionales
  while (remainingNodes.length > 0) {
    const lastOrbit = orbits[orbits.length - 1];
    const newRadius = lastOrbit ? lastOrbit.radius + 120 : 150;
    const maxForNewOrbit = Math.floor(newRadius * 0.08);
    const nodesForOrbit = remainingNodes.splice(0, maxForNewOrbit);
    orbits.push({ radius: newRadius, nodes: nodesForOrbit });
  }
  
  // Posicionar nodos en cada órbita
  orbits.forEach((orbit) => {
    const { radius, nodes: orbitNodes } = orbit;
    orbitNodes.forEach((node, i) => {
      const angle = (i / Math.max(1, orbitNodes.length)) * Math.PI * 2;
      const jitter = 0.92 + Math.random() * 0.16;
      node.x = centerX + Math.cos(angle) * radius * jitter;
      node.y = centerY + Math.sin(angle) * radius * jitter;
      node.vx = 0;
      node.vy = 0;
    });
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyView(state) {
  if (!state.space || !state.view) return;
  state.space.style.setProperty("--pan-x", `${state.view.panX}px`);
  state.space.style.setProperty("--pan-y", `${state.view.panY}px`);
  state.space.style.setProperty("--zoom", state.view.zoom.toFixed(3));
}

function focusNode(state, node, stage) {
  if (!node || !state.view || !stage) return;
  const rect = stage.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  state.view.panX = centerX - node.x * state.view.zoom;
  state.view.panY = centerY - node.y * state.view.zoom;
  applyView(state);
}

const WORLD_SIZE = 1000;

function updateBounds(state, stage) {
  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const worldW = WORLD_SIZE;
  const worldH = WORLD_SIZE;
  if (state.bounds.width && state.bounds.height) {
    const scaleX = worldW / state.bounds.width;
    const scaleY = worldH / state.bounds.height;
    state.nodes.forEach((node) => {
      node.x *= scaleX;
      node.y *= scaleY;
    });
    if (state.view) {
      state.view.panX *= scaleX;
      state.view.panY *= scaleY;
    }
  }
  state.bounds.width = worldW;
  state.bounds.height = worldH;
  if (state.space) {
    state.space.style.left = "0";
    state.space.style.top = "0";
    state.space.style.right = "auto";
    state.space.style.bottom = "auto";
    state.space.style.width = worldW + "px";
    state.space.style.height = worldH + "px";
  }
  if (state.svg) {
    state.svg.setAttribute("width", worldW);
    state.svg.setAttribute("height", worldH);
    state.svg.setAttribute("viewBox", `0 0 ${worldW} ${worldH}`);
  }
  applyView(state);
}

const SEED_RADIUS = 380;
const MIN_NODE_DIST = 72;

function seedPositions(state, types) {
  const { width, height } = state.bounds;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = SEED_RADIUS;
  const typeAnchors = new Map();
  types.forEach((type, i) => {
    const angle = (i / types.length) * Math.PI * 2;
    typeAnchors.set(type, {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  });

  state.nodes.forEach((node) => {
    const type = String(node.entry.type || "").toLowerCase();
    const anchor = typeAnchors.get(type) || { x: centerX, y: centerY };
    const jitter = 60 + Math.random() * 80;
    const angle = Math.random() * Math.PI * 2;
    node.x = anchor.x + Math.cos(angle) * jitter;
    node.y = anchor.y + Math.sin(angle) * jitter;
    node.vx = (Math.random() - 0.5) * 0.8;
    node.vy = (Math.random() - 0.5) * 0.8;
  });
}

function updateNodeElement(node) {
  node.el.style.setProperty("--x", node.x.toFixed(2));
  node.el.style.setProperty("--y", node.y.toFixed(2));
}

function runSimulation(state, stage) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    state.nodes.forEach((node) => {
      updateNodeElement(node);
    });
    updateLinks(state);
    return;
  }

  let lastTime = performance.now();
  const step = (time) => {
    if (!state.running) return;
    const dt = Math.min(32, time - lastTime) / 16;
    lastTime = time;
    const { width, height } = state.bounds;
    const centerX = width / 2;
    const centerY = height / 2;
    const nodes = state.nodes.filter((node) => node.visible);

    nodes.forEach((node) => {
      node.ax = 0;
      node.ay = 0;
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        if (a.dragging && b.dragging) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy + 120;
        const dist = Math.sqrt(distSq);
        let force = 3500 / distSq;
        if (dist < MIN_NODE_DIST && dist > 1) {
          force = Math.max(force, 9000 / distSq);
        }
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (!a.dragging) {
          a.ax += fx;
          a.ay += fy;
        }
        if (!b.dragging) {
          b.ax -= fx;
          b.ay -= fy;
        }
      }
    }

    state.edges.forEach((edge) => {
      if (!edge.visible) return;
      const a = edge.source;
      const b = edge.target;
      if (a.dragging && b.dragging) return;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const desired = state.centerNode ? 180 + (1 - edge.weight) * 100 : 90 + (1 - edge.weight) * 140;
      const spring = (dist - desired) * (0.001 + edge.weight * 0.002);
      const fx = (dx / dist) * spring;
      const fy = (dy / dist) * spring;
      if (!a.dragging) {
        a.ax += fx;
        a.ay += fy;
      }
      if (!b.dragging) {
        b.ax -= fx;
        b.ay -= fy;
      }
    });

    nodes.forEach((node) => {
      if (node.dragging) {
        node.vx = 0;
        node.vy = 0;
        return;
      }

      // Atracción gravitacional
      if (state.centerNode && node !== state.centerNode) {
        // Satélite: se atrae hacia el nodo central
        node.ax += (state.centerNode.x - node.x) * 0.0008;
        node.ay += (state.centerNode.y - node.y) * 0.0008;
      } else {
        // Sin modo estrella (o es el propio centro): atrae al centro del canvas
        node.ax += (centerX - node.x) * 0.0006;
        node.ay += (centerY - node.y) * 0.0006;
      }

      node.ax += Math.sin(time * 0.0004 + node.seed) * 0.015;
      node.ay += Math.cos(time * 0.0004 + node.seed) * 0.015;

      node.vx = (node.vx + node.ax * dt) * 0.88;
      node.vy = (node.vy + node.ay * dt) * 0.88;

      const maxSpeed = 2.2;
      node.vx = Math.max(-maxSpeed, Math.min(maxSpeed, node.vx));
      node.vy = Math.max(-maxSpeed, Math.min(maxSpeed, node.vy));

      node.x += node.vx;
      node.y += node.vy;
    });

    nodes.forEach((node) => {
      updateNodeElement(node);
    });

    updateLinks(state);
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function updateLinks(state) {
  state.edges.forEach((edge) => {
    if (!edge.visible) {
      edge.line.style.opacity = "0";
      return;
    }
    edge.line.style.opacity = String(Math.min(0.85, 0.18 + edge.weight * 0.9));
    edge.line.setAttribute("x1", edge.source.x.toFixed(2));
    edge.line.setAttribute("y1", edge.source.y.toFixed(2));
    edge.line.setAttribute("x2", edge.target.x.toFixed(2));
    edge.line.setAttribute("y2", edge.target.y.toFixed(2));
  });
}

function applyFilters(state, query, activeTypes, countEl) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  let visibleCount = 0;
  state.nodes.forEach((node) => {
    const entry = node.entry;
    const type = String(entry.type || "").toLowerCase();
    const inType = !activeTypes.size || activeTypes.has(type);
    const haystack = [
      entry.word,
      entry.translation,
      entry.explanation,
      (entry.tags || []).join(" ")
    ]
      .join(" ")
      .toLowerCase();
    const matches = !normalizedQuery || haystack.includes(normalizedQuery);
    node.visible = inType && matches;
    node.el.classList.toggle("is-hidden", !node.visible);
    if (node.visible) visibleCount += 1;
  });
  state.edges.forEach((edge) => {
    edge.visible = edge.source.visible && edge.target.visible;
  });
  updateLinks(state);
  if (countEl) {
    countEl.textContent = `${visibleCount} / ${state.nodes.length}`;
  }
}

function shuffle(list) {
  const copy = Array.isArray(list) ? [...list] : [];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getBaseVerbs(data) {
  const baseVerbsOrder = Array.isArray(data && data.baseVerbs) ? data.baseVerbs : [];
  const words = Array.isArray(data && data.words) ? data.words : [];
  const fromWords = [...new Set(words.map((w) => w.baseVerb).filter(Boolean))];
  const ordered = baseVerbsOrder.filter((v) => fromWords.includes(v));
  const rest = fromWords.filter((v) => !baseVerbsOrder.includes(v)).sort((a, b) => a.localeCompare(b));
  return [...ordered, ...rest];
}

function renderFlashExamplesTable(examples, entry) {
  if (!examples || examples.length === 0) {
    return '<p class="basis-flashcards-empty">Noch keine Beispiele.</p>';
  }
  const rows = examples
    .map((ex) => {
      const { example, translation } = parseExample(ex);
      const exampleHtml = renderHighlightedText(example, entry);
      return `<tr><td class="examples-cell-example">${exampleHtml}</td><td class="examples-cell-translation">${escapeHtml(translation)}</td></tr>`;
    })
    .join("");
  return `<table class="examples-table"><thead><tr><th scope="col">Beispiel</th><th scope="col">Übersetzung</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function createBaseFlashcards(entries, baseVerb, mode) {
  const cards = entries
    .map((entry) => ({
      entry,
      word: String(entry.word || "").trim(),
      translation: String(entry.translation || "").trim(),
      artikel: String(entry.artikel || "").trim(),
      examples: Array.isArray(entry.examples) ? entry.examples : []
    }))
    .filter((card) => card.word || card.translation || card.examples.length);

  const root = document.createElement("section");
  root.className = "basis-flashcards";
  root.hidden = true;

  root.innerHTML = `
    <div class="flashcards-meta">
      <strong>Flashcards – Basis ${escapeHtml(baseVerb || "")}</strong>
      <span class="flashcards-meta" data-role="meta"></span>
    </div>
    <div class="flashcards-stage" data-empty="false">
      <div class="flashcards-empty" data-role="empty"></div>
      <div class="flashcard" data-role="card" tabindex="0" role="button" aria-label="Karte aufdecken">
        <div class="flashcard-inner">
          <div class="flashcard-face flashcard-front">
            <p class="flashcard-label">${mode === "nomen" ? "Nomen" : "Verb"}</p>
            <p class="flashcard-term" data-role="front-word"></p>
            <p class="flashcard-prompt">Was bedeutet das?</p>
          </div>
          <div class="flashcard-face flashcard-back">
            <p class="flashcard-label">Übersetzung</p>
            <p class="flashcard-answer" data-role="back-translation"></p>
            <p class="basis-flashcard-answer-meta" data-role="back-meta"></p>
            <div class="basis-flashcard-examples" data-role="back-examples"></div>
          </div>
        </div>
      </div>
      <div class="flashcards-progress"><div class="flashcards-progress-bar" data-role="progress"></div></div>
      <div class="flashcards-meta" data-role="progress-text"></div>
      <div class="flashcards-controls">
        <button type="button" class="btn ghost" data-action="prev">Zurück</button>
        <button type="button" class="btn ghost" data-action="flip">Aufdecken</button>
        <button type="button" class="btn ghost" data-action="next">Weiter</button>
        <button type="button" class="btn ghost" data-action="close">Schließen</button>
      </div>
    </div>
  `;

  const stage = root.querySelector(".flashcards-stage");
  const emptyEl = root.querySelector('[data-role="empty"]');
  const cardEl = root.querySelector('[data-role="card"]');
  const frontWordEl = root.querySelector('[data-role="front-word"]');
  const backTranslationEl = root.querySelector('[data-role="back-translation"]');
  const backMetaEl = root.querySelector('[data-role="back-meta"]');
  const backExamplesEl = root.querySelector('[data-role="back-examples"]');
  const progressBarEl = root.querySelector('[data-role="progress"]');
  const progressTextEl = root.querySelector('[data-role="progress-text"]');
  const headerMetaEl = root.querySelector('[data-role="meta"]');
  const prevBtn = root.querySelector('[data-action="prev"]');
  const nextBtn = root.querySelector('[data-action="next"]');
  const flipBtn = root.querySelector('[data-action="flip"]');
  const closeBtn = root.querySelector('[data-action="close"]');

  const flashState = {
    deck: [],
    index: 0,
    open: false
  };

  const setFlipped = (flipped) => {
    cardEl.classList.toggle("is-flipped", Boolean(flipped));
  };

  const toggleFlip = () => {
    if (!flashState.deck.length) return;
    cardEl.classList.toggle("is-flipped");
  };

  const updateCard = () => {
    if (!flashState.deck.length) {
      stage.dataset.empty = "true";
      emptyEl.textContent = "Keine Flashcards für diese Basis verfügbar.";
      if (headerMetaEl) headerMetaEl.textContent = "0 Karten";
      if (progressTextEl) progressTextEl.textContent = "0 / 0";
      if (progressBarEl) progressBarEl.style.width = "0%";
      return;
    }

    stage.dataset.empty = "false";
    const current = flashState.deck[flashState.index];
    const answerMeta = [];
    if (current.artikel) answerMeta.push(`Artikel: ${current.artikel}`);
    answerMeta.push(`Wort: ${current.word || "—"}`);
    answerMeta.push(`Basis: ${baseVerb}`);

    frontWordEl.textContent = current.word || "Ohne Eintrag";
    backTranslationEl.textContent = current.translation || "Ohne Übersetzung";
    backMetaEl.textContent = answerMeta.join(" · ");
    backExamplesEl.innerHTML = renderFlashExamplesTable(current.examples, current.entry);

    const total = flashState.deck.length;
    const progress = total ? ((flashState.index + 1) / total) * 100 : 0;
    if (progressBarEl) progressBarEl.style.width = `${progress.toFixed(2)}%`;
    if (progressTextEl) progressTextEl.textContent = `${flashState.index + 1} / ${total}`;
    if (headerMetaEl) headerMetaEl.textContent = `${total} Karten`;

    prevBtn.disabled = flashState.index === 0;
    nextBtn.disabled = flashState.index >= total - 1;
    setFlipped(false);
  };

  const goPrev = () => {
    if (flashState.index <= 0) return;
    flashState.index -= 1;
    updateCard();
  };

  const goNext = () => {
    if (flashState.index >= flashState.deck.length - 1) return;
    flashState.index += 1;
    updateCard();
  };

  const open = () => {
    flashState.deck = shuffle(cards);
    flashState.index = 0;
    flashState.open = true;
    root.hidden = false;
    updateCard();
  };

  const close = () => {
    flashState.open = false;
    root.hidden = true;
    setFlipped(false);
  };

  const toggle = () => {
    if (flashState.open) {
      close();
      return false;
    }
    open();
    return true;
  };

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);
  flipBtn.addEventListener("click", toggleFlip);
  closeBtn.addEventListener("click", close);
  cardEl.addEventListener("click", toggleFlip);
  cardEl.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleFlip();
  });

  updateCard();

  return {
    root,
    hasCards: cards.length > 0,
    toggle,
    close,
    isOpen: () => flashState.open
  };
}

function buildEther(container, entries, baseVerb, options = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "woerter-ether";

  const controls = document.createElement("div");
  controls.className = "woerter-ether-controls";

  const controlsBody = document.createElement("div");
  controlsBody.className = "woerter-ether-controls-body";

  const searchWrap = document.createElement("div");
  searchWrap.className = "woerter-search";
  const searchLabel = document.createElement("label");
  searchLabel.className = "woerter-label";
  searchLabel.setAttribute("for", "woerter-search");
  searchLabel.textContent = "Suchen";
  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.id = "woerter-search";
  searchInput.className = "woerter-search-input";
  searchInput.placeholder = "Wort, Übersetzung oder Schlagwort suchen";
  searchWrap.appendChild(searchLabel);
  searchWrap.appendChild(searchInput);

  const filterWrap = document.createElement("div");
  filterWrap.className = "woerter-filters";

  controlsBody.appendChild(searchWrap);
  controlsBody.appendChild(filterWrap);

  controls.appendChild(controlsBody);

  let flashcards = null;
  let flashToggleBtn = null;
  if (baseVerb) {
    const actionsWrap = document.createElement("div");
    actionsWrap.className = "woerter-ether-actions";

    flashToggleBtn = document.createElement("button");
    flashToggleBtn.type = "button";
    flashToggleBtn.className = "btn ghost woerter-flash-toggle";
    flashToggleBtn.textContent = "Flashcards";

    actionsWrap.appendChild(flashToggleBtn);
    controls.appendChild(actionsWrap);

    flashcards = createBaseFlashcards(entries, baseVerb, options.mode || "verben");
    flashToggleBtn.disabled = !flashcards.hasCards;
    if (!flashcards.hasCards) {
      flashToggleBtn.textContent = "Keine Flashcards";
      flashToggleBtn.title = "Für diese Basis sind keine Flashcards verfügbar.";
    }
  }

  const stage = document.createElement("div");
  stage.className = "woerter-ether-stage";

  const isTouchDevice = "ontouchstart" in window;
  if (isTouchDevice) stage.classList.add("woerter-ether-stage--touch");

  const hint = document.createElement("div");
  hint.className = "woerter-ether-hint";
  hint.textContent = isTouchDevice ? "Ziehen zum Bewegen" : "Ziehen zum Bewegen · Rad zum Zoomen";

  const space = document.createElement("div");
  space.className = "woerter-ether-space";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("woerter-ether-links");
  svg.setAttribute("aria-hidden", "true");

  const nodesLayer = document.createElement("div");
  nodesLayer.className = "woerter-ether-nodes";

  space.appendChild(svg);
  space.appendChild(nodesLayer);
  stage.appendChild(space);
  stage.appendChild(hint);

  const panel = document.createElement("aside");
  panel.className = "woerter-panel";
  panel.setAttribute("aria-live", "polite");

  wrapper.appendChild(controls);
  wrapper.appendChild(stage);
  wrapper.appendChild(panel);
  if (flashcards) wrapper.appendChild(flashcards.root);
  container.appendChild(wrapper);

  const state = {
    nodes: [],
    edges: [],
    bounds: { width: 0, height: 0 },
    running: true,
    view: { zoom: 1, panX: 0, panY: 0 },
    stage,
    space,
    svg,
    lastNode: null,
    lastScrollY: 0,
    draggingNode: null,
    centerNode: null
  };

  const getWorldPoint = (event) => {
    const rect = stage.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - state.view.panX) / state.view.zoom,
      y: (event.clientY - rect.top - state.view.panY) / state.view.zoom
    };
  };

  const nodes = buildNodes(entries, nodesLayer, (nodeData) => {
    const isSameNode = state.lastNode && state.lastNode.id === nodeData.id;
    state.nodes.forEach((node) => node.el.classList.remove("is-active"));
    if (isSameNode) {
      state.lastNode = null;
      createPanelEmpty(panel);
      return;
    }
    nodeData.el.classList.add("is-active");
    state.lastNode = nodeData;
    state.lastScrollY = window.scrollY || 0;
    renderPanel(nodeData.entry, panel);
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  state.nodes = nodes;

  if (flashcards && flashToggleBtn) {
    flashToggleBtn.addEventListener("click", () => {
      if (!flashcards.hasCards) return;
      const open = flashcards.toggle();
      flashToggleBtn.classList.toggle("is-active", open);
      flashToggleBtn.textContent = open ? "Flashcards schließen" : "Flashcards";
      if (open) {
        flashcards.root.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const onDragMove = (event) => {
    if (!state.draggingNode) return;
    const node = state.draggingNode;
    const world = getWorldPoint(event);
    node.x = world.x - node.dragOffsetX;
    node.y = world.y - node.dragOffsetY;
    if (!node.dragMoved) {
      const dx = event.clientX - node.dragStartX;
      const dy = event.clientY - node.dragStartY;
      if (Math.hypot(dx, dy) > 4) node.dragMoved = true;
    }
    updateNodeElement(node);
    updateLinks(state);
  };

  const onDragEnd = () => {
    const node = state.draggingNode;
    if (!node) return;
    node.dragging = false;
    node.el.classList.remove("is-dragging");
    node.suppressClick = node.dragMoved;
    node.dragMoved = false;
    state.draggingNode = null;
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", onDragEnd);
    window.removeEventListener("pointercancel", onDragEnd);
  };

  nodes.forEach((node) => {
    node.el.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      if (event.pointerType === "touch") return;
      event.preventDefault();
      event.stopPropagation();
      const world = getWorldPoint(event);
      node.dragging = true;
      node.dragMoved = false;
      node.dragStartX = event.clientX;
      node.dragStartY = event.clientY;
      node.dragOffsetX = world.x - node.x;
      node.dragOffsetY = world.y - node.y;
      node.el.classList.add("is-dragging");
      state.draggingNode = node;
      window.addEventListener("pointermove", onDragMove);
      window.addEventListener("pointerup", onDragEnd);
      window.addEventListener("pointercancel", onDragEnd);
    });
  });

  updateBounds(state, stage);
  const rect = stage.getBoundingClientRect();
  state.view.panX = rect.width / 2 - state.bounds.width / 2;
  state.view.panY = rect.height / 2 - state.bounds.height / 2;
  applyView(state);

  const centerNode = baseVerb ? nodes.find((n) => String(n.entry.word || "").toLowerCase() === String(baseVerb).toLowerCase()) : null;
  state.centerNode = centerNode || null;

  if (baseVerb && centerNode) {
    seedPositionsStar(state, centerNode);
    nodes.forEach((node) => updateNodeElement(node));
    state.edges = createEdgesStar(nodes, centerNode, svg);
  } else {
    const types = Array.from(new Set(entries.map((entry) => String(entry.type || "").toLowerCase()).filter(Boolean)));
    seedPositions(state, types.length ? types : ["base"]);
    state.edges = createEdges(nodes, svg);
  }

  const { activeTypes } = buildTypeFilters(entries, filterWrap, () => {
    applyFilters(state, searchInput.value, activeTypes, null);
  });

  applyFilters(state, "", activeTypes, null);
  createPanelEmpty(panel);
  applyView(state);

  if (baseVerb && centerNode) {
    updateLinks(state);
  }
  runSimulation(state, stage);

  searchInput.addEventListener("input", () => {
    applyFilters(state, searchInput.value, activeTypes, null);
  });

  window.addEventListener("resize", () => {
    updateBounds(state, stage);
  });

  panel.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action !== "back") return;
    if (!state.lastNode) return;
    stage.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      focusNode(state, state.lastNode, stage);
    }, 350);
  });

  const touchLock = {
    active: false,
    scrollY: 0
  };

  const lockBodyScroll = () => {
    if (touchLock.active) return;
    touchLock.active = true;
    touchLock.scrollY = window.scrollY || window.pageYOffset || 0;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${touchLock.scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
  };

  const unlockBodyScroll = () => {
    if (!touchLock.active) return;
    const body = document.body;
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflow = "";
    window.scrollTo(0, touchLock.scrollY);
    touchLock.active = false;
  };

  const blockTouchScroll = (event) => {
    if (!event.cancelable) return;
    if (event.type === "touchmove" || (event.touches && event.touches.length > 1)) {
      event.preventDefault();
    }
  };

  const findNodeFromTarget = (target) => {
    if (!(target instanceof HTMLElement)) return null;
    const nodeEl = target.closest(".woerter-node");
    if (!nodeEl) return null;
    return state.nodes.find((node) => node.el === nodeEl) || null;
  };

  const getTouchById = (touches, id) => {
    if (!touches) return null;
    for (let i = 0; i < touches.length; i += 1) {
      if (touches[i].identifier === id) return touches[i];
    }
    return null;
  };

  const maybeUnlockBody = (event) => {
    if (!touchLock.active) return;
    if (event.touches && event.touches.length > 0) return;
    unlockBodyScroll();
  };

  window.addEventListener("touchend", maybeUnlockBody, { passive: true });
  window.addEventListener("touchcancel", maybeUnlockBody, { passive: true });

  let touchPanning = false;
  let touchId = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartPanX = 0;
  let touchStartPanY = 0;
  let touchStartNode = null;
  const touchPanThreshold = 6;

  const endTouchPan = () => {
    touchPanning = false;
    touchId = null;
    touchStartNode = null;
    stage.classList.remove("is-panning");
  };

  stage.addEventListener("touchstart", (event) => {
    lockBodyScroll();
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch) return;
    touchId = touch.identifier;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartPanX = state.view.panX;
    touchStartPanY = state.view.panY;
    touchStartNode = findNodeFromTarget(event.target);
    touchPanning = false;
  }, { passive: false });

  stage.addEventListener("touchmove", (event) => {
    blockTouchScroll(event);
    if (touchId == null) return;
    const touch = getTouchById(event.touches, touchId);
    if (!touch) return;
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (!touchPanning && Math.hypot(dx, dy) >= touchPanThreshold) {
      touchPanning = true;
      stage.classList.add("is-panning");
      if (touchStartNode) touchStartNode.suppressClick = true;
    }
    if (!touchPanning) return;
    state.view.panX = touchStartPanX + dx;
    state.view.panY = touchStartPanY + dy;
    applyView(state);
  }, { passive: false });

  stage.addEventListener("touchend", (event) => {
    if (touchId != null && getTouchById(event.touches, touchId)) return;
    endTouchPan();
    maybeUnlockBody(event);
  }, { passive: true });

  stage.addEventListener("touchcancel", (event) => {
    endTouchPan();
    maybeUnlockBody(event);
  }, { passive: true });

  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let startPanX = 0;
  let startPanY = 0;

  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    const target = event.target;
    if (target instanceof HTMLElement && target.closest(".woerter-node")) return;
    isPanning = true;
    startX = event.clientX;
    startY = event.clientY;
    startPanX = state.view.panX;
    startPanY = state.view.panY;
    stage.classList.add("is-panning");
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!isPanning) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    state.view.panX = startPanX + dx;
    state.view.panY = startPanY + dy;
    applyView(state);
  });

  stage.addEventListener("pointerup", (event) => {
    if (!isPanning) return;
    isPanning = false;
    stage.classList.remove("is-panning");
    stage.releasePointerCapture(event.pointerId);
  });

  stage.addEventListener("pointercancel", () => {
    isPanning = false;
    stage.classList.remove("is-panning");
  });

  stage.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rectInner = stage.getBoundingClientRect();
    const pointerX = event.clientX - rectInner.left;
    const pointerY = event.clientY - rectInner.top;
    const deltaMultiplier = event.deltaMode === 1 ? 14 : 1;

    if (event.ctrlKey) {
      const zoomDelta = -event.deltaY * deltaMultiplier;
      const zoomFactor = Math.exp(zoomDelta * 0.005);
      const nextZoom = Math.max(0.05, state.view.zoom * zoomFactor);
      const worldX = (pointerX - state.view.panX) / state.view.zoom;
      const worldY = (pointerY - state.view.panY) / state.view.zoom;
      state.view.zoom = nextZoom;
      state.view.panX = pointerX - worldX * nextZoom;
      state.view.panY = pointerY - worldY * nextZoom;
    } else {
      state.view.panX -= event.deltaX * deltaMultiplier;
      state.view.panY -= event.deltaY * deltaMultiplier;
    }
    applyView(state);
  }, { passive: false });

  stage.addEventListener("dblclick", () => {
    state.view.zoom = 1;
    state.view.panX = 0;
    state.view.panY = 0;
    applyView(state);
  });

  // Exponer state globalmente para mobile-gestures.js
  window.etherState = state;
  window.applyView = applyView;
}

document.addEventListener("DOMContentLoaded", () => {
  const listHeroView = document.getElementById("list-hero-view");
  const listSectionView = document.getElementById("list-section-view");
  const detailHeroView = document.getElementById("detail-hero-view");
  const detailSectionView = document.getElementById("detail-section-view");

  const listEl = document.getElementById("verben-liste");
  const searchInput = document.getElementById("verben-suchen");
  const listModeSwitch = document.getElementById("modus-switch");
  const listTitle = document.getElementById("liste-titel");
  const listHint = document.getElementById("liste-hinweis");

  const container = document.getElementById("woerter-content");
  const titleEl = document.getElementById("karte-title");
  const leadEl = document.getElementById("karte-lead");
  const panelTextEl = document.getElementById("karte-panel-text");
  const navBackLink = document.getElementById("nav-back-to-list");
  const panelBackLink = document.getElementById("karte-back-link");
  const detailModeSwitchEl = document.getElementById("karte-modus-switch");
  const footerLabel = document.getElementById("page-footer-label");

  const params = new URLSearchParams(location.search);
  const verbParam = params.get("verb");
  const requestedMode = params.get("modus") === "nomen" ? "nomen" : "verben";
  const isDetailView = Boolean(verbParam);

  const modeLabels = {
    verben: {
      title: "Präfixverben",
      lead: "Klicke auf einen Knoten für Übersetzung, Erklärung und Beispiele.",
      panel:
        "Zum Verbstamm nur die zugehörigen Ableitungen – alle mit dem gewählten Verb verbunden.",
      singular: "Verb",
      listTitle: "Liste – Verben",
      listHint: "Klicke auf ein Verb für die Karte mit Stamm und Ableitungen.",
      footer: "Grammatik – Präfixverben"
    },
    nomen: {
      title: "Präfixnomen",
      lead: "Klicke auf einen Knoten für Übersetzung, Erklärung und Beispiele.",
      panel:
        "Zum Basisverb nur die zugehörigen nominalisierten Formen – alle mit demselben Stamm verbunden.",
      singular: "Nomen",
      listTitle: "Liste – Nomen",
      listHint: "Klicke auf ein Basisverb für die Karte mit nominalisierten Formen.",
      footer: "Grammatik – Präfixnomen"
    }
  };

  const normalizeEntries = (data, baseVerb) => {
    const words = Array.isArray(data.words) ? data.words : [];
    let entries = words.map((e, i) => normalizeEntry(e, i)).filter((entry) => entry.word);
    if (baseVerb) {
      entries = entries.filter(
        (e) => String(e.baseVerb || "").toLowerCase() === String(baseVerb).toLowerCase()
      );
    }
    return entries;
  };

  const applyReadyState = () => {
    document.body.classList.remove("no-js");
    requestAnimationFrame(() => document.body.classList.add("is-ready"));
  };

  const setViewVisibility = (showDetail) => {
    if (listHeroView) listHeroView.hidden = showDetail;
    if (listSectionView) listSectionView.hidden = showDetail;
    if (detailHeroView) detailHeroView.hidden = !showDetail;
    if (detailSectionView) detailSectionView.hidden = !showDetail;
    if (navBackLink) navBackLink.classList.toggle("nav-link-hidden", !showDetail);
  };

  setViewVisibility(isDetailView);

  const updateFooter = (mode) => {
    const labels = modeLabels[mode] || modeLabels.verben;
    if (footerLabel) footerLabel.textContent = labels.footer;
  };

  const loadDatasets = () =>
    fetch("verben-mit-praepositionen.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((verbsData) =>
        fetch("nomen-mit-praepositionen.json", { cache: "no-store" })
          .then((r) => r.json())
          .then((nounsData) => ({ verbsData, nounsData }))
      );

  loadDatasets()
    .then(({ verbsData, nounsData }) => {
      if (!isDetailView) {
        setViewVisibility(false);

        if (!listEl) {
          applyReadyState();
          return;
        }

        let mode = requestedMode;
        const datasets = { verben: verbsData, nomen: nounsData };

        const applyListModeUI = () => {
          const labels = modeLabels[mode] || modeLabels.verben;
          if (listTitle) listTitle.textContent = labels.listTitle;
          if (listHint) listHint.textContent = labels.listHint;
          if (searchInput) searchInput.placeholder = labels.singular + " suchen …";
          document.title = "TELC Grammatik – " + labels.title;
          updateFooter(mode);

          if (listModeSwitch) {
            listModeSwitch.querySelectorAll("[data-modus]").forEach((btn) => {
              btn.classList.toggle("is-active", btn.dataset.modus === mode);
            });
          }
        };

        const filterList = () => {
          const q = ((searchInput && searchInput.value) || "").trim().toLowerCase();
          listEl.querySelectorAll(".verben-liste-chip").forEach((el) => {
            const term = (el.dataset.term || "").toLowerCase();
            el.classList.toggle("is-hidden", q && !term.includes(q));
          });
        };

        const renderList = () => {
          const data = datasets[mode];
          if (!data) return;
          const baseVerbs = getBaseVerbs(data);
          listEl.innerHTML = "";

          baseVerbs.forEach((baseVerb) => {
            const a = document.createElement("a");
            const query = new URLSearchParams();
            query.set("verb", baseVerb);
            if (mode === "nomen") query.set("modus", "nomen");
            a.className = "verben-liste-chip";
            a.href = "index.html?" + query.toString();
            a.textContent = baseVerb;
            a.dataset.term = baseVerb;
            listEl.appendChild(a);
          });

          if (!baseVerbs.length) {
            listEl.innerHTML = '<p class="doc" style="color:var(--ink-700); margin:0;">Keine Einträge gefunden.</p>';
          }

          filterList();
        };

        const setListMode = (nextMode) => {
          if (!datasets[nextMode]) return;
          mode = nextMode;
          const nextParams = new URLSearchParams(location.search);
          if (mode === "nomen") nextParams.set("modus", "nomen");
          else nextParams.delete("modus");
          nextParams.delete("verb");
          const nextQuery = nextParams.toString();
          history.replaceState({}, "", location.pathname + (nextQuery ? "?" + nextQuery : ""));
          applyListModeUI();
          renderList();
        };

        applyListModeUI();
        renderList();

        if (listModeSwitch) {
          listModeSwitch.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const btn = target.closest("[data-modus]");
            if (!btn) return;
            setListMode(btn.dataset.modus === "nomen" ? "nomen" : "verben");
          });
        }

        if (searchInput) searchInput.addEventListener("input", filterList);
        applyReadyState();
        return;
      }

      setViewVisibility(true);
      if (container) {
        container.innerHTML = "";
        container.removeAttribute("aria-busy");
      }

      const verbEntries = normalizeEntries(verbsData, verbParam);
      const nomenEntries = normalizeEntries(nounsData, verbParam);
      const hasVerbEntries = verbEntries.length > 0;
      const hasNomenEntries = nomenEntries.length > 0;

      let activeMode = requestedMode;
      if (activeMode === "nomen" && !hasNomenEntries && hasVerbEntries) activeMode = "verben";
      if (activeMode === "verben" && !hasVerbEntries && hasNomenEntries) activeMode = "nomen";

      const nextParams = new URLSearchParams(location.search);
      nextParams.set("verb", verbParam || "");
      if (activeMode === "nomen") nextParams.set("modus", "nomen");
      else nextParams.delete("modus");
      const nextQuery = nextParams.toString();
      history.replaceState({}, "", location.pathname + (nextQuery ? "?" + nextQuery : ""));

      const updateBackLinks = (mode) => {
        const backParams = new URLSearchParams();
        if (mode === "nomen") backParams.set("modus", "nomen");
        const suffix = backParams.toString();
        const href = "index.html" + (suffix ? "?" + suffix : "");
        if (navBackLink) {
          navBackLink.href = href;
          navBackLink.textContent = mode === "nomen" ? "← Präfixnomen – Liste" : "← Präfixverben – Liste";
        }
        if (panelBackLink) panelBackLink.href = href;
      };

      const updateHeader = (mode) => {
        const labels = modeLabels[mode] || modeLabels.verben;
        if (titleEl) titleEl.textContent = labels.title + (verbParam ? " – " + verbParam : "");
        if (leadEl) leadEl.textContent = labels.lead;
        if (panelTextEl) panelTextEl.textContent = labels.panel;
        document.title = "TELC Grammatik – " + labels.title + (verbParam ? " – " + verbParam : "");
        updateFooter(mode);
      };

      const createModeUrl = (mode) => {
        const next = new URLSearchParams(location.search);
        next.set("verb", verbParam || "");
        if (mode === "nomen") next.set("modus", "nomen");
        else next.delete("modus");
        const query = next.toString();
        return "index.html" + (query ? "?" + query : "");
      };

      const updateDetailModeSwitch = (mode) => {
        if (!detailModeSwitchEl) return;
        detailModeSwitchEl.innerHTML = "";

        const options = [];
        if (hasVerbEntries || mode === "verben") options.push("verben");
        if (hasNomenEntries || mode === "nomen") options.push("nomen");

        if (options.length < 2) {
          detailModeSwitchEl.style.display = "none";
          return;
        }

        detailModeSwitchEl.style.display = "inline-flex";
        options.forEach((opt) => {
          const link = document.createElement("a");
          link.className = "btn ghost" + (opt === mode ? " is-active" : "");
          link.href = createModeUrl(opt);
          link.textContent = opt === "nomen" ? "Nomen" : "Verben";
          link.setAttribute("aria-current", opt === mode ? "page" : "false");
          detailModeSwitchEl.appendChild(link);
        });
      };

      updateHeader(activeMode);
      updateBackLinks(activeMode);
      updateDetailModeSwitch(activeMode);

      const entries = activeMode === "nomen" ? nomenEntries : verbEntries;
      if (container) {
        if (entries.length === 0) {
          const singular = modeLabels[activeMode] ? modeLabels[activeMode].singular : "Eintrag";
          container.innerHTML =
            "<p class=\"doc\">Noch keine Einträge für das " +
            singular +
            " „" +
            (verbParam || "") +
            "“.</p>";
        } else {
          buildEther(container, entries, verbParam || null, { mode: activeMode });
        }
      }

      applyReadyState();
    })
    .catch(() => {
      if (isDetailView && container) {
        setViewVisibility(true);
        container.removeAttribute("aria-busy");
        container.innerHTML = "<p>Die Einträge konnten nicht geladen werden.</p>";
      }
      if (!isDetailView && listEl) {
        listEl.innerHTML = "<p class=\"doc\">Die Liste konnte nicht geladen werden.</p>";
      }
      applyReadyState();
    });
});
