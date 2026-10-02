/**
 * Train with Jaime — guarda las inscripciones de la web en esta hoja de Google Sheets.
 *
 * Instalación (una sola vez, con la cuenta de Google de Train with Jaime):
 *  1. Crea una hoja de cálculo nueva (p. ej. "Inscripciones web Train with Jaime").
 *  2. Menú Extensiones → Apps Script. Borra lo que haya y pega este archivo entero. Guarda.
 *  3. Configuración del proyecto (icono ⚙️) → Propiedades de la secuencia de comandos →
 *     Añadir propiedad:  SECRET  =  (una clave larga inventada, la misma que pondrás en Vercel)
 *  4. Implementar → Nueva implementación → Tipo: Aplicación web.
 *     Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario → Implementar → Autorizar.
 *  5. Copia la URL que acaba en /exec y ponla en Vercel como GOOGLE_SHEETS_WEBHOOK_URL.
 */

var SHEET_NAME = 'Inscripciones'
var HEADERS = [
  'Fecha',
  'Nombre',
  'Email',
  'Teléfono',
  'Qué busca',
  'Mensaje',
  'Plan',
  'Recomendación del test',
  'Carné universitario',
  'Código de amigo usado',
  'Estado del código',
  'Código generado para su amigo',
  'Acepta privacidad',
]
var FIELDS = [
  'nombre',
  'email',
  'telefono',
  'que_buscas',
  'mensaje',
  'plan',
  'recomendacion_test',
  'carne_universitario',
  'codigo_amigo_usado',
  'codigo_amigo_estado',
  'codigo_para_su_amigo',
  'acepta_privacidad',
]

function doPost(e) {
  var body
  try {
    body = JSON.parse(e.postData.contents)
  } catch (err) {
    return json_({ ok: false, error: 'bad json' })
  }
  var secret = PropertiesService.getScriptProperties().getProperty('SECRET')
  if (!secret || body.secret !== secret) return json_({ ok: false, error: 'unauthorized' })

  var lock = LockService.getScriptLock()
  lock.waitLock(10000) // evita filas pisadas si llegan dos envíos a la vez
  try {
    var sheet = getSheet_()
    var row = body.row || {}
    var values = [new Date()].concat(
      FIELDS.map(function (f) {
        return row[f] == null ? '' : String(row[f])
      }),
    )
    sheet.appendRow(values)
  } finally {
    lock.releaseLock()
  }
  return json_({ ok: true })
}

// Para comprobar en el navegador que la URL funciona.
function doGet() {
  return json_({ ok: true, service: 'Train with Jaime · inscripciones' })
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
  return sheet
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
