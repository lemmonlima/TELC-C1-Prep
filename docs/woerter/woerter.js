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

function highlightWordInSentence(sentence, word, parts, markedText, entry) {
  let highlighted = sentence;
  const highlightClass = getHighlightClass(entry);
  let markedDone = false;
  if (markedText && markedText.trim().includes(" ")) {
    const escaped = markedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    highlighted = highlighted.replace(new RegExp(`(${escaped})`, "gi"), (m) => {
      if (m.includes("explanation-highlight")) return m;
      markedDone = true;
      return `<span class=\"${highlightClass}\">${m}</span>`;
    });
  }
  if (parts && parts.length > 0) {
    [...parts].reverse().forEach((part) => {
      if (markedDone && markedText && markedText.includes(part.trim())) return;
      const escaped = part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const hasSpaces = part.trim().includes(" ");
      const re = hasSpaces ? new RegExp(`(${escaped})`, "gi") : new RegExp(`\\b(${escaped})\\b`, "gi");
      highlighted = highlighted.replace(re, (_, p1) => {
        if (_.includes("explanation-highlight")) return _;
        return `<span class=\"${highlightClass}\">${p1}</span>`;
      });
    });
  }
  if (markedText && !markedText.trim().includes(" ")) {
    const escaped = markedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    highlighted = highlighted.replace(new RegExp(`\\b(${escaped})\\b`, "gi"), (m) => {
      if (m.includes("explanation-highlight")) return m;
      return `<span class=\"${highlightClass}\">${m}</span>`;
    });
  }
  if (!parts && !markedText) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    highlighted = highlighted.replace(new RegExp(`\\b(${escaped})\\b`, "gi"), `<span class=\"${highlightClass}\">$1</span>`);
  }
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
    return `<div class=\"explanation-section\"><p class=\"explanation-label\">Ejemplos:</p><p class=\"woerter-panel-empty\">Sin ejemplos todavía.</p></div>`;
  }
  const rows = examples
    .map((ex) => {
      const { example, translation } = parseExample(ex);
      const exampleHtml = renderHighlightedText(example, entry);
      return `<tr><td class=\"examples-cell-example\">${exampleHtml}</td><td class=\"examples-cell-translation\">${escapeHtml(translation)}</td></tr>`;
    })
    .join("");
  return `<div class=\"explanation-section\"><p class=\"explanation-label\">Ejemplos:</p><table class=\"examples-table\"><thead><tr><th scope=\"col\">Ejemplo</th><th scope=\"col\">Traducción</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function normalizeEntry(raw, index) {
  if (typeof raw === "string") {
return {
    id: slugify(raw) || `woerter-${index}`,
    word: raw,
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
    translation: raw.translation || "",
    explanation: raw.explanation || "",
    erklärung: raw.erklärung || "",
    examples: Array.isArray(raw.examples) ? raw.examples : [],
    type: raw.type || "",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    parts: raw.parts
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
      Haz clic en una palabra para ver traducción, explicación y ejemplos.
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
        <button class=\"woerter-panel-back\" type=\"button\" data-action=\"back\">Volver al nodo</button>
      </div>
    </div>
    <div class=\"explanation-section\">
      <p class=\"explanation-label\">Traducción:</p>
      <p class=\"woerter-panel-translation\">${escapeHtml(entry.translation || "Sin traducción todavía.")}</p>
    </div>
  `;
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
        <p class=\"explanation-label\">Explicación:</p>
        <p>${escapeHtml(entry.explanation)}</p>
      </div>
    `;
  }
  html += renderExamplesTable(entry.examples, entry);
  if (entry.tags && entry.tags.length) {
    const tags = entry.tags
      .map((tag) => `<span class=\"woerter-tag\">${escapeHtml(tag)}</span>`)
      .join("");
    html += `
      <div class=\"explanation-section\">
        <p class=\"explanation-label\">Claves:</p>
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
  allButton.textContent = "Todas";
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
        let force = 1200 / distSq;
        if (dist < MIN_NODE_DIST && dist > 1) {
          force = Math.max(force, 4500 / distSq);
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
      const desired = 90 + (1 - edge.weight) * 140;
      const spring = (dist - desired) * (0.002 + edge.weight * 0.004);
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
      node.ax += (centerX - node.x) * 0.0006;
      node.ay += (centerY - node.y) * 0.0006;
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

function buildEther(container, entries) {
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
  searchLabel.textContent = "Buscar";
  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.id = "woerter-search";
  searchInput.className = "woerter-search-input";
  searchInput.placeholder = "Buscar palabra, traducción o etiqueta";
  searchWrap.appendChild(searchLabel);
  searchWrap.appendChild(searchInput);

  const filterWrap = document.createElement("div");
  filterWrap.className = "woerter-filters";

  controlsBody.appendChild(searchWrap);
  controlsBody.appendChild(filterWrap);

  controls.appendChild(controlsBody);

  const stage = document.createElement("div");
  stage.className = "woerter-ether-stage";

  const isTouchDevice = "ontouchstart" in window;
  if (isTouchDevice) stage.classList.add("woerter-ether-stage--touch");

  const hint = document.createElement("div");
  hint.className = "woerter-ether-hint";
  hint.textContent = isTouchDevice ? "Arrastra para moverte por el mapa" : "Arrastra para moverte · Rueda para zoom";

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
    draggingNode: null
  };

  const getWorldPoint = (event) => {
    const rect = stage.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - state.view.panX) / state.view.zoom,
      y: (event.clientY - rect.top - state.view.panY) / state.view.zoom
    };
  };

  // Callback para seleccionar un nodo (compartido con list-view)
  const handleNodeSelect = (nodeData) => {
    const isSameNode = state.lastNode && state.lastNode.id === nodeData.id;
    state.nodes.forEach((node) => node.el.classList.remove("is-active"));
    if (isSameNode) {
      state.lastNode = null;
      createPanelEmpty(panel);
      return;
    }
    if (nodeData.el && nodeData.el.classList) {
      nodeData.el.classList.add("is-active");
    }
    state.lastNode = nodeData;
    state.lastScrollY = window.scrollY || 0;
    renderPanel(nodeData.entry, panel);
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nodes = buildNodes(entries, nodesLayer, handleNodeSelect);
  state.nodes = nodes;
  
  // Exponer para list-view.js
  window.etherEntries = entries;
  window.etherOnSelect = handleNodeSelect;

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
  const types = Array.from(new Set(entries.map((entry) => String(entry.type || "").toLowerCase()).filter(Boolean)));
  seedPositions(state, types.length ? types : ["base"]);

  const edges = createEdges(nodes, svg);
  state.edges = edges;

  const { activeTypes } = buildTypeFilters(entries, filterWrap, () => {
    applyFilters(state, searchInput.value, activeTypes, null);
  });

  applyFilters(state, "", activeTypes, null);
  createPanelEmpty(panel);
  applyView(state);
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
    const rect = stage.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
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
  const container = document.getElementById("woerter-content");
  if (!container) return;
  container.innerHTML = "";
  container.removeAttribute("aria-busy");

  fetch("woerter.json", { cache: "no-store" })
    .then((r) => r.json())
    .then((data) => {
      const words = Array.isArray(data.words) ? data.words : [];
      const entries = words.map(normalizeEntry).filter((entry) => entry.word);
      buildEther(container, entries);
      document.body.classList.remove("no-js");
      requestAnimationFrame(() => document.body.classList.add("is-ready"));
    })
    .catch(() => {
      container.innerHTML = "<p>Die Wörter konnten nicht geladen werden.</p>";
      container.removeAttribute("aria-busy");
      document.body.classList.remove("no-js");
      requestAnimationFrame(() => document.body.classList.add("is-ready"));
    });
});
