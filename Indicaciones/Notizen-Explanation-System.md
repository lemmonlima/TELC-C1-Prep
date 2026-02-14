# Sistema de Explicaciones – Notizen

**Ubicación:** `TELC/WEB/notizen/`

---

## Objetivo

Al hacer clic en una **cajita** (ítem de la lista) de Notizen, se abre **debajo de esa cajita** un bloque con:
- **Traducción al español**
- **Explicación** (opcional)
- **Al menos cuatro ejemplos de uso** con sus traducciones (con la palabra/frase marcada cuando aplica)

**Comportamiento actual:**
- La cajita entera es clicable; **no se repite la palabra/frase** en el bloque ni hay botón "Volver al texto".
- **Clic de nuevo** en la misma cajita **cierra** el bloque.
- **Varias cajitas** pueden tener el bloque abierto a la vez.
- El JSON de explicaciones tiene la misma estructura que en Texte. Ver `Texte-Explanation-System.md` para detalles del JSON.

---

## Cambios realizados (resumen)

Estos son los cambios que se han aplicado al sistema de Notizen respecto a la versión inicial y a Texte:

1. **Panel simplificado**  
   El bloque muestra solo traducción, explicación y ejemplos.

2. **Tipo "phrase": solo explicación y ejemplos**  
   Para entradas con `type: "phrase"` en Notizen solo se muestran Explicación y Ejemplos. No se muestra la sección "Componentes", ni conjugación, sinónimos/antónimos en el panel. La frase entera es **una sola unidad** (no se desglosa en componentes ni se colorean partes). En el JSON de Notizen las phrases no usan el campo `components` para la visualización.

3. **Sin marcado dentro del texto**  
   Se eliminó el uso de tokens `{expl:id:palabra}` dentro del texto. En su lugar, **toda la cajita** (el ítem de la lista) es clicable. Cada ítem tiene `text` (texto plano) y opcional `explanationId`; si tiene `explanationId`, la cajita entera es clicable.

4. **Una cajita puede agrupar varias frases**  
   Varias frases que forman una sola unidad (p. ej. "sich diese Ergebnisse verallgemeinern lassen, ist zwar fraglich. Tatsache ist aber") pueden ser **un solo ítem** en la lista con un único `explanationId` que apunta a una entrada combinada en el JSON (traducción y explicación de la secuencia completa).

5. **Info debajo del ítem, no panel global**  
   La información ya no se abre en un panel único al final de la página. Se abre un **bloque debajo de la cajita** clickeada (inline). No hay botón "Volver al texto" ni botón de cerrar; **clic de nuevo en la cajita cierra** el bloque. Se pueden tener **varias cajitas con el bloque abierto** a la vez.

6. **La palabra se marca en la cajita y en los ejemplos**  
   No se repite como título: se marca dentro del texto del ítem y dentro de cada ejemplo, usando el color correspondiente al `type`.

---

## Tipo "phrase" en Notizen

Para entradas con **`type: "phrase"`** en Notizen:

- **Solo se muestran:** Explicación y Ejemplos (nada más: sin Componentes, sin conjugación, sin sinónimos/antónimos en el bloque).
- **La frase entera es una sola unidad:** Un ítem con su `explanationId`; no se desglosa en componentes ni se usan `components` para la visualización.
- **Marcado opcional por partes:** Si quieres resaltar coincidencias dentro de la frase y los ejemplos, añade `parts` (array de strings). Si no hay `parts`, no se marca automáticamente en phrases.

---

## Cómo añadir una palabra o frase con explicación

### 1. Añadir un ítem en la lista (`notizen.json`)

Cada ítem es una **cajita**. Si quieres que sea clicable y abra un bloque debajo:

- **`text`**: el texto que se muestra (palabra o frase). Sin marcados internos (no uses `{expl:...}`).
- **`explanationId`**: identificador en kebab-case que coincide con una clave en `notizen-explanations.json`. Si está presente, **toda la cajita** es clicable.

**Ejemplos:**

