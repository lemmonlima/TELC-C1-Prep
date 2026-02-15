const state = {
  decks: {
    verben: [],
    nomen: [],
    adjektive: []
  },
  pools: {
    prep: {
      verben: [],
      nomen: [],
      adjektive: []
    },
    target: {
      verben: [],
      nomen: [],
      adjektive: []
    },
    kasus: {
      verben: [],
      nomen: [],
      adjektive: []
    }
  },
  currentTopic: "verben"
};

const topicSelect = document.getElementById("test-topic");
const countInput = document.getElementById("test-count");
const startButton = document.getElementById("test-start");
const availableLabel = document.getElementById("test-available");
const testList = document.getElementById("test-list");
const checkButton = document.getElementById("test-check");
const resetButton = document.getElementById("test-reset");

const hidePrep = document.getElementById("hide-prep");
const hideTarget = document.getElementById("hide-target");
const hideCase = document.getElementById("hide-case");
const hideArticles = document.getElementById("hide-articles");
const hidePronouns = document.getElementById("hide-pronouns");

const topicLabels = {
  verben: "Verben",
  nomen: "Nomen",
  adjektive: "Adjektive"
};

const targetTags = {
  verben: "v",
  nomen: "n",
  adjektive: "adj"
};

const articleGroups = [
  ["definite", ["der", "die", "das", "den", "dem", "des"]],
  ["ein", ["ein", "eine", "einen", "einem", "eines", "einer"]],
  ["kein", ["kein", "keine", "keinen", "keinem", "keines", "keiner"]],
  ["mein", ["mein", "meine", "meinen", "meinem", "meines", "meiner"]],
  ["dein", ["dein", "deine", "deinen", "deinem", "deines", "deiner"]],
  ["sein", ["sein", "seine", "seinen", "seinem", "seines", "seiner"]],
  ["ihr", ["ihr", "ihre", "ihren", "ihrem", "ihres", "ihrer"]],
  ["unser", ["unser", "unsere", "unseren", "unserem", "unseres", "unserer"]],
  ["euer", ["euer", "eure", "euren", "eurem", "eures", "eurer"]]
];

const pronounGroups = [
  ["ich", ["ich", "mich", "mir"]],
  ["du", ["du", "dich", "dir"]],
  ["er", ["er", "ihn", "ihm"]],
  ["sie", ["sie", "ihr", "ihnen"]],
  ["es", ["es"]],
  ["wir", ["wir", "uns"]],
  ["ihr", ["ihr", "euch"]],
  ["sich", ["sich"]]
];

const articleList = [
  "der", "die", "das", "den", "dem", "des",
  "ein", "eine", "einen", "einem", "eines", "einer",
  "kein", "keine", "keinen", "keinem", "keines", "keiner",
  "mein", "meine", "meinen", "meinem", "meines", "meiner",
  "dein", "deine", "deinen", "deinem", "deines", "deiner",
  "sein", "seine", "seinen", "seinem", "seines", "seiner",
  "ihr", "ihre", "ihren", "ihrem", "ihres", "ihrer",
  "unser", "unsere", "unseren", "unserem", "unseres", "unserer",
  "euer", "eure", "euren", "eurem", "eures", "eurer"
];

const pronounList = [
  "ich", "du", "er", "sie", "es", "wir", "ihr", "sie",
  "mich", "dich", "ihn", "sie", "es", "uns", "euch", "sie",
  "mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen",
  "sich"
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function shuffle(list) {
  const array = list.slice();
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
    .replace(/"/g, "&quot;");
}

function normalizeOption(value) {
  return value.trim().toLowerCase();
}

function getLeftSide(line) {
  let depth = 0;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth = Math.max(depth - 1, 0);
    } else if (char === ":" && depth === 0) {
      return line.slice(0, i);
    }
  }
  return line;
}

function getGroup(word, groups) {
  for (const group of groups) {
    if (group[1].includes(word)) {
      return group[1];
    }
  }
  return null;
}

function buildOptions(correct, pool, fallback = []) {
  const options = new Set([normalizeOption(correct)]);
  shuffle(pool).forEach((item) => {
    const normalized = normalizeOption(item);
    if (options.size < 4) {
      options.add(normalized);
    }
  });
  if (options.size < 4) {
    shuffle(fallback).forEach((item) => {
      const normalized = normalizeOption(item);
      if (options.size < 4) {
        options.add(normalized);
      }
    });
  }
  return shuffle(Array.from(options));
}

function renderSelect(correct, pool, fallback) {
  const normalizedCorrect = normalizeOption(correct);
  const options = buildOptions(normalizedCorrect, pool, fallback);
  const optionHtml = options
    .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
    .join("");
  return `
    <span class="test-blank">
      <select class="test-select" data-answer="${escapeHtml(normalizedCorrect)}">
        <option value="" selected disabled hidden>—</option>
        ${optionHtml}
      </select>
    </span>
  `;
}

