const state = {
  exercises: {},
  currentExercise: null,
  currentExerciseNumber: null,
  currentItems: [],
  attributeTypePool: [] // Pool of attribute types for exercise 67
};

let exerciseSelect;
let startButton;
let exerciseContent;
let exerciseHeader;
let exerciseList;
let checkButton;
let resetButton;

const exerciseLabels = {
  "67": "67. Bestimmen Sie die Attribute!",
  "69": "69. Formen Sie um! Bilden Sie Relativsätze!",
  "70": "70. Formen Sie um! (Modales Partizip)",
  "73": "73. Formen Sie die Relativsätze in Partizipialattribute um! (Partizip I)",
  "74": "74. Formen Sie die Relativsätze in Partizipialattribute um! (Partizip II)",
  "75": "75. Formen Sie die Relativsätze in Partizipialattribute um! (modales Partizip)",
  "78": "78. Bilden Sie Attributsätze!"
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

function removeSemanticTags(text) {
  return text.replace(/\{attr:([^}]+)\}/g, "$1");
}

function extractExercises(text) {
  const exercises = {};
  const lines = text.split(/\r?\n/);
  let currentExercise = null;
  let currentItem = null;
  const attributeTypeSet = new Set(); // For exercise 67

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## 67. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["67", "69", "70", "73", "74", "75", "78"].includes(num)) {
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

    // Special handling for exercise 67 (dropdown format)
    if (currentExercise === "67") {
      const itemMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
      if (itemMatch) {
        const itemNum = itemMatch[1];
        const content = itemMatch[2];
        
        // Extract attribute type from parentheses if present (at the end)
        const typeMatch = content.match(/\s+\(([^)]+)\)$/);
        const attributeType = typeMatch ? typeMatch[1] : "";
        const sentenceWithAttr = typeMatch ? content.slice(0, typeMatch.index).trim() : content;
        
        // Replace {attr:contenido} with just contenido (keep the attribute content in the sentence)
        const sentenceWithAttributeContent = sentenceWithAttr.replace(/\{attr:([^}]+)\}/g, "$1");
        
        currentItem = {
          number: parseInt(itemNum, 10),
          sentence: sentenceWithAttributeContent,
          attributeType: attributeType,
          type: "dropdown"
        };
        
        exercises[currentExercise].items.push(currentItem);
        
        // Add attribute type to pool
        if (attributeType) {
          attributeTypeSet.add(attributeType);
        }
        
        continue;
      }
    }
    // Special handling for exercise 70 (double text format)
    else if (currentExercise === "70") {
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
      
      // Handle lines with a) or b) for exercise 70
      if (currentItem && (trimmedLine.match(/^[ab]\)\s+→\s+(.+)$/) || line.match(/^\s+→\s+[ab]\)/))) {
        const match = trimmedLine.match(/^→\s+([ab])\)\s+(.+)$/);
        if (match) {
          const part = match[1];
          const sentence = match[2];
          
          // Remove semantic tags, replace ; with , and store the answer
          currentItem.answers[part] = removeSemanticTags(sentence).replace(/;/g, ",");
          continue;
        }
      }
    }
    // Other exercises (69, 73, 74, 75, 78): text input format
    else {
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

    // Handle continuation lines (only for exercises 69, 73, 74, 75, 78)
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

  // Store attribute type pool for exercise 67
  state.attributeTypePool = Array.from(attributeTypeSet);

  return exercises;
}

function buildSentence67(sentence, attributeType, attributeTypePool) {
  // The sentence is already without the attribute token
  // Just add the dropdown at the end for selecting the attribute type
  const sentenceHtml = escapeHtml(sentence);
  const dropdown = renderSelect(attributeType, attributeTypePool, attributeTypePool);
  
  return sentenceHtml + " " + dropdown;
}

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  // Show exercises 67, 69, 70, 73, 74, 75, 78
  const allowedExercises = ["67", "69", "70", "73", "74", "75", "78"];
  
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
    itemDiv.className = state.currentExercise === "67" ? "test-item" : "exercise-item";
    itemDiv.dataset.index = index;
    
    if (state.currentExercise === "67") {
      // Exercise 67: dropdown format for attribute type
      const sentenceHtml = buildSentence67(item.sentence, item.attributeType, state.attributeTypePool);
      itemDiv.innerHTML = `
        <div class="test-sentence">
          ${item.number}. ${sentenceHtml}
        </div>
        <div class="test-feedback"></div>
      `;
    } else if (state.currentExercise === "70") {
      // Exercise 70: text input format with a) and b)
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
      // Exercises 69, 73, 74, 75, 78: text input format
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
    const feedback = itemDiv.querySelector(state.currentExercise === "67" ? ".test-feedback" : ".exercise-feedback");
    
    if (state.currentExercise === "67") {
      // Exercise 67: dropdown format
      const selects = itemDiv.querySelectorAll(".test-select");
      
      let allCorrect = true;
      let allComplete = true;
      const correctAnswers = [];
      
      selects.forEach(select => {
        const userAnswer = normalizeOption(select.value);
        const correctAnswer = normalizeOption(select.dataset.answer);
        const isCorrect = userAnswer === correctAnswer;
        
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
        feedback.textContent = "Richtig";
      } else {
        itemDiv.classList.add("is-wrong");
        itemDiv.classList.remove("is-correct");
        if (correctAnswers.length > 0) {
          feedback.textContent = `Antworten: ${correctAnswers.join(", ")}`;
        } else {
          feedback.textContent = "Bitte wählen Sie alle Optionen.";
        }
      }
    } else if (state.currentExercise === "70") {
      // Exercise 70: text input format with a) and b)
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
        const answerA = escapeHtml(inputs[0].dataset.answer);
        const answerB = escapeHtml(inputs[1].dataset.answer);
        feedback.innerHTML = `<span class="feedback-wrong">Antworten: a) ${answerA} | b) ${answerB}</span>`;
      }
    } else {
      // Exercises 69, 73, 74, 75, 78: text input format
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
    if (state.currentExercise === "67") {
      // Exercise 67: dropdown format
      const selects = itemDiv.querySelectorAll(".test-select");
      const feedback = itemDiv.querySelector(".test-feedback");
      
      selects.forEach(select => {
        select.value = "";
        select.classList.remove("is-correct", "is-wrong");
      });
      
      itemDiv.classList.remove("is-correct", "is-wrong");
      feedback.textContent = "";
    } else {
      // Exercises 69, 70, 73, 74, 75, 78: text input format
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

