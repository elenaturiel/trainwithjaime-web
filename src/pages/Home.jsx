import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../components/Button.jsx'
import CountUp from '../components/CountUp.jsx'
import PricingCards from '../components/Pricing.jsx'
import PlanExtras from '../components/PlanExtras.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx'
import { ArrowIcon, PlayIcon } from '../components/Icons.jsx'
import { EASE } from '../lib/motion.js'
import { FEATURED_TESTIMONIAL } from '../config.js'

// recharts pesa bastante: se carga aparte para no frenar el primer render.
const ProgressChart = lazy(() => import('../components/ProgressChart.jsx'))

// ⚠️ SUSTITUIR VÍDEO DEL HERO: sube el vídeo definitivo a /public/hero.mp4
// (idealmente H.264, 1080p, < 8 MB, sin audio) y su fotograma a /public/hero-poster.jpg.
const HERO_VIDEO = '/hero.mp4'
const HERO_POSTER = '/hero-poster.jpg'

// ⚠️ SUSTITUIR FOTOS DE LA GALERÍA: /public/gallery-1.jpg … gallery-5.jpg
const GALLERY = [
  { src: '/gallery-1.jpg', alt: 'Entrenamiento con Jaime', className: 'col-span-2 row-span-2' },
  { src: '/gallery-2.jpg', alt: 'Entrenamiento de fuerza', className: '' },
  { src: '/gallery-3.jpg', alt: 'Running en Pamplona', className: '' },
  { src: '/gallery-4.jpg', alt: 'Entrenamiento HYROX', className: '' },
  { src: '/gallery-5.jpg', alt: 'Universitarios entrenando', className: '' },
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur"
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) videoRef.current?.pause()
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

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 md:px-8 md:pb-24">
        <motion.span
          {...item(0.05)}
          className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Pamplona · Universitarios
        </motion.span>
        <motion.h1
          {...item(0.15)}
          className="mt-6 max-w-5xl font-display text-[44px] uppercase leading-[1.02] md:text-[90px]"
        >
          Menos excusas.
          <br />
          Más resultados.
        </motion.h1>
        <motion.p {...item(0.25)} className="mt-6 max-w-xl text-base text-fg-2 md:text-lg">
          Más peso en la barra. Menos tiempo en el 5km. Un plan que se nota en tus marcas, no en tu Instagram.
        </motion.p>
        <motion.div {...item(0.35)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          {/* Cuando exista la página del test, cambiar a to="/test" */}
          <Button to="/contacto">
            Hazte el test de estudihambre <ArrowIcon className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => setVideoOpen(true)}>
            <PlayIcon className="h-4 w-4" /> Ver el vídeo
          </Button>
        </motion.div>
      </div>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  )
}

