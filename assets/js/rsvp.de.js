var RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_OybF6iqbhlvJhljjpb7_12Y5IcmQM0VBMxhHGq0O3otiTuHLjbPdBTVyVnT29ywi/exec';

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
  setTimeout(function () {
    document.getElementById('rsvp-form').reset();
    document.getElementById('rsvp-extra').innerHTML = '';
    rsvpGuestCount = 0;
    clearRsvpStatus();
    document.querySelectorAll('#rsvp-form .rsvp-dropdown-trigger').forEach(function (t) {
      t.classList.add('placeholder');
      var ph = t.dataset.placeholder;
      if (ph) t.querySelector('.rsvp-dropdown-value').textContent = ph;
    });
    document.querySelectorAll('#rsvp-form input[type="hidden"]').forEach(function (h) {
      h.value = '';
    });
    document.querySelectorAll('#rsvp-form .rsvp-dropdown-list li').forEach(function (li) {
      li.classList.remove('selected');
    });
    var sc = document.querySelector('.rsvp-scroll');
    if (sc) sc.scrollTop = 0;
    if (overlay) overlay.querySelector('.rsvp-modal').classList.remove('scrolled');
  }, 400);
}

/* Renumerotează persoanele adăugate dinamic după o ștergere.
   Fără asta indicii rămân cu goluri (name_1, name_3) și eticheta
   afișată nu mai corespunde poziției reale. */
function reindexRsvpGuests() {
  var people = document.querySelectorAll('#rsvp-extra .rsvp-person');
  people.forEach(function (person, idx) {
    var n = idx + 1;
    person.querySelector('.rsvp-person-label').textContent = 'Person ' + (n + 1);
    person.querySelector('.rsvp-input').name = 'name_' + n;
    person.querySelector('input[type="hidden"]').name = 'type_' + n;
  });
  rsvpGuestCount = people.length;
}

function removeRsvpGuest(btn) {
  btn.closest('.rsvp-person').remove();
  reindexRsvpGuests();
}

function addRsvpGuest() {
  rsvpGuestCount++;
  var n   = rsvpGuestCount;
  var div = document.createElement('div');
  div.className = 'rsvp-person';
  div.innerHTML =
    '<div class="rsvp-person-header">' +
      '<span class="rsvp-person-label">Person ' + (n + 1) + '</span>' +
      '<button type="button" class="rsvp-remove" onclick="removeRsvpGuest(this)" aria-label="Entfernen">×</button>' +
    '</div>' +
    '<input type="text" name="name_' + n + '" placeholder="Vor- und Nachname" class="rsvp-input">' +
    '<div class="rsvp-dropdown">' +
      '<button type="button" class="rsvp-dropdown-trigger placeholder" data-placeholder="Menü wählen">' +
        '<span class="rsvp-dropdown-value">Menü wählen</span>' +
        '<svg class="rsvp-dropdown-arrow" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg" width="10" height="6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>' +
      '</button>' +
      '<ul class="rsvp-dropdown-list">' +
        '<li data-value="adult">Menü Erwachsene</li>' +
        '<li data-value="child">Menü Kinder</li>' +
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

  var form = document.getElementById('rsvp-form');
  var side = form.querySelector('[name="side"]');
  if (!side.value) {
    setRsvpStatus('error', 'Bitte wähle aus, zu wem du gehörst.');
    form.querySelector('.rsvp-dropdown-trigger').focus();
    return;
  }

  var inputs = form.querySelectorAll('.rsvp-input');
  for (var i = 0; i < inputs.length; i++) {
    if (!inputs[i].value.trim()) {
      setRsvpStatus('error', 'Bitte gib für jede Person den Namen an.');
      inputs[i].focus();
      return;
    }
  }

  var typeInputs = form.querySelectorAll('input[type="hidden"][name^="type_"]');
  for (var j = 0; j < typeInputs.length; j++) {
    if (!typeInputs[j].value) {
      setRsvpStatus('error', 'Bitte wähle für jede Person das Menü aus.');
      typeInputs[j].closest('.rsvp-dropdown').querySelector('.rsvp-dropdown-trigger').focus();
      return;
    }
  }

  var btn = document.querySelector('.rsvp-submit');
  btn.textContent = 'Wird gesendet…';
  btn.disabled = true;

  var payload = {};
  new FormData(form).forEach(function (val, key) { payload[key] = val; });

  /* Fără no-cors: răspunsul trebuie citit ca să știm dacă a intrat
     în Sheet. Cu no-cors orice eroare (403, 500) arăta ca succes. */
  fetch(RSVP_SCRIPT_URL + '?' + new URLSearchParams(payload))
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      if (!data || data.ok !== true) {
        throw new Error(data && data.error ? data.error : 'Unerwartete Antwort');
      }
      setRsvpStatus('success', 'Zusage gesendet! Wir freuen uns auf euch.');
      btn.textContent = 'Teilnahme bestätigen';
      btn.disabled = false;
      setTimeout(closeRsvp, 2500);
    })
    .catch(function (err) {
      if (window.console) console.error('RSVP:', err);
      setRsvpStatus('error', 'Es ist ein Fehler aufgetreten. Bitte kontaktiert uns direkt.');
      btn.textContent = 'Teilnahme bestätigen';
      btn.disabled = false;
    });
}

document.getElementById('rsvp-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeRsvp();
});

document.querySelectorAll('#rsvp-form .rsvp-dropdown').forEach(initDropdown);

var rsvpScroll = document.querySelector('.rsvp-scroll');
if (rsvpScroll) {
  rsvpScroll.addEventListener('scroll', function () {
    var modal = rsvpScroll.closest('.rsvp-modal');
    if (modal) modal.classList.toggle('scrolled', rsvpScroll.scrollTop > 4);
  });
}
