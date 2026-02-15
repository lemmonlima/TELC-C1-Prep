const state = {
  deck: [],
  currentIndex: 0
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shuffle(list) {
  const array = list.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const stage = document.getElementById("flash-stage");
const emptyState = document.getElementById("flash-empty");
const flashcard = document.getElementById("flashcard");
const termEl = document.getElementById("flashcard-term");
const answerEl = document.getElementById("flashcard-answer");
const exampleEl = document.getElementById("flashcard-example");
const progressBar = document.getElementById("flash-progress-bar");
const progressText = document.getElementById("flash-progress-text");
const prevButton = document.getElementById("flash-prev");
const nextButton = document.getElementById("flash-next");
const flipButton = document.getElementById("flash-flip");
const exitButton = document.getElementById("flash-exit");

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
  if (!state.deck.length) {
    setEmptyState("Keine Karten verfügbar.");
    progressText.textContent = "0 / 0";
    progressBar.style.width = "0%";
    return;
  }

  const card = state.deck[state.currentIndex];
  termEl.textContent = card.word || "—";

  answerEl.textContent = card.translation || "—";

  const exampleDe = card.exampleDe ? escapeHtml(card.exampleDe) : "";
  const exampleEs = card.exampleEs ? escapeHtml(card.exampleEs) : "";
  exampleEl.innerHTML = exampleDe || exampleEs
    ? `<div class="flash-example-block"><div class="flash-example-de">${exampleDe}</div>${exampleEs ? `<div class="flash-example-es">${exampleEs}</div>` : ""}</div>`
    : "—";

  const progress = (state.currentIndex + 1) / state.deck.length;
  progressBar.style.width = `${Math.round(progress * 100)}%`;
  progressText.textContent = `${state.currentIndex + 1} / ${state.deck.length}`;

  prevButton.disabled = state.currentIndex === 0;
  nextButton.disabled = state.currentIndex >= state.deck.length - 1;
  flipButton.disabled = false;
}

function flipCard() {
  if (!state.deck.length) return;
  flashcard.classList.toggle("is-flipped");
}

function goNext() {
  if (state.currentIndex >= state.deck.length - 1) return;
  state.currentIndex += 1;
  flashcard.classList.remove("is-flipped");
  updateCard();
}

function goPrev() {
  if (state.currentIndex <= 0) return;
  state.currentIndex -= 1;
  flashcard.classList.remove("is-flipped");
  updateCard();
}

function resetAndShuffle() {
  if (!state.deck.length) return;
  state.deck = shuffle(state.deck);
  state.currentIndex = 0;
  flashcard.classList.remove("is-flipped");
  updateCard();
}

async function loadDeck() {
  try {
    const response = await fetch("woerter.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load woerter.json");
    }
    const data = await response.json();
    const words = Array.isArray(data.words) ? data.words : [];

    const deck = words
      .filter((w) => w.word && w.translation && Array.isArray(w.examples) && w.examples.length > 0)
      .map((w) => {
        const first = w.examples[0];
        return {
          word: w.word,
          translation: w.translation,
          exampleDe: first.example,
          exampleEs: first.translation
        };
      });

    if (!deck.length) {
      setEmptyState("Keine Karten verfügbar (Wörter mit mindestens einem Beispiel).");
      return;
    }

    state.deck = shuffle(deck);
    state.currentIndex = 0;
    setActiveState();
    updateCard();
  } catch (error) {
    setEmptyState("Daten konnten nicht geladen werden.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");

  prevButton.addEventListener("click", goPrev);
  nextButton.addEventListener("click", goNext);
  flipButton.addEventListener("click", flipCard);
  exitButton.addEventListener("click", resetAndShuffle);

  flashcard.addEventListener("click", flipCard);
  flashcard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flipCard();
    }
  });

  setEmptyState("Cargando palabras…");
  loadDeck();

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});
