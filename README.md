# Train with Jaime — web

React + Vite + TailwindCSS v4 + Framer Motion + react-router-dom.

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
por email de Formspree; basta con que uno de los dos funcione para no perder la inscripción). Ambos pasos los hace
el servidor (`/api/lead`), así que no dependen del navegador de quien rellena el formulario; si algo falla, el motivo
queda en los logs de la función en Vercel (`[lead] …`).

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

## Home (rediseño minimalista)

`src/pages/Home.jsx` solo fija el orden; cada sección está en `src/components/HomeSections.jsx` (titulares Outfit variable 300/800,
fondos `theme-dark` / `theme-blue`, 140 px de aire en escritorio). La barra amarilla superior es `TopBar.jsx` (solo en `/`; el
menú baja 36 px en la home). Los precios salen de `src/data/pricing.js` (Peak no se muestra en la home). Las respuestas del
FAQ que empiezan por `[` están pendientes y no se muestran; búscalas con `TODO` en `HomeSections.jsx`.

## Precios (rediseño minimalista)

`src/pages/Precios.jsx` solo fija el orden; las secciones están en `src/components/PreciosSections.jsx` y reutilizan los helpers de
`HomeSections.jsx`. Planes, precios, prestaciones y tabla salen de `src/data/pricing.js` (Peak no se muestra; las filas de la tabla
que eran solo de Peak se descartan solas). Las plazas del precio fundador del MVP se cambian en `MVP_SPOTS` (`pricing.js`): actualizan
la insignia, la tarjeta y la FAQ. El vídeo del hero está en `HeroVideo.jsx` (`/public/hero.mp4`). El CTA final con la ola de letras
(`WaveCTA.jsx`, CSS puro en `index.css`) lo usan `/` y `/precios`; el resto de páginas siguen con `FinalCTA.jsx`.

## Test de estudihambre

`/test` (`src/pages/Test.jsx`): 6 preguntas → recomienda Rookie, All In o Peak y lleva a `/contacto?plan=…&test=…` con el plan
ya puesto (con amigos, `plan=squad`). No guarda datos. Se promociona en: botón principal del hero, tarjeta "¿Tienes
estudihambre?" de la home, píldora "Test" del menú y franja "¿No sabes qué plan elegir?" bajo los planes. El nº de preguntas
y la duración que se anuncian salen de `TEST` en `src/config.js`.

## Página y plan HYROX (entrenamiento)

- **Página de venta** `/entrenamiento-hyrox` (pestaña "HYROX" del menú, `src/pages/HyroxPlan.jsx`): portada con vídeo de
  fondo, qué es HYROX, el método de Jaime (se entrena en un gimnasio normal), modalidades (individual, dobles o mixtos: el plan
  vale para cualquier HYROX), HYROX Barcelona (14/11/2026, ya vivido: vídeo y galería de fotos), cuenta atrás al siguiente
  HYROX, pasos, para quién, plan y precio, y preguntas. Lleva animaciones al hacer scroll (barra de progreso, fotos con
  parallax, cifras que ruedan, línea de pasos, preguntas que se despliegan); con "reducir movimiento" se quedan quietas.
  **Todos los textos y datos están en `src/data/hyroxPlan.js`** (busca ⚠️): `HYROX_NEXT` (fecha de la cuenta atrás y lugar),
  fotos, vídeos y el copy del método y de lo que incluye el plan, que Jaime debe revisar.
- **Vídeos** (`public/hyrox-comp.mp4` portada, 13 s de la competición, ~3 MB; `public/hyrox-bcn.mp4`, 5 s; sin sonido) y fotos `public/hyrox-*.jpg`.
- **Plan HYROX** (`HYROX_PLAN` en `src/data/pricing.js`): precio **"A consultar con Jaime"** (es personalizado). Sale como
  tarjeta ancha bajo los 4 planes de `/precios` y como una fila más en la lista de la home.
- **Formulario de contacto:** los botones llevan a `/contacto?plan=hyrox&origen=hyrox`. El formulario muestra "Interesado en:
  Plan HYROX" y "Viene de la página HYROX", preselecciona "Entrenar para HYROX", y el email a Jaime llega con asunto
  "Nuevo contacto HYROX", el campo `origen` y el plan marcado como "viene de la página HYROX" (en la hoja de Google queda
  dentro de la columna "Plan").
