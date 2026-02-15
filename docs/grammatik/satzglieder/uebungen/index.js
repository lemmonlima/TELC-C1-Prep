const exercises = [
  {
    id: 1,
    parts: [
      { text: "Das Büro", answer: "erg-nominativ" },
      " ",
      { text: "befindet sich", answer: "praedikat-einfach" },
      " ",
      { text: "im Erdgeschoss", answer: "erg-situativ" },
      "."
    ]
  },
  {
    id: 2,
    parts: [
      { text: "Wegen heftiger Zahnschmerzen", answer: "ang-kausal" },
      " ",
      { text: "musste", answer: "praedikat-komplex" },
      " ich ",
      { text: "in München", answer: "ang-lokal" },
      " zum Zahnarzt gehen."
    ]
  },
  {
    id: 3,
    parts: [
      { text: "Welche Farbe", answer: "erg-akkusativ" },
      " ",
      { text: "haben", answer: "praedikat-einfach" },
      " ",
      { text: "ihre Augen", answer: "erg-nominativ" },
      "?"
    ]
  },
  {
    id: 4,
    parts: [
      { text: "Er", answer: "erg-nominativ" },
      " ist ",
      { text: "des schweren Diebstahls", answer: "erg-genitiv" },
      " ",
      { text: "angeklagt", answer: "praedikat-adjektiv" },
      "."
    ]
  },
  {
    id: 5,
    parts: [
      { text: "In der Touristeninformation", answer: "ang-lokal" },
      " ",
      { text: "bekommen", answer: "praedikat-einfach" },
      " Sie ",
      { text: "einen Stadtplan", answer: "erg-akkusativ" },
      " ",
      { text: "kostenlos", answer: "ang-modal" },
      "."
    ]
  },
  {
    id: 6,
    parts: [
      { text: "Die meisten Zuhörer", answer: "erg-nominativ" },
      " waren ",
      { text: "von der Qualität des Vortrags", answer: "erg-praepositional" },
      " ",
      { text: "enttäuscht", answer: "praedikat-adjektiv" },
      "."
    ]
  },
  {
    id: 7,
    parts: [
      { text: "Ich", answer: "erg-nominativ" },
      " bin ",
      { text: "mit dem Ergebnis", answer: "erg-praepositional" },
      " ",
      { text: "zufrieden", answer: "praedikat-adjektiv" },
      "."
    ]
  },
  {
    id: 8,
    parts: [
      { text: "Bei starkem Verkehr", answer: "ang-konditional" },
      " ",
      { text: "fahre", answer: "praedikat-einfach" },
      " ich ",
      { text: "nie", answer: "ang-negation" },
      " schnell."
    ]
  },
  {
    id: 9,
    parts: [
      { text: "Sie", answer: "erg-nominativ" },
      " ist mit ihrer Freundin ",
      { text: "zum Einkaufen", answer: "ang-final" },
      " ",
      { text: "in die Stadt", answer: "erg-direktiv" },
      " ",
      { text: "gefahren", answer: "praedikat-komplex" },
      "."
    ]
  },
  {
    id: 10,
    parts: [
      { text: "Trotz der Doppelverglasung", answer: "ang-konzessiv" },
      " ",
      { text: "leiden", answer: "praedikat-einfach" },
      " wir in unserer Wohnung ",
      { text: "unter dem Straßenlärm", answer: "erg-praepositional" },
      "."
    ]
  },
  {
    id: 11,
    parts: [
      { text: "Einem Gefangenen", answer: "erg-dativ" },
      " ist ",
      { text: "in der Nacht", answer: "ang-temporal" },
      " die Flucht ",
      { text: "gelungen", answer: "praedikat-adjektiv" },
      "."
    ]
  },
  {
    id: 12,
    parts: [
      { text: "Aus Sicherheitsgründen", answer: "ang-kausal" },
      " musste die Brücke ",
      { text: "gesperrt werden", answer: "praedikat-komplex" },
      "."
    ]
  },
  {
    id: 13,
    parts: [
      { text: "Der Computer", answer: "erg-nominativ" },
      " lässt sich ",
      { text: "wegen fehlender Ersatzteile", answer: "ang-kausal" },
      " ",
      { text: "nicht mehr", answer: "ang-negation" },
      " ",
      { text: "reparieren", answer: "praedikat-komplex" },
      "."
    ]
  },
  {
    id: 14,
    parts: [
      { text: "Wagners Oper \"Siegfried\"", answer: "erg-nominativ" },
      " ",
      { text: "dauert", answer: "praedikat-einfach" },
      " ",
      { text: "über vier Stunden", answer: "erg-expansiv" },
      "."
    ]
  },
  {
    id: 15,
    parts: [
      { text: "Am schnellsten", answer: "ang-modal" },
      " ",
      { text: "kommen", answer: "praedikat-einfach" },
      " ",
      { text: "Sie", answer: "erg-nominativ" },
      " ",
      { text: "mit der U-Bahn", answer: "ang-instrumental" },
      " ",
      { text: "ins Stadtzentrum", answer: "erg-direktiv" },
      "."
    ]
  },
  {
    id: 16,
    parts: [
      { text: "Nach Ansicht der Opposition", answer: "ang-referenz" },
      " müssen ",
      { text: "die Steuern", answer: "erg-nominativ" },
      " weiter ",
      { text: "gesenkt werden", answer: "praedikat-komplex" },
      "."
    ]
  },
  {
    id: 17,
    parts: [
      { text: "\"Faust\"", answer: "erg-akkusativ" },
      " kann man ",
      { text: "als Goethes bedeutendstes Werk", answer: "erg-nominal" },
      " ",
      { text: "bezeichnen", answer: "praedikat-komplex" },
      "."
    ]
  },
  {
    id: 18,
    parts: [
      { text: "Die neuen Busse", answer: "erg-nominativ" },
      " werden ",
      { text: "in zwei Monaten", answer: "ang-temporal" },
      " ",
      { text: "zum Einsatz kommen", answer: "praedikat-fvg" },
      "."
    ]
  }
];