function renderMark(type, raw) {
  const safe = escapeHtml(raw);
  if (type === "v") return `<span class="mark mark-verb">${safe}</span>`;
  if (type === "adj") return `<span class="mark mark-adj">${safe}</span>`;
  if (type === "n") return `<span class="mark mark-n">${safe}</span>`;
  if (type === "p") return `<span class="mark mark-prep">${safe}</span>`;
  if (type === "a") return `<span class="mark mark-a">${safe}</span>`;
  if (type === "d") return `<span class="mark mark-d">${safe}</span>`;
  if (type === "g") return `<span class="mark mark-g">${safe}</span>`;
  return `<span class="mark">${safe}</span>`;
}

function renderCaseToken(raw, options, blank, pools) {
  const words = raw.split(" ");
  return words.map((word) => {
    const matchWord = word.match(/^([A-Za-zÄÖÜäöüß]+)([^A-Za-zÄÖÜäöüß]*)$/);
    if (!matchWord) return escapeHtml(word);
    const base = matchWord[1];
    const tail = matchWord[2] || "";
    const lower = base.toLowerCase();

    if (options.hidePronouns && pronounList.includes(lower)) {
      const group = getGroup(lower, pronounGroups) || pronounList;
      return `${blank(lower, group, pronounList)}${escapeHtml(tail)}`;
    }
    if (options.hideArticles && articleList.includes(lower)) {
      const group = getGroup(lower, articleGroups) || articleList;
      return `${blank(lower, group, articleList)}${escapeHtml(tail)}`;
    }
    return escapeHtml(word);
  }).join(" ");
}

function buildSentence(sentence, options, pools, targetTag) {
  const tokenRegex = /\{(v|adj|n|p|a|d|g):([^}]+)\}/g;
  let result = "";
  let lastIndex = 0;
  let blankCount = 0;

  const blank = (correct, pool, fallback) => {
    blankCount += 1;
    return renderSelect(correct, pool, fallback);
  };

  let match;
  while ((match = tokenRegex.exec(sentence)) !== null) {
    result += escapeHtml(sentence.slice(lastIndex, match.index));
    const type = match[1];
    const raw = match[2].trim();

    if (type === "p") {
      if (options.hidePrepositions) {
        result += blank(raw, pools.prep, pools.prep);
      } else {
        result += renderMark(type, raw);
      }
      lastIndex = tokenRegex.lastIndex;
      continue;
    }

    if (type === targetTag) {
      if (options.hideTarget) {
        result += blank(raw, pools.target, pools.target);
      } else {
        result += renderMark(type, raw);
      }
      lastIndex = tokenRegex.lastIndex;
      continue;
    }

    if (type === "a" || type === "d" || type === "g") {
      if (options.hideCase) {
        result += blank(raw, pools.kasus, pools.kasus);
        lastIndex = tokenRegex.lastIndex;
        continue;
      }
      if (options.hideArticles || options.hidePronouns) {
        const caseHtml = renderCaseToken(raw, options, blank, pools);
        result += `<span class="mark mark-${type}">${caseHtml}</span>`;
        lastIndex = tokenRegex.lastIndex;
        continue;
      }
      result += renderMark(type, raw);
      lastIndex = tokenRegex.lastIndex;
      continue;
    }

    result += renderMark(type, raw);
    lastIndex = tokenRegex.lastIndex;
  }

  result += escapeHtml(sentence.slice(lastIndex));
  return { html: result, blanks: blankCount };
}

function extractQuestions(text, targetTag) {
  const lines = text.split(/\r?\n/);
  const questions = [];
  const prepSet = new Set();
  const targetSet = new Set();
  const caseSet = new Set();
  const tokenRegex = /\{(v|adj|n|p|a|d|g):([^}]+)\}/g;

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!/^\-\s+/.test(line)) return;

    const trimmed = line.replace(/^-\s+/, "");
    const leftSide = getLeftSide(trimmed);
    let sentence = trimmed;
    if (leftSide.length < trimmed.length) {
      sentence = trimmed.slice(leftSide.length + 1).trim() || trimmed;
    }

    if (!sentence.includes(`{${targetTag}:`)) return;

    const matches = [...sentence.matchAll(tokenRegex)];
    if (!matches.length) return;

    matches.forEach((match) => {
      const type = match[1];
      const raw = match[2].trim();
      if (type === "p") prepSet.add(raw);
      if (type === targetTag) targetSet.add(raw);
      if (type === "a" || type === "d" || type === "g") caseSet.add(raw);
    });

    questions.push({ sentence });
  });

  return {
    questions,
    prepPool: Array.from(prepSet),
    targetPool: Array.from(targetSet),
    casePool: Array.from(caseSet)
  };
}

function updateTopicOptions() {
  Object.keys(topicLabels).forEach((topic) => {
    const option = topicSelect.querySelector(`option[value="${topic}"]`);
    if (!option) return;
    const count = state.decks[topic].length;
    option.textContent = `${topicLabels[topic]} (${count})`;
  });
}

