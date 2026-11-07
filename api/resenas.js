// Función serverless de Vercel: /api/resenas
//   GET  → reseñas publicadas y cambios (para la web)
//   POST → una persona deja su reseña (queda pendiente hasta que Jaime la publique)
import { listPublic, submitReview } from './_lib/resenas.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300')
    const [status, json] = await listPublic()
    return res.status(status).json(json)
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ ok: false, error: 'Método no permitido.' })
  }
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const [status, json] = await submitReview(body || {})
  res.status(status).json(json)
}
