(() => {
  function tokenise(line) {
    return line.split(/\s+/).filter(Boolean);
  }

  function buildLine(line, lineIndex) {
    const row = document.createElement("div");
    row.className = "labeler-line";

    if (typeof line === "object" && line.prefix) {
      const prefix = document.createElement("span");
      prefix.className = "labeler-index";
      prefix.textContent = line.prefix;
      row.appendChild(prefix);
      line = line.text;
    }

    tokenise(line).forEach((token) => {
      if (/^\.+$/.test(token)) {
        const blank = document.createElement("span");
        blank.className = "labeler-token is-blank";
        blank.textContent = token;
        row.appendChild(blank);
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "labeler-token";
      button.textContent = token;
      button.dataset.line = lineIndex;
      row.appendChild(button);
    });

    return row;
  }

  function mount(root, { lines }) {
    if (!root) return;

    const linesContainer = root.querySelector("[data-labeler-lines]");
    if (!linesContainer) return;

    linesContainer.innerHTML = "";
    lines.forEach((line, index) => {
      linesContainer.appendChild(buildLine(line, index));
    });

    const paletteButtons = [...root.querySelectorAll(".labeler-pill")];
    let activeLabel = paletteButtons[0]?.dataset.label || null;

    function setActive(label) {
      activeLabel = label;
      paletteButtons.forEach((button) => {
        const isActive = button.dataset.label === label;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    paletteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setActive(button.dataset.label);
      });
    });

    setActive(activeLabel);

    root.addEventListener("click", (event) => {
      const token = event.target.closest(".labeler-token");
      if (!token || token.classList.contains("is-blank")) return;

      if (event.altKey || event.metaKey || event.ctrlKey || !activeLabel) {
        token.removeAttribute("data-label");
        token.classList.remove("is-labeled");
        return;
      }

      token.dataset.label = activeLabel;
      token.classList.add("is-labeled");
    });

    const resetButton = root.querySelector(".labeler-reset");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        root.querySelectorAll(".labeler-token.is-labeled").forEach((token) => {
          token.removeAttribute("data-label");
          token.classList.remove("is-labeled");
        });
      });
    }
  }

  window.TelcLabeler = { mount };
})();
