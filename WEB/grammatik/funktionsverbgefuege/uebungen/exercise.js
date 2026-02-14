const state = {
  exercises: {},
  currentExercise: null,
  currentExerciseNumber: null,
  currentItems: [],
  wordPool: [] // Pool de palabras para ejercicios 110 y 111
};

let exerciseSelect;
let exerciseStart;
let exerciseContent;
let exerciseHeader;
let exerciseList;
let exerciseCheck;
let exerciseReset;

const exerciseLabels = {
  "110": "110. Setzen Sie die fehlenden Wörter in die Lücken ein!",
  "111": "111. Ergänzen Sie!",
  "112": "112. Ersetzen Sie die Funktionsverbgefüge durch ein Verb gleicher oder ähnlicher Bedeutung!",
  "113": "113. Ersetzen Sie die Verben durch gleichbedeutende Funktionsverbgefüge!"
};

// Pool de palabras comunes para ejercicios 110 y 111
const commonWordPool = [
  "nehmen", "stellen", "erteilen", "gibt", "erteilt", "fand", "Beachtung",
  "schenken", "haben", "geleistet", "ergreifen", "setzten", "genommen",
  "gebracht", "kam", "begangen", "kommen", "gestellt", "gesetzt", "finden",
  "Interesse", "führen", "ergriffen", "nehmen", "Ziehen", "gesetzt", "führen",
  "ergriffen", "ergreift", "begangen", "bringen", "geben", "halten", "Nimm",
  "ziehen", "treiben", "nehmen", "gekommen", "gezogen", "gestanden", "gestellt",
  "gegeben", "finden", "Verständnis", "halten", "finden", "Zustimmung"
];

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
  // Handle multiple correct answers separated by " / "
  const correctAnswers = correct.includes(" / ") 
    ? correct.split(" / ").map(a => normalizeOption(a.trim()))
    : [normalizeOption(correct)];
  
  const options = new Set(correctAnswers);
  shuffle(pool).forEach((item) => {
    const normalized = normalizeOption(item);
    if (options.size < 4 && !correctAnswers.includes(normalized)) {
      options.add(normalized);
    }
  });
  if (options.size < 4) {
    shuffle(fallback).forEach((item) => {
      const normalized = normalizeOption(item);
      if (options.size < 4 && !correctAnswers.includes(normalized)) {
        options.add(normalized);
      }
    });
  }
  return shuffle(Array.from(options));
}

function renderSelect(correct, pool, fallback) {
  const options = buildOptions(correct, pool, fallback);
  // Handle multiple correct answers
  const correctAnswers = correct.includes(" / ") 
    ? correct.split(" / ").map(a => normalizeOption(a.trim()))
    : [normalizeOption(correct)];
  
  const optionHtml = options
    .map((option) => {
      const isCorrect = correctAnswers.includes(normalizeOption(option));
      return `<option value="${escapeHtml(option)}" ${isCorrect ? 'data-correct="true"' : ''}>${escapeHtml(option)}</option>`;
    })
    .join("");
  
  return `
    <span class="test-blank">
      <select class="test-select" data-answer="${escapeHtml(correct)}" ${correct.includes(" / ") ? 'data-multiple="true"' : ''}>
        <option value="" selected disabled hidden>—</option>
        ${optionHtml}
      </select>
    </span>
  `;
}

function buildSentence110111(sentence, answers, wordPool) {
  let result = sentence;
  let blankCount = 0;
  
  // Find all bold matches in order
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const matches = [];
  let match;
  
  while ((match = boldRegex.exec(sentence)) !== null) {
    matches.push({
      fullMatch: match[0],
      content: match[1].trim(),
      index: match.index
    });
  }
  
  // Replace from end to start to preserve indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    blankCount += 1;
    
    // Use the full content (including " / " if present) as the correct answer
    const selectHtml = renderSelect(match.content, wordPool, commonWordPool);
    result = result.slice(0, match.index) + selectHtml + result.slice(match.index + match.fullMatch.length);
  }
  
  return { html: result, blanks: blankCount };
}

