const state = {
  exercises: {},
  currentExercise: null,
  currentExerciseNumber: null,
  currentItems: [],
  adverbPool: [] // Pool for exercise 26
};

let exerciseSelect;
let startButton;
let exerciseContent;
let exerciseHeader;
let exerciseList;
let checkButton;
let resetButton;

const exerciseLabels = {
  "22": "22. Formen Sie die nominalen Temporal-Angaben in Nebensätze um!",
  "23": "23. Formen Sie die nominalen Temporal-Angaben in Nebensätze um!",
  "25": "25. Formen Sie die Temporalsätze in nominale Temporal-Angaben um!",
  "26": "26. Setzen Sie passende Adverbien ein!"
};

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeText(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[,;]/g, ",")
    .replace(/\s*,\s*/g, ", ");
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

function removeSemanticTags(text) {
  return text.replace(/\{ang-temporal:([^}]+)\}/g, "$1");
}

function extractExercises(text) {
  const exercises = {};
  const lines = text.split(/\r?\n/);
  let currentExercise = null;
  let currentItem = null;
  const adverbSet = new Set(); // For exercise 26

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## 22. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["22", "23", "25", "26"].includes(num)) {
        currentExercise = num;
        exercises[num] = {
          number: num,
          title: title,
          items: []
        };
        currentItem = null;
        continue;
      }
    }

    if (!currentExercise) continue;

    // Special handling for exercise 26 (dropdown format)
    if (currentExercise === "26") {
      const itemMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
      if (itemMatch) {
        const itemNum = itemMatch[1];
        const sentence = itemMatch[2];
        
        // Extract all temporal adverbs for the pool
        const adverbRegex = /\{ang-temporal:([^}]+)\}/g;
        let adverbMatch;
        while ((adverbMatch = adverbRegex.exec(sentence)) !== null) {
          const adverbText = adverbMatch[1].trim();
          // Handle multiple options separated by /
          const adverbs = adverbText.split('/').map(a => a.trim());
          adverbs.forEach(adv => {
            if (adv) adverbSet.add(adv);
          });
        }
        
        currentItem = {
          number: parseInt(itemNum, 10),
          sentence: sentence,
          type: "dropdown"
        };
        
        exercises[currentExercise].items.push(currentItem);
        continue;
      }
    } else {
      // Exercises 22, 23, 25 (text input format)
      const itemMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
      if (itemMatch) {
        const itemNum = itemMatch[1];
        const content = itemMatch[2];
        
        currentItem = {
          number: parseInt(itemNum, 10),
          original: "",
          answer: "",
          type: "text"
        };
        
        // Check if arrow is in same line
        const arrowIndex = content.indexOf("→");
        if (arrowIndex !== -1) {
          currentItem.original = removeSemanticTags(content.slice(0, arrowIndex).trim());
          const answerPart = content.slice(arrowIndex + 1).trim();
          currentItem.answer = removeSemanticTags(answerPart);
        } else {
          // No arrow in same line - original is the full content (will be updated by next line with →)
          currentItem.original = removeSemanticTags(content);
        }
        
        exercises[currentExercise].items.push(currentItem);
        continue;
      }
    }

    // Handle continuation lines (only for exercises 22, 23, 25)
    if (currentItem && currentItem.type === "text") {
      // Lines starting with → (answer continuation)
      if (trimmedLine.startsWith("→")) {
        const answerPart = trimmedLine.slice(1).trim();
        currentItem.answer = removeSemanticTags(answerPart);
      }
      // Lines starting with spaces and → (indented answer)
      else if (line.match(/^\s+→/)) {
        const answerPart = trimmedLine.slice(1).trim();
        currentItem.answer = removeSemanticTags(answerPart);
      }
    }
  }

  // Store adverb pool
  state.adverbPool = Array.from(adverbSet);

  return exercises;
}

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  // Show exercises 22, 23, 25, 26
  const allowedExercises = ["22", "23", "25", "26"];
  
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

