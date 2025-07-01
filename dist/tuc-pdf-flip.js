/**
 * PDF Flipbook - A modular solution for creating page-flip PDF viewers
 * Automatically initializes on all elements with data-dt-pdf-flip="wrapper"
 * Gets PDF URL from data-dt-pdf-flip-url attribute
 * Gets dimensions from data-dt-pdf-flip-width and data-dt-pdf-flip-height attributes
 *
 * Required libraries:
 * - PDF.js (https://cdn.jsdelivr.net/npm/pdfjs-dist)
 * - StPageFlip (https://cdn.jsdelivr.net/gh/NotAnother-NZ/na13-tuc@main/lib/page-flip.browser.js)
 *
 * @author Druhin13
 * @version 1.5.1
 * @date 2025-06-05
 */

// Make sure required libraries are loaded
(function () {
  // Check if PDF.js is loaded
  if (typeof pdfjsLib === "undefined") {
    console.error(
      "PDF.js library is required but not loaded. Please include PDF.js in your project."
    );
    return;
  }

  // Check if StPageFlip is loaded
  if (typeof St === "undefined") {
    console.error(
      "StPageFlip library is required but not loaded. Please include StPageFlip in your project."
    );
    return;
  }

  // Set PDF.js worker if not already set
  if (
    pdfjsLib.GlobalWorkerOptions.workerSrc === null ||
    pdfjsLib.GlobalWorkerOptions.workerSrc === ""
  ) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
  }

  // PDFFlipbook class definition
  class PDFFlipbook {
    /**
     * Create a new PDFFlipbook instance
     * @param {Object} options - Configuration options
     * @param {string} options.pdfUrl - URL to the PDF file (required)
     * @param {HTMLElement} options.container - Container element for the flipbook
     * @param {HTMLElement} options.prevButton - Previous button element
     * @param {HTMLElement} options.nextButton - Next button element
     * @param {number} options.pageWidth - Width of each page in pixels
     * @param {number} options.pageHeight - Height of each page in pixels
     * @param {number} options.totalWidth - Total width of the flipbook
     */
    constructor(options) {
      this.options = {
        pdfUrl: null,
        container: null,
        prevButton: null,
        nextButton: null,
        ...options,
      };

      this.book = null;
      this.userHasInteracted = false;
      this.nudgeTimeout = null;
      this.init();
    }

    /**
     * Create a placeholder page with the specified background color.
     * @returns {HTMLElement} The placeholder page element.
     */
    createPlaceholderPage() {
      const placeholder = document.createElement("div");
      placeholder.className = "page placeholder-page";
      placeholder.style.backgroundColor = "#778f99";
      placeholder.style.width = "100%";
      placeholder.style.height = "100%";
      return placeholder;
    }

    /**
     * Create pulsing hint overlay.
     */
    createNudgeHint() {
      const nudgeHint = document.createElement("div");
      nudgeHint.className = "flipbook-nudge-hint";
      nudgeHint.innerHTML = `
        <div class="nudge-content">
          <div class="nudge-text">Click to turn the pages</div>
        </div>
      `;
      this.options.container.appendChild(nudgeHint);
      return nudgeHint;
    }

    /**
     * Show nudge hint after delay if no interaction.
     */
    startNudgeTimer() {
      this.nudgeTimeout = setTimeout(() => {
        if (!this.userHasInteracted) {
          const nudgeHint = this.options.container.querySelector(
            ".flipbook-nudge-hint"
          );
          if (nudgeHint) {
            nudgeHint.classList.add("show");
          }
        }
      }, 2000);
    }

    /**
     * Hide nudge hint when user interacts.
     */
    hideNudge() {
      this.userHasInteracted = true;
      if (this.nudgeTimeout) {
        clearTimeout(this.nudgeTimeout);
      }
      const nudgeHint = this.options.container.querySelector(
        ".flipbook-nudge-hint"
      );
      if (nudgeHint) {
        nudgeHint.classList.remove("show");
        setTimeout(() => nudgeHint.remove(), 500);
      }
    }

    /**
     * Initialize the PDF flipbook.
     */
    async init() {
      if (!this.options.pdfUrl) {
        console.error("PDFFlipbook: No PDF URL provided");
        return;
      }
      if (!this.options.container) {
        console.error("PDFFlipbook: No container element provided");
        return;
      }

      this.options.container.style.width = `${this.options.totalWidth}px`;
      this.options.container.style.height = `${this.options.pageHeight}px`;
      this.options.container.style.backgroundColor = "#778f99";

      this.options.container.innerHTML =
        '<div class="loading">Loading PDF, please wait...</div>';

      this.pagesContainer = document.createElement("div");
      this.pagesContainer.style.display = "none";
      this.pagesContainer.id =
        "pdf-pages-container-" + Math.random().toString(36).substring(2, 9);
      this.pagesContainer.className = "pdf-pages-container";
      document.body.appendChild(this.pagesContainer);

      try {
        await this.loadPdf();
      } catch (error) {
        console.error("PDFFlipbook: Error loading PDF", error);
        this.options.container.innerHTML = `<div class="loading">Error loading PDF: ${error.message}</div>`;
      }
    }

    /**
     * Load PDF, convert to images and arrange with placeholders.
     */
    async loadPdf() {
      const response = await fetch(this.options.pdfUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = pdf.numPages;

      this.options.container.innerHTML = "";
      this.pagesContainer.innerHTML = "";

      const pdfPageElements = [];
      for (let i = 1; i <= numPages; i++) {
        const pdfPage = await pdf.getPage(i);
        const viewport = pdfPage.getViewport({ scale: 1.0 });
        const scale = this.options.pageWidth / viewport.width;
        const scaledViewport = pdfPage.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        await pdfPage.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise;
        const imgData = canvas.toDataURL("image/png");
        const pageDiv = document.createElement("div");
        pageDiv.className = "page";
        const img = document.createElement("img");
        img.src = imgData;
        img.alt = `Page ${i}`;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        pageDiv.appendChild(img);
        pdfPageElements.push(pageDiv);
      }

      if (numPages === 0) {
        this.pagesContainer.appendChild(this.createPlaceholderPage());
        this.pagesContainer.appendChild(this.createPlaceholderPage());
      } else if (numPages === 1) {
        this.pagesContainer.appendChild(pdfPageElements[0]);
        this.pagesContainer.appendChild(this.createPlaceholderPage());
      } else {
        this.pagesContainer.appendChild(pdfPageElements[0]);
        this.pagesContainer.appendChild(this.createPlaceholderPage());
        for (let i = 1; i < numPages - 1; i++) {
          this.pagesContainer.appendChild(pdfPageElements[i]);
        }
        this.pagesContainer.appendChild(this.createPlaceholderPage());
        this.pagesContainer.appendChild(pdfPageElements[numPages - 1]);
      }

      this.initPageFlip();
    }

    /**
     * Initialize the StPageFlip instance.
     */
    initPageFlip() {
      this.book = new St.PageFlip(this.options.container, {
        width: this.options.pageWidth,
        height: this.options.pageHeight,
        size: "fixed",
        minWidth: this.options.pageWidth / 2,
        maxWidth: this.options.pageWidth * 2,
        minHeight: this.options.pageHeight / 2,
        maxHeight: this.options.pageHeight * 2,
        maxShadowOpacity: 0.5,
        showCover: false,
        flippingTime: 700,
        usePortrait: false,
        startPage: 0,
        drawShadow: true,
        autoSize: false,
        startZIndex: 0,
        mobileScrollSupport: true,
      });

      this.book.loadFromHTML(
        document.querySelectorAll(`#${this.pagesContainer.id} > .page`)
      );

      // Create and position the nudge hint
      this.createNudgeHint();

      // Interactivity listeners
      this.options.container.addEventListener("click", () => this.hideNudge());
      this.options.container.addEventListener("mouseenter", () =>
        this.options.container.classList.add("flipbook-hover")
      );
      this.options.container.addEventListener("mouseleave", () =>
        this.options.container.classList.remove("flipbook-hover")
      );

      if (this.options.prevButton) {
        this.options.prevButton.addEventListener("click", (e) => {
          e.preventDefault();
          this.hideNudge();
          this.book.flipPrev();
        });
      }
      if (this.options.nextButton) {
        this.options.nextButton.addEventListener("click", (e) => {
          e.preventDefault();
          this.hideNudge();
          this.book.flipNext();
        });
      }
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          this.hideNudge();
          this.book.flipPrev();
        }
        if (e.key === "ArrowRight") {
          this.hideNudge();
          this.book.flipNext();
        }
      });

      this.startNudgeTimer();
    }
  }

  // Auto-initialize all flipbooks on the page
  function initAllFlipbooks() {
    const wrappers = document.querySelectorAll('[data-dt-pdf-flip="wrapper"]');
    wrappers.forEach((wrapper) => {
      const pdfUrl = wrapper.getAttribute("data-dt-pdf-flip-url");
      if (!pdfUrl) {
        console.error(
          "PDFFlipbook: Missing PDF URL attribute on wrapper",
          wrapper
        );
        return;
      }
      const totalWidth = parseInt(
        wrapper.getAttribute("data-dt-pdf-flip-width"),
        10
      );
      const pageHeight = parseInt(
        wrapper.getAttribute("data-dt-pdf-flip-height"),
        10
      );
      if (
        isNaN(totalWidth) ||
        isNaN(pageHeight) ||
        totalWidth <= 0 ||
        pageHeight <= 0
      ) {
        console.error(
          "PDFFlipbook: Invalid or missing dimensions. Please set data-dt-pdf-flip-width and data-dt-pdf-flip-height attributes."
        );
        return;
      }
      const pageWidth = Math.floor(totalWidth / 2);
      const prevButton = document.querySelector(
        '[data-dt-pdf-flip="left"], [data-dt-pdf-flip="prev"]'
      );
      const nextButton = document.querySelector(
        '[data-dt-pdf-flip="right"], [data-dt-pdf-flip="next"]'
      );
      new PDFFlipbook({
        pdfUrl,
        container: wrapper,
        prevButton,
        nextButton,
        pageWidth,
        pageHeight,
        totalWidth,
      });
    });
  }

  // Auto-initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllFlipbooks);
  } else {
    initAllFlipbooks();
  }

  // Make PDFFlipbook available globally
  window.PDFFlipbook = PDFFlipbook;
})();

