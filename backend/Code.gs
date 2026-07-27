var SHEET_NAME = 'RSVP Nick & Georgi';

function doGet(e) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  /* Dacă foaia a fost redenumită, appendRow ar arunca o eroare greu de
     observat prin no-cors — mai bine raportăm explicit. */
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'Sheet not found: ' + SHEET_NAME }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var p         = e.parameter || {};
  var timestamp = new Date();
  var side      = p.side  || '';
  var notes     = p.notes || '';

  /* Indicii pot avea goluri: dacă invitatul șterge o persoană din mijloc,
     ajung name_0 și name_2 fără name_1. O buclă care se oprește la primul
     gol ar pierde restul persoanelor, așa că le strângem pe toate. */
  var keys = Object.keys(p).filter(function (k) { return /^name_\d+$/.test(k); });
  keys.sort(function (a, b) {
    return parseInt(a.slice(5), 10) - parseInt(b.slice(5), 10);
  });

  var sideLabel = side === 'mire'    ? 'Mire'
                : side === 'mireasa' ? 'Mireasă'
                : side;

  keys.forEach(function (key) {
    var name = (p[key] || '').trim();
    if (!name) return;

    var raw  = p['type_' + key.slice(5)] || '';
    var type = raw === 'child' ? 'Copil' : raw === 'adult' ? 'Adult' : raw;

    sheet.appendRow([timestamp, sideLabel, name, type, notes]);
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}


function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (sheet && sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Din partea', 'Nume', 'Tip', 'Note']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
}
