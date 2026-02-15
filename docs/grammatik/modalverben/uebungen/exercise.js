const state = {
  exercises: {},
  currentExercise: null,
  currentExerciseNumber: null,
  currentItems: [],
  originalText: "",
  correctAnswer: ""
};

let exerciseSelect;
let startButton;
let exerciseContent;
let exerciseHeader;
let exerciseList;
let checkButton;
let resetButton;

// For text exercises (91, 96)
let originalTextEl;
let userAnswerEl;
let exerciseResult;
let correctAnswerEl;

const exerciseLabels = {
  "90": "90. Ersetzen Sie die unterstrichenen Ausdrücke durch Modalverben!",
  "91": "91. Übung zu Modalverben",
  "92": "92. Formulieren Sie um!",
  "93": "93. Formulieren Sie um!",
  "94": "94. Formulieren Sie um!",
  "95": "95. Sagen Sie dasselbe noch einmal und benutzen Sie dabei ein Modalverb!",
  "96": "96. Schreiben Sie den Zeitungskommentar um und ersetzen Sie die unterstrichenen Modalverben!",
  "97": "97. Ersetzen Sie die Modalitätsverben \"haben\" und \"sein\" durch Modalverben!"
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

function highlightDifferencesAdvanced(correct, user) {
  const tokenize = (text) => {
    const tokens = [];
    const regex = /[\wäöüßÄÖÜ]+|[.,;:!?()\[\]{}"']+|\s+/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const matchedText = match[0];
      const normalized = matchedText.toLowerCase().replace(/[.,;:!?()\[\]{}"']/g, '');
      
      if (normalized && /[\wäöüß]/.test(normalized)) {
        tokens.push({
          text: matchedText,
          normalized: normalized,
          isWord: true
        });
      } else {
        tokens.push({
          text: matchedText,
          normalized: '',
          isWord: false
        });
      }
    }
    
    return tokens;
  };
  
  const correctTokens = tokenize(correct);
  const userTokens = tokenize(user);
  
  const correctWords = correctTokens.filter(t => t.isWord).map(t => t.normalized);
  const userWords = userTokens.filter(t => t.isWord).map(t => t.normalized);
  
  const wordMatches = new Set();
  let userIndex = 0;
  
  for (let i = 0; i < correctWords.length; i++) {
    const correctWord = correctWords[i];
    
    let found = false;
    
    if (userIndex < userWords.length && userWords[userIndex] === correctWord) {
      found = true;
      userIndex++;
    } else {
      const searchWindow = Math.min(3, userWords.length - userIndex);
      for (let j = 1; j <= searchWindow && userIndex + j < userWords.length; j++) {
        if (userWords[userIndex + j] === correctWord) {
          found = true;
          userIndex = userIndex + j + 1;
          break;
        }
      }
    }
    
    if (found) {
      wordMatches.add(i);
    }
  }
  
  let html = "";
  let wordIndex = 0;
  
  for (const token of correctTokens) {
    if (token.isWord) {
      if (wordMatches.has(wordIndex)) {
        html += escapeHtml(token.text);
      } else {
        html += '<span class="text-diff-missing">' + escapeHtml(token.text) + '</span>';
      }
      wordIndex++;
    } else {
      html += escapeHtml(token.text);
    }
  }
  
  return html;
}

// Function to mark modal verbs in text (for exercise 96)
function markModalVerbs(text) {
  // List of modal verbs and their forms
  const modalVerbs = [
    /\b(kann|kannst|kann|können|könnt|könnte|könntest|könnten|könntet)\b/gi,
    /\b(darf|darfst|darf|dürfen|dürft|dürfte|dürftest|dürften|dürftet)\b/gi,
    /\b(muss|musst|muss|müssen|müsst|müsste|müsstest|müssten|müsstet)\b/gi,
    /\b(soll|sollst|soll|sollen|sollt|sollte|solltest|sollten|solltet)\b/gi,
    /\b(will|willst|will|wollen|wollt|wollte|wolltest|wollten|wolltet)\b/gi,
    /\b(mag|magst|mag|mögen|mögt|möchte|möchtest|möchten|möchtet)\b/gi
  ];
  
  let markedText = text;
  
  modalVerbs.forEach(regex => {
    markedText = markedText.replace(regex, (match) => {
      return `<span class="modal-verb-mark">${match}</span>`;
    });
  });
  
  return markedText;
}

function extractExercises(text) {
  const exercises = {};
  const lines = text.split(/\r?\n/);
  let currentExercise = null;
  let currentItem = null;
  let inTextExercise = false;
  let inSolution = false;
  let originalLines = [];
  let solutionLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## 90. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["90", "91", "92", "93", "94", "95", "96", "97"].includes(num)) {
        // Save previous text exercise if exists
        if (inTextExercise && currentExercise) {
          exercises[currentExercise].originalText = originalLines.join("\n").trim();
          exercises[currentExercise].correctAnswer = solutionLines.join("\n").trim();
          originalLines = [];
          solutionLines = [];
        }
        
        currentExercise = num;
        exercises[num] = {
          number: num,
          title: title,
          items: [],
          originalText: "",
          correctAnswer: "",
          type: (num === "91" || num === "96") ? "text" : "items"
        };
        currentItem = null;
        inTextExercise = (num === "91" || num === "96");
        inSolution = false;
        continue;
      }
    }

    if (!currentExercise) continue;

    // Handle text exercises (91, 96)
    if (inTextExercise) {
      // Check for solution marker
      if (trimmedLine === "**Umformung:**" || trimmedLine === "**Lösung:**" || 
          trimmedLine === "**b) Schreiben Sie den Text um, indem Sie die unterstrichenen Ausdrücke durch die entsprechenden Modalverben ersetzen!**") {
        inSolution = true;
        continue;
      }
      
      // Skip headers and instructions
      if (trimmedLine.match(/^##\s+/) || trimmedLine.match(/^Quelle:/) || 
          trimmedLine.match(/^Versuchen Sie es!/) || trimmedLine.match(/^\*\*a\)/)) {
        continue;
      }
      
      if (inSolution) {
        if (line.trim() && !line.match(/^#/)) {
          solutionLines.push(line);
        }
      } else {
        if (line.trim() && !line.match(/^#/) && !line.match(/^Quelle:/)) {
          originalLines.push(line);
        }
      }
      continue;
    }

    // Handle item-based exercises (90, 92, 93, 94, 95, 97)
    // Skip subsection headers like **(1) Wünsche:** or **Andere Vermutungen:**
    if (trimmedLine.match(/^\*\*\(/) || trimmedLine.match(/^\*\*[^(]/)) {
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
        // Handle multiple answers separated by / (for exercise 97)
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

  // Save last text exercise if exists
  if (inTextExercise && currentExercise) {
    exercises[currentExercise].originalText = originalLines.join("\n").trim();
    exercises[currentExercise].correctAnswer = solutionLines.join("\n").trim();
  }

  return exercises;
}

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  // Show exercises 90, 91, 92, 93, 94, 95, 96, 97
  const allowedExercises = ["90", "91", "92", "93", "94", "95", "96", "97"];
  
  allowedExercises.forEach(num => {
    if (state.exercises[num]) {
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
  
  // Clear previous content
  exerciseList.innerHTML = "";
  
  if (exercise.type === "text") {
    // Text exercises (91, 96)
    state.originalText = exercise.originalText;
    state.correctAnswer = exercise.correctAnswer;
    
    // Create text exercise HTML
    let originalHtml = escapeHtml(state.originalText);
    
    // For exercise 96, mark modal verbs
    if (state.currentExercise === "96") {
      originalHtml = markModalVerbs(state.originalText);
    }
    
    exerciseList.innerHTML = `
      <div class="text-exercise-container">
        <div class="text-exercise-original">
          <h3>Originaltext</h3>
          <div id="original-text" class="text-exercise-text">${originalHtml}</div>
        </div>
        
        <div class="text-exercise-input-area">
          <h3>Ihre Antwort</h3>
          <textarea id="user-answer" class="text-exercise-textarea" placeholder="Schreiben Sie hier Ihre Antwort..."></textarea>
        </div>

        <div class="text-exercise-result" id="exercise-result" style="display: none;">
          <h3>Lösung</h3>
          <div id="correct-answer" class="text-exercise-text text-exercise-solution"></div>
        </div>
      </div>
    `;
    
    // Get new DOM elements
    originalTextEl = document.getElementById("original-text");
    userAnswerEl = document.getElementById("user-answer");
    exerciseResult = document.getElementById("exercise-result");
    correctAnswerEl = document.getElementById("correct-answer");
    
  } else {
    // Item-based exercises (90, 92, 93, 94, 95, 97)
    state.currentItems = exercise.items.map((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "exercise-item";
      itemDiv.dataset.index = index;
      
      // Handle multiple answers separated by / (for exercise 97)
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
  }
  
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
  const exercise = state.exercises[state.currentExercise];
  
  if (exercise.type === "text") {
    // Text exercises (91, 96)
    const userText = userAnswerEl.value.trim();
    
    if (!userText) {
      alert("Bitte geben Sie eine Antwort ein.");
      return;
    }
    
    exerciseResult.style.display = "block";
    
    const highlighted = highlightDifferencesAdvanced(state.correctAnswer, userText);
    correctAnswerEl.innerHTML = highlighted;
    
    exerciseResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    // Item-based exercises (90, 92, 93, 94, 95, 97)
    state.currentItems.forEach(itemDiv => {
      const feedback = itemDiv.querySelector(".exercise-feedback");
      const input = itemDiv.querySelector(".exercise-input");
      const correctAnswer = input.dataset.answer;
      const userAnswer = normalizeText(input.value);
      
      // Handle multiple correct answers separated by / (for exercise 97)
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
  
  if (exercise.type === "text") {
    // Text exercises (91, 96)
    if (userAnswerEl) {
      userAnswerEl.value = "";
    }
    if (exerciseResult) {
      exerciseResult.style.display = "none";
    }
    if (correctAnswerEl) {
      correctAnswerEl.innerHTML = "";
    }
  } else {
    // Item-based exercises (90, 92, 93, 94, 95, 97)
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