function updateAvailable() {
  const topic = topicSelect.value;
  const available = state.decks[topic].length;
  availableLabel.textContent = `Verfuegbar: ${available}`;

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

function renderTest(questions) {
  testList.innerHTML = "";
  if (!questions.length) {
    testList.innerHTML = "<p>Keine passenden Aufgaben gefunden.</p>";
    return;
  }

  questions.forEach((question) => {
    const container = document.createElement("div");
    container.className = "test-item";

    const sentence = document.createElement("div");
    sentence.className = "test-sentence";
    sentence.innerHTML = question.html;

    const feedback = document.createElement("div");
    feedback.className = "test-feedback";

    container.appendChild(sentence);
    container.appendChild(feedback);
    testList.appendChild(container);
  });
}

function startTest() {
  const topic = topicSelect.value;
  const allQuestions = state.decks[topic];
  if (!allQuestions.length) return;

  const options = {
    hidePrepositions: hidePrep.checked,
    hideTarget: hideTarget.checked,
    hideCase: hideCase.checked,
    hideArticles: hideArticles.checked,
    hidePronouns: hidePronouns.checked
  };

  if (!options.hidePrepositions && !options.hideTarget && !options.hideCase
    && !options.hideArticles && !options.hidePronouns) {
    testList.innerHTML = "<p>Bitte mindestens eine Auswahl aktivieren.</p>";
    checkButton.disabled = true;
    resetButton.disabled = false;
    return;
  }

  const requested = Number.parseInt(countInput.value, 10) || 1;
  const total = clamp(requested, 1, allQuestions.length);
  const targetTag = targetTags[topic];
  const pools = {
    prep: state.pools.prep[topic],
    target: state.pools.target[topic],
    kasus: state.pools.kasus[topic]
  };

  const selected = [];
  const shuffled = shuffle(allQuestions);
  for (const question of shuffled) {
    const built = buildSentence(question.sentence, options, pools, targetTag);
    if (built.blanks === 0) continue;
    selected.push({
      sentence: question.sentence,
      html: built.html
    });
    if (selected.length >= total) break;
  }

  renderTest(selected);
  checkButton.disabled = selected.length === 0;
  resetButton.disabled = false;
}

function checkTest() {
  const items = Array.from(testList.querySelectorAll(".test-item"));
  items.forEach((item) => {
    const selects = Array.from(item.querySelectorAll(".test-select"));
    const feedback = item.querySelector(".test-feedback");
    const answers = selects.map((select) => select.dataset.answer);

    item.classList.remove("is-correct", "is-wrong");

    const allAnswered = selects.every((select) => select.value);
    const allCorrect = selects.every((select) => select.value === select.dataset.answer);

    if (!selects.length) {
      item.classList.add("is-wrong");
      feedback.textContent = "Keine Luecken vorhanden.";
      return;
    }

    if (allAnswered && allCorrect) {
      item.classList.add("is-correct");
      feedback.textContent = "Richtig";
    } else {
      item.classList.add("is-wrong");
      feedback.textContent = `Antworten: ${answers.join(", ")}`;
    }
  });
}

function resetTest() {
  testList.innerHTML = "";
  checkButton.disabled = true;
  resetButton.disabled = true;
}

async function loadDecks() {
  try {
    const loadFile = async (path) => {
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
      }
      return response.text();
    };

    const [verbenText, nomenText, adjText] = await Promise.all([
      loadFile("../../../verben/content.md"),
      loadFile("../../../nomen/content.md"),
      loadFile("../../../adjektive/content.md")
    ]);

    const verbData = extractQuestions(verbenText, "v");
    const nounData = extractQuestions(nomenText, "n");
    const adjData = extractQuestions(adjText, "adj");

    state.decks.verben = verbData.questions;
    state.decks.nomen = nounData.questions;
    state.decks.adjektive = adjData.questions;

    state.pools.prep.verben = verbData.prepPool;
    state.pools.prep.nomen = nounData.prepPool;
    state.pools.prep.adjektive = adjData.prepPool;

    state.pools.target.verben = verbData.targetPool;
    state.pools.target.nomen = nounData.targetPool;
    state.pools.target.adjektive = adjData.targetPool;

    state.pools.kasus.verben = verbData.casePool;
    state.pools.kasus.nomen = nounData.casePool;
    state.pools.kasus.adjektive = adjData.casePool;

    updateTopicOptions();
    topicSelect.disabled = false;
    countInput.disabled = false;
    updateAvailable();
  } catch (error) {
    testList.innerHTML = "<p>Listen konnten nicht geladen werden.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");

  topicSelect.addEventListener("change", updateAvailable);
  countInput.addEventListener("change", updateAvailable);
  startButton.addEventListener("click", startTest);
  checkButton.addEventListener("click", checkTest);
  resetButton.addEventListener("click", resetTest);

  loadDecks();

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});
