const state = {
  exercises: {},
  currentExercise: null,
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
    adjectives: {} // Se llenará dinámicamente
  }
};

let exerciseSelect;
let exerciseStart;
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

// Declinaciones de adjetivos (sin artículo definido - fuerte)
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
  // Si la palabra original empieza con mayúscula y no es la primera palabra de la oración,
  // probablemente es un Nomen
  if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
    // Verificar que no sea un artículo o palabra conocida que también empieza con mayúscula
    const isKnownWord = commonPrepositions.includes(normalized) ||
                       state.pools.definiteArticles.includes(normalized) ||
                       state.pools.indefiniteArticles.includes(normalized);
    
    if (!isKnownWord) {
      // Es un Nomen - retornar null para que se muestre como texto
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
  
  // Adjetivos (si termina en -e, -er, -es, -en, -em, etc.)
  // Pero NO si empieza con mayúscula (es un Nomen)
  // Y no si es un artículo o pronombre
  const adjEndings = /(e|er|es|en|em)$/;
  if (adjEndings.test(normalized) && normalized.length > 2) {
    // Verificar que no sea un artículo o pronombre ya identificado
    const isArticle = state.pools.definiteArticles.includes(normalized) ||
                     state.pools.indefiniteArticles.includes(normalized) ||
                     state.pools.kein.includes(normalized);
    
    // Verificar que no empiece con mayúscula (sería un Nomen)
    const isNoun = word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase();
    
    if (!isArticle && !isNoun) {
      // Extraer la raíz del adjetivo (remover todas las posibles terminaciones)
      let root = normalized;
      // Intentar diferentes terminaciones
      const endings = ["er", "es", "en", "em", "e"];
      for (const ending of endings) {
        if (normalized.endsWith(ending) && normalized.length > ending.length) {
          root = normalized.slice(0, -ending.length);
          break;
        }
      }
      // Si la raíz es válida (al menos 3 caracteres), es probablemente un adjetivo
      if (root.length >= 3) {
        return { type: "adjective", root: root, value: word };
      }
    }
  }
  
  return null;
}

function generateAdjectiveDeclensions(root) {
  const declensions = [];
  // Generar todas las declinaciones posibles
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

function analyzePrepErgContent(content) {
  const elements = [];
  const words = content.trim().split(/\s+/);
  
  for (const word of words) {
    const identified = identifyElementType(word);
    if (identified) {
      // Solo agregar elementos que necesitan dropdown (excluir Nomen)
      elements.push(identified);
      
      // Si es un adjetivo, agregar sus declinaciones al pool
      if (identified.type === "adjective") {
        if (!state.pools.adjectives[identified.root]) {
          state.pools.adjectives[identified.root] = generateAdjectiveDeclensions(identified.root);
        }
      }
    } else {
      // Si no se identifica como elemento con dropdown, es un Nomen u otra palabra
      // Se mostrará directamente sin dropdown
      elements.push({ type: "text", value: word });
    }
  }
  
  return elements;
}

function buildSentence(sentence) {
  let result = sentence;
  let blankCount = 0;
  
  // Reemplazar {prep-erg:...} con elementos (dropdowns solo para ciertos tipos, texto directo para Nomen)
  const prepErgRegex = /\{prep-erg:([^}]+)\}/g;
  let match;
  const matches = [];
  
  while ((match = prepErgRegex.exec(sentence)) !== null) {
    matches.push({
      fullMatch: match[0],
      content: match[1],
      index: match.index
    });
  }
  
  // Reemplazar de atrás hacia adelante para preservar índices
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const analyzed = analyzePrepErgContent(match.content);
    
    // Construir HTML: dropdowns para elementos identificados, texto directo para Nomen
    let replacementHtml = "";
    for (const element of analyzed) {
      if (element.type === "text") {
        // Nomen u otras palabras: mostrar directamente sin paréntesis ni dropdown
        replacementHtml += escapeHtml(element.value) + " ";
      } else {
        // Elementos que necesitan dropdown
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
        
        // Formato: dropdown sin paréntesis
        replacementHtml += renderSelect(element.value, pool, fallback) + " ";
      }
    }
    
    result = result.slice(0, match.index) + replacementHtml.trim() + result.slice(match.index + match.fullMatch.length);
  }
  
  return { html: result, blanks: blankCount };
}

function extractExercises(text) {
  const exercises = {};
  const lines = text.split(/\r?\n/);
  let currentExercise = null;
  let currentItem = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## Übung 3. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+Übung\s+(\d+)\./);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      if (["3", "4", "5", "6", "7"].includes(num)) {
        currentExercise = num;
        exercises[num] = {
          number: num,
          title: trimmedLine.replace(/^##\s+/, ""),
          items: []
        };
        currentItem = null;
        continue;
      }
    }

    if (!currentExercise) continue;

    // Detect item number (1. ... or 10. ...)
    const itemMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (itemMatch) {
      const itemNum = itemMatch[1];
      const content = itemMatch[2];
      
      currentItem = {
        number: parseInt(itemNum, 10),
        original: content,
        type: "dropdown"
      };
      
      exercises[currentExercise].items.push(currentItem);
      
      // Analizar contenido para construir pools
      const prepErgRegex = /\{prep-erg:([^}]+)\}/g;
      let match;
      while ((match = prepErgRegex.exec(content)) !== null) {
        analyzePrepErgContent(match[1]);
      }
    }
  }

  return exercises;
}

function renderExercise() {
  if (!state.currentExercise) return;

  const exercise = state.exercises[state.currentExercise];
  exerciseHeader.innerHTML = `<h3>${exercise.title}</h3>`;
  
  exerciseList.innerHTML = "";
  state.currentItems = exercise.items.map((item, index) => {
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

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  // Show exercises 3, 4, 5, 6, 7
  const allowedExercises = ["3", "4", "5", "6", "7"];
  
  allowedExercises.forEach(num => {
    if (state.exercises[num] && state.exercises[num].items.length > 0) {
      const option = document.createElement("option");
      option.value = num;
      option.textContent = state.exercises[num].title;
      exerciseSelect.appendChild(option);
    }
  });
  
  exerciseSelect.disabled = false;
}

function startExercise() {
  const selected = exerciseSelect.value;
  if (!selected) return;
  
  state.currentExercise = selected;
  renderExercise();
}

document.addEventListener("DOMContentLoaded", () => {
  exerciseSelect = document.getElementById("exercise-select");
  exerciseStart = document.getElementById("exercise-start");
  exerciseContent = document.getElementById("exercise-content");
  exerciseHeader = document.getElementById("exercise-header");
  exerciseList = document.getElementById("exercise-list");
  exerciseCheck = document.getElementById("exercise-check");
  exerciseReset = document.getElementById("exercise-reset");

  // Load content
  fetch("content.md")
    .then(response => response.text())
    .then(text => {
      state.exercises = extractExercises(text);
      // Inicializar pool de preposiciones desde los ejercicios
      state.pools.prepositions = Array.from(new Set(commonPrepositions));
      updateExerciseSelect();
    })
    .catch(error => {
      console.error("Error loading content:", error);
    });

  // Event listeners
  exerciseSelect.addEventListener("change", () => {
    exerciseStart.disabled = !exerciseSelect.value;
  });
  
  exerciseStart.addEventListener("click", startExercise);
  exerciseCheck.addEventListener("click", checkExercise);
  exerciseReset.addEventListener("click", resetExercise);

  // Animation
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});

