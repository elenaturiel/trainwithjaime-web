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

## Códigos de amigo (descuento squad)

En el formulario de contacto cada persona puede pedir **un código aleatorio** (`TWJ-XXXXXX`) para dárselo a un
amigo, y hay un campo para introducir el código que te han pasado. Cada código **solo se puede canjear una vez**, nadie
puede usar el suyo propio y el email que le llega a Jaime indica el código generado y el código canjeado.

Para que funcione en la web publicada hace falta una base de datos (gratis) donde guardar los códigos:

1. En Vercel → tu proyecto → **Storage** → **Create / Connect** → **Upstash for Redis** (plan gratuito) → conéctalo al proyecto.
2. Eso crea solo las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN`. Vuelve a desplegar (**Deployments → Redeploy**).

La lógica está en `api/_lib/referral.js` y la función en `api/referral.js`. En local (`npm run dev`) funciona sin
configurar nada, guardando los códigos en memoria (se borran al parar el servidor). Si en producción falta la base de
datos, el formulario se envía igualmente y el email marca el código como "SIN VERIFICAR" para revisarlo a mano.

> Esta parte usa funciones de Vercel: en Netlify el resto de la web funciona, pero los códigos no.

## Despliegue

- **Vercel:** importa el repo en vercel.com → framework "Vite" → deploy. `vercel.json` ya incluye el rewrite para que `/servicios`, `/contacto`… funcionen al recargar.
- **Netlify:** importa el repo → build command `npm run build`, publish directory `dist`. `public/_redirects` ya incluye el fallback SPA.
