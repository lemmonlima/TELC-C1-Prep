function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(value) {
  // Primero, proteger los elementos HTML permitidos con placeholders temporales
  const htmlPlaceholders = [];
  let placeholderIndex = 0;
  
  // Permitir elementos HTML básicos: <br>, <br/>, <br />, <em>, <i>, <strong>, <b>, <u>
  // Usar placeholders para protegerlos durante el escape
  let line = value.replace(/<(br\s*\/?|em|i|strong|b|u)(\s[^>]*)?\/?>|<\/(em|i|strong|b|u)>/gi, (match) => {
    const placeholder = `__HTML_PLACEHOLDER_${placeholderIndex}__`;
    htmlPlaceholders[placeholderIndex] = match;
    placeholderIndex++;
    return placeholder;
  });
  
  // Ahora escapar el resto del HTML
  line = escapeHtml(line);
  
  // Restaurar los elementos HTML permitidos
  htmlPlaceholders.forEach((html, index) => {
    line = line.replace(`__HTML_PLACEHOLDER_${index}__`, html);
  });
  
  // Procesar markdown y tokens personalizados
  line = line.replace(/`([^`]+)`/g, "<code>$1</code>");
  line = line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  line = line.replace(/\{v:([^}]+)\}/g, '<span class="mark mark-verb">$1</span>');
  line = line.replace(/\{adj:([^}]+)\}/g, (match, inner) => {
    const value = inner.trim();
    let cls = "mark-adj";
    const plain = value.replace(/^-/, "");
    if (plain === "e") cls = "mark-adj-e";
    else if (plain === "en" || plain === "n") cls = "mark-adj-en";
    else if (plain === "er") cls = "mark-adj-er";
    else if (plain === "es" || plain === "s") cls = "mark-adj-es";
    return `<span class="mark ${cls}">${value}</span>`;
  });
  line = line.replace(/\{p:([^}]+)\}/g, '<span class="mark mark-prep">$1</span>');
  line = line.replace(/\{a:([^}]+)\}/g, '<span class="mark mark-a">$1</span>');
  line = line.replace(/\{d:([^}]+)\}/g, '<span class="mark mark-d">$1</span>');
  line = line.replace(/\{g:([^}]+)\}/g, '<span class="mark mark-g">$1</span>');
  line = line.replace(/\{n:([^}]+)\}/g, '<span class="mark mark-n">$1</span>');
  line = line.replace(/\{s:([^}]+)\}/g, '<span class="mark mark-n">$1</span>');
  line = line.replace(/\{pred:([^}]+)\}/g, '<span class="mark mark-praedikat">$1</span>');
  line = line.replace(/\{subj:([^}]+)\}/g, '<span class="mark mark-subjekt">$1</span>');
  line = line.replace(/\{akk:([^}]+)\}/g, '<span class="mark mark-akk">$1</span>');
  line = line.replace(/\{dat:([^}]+)\}/g, '<span class="mark mark-dat">$1</span>');
  line = line.replace(/\{gen:([^}]+)\}/g, '<span class="mark mark-gen">$1</span>');
  line = line.replace(/\{prep-erg:([^}]+)\}/g, '<span class="mark mark-prep-erg">$1</span>');
  line = line.replace(/\{sit:([^}]+)\}/g, '<span class="mark mark-situativ">$1</span>');
  line = line.replace(/\{dir:([^}]+)\}/g, '<span class="mark mark-direktiv">$1</span>');
  line = line.replace(/\{exp:([^}]+)\}/g, '<span class="mark mark-expansiv">$1</span>');
  line = line.replace(/\{nom-erg:([^}]+)\}/g, '<span class="mark mark-nominal">$1</span>');
  line = line.replace(/\{ang-temporal:([^}]+)\}/g, '<span class="mark mark-ang-temporal">$1</span>');
  line = line.replace(/\{ang-kausal:([^}]+)\}/g, '<span class="mark mark-ang-kausal">$1</span>');
  line = line.replace(/\{ang-final:([^}]+)\}/g, '<span class="mark mark-ang-final">$1</span>');
  line = line.replace(/\{ang-kond:([^}]+)\}/g, '<span class="mark mark-ang-konditional">$1</span>');
  line = line.replace(/\{ang-konz:([^}]+)\}/g, '<span class="mark mark-ang-konzessiv">$1</span>');
  line = line.replace(/\{ang-lokal:([^}]+)\}/g, '<span class="mark mark-ang-lokal">$1</span>');
  line = line.replace(/\{ang-modal:([^}]+)\}/g, '<span class="mark mark-ang-modal">$1</span>');
  line = line.replace(/\{ang-instr:([^}]+)\}/g, '<span class="mark mark-ang-instrumental">$1</span>');
  line = line.replace(/\{ang-referenz:([^}]+)\}/g, '<span class="mark mark-ang-referenz">$1</span>');
  line = line.replace(/\{ang-neg:([^}]+)\}/g, '<span class="mark mark-ang-negation">$1</span>');
  line = line.replace(/\{ang-konsekutiv:([^}]+)\}/g, '<span class="mark mark-ang-konsekutiv">$1</span>');
  line = line.replace(/\{ang-adversativ:([^}]+)\}/g, '<span class="mark mark-ang-adversativ">$1</span>');
  line = line.replace(/\{ang-komitativ:([^}]+)\}/g, '<span class="mark mark-ang-komitativ">$1</span>');
  line = line.replace(/\{ang-proportional:([^}]+)\}/g, '<span class="mark mark-ang-proportional">$1</span>');
  line = line.replace(/\{wnb:([^}]+)\}/g, '<span class="mark mark-wnb">$1</span>');
  line = line.replace(/\{attr:([^}]+)\}/g, '<span class="mark mark-attr">$1</span>');
  line = line.replace(/\{reihe:([A-Ga-g]):([^}]+)\}/g, (_, letter, pattern) => {
    const L = letter.toUpperCase();
    const lc = L.toLowerCase();
    return `<a href="reihe-${lc}.html" class="mark mark-reihe mark-reihe-${lc}">Reihe ${L}: ${pattern}</a>`;
  });
  const vokalLabels = {
    "a-ae": ["2.1 a → ä", "a → ä"],
    "e-i": ["2.2 e → i", "e → i"],
    "e-ie": ["2.3 e → ie", "e → ie"]
  };
  line = line.replace(/\{vokal:([a-z-]+)\}/g, (_, key) => {
    const pair = vokalLabels[key];
    if (!pair) return key;
    return `<a href="vokal-${key}.html" class="mark mark-vokal mark-vokal-${key}">${pair[0]}</a>`;
  });
  line = line.replace(/\{vokal-tag:([a-z-]+)\}/g, (_, key) => {
    const pair = vokalLabels[key];
    if (!pair) return key;
    return `<span class="mark mark-vokal mark-vokal-${key}">${pair[1]}</span>`;
  });
  return line;
}

function renderMarkdown(text) {
  const lines = text.split(/\r?\n/);
  let html = "";
  let inList = false;
  let inTable = false;
  let tableRows = [];
  let isHeaderRow = false;

  function processTable() {
    if (tableRows.length === 0) return "";
    
    let tableHtml = "<table>";
    
    tableRows.forEach((row, index) => {
      const cells = row.split("|").map(cell => cell.trim()).filter(cell => cell.length > 0);
      
      if (index === 1) {
        // Separator row, skip it
        return;
      }
      
      if (index === 0) {
        // Header row
        tableHtml += "<thead><tr>";
        cells.forEach(cell => {
          tableHtml += `<th>${formatInline(cell)}</th>`;
        });
        tableHtml += "</tr></thead><tbody>";
      } else {
        // Data row
        tableHtml += "<tr>";
        cells.forEach(cell => {
          tableHtml += `<td>${formatInline(cell)}</td>`;
        });
        tableHtml += "</tr>";
      }
    });
    
    tableHtml += "</tbody></table>";
    tableRows = [];
    return tableHtml;
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const isTableRow = /^\|/.test(line) && /\|$/.test(line);

    // Handle table rows
    if (isTableRow) {
      if (!inTable) {
        // Start new table
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
      return;
    } else if (inTable) {
      // End of table
      html += processTable();
      inTable = false;
    }

    // Horizontal rule: --- (3 o más guiones en una línea)
    if (/^-{3,}\s*$/.test(line)) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += '<hr class="doc-divider" />';
      return;
    }

    if (/^#\s+/.test(line)) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h1>${formatInline(line.replace(/^#\s+/, ""))}</h1>`;
      return;
    }

    if (/^##\s+/.test(line)) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h2>${formatInline(line.replace(/^##\s+/, ""))}</h2>`;
      return;
    }

    if (/^###\s+/.test(line)) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h3>${formatInline(line.replace(/^###\s+/, ""))}</h3>`;
      return;
    }

    if (/^####\s+/.test(line)) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h4>${formatInline(line.replace(/^####\s+/, ""))}</h4>`;
      return;
    }

    if (/^-\s+/.test(line)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${formatInline(line.replace(/^-\s+/, ""))}</li>`;
      return;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }

    if (!line.trim()) {
      html += '<div class="doc-spacer"></div>';
      return;
    }

    html += `<p>${formatInline(line)}</p>`;
  });

  // Close any open table
  if (inTable) {
    html += processTable();
  }

  if (inList) {
    html += "</ul>";
  }

  return html;
}

async function loadMarkdown(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load grammar markdown.");
  }
  return response.text();
}

document.addEventListener("DOMContentLoaded", async () => {
  document.body.classList.remove("no-js");
  const container = document.getElementById("doc-content");
  if (!container) return;

  const mdPath = document.body.dataset.md;
  if (!mdPath) {
    container.innerHTML = "<p>Kein Markdown-Pfad gefunden.</p>";
    return;
  }

  try {
    const text = await loadMarkdown(mdPath);
    container.innerHTML = renderMarkdown(text);
  } catch (err) {
    container.innerHTML =
      "<p>Die Grammatikdatei konnte nicht geladen werden. Bitte später erneut versuchen.</p>";
  }

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  // Sistema de modales para palabras marcadas
  initializeWordModals();
});

// Variables globales para datos
let verbsData = null;
let nounsData = null;
let adjectivesData = null;

// Función para inicializar los modales de palabras
async function initializeWordModals() {
  // Cargar datos según la página actual
  const path = window.location.pathname;
  
  try {
    if (path.includes('/verben/')) {
      const response = await fetch('rektion-verben.json');
      if (response.ok) {
        verbsData = await response.json();
        console.log('Verbos cargados:', verbsData.verbs.length);
      }
    } else if (path.includes('/nomen/')) {
      const response = await fetch('rektion-nomen.json');
      if (response.ok) {
        nounsData = await response.json();
        console.log('Nomen cargados:', nounsData.nouns.length);
      }
    } else if (path.includes('/adjektive/')) {
      const response = await fetch('rektion-adjektive.json');
      if (response.ok) {
        adjectivesData = await response.json();
        console.log('Adjektive cargados:', adjectivesData.adjectives.length);
      }
    }
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
  // Crear estructura del modal
  const overlay = document.createElement('div');
  overlay.className = 'word-modal-overlay';
  overlay.id = 'wordModalOverlay';
  
  const modal = document.createElement('div');
  modal.className = 'word-modal';
  modal.id = 'wordModal';
  modal.innerHTML = `
    <div class="word-modal-header">
      <h3 class="word-modal-title" id="wordModalTitle"></h3>
      <button class="word-modal-close" id="wordModalClose" aria-label="Cerrar">×</button>
    </div>
    <div class="word-modal-content" id="wordModalContent"></div>
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  
  // Funciones para abrir/cerrar modal
  const openModal = (word, type, content) => {
    const title = document.getElementById('wordModalTitle');
    const contentEl = document.getElementById('wordModalContent');
    
    title.textContent = word;
    contentEl.innerHTML = content;
    
    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    overlay.classList.remove('active');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  // Event listeners para cerrar
  document.getElementById('wordModalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Agregar click listeners a todas las palabras marcadas
  document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Verificar si es un verbo marcado
    if (target.classList.contains('mark-verb')) {
      e.preventDefault();
      const word = target.textContent.trim();
      const context = extractVerbContextFromJSON(target, word);
      openModal(word, 'verb', context);
      return;
    }
    
    // Verificar si es un nombre marcado
    if (target.classList.contains('mark-n')) {
      e.preventDefault();
      const word = target.textContent.trim();
      const context = extractNounContextFromJSON(target, word);
      openModal(word, 'noun', context);
      return;
    }
    
    // Verificar si es un adjetivo marcado
    if (target.classList.contains('mark-adj') || 
        target.classList.contains('mark-adj-e') ||
        target.classList.contains('mark-adj-en') ||
        target.classList.contains('mark-adj-er') ||
        target.classList.contains('mark-adj-es')) {
      e.preventDefault();
      const word = target.textContent.trim();
      const context = extractAdjectiveContextFromJSON(target, word);
      openModal(word, 'adjective', context);
      return;
    }
  });
}

