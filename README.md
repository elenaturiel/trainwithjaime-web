# Train with Jaime — web

React + Vite + TailwindCSS v4 + Framer Motion + react-router-dom + recharts.

## Local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
npm run preview  # sirve /dist en local
```

## Qué hay que sustituir

| Qué | Dónde |
|---|---|
| ID de Formspree | `src/config.js` → `FORMSPREE_FORM_ID` |
| Número de WhatsApp | `src/config.js` → `WHATSAPP_NUMBER` (formato `34600123456`) |
| Testimonios (tira superior y cita grande) | `src/config.js` → `TOP_STRIP_TESTIMONIALS`, `FEATURED_TESTIMONIAL` |
| Vídeo del hero + poster | `public/hero.mp4`, `public/hero-poster.jpg` |
| Fotos de la galería | `public/gallery-1.jpg` … `gallery-5.jpg` |
| Foto de Jaime | `public/jaime.jpg` |
| Features de cada plan | `src/data/pricing.js` |

Busca `⚠️ SUSTITUIR` y `⚠️ REVISAR` en el código para ver todos los puntos.

## Despliegue

- **Vercel:** importa el repo en vercel.com → framework "Vite" → deploy. `vercel.json` ya incluye el rewrite para que `/servicios`, `/contacto`… funcionen al recargar.
- **Netlify:** importa el repo → build command `npm run build`, publish directory `dist`. `public/_redirects` ya incluye el fallback SPA.
