/*
 * Präsentationstexte für Zusammenfassung (ca. 350–400 Wörter, ~3 Min bei 100–130 wpm)
 *
 * Cada tema necesita:
 *   titel: string — título descriptivo
 *   text:  string — texto plano (para copiar al clipboard / TTS)
 *   html:  string — versión HTML con <p>, <strong>, etc. (para mostrar en pantalla)
 *
 * ⚠ CONSISTENCIA: Las claves (a1, a2, b1, b2, c1, c2) DEBEN coincidir con:
 *   - 5-muendlich-praesentation.html (select options)
 *   - 5-muendlich-zusammenfassung.html (data-thema buttons)
 *   - exam-data.js (themaTexte)
 *   - exam.html (tab-vorbereitung)
 */

const praesentationTexte = {
  a1: {
    titel: 'Teilnehmer A - Resumen del tema A1',
    text: `TODO: Texto plano de la presentación A1 (~350-400 palabras).

Estructura: Einleitung → Hauptteil (argumentos, ejemplos) → Schluss/Fazit.
Simular que un compañero presentó este tema oralmente.`,
    html: `<div class="praesentation-titel">Teilnehmer A - Resumen del tema A1</div>
<p>TODO: Versión HTML del mismo texto con &lt;p&gt; y &lt;strong&gt; para destacar.</p>`
  },

  a2: {
    titel: 'Teilnehmer A - Resumen del tema A2',
    text: `TODO: Texto plano A2.`,
    html: `<div class="praesentation-titel">Teilnehmer A - Resumen del tema A2</div>
<p>TODO: HTML A2.</p>`
  },

  b1: {
    titel: 'Teilnehmer B - Resumen del tema B1',
    text: `TODO: Texto plano B1.`,
    html: `<div class="praesentation-titel">Teilnehmer B - Resumen del tema B1</div>
<p>TODO: HTML B1.</p>`
  },

  b2: {
    titel: 'Teilnehmer B - Resumen del tema B2',
    text: `TODO: Texto plano B2.`,
    html: `<div class="praesentation-titel">Teilnehmer B - Resumen del tema B2</div>
<p>TODO: HTML B2.</p>`
  },

  c1: {
    titel: 'Teilnehmer C - Resumen del tema C1',
    text: `TODO: Texto plano C1.`,
    html: `<div class="praesentation-titel">Teilnehmer C - Resumen del tema C1</div>
<p>TODO: HTML C1.</p>`
  },

  c2: {
    titel: 'Teilnehmer C - Resumen del tema C2',
    text: `TODO: Texto plano C2.`,
    html: `<div class="praesentation-titel">Teilnehmer C - Resumen del tema C2</div>
<p>TODO: HTML C2.</p>`
  }
};
