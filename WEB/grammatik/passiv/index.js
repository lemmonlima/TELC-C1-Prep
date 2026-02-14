document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");
  
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});

