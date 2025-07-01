$("[video-content]").each(function () {
  let n = $(this),
    l = new Plyr(n.find(".plyr_video")[0], {
      controls: ["play", "progress", "current-time", "mute", "fullscreen"],
      resetOnEnd: !0,
    });

  // On play button click
  n.find("[video-play]").on("click", function () {
    l.play().then(() => {
      // Only hide cover after video actually starts
      $("[video-cover]").removeClass("hide-cover");
      n.find("[video-cover]").addClass("hide-cover");

      // Pause other videos
      let others = $(".plyr--playing").closest("[video-content]").not(n);
      if (others.length > 0) {
        others.find("[plyr-pause]").trigger("click");
      }
    });
  });

  // Pause button
  n.find("[plyr-pause]").on("click", function () {
    l.pause();
  });

  // Show cover again when video ends
  l.on("ended", () => {
    n.find("[video-cover]").removeClass("hide-cover");
    if (l.fullscreen.active) {
      l.fullscreen.exit();
    }
  });

  // Fullscreen styling
  l.on("enterfullscreen", () => {
    n.addClass("contain-video");
  });

  l.on("exitfullscreen", () => {
    n.removeClass("contain-video");
  });
});
