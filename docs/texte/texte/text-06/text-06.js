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

function colorWordsInExplanation(explanation, components) {
  if (!explanation || !components || components.length === 0) {
    return escapeHtml(explanation);
  }
  let result = explanation;
  const sortedComponents = [...components].sort((a, b) => b.word.length - a.word.length);
  sortedComponents.forEach(component => {
    const word = component.word;
    const type = component.type;
    const highlightClass = getHighlightClassForType(type);
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRegex = new RegExp(`(['"]?)(${escapedWord})(['"]?)`, 'gi');
    result = result.replace(wordRegex, (match, quoteBefore, matchedWord, quoteAfter) => {
      if (match.includes('<span')) {
        return match;
      }
      const escapedMatch = escapeHtml(matchedWord);
      return (quoteBefore || '') + `<span class="${highlightClass}">${escapedMatch}</span>` + (quoteAfter || '');
    });
  });
  const parts = result.split(/(<span[^>]*>.*?<\/span>)/g);
  return parts.map(part => {
    if (part.startsWith('<span')) {
      return part;
    }
    return escapeHtml(part);
  }).join('');
}

function highlightWordInSentence(sentence, word, parts, markedText, data) {
  let highlighted = sentence;
  const highlightClass = getHighlightClass(data);
  let markedTextHighlighted = false;
  if (markedText && markedText.trim().includes(' ')) {
    const escapedMarked = markedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const markedRegex = new RegExp(`(${escapedMarked})`, 'gi');
    highlighted = highlighted.replace(markedRegex, (match) => {
      if (match.includes('explanation-highlight')) {
        return match;
      }
      markedTextHighlighted = true;
      return `<span class="${highlightClass}">${match}</span>`;
    });
  }
  if (parts && parts.length > 0) {
    const partsToHighlight = [...parts].reverse();
    partsToHighlight.forEach(part => {
      if (markedTextHighlighted && markedText && markedText.includes(part.trim())) {
        return;
      }
      const escapedPart = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const hasSpaces = part.trim().includes(' ');
      const partRegex = hasSpaces
        ? new RegExp(`(${escapedPart})`, 'gi')
        : new RegExp(`\\b(${escapedPart})\\b`, 'gi');
      highlighted = highlighted.replace(partRegex, (match, p1) => {
        if (match.includes('explanation-highlight')) {
          return match;
        }
        return `<span class="${highlightClass}">${p1}</span>`;
      });
    });
  }
  if (markedText && !markedText.trim().includes(' ')) {
    const escapedMarked = markedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const markedRegex = new RegExp(`\\b(${escapedMarked})\\b`, 'gi');
    highlighted = highlighted.replace(markedRegex, (match, p1) => {
      if (match.includes('explanation-highlight')) {
        return match;
      }
      return `<span class="${highlightClass}">${p1}</span>`;
    });
  }
  return highlighted;
}

