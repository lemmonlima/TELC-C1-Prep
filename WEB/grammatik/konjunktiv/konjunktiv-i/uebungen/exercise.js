const state = {
  exercises: {},
  currentExercise: null,
  currentOriginalText: "",
  currentCorrectAnswer: ""
};

let exerciseSelect;
let exerciseStart;
let exerciseContent;
let exerciseHeader;
let originalTextEl;
let userAnswerEl;
let checkButton;
let resetButton;
let exerciseResult;
let correctAnswerEl;

const exerciseLabels = {
  "86": "86. Bilden Sie die indirekte bzw. direkte Rede!",
  "87": "87. Bilden Sie die indirekte Rede!",
  "88": "88. Bilden Sie die indirekte Rede!",
  "89": "89. Bilden Sie die direkte Rede!"
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
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function highlightDifferencesAdvanced(correct, user) {
  // Tokenizar preservando el orden y formato original
  // Incluir caracteres especiales alemanes: ä, ö, ü, ß, Ä, Ö, Ü
  const tokenize = (text) => {
    const tokens = [];
    // Regex que incluye caracteres alemanes: [\wäöüßÄÖÜ]+
    const regex = /[\wäöüßÄÖÜ]+|[.,;:!?()\[\]{}"']+|\s+/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const matchedText = match[0];
      // Normalizar solo eliminando puntuación, preservando umlauts y ß
      const normalized = matchedText.toLowerCase().replace(/[.,;:!?()\[\]{}"']/g, '');
      
      // Verificar si es una palabra (contiene letras, incluyendo caracteres alemanes)
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
  
  // Extraer solo las palabras en orden
  const correctWords = correctTokens.filter(t => t.isWord).map(t => t.normalized);
  const userWords = userTokens.filter(t => t.isWord).map(t => t.normalized);
  
  // Comparar secuencialmente palabra por palabra con algoritmo mejorado
  const wordMatches = new Set();
  let userIndex = 0;
  
  for (let i = 0; i < correctWords.length; i++) {
    const correctWord = correctWords[i];
    
    // Buscar la palabra en el texto del usuario empezando desde userIndex
    let found = false;
    let foundIndex = -1;
    
    // Primero verificar si coincide en la posición actual
    if (userIndex < userWords.length && userWords[userIndex] === correctWord) {
      found = true;
      foundIndex = userIndex;
      userIndex++; // Avanzar normalmente
    } else {
      // Buscar en las siguientes 3 posiciones (ventana pequeña para palabras extras)
      const searchWindow = Math.min(3, userWords.length - userIndex);
      for (let j = 1; j <= searchWindow && userIndex + j < userWords.length; j++) {
        if (userWords[userIndex + j] === correctWord) {
          found = true;
          foundIndex = userIndex + j;
          // Avanzar userIndex hasta después de la palabra encontrada
          userIndex = userIndex + j + 1;
          break;
        }
      }
    }
    
    if (found) {
      wordMatches.add(i);
    }
  }
  
  // Construir HTML preservando formato original
  let html = "";
  let wordIndex = 0;
  
  for (const token of correctTokens) {
    if (token.isWord) {
      if (wordMatches.has(wordIndex)) {
        // Palabra correcta en posición correcta
        html += escapeHtml(token.text);
      } else {
        // Palabra diferente, faltante o en posición incorrecta
        html += '<span class="text-diff-missing">' + escapeHtml(token.text) + '</span>';
      }
      wordIndex++;
    } else {
      // Puntuación o espacios - mantener
      html += escapeHtml(token.text);
    }
  }
  
  return html;
}

function extractExercises(text) {
  const exercises = {};
  const lines = text.split(/\r?\n/);
  let currentExercise = null;
  let currentSection = null; // "original", "direkte", "indirekte"
  let originalLines = [];
  let direkteLines = [];
  let indirekteLines = [];
  let firstDirekteDone = false; // Para ejercicio 86, solo tomar la primera

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect exercise header (## 86. ...)
    const exerciseMatch = trimmedLine.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (exerciseMatch) {
      const num = exerciseMatch[1];
      const title = exerciseMatch[2];
      if (["86", "87", "88", "89"].includes(num)) {
        // Guardar ejercicio anterior si existe
        if (currentExercise) {
          // Determinar texto original y solución según el ejercicio
          if (currentExercise === "86") {
            // Ejercicio 86: primera direkte como original, primera indirekte como solución
            exercises[currentExercise].originalText = direkteLines.join("\n").trim();
            exercises[currentExercise].correctAnswer = indirekteLines.join("\n").trim();
          } else if (currentExercise === "87") {
            // Ejercicio 87: direkte -> indirekte
            exercises[currentExercise].originalText = direkteLines.join("\n").trim();
            exercises[currentExercise].correctAnswer = indirekteLines.join("\n").trim();
          } else if (currentExercise === "88") {
            // Ejercicio 88: texto original -> indirekte
            exercises[currentExercise].originalText = originalLines.join("\n").trim();
            exercises[currentExercise].correctAnswer = indirekteLines.join("\n").trim();
          } else if (currentExercise === "89") {
            // Ejercicio 89: indirekte -> direkte
            exercises[currentExercise].originalText = indirekteLines.join("\n").trim();
            exercises[currentExercise].correctAnswer = direkteLines.join("\n").trim();
          }
        }
        
        currentExercise = num;
        exercises[num] = {
          number: num,
          title: title,
          originalText: "",
          correctAnswer: ""
        };
        currentSection = null;
        originalLines = [];
        direkteLines = [];
        indirekteLines = [];
        firstDirekteDone = false;
        continue;
      }
    }

    if (!currentExercise) continue;

    // Ignorar líneas de encabezado y metadata
    if (trimmedLine.match(/^#/) || trimmedLine.match(/^Quelle:/) || !trimmedLine) {
      continue;
    }
    
    // Ignorar líneas de contexto (ej: "Frau von Berneburg berichtet:", "Ein politischer Flüchtling sprach...")
    if (trimmedLine.match(/^(Frau|Ein|Der|Die|Wegen).*:$/) && !trimmedLine.match(/\*\*/)) {
      continue;
    }
    
    // Detectar secciones
    if (trimmedLine === "**direkte Rede:**" || trimmedLine.match(/^\*\*direkte Rede:\*\*$/)) {
      // Para ejercicio 86, solo procesar la primera direkte Rede
      if (currentExercise === "86" && firstDirekteDone) {
        currentSection = null;
        continue;
      }
      currentSection = "direkte";
      if (currentExercise === "86") {
        firstDirekteDone = true;
      }
      continue;
    }
    
    if (trimmedLine === "**indirekte Rede:**" || trimmedLine.match(/^\*\*indirekte Rede:\*\*$/)) {
      // Para ejercicio 86, solo procesar la primera indirekte Rede
      if (currentExercise === "86" && indirekteLines.length > 0) {
        currentSection = null;
        continue;
      }
      currentSection = "indirekte";
      continue;
    }
    
    // Agregar líneas según la sección actual
    if (currentSection === "direkte") {
      direkteLines.push(line);
    } else if (currentSection === "indirekte") {
      indirekteLines.push(line);
    } else {
      // Si no hay sección específica, es texto original (ejercicio 88)
      // Pero solo si no es una línea vacía o de contexto
      if (trimmedLine && !trimmedLine.match(/^(Frau|Ein|Der|Die|Wegen).*:$/)) {
        // Para ejercicio 88, el texto original viene antes de "indirekte Rede:"
        if (currentExercise === "88") {
          originalLines.push(line);
        }
      }
    }
  }
  
  // Guardar último ejercicio
  if (currentExercise) {
    if (currentExercise === "86") {
      exercises[currentExercise].originalText = direkteLines.join("\n").trim();
      exercises[currentExercise].correctAnswer = indirekteLines.join("\n").trim();
    } else if (currentExercise === "87") {
      exercises[currentExercise].originalText = direkteLines.join("\n").trim();
      exercises[currentExercise].correctAnswer = indirekteLines.join("\n").trim();
    } else if (currentExercise === "88") {
      exercises[currentExercise].originalText = originalLines.join("\n").trim();
      exercises[currentExercise].correctAnswer = indirekteLines.join("\n").trim();
    } else if (currentExercise === "89") {
      exercises[currentExercise].originalText = indirekteLines.join("\n").trim();
      exercises[currentExercise].correctAnswer = direkteLines.join("\n").trim();
    }
  }

  return exercises;
}

function updateExerciseSelect() {
  exerciseSelect.innerHTML = '<option value="">Bitte wählen...</option>';
  
  // Show exercises 86, 87, 88, 89
  const allowedExercises = ["86", "87", "88", "89"];
  
  allowedExercises.forEach(num => {
    if (state.exercises[num] && state.exercises[num].originalText && state.exercises[num].correctAnswer) {
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
  
  // Mostrar texto original
  originalTextEl.textContent = exercise.originalText;
  
  // Limpiar textarea y resultado
  userAnswerEl.value = "";
  exerciseResult.style.display = "none";
  correctAnswerEl.innerHTML = "";
  
  exerciseContent.style.display = "block";
}

function startExercise() {
  const selected = exerciseSelect.value;
  if (!selected) return;
  
  state.currentExercise = selected;
  const exercise = state.exercises[selected];
  state.currentOriginalText = exercise.originalText;
  state.currentCorrectAnswer = exercise.correctAnswer;
  renderExercise();
}

function checkAnswer() {
  const userText = userAnswerEl.value.trim();
  
  if (!userText) {
    alert("Bitte geben Sie eine Antwort ein.");
    return;
  }
  
  // Mostrar el resultado
  exerciseResult.style.display = "block";
  
  // Resaltar diferencias
  const highlighted = highlightDifferencesAdvanced(state.currentCorrectAnswer, userText);
  correctAnswerEl.innerHTML = highlighted;
  
  // Scroll al resultado
  exerciseResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function resetAnswer() {
  userAnswerEl.value = "";
  exerciseResult.style.display = "none";
  correctAnswerEl.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
  exerciseSelect = document.getElementById("exercise-select");
  exerciseStart = document.getElementById("exercise-start");
  exerciseContent = document.getElementById("exercise-content");
  exerciseHeader = document.getElementById("exercise-header");
  originalTextEl = document.getElementById("original-text");
  userAnswerEl = document.getElementById("user-answer");
  checkButton = document.getElementById("check-answer");
  resetButton = document.getElementById("reset-answer");
  exerciseResult = document.getElementById("exercise-result");
  correctAnswerEl = document.getElementById("correct-answer");

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
  checkButton.addEventListener("click", checkAnswer);
  resetButton.addEventListener("click", resetAnswer);

  // Animation
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});

