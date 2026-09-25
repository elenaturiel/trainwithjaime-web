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
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, row }),
      redirect: 'follow', // Apps Script responde con una redirección
    })
    const data = await res.json().catch(() => null)
    if (res.ok && data?.ok) return [200, { ok: true }]
    console.error('[lead] Apps Script respondió', res.status, data)
    return [502, { ok: false, error: 'No se ha podido guardar en Google Sheets.', unavailable: true }]
  } catch (e) {
    console.error('[lead]', e)
    return [502, { ok: false, error: 'No se ha podido guardar en Google Sheets.', unavailable: true }]
  }
}
