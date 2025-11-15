document.addEventListener("DOMContentLoaded", () => {
  // Attach after Material initializes buttons
  setTimeout(() => {
    const buttons = document.querySelectorAll(".md-clipboard");

    buttons.forEach(btn => {
      btn.setAttribute("data-default-label", "Copy code");
      btn.setAttribute("data-copied-label", "Copied");

      // Initial label
      btn.innerHTML = btn.getAttribute("data-default-label");

      btn.addEventListener("click", () => {
        btn.innerHTML = btn.getAttribute("data-copied-label");

        // Revert after 1.5 seconds
        setTimeout(() => {
          btn.innerHTML = btn.getAttribute("data-default-label");
        }, 1500);
      });
    });
  }, 50);
});
