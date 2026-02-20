/**
 * list-view.js
 * Vista de lista alternativa para el grafo ether
 * Inspirado en Notizen - items clicables que expanden detalles
 */

function createListView(entries, onSelect) {
  const STORAGE_KEY = 'telc-ether-view-mode';
  
  // Vista inicial: grafo por defecto, pero guardamos preferencia
  let currentView = localStorage.getItem(STORAGE_KEY) || 'graph';

  // Crear contenedor de la lista
  const listContainer = document.createElement('div');
  listContainer.className = 'ether-list-view';
  listContainer.hidden = currentView === 'graph';

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
          ${escapeHtml(typeLabel)}
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
        
        // Llamar callback
        onSelect({ entry, el: btn, id });
      }
    });
  });

  return {
    listContainer,
    getCurrentView: () => currentView,
    setView: (view) => {
      currentView = view;
      localStorage.setItem(STORAGE_KEY, view);
      listContainer.hidden = view === 'graph';
      
      // Mostrar/ocultar stage
      const graphStage = document.querySelector('.woerter-ether-stage');
      if (graphStage) {
        graphStage.hidden = view === 'list';
      }
    }
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

    // Esperar a que haya entries disponibles
    if (!window.etherEntries || !window.etherOnSelect) {
      console.warn('⚠️ etherEntries o etherOnSelect no disponibles para list-view');
      return;
    }

    console.log('🍋 Creando vista de lista');
    
    const listView = createListView(
      window.etherEntries,
      window.etherOnSelect
    );

    // Insertar lista después del stage
    const stage = etherContainer.querySelector('.woerter-ether-stage');
    if (stage) {
      stage.parentNode.insertBefore(listView.listContainer, stage.nextSibling);
    } else {
      etherContainer.appendChild(listView.listContainer);
    }

    // Crear botón de toggle en los controles
    const controls = etherContainer.querySelector('.woerter-ether-controls-body');
    if (controls) {
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'ether-view-toggle-btn';
      toggleBtn.innerHTML = '📋 Lista';
      toggleBtn.title = 'Cambiar a vista de lista';
      
      // Estado inicial
      const updateToggleBtn = () => {
        const isListView = listView.getCurrentView() === 'list';
        toggleBtn.classList.toggle('is-active', isListView);
        toggleBtn.innerHTML = isListView ? '🕸️ Grafo' : '📋 Lista';
        toggleBtn.title = isListView ? 'Cambiar a vista de grafo' : 'Cambiar a vista de lista';
      };
      
      toggleBtn.addEventListener('click', () => {
        const newView = listView.getCurrentView() === 'graph' ? 'list' : 'graph';
        listView.setView(newView);
        updateToggleBtn();
        
        // Limpiar selección al cambiar de vista
        if (newView === 'graph') {
          listView.listContainer.querySelectorAll('.ether-list-item').forEach(b => 
            b.classList.remove('is-active')
          );
        }
      });
      
      updateToggleBtn();
      controls.appendChild(toggleBtn);
    }

    window.etherListView = listView;
  }, 200);
});

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createListView };
}
