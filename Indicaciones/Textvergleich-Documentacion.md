# Nominale Angaben Übung 21 – Documentación Técnica

**Ubicación:** `TELC/WEB/grammatik/angaben/uebungen/4-1-nominal/`

## Descripción General

El ejercicio 21 de "Nominale Angaben" es un sistema interactivo de texto largo que permite a los usuarios practicar la transformación de un texto completo con angaben nominales en un texto con Nebensätze (oraciones subordinadas). A diferencia de otros ejercicios que trabajan con items individuales, este ejercicio presenta un texto completo que el usuario debe reescribir completamente. El sistema compara la respuesta del usuario con la solución correcta palabra por palabra, resaltando solo las palabras que son diferentes o están en posición incorrecta.

---

## Estructura de Archivos

```
4-1-nominal/
├── index.html      # Estructura HTML del ejercicio
├── exercise.js     # Lógica completa del sistema
└── content.md      # Archivo Markdown con el texto original y la solución
```

---

## Formato de Datos de Entrada

### Formato Markdown

El archivo `content.md` contiene el ejercicio con el siguiente formato:

```markdown
# Angaben in nominaler Form – Übung 21

Quelle: `TELC/GrammatikBuch.md` – Kapitel 4.1

## 21. Können Sie die nominalen Angaben dieses Textes in Nebensätze umwandeln?

Versuchen Sie es!

Vor Antritt einer Ferienreise ins Ausland muss man viele Dinge bedenken. Zur allgemeinen Information genügt es, sich von der Touristik-Zentrale des betreffenden Landes Reiseprospekte kommen zu lassen. Größere Reisen sollte man aber nicht ohne sorgfältige Vorbereitung antreten...

**Lösung:**

Bevor man eine Ferienreise ins Ausland antritt, muss man viele Dinge bedenken. Damit man sich allgemein informieren kann, genügt es, sich von der Touristik-Zentrale des betreffenden Landes Reiseprospekte kommen zu lassen...
```

### Reglas de Parsing

1. **Encabezado de ejercicio:** Línea que empieza con `## 21.`
   - Formato: `## 21. Können Sie die nominalen Angaben dieses Textes in Nebensätze umwandeln?`

2. **Texto original:** Todo el texto después del encabezado hasta la línea `**Lösung:**`
   - Se ignoran líneas que empiezan con `#` (encabezados)
   - Se ignoran líneas que empiezan con `Quelle:`
   - Se ignoran líneas que contienen "Versuchen Sie es!"

3. **Solución:** Todo el texto después de `**Lösung:**`
   - Se ignoran líneas que empiezan con `#` (encabezados)
   - Se preservan todos los saltos de línea

**Nota:** Este ejercicio no usa tokens semánticos. El texto se presenta tal cual, sin marcas especiales.

---

## Arquitectura del Sistema

### Variables Globales

```javascript
let originalText = "";      // Texto original extraído del Markdown
let correctAnswer = "";     // Solución correcta extraída del Markdown
```

### Elementos del DOM

**Área de visualización:**
- `original-text` - Contenedor donde se muestra el texto original
- `user-answer` - Textarea grande para que el usuario escriba su respuesta
- `exercise-result` - Contenedor del resultado (oculto inicialmente)
- `correct-answer` - Contenedor donde se muestra la solución con palabras resaltadas

**Controles:**
- `check-answer` - Botón "Prüfen" para verificar la respuesta
- `reset-answer` - Botón "Zurücksetzen" para limpiar la respuesta

---

## Funciones Principales

### 1. Carga del Ejercicio (`loadExercise()`)

**Propósito:** Carga el archivo Markdown y extrae el texto original y la solución.

**Proceso:**

1. Hace fetch del archivo `content.md` con `{ cache: "no-store" }`
2. Divide el texto en líneas
3. Itera línea por línea identificando:
   - Encabezado del ejercicio (`## 21.`)
   - Línea "Versuchen Sie es!" (se ignora)
   - Línea "**Lösung:**" (marca el inicio de la solución)
   - Líneas del texto original (antes de "**Lösung:**")
   - Líneas de la solución (después de "**Lösung:**")
4. Filtra líneas que empiezan con `#` (encabezados) o `Quelle:`
5. Une las líneas del texto original y de la solución preservando saltos de línea
6. Muestra el texto original en el contenedor correspondiente

