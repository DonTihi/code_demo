// Theme switcher for dark/light mode.
(function () {
    "use strict";

    const THEME_KEY = "calculator-theme";
    const DARK = "dark";
    const LIGHT = "light";
    const ICON_DARK = "🌙";
    const ICON_LIGHT = "☀️";

    // Detect system preference
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return DARK;
        }
        return LIGHT;
    }

    // Get the current theme (from localStorage or system preference)
    function getTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) {
            return saved;
        }
        return getSystemTheme();
    }

    // Apply theme to the document
    function applyTheme(theme) {
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);

        const toggle = document.getElementById("theme-toggle");
        if (toggle) {
            const icon = toggle.querySelector(".theme-icon");
            if (icon) {
                icon.textContent = theme === DARK ? ICON_LIGHT : ICON_DARK;
            }
        }
    }

    // Toggle between dark and light
    function toggleTheme() {
        const current = getTheme();
        const next = current === DARK ? LIGHT : DARK;
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    }

    // Initialize
    function init() {
        const toggle = document.getElementById("theme-toggle");
        if (toggle) {
            toggle.addEventListener("click", toggleTheme);
        }
        applyTheme(getTheme());
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { getTheme, applyTheme, toggleTheme, DARK, LIGHT };
    } else {
        document.addEventListener("DOMContentLoaded", init);
        // Also init if DOM is already loaded
        if (document.readyState !== "loading") {
            init();
        }
    }
})();
