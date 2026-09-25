import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleReferral } from './api/_lib/referral.js'

// En local, Vite no ejecuta las funciones de /api (eso lo hace Vercel al desplegar).
// Este mini-servidor responde a /api/referral para poder probar los códigos con `npm run dev`.
function localReferralApi() {
  const middleware = (req, res, next) => {
    if (req.url !== '/api/referral') return next()
    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', async () => {
      let body = {}
      try {
        body = JSON.parse(raw || '{}')
      } catch {
        /* cuerpo vacío o inválido */
      }
      const [status, json] = await handleReferral(body)
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
