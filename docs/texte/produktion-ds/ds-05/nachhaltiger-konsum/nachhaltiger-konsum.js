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
  let line = escapeHtml(text);

  line = line.replace(/\{expl:([^:]+):([^}]+)\}/g, (match, id, word) => {
    const data = explanationsData[id] || {};
    const typeClass = getWordTypeClass(data);
    return `<span class="explanation-word ${typeClass}" data-explanation-id="${id}">${word}</span>`;
  });

  const semanticTokens = [
    [/\{v:([^}]+)\}/g, 'mark-verb'],
    [/\{adj:([^}]+)\}/g, 'mark-adj'],
    [/\{p:([^}]+)\}/g, 'mark-prep'],
    [/\{a:([^}]+)\}/g, 'mark-a'],
    [/\{d:([^}]+)\}/g, 'mark-d'],
    [/\{g:([^}]+)\}/g, 'mark-g'],
    [/\{n:([^}]+)\}/g, 'mark-n'],
    [/\{s:([^}]+)\}/g, 'mark-n'],
    [/\{pred:([^}]+)\}/g, 'mark-praedikat'],
    [/\{subj:([^}]+)\}/g, 'mark-subjekt'],
    [/\{akk:([^}]+)\}/g, 'mark-akk'],
    [/\{dat:([^}]+)\}/g, 'mark-dat'],
    [/\{gen:([^}]+)\}/g, 'mark-gen'],
    [/\{prep-erg:([^}]+)\}/g, 'mark-prep-erg'],
    [/\{sit:([^}]+)\}/g, 'mark-situativ'],
    [/\{dir:([^}]+)\}/g, 'mark-direktiv'],
    [/\{exp:([^}]+)\}/g, 'mark-expansiv'],
    [/\{nom-erg:([^}]+)\}/g, 'mark-nominal'],
    [/\{ang-temporal:([^}]+)\}/g, 'mark-ang-temporal'],
    [/\{ang-kausal:([^}]+)\}/g, 'mark-ang-kausal'],
    [/\{ang-final:([^}]+)\}/g, 'mark-ang-final'],
    [/\{ang-kond:([^}]+)\}/g, 'mark-ang-konditional'],
    [/\{ang-konz:([^}]+)\}/g, 'mark-ang-konzessiv'],
    [/\{ang-lokal:([^}]+)\}/g, 'mark-ang-lokal'],
    [/\{ang-modal:([^}]+)\}/g, 'mark-ang-modal'],
    [/\{ang-instr:([^}]+)\}/g, 'mark-ang-instrumental'],
    [/\{ang-referenz:([^}]+)\}/g, 'mark-ang-referenz'],
    [/\{ang-neg:([^}]+)\}/g, 'mark-ang-negation'],
    [/\{ang-konsekutiv:([^}]+)\}/g, 'mark-ang-konsekutiv'],
    [/\{ang-adversativ:([^}]+)\}/g, 'mark-ang-adversativ'],
    [/\{ang-komitativ:([^}]+)\}/g, 'mark-ang-komitativ'],
    [/\{ang-proportional:([^}]+)\}/g, 'mark-ang-proportional'],
    [/\{attr:([^}]+)\}/g, 'mark-attr'],
    [/\{adv:([^}]+)\}/g, 'mark-adverb'],
    [/\{kon:([^}]+)\}/g, 'mark-konjunktion']
  ];

  semanticTokens.forEach(([regex, className]) => {
    line = line.replace(regex, '<span class="mark ' + className + '">$1</span>');
  });

  return line;
}

function processTextContent() {
  const container = document.getElementById("text-content");
  if (!container) return;

  const tokenPattern = /\{(?:expl|v|adj|p|a|d|g|n|s|pred|subj|akk|dat|gen|prep-erg|sit|dir|exp|nom-erg|ang-temporal|ang-kausal|ang-final|ang-kond|ang-konz|ang-lokal|ang-modal|ang-instr|ang-referenz|ang-neg|ang-konsekutiv|ang-adversativ|ang-komitativ|ang-proportional|attr|adv|kon):/;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let node;

  while ((node = walker.nextNode())) {
    const value = node.nodeValue || "";
    if (tokenPattern.test(value)) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((textNode) => {
    const span = document.createElement("span");
    span.innerHTML = processExplanationTokens(textNode.nodeValue);
    textNode.parentNode.replaceChild(span, textNode);
  });
}

async function loadExplanations() {
  try {
    const response = await fetch('nachhaltiger-konsum-explanations.json', { cache: 'no-store' });
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
      window.location.href = "nachhaltiger-konsum-flashcards.html";
    });
  }
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
});
