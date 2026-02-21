/**
 * node-size-control.js
 * Control para ajustar el tamaño INTERNO del canvas del grafo ether
 */

function createCanvasSizeControl(etherContainer) {
  const STORAGE_KEY = "telc-ether-world-size";
  const LEGACY_STORAGE_KEY = "telc-ether-canvas-vh";
  const MIN_SIZE = 700;
  const MAX_SIZE = 2200;
  const STEP = 50;
  const DEFAULT_SIZE = 1000;

  const clampSize = (value) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, value));

  const parseSavedVh = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw != null) {
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) return clampSize(parsed);
    }
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw != null) {
      const parsedLegacy = Number(legacyRaw);
      if (!Number.isNaN(parsedLegacy)) return DEFAULT_SIZE;
    }
    return DEFAULT_SIZE;
  };

  const controlWrapper = document.createElement("div");
  controlWrapper.className = "canvas-size-control";
  controlWrapper.innerHTML = `
    <input
      type="range"
      class="canvas-size-slider"
      data-role="slider"
      min="${MIN_SIZE}"
      max="${MAX_SIZE}"
      step="${STEP}"
      value="${DEFAULT_SIZE}"
      aria-label="Ajustar tamaño interno del canvas"
    />
  `;

  const slider = controlWrapper.querySelector('[data-role="slider"]');
  let currentSize = DEFAULT_SIZE;

  const applyWorldSize = (value, persist = true) => {
    currentSize = clampSize(Number(value) || DEFAULT_SIZE);
    slider.value = String(currentSize);
    window.__telcEtherWorldSize = currentSize;
    if (persist) {
      localStorage.setItem(STORAGE_KEY, String(currentSize));
    }
    window.dispatchEvent(new CustomEvent("telc:ether-world-size-change", { detail: { size: currentSize } }));
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
  };

  slider.addEventListener("input", () => {
    applyWorldSize(slider.value);
  });

  const stage = etherContainer.querySelector(".woerter-ether-stage");
  if (stage) stage.insertAdjacentElement("afterend", controlWrapper);
  else etherContainer.appendChild(controlWrapper);

  const initialSize = parseSavedVh();
  applyWorldSize(initialSize, true);

  return {
    element: controlWrapper,
    setWorldSize: (size) => applyWorldSize(size, true),
    getWorldSize: () => currentSize
  };
}

function initCanvasSizeControls(root = document) {
  const direct =
    root instanceof HTMLElement && root.classList.contains("woerter-ether") ? [root] : [];
  const fromRoot =
    root && typeof root.querySelectorAll === "function" ? Array.from(root.querySelectorAll(".woerter-ether")) : [];
  const containers = [...direct, ...fromRoot];

  containers.forEach((etherContainer) => {
    if (!(etherContainer instanceof HTMLElement)) return;
    if (etherContainer.dataset.canvasControlInit === "1") return;
    const stage = etherContainer.querySelector(".woerter-ether-stage");
    if (!stage) return;
    etherContainer.dataset.canvasControlInit = "1";
    const control = createCanvasSizeControl(etherContainer);
    window.canvasSizeControl = control;
  });
}

// Auto-init robusto: el grafo se crea de forma asíncrona.
document.addEventListener("DOMContentLoaded", () => {
  window.createCanvasSizeControl = createCanvasSizeControl;
  window.initCanvasSizeControls = initCanvasSizeControls;
  initCanvasSizeControls();
  const observer = new MutationObserver(() => {
    initCanvasSizeControls();
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
  window.addEventListener("load", initCanvasSizeControls, { once: true });
});

// Export para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCanvasSizeControl };
}
