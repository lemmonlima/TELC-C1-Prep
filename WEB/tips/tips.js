(() => {
  const isTipsPath = /\/tips\//.test(location.pathname);
  if (!isTipsPath) return;

  const container = document.getElementById("doc-content");
  if (!container) return;

  const slugify = (value) => {
    const base = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return base || "abschnitt";
  };

  const uniqueIdFactory = () => {
    const used = new Map();
    return (base) => {
      const key = String(base || "abschnitt");
      const next = (used.get(key) || 0) + 1;
      used.set(key, next);
      return next === 1 ? key : `${key}-${next}`;
    };
  };

  const trimDocSpacers = (parent) => {
    if (!parent) return;

    const isSpacer = (el) => el?.classList?.contains("doc-spacer");

    let kids = Array.from(parent.children);
    while (kids.length && isSpacer(kids[0])) {
      kids[0].remove();
      kids = Array.from(parent.children);
    }
    while (kids.length && isSpacer(kids[kids.length - 1])) {
      kids[kids.length - 1].remove();
      kids = Array.from(parent.children);
    }

    let prevSpacer = false;
    Array.from(parent.children).forEach((el) => {
      if (!isSpacer(el)) {
        prevSpacer = false;
        return;
      }
      if (prevSpacer) {
        el.remove();
        return;
      }
      prevSpacer = true;
    });
  };

  const wrapH4IntoCards = (block) => {
    const kids = Array.from(block.children);
    const hasH3 = kids.some((el) => el.tagName === "H3");
    if (hasH3) return;

    const h4Idxs = kids
      .map((el, idx) => (el.tagName === "H4" ? idx : -1))
      .filter((idx) => idx !== -1);

    if (h4Idxs.length < 2) return;

    const firstIdx = h4Idxs[0];
    const firstH4 = kids[firstIdx];
    if (!firstH4) return;

    const grid = document.createElement("div");
    grid.className = "grid tips-cards";
    block.insertBefore(grid, firstH4);

    let currentCard = null;
    let cardIndex = 0;

    kids.slice(firstIdx).forEach((el) => {
      if (el.tagName === "H4") {
        currentCard = document.createElement("div");
        currentCard.className = "module-card tips-card reveal";
        currentCard.style.setProperty("--delay", `${80 + cardIndex * 60}ms`);
        cardIndex += 1;
        grid.appendChild(currentCard);
      }
      if (!currentCard) return;
      currentCard.appendChild(el);
    });

    Array.from(grid.children).forEach(trimDocSpacers);
    trimDocSpacers(block);
  };

  const buildLayout = () => {
    if (container.dataset.tipsProcessed === "1") return true;
    if (!container.children.length) return false;

    container.dataset.tipsProcessed = "1";
    container.classList.remove("doc", "doc-relaxed");
    container.classList.add("tips-layout");
    container.setAttribute("aria-busy", "false");

    const original = Array.from(container.children);
    const makeUniqueId = uniqueIdFactory();

    const blocks = [];
    const tocItems = [];

    let i = 0;
    const introNodes = [];
    while (i < original.length && original[i].tagName !== "H2") {
      introNodes.push(original[i]);
      i += 1;
    }

    const introHasContent = introNodes.some((el) => !el.classList.contains("doc-spacer"));
    if (introHasContent) {
      const introBlock = document.createElement("section");
      introBlock.className = "doc doc-relaxed tips-block reveal";
      introNodes.forEach((el) => introBlock.appendChild(el));
      trimDocSpacers(introBlock);

      const h1 = introBlock.querySelector(":scope > h1");
      if (h1) {
        const id = makeUniqueId(slugify(h1.textContent));
        h1.id = id;
        tocItems.push({ id, title: h1.textContent.trim() });
      }

      blocks.push(introBlock);
    } else {
      introNodes.forEach((el) => el.remove());
    }

    while (i < original.length) {
      if (original[i].tagName !== "H2") {
        i += 1;
        continue;
      }

      const sectionNodes = [original[i]];
      i += 1;
      while (i < original.length && original[i].tagName !== "H2") {
        sectionNodes.push(original[i]);
        i += 1;
      }

      const block = document.createElement("section");
      block.className = "doc doc-relaxed tips-block reveal";
      sectionNodes.forEach((el) => block.appendChild(el));

      const h2 = block.querySelector(":scope > h2");
      if (h2) {
        const id = makeUniqueId(slugify(h2.textContent));
        h2.id = id;
        tocItems.push({ id, title: h2.textContent.trim() });
      }

      trimDocSpacers(block);
      wrapH4IntoCards(block);
      blocks.push(block);
    }

    const fragment = document.createDocumentFragment();

    if (tocItems.length > 1) {
      const nav = document.createElement("nav");
      nav.className = "tips-toc chips reveal";
      nav.setAttribute("aria-label", "Abschnitte");

      tocItems.forEach((item, idx) => {
        const a = document.createElement("a");
        a.className = "chip tips-toc-chip";
        a.href = `#${item.id}`;
        a.textContent = item.title;
        a.style.setProperty("--delay", `${80 + idx * 40}ms`);
        nav.appendChild(a);
      });

      fragment.appendChild(nav);
    }

    blocks.forEach((block, idx) => {
      block.style.setProperty("--delay", `${120 + idx * 60}ms`);
      fragment.appendChild(block);
    });

    container.replaceChildren(fragment);
    return true;
  };

  const tryBuild = () => {
    try {
      return buildLayout();
    } catch (error) {
      // Fail open: keep original content instead of breaking the page.
      console.error("[tips] layout processing failed:", error);
      return true;
    }
  };

  if (!tryBuild()) {
    const observer = new MutationObserver(() => {
      if (tryBuild()) observer.disconnect();
    });
    observer.observe(container, { childList: true });
  }
})();

