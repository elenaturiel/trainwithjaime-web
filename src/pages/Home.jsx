import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../components/Button.jsx'
import RollingNumber from '../components/RollingNumber.jsx'
import PricingCards from '../components/Pricing.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import FinalCTA from '../components/FinalCTA.jsx'
import FoldText from '../components/FoldText.jsx'
import ScrollExpand from '../components/ScrollExpand.jsx'
import HyroxPromo from '../components/HyroxPromo.jsx'
import HyroxSticker from '../components/HyroxSticker.jsx'
import SnapText from '../components/SnapText.jsx'
import Carousel from '../components/Carousel.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { ArrowIcon, CheckIcon, PlayIcon } from '../components/Icons.jsx'
import { EASE } from '../lib/motion.js'
import { REAL_TESTIMONIALS as TESTIMONIALS, TEST } from '../config.js'
import { useReviews } from '../lib/resenas.js'
import { Stars } from '../components/Stars.jsx'
import { ChangesSlider, ReviewsSlider } from '../components/ReviewSliders.jsx'

// La gráfica se carga aparte para no frenar el primer render.
const ProgressChart = lazy(() => import('../components/ProgressChart.jsx'))

// ⚠️ SUSTITUIR VÍDEO DEL HERO: sube el vídeo definitivo a /public/hero.mp4
// (idealmente H.264, 1080p, < 8 MB, sin audio) y su fotograma a /public/hero-poster.jpg.
const HERO_VIDEO = '/hero.mp4'
const HERO_POSTER = '/hero-poster.jpg'

const GALLERY = [
  // `title` = frase que aparece encima de cada foto. Fotos en /public/foto-N.jpg (verticales, 3:4; sin fotos de espejo).
  { src: '/img-42.jpg', alt: 'Jaime y un amigo sonriendo en un selfie al aire libre', title: 'Aquí no entrenas solo' },
  { src: '/img-41.jpg', alt: 'Jaime en el rack de sentadillas del gimnasio', title: 'Más peso en la barra, semana a semana' },
  { src: '/img-25.jpg', alt: 'Jaime tomando apuntes en su cuaderno junto a la ventana', title: 'Sin atajos, con método' },
  { src: '/hyrox-barcelona.jpg', alt: 'Jaime marcando bíceps delante del panel de HYROX Barcelona', title: 'Llega en tu mejor versión' },
  { src: '/resultados.jpg', alt: 'Reloj Garmin en la muñeca con una carrera de 10,11 km en 51:29', title: 'Resultados sin humo' },
  { src: '/foto-2.jpg', alt: 'Jaime sentado en un cajón de salto, en el gimnasio', title: 'Un plan hecho para ti' },
  { src: '/img-46.jpg', alt: 'Portátil con un documento abierto y un cuaderno con el plan de entrenos', title: 'Cero postureo, mucho plan' },
  { src: '/hyrox-cartel.jpg', alt: 'Jaime con el cartel “My first HYROX” en HYROX Barcelona', title: 'Mi primer HYROX, y no será el último' },
  { src: '/hyrox-podio.jpg', alt: 'Jaime sentado en el podio de HYROX Barcelona', title: 'Prepárate para cualquier HYROX' },
]

// ⚠️ REVISAR: copy propuesto para "La diferencia" (no venía en el brief).
const DIFFERENCE = [
  {
    n: '01',
    title: 'Un plan hecho para ti',
    text: 'Entrenamiento y nutrición diseñados alrededor de tus clases, tus exámenes y tu presupuesto real.',
  },
  {
    n: '02',
    title: 'Cero postureo',
    text: 'Nada de rutinas copiadas de Instagram. Medimos marcas, no likes.',
  },
  {
    n: '03',
    title: 'Seguimiento de verdad',
    text: 'Revisamos tu progreso y ajustamos el plan cada vez que hace falta.',
  },
]

function VideoModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Portal a <body>: dentro de un apartado con transform, "fixed" dejaría de ser relativo a la pantalla.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="theme-dark fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Vídeo de Train with Jaime"
        >
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.96 }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-xs font-semibold uppercase tracking-widest text-fg-2 hover:text-fg"
            >
              Cerrar ✕
            </button>
            {/* ⚠️ SUSTITUIR: si el vídeo "largo" es otro distinto al del hero, cambia el src aquí */}
            <video
              src={HERO_VIDEO}
              poster={HERO_POSTER}
              controls
              autoPlay
              playsInline
              className="aspect-video w-full rounded-xl bg-black"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Hero() {
  const [videoOpen, setVideoOpen] = useState(false)
  const videoRef = useRef(null)

  // Si el usuario prefiere menos movimiento, no reproducimos el vídeo de fondo (se queda el poster).
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return v.pause()
    // El vídeo solo se reproduce mientras se ve: fuera de pantalla no gasta batería ni compite con el scroll.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  const item = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
  })

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
      {/* ⚠️ SUSTITUIR: /public/hero.mp4 y /public/hero-poster.jpg */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO}
        poster={HERO_POSTER}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      {/* Capas oscuras para que el texto cumpla contraste AA sobre cualquier fotograma del vídeo: una de abajo arriba y otra de
          izquierda a derecha (el texto va a la izquierda y abajo; a la derecha queda libre la pegatina y el vídeo se ve) */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/25" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/35 to-transparent" />
      {/* Pegatina del plan HYROX: se ve nada más entrar */}
      <HyroxSticker className="absolute right-4 top-24 md:right-10 md:top-32 lg:right-16 lg:top-36" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-40 md:px-8 md:pb-24">
        {/* A quién va dirigido, visible y encima del titular */}
        <motion.p {...item(0)} className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-accent-ink [text-wrap:balance] min-[400px]:text-xs min-[400px]:tracking-[0.2em] md:tracking-[0.25em]">
          Universitarios en Pamplona y online
        </motion.p>
        <motion.h1
          {...item(0.1)}
          className="mt-4 max-w-5xl font-display text-[clamp(34px,10vw,48px)] leading-[1.04] md:text-[88px] lg:text-[112px]"
        >
          Menos excusas.
          <br />
          <span className="font-bold">Más resultados.</span>
        </motion.h1>
        <motion.p {...item(0.2)} className="mt-6 max-w-2xl text-base text-fg-2 md:text-lg">
          Entrenamiento y nutrición personalizados que se adaptan a tus clases, tu trabajo y tus horarios, no al revés.
          Para estudiantes y para cualquiera con una vida con prisa.
        </motion.p>
        <motion.div {...item(0.3)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button to="/test">
            Hazte el test de estudihambre <ArrowIcon className="h-4 w-4" />
          </Button>
          <Button to="/contacto" variant="secondary">
            Primera asesoría gratis
          </Button>
        </motion.div>
        <motion.p {...item(0.35)} className="mt-3 text-sm text-fg-2">
          {TEST.questions} preguntas, {TEST.duration}: te decimos qué plan te encaja y qué descuentos te tocan.
        </motion.p>
        <motion.div {...item(0.4)} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-2">
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className="inline-flex items-center gap-2 font-semibold text-fg underline-offset-4 hover:text-accent-ink hover:underline"
          >
            <PlayIcon className="h-3.5 w-3.5" /> Ver el vídeo
          </button>
          <span>Sin compromiso</span>
        </motion.div>
      </div>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  )
}

