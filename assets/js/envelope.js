(function () {
  var overlay = document.getElementById('intro-overlay');
  var wrap    = document.getElementById('envelope-wrap');
  var audio   = document.getElementById('bg-audio');
  var opened  = false;

  if (!overlay) return;

  /* Lock scroll while overlay is visible */
  document.body.style.overflow = 'hidden';

  function updateMusicIcon() {
    var el = document.getElementById('play-icon');
    if (el && audio) el.textContent = audio.paused ? 'play_arrow' : 'pause';
  }

  overlay.addEventListener('click', function () {
    if (opened) return;
    opened = true;

    if (audio) audio.play().then(updateMusicIcon).catch(function () {});

    /* 1. Open the flap */
    wrap.classList.add('open');

    /* 2. After flap opens, fly the envelope away */
    setTimeout(function () {
      wrap.classList.add('opening');
    }, 520);

    /* 3. Fade out overlay, then remove and restore scroll */
    setTimeout(function () {
      overlay.classList.add('leaving');
      setTimeout(function () {
        overlay.remove();
        document.body.style.overflow = '';
      }, 950);
    }, 1150);
  });
})();
