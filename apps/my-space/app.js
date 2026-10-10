(function () {
  "use strict";

  // Use the actual sticky header height once; section padding supplies the gap.
  const header = document.querySelector(".site-header");
  const syncHeaderOffset = () => document.documentElement.style.setProperty("--header-height", `${header.getBoundingClientRect().height}px`);
  syncHeaderOffset();
  new ResizeObserver(syncHeaderOffset).observe(header);

  const searchInput = document.querySelector("#faq-search");
  const faqItems = Array.from(document.querySelectorAll("#faq-list details"));
  const emptyState = document.querySelector("#faq-empty");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  let activeFilter = "all";

  function applyFaqFilter() {
    const query = searchInput.value.trim().toLocaleLowerCase("ko-KR");
    let visibleCount = 0;
    faqItems.forEach((item) => {
      const matchesText = !query || item.textContent.toLocaleLowerCase("ko-KR").includes(query);
      const categories = item.dataset.category.split(" ");
      const matchesCategory = activeFilter === "all" || categories.includes(activeFilter);
      const visible = matchesText && matchesCategory;
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    emptyState.hidden = visibleCount !== 0;
  }

  searchInput.addEventListener("input", applyFaqFilter);
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((candidate) => candidate.classList.toggle("active", candidate === button));
      applyFaqFilter();
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });
})();