// Extraer contexto de verbo desde JSON
function extractVerbContextFromJSON(element, word) {
  if (!verbsData) {
    return '<p>Los datos aún no se han cargado. Por favor, intenta de nuevo.</p>';
  }
  
  // Normalizar la palabra (quitar "sich" si existe)
  const normalizedWord = word.replace(/^sich\s+/, '').trim();
  
  // Buscar en el JSON
  const verbInfo = verbsData.verbs.find(v => {
    const vWord = v.word.replace(/^sich\s+/, '').trim();
    return vWord === normalizedWord || v.word === word;
  });
  
  if (!verbInfo) {
    return `<p>No se encontró información para "<strong>${word}</strong>" en la base de datos.</p>`;
  }
  
  let content = '<div class="modal-info">';
  
  // Traducción
  content += `<div class="modal-row">
    <strong>Traducción (ES):</strong>
    ${verbInfo.translation}
  </div>`;
  
  // Preposición
  content += `<div class="modal-row">
    <strong>Präposition + Fall:</strong>
    ${verbInfo.preposition}
  </div>`;
  
  // Ejemplo en alemán
  content += `<div class="modal-row">
    <strong>Beispiel (C1 Hochschule):</strong><br>
    ${verbInfo.example}
  </div>`;
  
  // Traducción del ejemplo
  content += `<div class="modal-row">
    <strong>Traducción del ejemplo:</strong><br>
    ${verbInfo.exampleES}
  </div>`;
  
  content += '</div>';
  return content;
}