function buildSentence26(sentence) {
  const tokenRegex = /\{ang-temporal:([^}]+)\}/g;
  let result = "";
  let lastIndex = 0;
  let blankCount = 0;

  let match;
  while ((match = tokenRegex.exec(sentence)) !== null) {
    result += escapeHtml(sentence.slice(lastIndex, match.index));
    const adverb = match[1].trim();
    
    // Handle multiple correct answers separated by /
    const correctAnswers = adverb.split('/').map(a => a.trim());
    const primaryAnswer = correctAnswers[0];
    const allAnswers = correctAnswers.join(',');
    
    // Build options
    const normalizedCorrect = normalizeOption(primaryAnswer);
    const options = buildOptions(normalizedCorrect, state.adverbPool, state.adverbPool);
    const optionHtml = options
      .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
      .join("");
    
    result += `
      <span class="test-blank">
        <select class="test-select" data-answer="${escapeHtml(allAnswers)}">
          <option value="" selected disabled hidden>—</option>
          ${optionHtml}
        </select>
      </span>
    `;
    blankCount += 1;
    
    lastIndex = tokenRegex.lastIndex;
  }

  result += escapeHtml(sentence.slice(lastIndex));
  return result;
}

function renderExercise() {
  if (!state.currentExercise) return;

  const exercise = state.exercises[state.currentExercise];
  exerciseHeader.innerHTML = `<h3>${exerciseLabels[state.currentExercise]}</h3>`;
  
  exerciseList.innerHTML = "";
  state.currentItems = exercise.items.map((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = state.currentExercise === "26" ? "test-item" : "exercise-item";
    itemDiv.dataset.index = index;
    
    if (state.currentExercise === "26") {
      // Exercise 26: dropdown format
      const sentenceHtml = buildSentence26(item.sentence);
      itemDiv.innerHTML = `
        <div class="test-sentence">
          ${item.number}. ${sentenceHtml}
        </div>
        <div class="test-feedback"></div>
      `;
    } else {
      // Exercises 22, 23, 25: text input format
      itemDiv.innerHTML = `
        <div class="exercise-item-number">${item.number}.</div>
        <div class="exercise-item-content">
          <div class="exercise-original">${escapeHtml(item.original)}</div>
          <div class="exercise-input-wrapper">
            <input type="text" class="exercise-input" data-answer="${escapeHtml(item.answer)}" placeholder="Ihre Antwort eingeben..." />
          </div>
          <div class="exercise-feedback"></div>
        </div>
      `;
    }
    
    exerciseList.appendChild(itemDiv);
    return itemDiv;
  });
  
  exerciseContent.style.display = "block";
}

function startExercise() {
  const selected = exerciseSelect.value;
  if (!selected || !state.exercises[selected]) return;
  
  state.currentExercise = selected;
  state.currentExerciseNumber = parseInt(selected, 10);
  renderExercise();
}

