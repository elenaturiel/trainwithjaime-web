import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Button from './Button.jsx'
import RollingNumber from './RollingNumber.jsx'
import { Reveal } from './Reveal.jsx'
import { BTN, BTN_O, Eyebrow, H2, LINE, Photo, SECTION, WRAP } from './HomeSections.jsx'
import { EVENT_NOTE, EVENTS, EXTRAS, SERVICES, SPECIALTIES, SQUAD, STEPS, SUPPLEMENT } from '../data/servicios.js'

/* ══ Secciones de /servicios (rediseño minimalista) ═════════
   Sigue el prototipo aprobado (Servicios.dc.html) y comparte con la home y /precios los helpers de HomeSections.jsx
   (titulares, eyebrows, botones en píldora, espaciados, foto con zoom). Textos y precios: src/data/servicios.js.
   El plan Peak ya no se vende en esta página. */

const CHIP = 'rounded-full border border-white/35 px-[18px] py-2 text-xs font-semibold uppercase tracking-[2px]'
const CARD = 'transition-transform duration-[350ms] motion-safe:hover:-translate-y-2'

/* ── 1 · Hero ───────────────────────────────────────────── */
export function ServiciosHero() {
  const reduced = !!useReducedMotion()
  // Entrada escalonada: fade + translateY(36px)
  const item = (delay) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 36 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] } }

  return (
    <section className="theme-dark relative isolate overflow-hidden bg-[radial-gradient(110%_90%_at_80%_0%,#1646C2_0%,#091844_50%,#041037_100%)] pb-20 pt-36 md:pb-[110px] md:pt-[130px]">
      <div className={WRAP}>
        <div>
          <motion.div {...item(0)}>
            <Eyebrow>Servicios</Eyebrow>
          </motion.div>
          <h1 className="mt-6 font-variable text-[clamp(3rem,8.6vw,124px)] font-light leading-[.95] tracking-[-0.045em]">
            <motion.span className="block" {...item(0.15)}>
              Todo lo que
            </motion.span>
            <motion.span className="block font-extrabold" {...item(0.3)}>
              <span className="relative inline-block">
                necesitas.
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
          <motion.p {...item(0.3)} className="mt-8 max-w-[560px] text-lg leading-[1.55] text-white md:text-[21px]">
            Entrenamiento, nutrición y seguimiento de verdad, todo online y pensado para universitarios.
          </motion.p>
          <motion.div {...item(0.5)} className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
            <Button to="/contacto" className={BTN}>
              Primera asesoría gratis
            </Button>
            <Button to="/precios" variant="secondary" className={BTN_O}>
              Ver precios
            </Button>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

/* ── 2 · Marquee: HYROX ✦ Funcional ✦ Gym ✦ Running ✦ A tu medida ─ */
export function SpecialtiesMarquee() {
  const row = (
    <div className="flex shrink-0">
      {SPECIALTIES.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-6 md:px-9">{t}</span>
          <span className="text-accent">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <section className="theme-dark overflow-hidden border-y border-white/[.12] bg-ink py-7 md:py-10" aria-hidden="true">
      <div
        className="marquee flex w-max whitespace-nowrap text-[clamp(1.75rem,3.1vw,44px)] font-light tracking-[-0.02em] motion-reduce:w-full motion-reduce:overflow-x-auto"
        style={{ animationDuration: '40s' }}
      >
        {row}
        <div className="flex motion-reduce:hidden">{row}</div>
      </div>
    </section>
  )
}

/* ── 3 · Cuatro bloques numerados 01–04 (texto y foto alternando lados y fondos) ─ */
function ServiceBlock({ s, n, flip }) {
  return (
    <section id={s.value} className={`theme-dark scroll-mt-16 ${flip ? 'bg-panel' : 'bg-ink'} ${SECTION}`}>
      <div className={`${WRAP} grid items-center gap-12 md:grid-cols-2 md:gap-20`}>
        <div className={flip ? 'md:order-2' : ''}>
          <Reveal as="div">
            <p aria-hidden="true" className="text-[clamp(3.5rem,6.1vw,88px)] font-light leading-none tracking-[-0.04em] text-white/[.28]">
              {String(n).padStart(2, '0')}
            </p>
            <Eyebrow className="mt-4">{s.label}</Eyebrow>
            <H2 light={`${s.heading[0]} `} strong={s.heading[1]} size="faq" br={false} className="mt-5" />
          </Reveal>
          <p className="mt-6 text-base leading-[1.65] text-white/[.82] md:text-lg">{s.text}</p>
          <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Incluye">
            {s.chips.map((c) => (
              <li key={c} className={CHIP}>
                {c}
              </li>
            ))}
          </ul>
          {s.note && <p className="mt-5 text-sm text-white/70">{s.note}</p>}
          {s.link && (
            <Link
              to={s.link.to}
              className="mt-7 inline-block text-[13px] font-bold uppercase tracking-[1.2px] text-accent-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {s.link.label}
            </Link>
          )}
        </div>
        <Reveal
          as="div"
          className={`group relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-white/[.18] md:max-w-none ${flip ? 'md:order-1' : ''}`}
        >
          <Photo src={s.image} alt={s.alt} className="absolute inset-0" />
        </Reveal>
      </div>
    </section>
  )
}

export function ServiceBlocks() {
  return SERVICES.map((s, i) => <ServiceBlock key={s.value} s={s} n={i + 1} flip={i % 2 === 1} />)
}

/* ── 4 · Cómo funciona (4 columnas, números amarillos) ──── */
export function HowWeWork() {
  return (
    <section className={`theme-dark bg-ink ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div">
          <Eyebrow>Cómo funciona</Eyebrow>
          <H2 light="Así " strong="trabajamos." size="p80" br={false} className="mt-6" />
        </Reveal>
        <ol className="mt-14 grid gap-8 md:mt-16 md:grid-cols-4 md:gap-7">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} className={`${LINE} pt-5`}>
              <p aria-hidden="true" className="text-[44px] font-light leading-none tracking-[-0.03em] text-accent-ink">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 font-variable text-[22px] font-bold leading-tight tracking-normal">{s.title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.55] text-white/75">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── 5 · Extras (3 tarjetas) ────────────────────────────── */
const EXTRA_CARD = `rounded-3xl border border-white/[.22] px-8 py-9 ${CARD}`
const EXTRA_BIG = 'text-[clamp(2.75rem,5vw,72px)] font-light leading-none tracking-[-0.04em]'
// Una descripción que empieza por "[" está pendiente de confirmar y no se muestra
const shown = (d) => (d && !d.trim().startsWith('[') ? d : null)

export function Extras() {
  return (
    <section className={`theme-dark bg-panel ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div">
          <Eyebrow>Extras</Eyebrow>
          <H2 light="Por si quieres " strong="más." size="p80" br={false} className="mt-6" />
        </Reveal>
        <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-3">
          {EXTRAS.map((e) => (
            <Reveal as="div" key={e.label} className={EXTRA_CARD}>
              <p className={EXTRA_BIG}>
                <RollingNumber value={e.value} suffix="€" />
              </p>
              <h3 className="mt-4 font-variable text-[22px] font-bold leading-tight tracking-normal">{e.label}</h3>
              {shown(e.description) && <p className="mt-2 text-[15px] leading-[1.5] text-white/[.72]">{e.description}</p>}
            </Reveal>
          ))}
          <Reveal as="div" className={EXTRA_CARD}>
            <p className={EXTRA_BIG}>{SUPPLEMENT.big}</p>
            <h3 className="mt-4 font-variable text-[22px] font-bold leading-tight tracking-normal">{SUPPLEMENT.label}</h3>
            <p className="mt-2 text-[15px] leading-[1.5] text-white/[.72]">{SUPPLEMENT.description}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── 6 · Squad (banda azul royal) ───────────────────────── */
export function SquadBand() {
  return (
    <section id="squad" className={`theme-blue bg-ink ${SECTION}`}>
      <div className={`${WRAP} grid items-center gap-12 md:grid-cols-2 md:gap-[72px]`}>
        <div>
          <Reveal as="div">
            <Eyebrow>Squad</Eyebrow>
            <H2 light={`${SQUAD.title[0]} `} strong={SQUAD.title[1]} size="p80" br={false} className="mt-6" />
          </Reveal>
          <p className="mt-7 text-lg leading-[1.6] text-white/[.92]">{SQUAD.intro}</p>
          <p className="mt-4 text-base leading-[1.6] text-white/85">{SQUAD.note}</p>
          <Button to={SQUAD.href} className={`${BTN} mt-8`}>
            {SQUAD.cta}
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
          {SQUAD.discounts.map((d) => (
            <Reveal as="div" key={d.value} className="border-t border-white/50 pt-[18px]">
              <p className="text-[clamp(3rem,6.1vw,88px)] font-light leading-none tracking-[-0.04em]">{d.value}</p>
              <p className="mt-2.5 text-base text-white/90">{d.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 7 · Prepárate para tu día + ¿Es un HYROX? ──────────── */
export function PrepareDay() {
  return (
    <section id="prueba" className={`theme-dark bg-ink ${SECTION}`}>
      <div className={`${WRAP} grid items-center gap-12 md:grid-cols-2 md:gap-[72px]`}>
        <div>
          <Reveal as="div">
            <Eyebrow>Prepárate para tu día</Eyebrow>
            <H2 light="¿Tienes una fecha " strong="en el calendario?" size="md" className="mt-6" />
          </Reveal>
          <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Pruebas">
            {EVENTS.map((e) => (
              <li key={e} className={CHIP}>
                {e}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-xl text-lg leading-[1.6] text-white/[.82]">{EVENT_NOTE}</p>
          <div className="mt-8">
            <Button to="/contacto" className={BTN}>
              Hablar con Jaime
            </Button>
          </div>
        </div>

        <Reveal as="div" className={`rounded-3xl border border-accent px-7 py-9 md:px-9 md:py-10 ${CARD}`}>
          <p className="text-xs font-bold uppercase tracking-[3px] text-accent-ink">Nuevo · plan a medida</p>
          <h3 className="mt-2.5 font-variable text-[clamp(2.25rem,3.4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.03em]">¿Es un HYROX?</h3>
          <p className="mt-3 text-[17px] leading-[1.55] text-white/85">
            Jaime te entrena también para tu HYROX: en un gimnasio normal, individual, dobles o mixtos. Tiene su propio plan a medida.
          </p>
          <Button to="/entrenamiento-hyrox" className={`${BTN} mt-6`}>
            Ver el plan HYROX →
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
