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
| Datos del titular (aviso legal y privacidad) | `src/config.js` → `LEGAL` |
| Testimonios (tira superior y tarjetas bajo los precios) | `src/config.js` → `TOP_STRIP_TESTIMONIALS`, `TESTIMONIALS` |
| Vídeo del hero + poster | `public/hero.mp4`, `public/hero-poster.jpg` |
| Fotos de la galería | `public/gallery-1.jpg` … `gallery-5.jpg` |
| Foto de Jaime | `public/jaime.jpg` |
| Features de cada plan | `src/data/pricing.js` |

Busca `⚠️ SUSTITUIR` y `⚠️ REVISAR` en el código para ver todos los puntos.

## Inscripciones en Google Sheets

Cada envío del formulario se guarda como una fila en una hoja de Google Sheets de Train with Jaime (además del aviso
por email de Formspree; basta con que uno de los dos funcione para no perder la inscripción).

1. Con la cuenta de Google de Train with Jaime, crea una hoja de cálculo.
2. **Extensiones → Apps Script**, borra lo que haya y pega `google-apps-script/Code.gs`. Guarda.
3. **⚙️ Configuración del proyecto → Propiedades de la secuencia de comandos → Añadir**: `SECRET` = una clave larga inventada.
4. **Implementar → Nueva implementación → Aplicación web** · Ejecutar como: *Yo* · Acceso: *Cualquier usuario* → Autorizar.
5. En Vercel → **Settings → Environment Variables** añade `GOOGLE_SHEETS_WEBHOOK_URL` (la URL que acaba en `/exec`)
   y `GOOGLE_SHEETS_SECRET` (la misma clave del paso 3). Después, **Redeploy**.

La primera inscripción crea la pestaña «Inscripciones» con las cabeceras.

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

## Analítica y cookies

La analítica es Vercel Web Analytics y solo se carga si el visitante la acepta en el aviso de cookies. Para ver los
datos: Vercel → tu proyecto → **Analytics** → **Enable**. Las páginas legales están en `src/pages/legal/`.

## Despliegue

- **Vercel:** importa el repo en vercel.com → framework "Vite" → deploy. `vercel.json` ya incluye el rewrite para que `/servicios`, `/contacto`… funcionen al recargar.
- **Netlify:** importa el repo → build command `npm run build`, publish directory `dist`. `public/_redirects` ya incluye el fallback SPA.
