document.addEventListener("DOMContentLoaded", function () {
  const faqCards = document.querySelectorAll(".faqs_card");

  faqCards.forEach((card) => {
    const elements = {
      questionSymbol: card.querySelector('[symbol="question"]'),
      answerSymbol: card.querySelector('[symbol="answer"]'),
      questionText: card.querySelector('[copy="question"]'),
      answerText: card.querySelector('[copy="answer"]'),
    };

    gsap.set(elements.answerSymbol, { opacity: 0, display: "none" });
    gsap.set(elements.answerText, {
      opacity: 0,
      height: 0,
      overflow: "hidden",
    });

    card.addEventListener("click", () => {
      const isActive = card.classList.contains("active");
      faqCards.forEach((otherCard) => {
        if (otherCard !== card && otherCard.classList.contains("active")) {
          toggleCardState(otherCard, false);
        }
      });
      toggleCardState(card, !isActive);
    });

    function toggleCardState(targetCard, open) {
      const { questionSymbol, answerSymbol, questionText, answerText } =
        elements;

      if (open) {
        targetCard.classList.add("active");
        gsap.to(questionSymbol, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            gsap.set(questionSymbol, { display: "none" });
            gsap.set(answerSymbol, { display: "inline" });
            gsap.to(answerSymbol, { opacity: 1, duration: 0.3 });
          },
        });

        gsap.to(questionText, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            gsap.set(questionText, { display: "none" });
            gsap.set(answerText, { display: "block" });
            gsap.to(answerText, {
              opacity: 1,
              height: "auto",
              duration: 0.5,
              ease: "power2.out",
            });
          },
        });
      } else {
        targetCard.classList.remove("active");
        gsap.to(answerSymbol, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            gsap.set(answerSymbol, { display: "none" });
            gsap.set(questionSymbol, { display: "inline" });
            gsap.to(questionSymbol, { opacity: 1, duration: 0.3 });
          },
        });

        gsap.to(answerText, {
          opacity: 0,
          height: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(answerText, { display: "none" });
            gsap.set(questionText, { display: "inline" });
            gsap.to(questionText, { opacity: 1, duration: 0.3 });
          },
        });
      }
    }
  });
});

// Accordion Swiper Script
const faqswiper = new Swiper('[swiper="accordion"]', {
  slidesPerView: 1.05,
  spaceBetween: 16,
  breakpoints: {
    768: {
      slidesPerView: 2.1,
    },
    1200: {
      slidesPerView: 3.7,
    },
  },

  // Navigation arrows
  navigation: {
    nextEl: '[swiper-next="accordion"]',
    prevEl: '[swiper-prev="accordion"]',
  },
});
