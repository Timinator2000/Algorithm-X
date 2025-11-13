// docs/js/page-numbers.js
window.addEventListener("DOMContentLoaded", () => {
  let checkInterval = null;

  // Utility: measure text width
  function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    return context.measureText(text).width;
  }

  function getResolvedColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      fg: styles.getPropertyValue("--md-default-fg-color").trim() || "#000",
      bg: styles.getPropertyValue("--md-default-bg-color").trim() || "#fff",
    };
  }

  // Determine if counter fits before creating it
  function shouldShowCounter(counterText) {
    const pageTitle = document.querySelector(".md-header__title");
    if (!pageTitle) return false;

    const titleStyle = getComputedStyle(pageTitle);
    const titleText = pageTitle.textContent.trim();
    const titleTextWidth = getTextWidth(titleText, `${titleStyle.fontSize} ${titleStyle.fontFamily}`);

    const margin = 8;
    const buffer = 90; // your buffer
    const availableSpace = window.innerWidth - titleTextWidth - margin * 2;

    // Estimate counter width based on its text
    const counterFont = `${titleStyle.fontSize} ${titleStyle.fontFamily}`;
    const counterWidth = getTextWidth(counterText, counterFont) + 20; // 20px padding

    return counterWidth <= availableSpace - buffer;
  }

  function updateCounter() {
    const existing = document.getElementById("page-counter");

    // Gather real nav links
    const links = Array.from(document.querySelectorAll(".md-nav__link[href]"))
      .filter(a => !a.getAttribute("href").startsWith("#"));
    const active = links.findIndex(a => a.classList.contains("md-nav__link--active")) + 1;
    const total = links.length;

    if (!(active > 0 && total > 1)) return;
    const counterText = `Page ${active} of ${total}`;

    if (!shouldShowCounter(counterText)) {
      if (existing) existing.remove();
      return; // never create the counter if it won't fit
    }

    if (existing) return; // already created

    const { fg, bg } = getResolvedColors();
    const counter = document.createElement("div");
    counter.id = "page-counter";
    counter.textContent = counterText;
    Object.assign(counter.style, {
      position: "fixed",
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

    // --- Adaptive positioning ---
    function adjustTop() {
      const pageTitle = document.querySelector(".md-header__title");
      if (!pageTitle) return;

      const titleStyle = getComputedStyle(pageTitle);
      const titleText = pageTitle.textContent.trim();
      const titleTextWidth = getTextWidth(titleText, `${titleStyle.fontSize} ${titleStyle.fontFamily}`);

      const counterRect = counter.getBoundingClientRect();
      const margin = 8;
      const buffer = 90;
      const availableSpace = window.innerWidth - titleTextWidth - margin * 2;

      if (counterRect.width > availableSpace - buffer) {
        counter.style.opacity = "0";
        counter.style.transform = "translate(-50%, -5px)";
      } else {
        counter.style.opacity = "1";
        counter.style.transform = "translate(-50%, 0)";
        counter.style.top = "0.7rem";
      }
    }

    requestAnimationFrame(() => {
      adjustTop();
    });

    window.addEventListener("resize", adjustTop);

    // --- Monitor search expansion ---
    const searchInput = document.querySelector(".md-search__input");
    if (searchInput) {
      let lastWidth = searchInput.getBoundingClientRect().width;

      checkInterval = setInterval(() => {
        const newWidth = searchInput.getBoundingClientRect().width;
        const expanded = newWidth - lastWidth > 50 || newWidth > 300;

        if (expanded) {
          counter.style.opacity = "0";
          counter.style.transform = "translate(-50%, -5px)";
        } else {
          adjustTop();
        }

        lastWidth = newWidth;
      }, 200);
    }

    // --- Theme sync ---
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
