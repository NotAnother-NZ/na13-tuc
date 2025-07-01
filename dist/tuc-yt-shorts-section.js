document.addEventListener("DOMContentLoaded", function () {
  // Check if Plyr is loaded, if not, load it immediately
  if (typeof Plyr === "undefined") {
    // Load Plyr CSS
    const plyrCss = document.createElement("link");
    plyrCss.rel = "stylesheet";
    plyrCss.href = "https://cdn.plyr.io/3.7.8/plyr.css";
    document.head.appendChild(plyrCss);

    // Load Plyr JS
    const plyrScript = document.createElement("script");
    plyrScript.src = "https://cdn.plyr.io/3.7.8/plyr.polyfilled.js";
    plyrScript.async = false; // Load synchronously for faster availability
    document.head.appendChild(plyrScript);
  }

  const regex =
    /(?:youtu(?:\.be\/|be\.com\/(?:shorts\/|watch\?v=|embed\/)))([A-Za-z0-9_-]{11})/;

  // Function to try loading different quality thumbnails
  const loadHighQualityThumbnail = (imgElement, videoId) => {
    // Try maxresdefault first (highest quality)
    const testHighQuality = new Image();
    testHighQuality.onload = function () {
      // If dimensions are good (not the default error image)
      if (this.width > 120) {
        imgElement.style.backgroundImage = `url(https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg)`;
      } else {
        // Fallback to hqdefault (still good quality)
        imgElement.style.backgroundImage = `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`;
      }
    };
    testHighQuality.onerror = function () {
      // Fallback to hqdefault on error
      imgElement.style.backgroundImage = `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`;
    };
    testHighQuality.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const initializePlyr = function () {
    return typeof Plyr !== "undefined";
  };

  // Select elements with either attribute pattern
  const items = Array.from(
    document.querySelectorAll(
      "div[data-dt-yt-video][data-dt-yt-autoplayonhover='true'], div[data-dt-yt-video][data-dt-yt-autoplayonload='true']"
    )
  )
    .map((div, i) => {
      const url = div.getAttribute("data-dt-yt-video");
      const m = url && url.match(regex);
      if (!m) return null;
      const id = m[1];

      // Check for autoplay attributes with correct case sensitivity
      const autoplayOnLoad =
        div.getAttribute("data-dt-yt-autoplayonload") === "true";
      const autoplayOnHover =
        div.getAttribute("data-dt-yt-autoplayonhover") === "true";

      div.innerHTML = "";
      div.classList.add("shorts-player-wrapper");
      Object.assign(div.style, {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
      });

      // Create a thumbnail holder with higher quality image
      const thumbnailHolder = document.createElement("div");
      thumbnailHolder.className = "shorts-thumbnail";
      Object.assign(thumbnailHolder.style, {
        position: "absolute",
        top: "-2.5%",
        left: "-2.5%",
        width: "105%",
        height: "105%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: "2", // Above the iframe
        transition: "opacity 0.2s ease",
      });

      // Try to load highest quality thumbnail available
      loadHighQualityThumbnail(thumbnailHolder, id);
      div.appendChild(thumbnailHolder);

      // Create iframe for muted autoplay
      const iframe = document.createElement("iframe");
      iframe.id = `yt-player-${i}`;

      // Set up iframe with autoplay disabled initially
      const iframeSrc = `https://www.youtube-nocookie.com/embed/${id}?controls=0&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&disablekb=1&playsinline=1&loop=1&playlist=${id}&enablejsapi=1&origin=${encodeURIComponent(
        location.origin
      )}&color=white&fs=0&cc_load_policy=0&mute=1`;

      Object.assign(iframe, {
        width: "100%",
        height: "100%",
        allow: "autoplay; fullscreen; picture-in-picture",
        src: iframeSrc,
      });

      Object.assign(iframe.style, {
        border: "none",
        position: "absolute",
        width: "125%",
        height: "125%",
        top: "-12.5%",
        left: "-12.5%",
        zIndex: "1", // Below thumbnail
        pointerEvents: "none",
      });

      div.appendChild(iframe);

      // Create container for Plyr player and pre-initialize it for autoplayOnLoad videos
      const plyrContainer = document.createElement("div");
      plyrContainer.className = "plyr-container";
      plyrContainer.style.display = "none";
      plyrContainer.style.position = "absolute";
      plyrContainer.style.top = "0";
      plyrContainer.style.left = "0";
      plyrContainer.style.width = "100%";
      plyrContainer.style.height = "100%";
      plyrContainer.style.zIndex = "3"; // Above everything

      // Pre-create the Plyr HTML structure for autoplayOnLoad videos
      if (autoplayOnLoad) {
        plyrContainer.innerHTML = `
            <div class="plyr__video-embed" id="plyr-player-${i}">
              <iframe
                src="https://www.youtube-nocookie.com/embed/${id}?origin=${encodeURIComponent(
          location.origin
        )}&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1&amp;autoplay=0&amp;preload=auto"
                allowfullscreen
                allowtransparency
                allow="autoplay"
              ></iframe>
            </div>
          `;
      }

      div.appendChild(plyrContainer);

      // Create a play button for autoplayOnLoad videos
      let playButton = null;
      if (autoplayOnLoad) {
        playButton = document.createElement("button");
        playButton.className = "shorts-play-button";
        playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>`;

        Object.assign(playButton.style, {
          position: "absolute",
          zIndex: "4", // Above all
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.7)",
          border: "none",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s ease, transform 0.2s ease",
          padding: "12px",
        });

        div.appendChild(playButton);
      }

      return {
        div,
        id,
        player: null,
        plyrPlayer: null,
        ready: false,
        plyrReady: false,
        thumbnailHolder,
        iframe,
        plyrContainer,
        playButton,
        autoplayOnLoad,
        autoplayOnHover,
        isUnmuted: false,
        isPlaying: false,
      };
    })
    .filter((x) => x);

  // Pre-initialize Plyr for all autoplayOnLoad videos
  function initializePlyrForAll() {
    if (!initializePlyr()) {
      setTimeout(initializePlyrForAll, 100);
      return;
    }

    items.forEach((item) => {
      if (item.autoplayOnLoad && !item.plyrReady) {
        try {
          item.plyrPlayer = new Plyr(`#plyr-player-${items.indexOf(item)}`, {
            controls: ["play", "progress", "current-time", "mute", "volume"],
            clickToPlay: true,
            resetOnEnd: true,
            youtube: {
              noCookie: true,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              modestbranding: 1,
            },
          });

          // Handle video end
          item.plyrPlayer.on("ended", function () {
            // Hide Plyr
            item.plyrContainer.style.display = "none";

            // Show play button again
            if (item.playButton) {
              item.playButton.style.display = "flex";
            }

            // Restore muted background player
            item.iframe.style.zIndex = "1";
            if (item.player && typeof item.player.seekTo === "function") {
              item.player.seekTo(0, true);
              item.player.playVideo();
            }
          });

          item.plyrReady = true;
        } catch (e) {
          console.warn("Error pre-initializing Plyr:", e);
        }
      }
    });
  }

  // Start initializing Plyr as soon as possible
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(initializePlyrForAll, 500); // Short delay to ensure Plyr is loaded
  } else {
    window.addEventListener("DOMContentLoaded", function () {
      setTimeout(initializePlyrForAll, 500);
    });
  }

  let active;
  function onAPIReady() {
    items.forEach((item, i) => {
      // Initialize player immediately
      item.player = new YT.Player(`yt-player-${i}`, {
        events: {
          onReady(e) {
            item.ready = true;
            e.target.mute();

            // If autoplayOnLoad is true, start playing immediately
            if (item.autoplayOnLoad) {
              console.log("Autoplaying video on load:", item.id);
              item.thumbnailHolder.style.opacity = "0";
              e.target.playVideo();
            } else {
              // Otherwise just cue the video
              e.target.cueVideoById({
                videoId: item.id,
                startSeconds: 0,
              });
            }
          },
          onStateChange(e) {
            // If video ends while in unmuted mode, reset to muted autoplay
            if (e.data === YT.PlayerState.ENDED && item.isUnmuted) {
              e.target.mute();
              e.target.seekTo(0, true);
              e.target.playVideo();
              item.isUnmuted = false;

              // Reset to autoplay state
              if (item.autoplayOnLoad) {
                // Hide Plyr player if it exists
                if (item.plyrContainer) {
                  item.plyrContainer.style.display = "none";

                  // Show play button again
                  if (item.playButton) {
                    item.playButton.style.display = "flex";
                  }
                }

                // Show background player
                item.thumbnailHolder.style.opacity = "0";
                item.iframe.style.zIndex = "1";
              }
            }
            // If video ends in muted mode, just loop
            else if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(0, true);
              e.target.playVideo();
            }
          },
        },
      });

      const parent = item.div.parentElement || item.div;

      // Set up hover events for autoplayOnHover videos
      if (item.autoplayOnHover && !item.autoplayOnLoad) {
        parent.addEventListener("mouseenter", () => {
          if (!item.ready || !item.player) return;

          // Stop any other visible player
          if (active && active !== item.player) {
            try {
              const activeItem = items.find((i) => i.player === active);
              if (activeItem) {
                activeItem.thumbnailHolder.style.opacity = "1"; // Show thumbnail
              }
            } catch (e) {
              console.warn("Error handling previous active player", e);
            }
          }

          try {
            // Always start from beginning on hover
            item.player.seekTo(0, true);
            item.player.playVideo();

            // Hide thumbnail to reveal video
            item.thumbnailHolder.style.opacity = "0";

            active = item.player;
          } catch (e) {
            console.warn("Error playing video", e);
          }
        });

        parent.addEventListener("mouseleave", () => {
          if (!item.ready || !item.player) return;

          try {
            // Don't pause the video, just show the thumbnail over it
            item.thumbnailHolder.style.opacity = "1";

            // Let video keep playing in background
            if (active === item.player) active = null;
          } catch (e) {
            console.warn("Error handling mouseleave", e);
          }
        });
      }

      // Set up play button click handler for autoplayOnLoad videos
      if (item.autoplayOnLoad && item.playButton) {
        item.playButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!item.plyrReady) {
            console.warn("Plyr not ready yet, initializing now");
            initializePlyrForAll();
            setTimeout(() => {
              // Try again in a moment
              e.currentTarget.click();
            }, 300);
            return;
          }

          try {
            // Hide the play button and regular player
            item.playButton.style.display = "none";
            item.thumbnailHolder.style.opacity = "0";
            item.iframe.style.zIndex = "0"; // Put behind

            // Show the already initialized Plyr
            item.plyrContainer.style.display = "block";

            // Play and unmute immediately
            if (item.plyrPlayer) {
              item.plyrPlayer.restart();
              item.plyrPlayer.muted = false;
              item.plyrPlayer.volume = 1;

              // Force play with multiple approaches to ensure it works
              item.plyrPlayer.play();

              // Show UI immediately to avoid flashing
              const plyrUI =
                item.plyrContainer.querySelector(".plyr__controls");
              if (plyrUI) plyrUI.style.opacity = "1";
            }
          } catch (e) {
            console.warn("Error playing Plyr video", e);
          }
        });
      }
    });
  }

  if (window.YT && window.YT.Player) {
    onAPIReady();
  } else {
    const tag = document.createElement("script");
    tag.id = "youtube-api";
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = onAPIReady;
  }

  // Add enhanced CSS for styling
  const style = document.createElement("style");
  style.textContent = `
        .shorts-player-wrapper {
          position: relative;
          overflow: hidden;
        }
        
        .shorts-thumbnail {
          background-color: #000; /* Black background before image loads */
        }
        
        .shorts-play-button:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: translate(-50%, -50%) scale(1.1);
        }
        
        .shorts-play-button:active {
          transform: translate(-50%, -50%) scale(0.95);
        }
        
        /* Hide all YouTube UI elements */
        .ytp-spinner,
        .ytp-gradient-top,
        .ytp-gradient-bottom,
        .ytp-chrome-top,
        .ytp-chrome-bottom,
        .ytp-watermark,
        .ytp-large-play-button,
        .ytp-youtube-button,
        .ytp-embed-title,
        .ytp-pause-overlay {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        
        /* Plyr custom styles */
        .plyr-container .plyr {
          height: 100%;
          width: 100%;
        }
        
        .plyr--youtube .plyr__video-embed iframe {
          height: 125% !important;
          width: 125% !important;
          top: -12.5% !important;
          left: -12.5% !important;
        }
        
        /* Style Plyr controls */
        .plyr--video .plyr__controls {
          background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7));
          padding: 10px;
        }
        
        /* Fix font styling in Plyr controls - use sans-serif */
        .plyr, 
        .plyr__controls,
        .plyr__controls button,
        .plyr__controls .plyr__time,
        .plyr__tooltip {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
        }
        
        /* Hide fullscreen button even if it somehow appears */
        .plyr__control--fullscreen,
        button[data-plyr="fullscreen"] {
          display: none !important;
        }
      `;
  document.head.appendChild(style);

  // Debug message
  console.log(`Found ${items.length} YouTube videos`);
  console.log(
    `AutoplayOnLoad videos: ${
      items.filter((item) => item.autoplayOnLoad).length
    }`
  );
  console.log(
    `AutoplayOnHover videos: ${
      items.filter((item) => item.autoplayOnHover).length
    }`
  );
});
