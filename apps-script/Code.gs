/**
 * Recebe os contatos do formulário do site da Nova Era e grava na planilha.
 * Instalação: ver apps-script/README.md.
 */
const SHEET_NAME = 'Leads';
const HEADERS = [
  'Data/hora', 'Nome', 'WhatsApp', 'Interesse', 'Tipo', 'Botão (CTA)', 'ad_id',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'Página', 'Origem (referrer)', 'Status'
];

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return reply('invalid');
  }
  if (data.website) return reply('ok'); // campo-isca preenchido: robô

  const name = text(data.name, 80);
  const phone = String(data.phone || '').replace(/\D/g, '').slice(0, 15);
  if (name.length < 2 || phone.length < 12) return reply('invalid');

  const row = [
    new Date(), name, "'" + phone, text(data.interest, 80), text(data.kind, 20), text(data.cta, 64),
    text(data.adId, 80), text(data.utm_source), text(data.utm_medium), text(data.utm_campaign),
    text(data.utm_content), text(data.utm_term), text(data.gclid), text(data.gbraid), text(data.wbraid), text(data.fbclid),
    text(data.page, 300), text(data.referrer, 300), ''
  ];

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet().appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return reply('ok');
}

function doGet() {
  return reply('ok');
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
  }
  return sheet;
}

// Texto limpo e sem fórmulas (evita que "=..." seja executado pela planilha).
function text(value, max) {
  const s = String(value == null ? '' : value).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max || 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(status) {
  return ContentService.createTextOutput(JSON.stringify({ status: status }))
    .setMimeType(ContentService.MimeType.JSON);
}
