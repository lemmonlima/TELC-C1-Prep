/**
 * node-size-control.js
 * Control para ajustar el tamaño de los nodos del grafo ether en vivo
 */

function createNodeSizeControl(etherContainer, controlsContainer) {
  const STORAGE_KEY = "telc-ether-node-scale";
  const LEGACY_STORAGE_KEY = "telc-ether-node-size";
  const MIN_SCALE = 0.7;
  const MAX_SCALE = 1.8;
  const STEP = 0.05;

  const legacyMap = {
    xs: 0.7,
    s: 0.85,
    m: 1.0,
    l: 1.25,
    xl: 1.5,
    xxl: 1.8
  };

  const clampScale = (value) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

  const parseSavedScale = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw != null) {
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) return clampScale(parsed);
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy && legacyMap[legacy]) return legacyMap[legacy];
    return 1;
  };

  const formatPercent = (scale) => `${Math.round(scale * 100)}%`;

  const controlWrapper = document.createElement("div");
  controlWrapper.className = "node-size-control";
  controlWrapper.innerHTML = `
    <div class="node-size-control-header">
      <span class="node-size-label">Tamaño nodos</span>
      <span class="node-size-current" data-role="current">100%</span>
    </div>
    <input
      type="range"
      class="node-size-slider"
      data-role="slider"
      min="${MIN_SCALE}"
      max="${MAX_SCALE}"
      step="${STEP}"
      value="1"
      aria-label="Ajustar tamaño de nodos"
    />
  `;

  const slider = controlWrapper.querySelector('[data-role="slider"]');
  const currentLabel = controlWrapper.querySelector('[data-role="current"]');
  let currentScale = 1;

  const applyScale = (scale, persist = true) => {
    currentScale = clampScale(Number(scale) || 1);
    document.documentElement.style.setProperty("--node-scale", currentScale.toFixed(2));
    slider.value = String(currentScale);
    currentLabel.textContent = formatPercent(currentScale);
    if (persist) {
      localStorage.setItem(STORAGE_KEY, currentScale.toFixed(2));
    }
  };

  slider.addEventListener("input", () => {
    applyScale(slider.value);
  });

  const initialScale = parseSavedScale();
  applyScale(initialScale, true);

  if (controlsContainer) {
    controlsContainer.insertAdjacentElement("afterend", controlWrapper);
  } else if (etherContainer) {
    etherContainer.appendChild(controlWrapper);
  }

  return {
    element: controlWrapper,
    setScale: (scale) => applyScale(scale, true),
    getScale: () => currentScale
  };
}

// Auto-init si encuentra el contenedor
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const etherContainer = document.querySelector('.woerter-ether');
    if (!etherContainer) return;
    const controls = etherContainer.querySelector('.woerter-ether-controls');
    if (controls) {
      window.nodeSizeControl = createNodeSizeControl(etherContainer, controls);
    }
  }, 100);
});

// Export para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createNodeSizeControl };
}
