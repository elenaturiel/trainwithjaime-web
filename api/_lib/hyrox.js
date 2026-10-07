// Lista de espera del plan HYROX: guarda los pasos del formulario (HyroxLead), registra eventos y calcula las
// estadísticas de la vista privada.
//
// Almacenamiento: el mismo Redis de Upstash que los códigos de amigo (KV_REST_API_URL / KV_REST_API_TOKEN).
// En local (sin esas variables) usa una memoria temporal para poder probar.
//
//   HyroxLead  → hash `hyrox:leads` (id → JSON). Una persona = un registro; se va completando paso a paso,
//                así que también se guardan los que no llegan al email (con email vacío).
//   Eventos    → lista `hyrox:events` (los últimos 20 000): vista, paso1, paso2, envio. Sin ningún dato personal.
//
// Vista privada: GET /api/hyrox-stats con la cabecera `x-admin-token` igual a la variable HYROX_ADMIN_TOKEN.
import { timingSafeEqual } from 'node:crypto'

export const NIVELES = ['nunca', 'gimnasio', 'competido']
export const CUANDO = ['3m', '3-6m', 'mas-adelante', 'curioseando']
export const UBICACIONES = ['barra', 'home', 'planes', 'footer']
export const EVENTOS = ['vista', 'paso1', 'paso2', 'envio']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ID_RE = /^[A-Za-z0-9-]{16,64}$/
const KEY_LEADS = 'hyrox:leads'
const KEY_EVENTS = 'hyrox:events'
const MAX_EVENTS = 20000

const text = (v, max = 100) =>
  String(v ?? '')
    .trim()
    .slice(0, max)

// Origen de la visita: la ubicación del banner solo puede ser una de las 4 conocidas; las UTM, texto corto.
const ub = (v) => (UBICACIONES.includes(v) ? v : 'directo')
const utm = (b) => ({
  utm_source: text(b?.utm_source).toLowerCase(),
  utm_medium: text(b?.utm_medium).toLowerCase(),
  utm_campaign: text(b?.utm_campaign).toLowerCase(),
})

// ─── Almacenes ──────────────────────────────────────────────
function redisStore(url, token) {
  const cmd = async (...args) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    })
    const data = await res.json()
    if (!res.ok || data.error) throw new Error(data.error || `Redis ${res.status}`)
    return data.result
  }
  return {
    hget: async (k, f) => {
      const v = await cmd('HGET', k, f)
      return v == null ? null : JSON.parse(v)
    },
    hset: (k, f, v) => cmd('HSET', k, f, JSON.stringify(v)),
    hgetall: async (k) => {
      const flat = (await cmd('HGETALL', k)) || []
      const out = []
      for (let i = 1; i < flat.length; i += 2) out.push(JSON.parse(flat[i]))
      return out
    },
    push: async (k, v, max) => {
      await cmd('RPUSH', k, JSON.stringify(v))
      await cmd('LTRIM', k, -max, -1)
    },
    list: async (k) => ((await cmd('LRANGE', k, 0, -1)) || []).map((s) => JSON.parse(s)),
  }
}

const mem = { hashes: new Map(), lists: new Map() }
const memoryStore = {
  hget: async (k, f) => mem.hashes.get(k)?.get(f) ?? null,
  hset: async (k, f, v) => {
    if (!mem.hashes.has(k)) mem.hashes.set(k, new Map())
    mem.hashes.get(k).set(f, v)
  },
  hgetall: async (k) => [...(mem.hashes.get(k)?.values() ?? [])],
  push: async (k, v, max) => {
    const l = mem.lists.get(k) ?? []
    l.push(v)
    mem.lists.set(k, l.slice(-max))
  },
  list: async (k) => mem.lists.get(k) ?? [],
}

export function getStore(env = process.env) {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) return redisStore(url, token)
  if (env.VERCEL) return null // en producción la memoria no se comparte entre servidores
  return memoryStore
}

// ─── Escritura ──────────────────────────────────────────────
async function evento(store, b) {
  if (!EVENTOS.includes(b.name)) return [400, { ok: false, error: 'Evento no válido.' }]
  await store.push(KEY_EVENTS, { name: b.name, ubicacion_banner: ub(b.ub), ...utm(b), fecha: new Date().toISOString() }, MAX_EVENTS)
  return [200, { ok: true }]
}

