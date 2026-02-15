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
    adjectives: {},
    verbs: {} // Se llenará dinámicamente con conjugaciones por verbo
  }
};

let exerciseSelect;
let exerciseStart;
let exerciseContent;
let exerciseHeader;
let exerciseList;
let exerciseCheck;
let exerciseReset;

const exerciseLabels = {
  "9": "9. Setzen Sie die passenden Verbformen ein!",
  "10": "10. Ergänzen Sie – wo es nötig ist – „als", Präpositionen und Endungen!"
};

// Preposiciones comunes en alemán (incluyendo "als" para ejercicio 10)
const commonPrepositions = [
  "an", "auf", "aus", "bei", "durch", "für", "gegen", "in", "mit", "nach",
  "über", "um", "unter", "von", "vor", "zu", "zwischen", "seit", "trotz",
  "während", "wegen", "ohne", "außer", "bis", "entlang", "gegenüber", "als"
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

// Generar conjugaciones de verbos alemanes
function generateVerbConjugations(verb) {
  const conjugations = new Set();
  const verbLower = verb.toLowerCase();
  
  // Verbos específicos del ejercicio 9 con todas sus formas
  const verbForms = {
    "gilt": ["gilt", "gelten", "galt", "galten", "gegolten", "gelte", "geltest", "geltet"],
    "betrachtet": ["betrachte", "betrachtest", "betrachtet", "betrachtete", "betrachteten", "betrachtetet", "betrachtet"],
    "auffassen": ["fasse", "fasst", "fassen", "fasste", "fassten", "fasstet", "aufgefasst", "auffasse", "auffasst"],
    "erwiesen": ["erweise", "erweist", "erweisen", "erwies", "erwiesen", "erwieset", "erwiesen"],
    "betrachte": ["betrachte", "betrachtest", "betrachtet", "betrachtete", "betrachteten", "betrachtetet", "betrachtet"],
    "bezeichnet": ["bezeichne", "bezeichnest", "bezeichnet", "bezeichnete", "bezeichneten", "bezeichnetet", "bezeichnet"],
    "ausgeben": ["gebe", "gibst", "gibt", "geben", "gab", "gaben", "gabt", "ausgegeben", "ausgebe", "ausgibst", "ausgibt"],
    "nennt": ["nenne", "nennst", "nennt", "nannte", "nannten", "nanntet", "genannt"],
    "aussehen": ["sehe", "siehst", "sieht", "sehen", "sah", "sahen", "saht", "ausgesehen", "aussehe", "aussiehst"],
    "dienen": ["diene", "dienst", "dient", "diente", "dienten", "dientet", "gedient"],
    "waren": ["bin", "bist", "ist", "sind", "seid", "war", "warst", "waren", "wart", "gewesen"]
  };
  
  // Buscar verbo exacto o relacionado
  for (const [key, forms] of Object.entries(verbForms)) {
    if (verbLower === key || verbLower.includes(key) || key.includes(verbLower)) {
      forms.forEach(form => conjugations.add(form));
      break;
    }
  }
  
  // Si no se encontró en la lista específica, generar formas básicas
  if (conjugations.size === 0) {
    // Agregar la forma original
    conjugations.add(verbLower);
    
    // Patrones comunes de conjugación
    if (verbLower.endsWith("en")) {
      const stem = verbLower.slice(0, -2);
      // Presente
      conjugations.add(stem); // ich
      conjugations.add(stem + "st"); // du
      conjugations.add(stem + "t"); // er/sie/es
      conjugations.add(verbLower); // wir/sie/Sie
      conjugations.add(stem + "t"); // ihr
      // Präteritum
      conjugations.add(stem + "te"); // ich/er/sie/es
      conjugations.add(stem + "test"); // du
      conjugations.add(stem + "ten"); // wir/sie/Sie
      conjugations.add(stem + "tet"); // ihr
      // Participio
      conjugations.add("ge" + stem + "t");
    } else if (verbLower.endsWith("n")) {
      const stem = verbLower.slice(0, -1);
      conjugations.add(stem);
      conjugations.add(stem + "st");
      conjugations.add(stem + "t");
      conjugations.add(verbLower);
    }
  }
  
  return Array.from(conjugations).filter(v => v.length > 0);
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
  
  // Preposiciones (incluyendo "als" para ejercicio 10)
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

function analyzePrepErgContent(content) {
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

// Construir oración para ejercicio 9 (con verbos)
function buildSentence9(sentence) {
  let result = sentence;
  let blankCount = 0;
  
  // Buscar tokens {pred:verbo}
  const predRegex = /\{pred:([^}]+)\}/g;
  let match;
  const matches = [];
  
  while ((match = predRegex.exec(sentence)) !== null) {
    matches.push({
      fullMatch: match[0],
      verb: match[1].trim(),
      index: match.index
    });
  }
  
  // Reemplazar de atrás hacia adelante
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const verb = match.verb;
    
    // Generar conjugaciones del verbo si no existen
    if (!state.pools.verbs[verb]) {
      state.pools.verbs[verb] = generateVerbConjugations(verb);
    }
    
    const verbPool = state.pools.verbs[verb];
    blankCount += 1;
    
    const replacementHtml = renderSelect(verb, verbPool, verbPool);
    
    result = result.slice(0, match.index) + replacementHtml + result.slice(match.index + match.fullMatch.length);
  }
  
  return { html: result, blanks: blankCount };
}

// Construir oración para ejercicio 10 (formato MultipleMultiple)
function buildSentence10(sentence) {
  let result = sentence;
  let blankCount = 0;
  
  // Buscar todos los tokens: {prep-erg:...}, {nom-erg:...}, {dat:...}, {gen:...}
  const tokenRegex = /\{(prep-erg|nom-erg|dat|gen):([^}]+)\}/g;
  let match;
  const matches = [];
  
  while ((match = tokenRegex.exec(sentence)) !== null) {
    matches.push({
      fullMatch: match[0],
      type: match[1],
      content: match[2],
      index: match.index
    });
  }
  
  // Reemplazar de atrás hacia adelante
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    let replacementHtml = "";
    
    if (match.type === "prep-erg" || match.type === "nom-erg") {
      // Análisis completo palabra por palabra
      const analyzed = analyzePrepErgContent(match.content);
      
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
    } else if (match.type === "dat" || match.type === "gen") {
      // Tokens simples: solo una palabra
      const word = match.content.trim();
      blankCount += 1;
      
      let pool = [];
      let fallback = [];
      
      if (match.type === "dat") {
        pool = ["dem", "der", "den", "mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen"];
        fallback = pool;
      } else if (match.type === "gen") {
        pool = ["des", "der", "den", "meiner", "deiner", "seiner", "ihrer", "unserer", "eurer"];
        fallback = pool;
      }
      
      replacementHtml = renderSelect(word, pool, fallback);
    }
    
    result = result.slice(0, match.index) + replacementHtml.trim() + result.slice(match.index + match.fullMatch.length);
  }
  
  return { html: result, blanks: blankCount };
}