**Código relevante:**
```javascript
for (const line of lines) {
  if (line.trim() === "**Lösung:**") {
    inOriginal = false;
    inSolution = true;
    continue;
  }
  
  if (line.match(/^##\s+21\./)) continue;
  if (line.match(/^Versuchen Sie es!/)) continue;
  
  if (inSolution) {
    if (line.trim() && !line.match(/^#/)) {
      solutionLines.push(line);
    }
  } else if (!inOriginal && line.trim() && !line.match(/^#/) && !line.match(/^Quelle:/)) {
    inOriginal = true;
    originalLines.push(line);
  } else if (inOriginal && line.trim() && !line.match(/^#/)) {
    originalLines.push(line);
  }
}

originalText = originalLines.join("\n").trim();
correctAnswer = solutionLines.join("\n").trim();
```

### 2. Tokenización (`tokenize(text)`)

**Propósito:** Divide un texto en tokens (palabras, puntuación, espacios) preservando el orden y formato original.

**Proceso:**

1. Usa regex: `/[\wäöüßÄÖÜ]+|[.,;:!?()\[\]{}"']+|\s+/g`
   - `[\wäöüßÄÖÜ]+` - Captura palabras incluyendo caracteres alemanes (ä, ö, ü, ß, Ä, Ö, Ü)
   - `[.,;:!?()\[\]{}"']+` - Captura signos de puntuación
   - `\s+` - Captura espacios en blanco
2. Para cada match:
   - Extrae el texto original
   - Normaliza solo eliminando puntuación (preserva umlauts y ß)
   - Verifica si es una palabra usando: `/[\wäöüß]/.test(normalized)`
   - Crea objeto token con:
     - `text`: texto original
     - `normalized`: versión normalizada (lowercase, sin puntuación)
     - `isWord`: booleano indicando si es palabra

**Características especiales:**
- Preserva caracteres alemanes (ä, ö, ü, ß, Ä, Ö, Ü) durante la normalización
- Mantiene el orden original de los tokens
- Distingue entre palabras y puntuación/espacios

### 3. Algoritmo de Comparación Avanzada (`highlightDifferencesAdvanced(correct, user)`)

**Propósito:** Compara dos textos palabra por palabra y genera HTML resaltando solo las palabras diferentes o faltantes.

**Proceso:**

1. **Tokenización:**
   - Tokeniza ambos textos (correcto y usuario)
   - Extrae solo las palabras normalizadas en orden

2. **Comparación secuencial con ventana de búsqueda:**
   - Itera sobre las palabras del texto correcto
   - Para cada palabra correcta:
     - Primero verifica si coincide en la posición actual del texto del usuario
     - Si no coincide, busca en una ventana pequeña (3 posiciones siguientes)
     - Esto permite manejar palabras extras sin desalinear todo el texto
   - Marca las palabras encontradas en un Set (`wordMatches`)

3. **Generación de HTML:**
   - Itera sobre los tokens originales del texto correcto
   - Para cada token:
     - Si es palabra y está en `wordMatches`: muestra sin resaltar
     - Si es palabra y NO está en `wordMatches`: envuelve en `<span class="text-diff-missing">`
     - Si es puntuación o espacio: muestra tal cual

**Características del algoritmo:**

- **Ventana de búsqueda:** Permite que el algoritmo "salte" palabras extras del usuario sin desalinear todo el texto
- **Preservación de formato:** Mantiene puntuación, espacios y formato original
- **Resaltado selectivo:** Solo marca palabras que son diferentes o faltantes, no todo el texto
- **Manejo de caracteres alemanes:** Preserva correctamente ä, ö, ü, ß durante todo el proceso

**Ejemplo de salida:**
```html
Bevor man eine Ferienreise ins Ausland <span class="text-diff-missing">antritt</span>, muss man viele Dinge bedenken.
```

### 4. Verificación (`checkAnswer()`)

**Proceso:**

1. Obtiene el texto del usuario del textarea
2. Valida que no esté vacío (muestra alerta si está vacío)
3. Muestra el contenedor de resultado (`exercise-result.style.display = "block"`)
4. Llama a `highlightDifferencesAdvanced()` con el texto correcto y el del usuario
5. Inserta el HTML generado en el contenedor de solución
6. Hace scroll suave al resultado para que el usuario lo vea

