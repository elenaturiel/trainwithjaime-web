import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Button from './Button.jsx'
import HeroWord from './HeroWord.jsx'
import { Reveal } from './Reveal.jsx'
import { ArrowIcon } from './Icons.jsx'
import { BTN, BTN_O, Eyebrow, H2, LIGHT_BLUE, LINE, SECTION, WRAP } from './HomeSections.jsx'
import { TEST } from '../config.js'
import {
  COMPARE_GROUPS,
  EXTRA_SESSION_PRICE,
  HYROX_PLAN,
  MVP_PRICE,
  MVP_PRICE_OLD,
  MVP_SPOTS,
  PRICING,
} from '../data/pricing.js'

/* ══ Secciones de /precios (rediseño minimalista) ═══════════
   Sigue el prototipo aprobado (Precios.dc.html) y comparte con la home los helpers de HomeSections.jsx (titulares,
   eyebrows, botones en píldora, espaciados). Planes, precios, prestaciones y tabla salen de src/data/pricing.js
   (la misma fuente que el resto de la web). Peak ya no se ofrece: se filtra aquí y en la tabla. */

const PLANS = PRICING.filter((p) => p.id !== 'peak')

/* ── 1 · Hero: palabra gigante azul de fondo y el contenido encima ─ */
const CHIPS = ['Primera asesoría gratis', '−10% con carné universitario', 'Hasta −25% en squad']

export function PreciosHero() {
  const reduced = !!useReducedMotion()
  // Entrada escalonada: fade + translateY(36px)
  const item = (delay) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 36 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] } }

  return (
    <section className="theme-dark relative isolate overflow-hidden bg-[radial-gradient(110%_90%_at_80%_0%,#1646C2_0%,#091844_50%,#041037_100%)] pb-8 pt-36 md:pb-12 md:pt-[124px]">

      <div className={`${WRAP} relative z-10`}>
        <motion.div {...item(0)}>
          <Eyebrow>Precios</Eyebrow>
        </motion.div>

        <h1 className="mt-6 font-variable text-[clamp(3rem,9.2vw,132px)] font-light leading-[.95] tracking-[-0.045em]">
          <motion.span className="block" {...item(0.15)}>
            Elige tu plan.
          </motion.span>
          <motion.span className="block font-extrabold" {...item(0.3)}>
            <span className="relative inline-block">
              Sin postureo.
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

        <motion.p {...item(0.5)} className="mt-9 max-w-[620px] text-lg leading-[1.55] text-white md:text-[21px]">
          Elige el plan que encaja contigo. La primera asesoría con Jaime es gratis.
        </motion.p>

        <motion.div {...item(0.5)} className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
          <Button to="/test" className={BTN}>
            Hazte el test de estudihambre <ArrowIcon className="h-4 w-4" />
          </Button>
          <Button href="#planes" variant="secondary" className={BTN_O}>
            Ver los planes
          </Button>
        </motion.div>

        <motion.ul {...item(0.5)} className="mt-10 flex flex-wrap gap-2.5" aria-label="Ventajas">
          {CHIPS.map((c) => (
            <li key={c} className="rounded-full border border-white/35 px-[18px] py-2 text-xs font-semibold uppercase tracking-[2px]">
              {c}
            </li>
          ))}
        </motion.ul>
      </div>
      <HeroWord size="text-[clamp(2.75rem,17vw,245px)]">Precios</HeroWord>
    </section>
  )
}

