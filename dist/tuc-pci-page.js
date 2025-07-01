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

const pciaRow = document.querySelector('[pcianchor="row"]');
const pciAnchor = pciaRow.querySelectorAll("a");
console.log(pciAnchor);
let maxWidth = 0;

// First, get the maximum height
pciAnchor.forEach((link) => {
  const width = link.offsetWidth;
  console.log(width);
  if (width > maxWidth) {
    maxWidth = width;
  }
});

// Then, apply the maximum height to all <a> tags
pciAnchor.forEach((link) => {
  link.style.width = `${maxWidth}px`;
});

// contributors Swiper Script
const contributorsswiper = new Swiper('[swiper="reels"]', {
  slidesPerView: 1.1,
  spaceBetween: 16,
  // initialSlide: 1,
  breakpoints: {
    768: {
      slidesPerView: 2.1,
    },
    1200: {
      slidesPerView: 4.1,
    },
  },
  // Navigation arrows
  navigation: {
    nextEl: '[swiper-next="reelspci"]',
    prevEl: '[swiper-prev="reelspci"]',
  },
});

if (window.innerWidth > 991) {
  document.querySelectorAll('[fnr="list"]').forEach((list) => {
    const items = list.querySelectorAll('[fnr="item"]');
    const count = items.length;
    if (count === 2) {
      list.classList.add("fnr-item-2");
    } else if (count > 2) {
      list.classList.add("fnr-item-3");
    }
    // If count is 1, do nothing
  });
}
