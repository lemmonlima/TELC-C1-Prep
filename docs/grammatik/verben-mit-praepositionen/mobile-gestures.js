/**
 * mobile-gestures.js
 * Soporte para gestos móviles en el grafo ether
 * Incluir después del script principal de woerter.js o verben-mit-praepositionen.js
 */

/**
 * Agrega soporte completo para gestos móviles al stage del ether
 * @param {Object} state - Estado del grafo (debe contener stage, view, space)
 * @param {Function} applyView - Función para aplicar cambios de vista
 */
function enhanceMobileGestures(state, applyView) {
  const stage = state.stage;
  if (!stage) return;

  // Detectar si es dispositivo táctil
  const isTouchDevice = 'ontouchstart' in window;
  if (!isTouchDevice) return; // Solo aplicar en dispositivos táctiles

  // Estado para gestos multi-touch
  const gestureState = {
    touches: new Map(),
    initialPinchDistance: null,
    initialZoom: null,
    initialPinchCenter: null,
    lastTapTime: 0,
    doubleTapThreshold: 300
  };

  /**
   * Calcula la distancia entre dos puntos touch
   */
  function getTouchDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calcula el punto medio entre dos puntos touch
   */
  function getTouchMidpoint(touch1, touch2) {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }

  /**
   * Maneja inicio de gestos multi-touch
   */
  function handleTouchStart(event) {
    // Actualizar mapa de touches
    Array.from(event.changedTouches).forEach(touch => {
      gestureState.touches.set(touch.identifier, {
        clientX: touch.clientX,
        clientY: touch.clientY,
        startX: touch.clientX,
        startY: touch.clientY
      });
    });

    // Si hay 2 touches, inicializar pinch-to-zoom
    if (gestureState.touches.size === 2) {
      const [touch1, touch2] = Array.from(gestureState.touches.values());
      gestureState.initialPinchDistance = getTouchDistance(touch1, touch2);
      gestureState.initialZoom = state.view.zoom;
      gestureState.initialPinchCenter = getTouchMidpoint(touch1, touch2);
      
      // Prevenir comportamiento por defecto
      if (event.cancelable) {
        event.preventDefault();
      }
    }

    // Detectar doble tap
    if (gestureState.touches.size === 1) {
      const now = Date.now();
      const timeSinceLastTap = now - gestureState.lastTapTime;
      
      if (timeSinceLastTap < gestureState.doubleTapThreshold) {
        handleDoubleTap(event);
      }
      
      gestureState.lastTapTime = now;
    }
  }

  /**
   * Maneja movimiento de gestos multi-touch
   */
  function handleTouchMove(event) {
    // Actualizar posiciones
    Array.from(event.changedTouches).forEach(touch => {
      if (gestureState.touches.has(touch.identifier)) {
        gestureState.touches.set(touch.identifier, {
          ...gestureState.touches.get(touch.identifier),
          clientX: touch.clientX,
          clientY: touch.clientY
        });
      }
    });

    // Pinch-to-zoom con 2 dedos
    if (gestureState.touches.size === 2 && gestureState.initialPinchDistance) {
      const [touch1, touch2] = Array.from(gestureState.touches.values());
      const currentDistance = getTouchDistance(touch1, touch2);
      const currentCenter = getTouchMidpoint(touch1, touch2);

      // Calcular nuevo zoom
      const zoomFactor = currentDistance / gestureState.initialPinchDistance;
      const newZoom = Math.max(0.3, Math.min(3, gestureState.initialZoom * zoomFactor));

      // Calcular nuevo pan para mantener el centro del pinch en la misma posición
      const rect = stage.getBoundingClientRect();
      const initialCenterX = gestureState.initialPinchCenter.x - rect.left;
      const initialCenterY = gestureState.initialPinchCenter.y - rect.top;
      const currentCenterX = currentCenter.x - rect.left;
      const currentCenterY = currentCenter.y - rect.top;

      // Worldspace point que queremos mantener fijo
      const worldX = (initialCenterX - state.view.panX) / gestureState.initialZoom;
      const worldY = (initialCenterY - state.view.panY) / gestureState.initialZoom;

      // Nuevo pan
      state.view.zoom = newZoom;
      state.view.panX = currentCenterX - worldX * newZoom;
      state.view.panY = currentCenterY - worldY * newZoom;

      applyView(state);

      if (event.cancelable) {
        event.preventDefault();
      }
    }
  }

  /**
   * Maneja fin de gestos multi-touch
   */
  function handleTouchEnd(event) {
    // Remover touches finalizados
    Array.from(event.changedTouches).forEach(touch => {
      gestureState.touches.delete(touch.identifier);
    });

    // Reset pinch state si ya no hay 2 dedos
    if (gestureState.touches.size < 2) {
      gestureState.initialPinchDistance = null;
      gestureState.initialZoom = null;
      gestureState.initialPinchCenter = null;
    }
  }

  /**
   * Maneja cancelación de touch
   */
  function handleTouchCancel(event) {
    handleTouchEnd(event);
  }

  /**
   * Maneja doble tap para resetear zoom
   */
  function handleDoubleTap(event) {
    const rect = stage.getBoundingClientRect();
    const touch = event.changedTouches[0];
    const tapX = touch.clientX - rect.left;
    const tapY = touch.clientY - rect.top;

    // Si ya está en zoom 1, hacer zoom in
    // Si está con zoom, volver a zoom 1
    const targetZoom = Math.abs(state.view.zoom - 1) < 0.1 ? 2 : 1;

    // Zoom centrado en el punto del tap
    const worldX = (tapX - state.view.panX) / state.view.zoom;
    const worldY = (tapY - state.view.panY) / state.view.zoom;

    state.view.zoom = targetZoom;
    state.view.panX = tapX - worldX * targetZoom;
    state.view.panY = tapY - worldY * targetZoom;

    applyView(state);

    if (event.cancelable) {
      event.preventDefault();
    }
  }

  // Agregar event listeners
  stage.addEventListener('touchstart', handleTouchStart, { passive: false });
  stage.addEventListener('touchmove', handleTouchMove, { passive: false });
  stage.addEventListener('touchend', handleTouchEnd, { passive: false });
  stage.addEventListener('touchcancel', handleTouchCancel, { passive: false });

  // Retornar función de cleanup
  return function cleanup() {
    stage.removeEventListener('touchstart', handleTouchStart);
    stage.removeEventListener('touchmove', handleTouchMove);
    stage.removeEventListener('touchend', handleTouchEnd);
    stage.removeEventListener('touchcancel', handleTouchCancel);
  };
}

