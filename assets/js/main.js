var audio = document.getElementById('bg-audio');

function updateIcon() {
  document.getElementById('play-icon').textContent = audio.paused ? 'play_arrow' : 'pause';
}

function toggleMusic() {
  if (audio.paused) {
    audio.play().then(updateIcon).catch(function(){});
  } else {
    audio.pause();
    updateIcon();
  }
}

/* ── Music btn: visible when hero top has scrolled off screen ── */
(function () {
  var btn  = document.getElementById('music-btn');
  var hero = document.querySelector('.hero-photo');

  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
  hero.prepend(sentinel);

  var observer = new IntersectionObserver(function (entries) {
    btn.classList.toggle('visible', !entries[0].isIntersecting);
  }, { threshold: 0, rootMargin: '20% 0px 0px 0px' });

  observer.observe(sentinel);
})();


/* ── Flip Clock ── */
function initFlipUnit(id) {
  var el = document.getElementById(id);
  if (!el) return null;
  var halves = el.querySelectorAll('.fc-half');
  return {
    bgTopSpan:  halves[0].querySelector('span'),
    bgBotSpan:  halves[1].querySelector('span'),
    flap:       halves[2],
    flapSpan:   halves[2].querySelector('span'),
    reveal:     halves[3],
    revealSpan: halves[3].querySelector('span'),
    current:    null,
    animating:  false
  };
}

function flipTo(unit, newVal) {
  if (!unit) return;

  /* First call: set all panels silently, no animation */
  if (unit.current === null) {
    unit.current = newVal;
    unit.bgTopSpan.textContent  = newVal;
    unit.bgBotSpan.textContent  = newVal;
    unit.flapSpan.textContent   = newVal;
    unit.revealSpan.textContent = newVal;
    return;
  }

  if (unit.animating || unit.current === newVal) return;
  unit.animating = true;

  /* Pre-load new value on bg-top (hidden under fc-flap) and reveal panel */
  unit.bgTopSpan.textContent  = newVal;
  unit.revealSpan.textContent = newVal;

  /* 1. Fold flap down */
  unit.flap.style.transition = 'transform 0.28s ease-in';
  unit.flap.style.transform  = 'rotateX(-90deg)';

  /* 2. Reveal new bottom half after flap disappears */
  setTimeout(function () {
    unit.reveal.style.transition = 'transform 0.28s ease-out';
    unit.reveal.style.transform  = 'rotateX(0deg)';
  }, 260);

  /* 3. Settle: sync all static panels, reset fold panels for next cycle */
  setTimeout(function () {
    unit.current = newVal;
    unit.bgBotSpan.textContent   = newVal;
    unit.flapSpan.textContent    = newVal;
    unit.flap.style.transition   = 'none';
    unit.flap.style.transform    = 'rotateX(0deg)';
    unit.reveal.style.transition = 'none';
    unit.reveal.style.transform  = 'rotateX(90deg)';
    unit.animating = false;
  }, 600);
}

var fcDays  = initFlipUnit('fc-days');
var fcHours = initFlipUnit('fc-hours');
var fcMins  = initFlipUnit('fc-mins');
var fcSecs  = initFlipUnit('fc-secs');

/* ── Countdown ── */
function tick() {
  var target = new Date('2026-10-25T00:00:00');
  var diff   = target - new Date();
  var pad    = function(n) { return String(Math.max(0, n)).padStart(2, '0'); };

  if (diff <= 0) {
    flipTo(fcDays,  '00');
    flipTo(fcHours, '00');
    flipTo(fcMins,  '00');
    flipTo(fcSecs,  '00');
    return;
  }

  flipTo(fcDays,  pad(Math.floor(diff / 86400000)));
  flipTo(fcHours, pad(Math.floor((diff % 86400000) / 3600000)));
  flipTo(fcMins,  pad(Math.floor((diff % 3600000)  / 60000)));
  flipTo(fcSecs,  pad(Math.floor((diff % 60000)    / 1000)));
}

tick();
setInterval(tick, 1000);
