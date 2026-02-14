const state = {
  questions: [],
  pronounPool: []
};

let testList;
let checkButton;
let resetButton;

// Pool de w-Pronomen comunes
const wPronounPool = [
  "was", "womit", "worüber", "wofür", "worauf", "wobei", "wonach", 
  "weswegen", "weshalb", "wodurch", "wovon", "woran", "wovor", 
  "wogegen", "worum", "wobei", "worin", "wovon", "woraus"
];

function shuffle(list) {
  const array = list.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeOption(value) {
  return value.trim().toLowerCase();
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

function buildSentence(sentence, pronounPool) {
  const tokenRegex = /\{wnb:([^}]+)\}/g;
  let result = "";
  let lastIndex = 0;
  let blankCount = 0;

  const blank = (correct) => {
    blankCount += 1;
    return renderSelect(correct, pronounPool, wPronounPool);
  };

  let match;
  while ((match = tokenRegex.exec(sentence)) !== null) {
    result += escapeHtml(sentence.slice(lastIndex, match.index));
    const pronoun = match[1].trim();
    result += blank(pronoun);
    lastIndex = tokenRegex.lastIndex;
  }

  result += escapeHtml(sentence.slice(lastIndex));
  return { html: result, blanks: blankCount };
}

function extractQuestions(text) {
  const lines = text.split(/\r?\n/);
  const questions = [];
  const pronounSet = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect exercise header
    if (line.match(/^##\s+66\./)) {
      continue;
    }
    
    // Match lines with number and sentence: "1. Sentence with {wnb:pronoun}..."
    const itemMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (itemMatch) {
      const itemNum = itemMatch[1];
      const sentence = itemMatch[2];
      
      // Extract all w-Pronomen tokens
      const tokenRegex = /\{wnb:([^}]+)\}/g;
      let tokenMatch;
      const pronouns = [];
      while ((tokenMatch = tokenRegex.exec(sentence)) !== null) {
        const pronoun = tokenMatch[1].trim();
        pronouns.push(pronoun);
        pronounSet.add(pronoun);
      }
      
      if (pronouns.length > 0) {
        questions.push({
          number: parseInt(itemNum, 10),
          sentence: sentence
        });
      }
    }
  }

  return {
    questions: questions,
    pronounPool: Array.from(pronounSet)
  };
}

function renderTest(questions) {
  testList.innerHTML = "";
  
  questions.forEach((question) => {
    const built = buildSentence(question.sentence, state.pronounPool);
    const itemDiv = document.createElement("div");
    itemDiv.className = "test-item";
    itemDiv.innerHTML = `
      <div class="test-sentence">
        ${question.number}. ${built.html}
      </div>
      <div class="test-feedback"></div>
    `;
    testList.appendChild(itemDiv);
  });
}

function checkTest() {
  const items = Array.from(testList.querySelectorAll(".test-item"));
  items.forEach((item) => {
    const selects = Array.from(item.querySelectorAll(".test-select"));
    const feedback = item.querySelector(".test-feedback");
    const answers = selects.map((select) => select.dataset.answer);

    item.classList.remove("is-correct", "is-wrong");

    const allAnswered = selects.every((select) => select.value);
    const allCorrect = selects.every((select) => {
      const userValue = normalizeOption(select.value);
      const correctValue = normalizeOption(select.dataset.answer);
      return userValue === correctValue;
    });

    if (!selects.length) {
      item.classList.add("is-wrong");
      feedback.textContent = "Keine Lücken vorhanden.";
      return;
    }

    if (allAnswered && allCorrect) {
      item.classList.add("is-correct");
      feedback.textContent = "Richtig";
    } else {
      item.classList.add("is-wrong");
      feedback.textContent = `Antworten: ${answers.join(", ")}`;
    }
  });
}

function resetTest() {
  const items = Array.from(testList.querySelectorAll(".test-item"));
  items.forEach((item) => {
    const selects = Array.from(item.querySelectorAll(".test-select"));
    const feedback = item.querySelector(".test-feedback");
    
    selects.forEach((select) => {
      select.value = "";
    });
    
    item.classList.remove("is-correct", "is-wrong");
    feedback.textContent = "";
  });
}

async function loadExercise() {
  try {
    const response = await fetch("content.md", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load content.md");
    }
    const text = await response.text();
    
    const data = extractQuestions(text);
    state.questions = data.questions;
    state.pronounPool = data.pronounPool.length > 0 ? data.pronounPool : wPronounPool;
    
    // Render all questions immediately
    renderTest(state.questions);
    checkButton.disabled = false;
    resetButton.disabled = false;
  } catch (error) {
    testList.innerHTML = "<p>Übung konnte nicht geladen werden.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  // Get DOM elements
  testList = document.getElementById("test-list");
  checkButton = document.getElementById("test-check");
  resetButton = document.getElementById("test-reset");

  if (!testList || !checkButton || !resetButton) {
    console.error("Required DOM elements not found");
    return;
  }

  checkButton.addEventListener("click", checkTest);
  resetButton.addEventListener("click", resetTest);
  
  loadExercise();
});

