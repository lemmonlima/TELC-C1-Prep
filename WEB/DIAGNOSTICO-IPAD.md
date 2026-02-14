# Si el iPad no conecta al Mac – diagnóstico

## Paso 1: Comprobar en el Mac (con el servidor corriendo)

En Terminal, inicia el servidor:

```bash
cd /Users/andresbonilla/Documents/Novo/TELC/WEB
python3 -m http.server 8080 --bind 0.0.0.0
```

**1a.** En el **Mac**, abre **Safari** y entra a:

- `http://127.0.0.1:8080`

¿Se abre la página?  
- **Sí** → El servidor está bien. Sigue al 1b.  
- **No** → El servidor no está bien; revisa que el comando sea exactamente ese y que no haya otro programa usando el puerto 8080.

**1b.** Sin cerrar el servidor, en el **Mac** en Safari entra a:

- `http://192.168.178.60:8080`

¿Se abre la página?  
- **Sí** → El Mac está sirviendo en la red. El problema está entre el Mac y el iPad (firewall o router).  
- **No** → Algo en el Mac está impidiendo usar esa IP; prueba desactivar el firewall por un momento para probar.

---

## Paso 2: Probar por nombre en el iPad

En el Mac, en Terminal (otra ventana, sin parar el servidor):

```bash
hostname
```

Te saldrá algo como "MacBook-de-Andres". En el **iPad**, en Safari, prueba:

```
http://MacBook-de-Andres.local:8080
```

(Usa el nombre que te dio `hostname`, en minúsculas, y añade `.local`.)

Si esto **sí** abre y la IP **no**, suele ser firewall o cómo el router asigna la IP.

---

## Paso 3: Firewall desactivado (solo para probar)

1. **Systemeinstellungen** → **Netzwerk** / **Datenschutz & Sicherheit** → **Firewall**
2. **Firewall** → **Aus** (desactivado)
3. En el iPad prueba otra vez: `http://192.168.178.60:8080`
4. Si ya funciona, vuelve a activar el Firewall y añade **Terminal** con el **+** como antes.

---

## Paso 4: Aislamiento de clientes en el router

Algunos routers tienen **“Client Isolation”** / **“AP Isolation”** / **“Geräteisolation”** que impide que los dispositivos WiFi se hablen entre sí.

- Entra a la configuración del router (en el navegador, suele ser `192.168.178.1` o `192.168.1.1`).
- Busca algo como: **WLAN** → **Einstellungen** / **Erweitert** y opciones tipo **“Client Isolation”**, **“AP-Isolation”**, **“Geräte voneinander isolieren”**.
- Si está **aktiviert** (activado), **desactívalo** y guarda.
- Vuelve a probar desde el iPad.

---

## Paso 5: Otro puerto

Por si el router o el Mac bloquean el 8080, prueba con el 5000:

En el **Mac** (para el servidor):

```bash
cd /Users/andresbonilla/Documents/Novo/TELC/WEB
python3 -m http.server 5000 --bind 0.0.0.0
```

En el **iPad**:

```
http://192.168.178.60:5000
```

---

Resumen: lo más útil es hacer **Paso 1** (sobre todo 1a y 1b) y decirme qué pasa en cada caso; con eso se sabe si el fallo es del servidor, del firewall o del router.
