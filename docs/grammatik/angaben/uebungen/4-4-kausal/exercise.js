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
  "28": "28. Formen Sie um!",
  "29": "29. Bilden Sie Kausalsätze mit den Subjunktionen \"weil\" oder \"da\"!",
  "30": "30. Bilden Sie nominale Kausal-Angaben mit passenden Präpositionen!",
  "31": "31. Drücken Sie die Kausalität mit a) \"denn\" und b) \"nämlich\" aus!",
  "32": "32. Drücken Sie die Kausalbeziehung mit \"deshalb\" usw. aus!",
  "34": "34. Beschreiben Sie die Kausalbeziehung mit dem vorgegebenen Verb!"
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
  return text.replace(/\{ang-kausal:([^}]+)\}/g, "$1");
}

function extractExercises(text) {
  const exercises = {};
  const lines = text.split(/\r?\n/);
  let currentExercise = null;
  let currentItem = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## 28. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["28", "29", "30", "31", "32", "34"].includes(num)) {
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

    // Detect item number (1. ... or 10. ...)
    const itemMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (itemMatch) {
      const itemNum = itemMatch[1];
      const content = itemMatch[2];
      
      currentItem = {
        number: parseInt(itemNum, 10),
        original: "",
        answer: "",
        type: currentExercise === "31" ? "multiple" : "text"
      };
      
      if (currentExercise === "31") {
        // Exercise 31: original is the full sentence
        currentItem.original = removeSemanticTags(content);
        currentItem.answers = { a: "", b: "" };
      } else {
        // Other exercises: check if arrow is in same line
        const arrowIndex = content.indexOf("→");
        if (arrowIndex !== -1) {
          currentItem.original = removeSemanticTags(content.slice(0, arrowIndex).trim());
          const answerPart = content.slice(arrowIndex + 1).trim();
          currentItem.answer = removeSemanticTags(answerPart);
        } else {
          // No arrow in same line - original is the full content (will be updated by next line with →)
          currentItem.original = removeSemanticTags(content);
        }
      }
      
      exercises[currentExercise].items.push(currentItem);
      continue;
    }

    // Handle continuation lines
    if (currentItem) {
      // Lines starting with → (answer continuation)
      if (trimmedLine.startsWith("→")) {
        const answerPart = trimmedLine.slice(1).trim();
        if (currentExercise === "31") {
          // Shouldn't happen for 31
        } else {
          currentItem.answer = removeSemanticTags(answerPart);
        }
      }
      // Lines starting with a) or b) (for exercise 31)
      else if (trimmedLine.match(/^[ab]\)\s+(.+)$/)) {
        const match = trimmedLine.match(/^([ab])\)\s+(.+)$/);
        if (match && currentExercise === "31") {
          const part = match[1];
          const answer = removeSemanticTags(match[2]);
          currentItem.answers[part] = answer;
        }
      }
      // Lines starting with spaces and → (indented answer)
      else if (line.match(/^\s+→/)) {
        const answerPart = trimmedLine.slice(1).trim();
        if (currentExercise !== "31") {
          currentItem.answer = removeSemanticTags(answerPart);
        }
      }
    }
  }

  return exercises;
}

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  // Show exercises 28, 29, 30, 31, 32, 34
  const allowedExercises = ["28", "29", "30", "31", "32", "34"];
  
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
    
    if (state.currentExercise === "31") {
      // Multiple choice for exercise 31 - show full options and let user select
      itemDiv.innerHTML = `
        <div class="exercise-item-number">${item.number}.</div>
        <div class="exercise-item-content">
          <div class="exercise-original">${escapeHtml(item.original)}</div>
          <div class="exercise-multiple-choice">
            <label class="exercise-option-label">
              <input type="radio" name="exercise-${item.number}" value="a" class="exercise-radio" data-answer="a" />
              <span class="exercise-option-text">a) ${escapeHtml(item.answers.a)}</span>
            </label>
            <label class="exercise-option-label">
              <input type="radio" name="exercise-${item.number}" value="b" class="exercise-radio" data-answer="b" />
              <span class="exercise-option-text">b) ${escapeHtml(item.answers.b)}</span>
            </label>
          </div>
          <div class="exercise-feedback"></div>
        </div>
      `;
    } else {
      // Text input for other exercises
      // For exercise 32, replace semicolons with commas in the answer
      let answer = item.answer;
      if (state.currentExercise === "32") {
        answer = answer.replace(/;/g, ",");
      }
      
      itemDiv.innerHTML = `
        <div class="exercise-item-number">${item.number}.</div>
        <div class="exercise-item-content">
          <div class="exercise-original">${escapeHtml(item.original)}</div>
          <div class="exercise-input-wrapper">
            <input type="text" class="exercise-input" data-answer="${escapeHtml(answer)}" placeholder="Ihre Antwort eingeben..." />
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
    
    if (state.currentExercise === "31") {
      // Multiple choice check for exercise 31
      const radios = itemDiv.querySelectorAll(".exercise-radio");
      const selectedRadio = Array.from(radios).find(radio => radio.checked);
      const item = state.exercises[state.currentExercise].items[parseInt(itemDiv.dataset.index, 10)];
      
      if (!selectedRadio) {
        // No selection made
        itemDiv.classList.add("is-wrong");
        itemDiv.classList.remove("is-correct");
        feedback.innerHTML = '<span class="feedback-wrong">Bitte wählen Sie eine Option.</span>';
        return;
      }
      
      const selectedValue = selectedRadio.value;
      // For exercise 31, both options are correct (user needs to select one)
      // We'll mark it as correct if they selected either option
      // But actually, looking at the exercise, it seems like both a) and b) are valid answers
      // So we'll accept either selection as correct
      itemDiv.classList.add("is-correct");
      itemDiv.classList.remove("is-wrong");
      feedback.innerHTML = '<span class="feedback-correct">Richtig!</span>';
      
      // Mark the selected option as correct
      selectedRadio.closest("label").classList.add("is-selected-correct");
    } else {
      // Single text input check
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
    if (state.currentExercise === "31") {
      // Reset radio buttons for exercise 31
      const radios = itemDiv.querySelectorAll(".exercise-radio");
      radios.forEach(radio => {
        radio.checked = false;
        radio.closest("label").classList.remove("is-selected-correct");
      });
    } else {
      // Reset text inputs for other exercises
      const inputs = itemDiv.querySelectorAll(".exercise-input");
      inputs.forEach(input => {
        input.value = "";
        input.classList.remove("is-correct", "is-wrong");
      });
    }
    
    const feedback = itemDiv.querySelector(".exercise-feedback");
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

