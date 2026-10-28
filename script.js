document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const sidePanel = document.getElementById("side-panel");
  const navLinks = [...document.querySelectorAll("#nav-links a")];
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const projectCards = [...document.querySelectorAll(".project-card")];
  const year = document.getElementById("current-year");

  if (year) year.textContent = new Date().getFullYear();

  if (menuToggle && sidePanel) {
    menuToggle.addEventListener("click", () => {
      const isOpen = sidePanel.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    navLinks.forEach(link => link.addEventListener("click", () => {
      sidePanel.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }));
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      projectCards.forEach(card => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.hidden = !matches;
      });
    });
  });

  // Hide missing image previews cleanly instead of showing broken-image icons.
  document.querySelectorAll(".project-visual img, .certificate-image img, .org-logo img").forEach(img => {
    const markMissing = () => {
      img.classList.add("broken");
      const wrapper = img.closest(".project-visual, .certificate-image");
      if (wrapper) wrapper.classList.add("image-missing");
    };
    img.addEventListener("error", markMissing);
    if (img.complete && img.naturalWidth === 0) markMissing();
  });

  // Highlight the navigation item for the section currently in view.
  if ("IntersectionObserver" in window) {
    const sections = [...document.querySelectorAll("main section[id]")];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
});
