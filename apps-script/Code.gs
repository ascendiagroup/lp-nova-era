/**
 * Recebe os contatos do formulário do site da Nova Era e grava na planilha.
 * Instalação: ver apps-script/README.md.
 *
 * As colunas usam os nomes de parâmetro padrão do Google (UTMs do GA4 e IDs de clique
 * do Google Ads). created_at sai no formato aceito pela importação de conversões
 * offline do Google Ads (yyyy-MM-dd HH:mm:ss-03:00) e phone em E.164 (+55...).
 */
const SHEET_NAME = 'Leads';
const TIME_ZONE = 'America/Sao_Paulo';
const FIELDS = [
  'created_at', 'lead_id', 'name', 'phone', 'interest', 'interest_type', 'cta', 'ad_id',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'landing_page', 'referrer', 'status'
];
const LIMITS = { name: 80, interest: 80, interest_type: 20, cta: 64, ad_id: 80, lead_id: 64, landing_page: 300, referrer: 300 };

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return reply('invalid');
  }
  if (data.website) return reply('ok'); // campo-isca preenchido: robô

  const digits = String(data.phone || '').replace(/\D/g, '').slice(0, 15);
  const values = {};
  FIELDS.forEach(function (f) { values[f] = clean(data[f], LIMITS[f]); });
  values.created_at = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ssXXX');
  values.phone = '+' + digits;
  values.status = '';
  if (values.name.length < 2 || digits.length < 12) return reply('invalid');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // Gravado como texto: evita que a planilha transforme telefone ou data em número/fórmula.
    getSheet().appendRow(FIELDS.map(function (f) { return values[f] ? "'" + values[f] : ''; }));
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
    sheet.appendRow(FIELDS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, FIELDS.length).setFontWeight('bold');
  }
  return sheet;
}

function clean(value, max) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max || 200);
}

function reply(status) {
  return ContentService.createTextOutput(JSON.stringify({ status: status }))
    .setMimeType(ContentService.MimeType.JSON);
}
