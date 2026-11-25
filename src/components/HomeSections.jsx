import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import '@fontsource-variable/outfit/wght.css'
import Button from './Button.jsx'
import Marquee from './Marquee.jsx'
import { Reveal, Stagger, StaggerItem } from './Reveal.jsx'
import { ArrowIcon, CheckIcon } from './Icons.jsx'
import { Stars } from './Stars.jsx'
import { ReviewsSlider, ChangesSlider } from './ReviewSliders.jsx'
import { EASE } from '../lib/motion.js'
import { useReviews } from '../lib/resenas.js'
import { REAL_TESTIMONIALS as TESTIMONIALS, TEST } from '../config.js'
import { HYROX_PLAN, PRICING } from '../data/pricing.js'
import { HYROX_CONTACT, HYROX_NEXT, HYROX_PAST } from '../data/hyroxPlan.js'

/* ══ Secciones de la home (rediseño minimalista) ═══════════
   Estilo: mucho aire (140 px de padding vertical en escritorio), líneas finas, bloques numerados, botones en píldora.
   Titulares: Outfit variable, tracking -0.04em, línea 1 en 300 y línea 2 en 800. Los colores salen de los tokens de
   index.css: `theme-dark` (navy #041037 / superficie #091844), `theme-blue` (royal #1646C2) y el amarillo de acento. */

export const SECTION = 'border-t border-line py-20 md:py-[140px]'
export const WRAP = 'mx-auto max-w-7xl px-5 md:px-8'
const EYEBROW = 'text-xs font-bold uppercase tracking-[0.25em] text-accent-ink'
const PILL = '!rounded-full'

// Titular de dos líneas: la primera ligera (300) y la segunda en negrita (800)
export function H2({ light, strong, className = '', as: Tag = 'h2' }) {
  return (
    <Tag
      className={`font-variable text-[clamp(2.1rem,6.2vw,5.25rem)] font-light leading-[1.02] tracking-[-0.04em] ${className}`}
    >
      {light}
      {strong && <span className="block font-extrabold [text-wrap:balance]">{strong}</span>}
    </Tag>
  )
}

function Eyebrow({ children, className = '' }) {
  return <p className={`${EYEBROW} ${className}`}>{children}</p>
}

/* ── 1 · Barra superior: ver TopBar.jsx ─────────────────── */

/* ── 3 · Hero ───────────────────────────────────────────── */
// ⚠️ SUSTITUIR VÍDEO DEL HERO: /public/hero.mp4 (H.264, 1080p, < 8 MB, sin audio) y su fotograma /public/hero-poster.jpg.
const HERO_VIDEO = '/hero.mp4'
const HERO_POSTER = '/hero-poster.jpg'

// Los tres pilares de debajo del hero (copy de "La diferencia" de la home anterior)
const PILLARS = [
  { n: '01', title: 'Un plan hecho para ti', text: 'Entrenamiento y nutrición diseñados alrededor de tus clases, tus exámenes y tu presupuesto real.' },
  { n: '02', title: 'Cero postureo', text: 'Nada de rutinas copiadas de Instagram. Medimos marcas, no likes.' },
  { n: '03', title: 'Seguimiento de verdad', text: 'Revisamos tu progreso y ajustamos el plan cada vez que hace falta.' },
]

