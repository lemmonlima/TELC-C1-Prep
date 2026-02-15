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
  "42": "42. Bilden Sie Konditionalsätze, auch in der uneingeleiteten Form!",
  "43": "43. Formen Sie um! Benutzen Sie a) \"dann\" und b) \"sonst\" bzw. \"andernfalls\"!",
  "44": "44. Formen Sie um! Benutzen Sie \"sollte-\"!",
  "45": "45. Formen Sie um! Verwenden Sie feste Partizipial-Fügungen!",
  "46": "46. Bilden Sie nominale Konditional-Angaben!"
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


function removeSemanticTags(text) {
  return text.replace(/\{ang-kond:([^}]+)\}/g, "$1");
}

function extractExercises(text) {
  const exercises = {};
  const lines = text.split(/\r?\n/);
  let currentExercise = null;
  let currentItem = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## 42. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["42", "43", "44", "45", "46"].includes(num)) {
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

    // Special handling for exercise 43 (text input with a) and b))
    if (currentExercise === "43") {
      const itemMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
      if (itemMatch) {
        const itemNum = itemMatch[1];
        const content = itemMatch[2];
        
        currentItem = {
          number: parseInt(itemNum, 10),
          original: removeSemanticTags(content),
          answers: { a: "", b: "" },
          type: "multiple-text"
        };
        
        exercises[currentExercise].items.push(currentItem);
        continue;
      }
      
      // Handle lines with a) or b) for exercise 43 (with or without indentation)
      // Format: "   → a) Man muss..." or "→ a) Man muss..."
      if (currentItem) {
        // Match format: "→ a) ..." (with optional leading spaces)
        const match = trimmedLine.match(/^→\s+([ab])\)\s+(.+)$/);
        if (match) {
          const part = match[1];
          const sentence = match[2];
          
          // Remove semantic tags, replace ; with , and store the answer
          currentItem.answers[part] = removeSemanticTags(sentence).replace(/;/g, ",");
          continue;
        }
      }
    } else {
      // Exercises 42, 44, 45, 46 (text input format)
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

    // Handle continuation lines (only for exercises 42, 44, 45, 46)
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

  return exercises;
}


function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  // Show exercises 42, 43, 44, 45, 46
  const allowedExercises = ["42", "43", "44", "45", "46"];
  
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
    
    if (state.currentExercise === "43") {
      // Exercise 43: text input format with a) and b)
      itemDiv.innerHTML = `
        <div class="exercise-item-number">${item.number}.</div>
        <div class="exercise-item-content">
          <div class="exercise-original">${escapeHtml(item.original)}</div>
          <div class="exercise-input-wrapper">
            <label class="exercise-input-label">a)</label>
            <input type="text" class="exercise-input" data-answer="${escapeHtml(item.answers.a)}" placeholder="Ihre Antwort a) eingeben..." />
          </div>
          <div class="exercise-input-wrapper">
            <label class="exercise-input-label">b)</label>
            <input type="text" class="exercise-input" data-answer="${escapeHtml(item.answers.b)}" placeholder="Ihre Antwort b) eingeben..." />
          </div>
          <div class="exercise-feedback"></div>
        </div>
      `;
    } else {
      // Exercises 42, 44, 45, 46: text input format
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
    const feedback = itemDiv.querySelector(".exercise-feedback");
    
    if (state.currentExercise === "43") {
      // Exercise 43: text input format with a) and b)
      const inputs = itemDiv.querySelectorAll(".exercise-input");
      let allCorrect = true;
      
      inputs.forEach((input) => {
        const correctAnswer = input.dataset.answer;
        const userAnswer = normalizeText(input.value);
        const normalizedCorrect = normalizeText(correctAnswer);
        
        if (userAnswer === normalizedCorrect && input.value.trim()) {
          input.classList.add("is-correct");
          input.classList.remove("is-wrong");
        } else {
          allCorrect = false;
          input.classList.add("is-wrong");
          input.classList.remove("is-correct");
        }
      });
      
      if (allCorrect) {
        itemDiv.classList.add("is-correct");
        itemDiv.classList.remove("is-wrong");
        feedback.innerHTML = '<span class="feedback-correct">Richtig!</span>';
      } else {
        itemDiv.classList.add("is-wrong");
        itemDiv.classList.remove("is-correct");
        // Always show both correct answers
        const answerA = escapeHtml(inputs[0].dataset.answer);
        const answerB = escapeHtml(inputs[1].dataset.answer);
        feedback.innerHTML = `<span class="feedback-wrong">Antworten: a) ${answerA} | b) ${answerB}</span>`;
      }
    } else {
      // Exercises 42, 44, 45, 46: text input format
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

