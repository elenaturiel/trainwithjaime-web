import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Button from '../components/Button.jsx'
import Carousel from '../components/Carousel.jsx'
import Countdown, { useCountdown } from '../components/Countdown.jsx'
import FinalCTA from '../components/FinalCTA.jsx'
import FoldText from '../components/FoldText.jsx'
import Marquee from '../components/Marquee.jsx'
import PageHero from '../components/PageHero.jsx'
import RollingNumber from '../components/RollingNumber.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx'
import { ArrowIcon, CheckIcon, StarIcon, UsersIcon, WhatsAppIcon } from '../components/Icons.jsx'
import { WHATSAPP_URL } from '../config.js'
import { EASE } from '../lib/motion.js'
import {
  HYROX_CONTACT,
  HYROX_FAQ,
  HYROX_FOR,
  HYROX_BAND,
  HYROX_GALLERY,
  HYROX_HERO_VIDEO,
  HYROX_INCLUDES,
  HYROX_METHOD,
  HYROX_MODES,
  HYROX_NEXT,
  HYROX_PAST,
  HYROX_PHOTOS,
  HYROX_STATIONS,
  HYROX_STEPS,
  HYROX_VIDEO,
} from '../data/hyroxPlan.js'

// Página de venta del entrenamiento HYROX. Los textos y datos están en src/data/hyroxPlan.js.
const kicker = 'text-xs font-bold uppercase tracking-[0.25em] text-accent-ink'

// Barra fina de progreso de la página, arriba del todo
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-accent" />
}

// Foto que se "abre" al entrar y se desplaza un poco más despacio que la página (parallax)
function ParallaxPhoto({ photo }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { clipPath: 'inset(10% 10% 10% 10% round 1.25rem)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 1rem)', opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, ease: EASE }}
      className="aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-panel"
    >
      <motion.img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={reduced ? undefined : { y, scale: 1.14 }}
        className="size-full object-cover"
      />
    </motion.div>
  )
}

// Vídeo corto de Barcelona: arranca solo (sin sonido, en bucle) cuando se ve, y queda quieto con "reducir movimiento"
function BcnVideo() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const v = ref.current
    if (!v || reduced) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.35 })
    io.observe(v)
    return () => io.disconnect()
  }, [reduced])
  return (
    <motion.div
      initial={reduced ? false : { clipPath: 'inset(10% 10% 10% 10% round 1.25rem)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 1rem)', opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, ease: EASE }}
      className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-panel"
    >
      <video
        ref={ref}
        src={HYROX_VIDEO.src}
        poster={HYROX_VIDEO.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Jaime con el cartel “My first HYROX” en HYROX Barcelona"
        className="size-full object-cover"
      />
    </motion.div>
  )
}

// Pregunta frecuente que se abre y se cierra con animación
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  const id = `hyrox-faq-${index}`
  return (
    <div className="py-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-6 text-left text-lg font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {q}
        <motion.span aria-hidden="true" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-2xl leading-none text-accent-ink">
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pt-3 leading-relaxed text-fg-2">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Los 4 pasos con una línea que se va rellenando al hacer scroll
function Steps() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className="absolute inset-x-0 -top-5 hidden h-0.5 bg-line lg:block">
        <motion.div style={{ scaleX: fill }} className="h-full origin-left bg-accent" />
      </div>
      <Stagger as="ol" className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {HYROX_STEPS.map((s, i) => (
          <StaggerItem key={s.title} as="li" hover className="rounded-2xl border border-line bg-panel p-7 hover:border-brand/60 hover:bg-panel-2">
            <span className="font-display text-6xl font-bold leading-none text-accent-ink">{i + 1}</span>
            <h3 className="mt-5 font-display text-2xl font-semibold leading-tight">{s.title}</h3>
            <p className="mt-3 text-fg-2">{s.text}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}

// Reflejo de luz que se mueve despacio por el fondo
function Glow({ className = '', color = 'rgba(255,201,60,0.16)', duration = 14 }) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ x: ['0%', '8%', '-6%', '0%'], y: ['0%', '-8%', '6%', '0%'] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ background: color }}
    />
  )
}

