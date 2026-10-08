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
import HyroxBanner from '../components/HyroxBanner.jsx'
import SnapText from '../components/SnapText.jsx'
import Carousel from '../components/Carousel.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx'
import { ArrowIcon, PlayIcon } from '../components/Icons.jsx'
import { EASE } from '../lib/motion.js'
import { REAL_TESTIMONIALS as TESTIMONIALS } from '../config.js'

// La gráfica se carga aparte para no frenar el primer render.
const ProgressChart = lazy(() => import('../components/ProgressChart.jsx'))

// ⚠️ SUSTITUIR VÍDEO DEL HERO: sube el vídeo definitivo a /public/hero.mp4
// (idealmente H.264, 1080p, < 8 MB, sin audio) y su fotograma a /public/hero-poster.jpg.
const HERO_VIDEO = '/hero.mp4'
const HERO_POSTER = '/hero-poster.jpg'

const GALLERY = [
  // `title` = frase que aparece encima de cada foto. Fotos en /public/foto-N.jpg (verticales, 3:4; sin fotos de espejo).
  { src: '/foto-1.jpg', alt: 'Jaime sonriendo, sentado en un banco del gimnasio', title: 'Aquí no entrenas solo' },
  { src: '/foto-3.jpg', alt: 'Jaime con un disco en las manos, mirando de lado', title: 'Más peso en la barra, semana a semana' },
  { src: '/foto-4.jpg', alt: 'Jaime con un disco en las manos, mirando a cámara', title: 'Sin atajos, con método' },
  { src: '/foto-7.jpg', alt: 'Jaime sonriendo y marcando bíceps', title: 'Llega en tu mejor versión' },
  { src: '/foto-6.jpg', alt: 'Jaime con los brazos cruzados frente a las mancuernas', title: 'Resultados sin humo' },
  { src: '/foto-2.jpg', alt: 'Jaime sentado en un cajón de salto, en el gimnasio', title: 'Un plan hecho para ti' },
  { src: '/foto-5.jpg', alt: 'Jaime con un disco, frente a la estructura de dominadas', title: 'Cero postureo, mucho plan' },
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
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-40 md:px-8 md:pb-24">
        <motion.h1
          {...item(0.1)}
          className="max-w-5xl font-display text-[clamp(34px,10vw,48px)] leading-[1.04] md:text-[88px] lg:text-[112px]"
        >
          Menos excusas.
          <br />
          <span className="font-bold">Más resultados.</span>
        </motion.h1>
        <motion.p {...item(0.2)} className="mt-6 max-w-xl text-base text-fg-2 md:text-lg">
          Más peso en la barra. Menos tiempo en el 5km. Un plan que se nota en tus marcas, no en tu Instagram.
        </motion.p>
        <motion.div {...item(0.3)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button to="/contacto">
            Primera asesoría gratis <ArrowIcon className="h-4 w-4" />
          </Button>
          <Button to="/test" variant="secondary">
            Hazte el test de estudihambre
          </Button>
        </motion.div>
        <motion.div {...item(0.4)} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-2">
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className="inline-flex items-center gap-2 font-semibold text-fg underline-offset-4 hover:text-accent-ink hover:underline"
          >
            <PlayIcon className="h-3.5 w-3.5" /> Ver el vídeo
          </button>
          <span>Sin compromiso · Universitarios en Pamplona y online</span>
        </motion.div>
      </div>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
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
const DIFFERENCE_IMAGES = ['/foto-7.jpg', '/foto-2.jpg', '/foto-6.jpg']

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
    <ScrollExpand src="/foto-8.jpg" position="50% 22%" title="Tu evolución">
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
  // ⚠️ SUSTITUIR los testimonios en src/config.js (TESTIMONIALS)
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal as="div" className="mb-12 md:mb-16">
          <SectionHeading title="Lo que dicen" />
        </Reveal>
        <Stagger className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <StaggerItem
              key={i}
              as="figure"
              hover
              className="flex flex-col rounded-2xl border border-line bg-panel p-7 hover:bg-panel-2 md:p-8"
            >
              <span aria-hidden="true" className="font-display text-6xl leading-none text-accent-ink">
                “
              </span>
              <blockquote className="mt-2 flex-1 text-lg leading-relaxed text-fg">{t.quote}</blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <span className="block font-semibold text-fg">{t.author}</span>
                {t.detail && <span className="text-sm text-muted">{t.detail}</span>}
              </figcaption>
            </StaggerItem>
          ))}
        </Stagger>
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
            Comparar los 4 planes →
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
      <Difference />
      <ScrollSection effect="zoom">
        <Gallery />
      </ScrollSection>
      <Evolution />
      {/* Ancla fuera del bloque sticky para que /#precios salte siempre al sitio correcto */}
      <div id="precios" aria-hidden="true" />
      <ScrollSection effect="clip">
        <Pricing />
      </ScrollSection>
      {/* Solo con testimonios reales (los de relleno [..] no se muestran) */}
      {TESTIMONIALS.length > 0 && (
        <ScrollSection effect="parallax" blue>
          <Testimonials />
        </ScrollSection>
      )}
      <HyroxBanner ubicacion="home" />
      <ScrollSection effect="zoom" bg="bg-panel" last dark>
        <FinalCTA />
      </ScrollSection>
    </>
  )
}
