import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import '@fontsource-variable/outfit/wght.css'
import Button from './Button.jsx'
import { Reveal } from './Reveal.jsx'
import { ArrowIcon } from './Icons.jsx'
import { Stars } from './Stars.jsx'
import { ReviewsSlider, ChangesSlider } from './ReviewSliders.jsx'
import { EASE } from '../lib/motion.js'
import { useReviews } from '../lib/resenas.js'
import { REAL_TESTIMONIALS as TESTIMONIALS, TEST } from '../config.js'
import { HYROX_PLAN, PRICING } from '../data/pricing.js'
import { HYROX_CONTACT } from '../data/hyroxPlan.js'

/* ══ Secciones de la home (rediseño minimalista) ═══════════
   Sigue el prototipo aprobado (Main.dc.html): 140 px de aire vertical, líneas finas, bloques numerados, botones en píldora,
   titulares Outfit variable con tracking -0.04em (línea ligera 300 + palabra en 800). Los colores salen de los tokens de
   index.css: `theme-dark` (navy #041037, superficie #091844), `theme-blue` (royal #1646C2) y el amarillo de acento. */

const SECTION = 'py-20 md:py-[140px]'
const WRAP = 'mx-auto max-w-[1200px] px-5 md:px-8'
const LIGHT_BLUE = 'text-[#7FA6FF]' // azul claro del prototipo (números 01–06)
const LINE = 'border-t border-white/25'

// Botones del prototipo: píldora de 48 px, 13 px en negrita con tracking 1.2 px (se apoyan en el componente Button)
const BTN = '!min-h-12 !rounded-full !px-7 !py-0 !text-[13px] !font-bold !tracking-[1.2px]'
const BTN_O = `${BTN} !border-[1.5px] !border-white/55`

// Tamaños de titular (máx. = valor del prototipo en escritorio; en móvil escalan con clamp)
const SIZE = {
  xl: 'text-[clamp(2.5rem,6.7vw,96px)]', // 96
  lg: 'text-[clamp(2.5rem,5.9vw,84px)]', // 84
  md: 'text-[clamp(2.4rem,5vw,72px)]', // 72
  test: 'text-[clamp(2.5rem,6.1vw,88px)]', // 88
  faq: 'text-[clamp(2.3rem,4.4vw,64px)]', // 64
  sm: 'text-[clamp(2rem,3.4vw,48px)]', // 48
}

// Titular: parte ligera (300) y parte en negrita (800); `br` = la negrita va en otra línea
export function H2({ light, strong, size = 'xl', br = true, className = '' }) {
  return (
    <h2 className={`font-variable font-light leading-none tracking-[-0.04em] ${SIZE[size]} ${className}`}>
      {light}
      {strong && (br ? <span className="block font-extrabold [text-wrap:balance]">{strong}</span> : <span className="font-extrabold">{strong}</span>)}
    </h2>
  )
}

const Eyebrow = ({ children, className = '' }) => (
  <p className={`text-xs font-bold uppercase tracking-[3px] text-accent-ink ${className}`}>{children}</p>
)

// Foto con zoom suave al pasar el ratón (el contenedor recorta)
const ZOOM = 'transition-transform duration-[900ms] ease-out motion-safe:group-hover:scale-[1.06]'
const Photo = ({ src, alt, className = '', pos }) => (
  <img
    src={src}
    alt={alt}
    width="1000"
    height="1333"
    loading="lazy"
    decoding="async"
    draggable={false}
    style={pos ? { objectPosition: pos } : undefined}
    className={`size-full object-cover ${ZOOM} ${className}`}
  />
)

/* ── 3 · Hero ───────────────────────────────────────────── */
// ⚠️ SUSTITUIR VÍDEO DEL HERO: /public/hero.mp4 (H.264, 1080p, < 8 MB, sin audio) y su fotograma /public/hero-poster.jpg.
const HERO_VIDEO = '/hero.mp4'
const HERO_POSTER = '/hero-poster.jpg'

