// script start for team popup open and close

document.addEventListener("DOMContentLoaded", function () {
  initializeTeamCards();
  document.querySelectorAll(".w-pagination-next").forEach((nextBtn) => {
    nextBtn.addEventListener("click", function () {
      setTimeout(() => {
        initializeTeamCards();
      }, 200);
    });
  });
});
function initializeTeamCards() {
  const cards = document.querySelectorAll("[team-card]");
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  console.log(scrollBarWidth);
  const popups = document.querySelectorAll("[team-popup]");
  console.log("Initializing team cards:", cards);
  console.log("Initializing team popups:", popups);
  gsap.set(popups, { opacity: 0, display: "none" });
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    card.parentNode.replaceChild(clone, card);
  });
  document.querySelectorAll("[team-card]").forEach((card) => {
    card.addEventListener("click", function () {
      const cardId = this.getAttribute("team-card");
      const popup = document.querySelector(`[team-popup="${cardId}"]`);
      if (popup) {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollBarWidth}px`; // equivalent to $("body").css("overflow", "hidden")
        if (typeof lenis !== "undefined") {
          lenis.stop();
          console.log(lenis);
        }
        gsap.set(popup, { display: "block" });
        gsap.to(popup, {
          opacity: 1,
          //scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  });
  document
    .querySelectorAll('[popup-close="team"], [modal="outside"]')
    .forEach((closeBtn) => {
      const clone = closeBtn.cloneNode(true);
      closeBtn.parentNode.replaceChild(clone, closeBtn);
    });
  document
    .querySelectorAll('[popup-close="team"] , [modal="outside"]')
    .forEach((closeBtn) => {
      closeBtn.addEventListener("click", function () {
        const popup = this.closest("[team-popup]");
        gsap.to(popup, {
          opacity: 0,
          //scale: 0.98,
          duration: 0.3,
          // display: "none",

          onComplete: () => {
            gsap.set(popup, { display: "none" });

            // Additional functionality
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = ""; // Equivalent to $("body").css("overflow", "auto")
            if (typeof lenis !== "undefined") {
              lenis.start();
            }
          },
        });
      });
    });
}

// document.querySelectorAll("[modal]").forEach((modalEl) => {
//   const outsideEl = modalEl.querySelector('[modal="outside"]');
//   const closeBtn = modalEl.querySelector('[modal="close"]');

//   if (outsideEl && closeBtn) {
//     outsideEl.addEventListener("click", () => {
//       console.log(closeBtn);
//       closeBtn.click(); // trigger existing close logic
//     });
//   }
// });