```json
{ "id": "1", "text": "durchaus", "explanationId": "durchaus" }
{ "id": "1", "text": "Inwiefern sich diese Ergebnisse verallgemeinern lassen, ist zwar fraglich. Tatsache ist aber, dass", "explanationId": "inwiefern-verallgemeinern-fraglich-tatsache" }
```

Un ítem sin `explanationId` solo muestra el texto y no es clicable.

### 2. Crear la entrada en el JSON de explicaciones (`notizen-explanations.json`)

Añade un objeto cuya clave es el mismo `id` que usas en `explanationId`:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `word` | Sí | Palabra o frase en alemán (como en el texto). |
| `translation` | Sí | Traducción al español. |
| `examples` | Sí (mín. 4) | Array de strings. Cada uno: oración en alemán = traducción. Deben ser **usos distintos** entre sí. |
| `explanation` | No | Explicación breve del uso o significado. |
| `type` | No | Tipo de palabra: `verb`, `nomen`, `adjektiv`, `adverb`, `partikel`, `phrase`, etc. En Notizen, las `phrase` solo muestran explicación y ejemplos; la frase entera es una sola cajita. |
| `parts` | No | Array con partes que quieras resaltar (útil para verbos compuestos y frases con segmentos repetidos). |
| `conjugation`, `synonyms`, `antonyms`, etc. | No | Igual que en Texte. |

**Ejemplo mínimo (con 4 ejemplos):**

```json
"durchaus": {
  "word": "durchaus",
  "translation": "por supuesto, sin duda, totalmente",
  "examples": [
    "Ich bin durchaus bereit. = Estoy totalmente dispuesto.",
    "Das ist durchaus möglich. = Eso es sin duda posible.",
    "Er hat durchaus Recht. = Tiene toda la razón.",
    "Das habe ich durchaus nicht gesagt. = Eso no lo he dicho en absoluto."
  ],
  "type": "adverb"
}
```

### 3. Reglas importantes

- **Ejemplos**: Siempre **al menos 4**, y **diferentes** entre sí (otros contextos, significados o usos).
- **Phrases**: Si `type` es `"phrase"`, en Notizen solo se muestran explicación y ejemplos; la frase entera es **una sola cajita** (un ítem con su `explanationId`). Para marcado de coincidencias, usa `parts`.
- **Una cajita por explicación**: Cada ítem de la lista es una cajita; si tiene `explanationId`, la cajita entera es clicable (no se marcan partes dentro del texto).
- **Varias frases en una cajita**: Si varias frases forman una sola unidad, un solo ítem con un solo `explanationId` y una entrada combinada en el JSON.

---

## Archivos implicados

| Archivo | Uso |
|---------|-----|
| `notizen.json` | Lista de ítems; cada ítem tiene `text` y opcional `explanationId`; si tiene `explanationId`, la cajita entera es clicable y al clic se abre el bloque debajo. |
| `notizen-explanations.json` | Diccionario de explicaciones por `id`. |
| `notizen.js` | Carga ambos JSON, renderiza cada ítem con su bloque `.notizen-explanation` (oculto por defecto); al clic en la cajita hace toggle del bloque debajo del ítem. |
| `index.html` | Contiene solo el contenedor de la lista `#doc-content`; no hay panel global de explicación. |
| `../styles.css` | Estilos de la lista (`.notizen-list`, `.notizen-item`, `.notizen-item-clickable`) y del bloque inline (`.notizen-explanation`, `.notizen-explanation.is-open`). |

---

## Referencia rápida

1. ¿Nueva palabra/frase? → Añadir ítem con `text` y `explanationId` en `notizen.json` y entrada en `notizen-explanations.json`.
2. ¿Varias frases en una sola unidad? → Un ítem con el texto completo y un `explanationId` que apunta a una entrada combinada en el JSON.
3. ¿Comas en la lista que envías? → Una cajita por palabra.
4. ¿Puntos suspensivos (fange... an)? → Una sola cajita; es una unidad (ej. verbo separable).
5. Ejemplos → Mínimo 4 y distintos entre sí.
6. Clic en la cajita → Abre el bloque debajo; clic de nuevo → Cierra; varias pueden estar abiertas.

Para el formato completo del JSON (conjugación, tipo de verbo, etc.), ver **Texte-Explanation-System.md**.
