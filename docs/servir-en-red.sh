#!/bin/bash
# Sirve TELC/WEB en la red local. En el iPad abre http://<IP_DE_TU_MAC>:8080
cd "$(dirname "$0")"
echo "Servidor en http://$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo 'localhost'):8080"
echo "En el iPad usa la IP que aparece arriba. Ctrl+C para parar."
python3 -m http.server 8080 --bind 0.0.0.0