const optionLabels = {
  "praedikat-einfach": "Einfaches Prädikat",
  "praedikat-komplex": "Komplexe Prädikate",
  "praedikat-adjektiv": "Adjektiv-Prädikat",
  "praedikat-fvg": "Funktionsverbgefüge",
  "erg-nominativ": "Nominativ-Ergänzung (Subjekt)",
  "erg-akkusativ": "Akkusativ-Ergänzung",
  "erg-dativ": "Dativ-Ergänzung",
  "erg-genitiv": "Genitiv-Ergänzung",
  "erg-praepositional": "Präpositional-Ergänzung",
  "erg-situativ": "Situativ-Ergänzung",
  "erg-direktiv": "Direktiv-Ergänzung",
  "erg-expansiv": "Expansiv-Ergänzung",
  "erg-nominal": "Nominal-Ergänzung",
  "ang-temporal": "Temporal-Angabe",
  "ang-kausal": "Kausal-Angabe",
  "ang-final": "Final-Angabe",
  "ang-konditional": "Konditional-Angabe",
  "ang-konzessiv": "Konzessiv-Angabe",
  "ang-lokal": "Lokal-Angabe",
  "ang-modal": "Modal-Angabe",
  "ang-instrumental": "Instrumental-Angabe",
  "ang-referenz": "Referenz-Angabe",
  "ang-negation": "Negations-Angabe"
};

const optionKeys = Object.keys(optionLabels);

