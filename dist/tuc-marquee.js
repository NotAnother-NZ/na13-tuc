// When the document is loadeder
$(document).ready(function () {
  // If .marquee-wrapper is present
  if ($("[marquee-wrapper]").length) {
    console.log("marquee is present");

    // Get all marquee elements
    const marquees = document.querySelectorAll('[data-marquee="true"]');

    marquees.forEach((list, index) => {
      // Set default speed to 15 seconds
      const speed = list.getAttribute("data-marquee-speed") || 15;
      const direction = list.getAttribute("data-marquee-direction") || "left";

      list.setAttribute("data-marquee", index); // Set marquee index

      // Calculate the number of clones needed based on the width of the list and its parent
      const listWidth = list.scrollWidth;
      const parentWidth = list.parentNode.clientWidth;
      const clonesNeeded = Math.ceil(parentWidth / listWidth) + 1;

      console.log(
        `Number of clones created for marquee ${index}: ${clonesNeeded}`
      );

      // Create the necessary clones
      for (let i = 0; i < clonesNeeded; i++) {
        const clone = list.cloneNode(true); // Clone list
        clone.setAttribute("data-marquee", index); // Set marquee index
        clone.removeAttribute("id"); // Avoid duplicate id
        list.parentNode.appendChild(clone); // Append clone after list
      }

      // Adjust keyframes and CSS for direction
      const keyframes =
        direction === "left"
          ? `@keyframes marquee${index} {
                   0% { transform: translateX(0); }
                   100% { transform: translateX(-${100 * clonesNeeded}%); }
                 }`
          : `@keyframes marquee${index} {
                   0% { transform: translateX(-${100 * clonesNeeded}%); }
                   100% { transform: translateX(0); }
                 }`;

      // Create style tag with a CSS animation for this marquee
      const style = document.createElement("style");
      style.innerHTML = `
            ${keyframes}
            [data-marquee="${index}"] {
              animation: marquee${index} ${
        speed * clonesNeeded
      }s linear infinite;
            }
          `;
      document.head.appendChild(style);

      // Adjust the clone's initial position for the right direction
      if (direction === "right") {
        list.style.transform = `translateX(-${100 * clonesNeeded}%)`;
      }
    });
  }
});
