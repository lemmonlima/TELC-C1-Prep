# Abrir TELC/WEB en iPad o celular (misma WiFi)

Para ver el sitio en el iPad o celular y que refleje los cambios que haces en el Mac:

## 1. Iniciar el servidor en el Mac

**Importante:** El servidor debe estar corriendo antes de abrir la página. Si no, verás "Connection Failed" o "ERR_CONNECTION_REFUSED".

En la Terminal, desde la carpeta del proyecto:

```bash
cd /Users/andresbonilla/Documents/Novo/TELC/WEB
python3 -m http.server 8080 --bind 0.0.0.0
```

O usa el script incluido (mismo directorio):

```bash
./servir-en-red.sh
```

Deja la Terminal abierta mientras uses el sitio en el dispositivo.

## 2. Verificar en el Mac

Antes de probar en el celular, abre en Safari o Chrome del Mac:

```
http://localhost:8080
```

Si funciona aquí, el servidor está bien. Si no, el servidor no está corriendo (vuelve al paso 1).

## 3. Obtener la IP de tu Mac

En el Mac, en Terminal:

```bash
ipconfig getifaddr en0
```

Si usas WiFi, suele ser `en0`. Si no devuelve nada, prueba:

```bash
ipconfig getifaddr en1
```

O en **Preferencias del Sistema → Red → Wi‑Fi → Detalles** verás la dirección IP.

## 4. Abrir en iPad o celular

1. Conecta el dispositivo a la **misma red Wi‑Fi** que el Mac.
2. En Safari (u otro navegador) escribe:

   ```
   http://TU_IP:8080
   ```

   Ejemplo: `http://192.168.178.60:8080`

3. Enlaces directos:
   - Texte: `http://TU_IP:8080/texte/`
   - Wörter: `http://TU_IP:8080/woerter/`
   - Grammatik: `http://TU_IP:8080/grammatik/`

## Ver los cambios

- Edita los archivos (HTML, JS, JSON, etc.) en el Mac.
- En el dispositivo, **actualiza la página** (deslizar hacia abajo o botón de recargar) para ver los cambios.

## Parar el servidor

En la Terminal del Mac: `Ctrl + C`.

---

## Si no conecta (ERR_CONNECTION_REFUSED)

1. **¿Está corriendo el servidor?** — Es la causa más común. Inicia el servidor (paso 1) y deja la Terminal abierta.
2. **¿Misma red Wi‑Fi?** — El celular debe estar en la misma red que el Mac (no datos móviles).
3. **¿IP correcta?** — Verifica con `ipconfig getifaddr en0` en el Mac.
4. **Firewall** — Si sigue sin funcionar: Preferencias del Sistema → Red y privacidad → Firewall → Opciones. Asegúrate de que Python pueda aceptar conexiones entrantes.
5. **Puerto ocupado** — Prueba otro puerto: `python3 -m http.server 8888 --bind 0.0.0.0` y usa `http://TU_IP:8888`.