// Vídeo de fondo de la portada: en bucle y sin sonido. Con "reducir movimiento" queda solo el fotograma.
// En pantallas anchas se desplaza a la derecha, para que la cara quede al lado del título y no debajo.
function HeroVideo() {
  const reduced = useReducedMotion()
  return (
    <>
      <video
        src={HYROX_HERO_VIDEO.src}
        poster={HYROX_HERO_VIDEO.poster}
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 -z-20 size-full object-cover md:origin-right md:translate-x-[18%] md:scale-[1.12]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#041037] via-[#041037]/75 to-[#041037]/15 max-md:from-[#041037]/80 max-md:via-[#041037]/70 max-md:to-[#041037]/70" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#041037] to-transparent" />
    </>
  )
}

// Foto a todo el ancho que se desplaza más despacio que la página, con el texto encima
function BandPhoto() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
  return (
    <section ref={ref} className="theme-dark relative z-10 flex h-[52svh] min-h-[22rem] items-end overflow-hidden bg-ink md:h-[70svh]">
      <motion.img
        src={HYROX_BAND.src}
        alt={HYROX_BAND.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={reduced ? undefined : { y, scale: 1.15 }}
        className="absolute inset-0 size-full object-cover object-[50%_43%]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#041037] via-[#041037]/25 to-transparent" />
      <Reveal as="div" className="relative mx-auto w-full max-w-7xl px-5 pb-10 md:px-8 md:pb-16">
        <p className={kicker}>{HYROX_PAST.nombre}</p>
        <p className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.02] md:text-7xl">Sin postureo, con muchas ganas</p>
      </Reveal>
    </section>
  )
}

function DaysLeft() {
  const { d, done } = useCountdown(HYROX_NEXT.iso)
  if (done) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
      className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-accent/50 bg-accent/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-ink"
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      Próximo HYROX: {HYROX_NEXT.fecha} · faltan {d} días
    </motion.p>
  )
}

