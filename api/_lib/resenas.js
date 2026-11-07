// Reseñas de clientes ("Qué dicen nuestros clientes") y fotos de cambios.
//
// Almacenamiento: el mismo Redis de Upstash que HYROX y los códigos de amigo (KV_REST_API_URL / KV_REST_API_TOKEN).
// En local (sin esas variables) usa una memoria temporal para poder probar.
//
//   Reseñas  → hash `resenas:items`  (id → JSON). Estado `pendiente` (recién enviada) o `publicada` (aprobada por Jaime).
//   Cambios  → hash `resenas:cambios` (id → JSON): foto + mini texto que sube Jaime. Se publican al crearlos.
//   Fotos    → hash `resenas:fotos`  (id → imagen JPEG en base64), servidas por /api/resenas-foto?id=…
//
// Nada de lo que escribe el público se publica solo: Jaime lo revisa en /admin/resenas (clave HYROX_ADMIN_TOKEN).
import { randomBytes } from 'node:crypto'
import { authorized, getStore } from './hyrox.js'

const KEY_ITEMS = 'resenas:items'
const KEY_CAMBIOS = 'resenas:cambios'
const KEY_FOTOS = 'resenas:fotos'
const MAX_PENDIENTES = 200 // tope de reseñas sin revisar (frena el spam si alguien inunda el formulario)
const MAX_CAMBIOS = 60
const MAX_FOTO_B64 = 900_000 // ~650 KB de imagen: cabe en una petición de Upstash
const ID_RE = /^[a-f0-9]{16,40}$/

const text = (v, max) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .trim()
    .slice(0, max)
const newId = () => randomBytes(10).toString('hex')

// Lo que ve el público: sin estado ni datos internos.
const publicReview = (r) => ({ id: r.id, nombre: r.nombre, detalle: r.detalle, estrellas: r.estrellas, texto: r.texto, fecha: r.fecha })
const publicCambio = (c) => ({ id: c.id, titulo: c.titulo, texto: c.texto, nombre: c.nombre, foto: `/api/resenas-foto?id=${c.id}`, fecha: c.fecha })
const byDateDesc = (a, b) => String(b.fecha).localeCompare(String(a.fecha))

async function guard(store, fn) {
  if (!store) return [503, { ok: false, error: 'Las reseñas no están configuradas.', unavailable: true }]
  try {
    return await fn()
  } catch (e) {
    console.error('[resenas]', e)
    return [503, { ok: false, error: 'No se ha podido completar ahora mismo.', unavailable: true }]
  }
}

// ─── Público ────────────────────────────────────────────────
// GET /api/resenas → reseñas publicadas y cambios (con resumen de la nota media).
export async function listPublic(store = getStore()) {
  return guard(store, async () => {
    const [items, cambios] = await Promise.all([store.hgetall(KEY_ITEMS), store.hgetall(KEY_CAMBIOS)])
    const publicadas = items.filter((r) => r.estado === 'publicada').sort(byDateDesc)
    const media = publicadas.length ? publicadas.reduce((n, r) => n + r.estrellas, 0) / publicadas.length : 0
    return [
      200,
      {
        ok: true,
        total: publicadas.length,
        media: Math.round(media * 10) / 10,
        resenas: publicadas.map(publicReview),
        cambios: cambios.sort(byDateDesc).map(publicCambio),
      },
    ]
  })
}

// POST /api/resenas → una persona deja su reseña. Queda `pendiente` hasta que Jaime la publique.
export async function submitReview(b, store = getStore()) {
  if (b?.website) return [200, { ok: true }] // campo trampa para bots: se ignora sin avisar
  const nombre = text(b?.nombre, 40)
  const detalle = text(b?.detalle, 60)
  const texto = text(b?.texto, 600)
  const estrellas = Number(b?.estrellas)
  if (nombre.length < 2) return [400, { ok: false, error: 'Escribe tu nombre (basta con el nombre y una inicial).' }]
  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) return [400, { ok: false, error: 'Elige una valoración de 1 a 5 estrellas.' }]
  if (texto.length < 20) return [400, { ok: false, error: 'Cuéntanos un poco más (mínimo 20 caracteres).' }]
  if (b?.consentimiento !== true) return [400, { ok: false, error: 'Falta tu consentimiento para publicar la reseña.' }]
  if (/https?:\/\/|www\./i.test(`${nombre} ${detalle} ${texto}`)) return [400, { ok: false, error: 'Por favor, no incluyas enlaces en la reseña.' }]
  return guard(store, async () => {
    const items = await store.hgetall(KEY_ITEMS)
    if (items.filter((r) => r.estado === 'pendiente').length >= MAX_PENDIENTES)
      return [429, { ok: false, error: 'Ahora mismo hay muchas reseñas por revisar. Vuelve a intentarlo en unos días.' }]
    // misma persona y mismo texto: no se guarda dos veces (doble clic, reenvío…)
    if (items.some((r) => r.nombre === nombre && r.texto === texto)) return [200, { ok: true }]
    const id = newId()
    await store.hset(KEY_ITEMS, id, { id, nombre, detalle, estrellas, texto, estado: 'pendiente', fecha: new Date().toISOString() })
    return [200, { ok: true }]
  })
}

