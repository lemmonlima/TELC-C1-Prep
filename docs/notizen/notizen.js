let explanationsData = {};

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
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
    article: "explanation-highlight-artikel",
    pronomen: "explanation-highlight-pronomen",
    pronoun: "explanation-highlight-pronomen",
    adverb: "explanation-highlight-adverb",
    präposition: "explanation-highlight-praeposition",
    preposition: "explanation-highlight-praeposition",
    konjunktion: "explanation-highlight-konjunktion",
    conjunction: "explanation-highlight-konjunktion",
    subjunktion: "explanation-highlight-subjunktion",
    subjunction: "explanation-highlight-subjunktion",
    partikel: "explanation-highlight-partikel",
    particle: "explanation-highlight-partikel"
  };
  return typeMap[typeLower] || "explanation-highlight";
}

function getHighlightClass(data) {
  if (!data || !data.type) return "explanation-highlight";
  const type = data.type.toLowerCase();
  if (type === "phrase" || type === "compound") return "explanation-highlight";
  return getHighlightClassForType(type);
}

function getWordTypeClass(data) {
  if (!data || !data.type) return "explanation-word-default";
  const type = data.type.toLowerCase();
  if (type === "phrase" || type === "compound") return "explanation-word-default";
  const typeMap = {
    verb: "explanation-word-verb",
    nomen: "explanation-word-nomen",
    noun: "explanation-word-nomen",
    adjektiv: "explanation-word-adj",
    adjective: "explanation-word-adj",
    artikel: "explanation-word-artikel",
    article: "explanation-word-artikel",
    pronomen: "explanation-word-pronomen",
    pronoun: "explanation-word-pronomen",
    adverb: "explanation-word-adverb",
    präposition: "explanation-word-praeposition",
    preposition: "explanation-word-praeposition",
    konjunktion: "explanation-word-konjunktion",
    conjunction: "explanation-word-konjunktion",
    subjunktion: "explanation-word-subjunktion",
    subjunction: "explanation-word-subjunktion",
    partikel: "explanation-word-partikel",
    particle: "explanation-word-partikel"
  };
  return typeMap[type] || "explanation-word-default";
}

function colorWordsInExplanation(explanation, components) {
  if (!explanation || !components || components.length === 0) return escapeHtml(explanation);
  let result = explanation;
  const sorted = [...components].sort((a, b) => b.word.length - a.word.length);
  sorted.forEach((c) => {
    const escaped = c.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(['"]?)(${escaped})(['"]?)`, "gi");
    result = result.replace(re, (_, q1, m, q2) => {
      if (m.includes("<span")) return _;
      return (q1 || "") + `<span class="${getHighlightClassForType(c.type)}">${escapeHtml(m)}</span>` + (q2 || "");
    });
  });
  const parts = result.split(/(<span[^>]*>.*?<\/span>)/g);
  return parts.map((p) => (p.startsWith("<span") ? p : escapeHtml(p))).join("");
}

function highlightWordInSentence(sentence, word, parts, markedText, data) {
  let highlighted = sentence;
  const highlightClass = getHighlightClass(data);
  let markedDone = false;
  if (markedText && markedText.trim().includes(" ")) {
    const escaped = markedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    highlighted = highlighted.replace(new RegExp(`(${escaped})`, "gi"), (m) => {
      if (m.includes("explanation-highlight")) return m;
      markedDone = true;
      return `<span class="${highlightClass}">${m}</span>`;
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
        return `<span class="${highlightClass}">${p1}</span>`;
      });
    });
  }
  if (markedText && !markedText.trim().includes(" ")) {
    const escaped = markedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    highlighted = highlighted.replace(new RegExp(`\\b(${escaped})\\b`, "gi"), (m) => {
      if (m.includes("explanation-highlight")) return m;
      return `<span class="${highlightClass}">${m}</span>`;
    });
  }
  if (!parts && !markedText) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    highlighted = highlighted.replace(new RegExp(`\\b(${escaped})\\b`, "gi"), `<span class="${highlightClass}">$1</span>`);
  }
  return highlighted;
}

function normalizeParts(parts) {
  if (!Array.isArray(parts)) return null;
  const cleaned = parts
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);
  return cleaned.length ? cleaned : null;
}