export default function HyroxPlan() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Entrenamiento HYROX en un gimnasio normal · Train with Jaime'
    return () => (document.title = prev)
  }, [])

  return (
    <>
      <ScrollProgress />

      {/* ── Portada: vídeo de fondo ───────────── */}
      <ScrollSection effect="stack" first dark>
        <section className="theme-dark relative isolate overflow-hidden bg-ink pb-20 pt-40 md:pb-32 md:pt-56">
          <HeroVideo />
          <Glow className="-left-32 bottom-0 -z-10 h-[24rem] w-[24rem]" color="rgba(255,201,60,0.14)" duration={16} />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className={kicker}
            >
              Entrenamiento HYROX · Train with Jaime
            </motion.p>
            <h1 className="mt-4 font-display text-[4.5rem] font-bold uppercase leading-[0.98] sm:text-8xl md:text-[11rem] lg:text-[13rem]">
              <FoldText
                text="HYROX"
                splitBy="char"
                hinge="top"
                trigger="mount"
                duration={0.65}
                stagger={0.045}
                ease="power3.out"
                perspective={700}
                creaseShading={0.55}
                className="block"
              />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55, ease: EASE }}
              className="mt-6 max-w-2xl text-lg font-semibold text-fg md:text-2xl"
            >
              Prepara tu HYROX en un gimnasio normal. <span className="text-accent-ink">Sin trineos, sin material raro y sin postureo.</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.55, ease: EASE }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button to={HYROX_CONTACT}>
                Quiero mi plan HYROX <ArrowIcon className="h-4 w-4" />
              </Button>
              <Button href="#metodo" variant="secondary">
                Cómo funciona
              </Button>
            </motion.div>
            <DaysLeft />
          </div>
        </section>
      </ScrollSection>

      {/* ── Qué es HYROX ───────────────────────── */}
      <ScrollSection effect="zoom">
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal as="div" className="max-w-3xl">
              <p className={kicker}>La carrera de fitness del momento</p>
              <SectionHeading title="8 km corriendo. 8 estaciones. Cero excusas." className="mt-4" />
              <p className="mt-6 text-base leading-relaxed text-fg-2 md:text-lg">
                En HYROX corres 1 km, haces una estación de fuerza o resistencia y vuelves a correr. Ocho veces. Es el
                mismo recorrido en cualquier parte del mundo, así que sabes exactamente a qué te enfrentas. Lo único que
                cambia es lo preparado que llegues.
              </p>
            </Reveal>
            <Stagger className="mt-12 grid gap-5 sm:grid-cols-3">
              {[
                ['8', 'bloques de 1 km corriendo'],
                ['8', 'estaciones de fuerza y resistencia'],
                ['1', 'mismo recorrido en todo el mundo'],
              ].map(([n, label]) => (
                <StaggerItem key={label} hover className="rounded-2xl border border-line bg-panel p-7 hover:border-brand/60 hover:bg-panel-2">
                  <p className="font-display text-7xl font-bold leading-none md:text-8xl">
                    <RollingNumber value={n} />
                  </p>
                  <p className="mt-4 text-lg text-fg-2">{label}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      </ScrollSection>

      <section className="theme-dark relative z-10 border-y border-line bg-panel py-7 md:py-9" aria-label="Las 8 estaciones de HYROX">
        <Marquee items={HYROX_STATIONS} className="text-fg" />
      </section>

      {/* ── El método ──────────────────────────── */}
      <ScrollSection effect="clip" dark>
        <section id="metodo" className="bg-ink py-24 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20">
            <div>
              <Reveal as="div">
                <p className={kicker}>El método de Jaime</p>
                <SectionHeading title="Tu HYROX, en tu gimnasio de siempre" className="mt-4" />
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-2 md:text-lg">
                  Sí, en la carrera hay trineos, SkiErg y remo. Pero no necesitas un box con material HYROX para
                  prepararte. Jaime ha creado un método para entrenar cada estación con lo que hay en cualquier gimnasio
                  normal.
                </p>
              </Reveal>
              <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
                {HYROX_METHOD.map((m, i) => (
                  <StaggerItem key={m.title} hover className="rounded-2xl border border-line bg-panel p-6 hover:border-brand/60 hover:bg-panel-2">
                    <span className="font-display text-4xl font-bold leading-none text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-4 font-display text-2xl font-semibold leading-tight">{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-2 md:text-base">{m.text}</p>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal as="p" className="mt-8 rounded-2xl border border-accent/50 bg-accent/10 px-6 py-5 font-display text-2xl font-semibold leading-tight md:text-3xl">
                Sin trineo, sin SkiErg, sin box especial. Solo tú, tu gym y un plan que tiene sentido.
              </Reveal>
            </div>
            <div className="mx-auto w-full max-w-sm lg:max-w-none">
              <ParallaxPhoto photo={HYROX_PHOTOS.metodo} />
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* ── Tu HYROX, a tu manera ──────────────── */}
      <ScrollSection effect="clip">
        <section id="modalidades" className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal as="div" className="max-w-3xl">
              <p className={kicker}>Cualquier HYROX</p>
              <SectionHeading title="Individual, parejas o mixtos: da igual" className="mt-4" />
              <p className="mt-6 text-base leading-relaxed text-fg-2 md:text-lg">
                Jaime te prepara para cualquier HYROX, en la modalidad que elijas. El plan se adapta a cómo vayas a
                competir, a tu fecha y a tu nivel.
              </p>
            </Reveal>
            <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
              {HYROX_MODES.map((m) => (
                <StaggerItem key={m.title} hover className="group overflow-hidden rounded-2xl border border-line bg-panel hover:border-brand/60 hover:bg-panel-2">
                  <div className="aspect-[3/4] overflow-hidden bg-panel-2">
                    <img
                      src={m.photo.src}
                      alt={m.photo.alt}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="size-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-3xl font-semibold leading-tight">{m.title}</h3>
                    <p className="mt-2 text-fg-2">{m.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      </ScrollSection>

      {/* ── Barcelona: lo hemos vivido ─────────── */}
      <ScrollSection effect="parallax">
        <section id="barcelona" className="relative overflow-hidden bg-ink py-24 md:py-32">
          <Glow className="-right-24 top-20 h-[26rem] w-[26rem]" duration={17} />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
            <div className="order-2 mx-auto w-full max-w-sm lg:order-1 lg:max-w-none">
              <BcnVideo />
            </div>
            <div className="order-1 lg:order-2">
              <Reveal as="div">
                <p className={kicker}>
                  {HYROX_PAST.nombre} · {HYROX_PAST.fecha}
                </p>
                <SectionHeading title="Lo hemos vivido desde dentro" className="mt-4" />
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-2 md:text-lg">
                  El {HYROX_PAST.fecha} estuvimos en HYROX Barcelona, en {HYROX_PAST.modalidad.toLowerCase()}. La salida, los
                  8 km, las estaciones, el cansancio y la meta. Por eso sabemos qué hace falta para llegar bien preparado a
                  cualquier HYROX, y eso es lo que te llevamos al plan.
                </p>
              </Reveal>
              <Reveal as="div" className="mt-10 flex flex-wrap items-center gap-4">
                <Button to={HYROX_CONTACT}>
                  Quiero mi plan HYROX <ArrowIcon className="h-4 w-4" />
                </Button>
                <a href="#siguiente" className="text-sm font-semibold text-brand underline-offset-4 hover:underline">
                  Ver el siguiente →
                </a>
              </Reveal>
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* ── Foto a todo el ancho ───────────────── */}
      <BandPhoto />

      {/* ── Así lo vivimos (galería) ───────────── */}
      <ScrollSection effect="zoom">
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal as="div" className="mb-12 md:mb-16">
              <p className={kicker}>Directo desde Barcelona</p>
              <SectionHeading title="Así lo vivimos" className="mt-4" />
            </Reveal>
            <Carousel items={HYROX_GALLERY} label="Fotos de HYROX Barcelona" />
          </div>
        </section>
      </ScrollSection>

      {/* ── Cuenta atrás: el siguiente HYROX ───── */}
      <ScrollSection effect="clip" blue>
        <section id="siguiente" className="relative overflow-hidden bg-ink py-24 md:py-32">
          <Glow className="-left-24 -top-10 h-[24rem] w-[24rem]" color="rgba(255,201,60,0.18)" duration={15} />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
            <div>
              <Reveal as="div">
                <p className={kicker}>El siguiente</p>
                <SectionHeading title={HYROX_NEXT.fecha} className="mt-4" />
                <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-2 md:text-lg">
                  Ya tenemos el siguiente HYROX en el calendario{HYROX_NEXT.lugar ? ` (${HYROX_NEXT.lugar})` : ''} y vamos a
                  competir. Esta es la cuenta atrás: cuanto antes empieces a prepararte, más tranquilo llegarás a tu propia
                  línea de salida.
                </p>
              </Reveal>
              <Reveal as="div" className="mt-10">
                <Countdown iso={HYROX_NEXT.iso} />
              </Reveal>
              <Reveal as="div" className="mt-10">
                <Button to={HYROX_CONTACT}>
                  Quiero prepararme ya <ArrowIcon className="h-4 w-4" />
                </Button>
              </Reveal>
            </div>
            <div className="mx-auto w-full max-w-xs lg:max-w-none">
              <ParallaxPhoto photo={HYROX_PHOTOS.cuentaAtras} />
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* ── Cómo funciona ──────────────────────── */}
      <ScrollSection effect="zoom" dark>
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal as="div" className="mb-14 md:mb-16">
              <SectionHeading title="Así de fácil" />
              <p className="mt-4 max-w-xl text-base text-fg-2 md:text-lg">Cuatro pasos, y el primero es gratis.</p>
            </Reveal>
            <Steps />
          </div>
        </section>
      </ScrollSection>

      {/* ── Para quién ─────────────────────────── */}
      <ScrollSection effect="clip">
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal as="div" className="mb-12 md:mb-16">
              <SectionHeading title="¿Es para ti?" />
            </Reveal>
            <Stagger className="grid gap-5 md:grid-cols-3">
              {HYROX_FOR.map((f) => (
                <StaggerItem key={f.title} hover className="group rounded-2xl border border-line bg-panel p-7 hover:border-brand/60 hover:bg-panel-2 md:p-8">
                  <UsersIcon className="h-7 w-7 text-brand transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" />
                  <h3 className="mt-5 font-display text-2xl font-semibold leading-tight md:text-3xl">{f.title}</h3>
                  <p className="mt-3 text-fg-2">{f.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      </ScrollSection>

      {/* ── El plan y el precio ────────────────── */}
      <ScrollSection effect="parallax" dark>
        <section id="plan" className="relative overflow-hidden bg-ink py-24 md:py-32">
          <Glow className="left-1/4 top-0 h-[26rem] w-[26rem]" color="rgba(61,139,255,0.22)" duration={18} />
          <div className="relative mx-auto max-w-5xl px-5 md:px-8">
            <Reveal as="div" className="text-center">
              <p className={kicker}>El plan</p>
              <FoldText
                as="h2"
                text="Plan HYROX"
                splitBy="char"
                hinge="top"
                trigger="inView"
                duration={0.65}
                stagger={0.045}
                ease="power3.out"
                perspective={700}
                creaseShading={0.55}
                className="mt-4 block font-display text-6xl leading-[1.02] md:text-8xl"
              />
            </Reveal>
            <Reveal as="div" className="mt-12 grid gap-8 rounded-3xl border border-accent/50 bg-panel-2 p-7 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:p-12">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-accent">
                  <StarIcon className="h-3 w-3" /> 100 % personalizado
                </span>
                <Stagger as="ul" className="mt-6 space-y-4">
                  {HYROX_INCLUDES.map((t) => (
                    <StaggerItem key={t} as="li" className="flex gap-3 text-fg-2">
                      <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-accent-ink" />
                      <span>{t}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
              <div className="flex flex-col justify-center border-t border-line pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Precio</p>
                <p className="mt-2 font-display text-5xl font-bold leading-none md:text-6xl">A consultar</p>
                <p className="mt-4 text-sm leading-relaxed text-fg-2">
                  Es un plan hecho a tu medida, así que el precio lo ves con Jaime: depende de tu nivel, tu fecha y de cómo
                  quieras competir. La primera asesoría es gratis y sin compromiso.
                </p>
                <Button to={HYROX_CONTACT} className="mt-6 w-full">
                  Consultar mi plan HYROX <ArrowIcon className="h-4 w-4" />
                </Button>
                <Button href={WHATSAPP_URL} target="_blank" rel="noreferrer" variant="secondary" className="mt-3 w-full">
                  <WhatsAppIcon className="h-5 w-5" /> Hablar por WhatsApp
                </Button>
              </div>
            </Reveal>
            <p className="mt-6 text-center text-sm text-muted">
              ¿Prefieres comparar con los demás planes?{' '}
              <Link to="/precios" className="font-semibold text-brand underline-offset-4 hover:underline">
                Ver todos los planes →
              </Link>
            </p>
          </div>
        </section>
      </ScrollSection>

      {/* ── Preguntas ──────────────────────────── */}
      <ScrollSection effect="clip">
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <Reveal as="div" className="mb-10">
              <SectionHeading title="Preguntas sobre HYROX" />
            </Reveal>
            <Reveal as="div" className="divide-y divide-line border-y border-line">
              {HYROX_FAQ.map((f, i) => (
                <FaqItem key={f.q} {...f} index={i} />
              ))}
            </Reveal>
          </div>
        </section>
      </ScrollSection>

      <ScrollSection effect="parallax" bg="bg-panel" last dark>
        <FinalCTA />
      </ScrollSection>
    </>
  )
}
