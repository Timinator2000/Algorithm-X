// docs/js/page-numbers.js
window.addEventListener("DOMContentLoaded", () => {
  const MIN_WIDTH = 600;
  let checkInterval = null;

  function getResolvedColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      fg: styles.getPropertyValue("--md-default-fg-color").trim() || "#000",
      bg: styles.getPropertyValue("--md-default-bg-color").trim() || "#fff",
    };
  }

  function updateCounter() {
    const existing = document.getElementById("page-counter");
    if (window.innerWidth < MIN_WIDTH) {
      if (existing) existing.remove();
      if (checkInterval) clearInterval(checkInterval);
      return;
    }

    const links = Array.from(document.querySelectorAll(".md-nav__link[href]"))
      .filter(a => !a.getAttribute("href").startsWith("#"));
    const active = links.findIndex(a => a.classList.contains("md-nav__link--active")) + 1;
    const total = links.length;

    if (!(active > 0 && total > 1)) return;
    if (existing) return;

    const { fg, bg } = getResolvedColors();
    const counter = document.createElement("div");
    counter.id = "page-counter";
    counter.textContent = `Page ${active} of ${total}`;
    Object.assign(counter.style, {
      position: "fixed",
      top: "0.7rem",
      left: "50%",
      transform: "translateX(-50%)",
      background: bg,
      color: fg,
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "1em",
      opacity: "1",
      zIndex: 2000,
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      pointerEvents: "none",
    });
    document.body.appendChild(counter);

    // 🧩 Monitor search box size directly
    const searchInput = document.querySelector(".md-search__input");
    if (searchInput) {
      let lastWidth = searchInput.getBoundingClientRect().width;

      checkInterval = setInterval(() => {
        const newWidth = searchInput.getBoundingClientRect().width;

        // Detect if the search box has expanded significantly
        const expanded = newWidth - lastWidth > 50 || newWidth > 300;

        if (expanded) {
          counter.style.opacity = "0";
          counter.style.transform = "translate(-50%, -5px)";
        } else {
          counter.style.opacity = "1";
          counter.style.transform = "translate(-50%, 0)";
        }

        lastWidth = newWidth;
      }, 200);
    }

    // keep colors in sync with theme
    const themeObserver = new MutationObserver(() => {
      const { fg, bg } = getResolvedColors();
      counter.style.background = bg;
      counter.style.color = fg;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-md-color-scheme"],
    });
  }

  updateCounter();
  window.addEventListener("resize", updateCounter);
});
