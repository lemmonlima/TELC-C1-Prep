const state = {
  items: [],
  currentItems: [],
  pools: {
    prepositions: [],
    definiteArticles: ["der", "die", "das", "den", "dem", "des"],
    indefiniteArticles: ["ein", "eine", "einen", "einem", "eines", "einer"],
    kein: ["kein", "keine", "keinen", "keinem", "keines", "keiner"],
    possessive: {
      mein: ["mein", "meine", "meinen", "meinem", "meines", "meiner"],
      dein: ["dein", "deine", "deinen", "deinem", "deines", "deiner"],
      sein: ["sein", "seine", "seinen", "seinem", "seines", "seiner"],
      ihr: ["ihr", "ihre", "ihren", "ihrem", "ihres", "ihrer"],
      unser: ["unser", "unsere", "unseren", "unserem", "unseres", "unserer"],
      euer: ["euer", "eure", "euren", "eurem", "eures", "eurer"]
    },
    adjectives: {}
  }
};

let exerciseContent;
let exerciseHeader;
let exerciseList;
let exerciseCheck;
let exerciseReset;

// Preposiciones comunes en alemán
const commonPrepositions = [
  "an", "auf", "aus", "bei", "durch", "für", "gegen", "in", "mit", "nach",
  "über", "um", "unter", "von", "vor", "zu", "zwischen", "seit", "trotz",
  "während", "wegen", "ohne", "außer", "bis", "entlang", "gegenüber"
];

// Declinaciones de adjetivos
const adjectiveDeclensions = {
  strong: {
    mask: { nom: "er", akk: "en", dat: "em", gen: "en" },
    fem: { nom: "e", akk: "e", dat: "er", gen: "er" },
    neut: { nom: "es", akk: "es", dat: "em", gen: "en" },
    plural: { nom: "e", akk: "e", dat: "en", gen: "er" }
  },
  weak: {
    mask: { nom: "e", akk: "en", dat: "en", gen: "en" },
    fem: { nom: "e", akk: "e", dat: "en", gen: "en" },
    neut: { nom: "e", akk: "e", dat: "en", gen: "en" },
    plural: { nom: "en", akk: "en", dat: "en", gen: "en" }
  },
  mixed: {
    mask: { nom: "er", akk: "en", dat: "en", gen: "en" },
    fem: { nom: "e", akk: "e", dat: "en", gen: "en" },
    neut: { nom: "es", akk: "es", dat: "en", gen: "en" },
    plural: { nom: "en", akk: "en", dat: "en", gen: "en" }
  }
};

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeOption(value) {
  return value.trim().toLowerCase();
}

