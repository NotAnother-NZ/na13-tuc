// ***********************

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded - initializing swipers");

  const swiperWrappers = document.querySelectorAll('[team="wrapper"]');
  console.log(`Found ${swiperWrappers.length} swiper wrappers`);

  const swiperInstances = new Map();
  function isMobile() {
    const isMobileView = window.innerWidth < 768;
    console.log(
      `Device check: ${isMobileView ? "Mobile" : "Desktop"} view (${
        window.innerWidth
      }px)`
    );
    return isMobileView;
  }

  function initializeSwiper(wrapper) {
    try {
      console.log("Initializing swiper for wrapper:", wrapper);
      const swiperElement = wrapper.querySelector('div[swiper="team"].swiper');

      if (!swiperElement) {
        console.error("Could not find swiper element in wrapper:", wrapper);
        return;
      }

      swiperElement.classList.remove("no-teamswiper");
      console.log("Removed no-teamswiper class");

      const nextButton = wrapper.querySelector("[swiper-next]");
      const prevButton = wrapper.querySelector("[swiper-prev]");
      console.log("Navigation buttons found:", {
        nextButton: !!nextButton,
        prevButton: !!prevButton,
      });

      if (swiperInstances.has(swiperElement)) {
        console.log("Destroying existing swiper instance");
        try {
          swiperInstances.get(swiperElement).destroy();
        } catch (destroyError) {
          console.error("Error destroying swiper:", destroyError);
        }
      }

      // Create new swiper instance
      console.log("Creating new Swiper instance");
      const swiperInstance = new Swiper(swiperElement, {
        slidesPerView: 1,
        spaceBetween: 30,
        // loop: true,
        pagination: {
          el: wrapper.querySelector(".swiper-pagination") || undefined,
          clickable: true,
        },
        navigation: {
          nextEl: nextButton || undefined,
          prevEl: prevButton || undefined,
        },
      });

      // Store the swiper instance
      swiperInstances.set(swiperElement, swiperInstance);
      console.log("Swiper instance created and stored");

      // Check for pagination next button and set up click listener
      const paginationNext = wrapper.querySelector(".w-pagination-next");
      console.log("Pagination next button found:", !!paginationNext);

      if (paginationNext) {
        console.log("Setting up click listener for pagination button");
        paginationNext.addEventListener("click", function () {
          console.log("Pagination next button clicked");

          // Check if the button is visible
          const computedStyle = window.getComputedStyle(paginationNext);
          const isVisible = computedStyle.display !== "none";
          console.log(
            `Pagination button visibility: ${
              isVisible ? "visible" : "hidden"
            }, display: ${computedStyle.display}`
          );

          if (isVisible) {
            console.log("Button is visible, will reinitialize swiper");
            setTimeout(() => {
              try {
                // Reinitialize this specific swiper
                console.log("Reinitializing swiper after pagination click");
                initializeSwiper(wrapper);
                console.log("Swiper reinitialized successfully");
              } catch (reinitError) {
                console.error("Error reinitializing swiper:", reinitError);
              }
            }, 300);
          }
        });
      }
    } catch (error) {
      console.error("Error initializing swiper:", error);
    }
  }

  // Function to initialize all swipers
  function initializeSwipers() {
    try {
      console.log("Initializing all swipers");
      if (isMobile()) {
        console.log("Mobile view detected - initializing swipers");
        // Mobile view - initialize swipers
        swiperWrappers.forEach(function (wrapper, index) {
          console.log(
            `Initializing swiper ${index + 1}/${swiperWrappers.length}`
          );
          initializeSwiper(wrapper);
        });
      } else {
        console.log("Desktop view detected - adding no-teamswiper class");
        // Desktop view - add no-teamswiper class to all swipers
        const swiperElements = document.querySelectorAll(
          'div[team="swiper"].swiper'
        );
        console.log(
          `Found ${swiperElements.length} swiper elements to disable`
        );

        swiperElements.forEach(function (swiperElement, index) {
          console.log(
            `Processing desktop swiper ${index + 1}/${swiperElements.length}`
          );
          swiperElement.classList.add("no-teamswiper");

          // Destroy swiper instance if it exists
          if (swiperInstances.has(swiperElement)) {
            console.log("Destroying swiper instance for desktop view");
            try {
              swiperInstances.get(swiperElement).destroy();
              swiperInstances.delete(swiperElement);
            } catch (destroyError) {
              console.error(
                "Error destroying swiper on desktop resize:",
                destroyError
              );
            }
          }
        });
      }
      console.log("Swiper initialization complete");
    } catch (error) {
      console.error("Error in initializeSwipers function:", error);
    }
  }

  // Initialize on page load
  console.log("Starting initial swiper setup");
  initializeSwipers();

  // Re-initialize on window resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    console.log("Window resize detected");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      console.log("Resize debounce complete, reinitializing swipers");
      initializeSwipers();
    }, 250); // Debounce to prevent multiple calls
  });

  console.log("Swiper setup complete");
});

// ***************//
