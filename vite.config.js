import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleReferral } from './api/_lib/referral.js'
import { handleLead } from './api/_lib/lead.js'
import { handleHyrox, handleHyroxStats } from './api/_lib/hyrox.js'
import { getFoto, handleAdmin, listPublic, submitReview } from './api/_lib/resenas.js'

// En local, Vite no ejecuta las funciones de /api (eso lo hace Vercel al desplegar).
// Este mini-servidor responde a /api/referral, /api/lead, /api/hyrox y /api/hyrox-stats para poder probarlos con `npm run dev`.
const LOCAL_API = {
  '/api/referral': (body) => handleReferral(body),
  '/api/lead': (body) => handleLead(body),
  '/api/hyrox': (body) => handleHyrox(body),
  '/api/hyrox-stats': (_body, req) => handleHyroxStats(req.headers['x-admin-token']),
  '/api/resenas': (body, req) => (req.method === 'GET' ? listPublic() : submitReview(body)),
  '/api/resenas-admin': (body, req) => handleAdmin(req.method, req.headers['x-admin-token'], body),
  '/api/resenas-foto': async (_body, _req, url) => {
    const [status, img] = await getFoto(url.searchParams.get('id'))
    return [status, img, 'image/jpeg']
  },
}
function localReferralApi() {
  const middleware = (req, res, next) => {
    const url = new URL(req.url, 'http://localhost')
    const handler = LOCAL_API[url.pathname]
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
      const [status, payload, type] = await handler(body, req, url)
      res.statusCode = status
      if (type) {
        res.setHeader('Content-Type', type)
        res.end(payload ?? undefined)
        return
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(payload))
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
