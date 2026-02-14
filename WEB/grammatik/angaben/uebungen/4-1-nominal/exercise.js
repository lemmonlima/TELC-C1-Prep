let originalText = "";
let correctAnswer = "";

const originalTextEl = document.getElementById("original-text");
const userAnswerEl = document.getElementById("user-answer");
const checkButton = document.getElementById("check-answer");
const resetButton = document.getElementById("reset-answer");
const exerciseResult = document.getElementById("exercise-result");
const correctAnswerEl = document.getElementById("correct-answer");

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
  // Este algoritmo avanza en ambos textos, pero puede "saltar" palabras del usuario
  // si hay palabras extras, para mantener la alineación
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
      // Esto permite manejar pequeñas diferencias sin desalinear todo
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
      // Palabra encontrada en posición correcta o cercana
      wordMatches.add(i);
    }
    // Si no se encuentra, la palabra se marca como diferente
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

function checkAnswer() {
  const userText = userAnswerEl.value.trim();
  
  if (!userText) {
    alert("Bitte geben Sie eine Antwort ein.");
    return;
  }
  
  // Mostrar el resultado
  exerciseResult.style.display = "block";
  
  // Resaltar diferencias
  const highlighted = highlightDifferencesAdvanced(correctAnswer, userText);
  correctAnswerEl.innerHTML = highlighted;
  
  // Scroll al resultado
  exerciseResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function resetAnswer() {
  userAnswerEl.value = "";
  exerciseResult.style.display = "none";
  correctAnswerEl.innerHTML = "";
}

async function loadExercise() {
  try {
    const response = await fetch("content.md", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load exercise");
    }
    const text = await response.text();
    
    // Extraer texto original y solución
    const lines = text.split(/\r?\n/);
    let inOriginal = false;
    let inSolution = false;
    let originalLines = [];
    let solutionLines = [];
    
    for (const line of lines) {
      if (line.trim() === "**Lösung:**" || line.trim() === "**Lösung:**") {
        inOriginal = false;
        inSolution = true;
        continue;
      }
      
      if (line.match(/^##\s+21\./)) {
        continue;
      }
      
      if (line.match(/^Versuchen Sie es!/)) {
        continue;
      }
      
      if (inSolution) {
        if (line.trim() && !line.match(/^#/)) {
          solutionLines.push(line);
        }
      } else if (!inOriginal && line.trim() && !line.match(/^#/) && !line.match(/^Quelle:/)) {
        inOriginal = true;
        originalLines.push(line);
      } else if (inOriginal && line.trim() && !line.match(/^#/)) {
        originalLines.push(line);
      }
    }
    
    originalText = originalLines.join("\n").trim();
    correctAnswer = solutionLines.join("\n").trim();
    
    // Mostrar texto original
    originalTextEl.textContent = originalText;
    
  } catch (error) {
    console.error("Error loading exercise:", error);
    originalTextEl.textContent = "Fehler beim Laden der Übung.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");
  
  checkButton.addEventListener("click", checkAnswer);
  resetButton.addEventListener("click", resetAnswer);
  
  loadExercise();
  
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});

