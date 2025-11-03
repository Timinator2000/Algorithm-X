document.addEventListener("DOMContentLoaded", () => {
  const imageNames = ["sudoku01.png", "sudoku02.png"];
  const lightPrefix = "/images/";
  const darkSuffix = "-dark";

  const swapAllImages = () => {
    const darkMode = document.documentElement.getAttribute("data-md-color-scheme") === "slate";

    imageNames.forEach(name => {
      const baseName = name.replace(/\.png$/, "");
      const lightSrc = lightPrefix + name;
      const darkSrc = lightPrefix + baseName + darkSuffix + ".png";

      document.querySelectorAll(`img[src$="${name}"]`).forEach(img => {
        img.src = darkMode ? darkSrc : lightSrc;
      });
    });
  };

  // Wait until Material finishes rendering
  if (window.md && md.events && md.events.on) {
    md.events.on("nav.ready", () => {
      swapAllImages();

      // Also listen for dark mode toggle
      document.addEventListener("colorSchemeChange", swapAllImages);
    });
  } else {
    // Fallback for dev: just run once
    swapAllImages();
  }

  // Optional: observe dynamically added images
  const bodyObserver = new MutationObserver(() => swapAllImages());
  bodyObserver.observe(document.body, { childList: true, subtree: true });
});