// GET /api/resenas-foto?id=… → la imagen de un cambio (JPEG).
export async function getFoto(id, store = getStore()) {
  if (!ID_RE.test(String(id || ''))) return [400, null]
  if (!store) return [503, null]
  try {
    const data = await store.hget(KEY_FOTOS, id)
    if (!data) return [404, null]
    return [200, Buffer.from(data, 'base64')]
  } catch (e) {
    console.error('[resenas-foto]', e)
    return [503, null]
  }
}

// ─── Privado (Jaime) ────────────────────────────────────────
async function adminList(store) {
  const [items, cambios] = await Promise.all([store.hgetall(KEY_ITEMS), store.hgetall(KEY_CAMBIOS)])
  return [
    200,
    {
      ok: true,
      resenas: items.sort(byDateDesc),
      cambios: cambios.sort(byDateDesc).map((c) => ({ ...publicCambio(c), permiso: c.permiso === true })),
    },
  ]
}

const ADMIN_ACTIONS = {
  // Reseñas: publicar / ocultar (vuelve a pendiente) / borrar
  async publicar(store, b) {
    const r = ID_RE.test(String(b.id)) && (await store.hget(KEY_ITEMS, b.id))
    if (!r) return [404, { ok: false, error: 'Reseña no encontrada.' }]
    await store.hset(KEY_ITEMS, r.id, { ...r, estado: 'publicada', publicada: new Date().toISOString() })
    return [200, { ok: true }]
  },
  async ocultar(store, b) {
    const r = ID_RE.test(String(b.id)) && (await store.hget(KEY_ITEMS, b.id))
    if (!r) return [404, { ok: false, error: 'Reseña no encontrada.' }]
    await store.hset(KEY_ITEMS, r.id, { ...r, estado: 'pendiente' })
    return [200, { ok: true }]
  },
  async borrar(store, b) {
    if (!ID_RE.test(String(b.id))) return [400, { ok: false, error: 'Identificador no válido.' }]
    await store.hdel(KEY_ITEMS, b.id)
    return [200, { ok: true }]
  },
  // Cambios: foto + mini texto
  async 'cambio-crear'(store, b) {
    const foto = String(b.foto || '')
    // Solo JPEG en base64 (el navegador de Jaime reduce y convierte la foto antes de subirla)
    if (!/^[A-Za-z0-9+/]+=*$/.test(foto) || !foto.startsWith('/9j/')) return [400, { ok: false, error: 'La foto debe ser un JPEG.' }]
    if (foto.length > MAX_FOTO_B64) return [413, { ok: false, error: 'La foto pesa demasiado. Prueba con una más pequeña.' }]
    const titulo = text(b.titulo, 60)
    const textoMini = text(b.texto, 240)
    if (!titulo) return [400, { ok: false, error: 'Escribe un título corto (p. ej. “−8 kg en 12 semanas”).' }]
    if (b.permiso !== true) return [400, { ok: false, error: 'Confirma que tienes el permiso de la persona para publicar su foto.' }]
    if ((await store.hgetall(KEY_CAMBIOS)).length >= MAX_CAMBIOS) return [400, { ok: false, error: `Ya hay ${MAX_CAMBIOS} cambios. Borra alguno para añadir más.` }]
    const id = newId()
    await store.hset(KEY_FOTOS, id, foto)
    await store.hset(KEY_CAMBIOS, id, { id, titulo, texto: textoMini, nombre: text(b.nombre, 40), permiso: true, fecha: new Date().toISOString() })
    return [200, { ok: true, id }]
  },
  async 'cambio-editar'(store, b) {
    const c = ID_RE.test(String(b.id)) && (await store.hget(KEY_CAMBIOS, b.id))
    if (!c) return [404, { ok: false, error: 'Cambio no encontrado.' }]
    const titulo = text(b.titulo, 60)
    if (!titulo) return [400, { ok: false, error: 'El título no puede estar vacío.' }]
    await store.hset(KEY_CAMBIOS, c.id, { ...c, titulo, texto: text(b.texto, 240), nombre: text(b.nombre, 40) })
    return [200, { ok: true }]
  },
  async 'cambio-borrar'(store, b) {
    if (!ID_RE.test(String(b.id))) return [400, { ok: false, error: 'Identificador no válido.' }]
    await store.hdel(KEY_CAMBIOS, b.id)
    await store.hdel(KEY_FOTOS, b.id)
    return [200, { ok: true }]
  },
}

// GET → todo (también lo pendiente) · POST { action, … } → acción. Misma clave que la vista HYROX.
export async function handleAdmin(method, token, body, store = getStore(), env = process.env) {
  if (!env.HYROX_ADMIN_TOKEN) return [503, { ok: false, error: 'Falta configurar HYROX_ADMIN_TOKEN en Vercel.' }]
  if (!authorized(token, env)) return [401, { ok: false, error: 'Clave incorrecta.' }]
  if (method === 'GET') return guard(store, () => adminList(store))
  const fn = ADMIN_ACTIONS[body?.action]
  if (!fn) return [400, { ok: false, error: 'Acción no válida.' }]
  return guard(store, () => fn(store, body))
}
