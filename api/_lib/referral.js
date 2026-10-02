// Códigos de amigo (squad discount): cada persona puede generar UN código aleatorio
// para dárselo a un amigo, y cada código solo se puede canjear UNA vez.
//
// Almacenamiento: Redis de Upstash (gratis) vía su API REST. En Vercel se conecta en
// Storage → Upstash for Redis, que crea automáticamente KV_REST_API_URL y KV_REST_API_TOKEN
// (también valen UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
// En local (npm run dev) sin esas variables se usa una memoria temporal para poder probar.
import { randomInt } from 'node:crypto'

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // sin 0/O, 1/I/L para que no se confundan
const PREFIX = 'TWJ-'
const CODE_RE = /^TWJ-[A-HJKMNP-Z2-9]{6}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const key = {
  code: (c) => `ref:code:${c}`, // quién lo creó
  owner: (e) => `ref:owner:${e}`, // código de cada email
  used: (c) => `ref:used:${c}`, // quién lo ha canjeado
}

export const normalizeCode = (c) =>
  String(c || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
const normalizeEmail = (e) =>
  String(e || '')
    .trim()
    .toLowerCase()
const newCode = () => PREFIX + Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')

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
    get: async (k) => {
      const v = await cmd('GET', k)
      return v == null ? null : JSON.parse(v)
    },
    // Escribe solo si la clave no existe. Devuelve true si la ha escrito (operación atómica).
    setNX: async (k, v) => (await cmd('SET', k, JSON.stringify(v), 'NX')) === 'OK',
  }
}

const memory = new Map()
const memoryStore = {
  get: async (k) => (memory.has(k) ? JSON.parse(memory.get(k)) : null),
  setNX: async (k, v) => {
    if (memory.has(k)) return false
    memory.set(k, JSON.stringify(v))
    return true
  },
}

export function getStore(env = process.env) {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) return redisStore(url, token)
  // En producción no vale la memoria (no se comparte entre servidores): mejor avisar.
  if (env.VERCEL) return null
  return memoryStore
}

// ─── Lógica ────────────────────────────────────────────────
async function create(store, { name, email }) {
  email = normalizeEmail(email)
  if (!EMAIL_RE.test(email)) return [400, { ok: false, error: 'Email no válido.' }]
  // Una persona = un código. Si ya lo pidió, le devolvemos el mismo.
  const existing = await store.get(key.owner(email))
  if (existing) return [200, { ok: true, code: existing }]
  for (let i = 0; i < 10; i++) {
    const code = newCode()
    if (await store.setNX(key.code(code), { email, name: String(name || '').slice(0, 80), at: Date.now() })) {
      if (await store.setNX(key.owner(email), code)) return [200, { ok: true, code }]
      return [200, { ok: true, code: await store.get(key.owner(email)) }] // otra petición simultánea ganó
    }
  }
  return [500, { ok: false, error: 'No se ha podido generar el código.' }]
}

// Comprueba si `email` puede usar `code`. Devuelve null si puede, o el motivo si no.
async function problem(store, code, email) {
  if (!CODE_RE.test(code)) return 'El código no tiene el formato correcto (TWJ-XXXXXX).'
  const info = await store.get(key.code(code))
  if (!info) return 'Ese código no existe. Revisa que esté bien escrito.'
  if (email && info.email === email) return 'No puedes usar tu propio código: pásaselo a tu amigo.'
  const used = await store.get(key.used(code))
  if (used && used.email !== email) return 'Ese código ya se ha usado.'
  return null
}

async function check(store, { code, email }) {
  const why = await problem(store, normalizeCode(code), normalizeEmail(email))
  return [200, why ? { ok: false, error: why } : { ok: true }]
}

async function redeem(store, { code, email, name }) {
  code = normalizeCode(code)
  email = normalizeEmail(email)
  if (!EMAIL_RE.test(email)) return [400, { ok: false, error: 'Email no válido.' }]
  const why = await problem(store, code, email)
  if (why) return [409, { ok: false, error: why }]
  // Canje atómico: solo la primera persona consigue escribir "usado".
  if (await store.setNX(key.used(code), { email, name: String(name || '').slice(0, 80), at: Date.now() })) {
    return [200, { ok: true }]
  }
  const used = await store.get(key.used(code))
  // Si es la misma persona reintentando el envío, lo damos por bueno.
  return used?.email === email ? [200, { ok: true }] : [409, { ok: false, error: 'Ese código ya se ha usado.' }]
}

const ACTIONS = { create, check, redeem }

// Devuelve [status, json]. Lo usan la función de Vercel (api/referral.js) y el servidor local de Vite.
export async function handleReferral(body, store = getStore()) {
  const fn = ACTIONS[body?.action]
  if (!fn) return [400, { ok: false, error: 'Acción no válida.' }]
  if (!store) return [503, { ok: false, error: 'El sistema de códigos no está configurado.', unavailable: true }]
  try {
    return await fn(store, body)
  } catch (e) {
    console.error('[referral]', e)
    return [503, { ok: false, error: 'No se ha podido comprobar el código ahora mismo.', unavailable: true }]
  }
}