// Crea o completa el HyroxLead de esa persona (`id` lo genera el navegador al empezar). Cada paso añade su dato.
async function lead(store, b) {
  if (!ID_RE.test(String(b.id || ''))) return [400, { ok: false, error: 'Falta el identificador.' }]
  if (b.website) return [200, { ok: true }] // campo trampa para bots: se ignora sin avisar
  const prev = await store.hget(KEY_LEADS, b.id)
  const now = new Date().toISOString()
  const rec = prev || {
    id: b.id,
    nivel: '',
    cuando: '',
    email: '',
    consentimiento: false,
    ubicacion_banner: ub(b.ub),
    ...utm(b),
    fecha: now,
  }
  if (b.nivel !== undefined) {
    if (!NIVELES.includes(b.nivel)) return [400, { ok: false, error: 'Nivel no válido.' }]
    rec.nivel = b.nivel
  }
  if (b.cuando !== undefined) {
    if (!CUANDO.includes(b.cuando)) return [400, { ok: false, error: 'Plazo no válido.' }]
    rec.cuando = b.cuando
  }
  if (b.email !== undefined) {
    const email = text(b.email, 200).toLowerCase()
    if (!EMAIL_RE.test(email)) return [400, { ok: false, error: 'Email no válido.' }]
    if (b.consentimiento !== true) return [400, { ok: false, error: 'Falta tu consentimiento.' }]
    rec.email = email
    rec.consentimiento = true
  }
  rec.actualizado = now
  await store.hset(KEY_LEADS, b.id, rec)
  return [200, { ok: true }]
}

const ACTIONS = { event: evento, lead }

// Devuelve [status, json]. Lo usan la función de Vercel (api/hyrox.js) y el servidor local de Vite.
export async function handleHyrox(body, store = getStore()) {
  const fn = ACTIONS[body?.action]
  if (!fn) return [400, { ok: false, error: 'Acción no válida.' }]
  if (!store) return [503, { ok: false, error: 'El registro no está configurado.', unavailable: true }]
  try {
    return await fn(store, body)
  } catch (e) {
    console.error('[hyrox]', e)
    return [503, { ok: false, error: 'No se ha podido guardar ahora mismo.', unavailable: true }]
  }
}

// ─── Estadísticas (solo para ti) ────────────────────────────
const tally = (items, key, blank = '(directo)') => {
  const out = {}
  for (const it of items) {
    const k = it[key] || blank
    out[k] = (out[k] || 0) + 1
  }
  return out
}

export function authorized(token, env = process.env) {
  const expected = env.HYROX_ADMIN_TOKEN
  if (!expected || !token) return false
  const a = Buffer.from(String(token))
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function handleHyroxStats(token, store = getStore(), env = process.env) {
  if (!env.HYROX_ADMIN_TOKEN) return [503, { ok: false, error: 'Falta configurar HYROX_ADMIN_TOKEN en Vercel.' }]
  if (!authorized(token, env)) return [401, { ok: false, error: 'Clave incorrecta.' }]
  if (!store) return [503, { ok: false, error: 'El registro no está configurado.' }]
  try {
    const [leads, events] = await Promise.all([store.hgetall(KEY_LEADS), store.list(KEY_EVENTS)])
    const withEmail = leads.filter((l) => l.email)
    const count = (name) => events.filter((e) => e.name === name)
    const visits = count('vista')
    const byKey = (key, blank) => {
      const v = tally(visits, key, blank) // visitas (solo de quien acepta la analítica)
      const s = tally(leads, key, blank) // empezaron el formulario (exacto)
      const e = tally(withEmail, key, blank) // dejaron el email (exacto)
      return Object.keys({ ...v, ...s, ...e })
        .map((k) => ({ nombre: k, visitas: v[k] || 0, empezaron: s[k] || 0, emails: e[k] || 0 }))
        .sort((a, b) => b.emails - a.emails || b.empezaron - a.empezaron || b.visitas - a.visitas)
    }
    return [
      200,
      {
        ok: true,
        visitas: visits.length,
        // Embudo exacto: sale de los pasos guardados (no depende de que la persona acepte la analítica)
        pasos: {
          paso1: leads.filter((l) => l.nivel).length,
          paso2: leads.filter((l) => l.cuando).length,
          envio: withEmail.length,
        },
        // Eventos registrados (solo de quien acepta la analítica)
        eventos: { vista: visits.length, paso1: count('paso1').length, paso2: count('paso2').length, envio: count('envio').length },
        emails: withEmail.length,
        empezaron: leads.length,
        porUbicacion: byKey('ubicacion_banner', 'directo'),
        porSource: byKey('utm_source', '(directo)'),
        nivel: tally(leads.filter((l) => l.nivel), 'nivel'),
        cuando: tally(leads.filter((l) => l.cuando), 'cuando'),
        // Quién se ha apuntado (solo con email y consentimiento), lo más reciente primero
        contactos: withEmail
          .map((l) => ({ email: l.email, fecha: l.fecha, nivel: l.nivel, cuando: l.cuando, ubicacion_banner: l.ubicacion_banner, utm_source: l.utm_source }))
          .sort((a, b) => (a.fecha < b.fecha ? 1 : -1)),
        ultimo: leads.reduce((m, l) => (l.actualizado > m ? l.actualizado : m), ''),
      },
    ]
  } catch (e) {
    console.error('[hyrox-stats]', e)
    return [503, { ok: false, error: 'No se han podido leer los datos.' }]
  }
}
