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

// Auto-init si encuentra el contenedor
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const etherContainer = document.querySelector('.woerter-ether');
    if (!etherContainer) return;
    window.canvasSizeControl = createCanvasSizeControl(etherContainer);
  }, 100);
});

// Export para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCanvasSizeControl };
}
