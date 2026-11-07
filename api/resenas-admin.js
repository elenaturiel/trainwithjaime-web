// Función serverless de Vercel: /api/resenas-admin (cabecera x-admin-token).
//   GET  → todas las reseñas (también las pendientes) y los cambios
//   POST → { action: 'publicar' | 'ocultar' | 'borrar' | 'cambio-crear' | 'cambio-editar' | 'cambio-borrar', … }
import { handleAdmin } from './_lib/resenas.js'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ ok: false, error: 'Método no permitido.' })
  }
  res.setHeader('Cache-Control', 'no-store')
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const [status, json] = await handleAdmin(req.method, req.headers['x-admin-token'], body || {})
  res.status(status).json(json)
}