function checkExercise() {
  state.currentItems.forEach(itemDiv => {
    if (state.currentExercise === "26") {
      // Exercise 26: dropdown format
      const selects = itemDiv.querySelectorAll(".test-select");
      const feedback = itemDiv.querySelector(".test-feedback");
      
      let allCorrect = true;
      let allComplete = true;
      const correctAnswers = [];
      
      selects.forEach(select => {
        const userAnswer = normalizeOption(select.value);
        // Handle multiple correct answers separated by comma
        const correctAnswersList = select.dataset.answer.split(',').map(a => normalizeOption(a.trim()));
        const isCorrect = correctAnswersList.includes(userAnswer);
        
        if (!select.value) {
          allComplete = false;
        }
        
        if (isCorrect) {
          select.classList.add("is-correct");
          select.classList.remove("is-wrong");
        } else {
          allCorrect = false;
          select.classList.add("is-wrong");
          select.classList.remove("is-correct");
          correctAnswers.push(select.dataset.answer);
        }
      });
      
      if (allComplete && allCorrect) {
        itemDiv.classList.add("is-correct");
        itemDiv.classList.remove("is-wrong");
        feedback.innerHTML = '<span class="feedback-correct">Richtig!</span>';
      } else {
        itemDiv.classList.add("is-wrong");
        itemDiv.classList.remove("is-correct");
        if (correctAnswers.length > 0) {
          feedback.innerHTML = `<span class="feedback-wrong">Antworten: ${correctAnswers.join(" oder ")}</span>`;
        } else {
          feedback.innerHTML = '<span class="feedback-wrong">Bitte wählen Sie alle Optionen.</span>';
        }
      }
    } else {
      // Exercises 22, 23, 25: text input format
      const feedback = itemDiv.querySelector(".exercise-feedback");
      const input = itemDiv.querySelector(".exercise-input");
      const correctAnswer = input.dataset.answer;
      const userAnswer = normalizeText(input.value);
      const normalizedCorrect = normalizeText(correctAnswer);
      
      if (userAnswer === normalizedCorrect) {
        itemDiv.classList.add("is-correct");
        itemDiv.classList.remove("is-wrong");
        feedback.innerHTML = '<span class="feedback-correct">Richtig!</span>';
        input.classList.add("is-correct");
        input.classList.remove("is-wrong");
      } else {
        itemDiv.classList.add("is-wrong");
        itemDiv.classList.remove("is-correct");
        feedback.innerHTML = `<span class="feedback-wrong">Antwort: ${escapeHtml(correctAnswer)}</span>`;
        input.classList.add("is-wrong");
        input.classList.remove("is-correct");
      }
    }
  });
}

function resetExercise() {
  state.currentItems.forEach(itemDiv => {
    if (state.currentExercise === "26") {
      // Exercise 26: dropdown format
      const selects = itemDiv.querySelectorAll(".test-select");
      const feedback = itemDiv.querySelector(".test-feedback");
      
      selects.forEach(select => {
        select.value = "";
        select.classList.remove("is-correct", "is-wrong");
      });
      
      itemDiv.classList.remove("is-correct", "is-wrong");
      feedback.innerHTML = "";
    } else {
      // Exercises 22, 23, 25: text input format
      const inputs = itemDiv.querySelectorAll(".exercise-input");
      const feedback = itemDiv.querySelector(".exercise-feedback");
      
      inputs.forEach(input => {
        input.value = "";
        input.classList.remove("is-correct", "is-wrong");
      });
      
      itemDiv.classList.remove("is-correct", "is-wrong");
      feedback.innerHTML = "";
    }
  });
}

async function loadExercises() {
  try {
    const response = await fetch("content.md", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load exercises");
    }
    const text = await response.text();
    state.exercises = extractExercises(text);
    updateExerciseSelect();
  } catch (error) {
    console.error("Error loading exercises:", error);
    exerciseSelect.innerHTML = '<option value="">Fehler beim Laden</option>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");
  
  // Get DOM elements after DOM is loaded
  exerciseSelect = document.getElementById("exercise-select");
  startButton = document.getElementById("exercise-start");
  exerciseContent = document.getElementById("exercise-content");
  exerciseHeader = document.getElementById("exercise-header");
  exerciseList = document.getElementById("exercise-list");
  checkButton = document.getElementById("exercise-check");
  resetButton = document.getElementById("exercise-reset");
  
  if (!exerciseSelect || !startButton || !exerciseContent || !exerciseHeader || !exerciseList || !checkButton || !resetButton) {
    console.error("Required DOM elements not found");
    return;
  }
  
  exerciseSelect.addEventListener("change", () => {
    startButton.disabled = !exerciseSelect.value;
  });
  
  startButton.addEventListener("click", () => {
    startExercise();
  });
  
  checkButton.addEventListener("click", () => {
    checkExercise();
  });
  
  resetButton.addEventListener("click", () => {
    resetExercise();
  });
  
  loadExercises();
  
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});

