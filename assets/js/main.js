var audio     = document.getElementById('bg-audio');
var peekTimer = null;

function updateIcon() {
  var icon = document.getElementById('music-icon');
  if (icon) icon.textContent = audio.paused ? 'play_arrow' : 'music_note';
}

function toggleMusic() {
  var btn = document.getElementById('music-btn');

  if (audio.paused) {
    audio.play().then(updateIcon).catch(function () {});
  } else {
    audio.pause();
    updateIcon();
  }

  btn.classList.add('peeked');
  clearTimeout(peekTimer);
  peekTimer = setTimeout(function () {
    btn.classList.remove('peeked');
  }, 3000);
}

/* ── RSVP Custom Dropdowns ── */
function initDropdown(dropdown) {
  var trigger = dropdown.querySelector('.rsvp-dropdown-trigger');
  var items   = dropdown.querySelectorAll('li');
  var hidden  = dropdown.querySelector('input[type="hidden"]');

  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    document.querySelectorAll('.rsvp-dropdown.open').forEach(function (d) {
      if (d !== dropdown) d.classList.remove('open');
    });
    dropdown.classList.toggle('open');
  });

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      hidden.value = item.dataset.value;
      trigger.querySelector('.rsvp-dropdown-value').textContent = item.textContent;
      trigger.classList.remove('placeholder');
      items.forEach(function (i) { i.classList.remove('selected'); });
      item.classList.add('selected');
      dropdown.classList.remove('open');
    });
  });
}

document.addEventListener('click', function () {
  document.querySelectorAll('.rsvp-dropdown.open').forEach(function (d) {
    d.classList.remove('open');
  });
});

/* ── RSVP Modal ── */
var rsvpGuestCount = 0;

function openRsvp() {
  var overlay     = document.getElementById('rsvp-overlay');
  var phoneScroll = document.getElementById('phone-scroll');
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (phoneScroll) phoneScroll.style.overflowY = 'hidden';
}

function closeRsvp() {
  var overlay     = document.getElementById('rsvp-overlay');
  var phoneScroll = document.getElementById('phone-scroll');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  if (phoneScroll) phoneScroll.style.overflowY = '';
}

function addRsvpGuest() {
  rsvpGuestCount++;
  var n   = rsvpGuestCount;
  var div = document.createElement('div');
  div.className = 'rsvp-person';
  div.innerHTML =
    '<div class="rsvp-person-header">' +
      '<span class="rsvp-person-label">Persoana ' + (n + 1) + '</span>' +
      '<button type="button" class="rsvp-remove" onclick="this.closest(\'.rsvp-person\').remove()" aria-label="Șterge">×</button>' +
    '</div>' +
    '<input type="text" name="name_' + n + '" placeholder="Nume și prenume" class="rsvp-input" required>' +
    '<div class="rsvp-dropdown">' +
      '<button type="button" class="rsvp-dropdown-trigger placeholder">' +
        '<span class="rsvp-dropdown-value">Adult sau copil?</span>' +
        '<svg class="rsvp-dropdown-arrow" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg" width="10" height="6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>' +
      '</button>' +
      '<ul class="rsvp-dropdown-list">' +
        '<li data-value="adult">Adult</li>' +
        '<li data-value="child">Copil (sub 10 ani)</li>' +
      '</ul>' +
      '<input type="hidden" name="type_' + n + '" value="">' +
    '</div>';
  var extra = document.getElementById('rsvp-extra');
  extra.appendChild(div);
  initDropdown(div.querySelector('.rsvp-dropdown'));
}

function setRsvpStatus(type, msg) {
  var el = document.getElementById('rsvp-status');
  el.className = 'rsvp-status ' + type;
  el.textContent = msg;
}

function clearRsvpStatus() {
  var el = document.getElementById('rsvp-status');
  el.className = 'rsvp-status';
  el.textContent = '';
}

function submitRsvp(e) {
  e.preventDefault();
  clearRsvpStatus();

  /* Validare manuală */
  var form = document.getElementById('rsvp-form');
  var side = form.querySelector('[name="side"]');
  if (!side.value) {
    setRsvpStatus('error', 'Te rugăm să selectezi din partea cui veniți.');
    form.querySelector('.rsvp-dropdown-trigger').focus();
    return;
  }

  var inputs = form.querySelectorAll('.rsvp-input[required]');
  for (var i = 0; i < inputs.length; i++) {
    if (!inputs[i].value.trim()) {
      setRsvpStatus('error', 'Te rugăm să completezi toate câmpurile de nume.');
      inputs[i].focus();
      return;
    }
  }

  var typeInputs = form.querySelectorAll('input[type="hidden"][name^="type_"]');
  for (var j = 0; j < typeInputs.length; j++) {
    if (!typeInputs[j].value) {
      setRsvpStatus('error', 'Te rugăm să selectezi "Adult sau copil" pentru fiecare persoană.');
      typeInputs[j].closest('.rsvp-dropdown').querySelector('.rsvp-dropdown-trigger').focus();
      return;
    }
  }

  var btn = document.querySelector('.rsvp-submit');
  btn.textContent = 'Se trimite…';
  btn.disabled = true;

  /* TODO: Google Apps Script fetch */
  setTimeout(function () {
    setRsvpStatus('success', 'Confirmare trimisă! Vă așteptăm cu drag.');
    btn.textContent = 'Confirmă prezența';
    btn.disabled = false;
    setTimeout(function () {
      closeRsvp();
      setTimeout(function () {
        form.reset();
        document.getElementById('rsvp-extra').innerHTML = '';
        rsvpGuestCount = 0;
        clearRsvpStatus();
      }, 400);
    }, 2500);
  }, 900);
}

document.getElementById('rsvp-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeRsvp();
});

document.querySelectorAll('#rsvp-form .rsvp-dropdown').forEach(initDropdown);

/* ── Music btn: visible when hero has scrolled mostly off screen ── */
(function () {
  var btn         = document.getElementById('music-btn');
  var hero        = document.querySelector('.hero-photo');
  var phoneScroll = document.getElementById('phone-scroll');

  function update() {
    var rect = hero.getBoundingClientRect();
    btn.classList.toggle('visible', rect.bottom < window.innerHeight * 0.4);
  }

  var scrollEl = (phoneScroll && window.innerWidth >= 520) ? phoneScroll : window;
  scrollEl.addEventListener('scroll', update, { passive: true });
  update();
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
