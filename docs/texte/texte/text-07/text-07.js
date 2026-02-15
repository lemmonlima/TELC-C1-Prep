let explanationsData = {};
let lastScrollPosition = null;
let lastClickedElement = null;
let lastParentExplanationId = null;

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getHighlightClassForType(type) {
  if (!type) return 'explanation-highlight';
  const typeLower = type.toLowerCase();
  const typeMap = {
    'verb': 'explanation-highlight-verb',
    'nomen': 'explanation-highlight-nomen',
    'noun': 'explanation-highlight-nomen',
    'adjektiv': 'explanation-highlight-adj',
    'adjective': 'explanation-highlight-adj',
    'artikel': 'explanation-highlight-artikel',
    'article': 'explanation-highlight-artikel',
    'pronomen': 'explanation-highlight-pronomen',
    'pronoun': 'explanation-highlight-pronomen',
    'adverb': 'explanation-highlight-adverb',
    'präposition': 'explanation-highlight-praeposition',
    'preposition': 'explanation-highlight-praeposition',
    'konjunktion': 'explanation-highlight-konjunktion',
    'conjunction': 'explanation-highlight-konjunktion',
    'subjunktion': 'explanation-highlight-subjunktion',
    'subjunction': 'explanation-highlight-subjunktion',
    'partikel': 'explanation-highlight-partikel',
    'particle': 'explanation-highlight-partikel'
  };
  return typeMap[typeLower] || 'explanation-highlight';
}

function getHighlightClass(data) {
  if (!data || !data.type) return 'explanation-highlight';
  const type = data.type.toLowerCase();
  if (type === 'phrase' || type === 'compound') {
    return 'explanation-highlight';
  }
  return getHighlightClassForType(type);
}

function getWordTypeClass(data) {
  if (!data || !data.type) return 'explanation-word-default';
  const type = data.type.toLowerCase();
  if (type === 'phrase' || type === 'compound') {
    return 'explanation-word-default';
  }
  const typeMap = {
    'verb': 'explanation-word-verb',
    'nomen': 'explanation-word-nomen',
    'noun': 'explanation-word-nomen',
    'adjektiv': 'explanation-word-adj',
    'adjective': 'explanation-word-adj',
    'artikel': 'explanation-word-artikel',
    'article': 'explanation-word-artikel',
    'pronomen': 'explanation-word-pronomen',
    'pronoun': 'explanation-word-pronomen',
    'adverb': 'explanation-word-adverb',
    'präposition': 'explanation-word-praeposition',
    'preposition': 'explanation-word-praeposition',
    'konjunktion': 'explanation-word-konjunktion',
    'conjunction': 'explanation-word-konjunktion',
    'subjunktion': 'explanation-word-subjunktion',
    'subjunction': 'explanation-word-subjunktion',
    'partikel': 'explanation-word-partikel',
    'particle': 'explanation-word-partikel'
  };
  return typeMap[type] || 'explanation-word-default';
}

function processExplanationTokens(text) {
  const tokenRegex = /\{expl:([^:]+):([^}]+)\}/g;
  return text.replace(tokenRegex, (match, id, word) => {
    const data = explanationsData[id] || {};
    const typeClass = getWordTypeClass(data);
    return `<span class="explanation-word ${typeClass}" data-explanation-id="${id}">${escapeHtml(word)}</span>`;
  });
}

function processTextContent() {
  const container = document.getElementById("text-content");
  if (!container) return;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.includes('{expl:')) {
      textNodes.push(node);
    }
  }
  textNodes.forEach(textNode => {
    const span = document.createElement("span");
    span.innerHTML = processExplanationTokens(textNode.nodeValue);
    textNode.parentNode.replaceChild(span, textNode);
  });
}

async function loadExplanations() {
  try {
    const response = await fetch('text-07-explanations.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load explanations');
    const data = await response.json();
    explanationsData = data || {};
  } catch (error) {
    explanationsData = {};
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");
  loadExplanations().then(() => {
    processTextContent();
  });
  const flashcardsBtn = document.getElementById("text-flashcards");
  if (flashcardsBtn) {
    flashcardsBtn.addEventListener("click", () => {
      window.location.href = "text-07-flashcards.html";
    });
  }
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
});