const PILLARS = [
  { n: '01', title: 'Un plan hecho para ti', text: 'Alrededor de tus clases, tus exámenes y tu presupuesto real.' },
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

  // Entrada escalonada: fade + translateY(36px)
  const item = (delay) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 36 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] } }

  return (
    <section className="theme-dark relative isolate flex min-h-[760px] flex-col justify-end overflow-hidden bg-[radial-gradient(110%_80%_at_78%_8%,#1646C2_0%,#091844_52%,#041037_100%)] pb-12 pt-44 md:pb-[72px]">
      {/* Vídeo decorativo a pantalla completa (aria-hidden); solo metadatos hasta que se reproduce */}
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 size-full object-cover opacity-55"
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
      {/* Velo navy para que el texto se lea: del prototipo (de arriba abajo) + uno lateral para el contraste AA sobre el vídeo */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,16,55,.45)_0%,rgba(4,16,55,.15)_40%,#041037_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent" />

      <div className={WRAP + ' w-full'}>
        <motion.div {...item(0)}>
          <Link
            to="/entrenamiento-hyrox"
            className="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-accent px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-accent-ink transition-colors hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span>Nuevo · Jaime te entrena también para tu HYROX →</span>
          </Link>
        </motion.div>

        <motion.div {...item(0.05)}>
          <Eyebrow>Universitarios en Pamplona y online</Eyebrow>
        </motion.div>

        <h1 className="mt-6 font-variable text-[clamp(2.5rem,8.9vw,128px)] font-light leading-[.98] tracking-[-0.045em]">
          <motion.span className="block" {...item(0.15)}>
            Menos excusas.
          </motion.span>
          <motion.span className="block font-extrabold" {...item(0.3)}>
            <span className="relative inline-block">
              Más resultados.
              {/* Subrayado amarillo animado */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[-0.02em] h-[0.07em] origin-left bg-accent"
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
              />
            </span>
          </motion.span>
        </h1>

        <motion.p {...item(0.5)} className="mt-8 max-w-[620px] text-lg leading-[1.5] text-white/80 md:text-xl">
          Entrenamiento y nutrición personalizados que se adaptan a tus clases, tu trabajo y tus horarios, no al revés. Para
          estudiantes y para cualquiera con una vida con prisa.
        </motion.p>

        <motion.div {...item(0.5)} className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
          <Button to="/test" className={BTN}>
            Hazte el test de estudihambre <ArrowIcon className="h-4 w-4" />
          </Button>
          <Button to="/contacto" variant="secondary" className={BTN_O}>
            Primera asesoría gratis
          </Button>
        </motion.div>
        <p className="mt-4 text-sm text-white/70">
          {TEST.questions} preguntas, {TEST.duration}: te decimos qué plan te encaja y qué descuentos te tocan.
        </p>

        {/* Pilares 01–03 */}
        <ul className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
          {PILLARS.map((p) => (
            <Reveal as="li" key={p.n} className={`${LINE} pt-5`}>
              <p className={`text-[13px] font-semibold tracking-[2px] ${LIGHT_BLUE}`}>{p.n}</p>
              <p className="mt-2.5 text-xl font-bold uppercase tracking-[-0.01em]">{p.title}</p>
              <p className="mt-2 text-[15px] leading-normal text-white/75">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── 4 · Marquee (los titulares de las fotos de la galería) ─ */
const SLOGANS = [
  'Aquí no entrenas solo',
  'Más peso en la barra, semana a semana',
  'Sin atajos, con método',
  'Llega en tu mejor versión',
  'Resultados sin humo',
  'Cero postureo, mucho plan',
  'Mi primer HYROX, y no será el último',
]
export function SloganMarquee() {
  const row = (
    <div className="flex shrink-0">
      {SLOGANS.map((t) => (
        <span key={t} className="pr-12">
          {t} <b className="text-accent">•</b>
        </span>
      ))}
    </div>
  )
  return (
    <section className="theme-dark overflow-hidden border-y border-white/[.14] bg-ink py-[26px]" aria-hidden="true">
      <div className="marquee flex w-max whitespace-nowrap text-[28px] font-light tracking-[-0.01em] motion-reduce:w-full motion-reduce:overflow-x-auto" style={{ animationDuration: '40s' }}>
        {row}
        <div className="flex motion-reduce:hidden">{row}</div>
      </div>
    </section>
  )
}

/* ── 5 · Cómo entrenamos ────────────────────────────────── */
export function Adapts() {
  return (
    <section className={`theme-dark bg-ink ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div">
          <Eyebrow>Cómo entrenamos</Eyebrow>
          <H2 light="Tu rutina manda." strong="Tu entrenamiento se adapta." className="mt-6" />
        </Reveal>
        <p className="mt-8 max-w-[600px] text-lg leading-[1.55] text-white/80 md:text-xl">
          No tienes que cambiar tu vida para entrenar: el plan se monta alrededor de tu semana, no al revés. Si un día se
          complica, se ajusta.
        </p>
        <ul className="mt-10 flex flex-wrap gap-3" aria-label="Se adapta a">
          {['Tus clases', 'Tu trabajo', 'Tus horarios', 'Tu presupuesto'].map((t) => (
            <li key={t} className="rounded-full border border-white/35 px-[22px] py-2.5 text-xs font-semibold uppercase tracking-[2px]">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── 6 · Entrena acompañado y a tu medida (4 fotos) ─────── */
const ACCOMPANIED = [
  { src: '/img-41.jpg', tag: 'Entrena', text: 'Entrenos personalizados para ganar.', alt: 'Jaime haciendo series en el rack de sentadillas del gimnasio' },
  { src: '/img-42.jpg', tag: 'Entrena con gente', text: 'Aquí no entrenas solo.', alt: 'Jaime y un amigo sonriendo en un selfie al aire libre' },
  { src: '/hyrox-juntos.jpg', tag: 'Te acompaña', text: 'Revisamos tu progreso y ajustamos el plan cuando hace falta.', alt: 'Jaime posando abrazado a otra persona delante del panel de HYROX Barcelona' },
  { src: '/img-26.jpg', tag: 'Plan a medida', text: 'Hecho alrededor de tus clases, tus exámenes y tu presupuesto.', alt: 'Portátil con el calendario de entrenos en pantalla y una libreta delante' },
]

export function Accompanied() {
  return (
    <section className={`theme-dark bg-panel ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div">
          <Eyebrow>En acción</Eyebrow>
          <H2 light="Entrena acompañado" strong="y a tu medida." className="mt-6" />
        </Reveal>
        <p className="mt-7 max-w-[560px] text-lg leading-[1.55] text-white/80">
          Jaime no te manda nada que no haga él, entrena con su gente y te sigue semana a semana con un plan hecho para ti.
        </p>
        <div className="mt-14 grid grid-cols-2 items-start gap-4 md:mt-[72px] md:grid-cols-4 md:gap-6">
          {ACCOMPANIED.map((p, i) => (
            <Reveal
              key={p.src}
              as="div"
              className={`group relative aspect-[3/4] overflow-hidden rounded-[20px] border border-white/[.18] ${i % 2 ? 'mt-10 md:mt-14' : ''}`}
            >
              <Photo src={p.src} alt={p.alt} className="absolute inset-0" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#041037]/90 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 md:inset-x-[22px] md:bottom-[22px]">
                <p className="text-[11px] font-bold uppercase tracking-[3px] text-accent-ink md:text-xs">{p.tag}</p>
                <p className="mt-2 text-base font-semibold leading-tight md:text-xl md:leading-[1.25]">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 7 · HYROX ──────────────────────────────────────────── */
const FACTS_HYROX = [
  { value: '1', label: 'HYROX completado: Barcelona, 14 de noviembre de 2026' },
  { value: '20/03', label: 'próximo HYROX, en 2027, y vamos a competir' },
]

export function HyroxSection() {
  return (
    <section id="hyrox" className={`theme-dark bg-[linear-gradient(135deg,#0E2F8F_0%,#091844_100%)] ${SECTION}`}>
      <div className={`${WRAP} grid items-center gap-14 md:grid-cols-2 md:gap-[72px]`}>
        <div>
          <Reveal as="div">
            <Eyebrow>Nuevo · Plan HYROX</Eyebrow>
            <H2 light="Jaime te entrena " strong="también para tu HYROX." size="md" br={false} className="mt-6" />
          </Reveal>
          <p className="mt-7 text-lg leading-[1.6] text-white/80">
            Prepárate para cualquier HYROX en un gimnasio normal, sin material específico y sin postureo. Individual,
            parejas o mixtos. Es un plan a medida: lo consultas con Jaime para que quede lo mejor posible para ti.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Modalidades">
            {['Individual', 'Parejas', 'Mixtos'].map((t) => (
              <li key={t} className="rounded-full border border-white/35 px-[18px] py-2 text-xs font-semibold uppercase tracking-[2px]">
                {t}
              </li>
            ))}
          </ul>
          <dl className="mt-9 grid gap-6 sm:grid-cols-2">
            {FACTS_HYROX.map((f) => (
              <Reveal as="div" key={f.value} className={`${LINE} pt-4`}>
                <dt className="text-[44px] font-light leading-none tracking-[-0.03em]">{f.value}</dt>
                <dd className="mt-1.5 text-[13px] leading-[1.45] text-white/70">{f.label}</dd>
              </Reveal>
            ))}
          </dl>
          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Button to="/entrenamiento-hyrox" className={BTN}>
              Ver el plan HYROX
            </Button>
            <Button to={HYROX_CONTACT} variant="secondary" className={BTN_O}>
              Consultar precio
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {[
            ['/hyrox-podio.jpg', 'Jaime sentado en el podio de HYROX Barcelona', '50% 38%'],
            ['/hyrox-cartel.jpg', 'Jaime con el cartel “My first HYROX” en HYROX Barcelona', '50% 40%'],
          ].map(([src, alt, pos]) => (
            <Reveal as="div" key={src} className="group aspect-[16/10] overflow-hidden rounded-[20px] border border-white/[.18]">
              <Photo src={src} alt={alt} pos={pos} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 8 · Precios ────────────────────────────────────────── */
// Precios, resúmenes, insignias y enlaces: de src/data/pricing.js (los mismos que /precios). Peak no se muestra en la home.
// Las listas cortas con ✓ son las del prototipo (resumen de las prestaciones completas).
const HOME_PLANS = PRICING.filter((p) => p.id !== 'peak')
const BULLETS = {
  rookie: ['Entrenamiento personalizado', 'Revisión por WhatsApp cada 15 días'],
  allin: ['Entrenamiento personalizado', 'Nutrición', 'Revisión semanal', 'Videollamada mensual'],
  mvp: ['Todo lo de All In', '2 entrenos al mes en directo con Jaime'],
}

function PlanCardHome({ p }) {
  const featured = !!p.featured
  return (
    <Reveal
      as="div"
      className={`flex min-h-[560px] flex-col rounded-3xl px-7 py-9 transition-transform duration-[350ms] motion-safe:hover:-translate-y-2 md:px-9 md:py-10 ${
        featured ? 'bg-[#1646C2]' : 'border border-white/[.22]'
      }`}
    >
      <p className={`text-xs font-bold uppercase tracking-[3px] ${p.badge ? 'text-accent-ink' : LIGHT_BLUE}`}>{p.badge || 'Para empezar'}</p>
      <h3 className="mt-3.5 font-variable text-5xl font-bold leading-[1.1] tracking-[-0.03em]">{p.name}</h3>
      <p className={`mt-3.5 text-base leading-[1.55] ${featured ? 'text-white/90' : 'text-white/80'}`}>{p.summary}</p>
      <ul className="mt-7 flex flex-col gap-3 text-[15px] text-white/90">
        {BULLETS[p.id].map((t) => (
          <li key={t}>✓&nbsp; {t}</li>
        ))}
      </ul>
      <div className="grow" />
      <p className="mt-9 text-[clamp(2.75rem,4.2vw,60px)] font-light leading-none tracking-[-0.04em]">
        {p.price}
        <span className="text-base font-normal tracking-normal text-white/75">
          {' '}
          {p.period}
          {p.oldPrice && (
            <>
              {' · antes '}
              <s>{p.oldPrice}</s>
            </>
          )}
        </span>
      </p>
      <Button to={`/contacto?plan=${p.id}`} variant={featured ? 'primary' : 'secondary'} className={`${featured ? BTN : BTN_O} mt-6 w-full`}>
        {p.cta}
      </Button>
    </Reveal>
  )
}

export function PricingSection() {
  return (
    <section id="precios" className={`theme-dark bg-ink ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div">
          <Eyebrow>Precios</Eyebrow>
          <H2 light="Elige " strong="tu plan." br={false} className="mt-6" />
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 md:mt-16 md:grid-cols-3">
          {HOME_PLANS.map((p) => (
            <PlanCardHome key={p.id} p={p} />
          ))}
        </div>

        {/* Plan HYROX: precio siempre a consultar */}
        <Reveal
          as="div"
          className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-accent px-7 py-8 transition-transform duration-[350ms] motion-safe:hover:-translate-y-2 md:px-9"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[3px] text-accent-ink">Nuevo · a medida</p>
            <h3 className="mt-2 font-variable text-4xl font-bold leading-[1.1] tracking-[-0.03em]">Plan {HYROX_PLAN.name}</h3>
            <p className="mt-2 max-w-[560px] text-base leading-[1.55] text-white/80">
              Jaime te entrena también para tu HYROX: plan a medida, que se consulta con él para hacerlo lo mejor posible.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <p className="text-[28px] font-light">
              A consultar <span className="text-[15px] font-normal text-white/70">con Jaime</span>
            </p>
            <Button to={HYROX_PLAN.href} className={BTN}>
              Consultar mi plan
            </Button>
          </div>
        </Reveal>

        {/* Descuentos que quedan + test */}
        <div className="mt-10 grid items-start gap-6 md:grid-cols-3">
          <div className={`${LINE} pt-[18px]`}>
            <p className="text-xl font-bold">−10% con carné universitario</p>
            <p className="mt-1.5 text-[15px] text-white/75">Se verifica cuando hablas con Jaime.</p>
          </div>
          <div className={`${LINE} pt-[18px]`}>
            <p className="text-xl font-bold">−15% / −25% con tu squad</p>
            <p className="mt-1.5 text-[15px] text-white/75">
              Si os apuntáis 2 amigos, −15% cada uno; 3 o más, −25%. Alta conjunta en Rookie y All In.
            </p>
          </div>
          <div className={`${LINE} pt-[18px]`}>
            <p className="text-xl font-bold">¿No sabes qué plan elegir?</p>
            <Link to="/test" className="mt-1.5 inline-block text-[15px] font-semibold text-accent-ink hover:underline">
              Hazte el test de estudihambre →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 9 · ¿Para quién es Train with Jaime? (6 bloques) ───── */
const FOR_WHO = [
  { title: 'Gimnasio y fuerza', text: 'Más peso en la barra, semana a semana, con método y sin atajos.' },
  { title: 'Entrenamiento funcional', text: 'Fuerza y condición física para rendir mejor en tu deporte y en el día a día.' },
  { title: 'HYROX', text: 'Jaime te entrena también para tu HYROX, en un gimnasio normal y sin material específico.' },
  { title: 'Running para empezar', text: 'Tu primer 5K o 10K sin lesionarte ni volverte loco.' },
  { title: 'Nutrición de estudiante', text: 'Comer bien con un presupuesto real, con productos de supermercado de siempre.' },
  { title: 'Tu plan, a tu medida', text: 'Si tu objetivo no encaja en una casilla, lo hablamos y lo diseñamos contigo.' },
]

export function ForWho() {
  return (
    <section id="servicios" className={`theme-dark bg-panel ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div" className="text-center">
          <H2 light="¿Para quién es " strong="Train with Jaime?" size="lg" br={false} />
          <p className="mx-auto mt-6 max-w-[560px] text-lg leading-[1.55] text-white/80">
            Tanto si empiezas de cero como si tienes una meta clara, hay un plan para tu semana.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-x-10 gap-y-14 md:mt-20 md:grid-cols-3">
          {FOR_WHO.map((b, i) => (
            <Reveal as="div" key={b.title} className={`${LINE} pt-5`}>
              <p className={`text-[44px] font-extralight leading-none ${LIGHT_BLUE}`}>{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-3.5 font-variable text-xl font-bold uppercase leading-tight tracking-normal">{b.title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.55] text-white/75">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 10 · Sobre Jaime ───────────────────────────────────── */
// Datos confirmados por Jaime. Otros (años entrenando, medias maratones, certificación) no constan, así que no se muestran.
const COACH_FACTS = [
  { value: '4º', label: 'curso de Ciencias de la Actividad Física y del Deporte' },
  { value: '4', label: 'personas entrenadas: HYROX, carreras, gym y entreno funcional' },
  ...FACTS_HYROX,
]

export function Coach() {
  return (
    <section id="jaime" className={`theme-dark bg-ink ${SECTION}`}>
      <div className={`${WRAP} grid items-center gap-12 md:grid-cols-2 md:gap-20`}>
        <Reveal as="div" className="group mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl md:max-w-none">
          <Photo
            src="/img-06.jpg"
            alt="Jaime sonriendo en el gimnasio, de pie frente a la estructura de dominadas con un disco en las manos"
          />
        </Reveal>
        <div>
          <Reveal as="div">
            <Eyebrow>Quién te entrena</Eyebrow>
            <H2 light="Soy Jaime," strong="y entreno como tú." size="md" className="mt-6" />
          </Reveal>
          <p className="mt-7 text-lg leading-[1.6] text-white/80">
            Estudio Ciencias de la Actividad Física y del Deporte y sé lo que es ir con la agenda llena: clases, exámenes y
            presupuesto justo. No soy entrenador certificado (aún), pero aplico lo que estudio y lo que he vivido en mis
            propias carnes. Y no te mando nada que yo no haga: sin postureo, solo plan.
          </p>
          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            {COACH_FACTS.map((f) => (
              <div key={f.value} className={`${LINE} pt-4`}>
                <dt className="text-[44px] font-light leading-none tracking-[-0.03em]">{f.value}</dt>
                <dd className="mt-1.5 text-[13px] leading-[1.45] text-white/70">{f.label}</dd>
              </div>
            ))}
          </dl>
          <Button to="/sobre-jaime" variant="secondary" className={`${BTN_O} mt-10`}>
            Conoce a Jaime
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ── 11 · Test de estudihambre (banda azul royal) ───────── */
export function TestBand() {
  return (
    <section id="test" className={`theme-blue bg-ink text-center ${SECTION}`}>
      <div className="mx-auto max-w-[900px] px-5 md:px-8">
        <Reveal as="div">
          <Eyebrow>Primer paso · gratis</Eyebrow>
          <h2 className={`mt-6 font-variable font-light leading-none tracking-[-0.04em] ${SIZE.test}`}>
            Hazte el test de{' '}
            <span className="inline-block -rotate-3 rounded-xl bg-accent px-3 py-0.5 font-extrabold text-on-accent shadow-[0_6px_0_rgba(4,16,55,0.25)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-rotate-6 md:px-4">
              estudihambre.
            </span>
          </h2>
        </Reveal>
        <p className="mx-auto mt-7 max-w-[560px] text-lg leading-[1.5] text-white/90 md:text-xl">
          {TEST.questions} preguntas, {TEST.duration}: te decimos qué plan te encaja y qué descuentos te tocan.
        </p>
        <Button to="/test" className={`${BTN} mt-9`}>
          Empezar el test <ArrowIcon className="h-4 w-4" />
        </Button>
        <p className="mt-4 text-sm text-white/90">
          Cero datos, cero registro: son solo clics. No te pedimos email ni teléfono para ver el resultado.
        </p>
      </div>
    </section>
  )
}

/* ── 12 · Tira de fotos en marquee ──────────────────────── */
export function PhotoStrip({ photos }) {
  const row = (hidden) => (
    <ul className="flex shrink-0 gap-5 pr-5" aria-hidden={hidden || undefined}>
      {photos.map((p) => (
        <li key={p.src} className="group w-[220px] shrink-0 overflow-hidden rounded-[20px] sm:w-[260px] md:w-[300px]">
          <img
            src={p.src}
            alt={hidden ? '' : p.alt}
            width="1000"
            height="1333"
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`aspect-[3/4] w-full object-cover ${ZOOM}`}
          />
        </li>
      ))}
    </ul>
  )
  return (
    <section className="theme-dark overflow-hidden bg-panel py-20 md:py-[120px]">
      <div className={`${WRAP} mb-12 md:mb-14`}>
        <Reveal as="div">
          <Eyebrow>Del día a día</Eyebrow>
          <H2 light="Entrenos reales. " strong="Sin postureo." size="md" br={false} className="mt-6" />
        </Reveal>
      </div>
      {/* Marquee infinito (se mueve la mitad; con "reducir movimiento" queda quieto y se puede desplazar a mano) */}
      <div className="overflow-hidden motion-reduce:overflow-x-auto">
        <div className="marquee flex w-max motion-reduce:animate-none" style={{ animationDuration: '70s' }}>
          {row(false)}
          <div className="flex motion-reduce:hidden">{row(true)}</div>
        </div>
      </div>
    </section>
  )
}

/* ── 13 · Así funciona ──────────────────────────────────── */
const HOW = [
  { title: 'Cuéntanos', text: 'Primera asesoría gratis: tu semana, tus objetivos y tu presupuesto.' },
  { title: 'Te lo montamos', text: 'Entrenamiento y nutrición hechos a tu medida.' },
  { title: 'Entrenas', text: 'Entre clase y clase, a tu ritmo y sin postureo.' },
  { title: 'Ajustamos', text: 'Revisamos tu progreso y cambiamos el plan cuando hace falta.' },
]

export function HowItWorks() {
  return (
    <section className={`theme-dark bg-ink ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div">
          <H2 light="Así " strong="funciona." size="md" br={false} />
          <p className="mt-4 text-lg text-white/75">Sin formularios eternos: hablas con Jaime y empiezas.</p>
        </Reveal>
        <ol className="mt-14 grid gap-8 md:mt-16 md:grid-cols-4">
          {HOW.map((s, i) => (
            <Reveal as="li" key={s.title} className={`${LINE} pt-5`}>
              <p className={`text-[44px] font-extralight leading-none ${LIGHT_BLUE}`}>{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 font-variable text-lg font-bold uppercase leading-tight tracking-normal">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-normal text-white/75">{s.text}</p>
            </Reveal>
          ))}
        </ol>
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
  const any = reviews.length > 0 || cambios.length > 0
  return (
    <section className="theme-dark bg-panel py-[100px]">
      <div className={WRAP}>
        <Reveal as="div" className="mx-auto max-w-[700px] text-center">
          <H2 light="Lo que " strong="dicen." size="sm" br={false} />
          {data?.total > 0 && (
            <p className="mt-4 flex items-center justify-center gap-3 text-white/80">
              <Stars value={data.media} className="h-6 w-6" />
              <span className="text-lg font-semibold text-white">{String(data.media).replace('.', ',')}</span>
              <span className="text-sm">· {data.total} {data.total === 1 ? 'reseña' : 'reseñas'}</span>
            </p>
          )}
          {!any && (
            <p className="mt-4 text-lg leading-[1.55] text-white/80">
              Aquí irán las opiniones de quienes entrenan con Jaime. ¿Has entrenado con él? Cuéntanos cómo te ha ido.
            </p>
          )}
        </Reveal>

        {reviews.length > 0 && (
          <div className="mt-12">
            <ReviewsSlider items={reviews} />
          </div>
        )}
        {cambios.length > 0 && (
          <div className="mt-14">
            <h3 className="mb-8 text-center font-variable text-3xl font-light tracking-[-0.03em]">Cambios reales</h3>
            <ChangesSlider items={cambios} />
          </div>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {any && (
            <Button to="/resenas" variant="secondary" className={BTN_O}>
              Ver todas las reseñas
            </Button>
          )}
          <Button to="/resenas#escribir" variant="secondary" className={BTN_O}>
            Escribir mi reseña
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ── 15 · FAQ ───────────────────────────────────────────── */
// Si una respuesta empieza por "[" se considera pendiente y NO se muestra en la web (misma convención que config.js).
const FAQ = [
  {
    q: '¿Y si tengo exámenes o una semana complicada?',
    a: 'El plan se monta alrededor de tu semana, no al revés. Si un día se complica, se ajusta.',
  },
  {
    q: '¿Cómo funcionan los descuentos?',
    a: '−10% con carné universitario, que se verifica cuando hablas con Jaime. Y −15% cada uno si os apuntáis 2 amigos, o −25% si sois 3 o más (alta conjunta en Rookie y All In).',
  },
  {
    q: '¿Necesito ir al gimnasio?',
    a: 'No. Puedes entrenar en casa o en el gimnasio: Jaime se adapta a tus necesidades, a tu material y a tus rutinas. Lo importante no es dónde entrenas, sino que el plan encaje con tu vida.',
  },
  {
    q: '¿Hay permanencia?',
    a: 'No, no hay permanencia: te quedas el tiempo que quieras. Eso sí, Jaime te asesora sobre cuánto tiempo te conviene trabajar con él para conseguir los mejores resultados.',
  },
]

export function Faq() {
  const items = FAQ.filter((f) => !f.a.trim().startsWith('['))
  return (
    <section className={`theme-dark bg-ink ${SECTION}`}>
      <div className="mx-auto max-w-[900px] px-5 md:px-8">
        <Reveal as="div">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <H2 light="Dudas. " strong="Respuestas claras." size="faq" br={false} className="mt-6" />
        </Reveal>
        <div className="mt-12 border-t border-white/25">
          {items.map((f) => (
            <details key={f.q} className="group border-b border-white/25 py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:text-xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-2xl leading-none text-accent-ink transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3.5 max-w-2xl text-base leading-[1.6] text-white/80">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