/**
 * Mejora el panel móvil con gesto de arrastre para cerrar
 * @param {HTMLElement} panel - Elemento del panel
 */
function enhanceMobilePanel(panel) {
  if (!panel) return;

  const isTouchDevice = 'ontouchstart' in window;
  if (!isTouchDevice) return;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let initialScrollTop = 0;

  function handleTouchStart(event) {
    const touch = event.touches[0];
    startY = touch.clientY;
    currentY = startY;
    initialScrollTop = panel.scrollTop;
    isDragging = false;
  }

  function handleTouchMove(event) {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    currentY = touch.clientY;
    const deltaY = currentY - startY;

    // Solo permitir arrastrar hacia abajo si el panel está en el tope
    if (deltaY > 0 && panel.scrollTop === 0) {
      isDragging = true;
      
      // Aplicar resistencia al arrastre
      const resistance = 0.5;
      const translateY = deltaY * resistance;
      
      panel.style.transform = `translateY(${translateY}px)`;
      panel.style.transition = 'none';

      if (event.cancelable) {
        event.preventDefault();
      }
    }
  }

  function handleTouchEnd(event) {
    if (!isDragging) return;

    const deltaY = currentY - startY;
    const threshold = 100; // Umbral para cerrar el panel

    if (deltaY > threshold) {
      // Cerrar panel (ocultar contenido)
      panel.innerHTML = '';
      panel.style.transform = '';
      panel.style.transition = '';
    } else {
      // Volver a posición original
      panel.style.transform = '';
      panel.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        panel.style.transition = '';
      }, 300);
    }

    isDragging = false;
  }

  panel.addEventListener('touchstart', handleTouchStart, { passive: true });
  panel.addEventListener('touchmove', handleTouchMove, { passive: false });
  panel.addEventListener('touchend', handleTouchEnd, { passive: true });

  return function cleanup() {
    panel.removeEventListener('touchstart', handleTouchStart);
    panel.removeEventListener('touchmove', handleTouchMove);
    panel.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * Mejora los botones de zoom para móvil (opcional)
 * @param {Object} state - Estado del grafo
 * @param {Function} applyView - Función para aplicar vista
 * @param {HTMLElement} container - Contenedor donde agregar botones
 */
function addMobileZoomControls(state, applyView, container) {
  const isTouchDevice = 'ontouchstart' in window;
  if (!isTouchDevice) return;

  const controlsWrapper = document.createElement('div');
  controlsWrapper.className = 'mobile-zoom-controls';
  controlsWrapper.style.cssText = `
    position: absolute;
    bottom: 60px;
    right: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 5;
  `;

  const buttonStyle = `
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(10px);
  `;

  const zoomInBtn = document.createElement('button');
  zoomInBtn.innerHTML = '+';
  zoomInBtn.type = 'button';
  zoomInBtn.style.cssText = buttonStyle;
  zoomInBtn.addEventListener('click', () => {
    const rect = state.stage.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const worldX = (centerX - state.view.panX) / state.view.zoom;
    const worldY = (centerY - state.view.panY) / state.view.zoom;
    
    state.view.zoom = Math.min(3, state.view.zoom * 1.3);
    state.view.panX = centerX - worldX * state.view.zoom;
    state.view.panY = centerY - worldY * state.view.zoom;
    
    applyView(state);
  });

  const zoomOutBtn = document.createElement('button');
  zoomOutBtn.innerHTML = '−';
  zoomOutBtn.type = 'button';
  zoomOutBtn.style.cssText = buttonStyle;
  zoomOutBtn.addEventListener('click', () => {
    const rect = state.stage.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const worldX = (centerX - state.view.panX) / state.view.zoom;
    const worldY = (centerY - state.view.panY) / state.view.zoom;
    
    state.view.zoom = Math.max(0.3, state.view.zoom / 1.3);
    state.view.panX = centerX - worldX * state.view.zoom;
    state.view.panY = centerY - worldY * state.view.zoom;
    
    applyView(state);
  });

  const resetBtn = document.createElement('button');
  resetBtn.innerHTML = '⟲';
  resetBtn.type = 'button';
  resetBtn.style.cssText = buttonStyle;
  resetBtn.addEventListener('click', () => {
    state.view.zoom = 1;
    state.view.panX = 0;
    state.view.panY = 0;
    applyView(state);
  });

  controlsWrapper.appendChild(zoomInBtn);
  controlsWrapper.appendChild(zoomOutBtn);
  controlsWrapper.appendChild(resetBtn);

  container.appendChild(controlsWrapper);

  return controlsWrapper;
}

// Export para uso modular si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    enhanceMobileGestures,
    enhanceMobilePanel,
    addMobileZoomControls
  };
}
