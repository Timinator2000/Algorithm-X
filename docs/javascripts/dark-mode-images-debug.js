// dark-mode-images-debug.js
document.addEventListener("DOMContentLoaded", () => {
  const updateImagesForColorScheme = () => {
    const scheme = document.documentElement.getAttribute("data-md-color-scheme");
    const darkMode = scheme !== "default"; // any non-default theme is dark
    console.log("[DarkMode Debug] Color scheme:", scheme, "darkMode:", darkMode);

    document.querySelectorAll("img").forEach(img => {
      const src = img.getAttribute("src");
      if (!src) return;

      // Compute dark image path in the same folder as the current image
      const pathParts = src.split("/");
      const filename = pathParts.pop();
      const extIndex = filename.lastIndexOf(".");
      const base = filename.substring(0, extIndex);
      const ext = filename.substring(extIndex + 1);
      const darkSrc = [...pathParts, `${base}-dark.${ext}`].join("/");
      const lightSrc = src; // original src

      console.log(`[DarkMode Debug] Image: ${src}`);
      console.log(`  darkSrc: ${darkSrc}, lightSrc: ${lightSrc}`);

      // Only switch if the dark image exists
      fetch(darkSrc, { method: "HEAD" }).then(resp => {
        if (darkMode) {
          if (resp.ok && !src.endsWith(`-dark.${ext}`)) {
            img.setAttribute("src", darkSrc);
            console.log("  Switched to dark version");
          }
        } else {
          if (src.endsWith(`-dark.${ext}`)) {
            img.setAttribute("src", lightSrc);
            console.log("  Switched back to light version");
          }
        }
      }).catch(() => {
        console.log("  Dark image not found, keeping light version");
      });
    });
  };

  // Run on page load
  updateImagesForColorScheme();

  // Listen for theme toggles
  document.addEventListener("colorSchemeChange", updateImagesForColorScheme);

  // Observe attribute changes as backup
  const observer = new MutationObserver(updateImagesForColorScheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
});
