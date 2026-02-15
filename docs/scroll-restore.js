/**
 * Preserva scroll y último subtema por tema grande.
 * - Guarda scroll al salir; restaura al volver.
 * - Al hacer clic en un tema (Grammatik, Texte, etc.), va al último subtema visitado.
 */
(function () {
  var path = location.pathname;
  var hash = location.hash || "";
  var full = path + hash;

  function getTopic(p) {
    if (/\/grammatik\//.test(p)) return "grammatik";
    if (/\/texte\//.test(p)) return "texte";
    if (/\/notizen\//.test(p)) return "notizen";
    if (/\/woerter\//.test(p)) return "woerter";
    return "start";
  }

  function isTopicIndex(p, topic) {
    if (topic === "grammatik") return /\/grammatik\/index\.html$/.test(p) || /\/grammatik\/?$/.test(p);
    if (topic === "texte") return /\/texte\/index\.html$/.test(p) || /\/texte\/?$/.test(p);
    if (topic === "notizen") return /\/notizen\/index\.html$/.test(p) || /\/notizen\/?$/.test(p);
    if (topic === "woerter") return /\/woerter\/index\.html$/.test(p) || /\/woerter\/?$/.test(p);
    if (topic === "start") return /\/index\.html$/.test(p) && !/\/grammatik\//.test(p) && !/\/texte\//.test(p) && !/\/notizen\//.test(p) && !/\/woerter\//.test(p);
    return false;
  }

  var k = "telc_scroll_" + path;
  function save() {
    try {
      sessionStorage.setItem(k, JSON.stringify({ x: scrollX, y: scrollY }));
      sessionStorage.setItem("telc_last_" + getTopic(path), full);
    } catch (e) {}
  }

  function restore() {
    try {
      var s = sessionStorage.getItem(k);
      if (s) {
        var p = JSON.parse(s);
        scrollTo(p.x, p.y);
      }
    } catch (e) {}
  }

  function go() {
    requestAnimationFrame(function () {
      setTimeout(restore, 50);
      setTimeout(restore, 300);
    });
  }

  window.addEventListener("pagehide", save);
  window.addEventListener("beforeunload", save);

  document.addEventListener(
    "click",
    function (e) {
      var a = e.target.closest("a");
      if (!a || !a.href) return;
      try {
        var u = new URL(a.href, location.href);
        if (u.origin !== location.origin) return;
        save();
        var targetPath = u.pathname;
        var targetTopic = getTopic(targetPath);
        if (!isTopicIndex(targetPath, targetTopic)) return;
        var last = sessionStorage.getItem("telc_last_" + targetTopic);
        if (!last || last === targetPath + (u.hash || "")) return;
        e.preventDefault();
        location.href = location.origin + last;
      } catch (x) {}
    },
    true
  );

  if (document.readyState === "complete") go();
  else window.addEventListener("load", go);
})();
