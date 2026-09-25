// Preferencias de cookies del usuario. Se guardan en localStorage (almacenamiento técnico, exento de consentimiento).
const KEY = 'twj-cookies-v1'
const CHANGE = 'twj-consent-change'
const OPEN = 'twj-open-cookie-settings'

export function getConsent() {
  try {
    return JSON.parse(localStorage.getItem(KEY))
  } catch {
    return null
  }
}

export function setConsent({ analytics }) {
  const value = { analytics: !!analytics, date: new Date().toISOString() }
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    /* modo privado / almacenamiento bloqueado: la elección vale solo para esta visita */
  }
  window.dispatchEvent(new CustomEvent(CHANGE, { detail: value }))
}

export const onConsentChange = (fn) => {
  const h = (e) => fn(e.detail)
  window.addEventListener(CHANGE, h)
  return () => window.removeEventListener(CHANGE, h)
}

// Reabre el panel de cookies (enlace "Configurar cookies" del pie).
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN))
export const onOpenCookieSettings = (fn) => {
  window.addEventListener(OPEN, fn)
  return () => window.removeEventListener(OPEN, fn)
}