function shuffle(list) {
  const array = list.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildOptions(correct, pool, fallback = []) {
  const options = new Set([normalizeOption(correct)]);
  shuffle(pool).forEach((item) => {
    const normalized = normalizeOption(item);
    if (options.size < 4 && normalized !== normalizeOption(correct)) {
      options.add(normalized);
    }
  });
  if (options.size < 4) {
    shuffle(fallback).forEach((item) => {
      const normalized = normalizeOption(item);
      if (options.size < 4 && normalized !== normalizeOption(correct)) {
        options.add(normalized);
      }
    });
  }
  return shuffle(Array.from(options));
}

function renderSelect(correct, pool, fallback) {
  const options = buildOptions(correct, pool, fallback);
  const optionHtml = options
    .map((option) => {
      const isCorrect = normalizeOption(option) === normalizeOption(correct);
      return `<option value="${escapeHtml(option)}" ${isCorrect ? 'data-correct="true"' : ''}>${escapeHtml(option)}</option>`;
    })
    .join("");
  
  return `
    <span class="test-blank">
      <select class="test-select" data-answer="${escapeHtml(correct)}">
        <option value="" selected disabled hidden>—</option>
        ${optionHtml}
      </select>
    </span>
  `;
}

function identifyElementType(word) {
  const normalized = normalizeOption(word);
  
  // Nomen (sustantivos) empiezan con mayúscula en alemán - NO deben tener dropdown
  if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
    const isKnownWord = commonPrepositions.includes(normalized) ||
                       state.pools.definiteArticles.includes(normalized) ||
                       state.pools.indefiniteArticles.includes(normalized);
    
    if (!isKnownWord) {
      return null;
    }
  }
  
  // Preposiciones
  if (commonPrepositions.includes(normalized)) {
    return { type: "preposition", value: word };
  }
  
  // Artículos definidos
  if (state.pools.definiteArticles.includes(normalized)) {
    return { type: "definiteArticle", value: word };
  }
  
  // Artículos indefinidos
  if (state.pools.indefiniteArticles.includes(normalized)) {
    return { type: "indefiniteArticle", value: word };
  }
  
  // kein
  if (state.pools.kein.includes(normalized)) {
    return { type: "kein", value: word };
  }
  
  // Posesivos
  for (const [base, forms] of Object.entries(state.pools.possessive)) {
    if (forms.includes(normalized)) {
      return { type: "possessive", base: base, value: word };
    }
  }
  
  // Adjetivos
  const adjEndings = /(e|er|es|en|em)$/;
  if (adjEndings.test(normalized) && normalized.length > 2) {
    const isArticle = state.pools.definiteArticles.includes(normalized) ||
                     state.pools.indefiniteArticles.includes(normalized) ||
                     state.pools.kein.includes(normalized);
    
    const isNoun = word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase();
    
    if (!isArticle && !isNoun) {
      let root = normalized;
      const endings = ["er", "es", "en", "em", "e"];
      for (const ending of endings) {
        if (normalized.endsWith(ending) && normalized.length > ending.length) {
          root = normalized.slice(0, -ending.length);
          break;
        }
      }
      if (root.length >= 3) {
        return { type: "adjective", root: root, value: word };
      }
    }
  }
  
  return null;
}

function generateAdjectiveDeclensions(root) {
  const declensions = [];
  for (const declType of Object.values(adjectiveDeclensions)) {
    for (const gender of Object.values(declType)) {
      for (const ending of Object.values(gender)) {
        const form = root + ending;
        if (!declensions.includes(form)) {
          declensions.push(form);
        }
      }
    }
  }
  return declensions;
}

function analyzeGenDatContent(content) {
  const elements = [];
  const words = content.trim().split(/\s+/);
  
  for (const word of words) {
    const identified = identifyElementType(word);
    if (identified) {
      elements.push(identified);
      
      if (identified.type === "adjective") {
        if (!state.pools.adjectives[identified.root]) {
          state.pools.adjectives[identified.root] = generateAdjectiveDeclensions(identified.root);
        }
      }
    } else {
      elements.push({ type: "text", value: word });
    }
  }
  
  return elements;
}

function buildSentence(sentence) {
  let result = sentence;
  let blankCount = 0;
  
  // Buscar tokens {gen:...} y {dat:...}
  const genDatRegex = /\{(gen|dat):([^}]+)\}/g;
  let match;
  const matches = [];
  
  while ((match = genDatRegex.exec(sentence)) !== null) {
    matches.push({
      fullMatch: match[0],
      content: match[2],
      index: match.index
    });
  }
  
  // Reemplazar de atrás hacia adelante
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const analyzed = analyzeGenDatContent(match.content);
    
    let replacementHtml = "";
    for (const element of analyzed) {
      if (element.type === "text") {
        replacementHtml += escapeHtml(element.value) + " ";
      } else {
        blankCount += 1;
        let pool = [];
        let fallback = [];
        
        switch (element.type) {
          case "preposition":
            pool = state.pools.prepositions;
            fallback = commonPrepositions;
            break;
          case "definiteArticle":
            pool = state.pools.definiteArticles;
            fallback = state.pools.definiteArticles;
            break;
          case "indefiniteArticle":
            pool = state.pools.indefiniteArticles;
            fallback = state.pools.indefiniteArticles;
            break;
          case "kein":
            pool = state.pools.kein;
            fallback = state.pools.kein;
            break;
          case "possessive":
            pool = state.pools.possessive[element.base];
            fallback = state.pools.possessive[element.base];
            break;
          case "adjective":
            pool = state.pools.adjectives[element.root] || [];
            fallback = [];
            break;
        }
        
        replacementHtml += renderSelect(element.value, pool, fallback) + " ";
      }
    }
    
    result = result.slice(0, match.index) + replacementHtml.trim() + result.slice(match.index + match.fullMatch.length);
  }
  
  return { html: result, blanks: blankCount };
}