function renderExplanationDetails(data) {
  if (!data) return '';
  const sections = [];
  if (data.explanation) {
    let explanationHtml = escapeHtml(data.explanation);
    if (Array.isArray(data.components) && data.components.length > 0) {
      explanationHtml = colorWordsInExplanation(data.explanation, data.components);
    }
    sections.push(`
      <div class="explanation-section">
        <p class="explanation-label">Explicación:</p>
        <p>${explanationHtml}</p>
      </div>
    `);
  }
  if (data.components && Array.isArray(data.components) && data.components.length > 0) {
    const items = data.components.map((component) => {
      const cls = getHighlightClassForType(component.type);
      return `<li><span class="${cls}">${escapeHtml(component.word)}</span> <span class="component-type">(${escapeHtml(component.type)})</span></li>`;
    }).join('');
    sections.push(`
      <div class="explanation-section">
        <p class="explanation-label">Componentes:</p>
        <ul class="components-list">
          ${items}
        </ul>
      </div>
    `);
  }
  if ((data.gender || data.case || data.singular || data.plural) && (data.type === 'nomen' || data.type === 'noun')) {
    const lines = [];
    if (data.gender) lines.push(`<li><strong>Género:</strong> ${escapeHtml(data.gender)}</li>`);
    if (data.case) lines.push(`<li><strong>Caso en la oración:</strong> ${escapeHtml(data.case)}</li>`);
    if (data.singular || data.plural) {
      const form = `${escapeHtml(data.singular || '')}${data.singular && data.plural ? ' / ' : ''}${escapeHtml(data.plural || '')}`;
      lines.push(`<li><strong>Formas:</strong> ${form}</li>`);
    }
    sections.push(`
      <div class="explanation-section">
        <p class="explanation-label">Información nominal:</p>
        <ul>
          ${lines.join('')}
        </ul>
      </div>
    `);
  }
  if (data.verbType && data.type === 'verb') {
    const types = [];
    const vt = data.verbType;
    if (vt.includes('separable')) types.push('Trennbar (separable)');
    if (vt.includes('untrennbar') || vt.includes('inseparable')) types.push('Untrennbar (inseparable)');
    if (vt.includes('modal')) types.push('Modalverb (verbo modal)');
    if (vt.includes('reflexiv') || vt.includes('reflexive')) types.push('Reflexiv (reflexivo)');
    if (vt.includes('auxiliary')) types.push('Mit Hilfsverb (con verbo auxiliar)');
    sections.push(`
      <div class="explanation-section">
        <p class="explanation-label">Tipo de verbo:</p>
        <ul>
          ${types.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    `);
  }
  if (Array.isArray(data.examples) && data.examples.length > 0) {
    const items = data.examples.map((ex) => {
      if (typeof ex === 'string') {
        return `<li>${escapeHtml(ex)}</li>`;
      }
      if (ex.example && ex.translation) {
        return `<li><span class="example-de">${escapeHtml(ex.example)}</span><br /><span class="example-es">${escapeHtml(ex.translation)}</span></li>`;
      }
      return '';
    }).join('');
    sections.push(`
      <div class="explanation-section">
        <p class="explanation-label">Ejemplos:</p>
        <ul>
          ${items}
        </ul>
      </div>
    `);
  }
  if (data.conjugation && typeof data.conjugation === 'object') {
    const conj = data.conjugation;
    const present = conj.present || {};
    const preterite = conj.preterite || {};
    const rows = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'].map((pron) => {
      const pres = present[pron] || '';
      const pret = preterite[pron] || '';
      return `<tr><td class="conjugation-pronoun">${pron}</td><td>${escapeHtml(pres)}</td><td>${escapeHtml(pret)}</td></tr>`;
    }).join('');
    const table = `
      <div class="explanation-section">
        <p class="explanation-label">Conjugación:</p>
        <table class="conjugation-table">
          <thead>
            <tr><th>Persona</th><th>Präsens</th><th>Präteritum</th></tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div class="conjugation-extra">
          ${conj.perfect ? `<div><strong>Perfekt:</strong> ${escapeHtml(conj.perfect)}</div>` : ''}
          ${conj.infinitive ? `<div><strong>Infinitiv:</strong> ${escapeHtml(conj.infinitive)}</div>` : ''}
        </div>
      </div>
    `;
    sections.push(table);
  }
  if (data.baseForm && data.type === 'adjektiv') {
    sections.push(`
      <div class="explanation-section">
        <p class="explanation-label">Forma base:</p>
        <p>${escapeHtml(data.baseForm)}</p>
      </div>
    `);
  }
  if (Array.isArray(data.synonyms) && data.synonyms.length > 0) {
    sections.push(`
      <div class="explanation-section">
        <p class="explanation-label">Sinónimos:</p>
        <p>${data.synonyms.map(escapeHtml).join(', ')}</p>
      </div>
    `);
  }
  if (Array.isArray(data.antonyms) && data.antonyms.length > 0) {
    sections.push(`
      <div class="explanation-section">
        <p class="explanation-label">Antónimos:</p>
        <p>${data.antonyms.map(escapeHtml).join(', ')}</p>
      </div>
    `);
  }
  if (data.type) {
    sections.push(`
      <div class="explanation-section">
        <p class="explanation-label">Tipo de palabra:</p>
        <p>${escapeHtml(data.type)}</p>
      </div>
    `);
  }
  return sections.join('');
}

