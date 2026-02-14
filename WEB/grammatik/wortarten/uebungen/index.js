const wortartenLines = [
  "Kostas pumpt mich oft",
  "an denn mit dem Geld das sein Vater ihm",
  "monatlich überweist kommt",
  "er nie aus es",
  "reicht nur bis zur Mitte des",
  "Monats aber Kostas",
  "braucht auch Geld für",
  "die zweite",
  "Monatshälfte deshalb",
  "und weil er auf sein Auto nicht",
  "verzichten will",
  "muss er sich etwas",
  "dazuverdienen ....................... oder",
  "manchmal einen Freund anpumpen",
];

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-labeler='wortarten']");
  if (!root || !window.TelcLabeler) return;
  window.TelcLabeler.mount(root, { lines: wortartenLines });
});
