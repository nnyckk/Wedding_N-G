function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVP Nick & Georgi');

  var p         = e.parameter;
  var timestamp = new Date();
  var side      = p.side  || '';
  var notes     = p.notes || '';

  var i = 0;
  while (p['name_' + i] !== undefined) {
    var type = p['type_' + i] === 'child' ? 'Copil' : p['type_' + i] || '';
    sheet.appendRow([timestamp, side, p['name_' + i], type, notes]);
    i++;
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}


function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVP Nick & Georgi');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Din partea', 'Nume', 'Tip', 'Note']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
}
