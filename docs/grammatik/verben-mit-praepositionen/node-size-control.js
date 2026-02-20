/**
 * node-size-control.js
 * Control para ajustar el tamaño de los nodos del grafo ether en vivo
 */

function createNodeSizeControl(container) {
  const STORAGE_KEY = 'telc-ether-node-size';
  
  // Tamaños preestablecidos (escala multiplicadora)
  const sizes = {
    xs: { label: 'XS', scale: 0.7, description: 'Extra pequeño' },
    s: { label: 'S', scale: 0.85, description: 'Pequeño' },
    m: { label: 'M', scale: 1.0, description: 'Normal' },
    l: { label: 'L', scale: 1.25, description: 'Grande' },
    xl: { label: 'XL', scale: 1.5, description: 'Extra grande' },
    xxl: { label: 'XXL', scale: 1.8, description: 'Gigante' }
  };

  // Obtener tamaño guardado o usar M por defecto
  let currentSize = localStorage.getItem(STORAGE_KEY) || 'm';
  
  // Crear UI
  const controlWrapper = document.createElement('div');
  controlWrapper.className = 'node-size-control';
  controlWrapper.innerHTML = `
    <div class="node-size-control-header">
      <span class="node-size-label">Tamaño nodos</span>
      <span class="node-size-current" data-role="current">${sizes[currentSize].label}</span>
    </div>
    <div class="node-size-buttons" data-role="buttons"></div>
  `;

  const buttonsContainer = controlWrapper.querySelector('[data-role="buttons"]');
  const currentLabel = controlWrapper.querySelector('[data-role="current"]');

  // Aplicar tamaño (via CSS custom property)
  const applySize = (sizeKey) => {
    const size = sizes[sizeKey];
    if (!size) return;

    // Aplicar variable CSS a todos los nodos
    document.documentElement.style.setProperty('--node-scale', size.scale);
    
    // Actualizar UI
    currentLabel.textContent = size.label;
    currentLabel.title = size.description;
    
    // Actualizar botones activos
    buttonsContainer.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.size === sizeKey);
    });

    // Guardar preferencia
    localStorage.setItem(STORAGE_KEY, sizeKey);
    currentSize = sizeKey;

    // Trigger resize en nodos si es necesario
    // (El CSS ya maneja el cambio via --node-scale)
  };

  // Crear botones
  Object.entries(sizes).forEach(([key, config]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'node-size-btn';
    btn.dataset.size = key;
    btn.textContent = config.label;
    btn.title = config.description;
    
    if (key === currentSize) {
      btn.classList.add('is-active');
    }

    btn.addEventListener('click', () => {
      applySize(key);
    });

    buttonsContainer.appendChild(btn);
  });

  // Aplicar tamaño inicial
  applySize(currentSize);

  // Insertar en el container (dentro de los controles del ether)
  if (container) {
    container.appendChild(controlWrapper);
  }

  return {
    element: controlWrapper,
    setSize: applySize,
    getSize: () => currentSize,
    getSizes: () => sizes
  };
}

// Auto-init si encuentra el contenedor
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const controlsBody = document.querySelector('.woerter-ether-controls-body');
    if (controlsBody) {
      console.log('🍋 Creando control de tamaño de nodos');
      window.nodeSizeControl = createNodeSizeControl(controlsBody);
    }
  }, 100);
});

// Export para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createNodeSizeControl };
}
