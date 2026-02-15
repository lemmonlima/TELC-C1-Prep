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
    
    highlighted = highlighted.replace(markedRegex, (match) => {
      if (match.includes('explanation-highlight')) {
        return match;
      }
      return `<span class="${highlightClass}">${match}</span>`;
    });
  }
  
  if (!parts && !markedText) {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedWord})\\b`, 'gi');
    highlighted = highlighted.replace(regex, `<span class="${highlightClass}">$1</span>`);
  }
  
  return highlighted;
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

function processExplanationTokens(text, explanationsData) {
  const tokenRegex = /\{expl:([^:]+):([^}]+)\}/g;
  return text.replace(tokenRegex, (match, id, word) => {
    const data = explanationsData[id] || {};
    const typeClass = getWordTypeClass(data);
    return `<span class="explanation-word ${typeClass}" data-explanation-id="${id}">${escapeHtml(word)}</span>`;
  });
}

function getTypeNameInGerman(type) {
  const typeMap = {
    'verb': 'Verb',
    'nomen': 'Nomen',
    'noun': 'Nomen',
    'adjektiv': 'Adjektiv',
    'adjective': 'Adjektiv',
    'artikel': 'Artikel',
    'article': 'Artikel',
    'pronomen': 'Pronomen',
    'pronoun': 'Pronomen',
    'adverb': 'Adverb',
    'präposition': 'Präposition',
    'preposition': 'Präposition',
    'konjunktion': 'Konjunktion',
    'conjunction': 'Konjunktion',
    'subjunktion': 'Subjunktion',
    'subjunction': 'Subjunktion',
    'partikel': 'Partikel',
    'particle': 'Partikel'
  };
  
  return typeMap[type.toLowerCase()] || type;
}

function getVerbCharacteristics(verbType) {
  if (!verbType) return null;
  
  const characteristics = [];
  const type = verbType.toLowerCase();
  
  if (type.includes('untrennbar') || type.includes('inseparable')) {
    characteristics.push('Untrennbar (inseparable)');
  } else if (type.includes('separable') || type.includes('trennbar')) {
    characteristics.push('Trennbar (separable)');
  }
  if (type.includes('modal')) {
    characteristics.push('Modalverb (verbo modal)');
  }
  if (type.includes('reflexive') || type.includes('reflexiv')) {
    characteristics.push('Reflexiv (reflexivo)');
  }
  if (type.includes('auxiliary') || type.includes('auxiliar')) {
    characteristics.push('Mit Hilfsverb (con verbo auxiliar)');
  }
  if (type.includes('compound') && !type.includes('auxiliary')) {
    characteristics.push('Zusammengesetzt (compuesto)');
  }
  
  return characteristics.length > 0 ? characteristics : null;
}

function renderExplanationDetails(data) {
  let html = '';

  if (data.explanation) {
    let explanationHtml = '';
    if (data.type && data.type.toLowerCase() === 'phrase' && data.components && data.components.length > 0) {
      explanationHtml = colorWordsInExplanation(data.explanation, data.components);
    } else {
      explanationHtml = escapeHtml(data.explanation);
    }
    html += `<div class="explanation-section"><p class="explanation-label">Explicación:</p><p>${explanationHtml}</p></div>`;
  }
  
  if (data.type && data.type.toLowerCase() === 'phrase' && data.components && data.components.length > 0) {
    html += `<div class="explanation-section"><p class="explanation-label">Componentes:</p><ul class="phrase-components-list">`;
    data.components.forEach(component => {
      const highlightClass = getHighlightClassForType(component.type);
      const typeName = getTypeNameInGerman(component.type);
      let componentId = component.id || null;
      if (!componentId && explanationsData) {
        for (const [exId, exData] of Object.entries(explanationsData)) {
          if (exData && exData.word === component.word) {
            componentId = exId;
            break;
          }
        }
      }
      const baseClass = highlightClass.replace('explanation-highlight', 'explanation-word');
      if (componentId) {
        html += `<li><span class="phrase-component-link explanation-word ${baseClass}" data-explanation-id="${componentId}" role="button" tabindex="0">${escapeHtml(component.word)}</span> <span class="component-type-label">(${escapeHtml(typeName)})</span></li>`;
      } else {
        html += `<li><span class="explanation-word ${baseClass}">${escapeHtml(component.word)}</span> <span class="component-type-label">(${escapeHtml(typeName)})</span></li>`;
      }
    });
    html += `</ul></div>`;
  }
  
  if (data.type && (data.type.toLowerCase() === 'nomen' || data.type.toLowerCase() === 'noun')) {
    if (data.gender || data.case || data.singular || data.plural) {
      html += `<div class="explanation-section"><p class="explanation-label">Información nominal:</p>`;
      html += `<ul>`;
      if (data.gender) {
        html += `<li><strong>Género:</strong> ${escapeHtml(data.gender)}</li>`;
      }
      if (data.case) {
        html += `<li><strong>Caso en la oración:</strong> ${escapeHtml(data.case)}</li>`;
      }
      if (data.singular || data.plural) {
        const singular = data.singular ? escapeHtml(data.singular) : '';
        const plural = data.plural ? escapeHtml(data.plural) : '';
        html += `<li><strong>Formas:</strong> ${singular}${singular && plural ? ' / ' : ''}${plural}</li>`;
      }
      html += `</ul></div>`;
    }
  }
  
  if (data.type && data.type.toLowerCase() === 'verb') {
    const verbCharacteristics = getVerbCharacteristics(data.verbType);
    if (verbCharacteristics && verbCharacteristics.length > 0) {
      html += `<div class="explanation-section"><p class="explanation-label">Tipo de verbo:</p><ul>`;
      verbCharacteristics.forEach(char => {
        html += `<li>${escapeHtml(char)}</li>`;
      });
      html += `</ul></div>`;
    }
  }

  if (data.examples && data.examples.length > 0) {
    html += `<div class="explanation-section"><p class="explanation-label">Ejemplos:</p><ul>`;
    data.examples.forEach(example => {
      html += `<li>${escapeHtml(example)}</li>`;
    });
    html += `</ul></div>`;
  }

  if (data.conjugation) {
    html += `<div class="explanation-section"><p class="explanation-label">Conjugación:</p>`;
    
    const hasTableData = data.conjugation.present && typeof data.conjugation.present === 'object';
    
    if (hasTableData) {
      const pronouns = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'];
      const tenses = [];
      
      if (data.conjugation.present) tenses.push({ name: 'Präsens', data: data.conjugation.present });
      if (data.conjugation.preterite) tenses.push({ name: 'Präteritum', data: data.conjugation.preterite });
      if (data.conjugation.indirekteRede) tenses.push({ name: 'Indirekte Rede', data: data.conjugation.indirekteRede });
      
      if (tenses.length > 0) {
        html += `<table class="conjugation-table">`;
        html += `<thead><tr><th>Person</th>`;
        tenses.forEach(tense => {
          html += `<th>${escapeHtml(tense.name)}</th>`;
        });
        html += `</tr></thead><tbody>`;
        
        pronouns.forEach(pronoun => {
          html += `<tr><td class="conjugation-pronoun">${escapeHtml(pronoun)}</td>`;
          tenses.forEach(tense => {
            let form = tense.data[pronoun];
            if (!form && pronoun === 'sie/Sie') {
              form = tense.data['sie'] || tense.data['Sie'];
            }
            if (!form && pronoun.includes('/')) {
              const variants = pronoun.split('/');
              for (const variant of variants) {
                if (tense.data[variant]) {
                  form = tense.data[variant];
                  break;
                }
              }
            }
            html += `<td>${escapeHtml(form || '')}</td>`;
          });
          html += `</tr>`;
        });
        
        html += `</tbody></table>`;
      }
      
      if (data.conjugation.perfect || data.conjugation.infinitive) {
        html += `<div class="conjugation-extra">`;
        if (data.conjugation.perfect) {
          html += `<p><strong>Perfekt:</strong> ${escapeHtml(data.conjugation.perfect)}</p>`;
        }
        if (data.conjugation.infinitive) {
          html += `<p><strong>Infinitiv:</strong> ${escapeHtml(data.conjugation.infinitive)}</p>`;
        }
        html += `</div>`;
      }
    } else {
      html += `<ul>`;
      if (data.conjugation.present) {
        html += `<li><strong>Presente (3ra persona):</strong> ${escapeHtml(data.conjugation.present)}</li>`;
      }
      if (data.conjugation.preterite) {
        html += `<li><strong>Pretérito (3ra persona):</strong> ${escapeHtml(data.conjugation.preterite)}</li>`;
      }
      if (data.conjugation.perfect) {
        html += `<li><strong>Perfecto:</strong> ${escapeHtml(data.conjugation.perfect)}</li>`;
      }
      if (data.conjugation.infinitive) {
        html += `<li><strong>Infinitivo:</strong> ${escapeHtml(data.conjugation.infinitive)}</li>`;
      }
      html += `</ul>`;
    }
    
    html += `</div>`;
  }

  if (data.baseForm) {
    html += `<div class="explanation-section"><p class="explanation-label">Forma base (sin declinar):</p><p>${escapeHtml(data.baseForm)}</p></div>`;
  }

  if (data.synonyms && data.synonyms.length > 0) {
    html += `<div class="explanation-section"><p class="explanation-label">Sinónimos:</p><ul>`;
    data.synonyms.forEach(syn => {
      html += `<li>${escapeHtml(syn)}</li>`;
    });
    html += `</ul></div>`;
  }

  if (data.antonyms && data.antonyms.length > 0) {
    html += `<div class="explanation-section"><p class="explanation-label">Antónimos:</p><ul>`;
    data.antonyms.forEach(ant => {
      html += `<li>${escapeHtml(ant)}</li>`;
    });
    html += `</ul></div>`;
  }

  if (data.type) {
    html += `<div class="explanation-section"><p class="explanation-label">Tipo:</p><p>${escapeHtml(data.type)}</p></div>`;
  }

  return html;
}

function showExplanation(id, markedText, fromTextClick, parentId) {
  const data = explanationsData[id];
  if (!data) return;

  if (fromTextClick) {
    lastScrollPosition = window.scrollY || window.pageYOffset || 0;
    lastParentExplanationId = null;
  } else if (parentId !== undefined) {
    lastParentExplanationId = parentId;
  }

  const panel = document.getElementById('explanation-panel');
  const wordEl = document.getElementById('explanation-word');
  const sentenceDeEl = document.getElementById('explanation-sentence-de');
  const sentenceEsEl = document.getElementById('explanation-sentence-es');
  const translationEl = document.getElementById('explanation-translation');
  const detailsEl = document.getElementById('explanation-details');
  const backToParentBtn = document.getElementById('explanation-back-to-parent');

  wordEl.textContent = data.word;
  sentenceDeEl.innerHTML = highlightWordInSentence(data.sentence, data.word, data.parts, markedText, data);
  sentenceEsEl.textContent = data.sentenceTranslation;
  translationEl.textContent = data.translation;
  detailsEl.innerHTML = renderExplanationDetails(data);

  if (backToParentBtn) {
    if (lastParentExplanationId) {
      backToParentBtn.textContent = '← Volver a la Frase';
      backToParentBtn.style.display = '';
      backToParentBtn.onclick = () => {
        const pid = lastParentExplanationId;
        lastParentExplanationId = null;
        showExplanation(pid, null, false);
      };
    } else {
      backToParentBtn.style.display = 'none';
      backToParentBtn.onclick = null;
    }
  }

  const componentLinks = detailsEl.querySelectorAll('.phrase-component-link');
  componentLinks.forEach(link => {
    const openTarget = () => {
      const targetId = link.dataset.explanationId;
      if (targetId) {
        const marked = link.textContent.trim();
        showExplanation(targetId, marked, false, id);
      }
    };
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openTarget();
    });
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openTarget();
      }
    });
  });

  panel.style.display = 'block';
  setTimeout(() => {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 10);
}

function hideExplanation() {
  const panel = document.getElementById('explanation-panel');
  panel.style.display = 'none';
}

async function loadExplanations() {
  try {
    const response = await fetch('text-09-explanations.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to load explanations');
    }
    explanationsData = await response.json();
  } catch (error) {
    console.error('Error loading explanations:', error);
  }
}

function processTextContent() {
  const container = document.getElementById('text-content');
  if (!container) return;

  const paragraphs = container.querySelectorAll('p');
  paragraphs.forEach(p => {
    if (p.id === 'word-count') return;
    
    const originalText = p.innerHTML;
    const processedText = processExplanationTokens(originalText, explanationsData);
    p.innerHTML = processedText;
  });

  const explanationWords = container.querySelectorAll('.explanation-word');
  explanationWords.forEach(word => {
    word.addEventListener('click', (e) => {
      e.preventDefault();
      lastClickedElement = word;
      const id = word.dataset.explanationId;
      const markedText = word.textContent.trim();
      showExplanation(id, markedText, true);
    });
  });
}

function scrollToPositionAndThen(targetY, callback) {
  const tolerance = 2;
  const settleTime = 100;
  const maxWait = 1500;
  let lastY = window.scrollY || window.pageYOffset || 0;
  let lastChangeTime = performance.now();

  const check = () => {
    const currentY = window.scrollY || window.pageYOffset || 0;
    const now = performance.now();

    if (Math.abs(currentY - lastY) > tolerance) {
      lastY = currentY;
      lastChangeTime = now;
    }

    const closeEnough = Math.abs(currentY - targetY) <= tolerance;
    const stableEnough = now - lastChangeTime >= settleTime;
    const timedOut = now - startTime >= maxWait;

    if ((closeEnough && stableEnough) || timedOut) {
      callback();
    } else {
      requestAnimationFrame(check);
    }
  };

  const startTime = performance.now();
  requestAnimationFrame(check);
}

document.addEventListener('DOMContentLoaded', async () => {
  document.body.classList.remove('no-js');

  await loadExplanations();
  processTextContent();

  const closeBtn = document.getElementById('explanation-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideExplanation);
  }

  const backBtn = document.getElementById('explanation-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (lastScrollPosition !== null) {
        const targetY = lastScrollPosition;
        window.scrollTo({ top: targetY, behavior: 'smooth' });

        scrollToPositionAndThen(targetY, () => {
          if (!lastClickedElement) return;
          lastClickedElement.classList.remove('explanation-word-pulse');
          void lastClickedElement.offsetWidth;
          lastClickedElement.classList.add('explanation-word-pulse');
          setTimeout(() => {
            if (lastClickedElement) {
              lastClickedElement.classList.remove('explanation-word-pulse');
            }
          }, 1200);
        });
      }
    });
  }

  const textFlashBtn = document.getElementById('text-flashcards');
  if (textFlashBtn) {
    textFlashBtn.addEventListener('click', () => {
      window.location.href = 'text-09-flashcards.html';
    });
  }

  requestAnimationFrame(() => {
    document.body.classList.add('is-ready');
  });
});
