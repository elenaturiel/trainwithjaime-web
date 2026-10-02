// Función serverless de Vercel: POST /api/referral  { action: 'create' | 'check' | 'redeem', ... }
import { handleReferral } from './_lib/referral.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
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
  const [status, json] = await handleReferral(body || {})
  res.status(status).json(json)
}
