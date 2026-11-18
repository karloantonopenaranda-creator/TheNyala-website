// Review stories: tapping a rolled scroll unrolls it to show the review, and tapping it again rolls it back up. While
// rolled, the paper is inert, so its text is neither focusable nor read out. Once a story has been opened, its avatar's
// ring dims, as a seen story does. The lower rod rolls the scroll back up too.
(() => {
  for (const button of document.querySelectorAll('.story-roll')) {
    const scroll = button.closest('.story-scroll'), story = button.closest('.review-story');
    const paper = document.getElementById(button.getAttribute('aria-controls'));
    const reading = story.querySelector('.story-reading').textContent.trim();
    const hint = story.querySelector('.story-hint');
    const set = open => {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', `${open ? 'Roll up' : 'Open'} the ${reading} review`);
      scroll.classList.toggle('is-open', open);
      paper.inert = !open;
      if (hint) hint.textContent = open ? 'Tap the scroll to roll it up' : 'Tap the scroll to open it';
      if (open) story.classList.add('is-seen');
    };
    button.addEventListener('click', () => set(button.getAttribute('aria-expanded') !== 'true'));
    scroll.querySelector('.story-rod--bottom').addEventListener('click', () => { if (scroll.classList.contains('is-open')) set(false); });
  }
})();
