// Theme chnage on scroll for navbar
// Function to determine which section is most visible in the viewport
// Get all sections with 'section' attribute
const sections = document.querySelectorAll("section[sectheme]");

// Function to update navtheme based on scroll position
function updateNavTheme() {
  const scrollPosition = window.scrollY;

  // Find the current section
  for (const section of sections) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    // If the scroll position is at or past the section's top edge
    // and before the bottom edge of the section
    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      const sectionType = section.getAttribute("sectheme");

      // Only update if the theme actually changes
      if (document.body.getAttribute("navtheme") !== sectionType) {
        document.body.setAttribute("navtheme", sectionType);
        console.log(`Updated navtheme to: ${sectionType}`);
      }

      break; // Exit loop after finding the current section
    }
  }
}

// Initialize the navtheme on page load
document.addEventListener("DOMContentLoaded", updateNavTheme);

// Update navtheme on scroll
window.addEventListener("scroll", updateNavTheme);

const footerWrap = document.querySelector("[footer]");
const mainNavbar = document.querySelector("[mainnavbar]");

// Define separate start values
const isMobile = window.innerWidth <= 768; // adjust this breakpoint if needed
const startValue = isMobile ? "top 99%" : "top 50%";

ScrollTrigger.create({
  trigger: footerWrap,
  start: startValue,
  //markers: true,
  onEnter: () =>
    gsap.to(mainNavbar, { y: "-100%", duration: 0.4, ease: "power2.out" }),
  onLeaveBack: () =>
    gsap.to(mainNavbar, { y: "0%", duration: 0.4, ease: "power2.out" }),
});
