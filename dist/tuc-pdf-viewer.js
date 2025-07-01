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

// The PDF.js library must be configured with a worker source
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const pdfUrl =
  "https://cdn.prod.website-files.com/67ecc7b6605e3f438ccb1894/68131cd62572c06542b3728f_21583473018.pdf"; // Your PDF URL
const pagesContainer = document.getElementById("pagesContainer");
const pageInfo = document.getElementById("pageInfo");
const prevBtn = document.querySelector("[pdfprev]");
const nextBtn = document.querySelector("[pdfnext]");

let pdfDoc = null;
let currentPagePair = 1; // Starting with pages 1 and 2
let totalPages = 0;
const scale = 1.0; // Adjust scale if needed

// Load and render the PDF
async function loadPdf() {
  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages;

    // Update page info
    updatePageInfo();

    // Initial render
    await renderPagePair(currentPagePair);

    // Set button states
    updateButtonStates();
  } catch (error) {
    console.error("Error loading PDF:", error);
    pagesContainer.innerHTML = `<p>Error loading PDF: ${error.message}</p>`;
  }
}

// Render a pair of pages (left and right)
async function renderPagePair(startPage) {
  // Clear previous pages
  pagesContainer.innerHTML = "";

  // Create and render left page
  if (startPage <= totalPages) {
    const leftCanvas = document.createElement("canvas");
    leftCanvas.className = "page-canvas";
    pagesContainer.appendChild(leftCanvas);
    await renderPage(startPage, leftCanvas);
  }

  // Create and render right page
  if (startPage + 1 <= totalPages) {
    const rightCanvas = document.createElement("canvas");
    rightCanvas.className = "page-canvas";
    pagesContainer.appendChild(rightCanvas);
    await renderPage(startPage + 1, rightCanvas);
  }
}

// Render a single page onto a canvas
async function renderPage(pageNumber, canvas) {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  // Set canvas dimensions
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: canvas.getContext("2d"),
    viewport,
  };

  await page.render(renderContext).promise;
}

// Update page info text
function updatePageInfo() {
  const endPage = Math.min(currentPagePair + 1, totalPages);
  pageInfo.textContent = `Page ${currentPagePair}-${endPage} of ${totalPages}`;
}

// Update button states based on current position
function updateButtonStates() {
  prevBtn.disabled = currentPagePair <= 1;
  nextBtn.disabled = currentPagePair + 1 >= totalPages;

  // Add visual feedback for disabled state
  if (prevBtn.disabled) {
    prevBtn.classList.add("disabled");
  } else {
    prevBtn.classList.remove("disabled");
  }

  if (nextBtn.disabled) {
    nextBtn.classList.add("disabled");
  } else {
    nextBtn.classList.remove("disabled");
  }
}

// Go to previous page pair
async function goToPrevious() {
  if (currentPagePair > 1) {
    currentPagePair -= 2;
    await renderPagePair(currentPagePair);
    updatePageInfo();
    updateButtonStates();
  }
}

// Go to next page pair
async function goToNext() {
  if (currentPagePair + 1 < totalPages) {
    currentPagePair += 2;
    await renderPagePair(currentPagePair);
    updatePageInfo();
    updateButtonStates();
  }
}

// Add event listeners
prevBtn.addEventListener("click", goToPrevious);
nextBtn.addEventListener("click", goToNext);

// Load the PDF when the page loads
window.addEventListener("DOMContentLoaded", loadPdf);

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