// Add styles with updated nudge position
const style = document.createElement("style");
style.textContent = `
  /* Styles for PDF flipbook */
  [data-dt-pdf-flip="wrapper"] {
    background-color: #778f99;
    position: relative;
    margin: 0 auto;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  /* Hover effect to indicate interactivity */
  [data-dt-pdf-flip="wrapper"].flipbook-hover {
    transform: scale(1.02);
  }
  
  .page {
    background-color: white;
    overflow: hidden;
  }

  .placeholder-page {
    background-color: #778f99;
  }
  
  .loading {
    text-align: center;
    padding: 20px;
    font-size: 18px;
    color: #333;
  }

  /* Pulsing hint overlay, now centered on right-hand page */
  .flipbook-nudge-hint {
    position: absolute;
    top: 50%;
    left: 75%; /* move to middle of right page */
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .flipbook-nudge-hint.show {
    opacity: 1;
    animation: nudgePulse 2s infinite;
  }

  .nudge-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nudge-text {
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  /* Pulsing animation */
  @keyframes nudgePulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
  }

  /* Hide StPageFlip shadows if needed */
  .stf__shadow {
    background: none !important;
  }
  
  /* Button hover opacity */
  [data-dt-pdf-flip="left"]:hover,
  [data-dt-pdf-flip="right"]:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
document.head.appendChild(style);
