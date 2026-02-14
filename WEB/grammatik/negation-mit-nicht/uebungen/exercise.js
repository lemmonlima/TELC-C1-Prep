const state = {
  items: [],
  currentItems: []
};

let exerciseContent;
let exerciseHeader;
let exerciseList;
let exerciseCheck;
let exerciseReset;

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

function extractExercise(text) {
  const items = [];
  const lines = text.split(/\r?\n/);
  let currentItem = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip header lines
    if (trimmedLine.match(/^#/) || trimmedLine.match(/^Quelle:/)) {
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
        // Remove bold markers from answer
        currentItem.answer = answerPart.replace(/\*\*/g, "");
      } else {
        // No arrow in same line - original is the full content (will be updated by next line with →)
        currentItem.original = content;
      }
      
      items.push(currentItem);
      continue;
    }

    // Handle continuation lines
    if (currentItem) {
      // Lines starting with → (answer continuation)
      if (trimmedLine.startsWith("→")) {
        const answerPart = trimmedLine.slice(1).trim();
        // Remove bold markers from answer
        currentItem.answer = answerPart.replace(/\*\*/g, "");
      }
      // Lines starting with spaces and → (indented answer)
      else if (line.match(/^\s+→/)) {
        const answerPart = trimmedLine.slice(1).trim();
        // Remove bold markers from answer
        currentItem.answer = answerPart.replace(/\*\*/g, "");
      }
    }
  }

  return items;
}

function renderExercise() {
  exerciseHeader.innerHTML = `<h3>114. Setzen Sie "nicht" an die richtige Stelle! (Satznegation!)</h3>`;
  
  exerciseList.innerHTML = "";
  state.currentItems = state.items.map((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "exercise-item";
    itemDiv.dataset.index = index;
    
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
    
    exerciseList.appendChild(itemDiv);
    return itemDiv;
  });
  
  exerciseContent.style.display = "block";
}

function checkExercise() {
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
  exerciseContent = document.getElementById("exercise-content");
  exerciseHeader = document.getElementById("exercise-header");
  exerciseList = document.getElementById("exercise-list");
  exerciseCheck = document.getElementById("exercise-check");
  exerciseReset = document.getElementById("exercise-reset");

  // Load content and render immediately
  fetch("content.md")
    .then(response => response.text())
    .then(text => {
      state.items = extractExercise(text);
      renderExercise();
    })
    .catch(error => {
      console.error("Error loading content:", error);
    });

  // Event listeners
  exerciseCheck.addEventListener("click", checkExercise);
  exerciseReset.addEventListener("click", resetExercise);

  // Animation
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});