- **Fotos de HYROX por la web:** carrusel de la home (3 fotos), bloque HYROX de la home, sección "Mi primer HYROX" de Sobre Jaime, tarjeta del plan en `/precios` y pestaña Comunidad de Servicios.
- **Pegatina** en la portada de la home (`src/components/HyroxSticker.jsx`): círculo amarillo "Nuevo · HYROX · Plan" con el
  aro de texto girando, que lleva a `/entrenamiento-hyrox`. Para quitarla, borra `<HyroxSticker …/>` de `src/pages/Home.jsx`.
  El bloque "Entrena para tu HYROX" de la home es `src/components/HyroxPromo.jsx`.

## Lista de espera HYROX (cerrada)

El plan ya está activo, así que se quitó todo lo público de la lista de espera (barra, bloques, formulario). `/hyrox` ahora
redirige a `/entrenamiento-hyrox`. **Se conserva la vista privada** `/admin/hyrox` (y `api/hyrox-stats`) para poder seguir
viendo y descargando los emails que ya se recogieron (`HyroxLead` en Redis). Pide una clave: crea en Vercel →
Settings → Environment Variables **`HYROX_ADMIN_TOKEN`** con una clave larga y redespliega. Cuando ya no hagan falta esos
datos, se pueden borrar de Redis (claves `hyrox:leads` y `hyrox:events`) y eliminar la vista.

## Reseñas y cambios con foto

- **Página pública** `/resenas` ("Qué dicen nuestros clientes", `src/pages/Resenas.jsx`): cambios con foto, reseñas
  publicadas con la nota media y un formulario para escribir la tuya. La home muestra un resumen en "Lo que dicen".
- **Dos carruseles separados** (`src/components/ReviewSliders.jsx`): las reseñas de los clientes y los cambios con foto
  que sube Jaime, cada uno con su título. Se deslizan despacio solos (mismo carrusel que las fotos de la home): 3 reseñas
  a la vez en escritorio, 4 en pantallas grandes. Con pocas tarjetas (menos de 5 reseñas o 3 cambios) se muestran quietas.
- **Reseñas del público:** cualquiera puede enviar la suya (nombre, valoración, texto y consentimiento). **No se publica
  nada sola**: llega como *pendiente* y Jaime la publica, la oculta o la borra. Protecciones: campo trampa, mínimo de
  tiempo, sin enlaces, tope de 200 pendientes y sin guardar email ni IP.
- **Cambios con foto:** Jaime los sube en **`/admin/resenas` → "Cambios con foto"** (foto, título corto, mini texto,
  nombre opcional y la casilla de que tiene el permiso de la persona). La foto se reduce en su navegador y se guarda en
  Redis; se publica al guardar y se puede editar o borrar. Máximo 60.
- **Datos** (`api/_lib/resenas.js`): el mismo Redis de Upstash que HYROX. **Panel privado** `/admin/resenas`: usa la
  misma clave `HYROX_ADMIN_TOKEN`, así que no hay que configurar nada nuevo en Vercel.

## Analítica y cookies

La analítica es Vercel Web Analytics y solo se carga si el visitante la acepta en el aviso de cookies. Para ver los
datos: Vercel → tu proyecto → **Analytics** → **Enable**. Las páginas legales están en `src/pages/legal/`.

## Tipografía y color

- **Outfit** (SIL OFL, libre para uso comercial) en toda la web, servida desde la propia web (`@fontsource/outfit`,
  grosores 300–700 en `src/main.jsx`). Titulares en 300 con negrita para destacar palabras (estilo WHOOP).
- Azul de marca **#041037** (tokens en `src/index.css`: `--color-fg` sobre blanco y `--color-ink` en `.theme-dark`).
- Ojo con las fuentes "gratis" de webs de descargas: muchas son de uso personal y no valen para un negocio.

## Despliegue

- **Vercel:** importa el repo en vercel.com → framework "Vite" → deploy. `vercel.json` ya incluye el rewrite para que `/servicios`, `/contacto`… funcionen al recargar.
- **Netlify:** importa el repo → build command `npm run build`, publish directory `dist`. `public/_redirects` ya incluye el fallback SPA.
