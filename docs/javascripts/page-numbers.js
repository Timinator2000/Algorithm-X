// docs/js/page-numbers.js
window.addEventListener("DOMContentLoaded", () => {
  // Minimum width before showing the counter
  const MIN_WIDTH = 600;

  function updateCounter() {
    const existing = document.getElementById("page-counter");

    if (window.innerWidth < MIN_WIDTH) {
      if (existing) existing.remove();
      return;
    }

    // Get all sidebar links pointing to real pages
    const links = Array.from(document.querySelectorAll(".md-nav__link[href]"))
      .filter(a => !a.getAttribute("href").startsWith("#"));

    const active = links.findIndex(a => a.classList.contains("md-nav__link--active")) + 1;
    const total = links.length;

    if (active > 0 && total > 1 && !existing) {
      const counter = document.createElement("div");
      counter.textContent = `Page ${active} of ${total}`;
      counter.id = "page-counter";

      Object.assign(counter.style, {
        position: "fixed",
        top: "0.8rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--md-default-bg-color)",
        color: "var(--md-default-fg-color)",
        padding: "4px 10px",
        borderRadius: "6px",
        fontSize: "1em",
        opacity: "0.85",
        zIndex: 2000,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: "none",
      });

      document.body.appendChild(counter);

      // Subtle fade-in animation
      counter.style.opacity = "0";
      counter.style.transform = "translate(-50%, -5px)";
      requestAnimationFrame(() => {
        counter.style.opacity = "1";
        counter.style.transform = "translate(-50%, 0)";
      });
    }
  }

  // Initial check and update on resize
  updateCounter();
  window.addEventListener("resize", updateCounter);
});