function extractExercises(text) {
  const exercises = {};
  const lines = text.split(/\r?\n/);
  let currentExercise = null;
  let currentItem = null;
  const allWords = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## 110. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["110", "111", "112", "113"].includes(num)) {
        currentExercise = num;
        exercises[num] = {
          number: num,
          title: title,
          items: [],
          type: (num === "110" || num === "111") ? "dropdown" : "text"
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
      
      if (currentExercise === "110" || currentExercise === "111") {
        // Exercises 110 and 111: extract bold words as answers
        const boldMatches = content.match(/\*\*([^*]+)\*\*/g);
        const answers = [];
        
        if (boldMatches) {
          boldMatches.forEach(match => {
            const answer = match.replace(/\*\*/g, "").trim();
            // Handle multiple answers separated by " / "
            if (answer.includes(" / ")) {
              const parts = answer.split(" / ").map(p => p.trim());
              answers.push(...parts);
              parts.forEach(p => allWords.add(p));
            } else {
              answers.push(answer);
              allWords.add(answer);
            }
          });
        }
        
        currentItem = {
          number: parseInt(itemNum, 10),
          original: content,
          answers: answers,
          type: "dropdown"
        };
      } else {
        // Exercises 112 and 113: extract original and answer
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
          // Remove bold markers from answer
          currentItem.answer = answerPart.replace(/\*\*/g, "");
        } else {
          // No arrow in same line - original is the full content (will be updated by next line with →)
          currentItem.original = content;
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
        if (currentExercise === "112" || currentExercise === "113") {
          // Remove bold markers from answer
          currentItem.answer = answerPart.replace(/\*\*/g, "");
        }
      }
      // Lines starting with spaces and → (indented answer)
      else if (line.match(/^\s+→/)) {
        const answerPart = trimmedLine.slice(1).trim();
        if (currentExercise === "112" || currentExercise === "113") {
          // Remove bold markers from answer
          currentItem.answer = answerPart.replace(/\*\*/g, "");
        }
      }
    }
  }

  // Store word pool for exercises 110 and 111
  state.wordPool = Array.from(allWords);

  return exercises;
}

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  // Show exercises 110, 111, 112, 113
  const allowedExercises = ["110", "111", "112", "113"];
  
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
    
    if (exercise.type === "dropdown") {
      // Exercises 110 and 111: dropdown format
      const built = buildSentence110111(item.original, item.answers, state.wordPool);
      itemDiv.innerHTML = `
        <div class="exercise-item-number">${item.number}.</div>
        <div class="exercise-item-content">
          <div class="exercise-original">${built.html}</div>
          <div class="exercise-feedback"></div>
        </div>
      `;
    } else {
      // Exercises 112 and 113: text input format
      itemDiv.innerHTML = `
        <div class="exercise-item-number">${item.number}.</div>
        <div class="exercise-item-content">
          <div class="exercise-original">${escapeHtml(item.original)}</div>
          <div class="exercise-input-wrapper">
            <input type="text" class="exercise-input" placeholder="Ihre Antwort eingeben..." data-answer="${escapeHtml(item.answer)}" />
          </div>
          <div class="exercise-feedback"></div>
        </div>
      `;
    }
    
    return itemDiv;
  });
  
  exerciseList.append(...state.currentItems);
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
  const exercise = state.exercises[state.currentExercise];
  
  if (exercise.type === "dropdown") {
    // Exercises 110 and 111: check dropdowns
    state.currentItems.forEach(itemDiv => {
      const feedback = itemDiv.querySelector(".exercise-feedback");
      const selects = itemDiv.querySelectorAll(".test-select");
      let allCorrect = true;
      let correctCount = 0;
      
      selects.forEach(select => {
        const correctAnswer = select.dataset.answer;
        const userAnswer = select.value;
        const isMultiple = select.dataset.multiple === "true";
        
        let isCorrect = false;
        if (isMultiple && correctAnswer.includes(" / ")) {
          // Check if user answer matches any of the multiple correct answers
          const correctAnswers = correctAnswer.split(" / ").map(a => normalizeOption(a.trim()));
          isCorrect = correctAnswers.includes(normalizeOption(userAnswer));
        } else {
          isCorrect = normalizeOption(userAnswer) === normalizeOption(correctAnswer);
        }
        
        if (isCorrect) {
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
        const correctAnswers = Array.from(selects).map(s => {
          const answer = s.dataset.answer;
          // If answer contains " / ", show it as is (already formatted)
          return answer;
        }).join(" | ");
        feedback.innerHTML = `<span class="feedback-wrong">Antwort: ${escapeHtml(correctAnswers)}</span>`;
      }
    });
  } else {
    // Exercises 112 and 113: check text inputs
    state.currentItems.forEach(itemDiv => {
      const feedback = itemDiv.querySelector(".exercise-feedback");
      const input = itemDiv.querySelector(".exercise-input");
      const correctAnswer = input.dataset.answer;
      const userAnswer = normalizeText(input.value);
      
      // Handle multiple correct answers separated by / (if any)
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
}

function resetExercise() {
  const exercise = state.exercises[state.currentExercise];
  
  if (exercise.type === "dropdown") {
    // Exercises 110 and 111: reset dropdowns
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
  } else {
    // Exercises 112 and 113: reset text inputs
    state.currentItems.forEach(itemDiv => {
      const input = itemDiv.querySelector(".exercise-input");
      const feedback = itemDiv.querySelector(".exercise-feedback");
      
      input.value = "";
      input.classList.remove("is-correct", "is-wrong");
      itemDiv.classList.remove("is-correct", "is-wrong");
      feedback.innerHTML = "";
    });
  }
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