function extractExercises(text) {
  const exercises = {};
  const lines = text.split(/\r?\n/);
  let currentExercise = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## 9. ... or ## 10. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["9", "10"].includes(num)) {
        currentExercise = num;
        exercises[num] = {
          number: num,
          title: title,
          items: []
        };
        continue;
      }
    }

    if (!currentExercise) continue;

    // Detect item number (1. ... or 10. ...)
    const itemMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (itemMatch) {
      const itemNum = itemMatch[1];
      const content = itemMatch[2];
      
      const item = {
        number: parseInt(itemNum, 10),
        original: content,
        type: currentExercise === "9" ? "verb" : "dropdown"
      };
      
      exercises[currentExercise].items.push(item);
      
      // Para ejercicio 9: extraer verbos y generar conjugaciones
      if (currentExercise === "9") {
        const predRegex = /\{pred:([^}]+)\}/g;
        let match;
        while ((match = predRegex.exec(content)) !== null) {
          const verb = match[1].trim();
          if (!state.pools.verbs[verb]) {
            state.pools.verbs[verb] = generateVerbConjugations(verb);
          }
        }
      }
      
      // Para ejercicio 10: analizar contenido para construir pools
      if (currentExercise === "10") {
        const prepErgRegex = /\{(prep-erg|nom-erg):([^}]+)\}/g;
        let match;
        while ((match = prepErgRegex.exec(content)) !== null) {
          analyzePrepErgContent(match[2]);
        }
      }
    }
  }

  return exercises;
}

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  // Show exercises 9, 10
  const allowedExercises = ["9", "10"];
  
  allowedExercises.forEach(num => {
    if (state.exercises[num] && state.exercises[num].items.length > 0) {
      const option = document.createElement("option");
      option.value = num;
      option.textContent = exerciseLabels[num];
      exerciseSelect.appendChild(option);
    }
  });
  
  exerciseSelect.disabled = false;
}

function renderExercise() {
  if (!state.currentExercise) return;

  const exercise = state.exercises[state.currentExercise];
  exerciseHeader.innerHTML = `<h3>${exerciseLabels[state.currentExercise]}</h3>`;
  
  exerciseList.innerHTML = "";
  state.currentItems = exercise.items.map((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "exercise-item";
    itemDiv.dataset.index = index;
    
    let built;
    if (state.currentExercise === "9") {
      built = buildSentence9(item.original);
    } else {
      built = buildSentence10(item.original);
    }
    
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

function startExercise() {
  const selected = exerciseSelect.value;
  if (!selected) return;
  
  state.currentExercise = selected;
  renderExercise();
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
  exerciseSelect = document.getElementById("exercise-select");
  exerciseStart = document.getElementById("exercise-start");
  exerciseContent = document.getElementById("exercise-content");
  exerciseHeader = document.getElementById("exercise-header");
  exerciseList = document.getElementById("exercise-list");
  exerciseCheck = document.getElementById("exercise-check");
  exerciseReset = document.getElementById("exercise-reset");

  // Inicializar pool de preposiciones (incluyendo "als" para ejercicio 10)
  state.pools.prepositions = [...commonPrepositions];

  // Cargar contenido
  fetch("content.md")
    .then(response => response.text())
    .then(text => {
      state.exercises = extractExercises(text);
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