function shouldHighlight(data) {
  if (!data) return false;
  const parts = normalizeParts(data.parts);
  if (parts && parts.length) return true;
  const word = typeof data.word === "string" ? data.word.trim() : "";
  if (!word) return false;
  const type = String(data.type || "").toLowerCase();
  if (type === "phrase") return false;
  return true;
}

function renderHighlightedText(text, data) {
  if (!text) return "";
  if (!shouldHighlight(data)) return escapeHtml(text);
  const parts = normalizeParts(data.parts);
  const word = typeof data.word === "string" ? data.word.trim() : "";
  const type = String(data.type || "").toLowerCase();
  const markedText = type === "phrase" && parts ? "" : word;
  return highlightWordInSentence(text, word, parts, markedText, data);
}

function isHighlightElement(el) {
  if (!el || !el.classList) return false;
  for (const cls of el.classList) {
    if (cls.startsWith("explanation-highlight")) return true;
  }
  return false;
}

function wrapTextMatches(root, target, highlightClass, allowPartial) {
  if (!target) return;
  const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = allowPartial ? new RegExp(`(${escaped})`, "gi") : new RegExp(`\\b(${escaped})\\b`, "gi");
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      let current = node.parentElement;
      while (current) {
        if (isHighlightElement(current)) return NodeFilter.FILTER_REJECT;
        current = current.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const value = node.nodeValue;
    re.lastIndex = 0;
    if (!re.test(value)) return;
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    value.replace(re, (match, _m, offset) => {
      if (offset > lastIndex) frag.appendChild(document.createTextNode(value.slice(lastIndex, offset)));
      const span = document.createElement("span");
      span.className = highlightClass;
      span.textContent = match;
      frag.appendChild(span);
      lastIndex = offset + match.length;
      return match;
    });
    if (lastIndex < value.length) frag.appendChild(document.createTextNode(value.slice(lastIndex)));
    node.parentNode.replaceChild(frag, node);
  });
}

function highlightTextInElement(element, data) {
  if (!element || !shouldHighlight(data)) return;
  const parts = normalizeParts(data.parts) || [];
  const word = typeof data.word === "string" ? data.word.trim() : "";
  const type = String(data.type || "").toLowerCase();
  const highlightClass = getHighlightClass(data);
  const targets = [];

  if (type !== "phrase" && word) {
    if (word.includes(" ")) targets.push(word);
  }
  if (parts.length) {
    parts.forEach((part) => {
      if (!targets.includes(part)) targets.push(part);
    });
  }
  if (type !== "phrase" && word && !word.includes(" ")) {
    if (!targets.includes(word)) targets.push(word);
  }

  targets.forEach((target) => {
    wrapTextMatches(element, target, highlightClass, target.includes(" "));
  });
}

function parseExample(ex) {
  if (typeof ex === "object" && ex !== null && "example" in ex && "translation" in ex) {
    return { example: ex.example, translation: ex.translation };
  }
  if (typeof ex === "string") {
    const idx = ex.indexOf(" = ");
    if (idx !== -1) return { example: ex.slice(0, idx).trim(), translation: ex.slice(idx + 3).trim() };
    return { example: ex, translation: "" };
  }
  return { example: String(ex), translation: "" };
}

