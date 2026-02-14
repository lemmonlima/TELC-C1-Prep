document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");

  const container = document.getElementById("conjugation-content");
  if (!container) return;

  fetch("machen.json")
    .then((r) => r.json())
    .then((data) => {
      const selectedPronoun = data.defaultPronoun || "ich";
      renderConjugation(container, data, selectedPronoun);
      container.removeAttribute("aria-busy");
      requestAnimationFrame(() => document.body.classList.add("is-ready"));
    })
    .catch((err) => {
      container.innerHTML = "<p>No se pudo cargar la conjugación.</p>";
      requestAnimationFrame(() => document.body.classList.add("is-ready"));
    });
});

function renderConjugation(container, data, selectedPronoun) {
  container.innerHTML = "";

  const selectorWrap = document.createElement("div");
  selectorWrap.className = "pronoun-selector-wrap";
  selectorWrap.setAttribute("aria-label", "Pronombre para tablas 1–3 (Indikativ, Konjunktiv I y II)");
  const label = selectorWrap.appendChild(document.createElement("span"));
  label.className = "pronoun-selector-label";
  label.textContent = "Pronombre (tablas 1–3):";
  const btnGroup = selectorWrap.appendChild(document.createElement("div"));
  btnGroup.className = "pronoun-selector";

  (data.pronouns || []).forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pronoun-btn";
    btn.textContent = p.label;
    if (p.key === selectedPronoun) btn.classList.add("is-active");
    btn.addEventListener("click", () => {
      renderConjugation(container, data, p.key);
    });
    btnGroup.appendChild(btn);
  });
  container.appendChild(selectorWrap);

  const wrapper = document.createElement("div");
  wrapper.className = "conjugation-inner";
  renderSections(wrapper, data, selectedPronoun);
  container.appendChild(wrapper);
}

function renderSections(wrapper, data, selectedPronoun) {
  const rowHeaders = ["Zeit", "Aktiv (DE)", "Español", "Vorgangspassiv (DE)", "Español", "Zustandspassiv (DE)", "Español"];

  data.sections.forEach((section) => {
    const sectionEl = document.createElement("div");
    sectionEl.className = "conjugation-section";
    sectionEl.innerHTML = `<h2>${escapeHtml(section.title)}</h2>`;

    if (section.subsections) {
      section.subsections.forEach((sub) => {
        sectionEl.appendChild(document.createElement("h3")).textContent = sub.subtitle;
        sectionEl.appendChild(buildTable(sub.headers, sub.rows));
      });
    } else if (section.rowsByPronoun && data.pronouns && data.pronouns.length) {
      const usageSuffix = (u) => (u === "solemne" ? " (solemne)" : u === "rara" ? " (rara)" : "");
      const rows = section.rowsByPronoun.map((row) => [
        row.zeit + usageSuffix(row.usage),
        row.aktiv[selectedPronoun].de,
        row.aktiv[selectedPronoun].es,
        row.vorgangspassiv.de,
        row.vorgangspassiv.es,
        row.zustandspassiv.de,
        row.zustandspassiv.es
      ]);
      sectionEl.appendChild(buildTable(rowHeaders, rows));
    } else if (section.rows) {
      sectionEl.appendChild(buildTable(section.headers, section.rows));
    }

    if (section.note) {
      const p = sectionEl.appendChild(document.createElement("p"));
      p.className = "conjugation-note";
      p.innerHTML = "Nota: " + section.note;
    }

    wrapper.appendChild(sectionEl);
  });
}

function buildTable(headers, rows) {
  const table = document.createElement("table");
  table.className = "conjugation-table";
  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  headers.forEach((h) => {
    const th = headerRow.appendChild(document.createElement("th"));
    th.textContent = h;
  });
  const tbody = table.createTBody();
  rows.forEach((row) => {
    const tr = tbody.insertRow();
    row.forEach((cell) => {
      const td = tr.insertCell();
      td.textContent = cell;
    });
  });
  return table;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
