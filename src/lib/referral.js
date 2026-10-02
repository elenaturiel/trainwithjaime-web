// Cliente del sistema de códigos de amigo (ver api/_lib/referral.js).
// Devuelve siempre { ok, error?, code?, unavailable? } y nunca lanza excepciones:
// si el servidor no responde, `unavailable` = true y el formulario sigue funcionando.
export async function referral(action, payload) {
  try {
    const res = await fetch('/api/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
    })
    const data = await res.json().catch(() => null)
    if (!data) return { ok: false, unavailable: true }
    return data
  } catch {
    return { ok: false, unavailable: true }
  }
}

export const normalizeCode = (c) => c.trim().toUpperCase().replace(/\s+/g, '')
