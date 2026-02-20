#!/bin/bash

# Script para integrar automáticamente las mejoras móviles del ether
# Uso: ./integrate-mobile-improvements.sh

set -e

PROJECT_DIR="$HOME/Projects/TELC"
DOCS_DIR="$PROJECT_DIR/docs"

echo "🚀 Integrando mejoras móviles para el grafo ether..."
echo ""

# Función para agregar el CSS si no existe
add_mobile_css() {
    local html_file="$1"
    
    if ! grep -q "styles-mobile-ether.css" "$html_file"; then
        echo "  ✅ Agregando CSS móvil a $(basename "$html_file")"
        
        # Buscar la línea con styles.css y agregar después
        sed -i.bak '/<link.*styles\.css/a\  <link rel="stylesheet" href="/styles-mobile-ether.css">' "$html_file"
    else
        echo "  ⏭️  CSS móvil ya existe en $(basename "$html_file")"
    fi
}

# Función para agregar el script de gestos
add_mobile_script() {
    local html_file="$1"
    local script_path="$2"
    local activation_code="$3"
    
    if ! grep -q "mobile-gestures.js" "$html_file"; then
        echo "  ✅ Agregando script móvil a $(basename "$html_file")"
        
        # Buscar </body> e insertar antes
        local temp_file=$(mktemp)
        awk -v script="$script_path" -v activation="$activation_code" '
            /<\/body>/ {
                print "  <script src=\"" script "\"></script>"
                print "  <script>"
                print activation
                print "  </script>"
            }
            { print }
        ' "$html_file" > "$temp_file"
        
        mv "$temp_file" "$html_file"
    else
        echo "  ⏭️  Script móvil ya existe en $(basename "$html_file")"
    fi
}

# Función para modificar JS y exponer etherState
expose_ether_state() {
    local js_file="$1"
    
    if ! grep -q "window.etherState" "$js_file"; then
        echo "  ✅ Exponiendo etherState en $(basename "$js_file")"
        
        # Buscar el final de buildEther y agregar antes del cierre
        # Esto es más seguro hacerlo manualmente, pero daremos una guía
        echo "  ⚠️  MANUAL: Agrega 'window.etherState = state;' al final de buildEther() en $js_file"
    else
        echo "  ⏭️  etherState ya expuesto en $(basename "$js_file")"
    fi
}

# Código de activación para Wörter
ACTIVATION_WOERTER='    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        const stage = document.querySelector(".woerter-ether-stage");
        const panel = document.querySelector(".woerter-panel");
        
        if (stage && window.etherState && typeof enhanceMobileGestures === "function") {
          enhanceMobileGestures(window.etherState, applyView);
          
          if (panel && typeof enhanceMobilePanel === "function") {
            enhanceMobilePanel(panel);
          }
        }
      }, 500);
    });'

# Código de activación para Verben
ACTIVATION_VERBEN='    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        const stage = document.querySelector(".woerter-ether-stage");
        const panel = document.querySelector(".woerter-panel");
        
        if (stage && window.etherState && typeof enhanceMobileGestures === "function") {
          enhanceMobileGestures(window.etherState, applyView);
          
          if (panel && typeof enhanceMobilePanel === "function") {
            enhanceMobilePanel(panel);
          }
        }
      }, 500);
    });'

# Procesar Wörter
echo "📁 Procesando Wörter..."
WOERTER_DIR="$DOCS_DIR/woerter"

if [ -f "$WOERTER_DIR/index.html" ]; then
    add_mobile_css "$WOERTER_DIR/index.html"
    # add_mobile_script "$WOERTER_DIR/index.html" "mobile-gestures.js" "$ACTIVATION_WOERTER"
fi

if [ -f "$WOERTER_DIR/solo.html" ]; then
    add_mobile_css "$WOERTER_DIR/solo.html"
    # add_mobile_script "$WOERTER_DIR/solo.html" "mobile-gestures.js" "$ACTIVATION_WOERTER"
fi

if [ -f "$WOERTER_DIR/woerter.js" ]; then
    expose_ether_state "$WOERTER_DIR/woerter.js"
fi

echo ""

# Procesar Präfixverben
echo "📁 Procesando Präfixverben..."
VERBEN_DIR="$DOCS_DIR/grammatik/verben-mit-praepositionen"

if [ -f "$VERBEN_DIR/index.html" ]; then
    add_mobile_css "$VERBEN_DIR/index.html"
    # add_mobile_script "$VERBEN_DIR/index.html" "mobile-gestures.js" "$ACTIVATION_VERBEN"
fi

if [ -f "$VERBEN_DIR/karte.html" ]; then
    add_mobile_css "$VERBEN_DIR/karte.html"
    # add_mobile_script "$VERBEN_DIR/karte.html" "mobile-gestures.js" "$ACTIVATION_VERBEN"
fi

if [ -f "$VERBEN_DIR/verben-mit-praepositionen.js" ]; then
    expose_ether_state "$VERBEN_DIR/verben-mit-praepositionen.js"
fi

echo ""
echo "✨ Integración completada!"
echo ""
echo "⚠️  PASOS MANUALES REQUERIDOS:"
echo ""
echo "1. Revisar los archivos .bak creados (backups)"
echo "2. Agregar 'window.etherState = state;' al final de buildEther() en:"
echo "   - $WOERTER_DIR/woerter.js"
echo "   - $VERBEN_DIR/verben-mit-praepositionen.js"
echo ""
echo "3. (Opcional) Agregar manualmente los scripts de activación si quieres"
echo "   soporte completo de gestos (pinch-to-zoom, etc.)"
echo ""
echo "4. Probar en móvil y escritorio para verificar que todo funciona"
echo ""
echo "📖 Lee MOBILE-ETHER-IMPROVEMENTS.md para más detalles"
