// Guarda cada envío del formulario de inscripción como una fila en Google Sheets.
//
// La web no habla directamente con Google: esta función (servidor de Vercel) reenvía los datos
// a un Apps Script instalado en la hoja de Train with Jaime (ver google-apps-script/Code.gs),
// junto a una clave secreta. Variables de entorno en Vercel:
//   GOOGLE_SHEETS_WEBHOOK_URL → URL de la aplicación web del Apps Script (…/exec)
//   GOOGLE_SHEETS_SECRET      → la misma clave que se pone en el Apps Script

// Campos que se guardan (en este orden); el resto se ignora.
export const LEAD_FIELDS = [
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

const clean = (v) =>
  String(v ?? '')
    .slice(0, 2000)
    // Evita que un texto que empiece por = + - @ se interprete como fórmula en la hoja.
    .replace(/^[=+\-@]/, "'$&")

export async function handleLead(body, env = process.env) {
  if (!body || typeof body !== 'object') return [400, { ok: false, error: 'Datos no válidos.' }]
  if (body._gotcha) return [200, { ok: true }] // bot: se ignora en silencio
  if (!body.nombre || !body.email) return [400, { ok: false, error: 'Faltan nombre o email.' }]

  const url = env.GOOGLE_SHEETS_WEBHOOK_URL
  const secret = env.GOOGLE_SHEETS_SECRET
  if (!url || !secret) return [503, { ok: false, error: 'Google Sheets no está configurado.', unavailable: true }]

  const row = Object.fromEntries(LEAD_FIELDS.map((f) => [f, clean(body[f])]))
  let res, text
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, row }),
      redirect: 'follow', // Apps Script responde con una redirección
    })
    text = await res.text()
  } catch (e) {
    console.error('[lead]', e)
    return fail(`No se ha podido conectar con la URL de Apps Script (${e.message}). Revisa GOOGLE_SHEETS_WEBHOOK_URL.`)
  }
  let data = null
  try {
    data = JSON.parse(text)
  } catch {
    /* Google ha devuelto una página HTML en vez de JSON */
  }
  if (res.ok && data?.ok) return [200, { ok: true }]

  // Diagnóstico legible (sin datos sensibles) para saber qué falla en la configuración.
  let detail
  if (data?.error === 'unauthorized')
    detail = 'La clave no coincide: GOOGLE_SHEETS_SECRET (Vercel) debe ser igual que SECRET (Apps Script).'
  else if (data?.error) detail = `Apps Script respondió: ${data.error}`
  else if (/accounts\.google\.com|ServiceLogin|signin/i.test(text))
    detail = 'Google pide iniciar sesión: en la implementación, "Quién tiene acceso" debe ser "Cualquier usuario".'
  else if (res.status === 404) detail = 'URL no encontrada: usa la URL de la implementación que acaba en /exec.'
  else if (/Script function not found: doPost/i.test(text))
    detail = 'El script no tiene doPost: pega Code.gs completo y crea una implementación NUEVA.'
  else if (/TypeError|Exception|Error/i.test(text))
    detail = `Error dentro del Apps Script: ${(text.match(/(TypeError|Exception|Error)[^<]{0,160}/) || [''])[0]}`
  else detail = `Respuesta inesperada de Google (HTTP ${res.status}).`
  console.error('[lead]', detail)
  return fail(detail)
}

function fail(detail) {
  return [502, { ok: false, error: 'No se ha podido guardar en Google Sheets.', detail, unavailable: true }]
}
