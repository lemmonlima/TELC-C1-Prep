const state = {
  exercises: {},
  currentExercise: null,
  currentExerciseNumber: null,
  currentItems: []
};

let exerciseSelect;
let exerciseStart;
let exerciseContent;
let exerciseHeader;
let exerciseList;
let exerciseCheck;
let exerciseReset;

const exerciseLabels = {
  "13": "13. Verbalisierung von Ergänzungen",
  "14": "14. Verbalisieren Sie die Nominalgruppe! (Präteritum)",
  "15": "15. Formen Sie um!",
  "16": "16. Formen Sie die Akkusativ-Ergänzungen in Nebensätze um!",
  "17": "17. Formen Sie um!",
  "18": "18. Bilden Sie indirekte Fragesätze!",
  "19": "19. Formen Sie um! Bilden Sie Ergänzungssätze!",
  "20": "20. Nominalisieren Sie die Ergänzungssätze!"
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
    
    // Detect exercise header (## 13. ... or ## 14. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["13", "14", "15", "16", "17", "18", "19", "20"].includes(num)) {
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

    // Skip subsection headers (### 1. Nomen → Verb (Aktiv))
    if (trimmedLine.match(/^###\s+/)) {
      continue;
    }

    // Skip lines that are just examples with - (they start with -)
    if (trimmedLine.startsWith("-")) {
      // Check if it has an arrow in the same line or next line
      const arrowIndex = trimmedLine.indexOf("→");
      if (arrowIndex !== -1) {
        // This is an example item, skip it
        continue;
      }
      // Check next line for arrow
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine.startsWith("→")) {
          // Skip this example
          continue;
        }
      }
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
        answers: [], // For exercise 17 with multiple answers
        type: "text"
      };
      
      // Check if arrow is in same line
      const arrowIndex = content.indexOf("→");
      if (arrowIndex !== -1) {
        currentItem.original = content.slice(0, arrowIndex).trim();
        const answerPart = content.slice(arrowIndex + 1).trim();
        // For exercise 17, there can be multiple answers on separate lines
        if (currentExercise === "17") {
          // Store first answer, will check for additional answers in next lines
          currentItem.answers = [answerPart];
        } else {
          currentItem.answer = answerPart;
        }
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
        if (currentExercise === "17") {
          // Exercise 17 can have multiple answers
          if (!currentItem.answers || currentItem.answers.length === 0) {
            currentItem.answers = [];
          }
          currentItem.answers.push(answerPart);
        } else {
          // For other exercises, if answer is already set, this might be a second answer
          // But typically there's only one answer, so we replace
          currentItem.answer = answerPart;
        }
      }
      // Lines starting with spaces and → (indented answer)
      else if (line.match(/^\s+→/)) {
        const answerPart = trimmedLine.slice(1).trim();
        if (currentExercise === "17") {
          if (!currentItem.answers || currentItem.answers.length === 0) {
            currentItem.answers = [];
          }
          currentItem.answers.push(answerPart);
        } else {
          currentItem.answer = answerPart;
        }
      }
    }
  }

  return exercises;
}

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  // Show exercises 13, 14, 15, 16, 17, 18, 19, 20
  const allowedExercises = ["13", "14", "15", "16", "17", "18", "19", "20"];
  
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
    
    // For exercise 17, handle multiple answers
    let answerValue = "";
    if (state.currentExercise === "17" && item.answers && item.answers.length > 0) {
      // Join multiple answers with " / " for display and comparison
      answerValue = item.answers.join(" / ");
    } else {
      answerValue = item.answer || "";
    }
    
    itemDiv.innerHTML = `
      <div class="exercise-item-number">${item.number}.</div>
      <div class="exercise-item-content">
        <div class="exercise-original">${escapeHtml(item.original)}</div>
        <div class="exercise-input-wrapper">
          <input type="text" class="exercise-input" placeholder="Ihre Antwort eingeben..." data-answer="${escapeHtml(answerValue)}" />
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
  if (!selected) return;
  
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
    
    // Handle multiple correct answers separated by / (especially for exercise 17)
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
    const input = itemDiv.querySelector(".exercise-input");
    const feedback = itemDiv.querySelector(".exercise-feedback");
    
    input.value = "";
    input.classList.remove("is-correct", "is-wrong");
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

  // Load content
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

