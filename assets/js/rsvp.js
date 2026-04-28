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
  }, 400);
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
    '<input type="text" name="name_' + n + '" placeholder="Nume și prenume" class="rsvp-input">' +
    '<div class="rsvp-dropdown">' +
      '<button type="button" class="rsvp-dropdown-trigger placeholder" data-placeholder="Adult sau copil?">' +
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

  var form = document.getElementById('rsvp-form');
  var side = form.querySelector('[name="side"]');
  if (!side.value) {
    setRsvpStatus('error', 'Te rog să selectezi din partea cui vii.');
    form.querySelector('.rsvp-dropdown-trigger').focus();
    return;
  }

  var inputs = form.querySelectorAll('.rsvp-input');
  for (var i = 0; i < inputs.length; i++) {
    if (!inputs[i].value.trim()) {
      setRsvpStatus('error', 'Te rog să scrii numele pentru fiecare persoană.');
      inputs[i].focus();
      return;
    }
  }

  var typeInputs = form.querySelectorAll('input[type="hidden"][name^="type_"]');
  for (var j = 0; j < typeInputs.length; j++) {
    if (!typeInputs[j].value) {
      setRsvpStatus('error', 'Te rog să selectezi adult sau copil pentru fiecare persoană.');
      typeInputs[j].closest('.rsvp-dropdown').querySelector('.rsvp-dropdown-trigger').focus();
      return;
    }
  }

  var btn = document.querySelector('.rsvp-submit');
  btn.textContent = 'Se trimite…';
  btn.disabled = true;

  /* TODO: Google Apps Script fetch */
  setTimeout(function () {
    setRsvpStatus('success', 'Confirmare trimisă! Te așteptăm cu drag.');
    btn.textContent = 'Confirmă prezența';
    btn.disabled = false;
    setTimeout(closeRsvp, 2500);
  }, 900);
}

document.getElementById('rsvp-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeRsvp();
});

document.querySelectorAll('#rsvp-form .rsvp-dropdown').forEach(initDropdown);