const countInput = document.getElementById("satzglieder-count");
const startButton = document.getElementById("satzglieder-start");
const availableLabel = document.getElementById("satzglieder-available");
const list = document.getElementById("satzglieder-list");
const checkButton = document.getElementById("satzglieder-check");
const resetButton = document.getElementById("satzglieder-reset");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function shuffle(listItems) {
  const array = listItems.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function buildOptionList(correctKey) {
  const pool = optionKeys.filter((key) => key !== correctKey);
  const wrong = shuffle(pool).slice(0, 3);
  const options = shuffle([correctKey, ...wrong]);
  return options.map((key) => (
    `<option value="${key}">${optionLabels[key]}</option>`
  )).join("");
}

function renderSlot(target) {
  return `
    <span class="satzglieder-slot" data-answer="${target.answer}">
      <span class="satzglieder-target">${escapeHtml(target.text)}</span>
      <span class="test-blank">
        <select class="test-select satzglieder-select" data-answer="${target.answer}">
          <option value="" selected disabled hidden>—</option>
          ${buildOptionList(target.answer)}
        </select>
      </span>
    </span>
  `;
}

function renderSentence(exercise) {
  return exercise.parts.map((part) => {
    if (typeof part === "string") {
      return escapeHtml(part);
    }
    return renderSlot(part);
  }).join("");
}

function updateAvailable() {
  const available = exercises.length;
  availableLabel.textContent = `Verfügbar: ${available}`;
  if (available === 0) {
    countInput.value = 0;
    countInput.max = 0;
    startButton.disabled = true;
    return;
  }
  countInput.min = 1;
  countInput.max = available;
  const currentValue = Number.parseInt(countInput.value, 10);
  const nextValue = Number.isNaN(currentValue) || currentValue < 1
    ? Math.min(10, available)
    : clamp(currentValue, 1, available);
  countInput.value = nextValue;
  startButton.disabled = false;
}

function renderList(selected) {
  list.innerHTML = "";
  if (!selected.length) {
    list.innerHTML = "<p>Keine passenden Aufgaben gefunden.</p>";
    return;
  }

  selected.forEach((exercise) => {
    const item = document.createElement("div");
    item.className = "test-item";

    const sentence = document.createElement("div");
    sentence.className = "test-sentence";
    sentence.innerHTML = `<strong>${exercise.id}.</strong> ${renderSentence(exercise)}`;

    const feedback = document.createElement("div");
    feedback.className = "test-feedback";

    item.appendChild(sentence);
    item.appendChild(feedback);
    list.appendChild(item);
  });
}

function startTest() {
  const requested = Number.parseInt(countInput.value, 10) || 1;
  const total = clamp(requested, 1, exercises.length);
  const selected = shuffle(exercises).slice(0, total);
  renderList(selected);
  checkButton.disabled = selected.length === 0;
  resetButton.disabled = false;
}

function updateSlot(select) {
  const slot = select.closest(".satzglieder-slot");
  if (!slot) return;
  slot.className = "satzglieder-slot";
  if (select.value) {
    slot.classList.add(`is-${select.value}`);
  }
}

function checkTest() {
  const items = Array.from(list.querySelectorAll(".test-item"));
  items.forEach((item) => {
    const selects = Array.from(item.querySelectorAll(".satzglieder-select"));
    const feedback = item.querySelector(".test-feedback");

    item.classList.remove("is-correct", "is-wrong");

    const allAnswered = selects.every((select) => select.value);
    const allCorrect = selects.every((select) => select.value === select.dataset.answer);

    if (!selects.length) {
      item.classList.add("is-wrong");
      feedback.textContent = "Keine Auswahl vorhanden.";
      return;
    }

    if (allAnswered && allCorrect) {
      item.classList.add("is-correct");
      feedback.textContent = "Richtig";
    } else {
      const answers = selects.map((select) => optionLabels[select.dataset.answer]);
      item.classList.add("is-wrong");
      feedback.textContent = `Antworten: ${answers.join(", ")}`;
    }
  });
}

function resetTest() {
  list.innerHTML = "";
  checkButton.disabled = true;
  resetButton.disabled = true;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!countInput || !startButton || !list || !availableLabel || !checkButton || !resetButton) {
    return;
  }
  updateAvailable();
  startButton.addEventListener("click", startTest);
  checkButton.addEventListener("click", checkTest);
  resetButton.addEventListener("click", resetTest);
  countInput.addEventListener("change", updateAvailable);

  list.addEventListener("change", (event) => {
    const select = event.target.closest(".satzglieder-select");
    if (select) {
      updateSlot(select);
    }
  });
});
