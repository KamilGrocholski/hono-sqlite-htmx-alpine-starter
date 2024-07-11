// solution for now
// TODO make it controllable from one place
// TODO set theme value from ls on each page request

function themeToggle() {
  const fromLs = localStorage.getItem("theme") || "winter";
  document.documentElement.setAttribute("data-theme", fromLs);

  const toggler = document.getElementById("theme-controller");

  toggler?.addEventListener("input", (e) => {
    const fromLs = localStorage.getItem("theme");
    const theme = fromLs === "dim" ? "winter" : "dim";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  });
}

(function init() {
  document.addEventListener("DOMContentLoaded", function (event) {
    themeToggle();
  });
})();