**Nota:** Este ejercicio no marca como "correcto" o "incorrecto" de forma binaria. Siempre muestra la solución con palabras diferentes resaltadas, permitiendo al usuario comparar y aprender.

### 5. Reset (`resetAnswer()`)

**Proceso:**

1. Limpia el textarea del usuario
2. Oculta el contenedor de resultado
3. Limpia el contenido HTML del contenedor de solución

---

## Funciones Auxiliares

### `escapeHtml(value)`
Escapa caracteres HTML especiales para prevenir XSS:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`

### `normalizeText(text)`
Normaliza texto para comparación básica:
1. Trim (elimina espacios al inicio y final)
2. Normaliza espacios múltiples a uno solo
3. Convierte a minúsculas

**Nota:** Esta función se usa para validaciones básicas, pero la comparación real se hace con la normalización dentro de `tokenize()` que preserva mejor los caracteres especiales.

---

## Clases CSS Utilizadas

### Estructura Principal
- `.text-exercise-container` - Contenedor principal del ejercicio
- `.text-exercise-original` - Área del texto original
- `.text-exercise-input-area` - Área del textarea de entrada
- `.text-exercise-actions` - Contenedor de botones
- `.text-exercise-result` - Contenedor del resultado (oculto inicialmente)

### Elementos de Texto
- `.text-exercise-text` - Estilo para texto mostrado (original y solución)
- `.text-exercise-textarea` - Textarea grande para la respuesta del usuario
- `.text-exercise-solution` - Estilo específico para la solución

### Resaltado
- `.text-diff-missing` - Aplicada a palabras que son diferentes o faltantes en la respuesta del usuario
  - Color rojo o destacado según el diseño
  - Permite identificar rápidamente qué palabras necesitan corrección

---

## Flujo de Usuario

1. **Carga inicial:**
   - Sistema carga `content.md`
   - Extrae el texto original y la solución
   - Muestra el texto original en la sección correspondiente
   - El textarea está vacío y listo para escribir

2. **Escritura:**
   - Usuario lee el texto original con angaben nominales
   - Usuario escribe su versión transformada en el textarea grande
   - Puede escribir todo el texto completo

3. **Verificación:**
   - Usuario hace clic en "Prüfen"
   - Sistema valida que haya texto escrito
   - Sistema compara palabra por palabra
   - Muestra la solución correcta con palabras diferentes resaltadas en color
   - Hace scroll automático al resultado

4. **Revisión:**
   - Usuario compara su respuesta con la solución
   - Las palabras resaltadas indican diferencias o palabras faltantes
   - Usuario puede identificar qué partes necesita corregir

5. **Reset:**
   - Usuario puede hacer clic en "Zurücksetzen" en cualquier momento
   - Sistema limpia el textarea y oculta el resultado
   - Permite intentar de nuevo

---

## Características Especiales

### 1. Comparación Palabra por Palabra

A diferencia de otros sistemas que comparan textos completos, este sistema:
- Tokeniza ambos textos preservando formato
- Compara secuencialmente palabra por palabra
- Usa una ventana de búsqueda pequeña para manejar palabras extras
- Solo resalta palabras que son diferentes o faltantes

### 2. Preservación de Caracteres Alemanes

El sistema maneja correctamente caracteres especiales alemanes:
- Incluye ä, ö, ü, ß, Ä, Ö, Ü en el regex de tokenización
- Preserva estos caracteres durante la normalización
- Los compara correctamente sin perderlos

### 3. Algoritmo de Ventana de Búsqueda

El algoritmo permite pequeñas diferencias en el orden:
- Busca cada palabra correcta en la posición actual
- Si no la encuentra, busca en las siguientes 3 posiciones
- Esto permite manejar palabras extras sin desalinear todo el texto
- Mantiene la alineación general del texto

### 4. Resaltado Selectivo

Solo se resaltan palabras que son diferentes:
- Las palabras correctas se muestran normalmente
- Solo las palabras diferentes o faltantes se resaltan
- Esto permite identificar rápidamente qué necesita corrección
- Facilita el aprendizaje al mostrar exactamente qué está mal

### 5. Texto Largo Completo

A diferencia de otros ejercicios con items individuales:
- Este ejercicio trabaja con un texto completo
- El usuario debe reescribir todo el texto
- Permite practicar la transformación de manera más natural
- Simula mejor una situación real de escritura

---

## Validaciones y Restricciones

1. **Texto vacío:** El sistema valida que el usuario haya escrito algo antes de verificar. Muestra una alerta si el textarea está vacío.

2. **Preservación de formato:** El sistema preserva saltos de línea, puntuación y espacios del texto original en la solución mostrada.

3. **Escape HTML:** Todo el contenido se escapa para prevenir XSS.

4. **Manejo de errores:** Si falla la carga del archivo, se muestra un mensaje de error en lugar de crashear.

---

## Dependencias

- **Ninguna librería externa:** El sistema es vanilla JavaScript
- **Fetch API:** Para cargar el archivo Markdown
- **CSS:** Requiere estilos definidos en `styles.css` para las clases mencionadas, especialmente `.text-diff-missing` para el resaltado

---

## Notas de Implementación

1. **Cache deshabilitado:** El archivo se carga con `{ cache: "no-store" }` para asegurar datos actualizados.

2. **Tokenización robusta:** El regex de tokenización incluye explícitamente caracteres alemanes para evitar problemas de codificación.

3. **Ventana de búsqueda:** La ventana de 3 posiciones es un balance entre flexibilidad y precisión. Permite manejar pequeñas diferencias sin desalinear demasiado.

4. **Scroll automático:** El sistema hace scroll al resultado después de verificar para mejorar la experiencia del usuario.

5. **Sin feedback binario:** A diferencia de otros ejercicios, este no marca como "correcto" o "incorrecto". Siempre muestra la solución con resaltado, permitiendo aprendizaje continuo.

6. **Preservación de saltos de línea:** El sistema preserva los saltos de línea del texto original y la solución usando `join("\n")`.

---

## Diferencias con Otros Sistemas

| Característica | Nominale Angaben 21 | Kausal-Angaben | Temporal-Angaben 26 |
|----------------|---------------------|----------------|---------------------|
| **Tipo de ejercicio** | Texto largo completo | Items individuales | Items individuales |
| **Formato de entrada** | Textarea grande | Campos de texto | Dropdowns |
| **Comparación** | Palabra por palabra con resaltado | Texto completo normalizado | Selección de opciones |
| **Feedback** | Resaltado de diferencias | Correcto/Incorrecto | Correcto/Incorrecto |
| **Tokens semánticos** | No usa | `{ang-kausal:...}` | `{ang-temporal:...}` |
| **Cantidad de items** | 1 (texto completo) | Múltiples items | Múltiples items |

---

## Extensibilidad

Para modificar el ejercicio 21:

1. **Cambiar tamaño de ventana de búsqueda:** Modificar el valor `3` en la línea `const searchWindow = Math.min(3, userWords.length - userIndex);` para hacer el algoritmo más o menos flexible.

2. **Modificar formato de resaltado:** Cambiar la clase CSS `.text-diff-missing` o agregar más clases según necesidades.

3. **Agregar validaciones adicionales:** Agregar validaciones en `checkAnswer()` antes de mostrar el resultado.

4. **Mejorar algoritmo de comparación:** El algoritmo actual es básico pero efectivo. Se puede mejorar con técnicas más avanzadas de alineación de texto si es necesario.

5. **Agregar estadísticas:** Se podría agregar contador de palabras correctas/incorrectas para dar feedback más detallado.

---

## Ejemplo de Uso del Sistema

**Datos de entrada (content.md):**
```markdown
## 21. Können Sie die nominalen Angaben dieses Textes in Nebensätze umwandeln?

Vor Antritt einer Ferienreise ins Ausland muss man viele Dinge bedenken.

**Lösung:**

Bevor man eine Ferienreise ins Ausland antritt, muss man viele Dinge bedenken.
```

**Flujo:**
1. Sistema carga y muestra el texto original
2. Usuario escribe en el textarea: "Bevor man eine Ferienreise ins Ausland antritt, muss man viele Dinge bedenken."
3. Usuario hace clic en "Prüfen"
4. Sistema compara y muestra la solución
5. Si hay diferencias, las palabras diferentes aparecen resaltadas en rojo
6. Usuario puede hacer clic en "Zurücksetzen" para limpiar y volver a intentar

