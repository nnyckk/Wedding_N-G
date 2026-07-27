(function () {
  var overlay     = document.getElementById('intro-overlay');
  var wrap        = document.getElementById('envelope-wrap');
  var audio       = document.getElementById('bg-audio');
  var phoneScroll = document.getElementById('phone-scroll');
  var opened      = false;

  if (!overlay) return;

  /* Lock scroll while overlay is visible */
  document.body.style.overflow = 'hidden';
  if (phoneScroll) phoneScroll.style.overflowY = 'hidden';

  function updateMusicIcon() {
    var el = document.getElementById('music-icon');
    if (el && audio) el.textContent = audio.paused ? 'play_arrow' : 'music_note';
  }

  overlay.addEventListener('click', function () {
    if (opened) return;
    opened = true;

    /* Dacă browserul blochează autoplay-ul, iconița trebuie să arate
       tot 'play_arrow' — altfel rămâne pe starea inițială din HTML. */
    if (audio) audio.play().then(updateMusicIcon).catch(updateMusicIcon);

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
        if (phoneScroll) phoneScroll.style.overflowY = '';
      }, 950);
    }, 1150);
  });
})();
