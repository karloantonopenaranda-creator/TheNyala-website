// Automatic, silent playback; suspend decoding when the hero is out of view.
(() => {
  const video = document.querySelector('.hero-video');
  if (!video) return;
  let visible = true;
  video.muted = true;
  function syncPlayback() {
    if (visible && !document.hidden) {
      // Browsers may block autoplay in battery/data-saving modes; keep the poster.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }).observe(video);
  }
  syncPlayback();
})();
