// History Swiper Script
const historyswiper = new Swiper('[swiper="history"]', {
  slidesPerView: 1.1,
  spaceBetween: 16,
  breakpoints: {
    768: {
      slidesPerView: 2.2,
    },
    1200: {
      slidesPerView: 3.7,
    },
  },
  navigation: {
    nextEl: '[swiper-next="history"]',
    prevEl: '[swiper-prev="history"]',
  },
});

const mediaswiper = new Swiper('[swiper="media"]', {
  slidesPerView: 1.1,
  spaceBetween: 16,
  // initialSlide: 1,
  breakpoints: {
    768: {
      slidesPerView: 2.1,
    },
    1200: {
      slidesPerView: 3.1,
    },
  },

  navigation: {
    nextEl: '[swiper-next="media"]',
    prevEl: '[swiper-prev="media"]',
  },
});

const sectionDivs = document.querySelectorAll('[section="campaigns"]');

sectionDivs.forEach((sectionDiv, index) => {
  const contentDiv = sectionDiv.querySelector('[campaigns="content"]');

  if (contentDiv) {
    const sectionRect = sectionDiv.getBoundingClientRect();
    const contentRect = contentDiv.getBoundingClientRect();
    console.log(contentRect);

    const contentHeight = contentRect.height;
    console.log(contentHeight);
    const viewportHeight = window.innerHeight;
    const halfViewport = viewportHeight * 0.5;
    const topSpacing = halfViewport - contentHeight / 2;
    console.log(`Awerty ${halfViewport}px `);
    contentDiv.style.top = `${topSpacing}px`;
    console.log(
      `Applied top spacing of ${topSpacing}px to content div ${index + 1}`
    );
  }
});
