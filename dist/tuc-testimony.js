// // script start for team popup open and close

// document.addEventListener("DOMContentLoaded", function () {
//   setTimeout(() => {
//     initializeTestimonyCards();
//     document.querySelectorAll(".w-pagination-wrapper a").forEach((nextBtn) => {
//       nextBtn.addEventListener("click", function () {
//         console.log("Button clicked");
//         initializeTestimonyCards();
//         console.log(nextBtn);
//       });
//     });
//   }, 200);
// });

// function initializeTestimonyCards() {
//   const cards = document.querySelectorAll("[testimony-card]");
//   const popups = document.querySelectorAll("[testimony-popup]");
//   const scrollBarWidth =
//     window.innerWidth - document.documentElement.clientWidth;
//   //console.log("Initializing testimony cards:", cards);
//   //console.log("Initializing testimony popups:", popups);
//   gsap.set(popups, { opacity: 0, display: "none" });
//   cards.forEach((card) => {
//     const clone = card.cloneNode(true);
//     card.parentNode.replaceChild(clone, card);
//   });
//   document.querySelectorAll("[testimony-card]").forEach((card) => {
//     card.addEventListener("click", function () {
//       const cardId = this.getAttribute("testimony-card");
//       const popup = document.querySelector(`[testimony-popup="${cardId}"]`);
//       if (popup) {
//         document.body.style.overflow = "hidden";
//         document.body.style.paddingRight = `${scrollBarWidth}px`;
//         if (typeof lenis !== "undefined") {
//           lenis.stop();
//         }
//         gsap.set(popup, { display: "block" });
//         gsap.to(popup, {
//           opacity: 1,
//           duration: 0.5,
//           ease: "power2.out",
//         });
//       }
//     });
//   });
//   document.querySelectorAll('[popup-close="testimony"]').forEach((closeBtn) => {
//     const clone = closeBtn.cloneNode(true);
//     closeBtn.parentNode.replaceChild(clone, closeBtn);
//   });
//   document.querySelectorAll('[popup-close="testimony"]').forEach((closeBtn) => {
//     closeBtn.addEventListener("click", function () {
//       const popup = this.closest("[testimony-popup]");
//       const popupscroll = popup.querySelector(".testimony-popup-scroll");
//       gsap.to(popup, {
//         opacity: 0,
//         duration: 0.3,
//         onComplete: () => {
//           gsap.set(popup, { display: "none" });
//           document.body.style.overflow = "auto";
//           document.body.style.paddingRight = "";
//           if (typeof lenis !== "undefined") {
//             lenis.start();
//           }
//         },
//       });
//       popupscroll.scrollTo({
//         top: 0,
//         left: 0,
//         behavior: "smooth",
//       });
//     });
//   });
// }

document.querySelectorAll("[modal]").forEach((modalEl) => {
  const outsideEl = modalEl.querySelector('[modal="outside"]');
  const closeBtn = modalEl.querySelector('[modal="close"]');

  if (outsideEl && closeBtn) {
    outsideEl.addEventListener("click", () => {
      console.log(closeBtn);
      closeBtn.click(); // trigger existing close logic
    });
  }
});