function Stats() {
  const stats = [
    { value: <CountUp to={40} prefix="+" />, label: 'universitarios' },
    { value: <CountUp to={24.9} decimals={2} suffix="€" />, label: 'desde' },
    { value: <CountUp from={100} to={0} suffix="%" />, label: 'postureo' },
  ]
  return (
    <Reveal className="border-y border-line bg-ink">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-8">
        {stats.map((s) => (
          <div key={s.label} className="group py-10 sm:px-6 sm:first:pl-0 md:py-14">
            <p className="origin-left font-display text-7xl leading-none transition-[color,transform] duration-200 group-hover:text-accent motion-safe:group-hover:scale-105 md:text-8xl">
              {s.value}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </Reveal>
  )
}

function Difference() {
  return (
    <section className="bg-panel py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal as="div">
          <SectionHeading number="01" eyebrow="Por qué funciona" title="La diferencia" />
        </Reveal>
        <Stagger className="mt-14 grid border-t border-line md:grid-cols-3">
          {DIFFERENCE.map((d) => (
            <StaggerItem
              key={d.n}
              hover
              className="group rounded-xl border-b border-line px-4 py-10 hover:bg-panel-2 md:border-b-0 md:border-l md:px-8 md:first:border-l-0"
            >
              <p className="font-display text-6xl leading-none text-brand transition-colors duration-200 group-hover:text-accent">
                {d.n}
              </p>
              <h3 className="mt-6 font-display text-3xl uppercase">{d.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-2">{d.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Stagger className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-4">
          {GALLERY.map((g) => (
            <StaggerItem key={g.src} className={`group overflow-hidden rounded-xl bg-panel ${g.className}`}>
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover brightness-75 transition-[transform,filter] duration-500 group-hover:brightness-110 motion-safe:group-hover:scale-[1.08]"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function Evolution() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:items-center md:gap-16 md:px-8">
        <Reveal as="div">
          <SectionHeading number="02" eyebrow="Progreso medible" title="Tu evolución" />
          {/* ⚠️ REVISAR: copy propuesto */}
          <p className="mt-6 max-w-md text-base leading-relaxed text-fg-2">
            Registramos tus marcas semana a semana y ajustamos el plan para que la línea solo vaya hacia arriba.
          </p>
        </Reveal>
        <Reveal
          as="div"
          className="rounded-2xl border border-line bg-panel p-5 transition-colors duration-300 hover:border-brand/50 md:p-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Sentadilla · 12 semanas</p>
            <p className="text-xs text-muted-2">Ejemplo</p>
          </div>
          <Suspense fallback={<div className="h-56 md:h-64" />}>
            <ProgressChart />
          </Suspense>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-line bg-panel-2 px-4 py-2 text-sm text-fg-2 transition-[border-color,transform] duration-200 hover:border-brand motion-safe:hover:scale-105">
              Sentadilla 80kg →{' '}
              <strong className="text-fg">
                <CountUp from={80} to={100} suffix="kg" />
              </strong>
            </span>
            <span className="rounded-full border border-line bg-panel-2 px-4 py-2 text-sm text-fg-2 transition-[border-color,transform] duration-200 hover:border-brand motion-safe:hover:scale-105">
              5km 28min →{' '}
              <strong className="text-fg">
                <CountUp from={28} to={24} suffix="min" />
              </strong>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Testimonial() {
  // ⚠️ SUSTITUIR el testimonio en src/config.js (FEATURED_TESTIMONIAL)
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden border-y border-line bg-panel md:min-h-screen">
      <Reveal as="figure" className="mx-auto max-w-6xl px-5 text-center md:px-8">
        <span aria-hidden="true" className="block font-display text-8xl leading-none text-brand md:text-9xl">
          “
        </span>
        <blockquote className="font-display text-5xl uppercase leading-[1.05] md:text-8xl">
          {FEATURED_TESTIMONIAL.quote}
        </blockquote>
        <figcaption className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          — {FEATURED_TESTIMONIAL.author}
        </figcaption>
      </Reveal>
    </section>
  )
}

function Pricing() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal as="div" className="mb-14 md:mb-20">
          <SectionHeading number="03" eyebrow="Planes" title="Precios" />
        </Reveal>
        <PricingCards />
        <div className="mt-16 md:mt-24">
          <PlanExtras />
        </div>
      </div>
    </section>
  )
}

export function FinalCTA() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-panel md:min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(61,139,255,0.22),transparent_60%)]"
      />
      <Reveal as="div" className="relative mx-auto max-w-5xl px-5 text-center md:px-8">
        <h2 className="font-display text-6xl uppercase leading-[1.02] md:text-[140px]">¿Y tú, quieres ganar?</h2>
        <div className="mt-10 flex justify-center">
          <Button to="/contacto">
            Reserva tu llamada <ArrowIcon className="h-4 w-4" />
          </Button>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <ScrollSection effect="stack" first>
        <Hero />
      </ScrollSection>
      <ScrollSection effect="parallax">
        <Stats />
      </ScrollSection>
      <ScrollSection effect="clip" bg="bg-panel">
        <Difference />
      </ScrollSection>
      <ScrollSection effect="zoom">
        <Gallery />
      </ScrollSection>
      <ScrollSection effect="stack">
        <Evolution />
      </ScrollSection>
      <ScrollSection effect="parallax" bg="bg-panel">
        <Testimonial />
      </ScrollSection>
      {/* Ancla fuera del bloque sticky para que /#precios salte siempre al sitio correcto */}
      <div id="precios" aria-hidden="true" />
      <ScrollSection effect="clip">
        <Pricing />
      </ScrollSection>
      <ScrollSection effect="zoom" bg="bg-panel" last>
        <FinalCTA />
      </ScrollSection>
    </>
  )
}
