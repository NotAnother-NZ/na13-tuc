// News Swiper Script
const newsswiper = new Swiper('[swiper="news"]', {
  slidesPerView: 1.1,
  spaceBetween: 16,
  breakpoints: {
    768: {
      slidesPerView: 2.48,
    },
  },
  // Navigation arrows
  navigation: {
    nextEl: '[swiper-next="news"]',
    prevEl: '[swiper-prev="news"]',
  },
});

// partnerships Swiper Script
const partnershipsswiper = new Swiper('[swiper="partnerships"]', {
  slidesPerView: 1.1,
  spaceBetween: 16,
  //initialSlide: 1,
  breakpoints: {
    768: {
      slidesPerView: 2.1,
    },
    1200: {
      slidesPerView: 3,
    },
  },

  // Navigation arrows
  navigation: {
    nextEl: '[swiper-next="partnerships"]',
    prevEl: '[swiper-prev="partnerships"]',
  },
});

if (window.innerWidth <= 768) {
  // Mobile values
  gsap.set("[gallerycard='1']", { y: -200 });
  gsap.set("[gallerycard='2']", { y: -160 });
  gsap.set("[gallerycard='3']", { y: -40 });
  gsap.set("[gallerycard='4']", { y: 150 });
  gsap.set("[gallerycard='5']", { y: 180 });
  gsap.set("[gallerycard='6']", { y: 60 });
  gsap.set("[gallerycard='7']", { y: 100 });
} else {
  // Desktop values
  gsap.set("[gallerycard='1']", { y: -200 });
  gsap.set("[gallerycard='2']", { y: -130 });
  gsap.set("[gallerycard='3']", { y: -75 });
  gsap.set("[gallerycard='4']", { y: 40 });
  gsap.set("[gallerycard='5']", { y: 150 });
  gsap.set("[gallerycard='6']", { y: 110 });
  gsap.set("[gallerycard='7']", { y: 80 });
}

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll("[data-speed],[gallerycard]").forEach((el) => {
  const speed = parseFloat(el.getAttribute("data-speed"));

  gsap.to(el, {
    y: 0,
    ease: "none",
    duration: speed,

    scrollTrigger: {
      trigger: ".gallery-grid",
      start: "top bottom", // when element enters the viewport
      end: "bottom top+=40%", // until element leaves the viewport
      scrub: true,
      // markers: true,
    },
  });
});

gsap.registerPlugin(SplitText);

var tl = gsap.timeline(),
  mySplitText = new SplitText("[breaktext]", {
    types: "lines, words, chars",
    tagName: "span",
    wordsClass: "word",
  }),
  chars = mySplitText.chars;

gsap.set("[hhero='title']", {
  opacity: 1,
});
gsap.from("[breaktext] .word", {
  opacity: 0,
  duration: 0.5,
  ease: "power1.out",
  stagger: 0.1,
});

// Js for cta images

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".drive-card");
  let lastClickedCard = null;
  cards.forEach((card) => {
    card.addEventListener("mouseover", function () {
      if (lastClickedCard) {
        lastClickedCard.style.zIndex = "";
      }
      this.style.zIndex = "5";
      lastClickedCard = this;
    });
  });
});
