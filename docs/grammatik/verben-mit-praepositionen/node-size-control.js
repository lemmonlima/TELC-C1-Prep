/**
 * node-size-control.js
 * Control para ajustar el tamaño del canvas del grafo ether
 */

function createCanvasSizeControl(etherContainer) {
  const STORAGE_KEY = "telc-ether-canvas-vh";
  const MIN_VH = 50;
  const MAX_VH = 92;
  const STEP = 1;

  const clampVh = (value) => Math.min(MAX_VH, Math.max(MIN_VH, value));

  const defaultVh = window.matchMedia("(max-width: 768px)").matches ? 65 : 80;

  const parseSavedVh = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return defaultVh;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return defaultVh;
    return clampVh(parsed);
  };

  const controlWrapper = document.createElement("div");
  controlWrapper.className = "canvas-size-control";
  controlWrapper.innerHTML = `
    <input
      type="range"
      class="canvas-size-slider"
      data-role="slider"
      min="${MIN_VH}"
      max="${MAX_VH}"
      step="${STEP}"
      value="${defaultVh}"
      aria-label="Ajustar tamaño del canvas"
    />
  `;

  const slider = controlWrapper.querySelector('[data-role="slider"]');
  let currentVh = defaultVh;

  const applyVh = (value, persist = true) => {
    currentVh = clampVh(Number(value) || defaultVh);
    etherContainer.style.setProperty("--ether-stage-vh", String(currentVh));
    slider.value = String(currentVh);
    if (persist) {
      localStorage.setItem(STORAGE_KEY, String(currentVh));
    }
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
  };

  slider.addEventListener("input", () => {
    applyVh(slider.value);
  });

  const stage = etherContainer.querySelector(".woerter-ether-stage");
  if (stage) stage.insertAdjacentElement("afterend", controlWrapper);
  else etherContainer.appendChild(controlWrapper);

  const initialVh = parseSavedVh();
  applyVh(initialVh, true);

  return {
    element: controlWrapper,
    setVh: (vh) => applyVh(vh, true),
    getVh: () => currentVh
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
