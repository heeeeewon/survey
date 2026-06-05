const SHEET_NAME = 'Responses';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Survey response endpoint is active.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    const payload = body.payload || body;
    if (!payload.response_id) {
      payload.response_id = Utilities.getUuid();
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    const existingHeaders = getHeaders_(sheet);
    const incomingHeaders = Object.keys(payload);
    const headers = mergeHeaders_(existingHeaders, incomingHeaders);
    ensureHeaders_(sheet, headers);
    if (isDuplicateResponse_(sheet, headers, payload.response_id)) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, duplicate: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const row = headers.map(header => payload[header] === undefined || payload[header] === null ? '' : payload[header]);
    sheet.appendRow(row);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getHeaders_(sheet) {
  if (sheet.getLastColumn() === 0) return [];
  const values = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return values.filter(String);
}

function mergeHeaders_(existing, incoming) {
  const seen = {};
  const merged = [];
  existing.concat(incoming).forEach(header => {
    if (!seen[header]) {
      seen[header] = true;
      merged.push(header);
    }
  });
  return merged;
}

function ensureHeaders_(sheet, headers) {
  if (headers.length === 0) return;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

function isDuplicateResponse_(sheet, headers, responseId) {
  if (!responseId || sheet.getLastRow() < 2) return false;
  const idColumn = headers.indexOf('response_id') + 1;
  if (idColumn < 1) return false;
  const values = sheet.getRange(2, idColumn, sheet.getLastRow() - 1, 1).getValues();
  return values.some(row => String(row[0]) === String(responseId));
}