function renderExamplesTable(examples, data) {
  if (!examples || examples.length === 0) return "";
  const rows = examples.map((ex) => {
    const { example, translation } = parseExample(ex);
    const exampleHtml = renderHighlightedText(example, data);
    return `<tr><td class="examples-cell-example">${exampleHtml}</td><td class="examples-cell-translation">${escapeHtml(translation)}</td></tr>`;
  }).join("");
  return `<div class="explanation-section"><p class="explanation-label">Ejemplos:</p><table class="examples-table"><thead><tr><th scope="col">Ejemplo</th><th scope="col">Traducción</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function getTypeNameInGerman(type) {
  const map = { verb: "Verb", nomen: "Nomen", noun: "Nomen", adjektiv: "Adjektiv", adjective: "Adjektiv", artikel: "Artikel", article: "Artikel", pronomen: "Pronomen", pronoun: "Pronomen", adverb: "Adverb", präposition: "Präposition", preposition: "Präposition", konjunktion: "Konjunktion", conjunction: "Konjunktion", subjunktion: "Subjunktion", subjunction: "Subjunktion", partikel: "Partikel", particle: "Partikel" };
  return map[String(type).toLowerCase()] || type;
}

function getVerbCharacteristics(verbType) {
  if (!verbType) return null;
  const out = [];
  const t = verbType.toLowerCase();
  if (t.includes("untrennbar") || t.includes("inseparable")) out.push("Untrennbar (inseparable)");
  else if (t.includes("separable") || t.includes("trennbar")) out.push("Trennbar (separable)");
  if (t.includes("modal")) out.push("Modalverb (verbo modal)");
  if (t.includes("reflexive") || t.includes("reflexiv")) out.push("Reflexiv (reflexivo)");
  if (t.includes("auxiliary") || t.includes("auxiliar")) out.push("Mit Hilfsverb (con verbo auxiliar)");
  if (t.includes("compound") && !t.includes("auxiliary")) out.push("Zusammengesetzt (compuesto)");
  return out.length ? out : null;
}

function renderExplanationDetails(data) {
  const isPhrase = data.type && data.type.toLowerCase() === "phrase";
  if (isPhrase) {
    let html = "";
    if (data.explanation) html += `<div class="explanation-section"><p class="explanation-label">Explicación:</p><p>${escapeHtml(data.explanation)}</p></div>`;
    if (data.examples && data.examples.length > 0) {
      html += renderExamplesTable(data.examples, data);
    }
    return html;
  }

  let html = "";
  if (data.explanation) html += `<div class="explanation-section"><p class="explanation-label">Explicación:</p><p>${escapeHtml(data.explanation)}</p></div>`;
  if (data.type && (data.type.toLowerCase() === "nomen" || data.type.toLowerCase() === "noun")) {
    if (data.gender || data.case || data.singular || data.plural) {
      html += `<div class="explanation-section"><p class="explanation-label">Información nominal:</p><ul>`;
      if (data.gender) html += `<li><strong>Género:</strong> ${escapeHtml(data.gender)}</li>`;
      if (data.case) html += `<li><strong>Caso en la oración:</strong> ${escapeHtml(data.case)}</li>`;
      if (data.singular || data.plural) html += `<li><strong>Formas:</strong> ${escapeHtml(data.singular || "")}${data.singular && data.plural ? " / " : ""}${escapeHtml(data.plural || "")}</li>`;
      html += `</ul></div>`;
    }
  }
  if (data.type && data.type.toLowerCase() === "verb") {
    const chars = getVerbCharacteristics(data.verbType);
    if (chars && chars.length) {
      html += `<div class="explanation-section"><p class="explanation-label">Tipo de verbo:</p><ul>`;
      chars.forEach((c) => { html += `<li>${escapeHtml(c)}</li>`; });
      html += `</ul></div>`;
    }
  }
  if (data.examples && data.examples.length > 0) {
    html += renderExamplesTable(data.examples, data);
  }
  if (data.conjugation) {
    html += `<div class="explanation-section"><p class="explanation-label">Conjugación:</p>`;
    const hasTable = data.conjugation.present && typeof data.conjugation.present === "object";
    if (hasTable) {
      const pronouns = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
      const tenses = [];
      if (data.conjugation.present) tenses.push({ name: "Präsens", data: data.conjugation.present });
      if (data.conjugation.preterite) tenses.push({ name: "Präteritum", data: data.conjugation.preterite });
      if (data.conjugation.indirekteRede) tenses.push({ name: "Indirekte Rede", data: data.conjugation.indirekteRede });
      if (tenses.length) {
        html += `<table class="conjugation-table"><thead><tr><th>Person</th>`;
        tenses.forEach((tense) => { html += `<th>${escapeHtml(tense.name)}</th>`; });
        html += `</tr></thead><tbody>`;
        pronouns.forEach((pronoun) => {
          html += `<tr><td class="conjugation-pronoun">${escapeHtml(pronoun)}</td>`;
          tenses.forEach((tense) => {
            let form = tense.data[pronoun];
            if (!form && pronoun === "sie/Sie") form = tense.data["sie"] || tense.data["Sie"];
            html += `<td>${escapeHtml(form || "")}</td>`;
          });
          html += `</tr>`;
        });
        html += `</tbody></table>`;
      }
      if (data.conjugation.perfect || data.conjugation.infinitive) {
        html += `<div class="conjugation-extra">`;
        if (data.conjugation.perfect) html += `<p><strong>Perfekt:</strong> ${escapeHtml(data.conjugation.perfect)}</p>`;
        if (data.conjugation.infinitive) html += `<p><strong>Infinitiv:</strong> ${escapeHtml(data.conjugation.infinitive)}</p>`;
        html += `</div>`;
      }
    } else {
      html += `<ul>`;
      if (data.conjugation.present) html += `<li><strong>Presente:</strong> ${escapeHtml(data.conjugation.present)}</li>`;
      if (data.conjugation.preterite) html += `<li><strong>Pretérito:</strong> ${escapeHtml(data.conjugation.preterite)}</li>`;
      if (data.conjugation.perfect) html += `<li><strong>Perfecto:</strong> ${escapeHtml(data.conjugation.perfect)}</li>`;
      if (data.conjugation.infinitive) html += `<li><strong>Infinitivo:</strong> ${escapeHtml(data.conjugation.infinitive)}</li>`;
      html += `</ul>`;
    }
    html += `</div>`;
  }
  if (data.baseForm) html += `<div class="explanation-section"><p class="explanation-label">Forma base:</p><p>${escapeHtml(data.baseForm)}</p></div>`;
  if (data.synonyms && data.synonyms.length) {
    html += `<div class="explanation-section"><p class="explanation-label">Sinónimos:</p><ul>`;
    data.synonyms.forEach((s) => { html += `<li>${escapeHtml(s)}</li>`; });
    html += `</ul></div>`;
  }
  if (data.antonyms && data.antonyms.length) {
    html += `<div class="explanation-section"><p class="explanation-label">Antónimos:</p><ul>`;
    data.antonyms.forEach((a) => { html += `<li>${escapeHtml(a)}</li>`; });
    html += `</ul></div>`;
  }
  if (data.type) html += `<div class="explanation-section"><p class="explanation-label">Tipo:</p><p>${escapeHtml(data.type)}</p></div>`;
  return html;
}

function renderInlineExplanation(id) {
  const data = explanationsData[id];
  if (!data) return "";
  let html = `<div class="explanation-translation"><p class="explanation-label">Traducción:</p><p>${escapeHtml(data.translation || "")}</p></div>`;
  if (data.erklärung) html += `<div class="explanation-section"><p class="explanation-label">Erklärung (DE):</p><p>${escapeHtml(data.erklärung)}</p></div>`;
  html += renderExplanationDetails(data);
  return html;
}

function renderItemText(text) {
  if (typeof formatInline !== "function") return escapeHtml(text);
  return formatInline(text || "");
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("doc-content");
  if (!container) return;
  container.innerHTML = "";
  container.removeAttribute("aria-busy");

  Promise.all([
    fetch("notizen.json").then((r) => r.json()),
    fetch("notizen-explanations.json", { cache: "no-store" }).then((r) => r.json())
  ])
    .then(([listData, explData]) => {
      explanationsData = explData;
      container.innerHTML = "";
      const list = document.createElement("ul");
      list.className = "notizen-list";

      (listData.items || []).forEach((item) => {
        const li = document.createElement("li");
        li.className = "notizen-item";
        if (item.explanationId) {
          li.classList.add("notizen-item-clickable");
        }
        const textEl = document.createElement("span");
        textEl.className = "notizen-text";
        textEl.innerHTML = renderItemText(item.text || "");
        li.appendChild(textEl);
        if (item.explanationId && explanationsData[item.explanationId]) {
          highlightTextInElement(textEl, explanationsData[item.explanationId]);
        }
        if (item.note) {
          const noteEl = document.createElement("span");
          noteEl.className = "notizen-note";
          noteEl.textContent = item.note;
          li.appendChild(noteEl);
        }
        if (item.explanationId) {
          const inlineEl = document.createElement("div");
          inlineEl.className = "notizen-explanation";
          inlineEl.innerHTML = renderInlineExplanation(item.explanationId);
          li.appendChild(inlineEl);
        }
        list.appendChild(li);
      });

      container.appendChild(list);

      list.querySelectorAll(".notizen-item-clickable").forEach((li) => {
        li.addEventListener("click", (e) => {
          e.preventDefault();
          const explanationEl = li.querySelector(".notizen-explanation");
          if (explanationEl) explanationEl.classList.toggle("is-open");
        });
      });

      document.body.classList.remove("no-js");
      requestAnimationFrame(() => document.body.classList.add("is-ready"));
    })
    .catch(() => {
      container.innerHTML = "<p>Die Notizen konnten nicht geladen werden.</p>";
      document.body.classList.remove("no-js");
      requestAnimationFrame(() => document.body.classList.add("is-ready"));
    });
});
