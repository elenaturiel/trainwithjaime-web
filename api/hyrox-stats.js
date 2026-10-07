// Función serverless de Vercel: GET /api/hyrox-stats (cabecera x-admin-token) → estadísticas de la lista HYROX.
import { handleHyroxStats } from './_lib/hyrox.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, error: 'Método no permitido.' })
  }
  res.setHeader('Cache-Control', 'no-store')
  const [status, json] = await handleHyroxStats(req.headers['x-admin-token'])
  res.status(status).json(json)
}
