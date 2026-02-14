const state = {
  exercises: {},
  currentExercise: null,
  currentExerciseNumber: null,
  currentItems: []
};

let exerciseSelect;
let startButton;
let exerciseContent;
let exerciseHeader;
let exerciseList;
let checkButton;
let resetButton;

const exerciseLabels = {
  "105": "105. Formen Sie um!",
  "106": "106. Formen Sie um!"
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

function extractExercises(text) {
  const exercises = {};
  const lines = text.split(/\r?\n/);
  let currentExercise = null;
  let currentItem = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## 105. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["105", "106"].includes(num)) {
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

    // Skip example lines that start with **
    if (trimmedLine.match(/^\*\*/)) {
      continue;
    }

    // Detect item number (1. ... or 10. ...)
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
        currentItem.original = content.slice(0, arrowIndex).trim();
        const answerPart = content.slice(arrowIndex + 1).trim();
        // Handle multiple answers separated by / (e.g., exercise 105, item 15)
        currentItem.answer = answerPart;
      } else {
        // No arrow in same line - original is the full content (will be updated by next line with →)
        currentItem.original = content;
      }
      
      exercises[currentExercise].items.push(currentItem);
      continue;
    }

    // Handle continuation lines
    if (currentItem) {
      // Lines starting with → (answer continuation)
      if (trimmedLine.startsWith("→")) {
        const answerPart = trimmedLine.slice(1).trim();
        currentItem.answer = answerPart;
      }
      // Lines starting with spaces and → (indented answer)
      else if (line.match(/^\s+→/)) {
        const answerPart = trimmedLine.slice(1).trim();
        currentItem.answer = answerPart;
      }
    }
  }

  return exercises;
}

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  const allowedExercises = ["105", "106"];
  
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
    
    // Handle multiple answers separated by / (e.g., exercise 105, item 15)
    const answerText = item.answer;
    
    itemDiv.innerHTML = `
      <div class="exercise-item-number">${item.number}.</div>
      <div class="exercise-item-content">
        <div class="exercise-original">${escapeHtml(item.original)}</div>
        <div class="exercise-input-wrapper">
          <input type="text" class="exercise-input" data-answer="${escapeHtml(answerText)}" placeholder="Ihre Antwort eingeben..." />
        </div>
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
  if (!selected || !state.exercises[selected]) return;
  
  state.currentExercise = selected;
  state.currentExerciseNumber = parseInt(selected, 10);
  renderExercise();
}

function checkExercise() {
  state.currentItems.forEach(itemDiv => {
    const feedback = itemDiv.querySelector(".exercise-feedback");
    const input = itemDiv.querySelector(".exercise-input");
    const correctAnswer = input.dataset.answer;
    const userAnswer = normalizeText(input.value);
    
    // Handle multiple correct answers separated by / (e.g., exercise 105, item 15)
    const correctAnswers = correctAnswer.split("/").map(a => normalizeText(a.trim()));
    const isCorrect = correctAnswers.some(correct => userAnswer === correct);
    
    if (isCorrect) {
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
  });
}

function resetExercise() {
  state.currentItems.forEach(itemDiv => {
    const inputs = itemDiv.querySelectorAll(".exercise-input");
    const feedback = itemDiv.querySelector(".exercise-feedback");
    
    inputs.forEach(input => {
      input.value = "";
      input.classList.remove("is-correct", "is-wrong");
    });
    
    itemDiv.classList.remove("is-correct", "is-wrong");
    feedback.innerHTML = "";
  });
}

async function loadExercises() {
  try {
    const response = await fetch("content.md", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load content.md");
    }
    const text = await response.text();
    
    state.exercises = extractExercises(text);
    updateExerciseSelect();
    
    exerciseSelect.addEventListener("change", () => {
      startButton.disabled = !exerciseSelect.value;
    });
    
    startButton.disabled = true;
  } catch (error) {
    exerciseSelect.innerHTML = '<option value="">Fehler beim Laden der Übungen</option>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

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

  startButton.addEventListener("click", startExercise);
  checkButton.addEventListener("click", checkExercise);
  resetButton.addEventListener("click", resetExercise);
  
  loadExercises();
});

