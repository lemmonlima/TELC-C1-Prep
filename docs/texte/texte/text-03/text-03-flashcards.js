const state = {
  deck: [],
  currentIndex: 0
};

function escapeHtml(value) {
  return value
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

function getHighlightClassForType(type) {
  if (!type) return "explanation-highlight";
  const t = type.toLowerCase();
  const map = {
    verb: "explanation-highlight-verb",
    nomen: "explanation-highlight-nomen",
    noun: "explanation-highlight-nomen",
    adjektiv: "explanation-highlight-adj",
    adjective: "explanation-highlight-adj",
    artikel: "explanation-highlight-artikel",
    article: "explanation-highlight-artikel",
    pronomen: "explanation-highlight-pronomen",
    pronoun: "explanation-highlight-pronomen",
    adverb: "explanation-highlight-adverb",
    präposition: "explanation-highlight-praeposition",
    preposition: "explanation-highlight-praeposition",
    konjunktion: "explanation-highlight-konjunktion",
    conjunction: "explanation-highlight-konjunktion",
    subjunktion: "explanation-highlight-subjunktion",
    subjunction: "explanation-highlight-subjunktion",
    partikel: "explanation-highlight-partikel",
    particle: "explanation-highlight-partikel"
  };
  return map[t] || "explanation-highlight";
}

function getHighlightClass(data) {
  if (!data || !data.type) return "explanation-highlight";
  const t = data.type.toLowerCase();
  if (t === "phrase" || t === "compound") return "explanation-highlight";
  return getHighlightClassForType(t);
}

function highlightWordInSentence(sentence, data) {
  if (!data || !sentence) return escapeHtml(sentence || "");
  const highlightClass = getHighlightClass(data);
  const parts = Array.isArray(data.parts) && data.parts.length ? data.parts.slice() : [];
  const target = data.word || "";
  let highlighted = sentence;
  if (target && target.includes(" ")) {
    const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${escaped})`, "gi");
    highlighted = highlighted.replace(re, (match) => `<span class="${highlightClass}">${match}</span>`);
  }
  parts.forEach((partRaw) => {
    const part = String(partRaw).trim();
    if (!part) return;
    const escaped = part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const hasSpace = part.includes(" ");
    const re = hasSpace ? new RegExp(`(${escaped})`, "gi") : new RegExp(`\\b(${escaped})\\b`, "gi");
    highlighted = highlighted.replace(re, (match, grp) => {
      if (match.includes("explanation-highlight")) return match;
      return `<span class="${highlightClass}">${grp}</span>`;
    });
  });
  return escapeHtml("").replace("", highlighted);
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
    setEmptyState("Keine Karten verfügbar. (Noch keine Wörter im Text 3 markiert.)");
    progressText.textContent = "0 / 0";
    progressBar.style.width = "0%";
    return;
  }
  const card = state.deck[state.currentIndex];
  termEl.textContent = card.word || "—";
  const translation = card.translation ? escapeHtml(card.translation) : "—";
  const sentenceDe = highlightWordInSentence(card.sentence || "", card);
  const sentenceEs = card.sentenceTranslation ? escapeHtml(card.sentenceTranslation) : "";
  answerEl.innerHTML = translation;
  exampleEl.innerHTML = `
    <div class="flash-example-block">
      <div class="flash-example-de">${sentenceDe}</div>
      ${sentenceEs ? `<div class="flash-example-es">${sentenceEs}</div>` : ""}
    </div>
  `;
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
    const response = await fetch("text-03-explanations.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load explanations");
    const data = await response.json();
    const entries = Object.entries(data);
    const deck = entries
      .map(([id, value]) => ({
        id,
        word: value.word,
        translation: value.translation,
        sentence: value.sentence,
        sentenceTranslation: value.sentenceTranslation,
        type: value.type,
        parts: value.parts || []
      }))
      .filter((card) => card.word && card.translation && card.sentence && card.sentenceTranslation);
    if (!deck.length) {
      setEmptyState("Keine Karten verfügbar. (Noch keine Wörter im Text 3 markiert.)");
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
  prevButton.addEventListener("click", () => goPrev());
  nextButton.addEventListener("click", () => goNext());
  flipButton.addEventListener("click", () => flipCard());
  exitButton.addEventListener("click", () => resetAndShuffle());
  flashcard.addEventListener("click", () => flipCard());
  flashcard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flipCard(); }
  });
  setEmptyState("Cargando palabras del texto…");
  loadDeck();
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
});
