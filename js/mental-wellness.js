/* Mental Wellness — format filter for exercises (same chip pattern as Learn) */
"use strict";

(function () {
  const filterRow = document.getElementById("typeFilter");
  const exerciseGrid = document.getElementById("exerciseGrid");
  const exerciseCount = document.getElementById("exerciseCount");
  const exerciseCards = [...exerciseGrid.querySelectorAll(".media-card")];

  function filterByType(type) {
    let visibleCount = 0;
    exerciseCards.forEach((card) => {
      const isMatch = type === "all" || card.dataset.type === type;
      card.hidden = !isMatch;
      if (isMatch) visibleCount += 1;
    });
    filterRow.querySelectorAll(".chip").forEach((chip) => {
      const isSelected = chip.dataset.type === type;
      chip.classList.toggle("selected", isSelected);
      chip.setAttribute("aria-pressed", String(isSelected));
    });
    exerciseCount.textContent = `${visibleCount} ${visibleCount === 1 ? "exercise" : "exercises"}`;
  }

  filterRow.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (chip) filterByType(chip.dataset.type);
  });

  filterByType("all");
})();
