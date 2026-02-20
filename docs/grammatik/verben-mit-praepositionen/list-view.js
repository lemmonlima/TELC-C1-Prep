/**
 * list-view.js
 * Vista de lista alternativa para el grafo ether (especialmente útil en móviles)
 */

function createListView(entries, onSelect) {
  const STORAGE_KEY = 'telc-ether-view-mode';
  
  // Determinar vista inicial (lista en móvil, grafo en escritorio)
  const isMobile = window.innerWidth <= 768;
  const defaultView = isMobile ? 'list' : 'graph';
  let currentView = localStorage.getItem(STORAGE_KEY) || defaultView;

  // Crear contenedor de la lista
  const listContainer = document.createElement('div');
  listContainer.className = 'ether-list-view';
  listContainer.hidden = currentView === 'graph';

  // Crear toggle de vista
  const viewToggle = document.createElement('div');
  viewToggle.className = 'ether-view-toggle';
  viewToggle.innerHTML = `
    <button type="button" class="view-toggle-btn" data-view="graph" title="Vista de grafo">
      <span class="view-toggle-icon">🕸️</span>
      <span class="view-toggle-label">Grafo</span>
    </button>
    <button type="button" class="view-toggle-btn" data-view="list" title="Vista de lista">
      <span class="view-toggle-icon">📋</span>
      <span class="view-toggle-label">Lista</span>
    </button>
  `;

  // Agrupar por tipo
  const byType = {};
  entries.forEach(entry => {
    const type = entry.type || 'sin-tipo';
    if (!byType[type]) byType[type] = [];
    byType[type].push(entry);
  });

  // Ordenar dentro de cada tipo
  Object.keys(byType).forEach(type => {
    byType[type].sort((a, b) => (a.word || '').localeCompare(b.word || '', 'de'));
  });

  // Mapeo de labels de tipos
  const TYPE_LABELS = {
    verb: 'Verben',
    nomen: 'Nomen',
    noun: 'Nomen',
    adjektiv: 'Adjektive',
    adjective: 'Adjektive',
    artikel: 'Artikel',
    pronomen: 'Pronomen',
    adverb: 'Adverbien',
    präposition: 'Präpositionen',
    preposition: 'Präpositionen',
    konjunktion: 'Konjunktionen',
    subjunktion: 'Subjunktionen',
    partikel: 'Partikeln',
    phrase: 'Phrasen',
    'sin-tipo': 'Andere'
  };

  // Renderizar lista
  let html = '<div class="ether-list-groups">';
  
  Object.keys(byType).sort().forEach(type => {
    const items = byType[type];
    const typeLabel = TYPE_LABELS[type] || type;
    
    html += `
      <div class="ether-list-group">
        <h3 class="ether-list-group-title" data-type="${type}">
          <span class="ether-list-group-count">${items.length}</span>
          ${typeLabel}
        </h3>
        <div class="ether-list-items">
    `;
    
    items.forEach(entry => {
      const hasTranslation = entry.translation && entry.translation.trim();
      const hasExamples = entry.examples && entry.examples.length > 0;
      
      html += `
        <button 
          type="button" 
          class="ether-list-item" 
          data-id="${entry.id}"
          data-type="${type}"
        >
          <span class="ether-list-item-word">${escapeHtml(entry.word || '')}</span>
          ${hasTranslation ? `<span class="ether-list-item-translation">${escapeHtml(entry.translation)}</span>` : ''}
          ${hasExamples ? `<span class="ether-list-item-badge">${entry.examples.length} ej.</span>` : ''}
        </button>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  listContainer.innerHTML = html;

  // Event listeners para items
  listContainer.querySelectorAll('.ether-list-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const entry = entries.find(e => e.id === id);
      if (entry && onSelect) {
        // Marcar como activo
        listContainer.querySelectorAll('.ether-list-item').forEach(b => 
          b.classList.remove('is-active')
        );
        btn.classList.add('is-active');
        
        // Llamar callback con formato similar al grafo
        onSelect({ entry, el: btn, id });
      }
    });
  });

  // Event listeners para toggle
  const updateView = (view) => {
    currentView = view;
    localStorage.setItem(STORAGE_KEY, view);
    
    // Actualizar botones
    viewToggle.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.view === view);
    });
    
    // Mostrar/ocultar vistas
    listContainer.hidden = view === 'graph';
    const graphStage = document.querySelector('.woerter-ether-stage');
    if (graphStage) {
      graphStage.hidden = view === 'list';
    }
    
    // Cerrar panel si cambiamos de vista
    const panel = document.querySelector('.woerter-panel');
    if (panel && view === 'graph') {
      // Limpiar selección de lista
      listContainer.querySelectorAll('.ether-list-item').forEach(b => 
        b.classList.remove('is-active')
      );
    }
  };

  viewToggle.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      updateView(btn.dataset.view);
    });
  });

  // Inicializar estado
  updateView(currentView);

  return {
    listContainer,
    viewToggle,
    updateView,
    getCurrentView: () => currentView
  };
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Auto-integración
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Buscar el container del ether
    const etherContainer = document.querySelector('.woerter-ether');
    if (!etherContainer) return;

    // Buscar los controles
    const controls = etherContainer.querySelector('.woerter-ether-controls');
    if (!controls) return;

    // Esperar a que haya entries disponibles
    if (!window.etherEntries || !window.etherOnSelect) {
      console.warn('⚠️ etherEntries o etherOnSelect no disponibles para list-view');
      return;
    }

    console.log('🍋 Creando vista de lista');
    
    const { listContainer, viewToggle } = createListView(
      window.etherEntries,
      window.etherOnSelect
    );

    // Insertar toggle en los controles
    controls.appendChild(viewToggle);

    // Insertar lista después del stage
    const stage = etherContainer.querySelector('.woerter-ether-stage');
    if (stage) {
      stage.parentNode.insertBefore(listContainer, stage.nextSibling);
    } else {
      etherContainer.appendChild(listContainer);
    }

    window.etherListView = { listContainer, viewToggle };
  }, 200);
});

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createListView };
}