function extractItems(text) {
  const items = [];
  const lines = text.split(/\r?\n/);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detectar items numerados (1. ... o 10. ...)
    const itemMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (itemMatch) {
      const itemNum = itemMatch[1];
      const content = itemMatch[2];
      
      const item = {
        number: parseInt(itemNum, 10),
        original: content,
        type: "dropdown"
      };
      
      items.push(item);
      
      // Analizar contenido para construir pools
      const genDatRegex = /\{(gen|dat):([^}]+)\}/g;
      let match;
      while ((match = genDatRegex.exec(content)) !== null) {
        analyzeGenDatContent(match[2]);
      }
    }
  }
  
  return items;
}

function renderExercise() {
  exerciseHeader.innerHTML = `<h3>8. Setzen Sie, wo es nötig ist, Endungen in die Lücken ein!</h3>`;
  
  exerciseList.innerHTML = "";
  state.currentItems = state.items.map((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "exercise-item";
    itemDiv.dataset.index = index;
    
    const built = buildSentence(item.original);
    itemDiv.innerHTML = `
      <div class="exercise-item-number">${item.number}.</div>
      <div class="exercise-item-content">
        <div class="exercise-original">${built.html}</div>
        <div class="exercise-feedback"></div>
      </div>
    `;
    
    exerciseList.appendChild(itemDiv);
    return itemDiv;
  });
  
  exerciseContent.style.display = "block";
}

function checkExercise() {
  state.currentItems.forEach(itemDiv => {
    const feedback = itemDiv.querySelector(".exercise-feedback");
    const selects = itemDiv.querySelectorAll(".test-select");
    let allCorrect = true;
    let correctCount = 0;
    
    selects.forEach(select => {
      const correctAnswer = select.dataset.answer;
      const userAnswer = select.value;
      
      if (normalizeOption(userAnswer) === normalizeOption(correctAnswer)) {
        select.classList.add("is-correct");
        select.classList.remove("is-wrong");
        correctCount++;
      } else {
        select.classList.add("is-wrong");
        select.classList.remove("is-correct");
        allCorrect = false;
      }
    });
    
    if (allCorrect && correctCount === selects.length) {
      itemDiv.classList.add("is-correct");
      itemDiv.classList.remove("is-wrong");
      feedback.innerHTML = '<span class="feedback-correct">Richtig!</span>';
    } else {
      itemDiv.classList.add("is-wrong");
      itemDiv.classList.remove("is-correct");
      const correctAnswers = Array.from(selects).map(s => s.dataset.answer).join(", ");
      feedback.innerHTML = `<span class="feedback-wrong">Antworten: ${escapeHtml(correctAnswers)}</span>`;
    }
  });
}

function resetExercise() {
  state.currentItems.forEach(itemDiv => {
    const selects = itemDiv.querySelectorAll(".test-select");
    const feedback = itemDiv.querySelector(".exercise-feedback");
    
    selects.forEach(select => {
      select.value = "";
      select.classList.remove("is-correct", "is-wrong");
    });
    
    itemDiv.classList.remove("is-correct", "is-wrong");
    feedback.innerHTML = "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  exerciseContent = document.getElementById("exercise-content");
  exerciseHeader = document.getElementById("exercise-header");
  exerciseList = document.getElementById("exercise-list");
  exerciseCheck = document.getElementById("exercise-check");
  exerciseReset = document.getElementById("exercise-reset");

  // Inicializar pool de preposiciones
  state.pools.prepositions = [...commonPrepositions];

  // Cargar contenido
  fetch("content.md")
    .then(response => response.text())
    .then(text => {
      state.items = extractItems(text);
      renderExercise();
    })
    .catch(error => {
      console.error("Error loading content:", error);
    });

  // Event listeners
  exerciseCheck.addEventListener("click", checkExercise);
  exerciseReset.addEventListener("click", resetExercise);

  // Animation
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});

