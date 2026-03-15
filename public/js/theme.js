(function () {
  var STORAGE_KEY = "tabs-theme";
  var html = document.documentElement;

  function getPreferred() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function apply(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  apply(getPreferred());

  function handleToggleClick() {
    var current = html.getAttribute("data-theme") || "light";
    var nextTheme = current === "dark" ? "light" : "dark";
    apply(nextTheme);
  }

  document.addEventListener("click", function (event) {
    var btn = event.target.closest(".theme-toggle");
    if (!btn) return;
    event.preventDefault();
    handleToggleClick();
  });
})();
