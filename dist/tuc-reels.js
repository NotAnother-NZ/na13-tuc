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
      slidesPerView: 4,
    },
  },
  // Navigation arrows
  navigation: {
    nextEl: '[swiper-next="reelspci"]',
    prevEl: '[swiper-prev="reelspci"]',
  },
});
