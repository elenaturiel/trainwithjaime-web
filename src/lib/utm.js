// Origen de la visita (UTM). Se guarda al entrar en la web, en la pestaña (sessionStorage), para no perderlo si la
// persona entra por la home con ?utm_source=instagram y llega al formulario HYROX después de navegar.
const KEY = 'twj-utm'
const FIELDS = ['utm_source', 'utm_medium', 'utm_campaign']

const read = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

// Llamar al arrancar la app: guarda las UTM de la URL si las trae.
export function captureUtm() {
  const params = new URLSearchParams(window.location.search)
  const found = {}
  for (const f of FIELDS) if (params.get(f)) found[f] = params.get(f).slice(0, 100)
  if (!Object.keys(found).length) return
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...read(), ...found }))
  } catch {
    /* almacenamiento bloqueado: se usan solo las de la URL */
  }
}

// Las de la URL actual mandan sobre las guardadas.
export function getUtm() {
  const params = new URLSearchParams(window.location.search)
  const stored = read()
  return Object.fromEntries(FIELDS.map((f) => [f, (params.get(f) || stored[f] || '').slice(0, 100)]))
}
