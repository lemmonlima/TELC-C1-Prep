const state = {
  decks: {
    verben: [],
    nomen: [],
    adjektive: []
  },
  currentDeck: [],
  currentIndex: 0,
  currentTopic: "verben"
};

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(value) {
  let line = escapeHtml(value);
  line = line.replace(/`([^`]+)`/g, "<code>$1</code>");
  line = line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  line = line.replace(/\{v:([^}]+)\}/g, '<span class="mark mark-verb">$1</span>');
  line = line.replace(/\{adj:([^}]+)\}/g, '<span class="mark mark-adj">$1</span>');
  line = line.replace(/\{p:([^}]+)\}/g, '<span class="mark mark-prep">$1</span>');
  line = line.replace(/\{a:([^}]+)\}/g, '<span class="mark mark-a">$1</span>');
  line = line.replace(/\{d:([^}]+)\}/g, '<span class="mark mark-d">$1</span>');
  line = line.replace(/\{g:([^}]+)\}/g, '<span class="mark mark-g">$1</span>');
  line = line.replace(/\{n:([^}]+)\}/g, '<span class="mark mark-n">$1</span>');
  return line;
}

const topicSelect = document.getElementById("flash-topic");
const countInput = document.getElementById("flash-count");
const startButton = document.getElementById("flash-start");
const availableLabel = document.getElementById("flash-available");
const stage = document.getElementById("flash-stage");
const emptyState = document.getElementById("flash-empty");
const flashcard = document.getElementById("flashcard");
const flashcardTopic = document.getElementById("flashcard-topic");
const flashcardTerm = document.getElementById("flashcard-term");
const flashcardAnswer = document.getElementById("flashcard-answer");
const flashcardExample = document.getElementById("flashcard-example");
const progressBar = document.getElementById("flash-progress-bar");
const progressText = document.getElementById("flash-progress-text");
const prevButton = document.getElementById("flash-prev");
const nextButton = document.getElementById("flash-next");
const flipButton = document.getElementById("flash-flip");
const exitButton = document.getElementById("flash-exit");

const topicLabels = {
  verben: "Verben",
  nomen: "Nomen",
  adjektive: "Adjektive"
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function shuffle(list) {
  const array = list.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function extractCards(text, tag) {
  const lines = text.split(/\r?\n/);
  const map = new Map();

  const getLeftSide = (line) => {
    let depth = 0;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === "{") {
        depth += 1;
      } else if (char === "}") {
        depth = Math.max(depth - 1, 0);
      } else if (char === ":" && depth === 0) {
        return line.slice(0, i);
      }
    }
    return line;
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!/^-\s+/.test(line)) return;
    if (!line.includes(`{${tag}:`)) return;
    if (!line.includes("{p:")) return;

    const leftSide = getLeftSide(line);
    const rightSide = line.slice(leftSide.length + 1).trim();
    const terms = [...leftSide.matchAll(new RegExp(`\\{${tag}:([^}]+)\\}`, "g"))]
      .map((match) => match[1].trim())
      .filter(Boolean);
    const preps = [...leftSide.matchAll(/\{p:([^}]+)\}/g)]
      .map((match) => match[1].trim())
      .filter(Boolean);

    if (!terms.length || !preps.length) return;

    terms.forEach((term) => {
      const existing = map.get(term) || { preps: [], example: "" };
      preps.forEach((prep) => {
        if (!existing.preps.includes(prep)) {
          existing.preps.push(prep);
        }
      });
      if (!existing.example && rightSide) {
        existing.example = rightSide;
      }
      map.set(term, existing);
    });
  });

  return Array.from(map.entries()).map(([term, data]) => ({
    term,
    preps: data.preps,
    example: data.example
  }));
}

function updateTopicOptions() {
  Object.keys(topicLabels).forEach((topic) => {
    const option = topicSelect.querySelector(`option[value="${topic}"]`);
    if (!option) return;
    const count = state.decks[topic].length;
    option.textContent = `${topicLabels[topic]} (${count})`;
  });
}

function updateAvailable() {
  const topic = topicSelect.value;
  const available = state.decks[topic].length;
  availableLabel.textContent = `Verfuegbar: ${available}`;

  if (available === 0) {
    countInput.value = 0;
    countInput.max = 0;
    startButton.disabled = true;
    return;
  }

  countInput.min = 1;
  countInput.max = available;
  const currentValue = Number.parseInt(countInput.value, 10);
  const nextValue = Number.isNaN(currentValue) || currentValue < 1
    ? Math.min(10, available)
    : clamp(currentValue, 1, available);
  countInput.value = nextValue;
  startButton.disabled = false;
}

function setEmptyState(message) {
  stage.dataset.empty = "true";
  emptyState.textContent = message;
  flashcard.classList.remove("is-flipped");
}

function setActiveState() {
  stage.dataset.empty = "false";
  flashcard.classList.remove("is-flipped");
}

function updateCard() {
  if (!state.currentDeck.length) {
    progressText.textContent = "0 / 0";
    progressBar.style.width = "0%";
    return;
  }

  const card = state.currentDeck[state.currentIndex];
  flashcardTopic.textContent = topicLabels[state.currentTopic];
  flashcardTerm.textContent = card.term;
  flashcardAnswer.textContent = card.preps.join(" / ");
  flashcardExample.innerHTML = card.example
    ? formatInline(card.example)
    : "—";
  flashcard.classList.remove("is-flipped");

  const progress = (state.currentIndex + 1) / state.currentDeck.length;
  progressBar.style.width = `${Math.round(progress * 100)}%`;
  progressText.textContent = `${state.currentIndex + 1} / ${state.currentDeck.length}`;

  prevButton.disabled = state.currentIndex === 0;
  nextButton.disabled = state.currentIndex >= state.currentDeck.length - 1;
  flipButton.disabled = false;
}

function startFlashcards() {
  const topic = topicSelect.value;
  const available = state.decks[topic];
  if (!available || !available.length) {
    setEmptyState("Keine Karten fuer dieses Thema verfuegbar.");
    return;
  }

  const requested = Number.parseInt(countInput.value, 10) || 1;
  const total = clamp(requested, 1, available.length);
  state.currentTopic = topic;
  state.currentDeck = shuffle(available).slice(0, total);
  state.currentIndex = 0;
  setActiveState();
  updateCard();
}

function resetFlashcards() {
  state.currentDeck = [];
  state.currentIndex = 0;
  setEmptyState("Thema und Anzahl waehlen, dann starten.");
  updateCard();
}

function flipCard() {
  if (!state.currentDeck.length) return;
  flashcard.classList.toggle("is-flipped");
}

function goNext() {
  if (state.currentIndex >= state.currentDeck.length - 1) return;
  state.currentIndex += 1;
  updateCard();
}

function goPrev() {
  if (state.currentIndex <= 0) return;
  state.currentIndex -= 1;
  updateCard();
}

async function loadDecks() {
  try {
    const loadFile = async (path) => {
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
      }
      return response.text();
    };

    const [verbenText, nomenText, adjText] = await Promise.all([
      loadFile("../../../verben/content.md"),
      loadFile("../../../nomen/content.md"),
      loadFile("../../../adjektive/content.md")
    ]);

    state.decks.verben = extractCards(verbenText, "v");
    state.decks.nomen = extractCards(nomenText, "n");
    state.decks.adjektive = extractCards(adjText, "adj");

    updateTopicOptions();
    topicSelect.disabled = false;
    countInput.disabled = false;
    updateAvailable();
    setEmptyState("Thema und Anzahl waehlen, dann starten.");
  } catch (error) {
    setEmptyState("Listen konnten nicht geladen werden.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");

  topicSelect.addEventListener("change", () => {
    updateAvailable();
  });

  countInput.addEventListener("change", () => {
    updateAvailable();
  });

  startButton.addEventListener("click", () => {
    startFlashcards();
  });

  prevButton.addEventListener("click", () => {
    goPrev();
  });

  nextButton.addEventListener("click", () => {
    goNext();
  });

  flipButton.addEventListener("click", () => {
    flipCard();
  });

  exitButton.addEventListener("click", () => {
    resetFlashcards();
  });

  flashcard.addEventListener("click", () => {
    flipCard();
  });

  flashcard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flipCard();
    }
  });

  resetFlashcards();
  loadDecks();

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});
