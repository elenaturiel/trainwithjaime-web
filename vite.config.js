import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleReferral } from './api/_lib/referral.js'
import { handleLead } from './api/_lib/lead.js'
import { handleHyrox, handleHyroxStats } from './api/_lib/hyrox.js'

// En local, Vite no ejecuta las funciones de /api (eso lo hace Vercel al desplegar).
// Este mini-servidor responde a /api/referral, /api/lead, /api/hyrox y /api/hyrox-stats para poder probarlos con `npm run dev`.
const LOCAL_API = {
  '/api/referral': (body) => handleReferral(body),
  '/api/lead': (body) => handleLead(body),
  '/api/hyrox': (body) => handleHyrox(body),
  '/api/hyrox-stats': (_body, req) => handleHyroxStats(req.headers['x-admin-token']),
}
function localReferralApi() {
  const middleware = (req, res, next) => {
    const handler = LOCAL_API[req.url]
    if (!handler) return next()
    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', async () => {
      let body = {}
      try {
        body = JSON.parse(raw || '{}')
      } catch {
        /* cuerpo vacío o inválido */
      }
      const [status, json] = await handler(body, req)
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(json))
    })
  }
  return {
    name: 'local-referral-api',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localReferralApi()],
})
