/**
 * Topbar: siempre visible. Solo se oculta con el botón "Ocultar barra" (−).
 * Al ocultar se guarda en sessionStorage; el trigger "▼" la vuelve a mostrar.
 */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var t = document.querySelector(".topbar");
    if (!t) return;
    var b = document.body;
    if (sessionStorage.getItem("telc_topbar_hidden") === "1") b.classList.add("topbar-hidden");

    var c = t.querySelector(".cta"),
      a = document.createElement("div");
    a.className = "topbar-actions";
    var h = document.createElement("button"),
      r = document.createElement("button");
    h.type = "button";
    h.className = "topbar-btn topbar-hide";
    h.title = "Barra minimizar";
    h.setAttribute("aria-label", "Barra minimizar");
    h.textContent = "−";
    r.type = "button";
    r.className = "topbar-btn topbar-reset";
    r.title = "Reiniciar (olvidar posiciones)";
    r.setAttribute("aria-label", "Reiniciar");
    r.textContent = "↺";
    a.appendChild(h);
    a.appendChild(r);
    if (c) a.appendChild(c);
    t.appendChild(a);

    var g = document.createElement("div");
    g.className = "topbar-show-trigger";
    g.title = "Mostrar barra";
    g.textContent = "▼";
    t.parentNode.insertBefore(g, t);

    h.onclick = function () {
      b.classList.add("topbar-hidden");
      b.classList.remove("topbar-auto-hidden");
      sessionStorage.setItem("telc_topbar_hidden", "1");
    };
    g.onclick = function () {
      b.classList.remove("topbar-hidden");
      b.classList.remove("topbar-auto-hidden");
      sessionStorage.removeItem("telc_topbar_hidden");
    };

    r.onclick = function () {
      var ks = [];
      for (var i = 0; i < sessionStorage.length; i++) {
        var k = sessionStorage.key(i);
        if (k && k.indexOf("telc_") === 0) ks.push(k);
      }
      ks.forEach(function (k) {
        sessionStorage.removeItem(k);
      });
      location.reload();
    };
  });
})();
