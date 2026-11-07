// Función serverless de Vercel: GET /api/resenas-foto?id=… → la foto de un cambio (JPEG).
import { getFoto } from './_lib/resenas.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }
  const [status, img] = await getFoto(req.query?.id)
  if (status !== 200) return res.status(status).end()
  res.setHeader('Content-Type', 'image/jpeg')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  // Caché corta: si Jaime borra un cambio, su foto deja de verse en poco tiempo.
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=3600')
  res.status(200).send(img)
}
