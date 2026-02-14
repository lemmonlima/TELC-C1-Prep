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

// For text exercises (100)
let originalTextEl;
let userAnswerEl;
let exerciseResult;
let correctAnswerEl;

// For dropdown exercises (104)
let verbPool = [];

const exerciseLabels = {
  "98": "98. Bilden Sie Passivsätze!",
  "99": "99. Formen Sie die Sätze ins Aktiv bzw. ins Passiv um!",
  "100": "100. Formen Sie den folgenden Text um!",
  "101": "101. Finden Sie gleichbedeutende Umschreibungen!",
  "102": "102. Übung zum \"sein\"-Passiv",
  "103": "103. Beschreiben Sie den eingetretenen Zustand!",
  "104": "104. \"werden\"-Passiv? \"sein\"-Passiv? Adjektiv-Prädikat?"
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

function shuffle(list) {
  const array = list.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildOptions(correct, pool, fallback = []) {
  const options = new Set([normalizeText(correct)]);
  shuffle(pool).forEach((item) => {
    const normalized = normalizeText(item);
    if (options.size < 4 && normalized !== normalizeText(correct)) {
      options.add(normalized);
    }
  });
  if (options.size < 4) {
    shuffle(fallback).forEach((item) => {
      const normalized = normalizeText(item);
      if (options.size < 4 && normalized !== normalizeText(correct)) {
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
      return `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`;
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

// Conjugations of sein and werden for exercise 104
const seinConjugations = [
  "bin", "bist", "ist", "sind", "seid", "war", "warst", "waren", "wart", "gewesen"
];

const werdenConjugations = [
  "werde", "wirst", "wird", "werden", "werdet", "wurde", "wurdest", "wurden", "wurdet", "geworden"
];

const fallbackVerbPool = [...seinConjugations, ...werdenConjugations];

// Function to extract only the auxiliary verb (sein/werden) from a full form
function extractAuxiliaryVerb(fullForm) {
  const normalized = fullForm.toLowerCase().trim();
  
  // Check if it's just a conjugation (no participio)
  if (seinConjugations.includes(normalized) || werdenConjugations.includes(normalized)) {
    return normalized;
  }
  
  // Check for patterns like "wird vermietet", "ist abgeschlossen", "abgeschlossen sind", etc.
  // Split by spaces and find the auxiliary verb
  const words = normalized.split(/\s+/);
  
  for (const word of words) {
    if (seinConjugations.includes(word)) {
      return word;
    }
    if (werdenConjugations.includes(word)) {
      return word;
    }
  }
  
  // If no auxiliary found, return the original (might be just participio/adjective)
  return normalized;
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
  let verbSet = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## 98. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["98", "99", "100", "101", "102", "103", "104"].includes(num)) {
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
          type: (num === "100") ? "text" : (num === "104") ? "dropdown" : "items"
        };
        currentItem = null;
        inTextExercise = (num === "100");
        inSolution = false;
        continue;
      }
    }

    if (!currentExercise) continue;

    // Handle text exercise (100)
    if (inTextExercise) {
      if (trimmedLine === "**Lösung:**") {
        inSolution = true;
        continue;
      }
      
      if (trimmedLine.match(/^##\s+/) || trimmedLine.match(/^Quelle:/)) {
        continue;
      }
      
      if (inSolution) {
        if (line.trim() && !line.match(/^#/)) {
          solutionLines.push(line);
        }
      } else {
        if (line.trim() && !line.match(/^#/) && !line.match(/^Quelle:/) && !trimmedLine.match(/^Durch die Umformung/)) {
          originalLines.push(line);
        }
      }
      continue;
    }

    // Handle item-based exercises (98, 99, 101, 102, 103, 104)
    // Skip subsection headers
    if (trimmedLine.match(/^\*\*[^(]/) && !trimmedLine.match(/^\*\*Lösung/)) {
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
        answers: [], // Array for multiple correct answers (exercise 101)
        answer: "", // Single answer for other exercises
        type: (currentExercise === "101") ? "multiple-answers" : (currentExercise === "104") ? "dropdown" : "text"
      };
      
      // For exercise 104, extract all verbs from bold text
      if (currentExercise === "104") {
        const boldMatches = content.match(/\*\*([^*]+)\*\*/g);
        if (boldMatches && boldMatches.length > 0) {
          let sentence = content;
          const verbs = [];
          const auxiliaries = []; // Store only auxiliary verbs for dropdowns
          
          boldMatches.forEach(match => {
            const fullForm = match.replace(/\*\*/g, "").trim();
            const normalizedForm = fullForm.toLowerCase();
            
            // Check if the bold text contains a participle + auxiliary (e.g., "geschrieben werden")
            const words = fullForm.split(/\s+/);
            let hasAuxiliary = false;
            let auxiliaryWord = null;
            let participlePart = null;
            
            // Check if any word is a sein/werden conjugation
            for (let i = 0; i < words.length; i++) {
              const word = words[i].toLowerCase();
              if (seinConjugations.includes(word) || werdenConjugations.includes(word)) {
                hasAuxiliary = true;
                auxiliaryWord = word;
                // Everything before this word is the participle
                participlePart = words.slice(0, i).join(" ");
                break;
              }
            }
            
            // Also check if it's just a participle/adjective (not sein/werden)
            const isOnlyParticiple = !seinConjugations.includes(normalizedForm) && 
                                     !werdenConjugations.includes(normalizedForm) &&
                                     !hasAuxiliary;
            
            if (hasAuxiliary && participlePart) {
              // Case: "geschrieben werden" - keep participle visible, replace auxiliary
              sentence = sentence.replace(match, participlePart + " _____");
              
              verbs.push(fullForm); // Full form for feedback
              auxiliaries.push(auxiliaryWord);
              verbSet.add(auxiliaryWord);
            } else if (isOnlyParticiple) {
              // Keep the participle visible, find the auxiliary verb nearby
              // First, remove bold from participle
              sentence = sentence.replace(match, fullForm);
              
              // Create regex pattern to find sein/werden conjugations
              const auxPattern = new RegExp(`\\b(${seinConjugations.join('|')}|${werdenConjugations.join('|')})\\b`, 'gi');
              
              // Try to find auxiliary after the participle first (most common)
              const participleIndex = sentence.indexOf(fullForm);
              const afterText = sentence.substring(participleIndex + fullForm.length);
              let auxMatch = afterText.match(auxPattern);
              
              // If not found after, look before
              if (!auxMatch) {
                const beforeText = sentence.substring(0, participleIndex);
                auxMatch = beforeText.match(auxPattern);
              }
              
              if (auxMatch) {
                const foundAuxiliary = auxMatch[0].toLowerCase();
                // Replace the auxiliary verb with blank (use word boundary to avoid partial matches)
                const auxRegex = new RegExp(`\\b${foundAuxiliary}\\b`, 'i');
                sentence = sentence.replace(auxRegex, "_____");
                
                verbs.push(fullForm + " " + foundAuxiliary); // Full form for feedback
                auxiliaries.push(foundAuxiliary);
                verbSet.add(foundAuxiliary);
              } else {
                // Fallback: couldn't find auxiliary, just keep participle
                verbs.push(fullForm);
                auxiliaries.push(normalizedForm);
                verbSet.add(normalizedForm);
              }
            } else {
              // It's a sein/werden conjugation only, replace with blank
              const auxiliary = extractAuxiliaryVerb(fullForm);
              verbs.push(fullForm);
              auxiliaries.push(auxiliary);
              verbSet.add(auxiliary);
              sentence = sentence.replace(match, "_____");
            }
          });
          
          currentItem.original = sentence.trim();
          // Store full forms for display, auxiliaries for checking
          currentItem.answer = verbs.join(" / ");
          currentItem.verbs = verbs; // Full forms for feedback
          currentItem.auxiliaries = auxiliaries; // Auxiliaries for dropdowns and checking
        } else {
          currentItem.original = content;
          currentItem.answer = "";
          currentItem.verbs = [];
          currentItem.auxiliaries = [];
        }
      } else {
        // Check if arrow is in same line
        const arrowIndex = content.indexOf("→");
        if (arrowIndex !== -1) {
          currentItem.original = content.slice(0, arrowIndex).trim();
          const answerPart = content.slice(arrowIndex + 1).trim();
          
          if (currentExercise === "101") {
            // Exercise 101: multiple answers separated by / or multiple lines
            currentItem.answers = [answerPart];
          } else {
            currentItem.answer = answerPart;
          }
        } else {
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
        // Remove parenthetical notes like "(Vorsicht: ...)" or "(verkäuflich!)"
        const cleanAnswer = answerPart.replace(/\s*\([^)]+\)\s*$/, "").trim();
        if (currentExercise === "101") {
          // Exercise 101: add to answers array
          if (cleanAnswer) {
            currentItem.answers.push(cleanAnswer);
          }
        } else {
          currentItem.answer = cleanAnswer;
        }
      }
      // Lines starting with spaces and → (indented answer)
      else if (line.match(/^\s+→/)) {
        const answerPart = trimmedLine.slice(1).trim();
        const cleanAnswer = answerPart.replace(/\s*\([^)]+\)\s*$/, "").trim();
        if (currentExercise === "101") {
          if (cleanAnswer) {
            currentItem.answers.push(cleanAnswer);
          }
        } else {
          currentItem.answer = cleanAnswer;
        }
      }
      // For exercise 101, handle lines that are just parenthetical notes
      else if (currentExercise === "101" && trimmedLine.match(/^\(/)) {
        // Skip parenthetical notes
        continue;
      }
    }
  }

  // Save last text exercise if exists
  if (inTextExercise && currentExercise) {
    exercises[currentExercise].originalText = originalLines.join("\n").trim();
    exercises[currentExercise].correctAnswer = solutionLines.join("\n").trim();
  }

  // Build verb pool for exercise 104
  verbPool = Array.from(verbSet);

  return exercises;
}

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  const allowedExercises = ["98", "99", "100", "101", "102", "103", "104"];
  
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
  
  exerciseList.innerHTML = "";
  
  if (exercise.type === "text") {
    // Text exercise (100)
    state.originalText = exercise.originalText;
    state.correctAnswer = exercise.correctAnswer;
    
    exerciseList.innerHTML = `
      <div class="text-exercise-container">
        <div class="text-exercise-original">
          <h3>Originaltext</h3>
          <div id="original-text" class="text-exercise-text">${escapeHtml(state.originalText)}</div>
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
    
    originalTextEl = document.getElementById("original-text");
    userAnswerEl = document.getElementById("user-answer");
    exerciseResult = document.getElementById("exercise-result");
    correctAnswerEl = document.getElementById("correct-answer");
    
  } else if (exercise.type === "dropdown") {
    // Dropdown exercise (104)
    state.currentItems = exercise.items.map((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "test-item";
      itemDiv.dataset.index = index;
      
      // Replace each blank with a dropdown (using auxiliaries, not full forms)
      let blankIndex = 0;
      const sentence = item.original.replace(/_____/g, (match) => {
        const auxiliary = item.auxiliaries && item.auxiliaries[blankIndex] ? item.auxiliaries[blankIndex] : extractAuxiliaryVerb(item.answer);
        blankIndex++;
        return renderSelect(auxiliary, verbPool, fallbackVerbPool);
      });
      
      // Store full forms for feedback display, auxiliaries for checking
      itemDiv.dataset.answers = JSON.stringify(item.verbs || [item.answer]);
      itemDiv.dataset.auxiliaries = JSON.stringify(item.auxiliaries || [extractAuxiliaryVerb(item.answer)]);
      
      itemDiv.innerHTML = `
        <div class="test-item-number">${item.number}.</div>
        <div class="test-item-content">
          <div class="test-sentence">${sentence}</div>
          <div class="test-feedback"></div>
        </div>
      `;
      
      exerciseList.appendChild(itemDiv);
      return itemDiv;
    });
  } else {
    // Item-based exercises (98, 99, 101, 102, 103)
    state.currentItems = exercise.items.map((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "exercise-item";
      itemDiv.dataset.index = index;
      
      // Handle multiple answers for exercise 101
      const answerText = (item.type === "multiple-answers" && item.answers.length > 0) 
        ? item.answers.join(" / ") 
        : item.answer;
      
      itemDiv.innerHTML = `
        <div class="exercise-item-number">${item.number}.</div>
        <div class="exercise-item-content">
          <div class="exercise-original">${escapeHtml(item.original)}</div>
          <div class="exercise-input-wrapper">
            <input type="text" class="exercise-input" data-answer="${escapeHtml(answerText)}" data-answers="${item.type === "multiple-answers" ? escapeHtml(JSON.stringify(item.answers)) : ""}" placeholder="Ihre Antwort eingeben..." />
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
    // Text exercise (100)
    const userText = userAnswerEl.value.trim();
    
    if (!userText) {
      alert("Bitte geben Sie eine Antwort ein.");
      return;
    }
    
    exerciseResult.style.display = "block";
    
    const highlighted = highlightDifferencesAdvanced(state.correctAnswer, userText);
    correctAnswerEl.innerHTML = highlighted;
    
    exerciseResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else if (exercise.type === "dropdown") {
    // Dropdown exercise (104)
    state.currentItems.forEach(itemDiv => {
      const feedback = itemDiv.querySelector(".test-feedback");
      const selects = itemDiv.querySelectorAll(".test-select");
      let allCorrect = true;
      
      // Get correct auxiliaries and full forms from dataset
      const correctAuxiliaries = JSON.parse(itemDiv.dataset.auxiliaries || "[]");
      const correctAnswers = JSON.parse(itemDiv.dataset.answers || "[]");
      
      selects.forEach((select, index) => {
        const correctAuxiliary = correctAuxiliaries[index] || extractAuxiliaryVerb(select.dataset.answer);
        const userAnswer = normalizeText(select.value);
        
        if (normalizeText(correctAuxiliary) !== userAnswer) {
          allCorrect = false;
        }
      });
      
      // Always show feedback, even if fields are empty
      if (allCorrect && selects.length > 0 && Array.from(selects).every(s => s.value)) {
        itemDiv.classList.add("is-correct");
        itemDiv.classList.remove("is-wrong");
        feedback.innerHTML = '<span class="feedback-correct">Richtig!</span>';
      } else {
        itemDiv.classList.add("is-wrong");
        itemDiv.classList.remove("is-correct");
        feedback.innerHTML = `<span class="feedback-wrong">Antwort: ${escapeHtml(correctAnswers.join(" / "))}</span>`;
      }
    });
  } else {
    // Item-based exercises (98, 99, 101, 102, 103)
    state.currentItems.forEach(itemDiv => {
      const feedback = itemDiv.querySelector(".exercise-feedback");
      const input = itemDiv.querySelector(".exercise-input");
      const answerData = input.dataset.answers;
      const userAnswer = normalizeText(input.value);
      
      let isCorrect = false;
      let correctAnswerText = "";
      
      // Exercise 101: multiple correct answers
      if (answerData) {
        try {
          const correctAnswers = JSON.parse(answerData);
          correctAnswerText = correctAnswers.join(" / ");
          isCorrect = correctAnswers.some(correct => normalizeText(correct) === userAnswer);
        } catch (e) {
          // Fallback to single answer
          const correctAnswer = input.dataset.answer;
          correctAnswerText = correctAnswer;
          isCorrect = normalizeText(correctAnswer) === userAnswer;
        }
      } else {
        // Single answer (98, 99, 102, 103)
        const correctAnswer = input.dataset.answer;
        correctAnswerText = correctAnswer;
        isCorrect = normalizeText(correctAnswer) === userAnswer;
      }
      
      if (isCorrect) {
        itemDiv.classList.add("is-correct");
        itemDiv.classList.remove("is-wrong");
        feedback.innerHTML = '<span class="feedback-correct">Richtig!</span>';
        input.classList.add("is-correct");
        input.classList.remove("is-wrong");
      } else {
        itemDiv.classList.add("is-wrong");
        itemDiv.classList.remove("is-correct");
        feedback.innerHTML = `<span class="feedback-wrong">Antwort: ${escapeHtml(correctAnswerText)}</span>`;
        input.classList.add("is-wrong");
        input.classList.remove("is-correct");
      }
    });
  }
}

function resetExercise() {
  const exercise = state.exercises[state.currentExercise];
  
  if (exercise.type === "text") {
    if (userAnswerEl) {
      userAnswerEl.value = "";
    }
    if (exerciseResult) {
      exerciseResult.style.display = "none";
    }
    if (correctAnswerEl) {
      correctAnswerEl.innerHTML = "";
    }
  } else if (exercise.type === "dropdown") {
    state.currentItems.forEach(itemDiv => {
      const selects = itemDiv.querySelectorAll(".test-select");
      const feedback = itemDiv.querySelector(".test-feedback");
      
      selects.forEach(select => {
        select.value = "";
      });
      
      itemDiv.classList.remove("is-correct", "is-wrong");
      feedback.innerHTML = "";
    });
  } else {
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

