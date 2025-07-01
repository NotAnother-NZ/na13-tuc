// contributors Swiper Script
const contributorsswiper = new Swiper('[swiper="contributors"]', {
  slidesPerView: 1.1,
  spaceBetween: 16,
  // initialSlide: 1,
  breakpoints: {
    768: {
      slidesPerView: 2.1,
    },
    1024: {
      slidesPerView: 4.1,
    },
  },
  // Navigation arrows
  navigation: {
    nextEl: '[swiper-next="contributors"]',
    prevEl: '[swiper-prev="contributors"]',
  },
});
