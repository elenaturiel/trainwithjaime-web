// Formulario HYROX en el navegador: identificador de la persona, guardado de pasos y eventos.
// Todo es "disparar y olvidar": si /api/hyrox no responde (o no está configurado) el formulario sigue funcionando.
import { HYROX_EVENTS_NEED_CONSENT } from '../config.js'
import { getConsent } from './consent.js'
import { getUtm } from './utm.js'

export const UBICACIONES = ['barra', 'home', 'planes', 'footer']
export const ubFromSearch = (search) => {
  const v = new URLSearchParams(search).get('ub')
  return UBICACIONES.includes(v) ? v : 'directo'
}

const ID_KEY = 'twj-hyrox-id'
// Un identificador aleatorio por visita: sirve para ir completando el mismo registro paso a paso.
export function leadId() {
  try {
    let id = sessionStorage.getItem(ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(ID_KEY, id)
    }
    return id
  } catch {
    return (window.__twjHyroxId ||= crypto.randomUUID())
  }
}

const post = (payload) =>
  fetch('/api/hyrox', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  })

// Guarda (o completa) el registro: { nivel } · { cuando } · { email, consentimiento }. Devuelve true si se guardó.
export async function saveLead(fields, ub) {
  try {
    const res = await post({ action: 'lead', id: leadId(), ub, ...getUtm(), ...fields })
    return res.ok
  } catch {
    return false
  }
}

// Eventos: vista, paso1, paso2, envio. No llevan ningún dato personal.
export function track(name, ub) {
  if (HYROX_EVENTS_NEED_CONSENT && getConsent()?.analytics !== true) return
  post({ action: 'event', name, ub, ...getUtm() }).catch(() => {})
}