/* ── 2 · Planes (Rookie · All In · MVP) + franja HYROX ──── */
function PlanCard({ p }) {
  const featured = !!p.featured
  // "Plazas limitadas" va como nota bajo el precio, no en la lista
  const limited = p.features.find((f) => typeof f === 'string' && f.startsWith('Plazas limitadas'))
  const features = p.features.filter((f) => f !== limited)

  return (
    <Reveal
      as="div"
      className={`flex flex-col rounded-3xl px-7 py-9 transition-transform duration-[350ms] motion-safe:hover:-translate-y-2 md:px-9 md:py-10 ${
        featured ? 'theme-blue bg-ink' : 'border border-white/[.22]'
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[3px] text-accent-ink md:min-h-8">{p.badge || 'Para empezar'}</p>
      <h3 className="mt-3.5 font-variable text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em]">{p.name}</h3>
      <p className="mt-2.5 text-base leading-[1.5] text-white/80">{p.tagline}</p>

      <ul className="mt-6 flex-1">
        {features.map((f) => {
          const item = typeof f === 'string' ? { title: f } : f
          return (
            <li key={item.title} className="flex gap-2.5 py-[7px] text-[15px] leading-[1.45] text-white/90">
              <span aria-hidden="true" className="font-extrabold text-accent-ink">
                ✓
              </span>
              <span>
                {item.title}
                {item.note && <span className="mt-0.5 block text-xs leading-[1.5] text-white/65">{item.note}</span>}
              </span>
            </li>
          )
        })}
      </ul>

      <p className={`mt-7 border-t border-white/25 pt-6 text-[clamp(2.75rem,4.2vw,56px)] font-light leading-none tracking-[-0.04em]`}>
        {p.price}
        <span className="text-[15px] font-normal tracking-normal text-white/75">
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
      {(limited || p.extra) && (
        <p className="mt-3.5 text-[13px] leading-[1.5] text-white/70">{[limited && `${limited}.`, p.extra].filter(Boolean).join(' ')}</p>
      )}
      <Button to={`/contacto?plan=${p.id}`} variant={featured ? 'primary' : 'secondary'} className={`${featured ? BTN : BTN_O} mt-6 w-full`}>
        {p.cta}
      </Button>
    </Reveal>
  )
}

export function Plans() {
  return (
    <section id="planes" className="theme-dark scroll-mt-20 bg-ink pb-12 pt-20 md:pb-20 md:pt-[120px]">
      <div className={WRAP}>
        <h2 className="sr-only">Planes</h2>
        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <PlanCard key={p.id} p={p} />
          ))}
        </div>

        {/* Plan HYROX: siempre a consultar con Jaime */}
        <Reveal
          as="div"
          className="mt-6 flex flex-wrap items-center justify-between gap-7 rounded-3xl border border-accent px-7 py-9 transition-transform duration-[350ms] motion-safe:hover:-translate-y-2 md:px-10"
        >
          <div className="max-w-[640px]">
            <p className="text-xs font-bold uppercase tracking-[3px] text-accent-ink">Nuevo · plan a medida</p>
            <h3 className="mt-2 font-variable text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em]">{HYROX_PLAN.name}</h3>
            <p className="mt-2.5 text-base leading-[1.55] text-white/85">
              Jaime te entrena también para tu HYROX: método para un gimnasio normal, plan a tu nivel y a tu fecha de carrera.
              Individual, dobles o mixtos.
            </p>
            <p className="mt-2.5 text-sm leading-[1.5] text-white/65">{HYROX_PLAN.note}</p>
          </div>
          <div className="flex flex-col items-start gap-3.5">
            <p className="text-4xl font-light tracking-[-0.03em]">
              {HYROX_PLAN.priceLabel} <span className="text-[15px] font-normal text-white/70">con Jaime</span>
            </p>
            <Button to={HYROX_PLAN.href} className={BTN}>
              {HYROX_PLAN.cta}
            </Button>
            <Link
              to={HYROX_PLAN.more}
              className={`text-[13px] font-semibold uppercase tracking-[1.2px] ${LIGHT_BLUE} hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`}
            >
              Ver cómo funciona →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── 3 · Descuentos ─────────────────────────────────────── */
export function Discounts() {
  const big = 'mt-3 text-[clamp(2.75rem,6.1vw,88px)] font-light leading-none tracking-[-0.04em]'
  return (
    <section id="descuentos" className="theme-dark scroll-mt-20 bg-ink pb-20 pt-12 md:pb-[120px] md:pt-20">
      <div className={`${WRAP} grid gap-10 md:grid-cols-2 md:gap-6`}>
        <Reveal as="div" className={`${LINE} pt-6`}>
          <Eyebrow>Descuento</Eyebrow>
          <p className={big}>−10%</p>
          <p className="mt-3 text-xl font-semibold">Con carné universitario</p>
          <p className="mt-2 text-[15px] text-white/75">Se verifica cuando hablas con Jaime.</p>
        </Reveal>
        <Reveal as="div" className={`${LINE} pt-6`}>
          <Eyebrow>Squad</Eyebrow>
          <p className={big}>−15% / −25%</p>
          <p className="mt-3 text-xl font-semibold">Con tu squad</p>
          <p className="mt-2 text-[15px] text-white/75">2 amigos: −15% cada uno. 3 o más: −25%. Alta conjunta en Rookie y All In.</p>
          <Link
            to="/contacto?plan=squad"
            className="mt-4 inline-block text-[15px] font-semibold text-accent-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Entrar con mi squad →
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ── 4 · Tabla comparativa (cabecera fija) ──────────────── */
// Sin Peak, las filas que solo eran de ese plan (p. ej. "Para tu evento") se quedan vacías y se descartan.
const GROUPS = COMPARE_GROUPS.map((g) => ({ ...g, rows: g.rows.filter((r) => PLANS.some((p) => r.values[p.id])) })).filter((g) => g.rows.length)

const COLS = 'grid grid-cols-[1.5fr_1fr_1fr_1fr] md:grid-cols-[2.2fr_1fr_1fr_1fr]'
const CELL = 'flex items-center justify-center border-b border-white/[.14] px-1.5 py-3 text-center text-xs font-semibold md:px-4 md:py-[18px] md:text-sm'

function Value({ v }) {
  if (v === true)
    return (
      <>
        <span aria-hidden="true" className="text-lg font-extrabold text-accent-ink">
          ✓
        </span>
        <span className="sr-only">Incluido</span>
      </>
    )
  if (!v)
    return (
      <>
        <span aria-hidden="true" className="text-white/35">
          —
        </span>
        <span className="sr-only">No incluido</span>
      </>
    )
  return v
}

export function CompareTable() {
  return (
    <section id="comparar" className={`theme-dark scroll-mt-20 bg-panel ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div">
          <Eyebrow>Compara los planes</Eyebrow>
          <H2 light="Qué incluye " strong="cada uno." size="p80" br={false} className="mt-6" />
          <p className="mt-6 max-w-[640px] text-base leading-[1.6] text-white/75">
            <strong className="font-semibold text-white">El plan HYROX no está en la tabla:</strong> es a medida y se consulta con Jaime
            para hacerlo lo mejor posible.{' '}
            <Link to={HYROX_PLAN.more} className={`font-semibold ${LIGHT_BLUE} underline-offset-4 hover:underline`}>
              Ver el plan HYROX →
            </Link>
          </p>
        </Reveal>

        {/* Sin overflow en los contenedores: si no, la cabecera fija (sticky) deja de funcionar. En móvil, columnas compactas. */}
        <div className="mt-12 rounded-3xl border border-white/[.14] bg-ink px-3 pb-6 pt-2 md:mt-14 md:px-8">
          <div role="table" aria-label={`Comparativa de los planes ${PLANS.map((p) => p.name).join(', ')}`}>
            <div role="row" className={`${COLS} sticky top-[65px] z-10 bg-ink md:top-[73px]`}>
              <div role="columnheader" className="border-b border-white/30 py-3">
                <span className="sr-only">Prestación</span>
              </div>
              {PLANS.map((p) => (
                <div key={p.id} role="columnheader" className="border-b border-white/30 px-1 py-3 text-center">
                  <span className={`block font-variable text-[15px] font-extrabold leading-tight md:text-xl ${p.featured ? 'text-accent-ink' : ''}`}>{p.name}</span>
                  <span className="block text-[11px] text-white/75 md:text-[13px]">
                    {p.price}
                    {p.period}
                  </span>
                </div>
              ))}
            </div>

            {GROUPS.map((g) => (
              <div key={g.title} role="rowgroup">
                <div role="row">
                  <div role="rowheader" aria-colspan={PLANS.length + 1} className="pb-2.5 pt-8 text-xs font-bold uppercase tracking-[3px] text-accent-ink md:pt-[34px]">
                    {g.title}
                  </div>
                </div>
                {g.rows.map((r) => (
                  <div key={r.label} role="row" className={COLS}>
                    <div role="rowheader" className="border-b border-white/[.14] py-3 pr-2 text-left md:px-4 md:py-[18px]">
                      <span className="block text-xs font-semibold leading-snug md:text-[15px]">{r.label}</span>
                      {r.note && <span className="mt-[3px] hidden text-xs font-normal leading-[1.4] text-white/65 md:block">{r.note}</span>}
                    </div>
                    {PLANS.map((p) => (
                      <div key={p.id} role="cell" className={CELL}>
                        <Value v={r.values[p.id]} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-7 text-[15px] text-white/75">
          Todos los planes empiezan con una primera asesoría gratis con Jaime.{' '}
          <Link to="/contacto" className="font-bold text-accent-ink hover:underline">
            Reservar mi asesoría →
          </Link>
        </p>
      </div>
    </section>
  )
}

/* ── 5 · Banda del test (azul royal) ────────────────────── */
export function TestBand() {
  return (
    <section id="test" className={`theme-blue bg-ink text-center ${SECTION}`}>
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <Reveal as="div">
          <Eyebrow>
            {TEST.questions} preguntas · {TEST.duration}
          </Eyebrow>
          <H2 light="¿No sabes qué plan elegir?" strong="¿Eres estudihambre?" className="mt-6" />
        </Reveal>
        <p className="mx-auto mt-7 max-w-[560px] text-lg leading-[1.55] text-white/90 md:text-[19px]">
          Haz el test y te decimos qué plan te encaja de verdad y qué descuentos te tocan. Son solo clics: no te pedimos email ni
          teléfono.
        </p>
        <Button to="/test" className={`${BTN} mt-10`}>
          Hazte el test de estudihambre
        </Button>
      </div>
    </section>
  )
}

/* ── 6 · FAQ ────────────────────────────────────────────── */
// Solo datos que ya están en la web. Precios y plazas salen de pricing.js.
// (No hay pregunta sobre permanencia o cancelación: no estaba en el prototipo.)
const FAQ = [
  {
    q: '¿Cómo funciona la primera asesoría?',
    a: `Es gratis y sin compromiso: hablas con Jaime, te conoce, y juntos veis qué plan encaja con tu semana y tu bolsillo. Si no sabes cuál elegir, también puedes hacer antes el test de estudihambre (${TEST.questions} preguntas, ${TEST.duration}).`,
  },
  { q: '¿Cómo consigo el descuento universitario?', a: 'Con carné universitario tienes un −10%. Se verifica cuando hablas con Jaime.' },
  {
    q: '¿Y el descuento de squad?',
    a: 'Si os apuntáis 2 amigos, −15% cada uno; si sois 3 o más, −25%. El alta es conjunta y vale para Rookie y All In.',
  },
  {
    q: '¿Qué es el precio fundador del MVP?',
    a: `El MVP cuesta ${MVP_PRICE}/mes en lugar de ${MVP_PRICE_OLD} mientras queden plazas de precio fundador: ahora quedan ${MVP_SPOTS}. Las plazas son limitadas porque incluye 2 entrenos al mes en directo con Jaime.`,
  },
  {
    q: '¿Cuánto cuesta el plan HYROX?',
    a: 'Es un plan a medida, así que no tiene precio cerrado: lo consultas con Jaime (nivel, fecha de carrera y cómo quieres competir) y te dice el precio. La primera asesoría es gratis.',
  },
  { q: '¿Puedo añadir sesiones con Jaime?', a: `Sí. Puedes añadir una sesión extra de 1 h con Jaime por ${EXTRA_SESSION_PRICE}.` },
]

export function PreciosFaq() {
  return (
    <section className={`theme-dark bg-ink ${SECTION}`}>
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <Reveal as="div">
          <Eyebrow>Dudas</Eyebrow>
          <H2 light="Preguntas " strong="frecuentes." size="p80" br={false} className="mt-6" />
        </Reveal>
        <div className="mt-12 border-b border-white/[.18] md:mt-14">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-t border-white/[.18]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:text-[22px] [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="text-[32px] font-light leading-none text-accent-ink transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="mb-7 max-w-[760px] text-base leading-[1.6] text-white/80 md:text-[17px]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