// Extraer contexto de nombre desde JSON
function extractNounContextFromJSON(element, word) {
  if (!nounsData) {
    return '<p>Los datos aún no se han cargado. Por favor, intenta de nuevo.</p>';
  }
  
  // Normalizar la palabra (quitar artículo si existe)
  const normalizedWord = word.replace(/^(der|die|das)\s+/i, '').trim();
  
  // Buscar en el JSON
  const nounInfo = nounsData.nouns.find(n => {
    const nWord = n.word.replace(/^(der|die|das)\s+/i, '').trim();
    return nWord === normalizedWord || n.word === word;
  });
  
  if (!nounInfo) {
    return `<p>No se encontró información para "<strong>${word}</strong>" en la base de datos.</p>`;
  }
  
  let content = '<div class="modal-info">';
  
  // Traducción
  content += `<div class="modal-row">
    <strong>Traducción (ES):</strong>
    ${nounInfo.translation}
  </div>`;
  
  // Preposición
  content += `<div class="modal-row">
    <strong>Präposition + Fall:</strong>
    ${nounInfo.preposition}
  </div>`;
  
  // Ejemplo en alemán
  content += `<div class="modal-row">
    <strong>Beispiel (C1 Hochschule):</strong><br>
    ${nounInfo.example}
  </div>`;
  
  // Traducción del ejemplo
  content += `<div class="modal-row">
    <strong>Traducción del ejemplo:</strong><br>
    ${nounInfo.exampleES}
  </div>`;
  
  content += '</div>';
  return content;
}