function showExplanation(id, markedText, fromTextClick, parentId) {
  const data = explanationsData[id];
  if (!data) return;
  const panel = document.getElementById('explanation-panel');
  const wordEl = document.getElementById('explanation-word');
  const sentenceDeEl = document.getElementById('explanation-sentence-de');
  const sentenceEsEl = document.getElementById('explanation-sentence-es');
  const translationEl = document.getElementById('explanation-translation');
  const detailsEl = document.getElementById('explanation-details');
  const backToParentBtn = document.getElementById('explanation-back-to-parent');
  if (fromTextClick) {
    lastScrollPosition = window.scrollY || window.pageYOffset || 0;
    lastClickedElement = document.querySelector(`[data-explanation-id="${id}"]`);
    lastParentExplanationId = null;
  } else if (parentId) {
    lastParentExplanationId = parentId;
  }
  wordEl.textContent = data.word || '';
  const sentence = data.sentence || '';
  const sentenceDe = highlightWordInSentence(sentence, data.word, data.parts || [], markedText, data);
  sentenceDeEl.innerHTML = sentenceDe;
  sentenceEsEl.textContent = data.sentenceTranslation || '';
  translationEl.textContent = data.translation || '';
  detailsEl.innerHTML = renderExplanationDetails(data);
  if (lastParentExplanationId) {
    backToParentBtn.style.display = 'inline-flex';
  } else {
    backToParentBtn.style.display = 'none';
  }
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideExplanation() {
  const panel = document.getElementById('explanation-panel');
  panel.style.display = 'none';
}

function onWordClick(event) {
  const target = event.target.closest('.explanation-word');
  if (!target) return;
  const id = target.getAttribute('data-explanation-id');
  if (!id) return;
  const markedText = target.textContent;
  showExplanation(id, markedText, true);
}

async function loadExplanations() {
  try {
    const response = await fetch('text-06-explanations.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load explanations');
    const data = await response.json();
    explanationsData = data || {};
  } catch (error) {
    explanationsData = {};
  }
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
  const container = document.getElementById('text-content');
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
    const span = document.createElement('span');
    span.innerHTML = processExplanationTokens(textNode.nodeValue);
    textNode.parentNode.replaceChild(span, textNode);
  });
  container.addEventListener('click', onWordClick);
}

function setupPanelControls() {
  const closeButton = document.getElementById('explanation-close');
  const backButton = document.getElementById('explanation-back');
  const backToParentBtn = document.getElementById('explanation-back-to-parent');
  closeButton.addEventListener('click', () => hideExplanation());
  backButton.addEventListener('click', () => {
    hideExplanation();
    if (lastScrollPosition != null) {
      window.scrollTo({ top: lastScrollPosition, behavior: 'smooth' });
      if (lastClickedElement) {
        lastClickedElement.classList.add('explanation-word-pulse');
        setTimeout(() => lastClickedElement.classList.remove('explanation-word-pulse'), 1200);
      }
    }
  });
  backToParentBtn.addEventListener('click', () => {
    if (!lastParentExplanationId) return;
    showExplanation(lastParentExplanationId, null, false);
    lastParentExplanationId = null;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('no-js');
  setupPanelControls();
  loadExplanations().then(() => {
    processTextContent();
  });
  const flashcardsBtn = document.getElementById('text-flashcards');
  if (flashcardsBtn) {
    flashcardsBtn.addEventListener('click', () => {
      window.location.href = 'text-06-flashcards.html';
    });
  }
});