// Mensaje de adaptación (antes era el titular del hero): "Tu rutina manda. Tu entrenamiento se adapta."
function Adapts() {
  return (
    <section className="theme-dark bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal as="div">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-ink">Cómo entrenamos</p>
          <h2 className="mt-5 max-w-5xl font-display text-[2.1rem] leading-[1.04] min-[420px]:text-5xl md:text-7xl lg:text-8xl">
            Tu rutina manda.
            <span className="block font-bold [text-wrap:balance]">Tu entrenamiento se adapta.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-2 md:text-lg">
            No tienes que cambiar tu vida para entrenar: el plan se monta alrededor de tu semana, no al revés. Si un día
            se complica, se ajusta.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Se adapta a">
            {['Tus clases', 'Tu trabajo', 'Tus horarios', 'Tu presupuesto'].map((t) => (
              <li key={t} className="rounded-full border border-fg/25 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-fg">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

function Stats() {
  const stats = [
    { value: <RollingNumber value="24,90" suffix="€" />, label: 'desde' },
    { value: <RollingNumber value="10" prefix="-" suffix="%" />, label: 'con carné universitario' },
    { value: <RollingNumber value="0" suffix="%" direction="down" />, label: 'postureo' },
  ]
  return (
    <Reveal className="border-y border-line bg-ink">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-8">
        {stats.map((s) => (
          <div key={s.label} className="group py-10 sm:px-6 sm:first:pl-0 md:py-14">
            <p className="origin-left font-display text-7xl leading-none sm:text-5xl transition-[color,transform] duration-200 group-hover:text-accent-ink motion-safe:group-hover:scale-105 md:text-6xl lg:text-7xl xl:text-8xl">
              {s.value}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </Reveal>
  )
}

// Fotos para acompañar cada punto (una por punto)
const DIFFERENCE_IMAGES = ['/img-08.jpg', '/img-22.jpg', '/img-24.jpg']

function Difference() {
  return (
    // Sin ScrollSection: su contenedor recorta el desbordamiento y rompería el sticky de SnapText
    <section className="theme-dark relative bg-panel">
      <SnapText
        items={DIFFERENCE}
        images={DIFFERENCE_IMAGES}
        heading={
          <FoldText
            as="h2"
            text="La diferencia"
            splitBy="char"
            hinge="top"
            trigger="inView"
            duration={0.65}
            stagger={0.045}
            ease="power3.out"
            perspective={700}
            creaseShading={0.55}
            className="block text-center font-display text-4xl font-bold uppercase leading-none md:text-[5.25rem]"
          />
        }
      />
    </section>
  )
}

// "Quién te entrena": solo datos que ya están publicados en la web (/sobre-jaime y la página de HYROX).
// ⚠️ TODO (Jaime): estos datos NO están en la web, así que no se muestran. Si los confirma, se añaden como tarjetas:
//   · años entrenando · nº de personas a las que ha entrenado · medias maratones u otras pruebas completadas
//   · certificación como entrenador (en /sobre-jaime dice "no soy un entrenador certificado (aún)")
const COACH_FACTS = [
  { value: '4º', label: 'curso de Ciencias de la Actividad Física y del Deporte' },
  { value: '1', label: 'HYROX completado: Barcelona, 14 de noviembre de 2026' },
  { value: '20/03', label: 'próximo HYROX, en 2027, y vamos a competir' },
]

function Coach() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:px-8 lg:gap-20">
        <Reveal as="div" className="mx-auto w-full max-w-xs md:max-w-none">
          <img
            src="/img-06.jpg"
            alt="Jaime sonriendo en el gimnasio, de pie frente a la estructura de dominadas con un disco en las manos"
            width="1000"
            height="1333"
            loading="lazy"
            decoding="async"
            draggable={false}
            className="aspect-[3/4] w-full rounded-2xl border border-line object-cover"
          />
        </Reveal>
        <Reveal as="div">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-ink">Quién te entrena</p>
          <SectionHeading title="Soy Jaime, y entreno como tú" className="mt-4" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-2 md:text-lg">
            Estudio Ciencias de la Actividad Física y del Deporte y sé lo que es ir con la agenda llena: clases,
            exámenes y presupuesto justo. No soy entrenador certificado (aún), pero aplico lo que estudio y lo que he
            vivido en mis propias carnes. Y no te mando nada que yo no haga: sin postureo, solo plan.
          </p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {COACH_FACTS.map((f) => (
              <div key={f.value} className="rounded-2xl border border-line bg-panel p-5">
                <dt className="font-display text-4xl font-bold leading-none text-accent-ink md:text-5xl">{f.value}</dt>
                <dd className="mt-3 text-sm leading-snug text-fg-2">{f.label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <Button to="/sobre-jaime" variant="secondary">
              Conoce a Jaime <ArrowIcon className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <Reveal as="div" className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 className="max-w-4xl font-display text-5xl leading-[1.02] md:text-8xl">
          Entrena con cabeza, <span className="font-bold">nótalo en todo</span>
        </h2>
        <p className="mb-12 mt-6 max-w-2xl text-base leading-relaxed text-fg-2 md:mb-16 md:text-lg">
          Un plan hecho a tu medida, nutrición que cabe en tu presupuesto de estudiante y seguimiento real cada semana.
          Entre clase y clase, más fuerza en la barra, mejores tiempos en la pista y más energía para el resto del día.
        </p>
        <Carousel items={GALLERY} label="Galería de fotos" />
      </Reveal>
    </section>
  )
}

function Evolution() {
  return (
    // Sin ScrollSection: su contenedor recorta el desbordamiento y rompería el sticky de ScrollExpand
    <ScrollExpand src="/gallery-3.jpg" title="Tu evolución">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2 md:items-center md:gap-16 md:px-8">
        <Reveal as="div">
          <SectionHeading title="Tu evolución" />
          {/* ⚠️ REVISAR: copy propuesto */}
          <p className="mt-4 max-w-md text-base leading-relaxed text-fg-2 md:mt-6">
            Registramos tus marcas semana a semana y ajustamos el plan para que la línea solo vaya hacia arriba.
          </p>
        </Reveal>
        <Reveal as="div" className="border-t border-line pt-5 md:border-l md:border-t-0 md:pl-12 md:pt-0">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Sentadilla · 12 semanas</p>
            <p className="text-xs text-muted-2">Ejemplo</p>
          </div>
          <Suspense fallback={<div className="h-56 md:h-64" />}>
            <ProgressChart />
          </Suspense>
          <div className="mt-5 grid grid-cols-2 divide-x divide-line border-t border-line pt-4 md:mt-6 md:pt-5">
            <span className="pr-4 text-sm text-fg-2">
              Sentadilla 80kg →{' '}
              <strong className="text-fg">
                <RollingNumber value="100" suffix="kg" />
              </strong>
            </span>
            <span className="pl-4 text-sm text-fg-2">
              5km 28min →{' '}
              <strong className="text-fg">
                <RollingNumber value="24" suffix="min" direction="down" />
              </strong>
            </span>
          </div>
        </Reveal>
      </div>
    </ScrollExpand>
  )
}

function Testimonials() {
  // Dos bloques separados: reseñas de clientes y cambios con foto que sube Jaime (/admin/resenas).
  // ⚠️ Los testimonios escritos a mano en src/config.js (TESTIMONIALS) van los primeros entre las reseñas.
  const { data } = useReviews()
  const written = TESTIMONIALS.map((t, i) => ({ id: `t${i}`, nombre: t.author, detalle: t.detail, estrellas: 0, texto: t.quote, fecha: '' }))
  const reviews = [...written, ...(data?.resenas ?? [])]
  const cambios = data?.cambios ?? []
  return (
    <section className="bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal as="div" className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <SectionHeading title="Lo que dicen" />
          {data?.total > 0 && (
            <p className="flex items-center gap-3 text-fg-2">
              <Stars value={data.media} className="h-6 w-6" />
              <span className="text-lg font-semibold text-fg">{String(data.media).replace('.', ',')}</span>
              <span className="text-sm">· {data.total} {data.total === 1 ? 'reseña' : 'reseñas'}</span>
            </p>
          )}
        </Reveal>

        {reviews.length > 0 ? (
          <ReviewsSlider items={reviews} />
        ) : (
          <p className="max-w-2xl text-lg text-fg-2">
            Aquí irán las opiniones de quienes entrenan con Jaime. ¿Has entrenado con él? Cuéntanos cómo te ha ido.
          </p>
        )}

        {cambios.length > 0 && (
          <div className="mt-16 md:mt-20">
            <Reveal as="div" className="mb-8 md:mb-10">
              <h3 className="font-display text-3xl leading-tight md:text-5xl">Cambios reales</h3>
              <p className="mt-2 text-fg-2">Fotos de clientes, con su permiso.</p>
            </Reveal>
            <ChangesSlider items={cambios} />
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          {(reviews.length > 0 || cambios.length > 0) && (
            <Button to="/resenas" variant="secondary">
              Ver todas las reseñas
            </Button>
          )}
          <Button to="/resenas#escribir" variant="primary">
            Escribir mi reseña
          </Button>
        </div>
      </div>
    </section>
  )
}

// Tarjeta grande del test de estudihambre, entre la propuesta de valor y los precios.
const TEST_PERKS = [
  ['Tu plan, sin dar vueltas', 'Rookie, All In o Peak: te decimos cuál encaja con tu semana y tu bolsillo, y por qué.'],
  ['Los descuentos que te tocan', '-10% con carné universitario y hasta -25% si vais en squad. Sin letra pequeña.'],
  ['Cero datos, cero registro', 'Son solo clics: no te pedimos email ni teléfono para ver el resultado.'],
]

function TestPromo() {
  return (
    <section className="bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal
          as="div"
          className="relative overflow-hidden rounded-3xl border border-accent/60 bg-accent/10 p-7 md:p-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-ink">
                {TEST.questions} preguntas · {TEST.duration}
              </p>
              <h2 className="mt-4 font-display text-[2.1rem] font-bold leading-[1.02] min-[420px]:text-5xl md:text-7xl">
                ¿Tienes estudihambre?
              </h2>
              <p className="mt-5 max-w-xl text-base text-fg-2 md:text-lg">
                Pasta, pizza y lo que caiga no es un plan. Haz el test y te decimos qué plan te encaja de verdad.
              </p>
              <div className="mt-8">
                <Button to="/test" className="w-full sm:w-auto">
                  Hazte el test de estudihambre <ArrowIcon className="h-4 w-4 shrink-0" />
                </Button>
              </div>
            </div>
            <ul className="grid min-w-0 gap-3">
              {TEST_PERKS.map(([t, d]) => (
                <li key={t} className="flex gap-4 rounded-2xl border border-line bg-panel p-5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-semibold leading-tight md:text-2xl">{t}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-fg-2">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal as="div" className="mb-14 md:mb-20">
          <FoldText
            as="h2"
            text="Precios"
            splitBy="char"
            hinge="top"
            trigger="inView"
            duration={0.65}
            stagger={0.045}
            ease="power3.out"
            perspective={700}
            creaseShading={0.55}
            className="block text-center font-display text-6xl font-bold uppercase leading-[1.02] md:text-[9rem]"
          />
        </Reveal>
        <PricingCards compact />
        <p className="mt-6 text-center">
          <Link to="/precios" className="font-semibold text-brand underline-offset-4 hover:underline">
            Comparar todos los planes →
          </Link>
        </p>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <ScrollSection effect="stack" first dark>
        <Hero />
      </ScrollSection>
      <ScrollSection effect="parallax">
        <Stats />
      </ScrollSection>
      <ScrollSection effect="zoom" dark>
        <Adapts />
      </ScrollSection>
      <Difference />
      <ScrollSection effect="clip">
        <Coach />
      </ScrollSection>
      <ScrollSection effect="zoom">
        <Gallery />
      </ScrollSection>
      <Evolution />
      <ScrollSection effect="zoom">
        <TestPromo />
      </ScrollSection>
      {/* Ancla fuera del bloque sticky para que /#precios salte siempre al sitio correcto */}
      <div id="precios" aria-hidden="true" />
      <ScrollSection effect="clip">
        <Pricing />
      </ScrollSection>
      <ScrollSection effect="parallax" blue>
        <Testimonials />
      </ScrollSection>
      <HyroxPromo />
      <ScrollSection effect="zoom" bg="bg-panel" last dark>
        <FinalCTA />
      </ScrollSection>
    </>
  )
}