// Extraer contexto de adjetivo desde JSON
function extractAdjectiveContextFromJSON(element, word) {
  if (!adjectivesData) {
    return '<p>Los datos aún no se han cargado. Por favor, intenta de nuevo.</p>';
  }
  
  // Normalizar la palabra (quitar terminaciones de declinación)
  const normalizedWord = word.replace(/^-/, '').replace(/e[nrs]?$/, '').trim();
  
  // Buscar en el JSON
  const adjInfo = adjectivesData.adjectives.find(a => {
    const aWord = a.word.toLowerCase();
    const nWord = normalizedWord.toLowerCase();
    return aWord === nWord || aWord.startsWith(nWord) || nWord.startsWith(aWord);
  });
  
  if (!adjInfo) {
    return `<p>No se encontró información para "<strong>${word}</strong>" en la base de datos.</p>`;
  }
  
  let content = '<div class="modal-info">';
  
  // Traducción
  content += `<div class="modal-row">
    <strong>Traducción (ES):</strong>
    ${adjInfo.translation}
  </div>`;
  
  // Preposición
  content += `<div class="modal-row">
    <strong>Rektion:</strong>
    ${adjInfo.preposition}
  </div>`;
  
  // Ejemplo en alemán
  content += `<div class="modal-row">
    <strong>Beispiel (C1 Hochschule):</strong><br>
    ${adjInfo.example}
  </div>`;
  
  // Traducción del ejemplo
  content += `<div class="modal-row">
    <strong>Traducción del ejemplo:</strong><br>
    ${adjInfo.exampleES}
  </div>`;
  
  content += '</div>';
  return content;
}
