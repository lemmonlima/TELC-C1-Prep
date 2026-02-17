// Präsentationstexte für Zusammenfassung (ca. 350-400 Wörter, 3 Minuten bei 100-130 wpm)
// TODO: Texte für alle 6 Themen einfügen

const praesentationTexte = {
  a1: {
    titel: 'Teilnehmer A - TODO: Thema 1 Titel',
    text: `TODO: Präsentationstext für Thema A1 (ca. 350-400 Wörter)`,
    html: `<div class="praesentation-titel">Teilnehmer A - TODO: Thema 1 Titel</div>
<p>TODO: Präsentationstext für Thema A1</p>`
  },

  a2: {
    titel: 'Teilnehmer A - TODO: Thema 2 Titel',
    text: `TODO: Präsentationstext für Thema A2 (ca. 350-400 Wörter)`,
    html: `<div class="praesentation-titel">Teilnehmer A - TODO: Thema 2 Titel</div>
<p>TODO: Präsentationstext für Thema A2</p>`
  },

  b1: {
    titel: 'Teilnehmer B - TODO: Thema 1 Titel',
    text: `TODO: Präsentationstext für Thema B1 (ca. 350-400 Wörter)`,
    html: `<div class="praesentation-titel">Teilnehmer B - TODO: Thema 1 Titel</div>
<p>TODO: Präsentationstext für Thema B1</p>`
  },

  b2: {
    titel: 'Teilnehmer B - TODO: Thema 2 Titel',
    text: `TODO: Präsentationstext für Thema B2 (ca. 350-400 Wörter)`,
    html: `<div class="praesentation-titel">Teilnehmer B - TODO: Thema 2 Titel</div>
<p>TODO: Präsentationstext für Thema B2</p>`
  },

  c1: {
    titel: 'Teilnehmer C - TODO: Thema 1 Titel',
    text: `TODO: Präsentationstext für Thema C1 (ca. 350-400 Wörter)`,
    html: `<div class="praesentation-titel">Teilnehmer C - TODO: Thema 1 Titel</div>
<p>TODO: Präsentationstext für Thema C1</p>`
  },

  c2: {
    titel: 'Teilnehmer C - TODO: Thema 2 Titel',
    text: `TODO: Präsentationstext für Thema C2 (ca. 350-400 Wörter)`,
    html: `<div class="praesentation-titel">Teilnehmer C - TODO: Thema 2 Titel</div>
<p>TODO: Präsentationstext für Thema C2</p>`
  }
};

// Function to get random presentation excluding the user's own
function getRandomPartnerPraesentation(meinThema) {
  const verfuegbareThemen = Object.keys(praesentationTexte).filter(key => key !== meinThema);
  const randomThema = verfuegbareThemen[Math.floor(Math.random() * verfuegbareThemen.length)];
  return praesentationTexte[randomThema];
}