export function Hero() {
  const videoRef = useRef(null)
  const reduced = !!useReducedMotion()

  // El vídeo solo se reproduce mientras se ve (no gasta batería fuera de pantalla) y no arranca con "reducir movimiento"
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (reduced) return v.pause()
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 })
    io.observe(v)
    return () => io.disconnect()
  }, [reduced])

  // Entrada escalonada: fade + translateY
  const item = (delay) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: EASE } }

  return (
    <section className="theme-dark relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pb-10 pt-44 md:pb-14">
      {/* Vídeo decorativo a pantalla completa (aria-hidden) con poster; solo metadatos hasta que se reproduce */}
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 size-full object-cover"
        src={HERO_VIDEO}
        poster={HERO_POSTER}
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* Velo navy: de abajo arriba y de izquierda a derecha, para que el texto cumpla contraste AA sobre cualquier fotograma */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />

      <div className={WRAP + ' w-full'}>
        <motion.div {...item(0)}>
          <Link
            to="/entrenamiento-hyrox"
            className="group inline-flex max-w-full items-center gap-2 rounded-full border border-accent/70 bg-accent/10 px-4 py-2 text-xs font-semibold text-fg transition-colors hover:bg-accent/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="font-extrabold uppercase tracking-wider text-accent-ink">Nuevo</span>
            <span className="truncate">Jaime te entrena también para tu HYROX</span>
            <ArrowIcon className="h-3 w-3 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div {...item(0.08)}>
          <Eyebrow className="mt-8">Universitarios en Pamplona y online</Eyebrow>
        </motion.div>

        <motion.h1
          {...item(0.16)}
          className="mt-4 font-variable text-[clamp(2.25rem,9.4vw,8.5rem)] font-light leading-[0.98] tracking-[-0.04em]"
        >
          Menos excusas.
          <span className="block font-extrabold">
            <span className="relative inline-block">
              Más resultados.
              {/* Subrayado amarillo animado */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-[0.04em] h-[0.07em] origin-left rounded-full bg-accent"
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
              />
            </span>
          </span>
        </motion.h1>

        <motion.p {...item(0.28)} className="mt-7 max-w-2xl text-base leading-relaxed text-fg-2 md:text-lg">
          Entrenamiento y nutrición personalizados que se adaptan a tus clases, tu trabajo y tus horarios, no al revés.
          Para estudiantes y para cualquiera con una vida con prisa.
        </motion.p>

        <motion.div {...item(0.36)} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button to="/test" className={PILL}>
            Hazte el test de estudihambre <ArrowIcon className="h-4 w-4" />
          </Button>
          <Button to="/contacto" variant="secondary" className={PILL}>
            Primera asesoría gratis
          </Button>
        </motion.div>
        <motion.p {...item(0.42)} className="mt-4 text-sm text-fg-2">
          {TEST.questions} preguntas, {TEST.duration}: te decimos qué plan te encaja y qué descuentos te tocan. Sin compromiso.
        </motion.p>

        {/* Pilares 01–03 */}
        <motion.ul {...item(0.5)} className="mt-14 grid gap-px border-t border-fg/20 md:mt-20 md:grid-cols-3 md:gap-0">
          {PILLARS.map((p) => (
            <li key={p.n} className="py-5 md:py-7 md:pr-8">
              <span className="font-variable text-sm font-bold tracking-widest text-accent-ink">{p.n}</span>
              <p className="mt-2 font-display text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl">{p.title}</p>
              <p className="mt-1.5 hidden text-sm leading-relaxed text-fg-2 md:block">{p.text}</p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

/* ── 4 · Marquee con el eslogan ─────────────────────────── */
const SLOGAN = ['Menos excusas', 'Más resultados', 'Cero postureo', 'Sin atajos, con método', 'Un plan a tu medida']
export function SloganMarquee() {
  return (
    <section className="theme-dark border-y border-line bg-panel py-6 md:py-8" aria-label="Menos excusas. Más resultados. Cero postureo.">
      <Marquee items={SLOGAN} className="text-fg" />
    </section>
  )
}

/* ── 5 · Cómo entrenamos ────────────────────────────────── */
export function Adapts() {
  return (
    <section className={`theme-dark bg-ink ${SECTION}`}>
      <div className={`${WRAP} grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20`}>
        <Reveal as="div">
          <Eyebrow>Cómo entrenamos</Eyebrow>
          <H2 as="h2" light="Tu rutina manda." strong="Tu entrenamiento se adapta." className="mt-5" />
        </Reveal>
        <Reveal as="div">
          <p className="text-base leading-relaxed text-fg-2 md:text-lg">
            No tienes que cambiar tu vida para entrenar: el plan se monta alrededor de tu semana, no al revés. Si un día se
            complica, se ajusta.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Se adapta a">
            {['Tus clases', 'Tu trabajo', 'Tus horarios', 'Tu presupuesto'].map((t) => (
              <li key={t} className="rounded-full border border-fg/25 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-fg">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

/* ── 6 · Entrena acompañado y a tu medida (4 fotos) ─────── */
// ⚠️ REVISAR: pies de foto propuestos.
const ACCOMPANIED = [
  { src: '/img-41.jpg', title: 'Jaime entrena', text: 'Predica con el ejemplo: lo que te manda, lo hace.', alt: 'Jaime en el rack de sentadillas del gimnasio' },
  { src: '/img-42.jpg', title: 'Entrena con gente', text: 'Con amigos es más fácil, y con squad, más barato.', alt: 'Jaime y un amigo sonriendo en un selfie al aire libre' },
  { src: '/img-45.jpg', title: 'Te acompaña', text: 'Revisiones y dudas por WhatsApp, sin PDF y adiós.', alt: 'Portátil con un documento abierto y un cuaderno con apuntes' },
  { src: '/img-26.jpg', title: 'Plan a tu medida', text: 'Montado sobre tu semana, no sobre la de otro.', alt: 'Portátil con el calendario de entrenos y una libreta delante' },
]

export function Accompanied() {
  return (
    <section className={`theme-dark bg-panel ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div" className="max-w-4xl">
          <Eyebrow>Contigo, cada semana</Eyebrow>
          <H2 light="Entrena acompañado" strong="y a tu medida." className="mt-5" />
        </Reveal>
        <Stagger className="mt-14 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-4 md:gap-6">
          {ACCOMPANIED.map((p, i) => (
            <StaggerItem key={p.src} hover className="group">
              <div className="overflow-hidden rounded-2xl border border-line bg-ink">
                <img
                  src={p.src}
                  alt={p.alt}
                  width="1000"
                  height="1333"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-xs font-bold tracking-widest text-accent-ink">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-1 font-display text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* ── 7 · HYROX ──────────────────────────────────────────── */
const HYROX_FACTS = [
  { value: '1', label: `HYROX completado: Barcelona, 14/11/2026` },
  { value: '20/03', label: `próximo HYROX: ${HYROX_NEXT.fecha}` },
]

export function HyroxSection() {
  return (
    <section
      id="hyrox"
      className="theme-dark relative overflow-hidden border-t border-line bg-[linear-gradient(135deg,#1646C2_0%,#0B2A86_55%,#041037_100%)] py-20 md:py-[140px]"
    >
      <div className={`${WRAP} grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20`}>
        <Reveal as="div">
          <Eyebrow>Nuevo plan · HYROX</Eyebrow>
          <H2 light="Jaime te entrena" strong="también para tu HYROX." className="mt-5" />
          <p className="mt-7 max-w-xl text-base leading-relaxed text-fg-2 md:text-lg">
            Prepárate para cualquier HYROX en un gimnasio normal, sin material específico y sin postureo. Es un plan a
            medida: lo consultas con Jaime para que quede lo mejor posible para ti.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Modalidades">
            {['Individual', 'Parejas', 'Mixtos'].map((t) => (
              <li key={t} className="rounded-full border border-fg/40 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-fg">
                {t}
              </li>
            ))}
          </ul>
          <dl className="mt-9 grid max-w-xl gap-px overflow-hidden rounded-2xl border border-fg/25 bg-fg/25 sm:grid-cols-2">
            {HYROX_FACTS.map((f) => (
              <div key={f.value} className="bg-[#0B2A86]/80 p-5">
                <dt className="font-variable text-4xl font-extrabold leading-none tracking-[-0.04em] text-accent-ink md:text-5xl">{f.value}</dt>
                <dd className="mt-2 text-sm leading-snug text-fg-2">{f.label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to="/entrenamiento-hyrox" className={PILL}>
              Ver el plan HYROX <ArrowIcon className="h-4 w-4" />
            </Button>
            <Button to={HYROX_CONTACT} variant="secondary" className={PILL}>
              Consultar con Jaime
            </Button>
          </div>
        </Reveal>

        <Reveal as="div" className="mx-auto grid w-full max-w-md grid-cols-2 items-start gap-3 lg:max-w-none">
          {[
            ['/hyrox-podio.jpg', 'Jaime sentado en el podio de HYROX Barcelona'],
            ['/hyrox-cartel.jpg', 'Jaime con el cartel “My first HYROX” en HYROX Barcelona'],
          ].map(([src, alt], i) => (
            <div key={src} className={`group overflow-hidden rounded-2xl border border-fg/25 ${i === 1 ? 'mt-10' : ''}`}>
              <img
                src={src}
                alt={alt}
                width="1000"
                height="1333"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
              />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* ── 8 · Precios ────────────────────────────────────────── */
// Los precios, textos y enlaces salen de src/data/pricing.js (los mismos que /precios). Peak no se muestra en la home.
const HOME_PLANS = PRICING.filter((p) => p.id !== 'peak')
const featureTitle = (f) => (typeof f === 'string' ? f : f.title)

function PlanCardHome({ p }) {
  const featured = !!p.featured
  return (
    <StaggerItem
      hover
      className={`relative flex flex-col rounded-3xl p-7 md:p-9 ${
        featured ? 'theme-blue border border-[#1646C2] bg-ink text-fg' : 'border border-line bg-panel'
      }`}
    >
      <div className="flex min-h-6 items-center">
        {p.badge && (
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
              featured ? 'bg-accent text-on-accent' : 'border border-accent/60 text-accent-ink'
            }`}
          >
            {p.badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-variable text-4xl font-extrabold leading-none tracking-[-0.04em] md:text-5xl">{p.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-fg-2 md:min-h-[3.25rem]">{p.tagline}</p>
      <p className="mt-8 flex flex-wrap items-baseline gap-x-2 border-t border-fg/15 pt-6">
        <span className="font-variable text-5xl font-light leading-none tracking-[-0.04em] md:text-6xl">{p.price}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">{p.period}</span>
        {p.oldPrice && <del className="text-base text-muted">{p.oldPrice}</del>}
      </p>
      <ul className="mt-6 flex-1 space-y-3">
        {p.features.slice(0, 4).map((f) => (
          <li key={featureTitle(f)} className="flex gap-3 text-sm text-fg-2">
            <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? 'text-accent' : 'text-brand'}`} />
            <span>{featureTitle(f)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button to={`/contacto?plan=${p.id}`} variant={featured ? 'primary' : 'secondary'} className={`${PILL} w-full`}>
          {p.cta} <ArrowIcon className="h-4 w-4" />
        </Button>
      </div>
    </StaggerItem>
  )
}

export function PricingSection() {
  return (
    <section id="precios" className={`theme-dark bg-ink ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div" className="max-w-4xl">
          <Eyebrow>Precios</Eyebrow>
          <H2 light="Elige tu plan." strong="Sin letra pequeña." className="mt-5" />
        </Reveal>

        <Stagger className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
          {HOME_PLANS.map((p) => (
            <PlanCardHome key={p.id} p={p} />
          ))}
        </Stagger>

        {/* Plan HYROX: precio siempre a consultar */}
        <Reveal
          as="div"
          className="mt-5 flex flex-col gap-6 rounded-3xl border-2 border-accent p-7 md:flex-row md:items-center md:justify-between md:p-9"
        >
          <div>
            <p className={EYEBROW}>Nuevo · plan a medida</p>
            <h3 className="mt-2 font-variable text-4xl font-extrabold leading-none tracking-[-0.04em] md:text-5xl">{HYROX_PLAN.name}</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-2 md:text-base">{HYROX_PLAN.summary}</p>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <p className="font-variable text-3xl font-light leading-none tracking-[-0.04em] md:text-4xl">A consultar con Jaime</p>
            <Button to={HYROX_PLAN.href} className={PILL}>
              {HYROX_PLAN.cta} <ArrowIcon className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>

        {/* Descuentos que quedan */}
        <div className="mt-14 grid gap-8 border-y border-line py-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line">
          <div className="md:pr-10">
            <p className="font-variable text-3xl font-light leading-none tracking-[-0.04em] md:text-4xl">
              <span className="font-extrabold text-accent-ink">-10%</span> con carné universitario
            </p>
            <p className="mt-3 text-fg-2">Se verifica cuando hablas con Jaime.</p>
          </div>
          <div className="md:pl-10">
            <p className="font-variable text-3xl font-light leading-none tracking-[-0.04em] md:text-4xl">
              <span className="font-extrabold text-accent-ink">-15%</span> / <span className="font-extrabold text-accent-ink">-25%</span> con tu squad
            </p>
            <p className="mt-3 text-fg-2">
              Si os apuntáis 2 amigos, -15% cada uno; 3 o más, -25%.{' '}
              <Link to="/contacto?plan=squad" className="font-semibold text-brand underline-offset-4 hover:underline">
                Entrar con mi squad →
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-8 text-center">
          <Link to="/precios" className="font-semibold text-brand underline-offset-4 hover:underline">
            Comparar todos los planes →
          </Link>
        </p>
      </div>
    </section>
  )
}

/* ── 9 · ¿Para quién es Train with Jaime? (6 bloques) ───── */
// ⚠️ REVISAR: copy propuesto a partir de lo que ya dice la web (servicios, test y HYROX).
const FOR_WHO = [
  { title: 'Estudiantes con la agenda llena', text: 'Clases, exámenes y prácticas: el plan se monta alrededor de tu semana.' },
  { title: 'Quien nunca ha entrenado', text: 'No hace falta experiencia. Empezamos donde estás tú, no donde “deberías” estar.' },
  { title: 'Quien entrena sin un plan', text: 'Menos improvisar en el gym y más marcas que se ven.' },
  { title: 'Quien quiere correr mejor', text: 'De tu primer 5K a bajar tiempos y aguantar más.' },
  { title: 'Quien prepara un HYROX', text: 'Individual, parejas o mixtos, en un gimnasio normal.' },
  { title: 'Quien come a base de estudihambre', text: 'Recetas de Mercadona, tuppers y comer fuera sin salirte del presupuesto.' },
]

export function ForWho() {
  return (
    <section className={`theme-dark bg-panel ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div" className="max-w-4xl">
          <Eyebrow>Para ti si…</Eyebrow>
          <H2 light="¿Para quién es" strong="Train with Jaime?" className="mt-5" />
        </Reveal>
        <Stagger className="mt-14 grid border-t border-line md:mt-20 md:grid-cols-3">
          {FOR_WHO.map((b, i) => (
            <StaggerItem
              key={b.title}
              hover
              className="border-b border-line px-1 py-9 md:px-8 md:[&:nth-child(3n+1)]:pl-0 md:[&:not(:nth-child(3n+1))]:border-l"
            >
              <p className="font-variable text-sm font-bold tracking-widest text-accent-ink">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">{b.title}</h3>
              <p className="mt-3 text-fg-2">{b.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* ── 10 · Sobre Jaime ───────────────────────────────────── */
// ⚠️ TODO (Jaime): estos datos NO están en la web, así que no se muestran. Si los confirma, se añaden como estadísticas:
//   · años entrenando · nº de personas a las que ha entrenado · medias maratones u otras pruebas completadas
//   · certificación como entrenador (en /sobre-jaime dice "no soy un entrenador certificado (aún)")
const COACH_FACTS = [
  { value: '4º', label: 'curso de Ciencias de la Actividad Física y del Deporte' },
  { value: '1', label: `HYROX completado: ${HYROX_PAST.nombre.replace('HYROX ', '')}, 14 de noviembre de 2026` },
  { value: '20/03', label: 'próximo HYROX, en 2027, y vamos a competir' },
]

export function Coach() {
  return (
    <section className={`theme-dark bg-ink ${SECTION}`}>
      <div className={`${WRAP} grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16 lg:gap-24`}>
        <Reveal as="div" className="mx-auto w-full max-w-xs md:max-w-none">
          <div className="group overflow-hidden rounded-2xl border border-line">
            <img
              src="/img-06.jpg"
              alt="Jaime sonriendo en el gimnasio, de pie frente a la estructura de dominadas con un disco en las manos"
              width="1000"
              height="1333"
              loading="lazy"
              decoding="async"
              draggable={false}
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
            />
          </div>
        </Reveal>
        <Reveal as="div">
          <Eyebrow>Quién te entrena</Eyebrow>
          <H2 light="Soy Jaime," strong="y entreno como tú." className="mt-5" />
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-fg-2 md:text-lg">
            Estudio Ciencias de la Actividad Física y del Deporte y sé lo que es ir con la agenda llena: clases, exámenes y
            presupuesto justo. No soy entrenador certificado (aún), pero aplico lo que estudio y lo que he vivido en mis
            propias carnes. Y no te mando nada que yo no haga: sin postureo, solo plan.
          </p>
          <dl className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {COACH_FACTS.map((f) => (
              <div key={f.value} className="bg-panel p-5">
                <dt className="font-variable text-4xl font-extrabold leading-none tracking-[-0.04em] text-accent-ink md:text-5xl">{f.value}</dt>
                <dd className="mt-3 text-sm leading-snug text-fg-2">{f.label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-9">
            <Button to="/sobre-jaime" variant="secondary" className={PILL}>
              Conoce a Jaime <ArrowIcon className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── 11 · Test de estudihambre (banda azul royal) ───────── */
const TEST_PERKS = [
  ['Tu plan, sin dar vueltas', 'Te decimos qué plan encaja con tu semana y tu bolsillo, y por qué.'],
  ['Los descuentos que te tocan', '-10% con carné universitario y hasta -25% si vais en squad. Sin letra pequeña.'],
  ['Cero datos, cero registro', 'Son solo clics: no te pedimos email ni teléfono para ver el resultado.'],
]

export function TestBand() {
  return (
    <section id="test" className={`theme-blue bg-ink ${SECTION} border-transparent`}>
      <div className={`${WRAP} grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20`}>
        <Reveal as="div" className="min-w-0">
          <Eyebrow>
            {TEST.questions} preguntas · {TEST.duration}
          </Eyebrow>
          <h2 className="mt-5 pb-3 font-variable text-[clamp(2.1rem,6.2vw,5.25rem)] font-extrabold leading-[1.02] tracking-[-0.04em] md:pb-5">
            ¿Eres{' '}
            <span className="inline-block -rotate-3 rounded-xl bg-accent px-3 py-0.5 text-on-accent shadow-[0_6px_0_rgba(4,16,55,0.25)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-rotate-6 md:px-4">
              estudihambre
            </span>
            ?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-2 md:mt-6 md:text-lg">
            Pasta, pizza y lo que caiga no es un plan. Haz el test y te decimos qué plan te encaja de verdad.
          </p>
          <div className="mt-9">
            <Button to="/test" className={`${PILL} w-full sm:w-auto`}>
              Hazte el test de estudihambre <ArrowIcon className="h-4 w-4 shrink-0" />
            </Button>
          </div>
        </Reveal>
        <Stagger as="ul" className="grid min-w-0 gap-3">
          {TEST_PERKS.map(([t, d]) => (
            <StaggerItem key={t} as="li" hover className="flex gap-4 rounded-2xl border border-line bg-panel p-5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl">{t}</span>
                <span className="mt-1 block text-sm leading-relaxed text-fg-2">{d}</span>
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* ── 12 · Tira de fotos en marquee ──────────────────────── */
export function PhotoStrip({ photos }) {
  const row = (hidden) => (
    <ul className="flex shrink-0 gap-4 pr-4 md:gap-6 md:pr-6" aria-hidden={hidden || undefined}>
      {photos.map((p) => (
        <li key={p.src} className="group w-44 shrink-0 overflow-hidden rounded-2xl border border-line sm:w-56 md:w-64">
          <img
            src={p.src}
            alt={hidden ? '' : p.alt}
            width="1000"
            height="1333"
            loading="lazy"
            decoding="async"
            draggable={false}
            className="aspect-[3/4] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
          />
        </li>
      ))}
    </ul>
  )
  return (
    <section className={`theme-dark bg-ink ${SECTION} overflow-hidden`}>
      <div className={WRAP}>
        <Reveal as="div" className="max-w-4xl">
          <Eyebrow>Directo del gym</Eyebrow>
          <H2 light="Entrenos reales." strong="Sin postureo." className="mt-5" />
        </Reveal>
      </div>
      {/* Marquee infinito (se mueve la mitad; con "reducir movimiento" queda quieto y se puede desplazar a mano) */}
      <div className="mt-14 overflow-hidden motion-reduce:overflow-x-auto md:mt-20">
        <div className="marquee flex w-max motion-reduce:animate-none" style={{ animationDuration: '60s' }}>
          {row(false)}
          <div className="flex motion-reduce:hidden">{row(true)}</div>
        </div>
      </div>
    </section>
  )
}

/* ── 13 · Así funciona ──────────────────────────────────── */
// Mismo copy que "Cómo funciona" de /servicios (⚠️ copia: si cambia allí, cámbialo aquí).
const HOW = [
  { title: 'Primera asesoría gratis', text: 'Le cuentas tu objetivo a Jaime y te dice qué plan te encaja, sin compromiso.' },
  { title: 'Un plan hecho para ti', text: 'Entrenamiento y nutrición diseñados alrededor de tus clases, tus exámenes y tu presupuesto real.' },
  { title: 'Seguimiento de verdad', text: 'Revisiones por WhatsApp, análisis de técnica en vídeo y una plataforma solo para clientes.' },
  { title: 'Resultados que se miden', text: 'Medimos marcas, no likes: registramos tu progreso y ajustamos el plan cuando hace falta.' },
]

export function HowItWorks() {
  return (
    <section className={`theme-dark bg-panel ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div" className="max-w-4xl">
          <Eyebrow>En cuatro pasos</Eyebrow>
          <H2 light="Así" strong="funciona." className="mt-5" />
        </Reveal>
        <Stagger as="ol" className="mt-14 grid border-t border-line md:mt-20 md:grid-cols-4">
          {HOW.map((s, i) => (
            <StaggerItem
              key={s.title}
              as="li"
              hover
              className="border-b border-line py-9 md:border-b-0 md:px-7 md:first:pl-0 md:[&:not(:first-child)]:border-l"
            >
              <p className="font-variable text-5xl font-extrabold leading-none tracking-[-0.04em] text-accent-ink">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-2">{s.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* ── 14 · Lo que dicen ──────────────────────────────────── */
export function Reviews() {
  // Reseñas publicadas y cambios con foto de /api/resenas; Jaime los gestiona en /admin/resenas.
  // Los testimonios escritos a mano en src/config.js (TESTIMONIALS) van los primeros.
  const { data } = useReviews()
  const written = TESTIMONIALS.map((t, i) => ({ id: `t${i}`, nombre: t.author, detalle: t.detail, estrellas: 0, texto: t.quote, fecha: '' }))
  const reviews = [...written, ...(data?.resenas ?? [])]
  const cambios = data?.cambios ?? []
  return (
    <section className={`theme-dark bg-ink ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div" className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Clientes</Eyebrow>
            <H2 light="Lo que" strong="dicen." className="mt-5" />
          </div>
          {data?.total > 0 && (
            <p className="flex items-center gap-3 text-fg-2">
              <Stars value={data.media} className="h-6 w-6" />
              <span className="text-lg font-semibold text-fg">{String(data.media).replace('.', ',')}</span>
              <span className="text-sm">· {data.total} {data.total === 1 ? 'reseña' : 'reseñas'}</span>
            </p>
          )}
        </Reveal>

        <div className="mt-14 md:mt-20">
          {reviews.length > 0 ? (
            <ReviewsSlider items={reviews} />
          ) : (
            <p className="max-w-2xl text-lg text-fg-2">
              Aquí irán las opiniones de quienes entrenan con Jaime. ¿Has entrenado con él? Cuéntanos cómo te ha ido.
            </p>
          )}
        </div>

        {cambios.length > 0 && (
          <div className="mt-16 md:mt-20">
            <h3 className="mb-8 font-display text-3xl leading-tight tracking-[-0.03em] md:text-5xl">Cambios reales</h3>
            <ChangesSlider items={cambios} />
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          {(reviews.length > 0 || cambios.length > 0) && (
            <Button to="/resenas" variant="secondary" className={PILL}>
              Ver todas las reseñas
            </Button>
          )}
          <Button to="/resenas#escribir" className={PILL}>
            Escribir mi reseña
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ── 15 · FAQ ───────────────────────────────────────────── */
// Las respuestas que empiezan por "[" son pendientes y NO se muestran en la web (misma convención que config.js).
// ⚠️ TODO (Jaime): rellenar las dos respuestas marcadas [TU RESPUESTA]. Las preguntas 3 y 4 son una propuesta mía.
const FAQ = [
  {
    q: '¿El primer contacto tiene coste?',
    a: 'No. El primer contacto y asesoramiento con Jaime es gratis y sin compromiso: le cuentas tu objetivo y te dice qué plan te encaja.',
  },
  {
    q: '¿Necesito experiencia previa?',
    a: 'No. El plan se adapta a tu nivel, tanto si nunca has pisado un gimnasio como si ya compites.',
  },
  { q: '¿Y si mi semana cambia o se me complica?', a: '[TU RESPUESTA]' }, // TODO
  { q: '¿Puedo cambiar de plan más adelante?', a: '[TU RESPUESTA]' }, // TODO
]

export function Faq() {
  const items = FAQ.filter((f) => !f.a.trim().startsWith('['))
  return (
    <section className={`theme-dark bg-panel ${SECTION}`}>
      <div className={`${WRAP} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24`}>
        <Reveal as="div">
          <Eyebrow>Dudas</Eyebrow>
          <H2 light="Preguntas" strong="frecuentes." className="mt-5" />
        </Reveal>
        <Reveal as="div" className="divide-y divide-line border-y border-line">
          {items.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:text-xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-2xl leading-none text-accent-ink transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-fg-2">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
