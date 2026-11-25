import { motion, useReducedMotion } from 'framer-motion'
import Button from './Button.jsx'
import ImageCompare from './ImageCompare.jsx'
import { Reveal } from './Reveal.jsx'
import { ArrowIcon, GradCapIcon, HeartIcon, SparklesIcon, UsersIcon } from './Icons.jsx'
import { BTN, BTN_O, COACH_FACTS, Eyebrow, FACTS_HYROX, H2, LIGHT_BLUE, LINE, PILLARS, Photo, SECTION, WRAP } from './HomeSections.jsx'
import { BEFORE_AFTER, TEST } from '../config.js'
import { GALLERY } from '../data/galeria.js'
import { HYROX_CONTACT, HYROX_NEXT, HYROX_PAST } from '../data/hyroxPlan.js'
import { CHANGE_TEXT, HIGHLIGHTS, HYROX_LINES, INTRO, KICKER, VALUES } from '../data/sobreJaime.js'

/* ══ Secciones de /sobre-jaime (rediseño minimalista) ═══════
   Sigue el prototipo aprobado (SobreJaime.dc.html) y comparte con el resto del rediseño los helpers de HomeSections.jsx.
   Textos propios: src/data/sobreJaime.js · cifras: COACH_FACTS (HomeSections) · fechas HYROX: hyroxPlan.js · fotos: galeria.js. */

const HIGHLIGHT_ICONS = [GradCapIcon, HeartIcon, UsersIcon, SparklesIcon]
const CARD = 'transition-transform duration-[350ms] motion-safe:hover:-translate-y-2'
const photoOf = (src) => GALLERY.find((g) => g.src === src)

/* ── 1 · Hero en dos columnas (foto a la izquierda) ─────── */
export function SobreHero() {
  const reduced = !!useReducedMotion()
  // Entrada escalonada: fade + translateY(36px)
  const item = (delay) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 36 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] } }

  return (
    <section className="theme-dark bg-[radial-gradient(110%_90%_at_20%_0%,#1646C2_0%,#091844_50%,#041037_100%)] pb-20 pt-36 md:pb-[110px] md:pt-[120px]">
      <div className={`${WRAP} grid items-center gap-12 md:grid-cols-[.9fr_1.1fr] md:gap-[72px]`}>
        {/* Foto vertical sin filtro (es la imagen principal: carga sin lazy) */}
        <motion.div {...item(0.3)}>
          <div className="group relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border border-white/[.18] md:max-w-none">
            <img
              src="/img-06.jpg"
              alt="Jaime sonriendo en el gimnasio, de pie frente a la estructura de dominadas con un disco en las manos"
              width="1000"
              height="1333"
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-out motion-safe:group-hover:scale-[1.06]"
            />
          </div>
        </motion.div>

        <div>
          <motion.div {...item(0)}>
            <Eyebrow>Quién te entrena</Eyebrow>
          </motion.div>
          <h1 className="mt-6 font-variable text-[clamp(2.75rem,7.8vw,112px)] font-light leading-[.95] tracking-[-0.045em]">
            <motion.span className="block" {...item(0.15)}>
              Soy Jaime,
            </motion.span>
            <motion.span className="block font-extrabold" {...item(0.3)}>
              <span className="relative inline-block">
                y entreno como tú.
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
          <motion.p {...item(0.3)} className={`mt-7 text-sm font-semibold uppercase tracking-[2px] ${LIGHT_BLUE}`}>
            {KICKER}
          </motion.p>
          <motion.div {...item(0.3)}>
            {INTRO.map((t, i) => (
              <p key={i} className={`mt-5 text-base leading-[1.65] md:text-lg ${i === 0 ? 'text-white' : 'text-white/[.82]'}`}>
                {t}
              </p>
            ))}
          </motion.div>
          <motion.ul {...item(0.5)} className="mt-7 flex flex-wrap gap-2.5" aria-label="Lo que me define">
            {HIGHLIGHTS.map((label, i) => {
              const Icon = HIGHLIGHT_ICONS[i]
              return (
                <li key={label} className="flex items-center gap-2 rounded-full border border-white/35 px-[18px] py-2 text-xs font-semibold uppercase tracking-[2px]">
                  <Icon className="h-4 w-4 shrink-0 text-accent-ink" />
                  {label}
                </li>
              )
            })}
          </motion.ul>
          <motion.div {...item(0.5)} className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
            <Button to="/contacto" className={BTN}>
              Primera asesoría gratis
            </Button>
            <Button to="/precios" variant="secondary" className={BTN_O}>
              Ver los planes
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── 2 · Banda de 3 cifras ──────────────────────────────── */
// 4º · 1 HYROX completado · 20/03 próximo HYROX (las mismas cifras de la home; la de "personas entrenadas" no va aquí)
const FIGURES = [COACH_FACTS[0], ...FACTS_HYROX]

export function Figures() {
  return (
    <section className="theme-dark bg-panel py-20 md:py-[100px]">
      <dl className={`${WRAP} grid gap-10 md:grid-cols-3`}>
        {FIGURES.map((f) => (
          <Reveal as="div" key={f.value}>
            <dt className="text-[clamp(3.25rem,5vw,72px)] font-light leading-none tracking-[-0.04em]">{f.value}</dt>
            <dd className="mt-3 text-base leading-[1.5] text-white/75">{f.label}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

/* ── 3 · Cómo entreno contigo (3 tarjetas numeradas) ────── */
export function HowITrain() {
  return (
    <section className={`theme-dark bg-ink ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div">
          <Eyebrow>Cómo entreno contigo</Eyebrow>
          <H2 light="Menos excusas. " strong="Más plan." size="p80" br={false} className="mt-6" />
        </Reveal>
        <ol className="mt-12 grid gap-6 md:mt-14 md:grid-cols-3">
          {PILLARS.map((p) => (
            <Reveal as="li" key={p.n} className={`rounded-3xl border border-white/[.22] px-8 py-9 ${CARD}`}>
              <p aria-hidden="true" className="text-[44px] font-light leading-none tracking-[-0.03em] text-accent-ink">
                {p.n}
              </p>
              <h3 className="mt-4 font-variable text-[22px] font-bold leading-tight tracking-normal">{p.title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.55] text-white/75">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── 3b · Lo que defiendo (contenido de la página anterior) ─ */
export function Values() {
  return (
    <section id="valores" className={`theme-dark bg-panel ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div">
          <Eyebrow>Lo que defiendo</Eyebrow>
          <H2 light="Sin humo, " strong="con método." size="p80" br={false} className="mt-6" />
        </Reveal>
        <ol className="mt-12 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-10">
          {VALUES.map((v) => (
            <Reveal as="li" key={v.n} className={`${LINE} pt-5`}>
              <p aria-hidden="true" className={`text-[44px] font-extralight leading-none ${LIGHT_BLUE}`}>
                {v.n}
              </p>
              <h3 className="mt-3.5 font-variable text-xl font-bold uppercase leading-tight tracking-normal">{v.title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.55] text-white/75">{v.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── 4 · HYROX (fondo degradado azul) ───────────────────── */
export function HyroxAbout() {
  const photos = ['/hyrox-podio.jpg', '/hyrox-cartel.jpg'].map(photoOf)
  return (
    <section id="hyrox" className={`theme-dark bg-[linear-gradient(135deg,#0E2F8F_0%,#091844_100%)] ${SECTION}`}>
      <div className={`${WRAP} grid items-center gap-14 md:grid-cols-2 md:gap-[72px]`}>
        <div>
          <Reveal as="div">
            <Eyebrow>Mi primer HYROX, y no será el último</Eyebrow>
            <H2 light="Entreno HYROX " strong="y te entreno para el tuyo." size="md" className="mt-6" />
          </Reveal>
          <p className="mt-7 text-lg leading-[1.6] text-white/[.82]">
            El {HYROX_PAST.fecha} hice mi primer HYROX en {HYROX_PAST.nombre.replace('HYROX ', '')}, en {HYROX_PAST.modalidad.toLowerCase()}, y el{' '}
            {HYROX_NEXT.fecha} vamos a por el siguiente. {HYROX_LINES[0]}
          </p>
          <p className="mt-4 text-base leading-[1.6] text-white/75">{HYROX_LINES[1]}</p>
          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Button to="/entrenamiento-hyrox" className={BTN}>
              Ver el plan HYROX <ArrowIcon className="h-4 w-4" />
            </Button>
            <Button to={HYROX_CONTACT} variant="secondary" className={BTN_O}>
              Consultar con Jaime
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {photos.map((p) => (
            <Reveal as="div" key={p.src} className="group aspect-[16/10] overflow-hidden rounded-[20px] border border-white/[.18]">
              <Photo src={p.src} alt={p.alt} pos="50% 40%" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 5 · Rejilla 3x3 con las 9 fotos reales y su pie ────── */
export function Gallery() {
  return (
    <section className={`theme-dark bg-ink ${SECTION}`}>
      <div className={WRAP}>
        <Reveal as="div">
          <Eyebrow>Entrenos reales</Eyebrow>
          <H2 light="Entrena con cabeza, " strong="nótalo en todo." size="p80" br={false} className="mt-6" />
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:mt-14 md:grid-cols-3">
          {GALLERY.map((g) => (
            <Reveal as="li" key={g.src} className={`group relative aspect-[3/4] overflow-hidden rounded-[20px] border border-white/[.18] ${CARD}`}>
              <Photo src={g.src} alt={g.alt} className="absolute inset-0" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#041037]/90 to-transparent" />
              <p className="absolute inset-x-3 bottom-3 text-[13px] font-semibold leading-snug md:inset-x-5 md:bottom-5 md:text-lg">{g.title}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── 5b · Mi cambio (antes y después; solo con fotos reales en config.js) ─ */
export function MyChange() {
  if (!(BEFORE_AFTER.before && BEFORE_AFTER.after)) return null
  return (
    <section className={`theme-dark bg-panel ${SECTION}`}>
      <div className={`${WRAP} grid items-center gap-12 md:grid-cols-2 md:gap-[72px]`}>
        <Reveal as="div">
          <Eyebrow>Mi cambio</Eyebrow>
          <H2 light="Antes y " strong="después." size="md" br={false} className="mt-6" />
          <p className="mt-6 max-w-md text-base leading-[1.6] text-white/80">{CHANGE_TEXT}</p>
        </Reveal>
        <Reveal as="div" className="mx-auto w-full max-w-sm md:max-w-md">
          <ImageCompare
            before={BEFORE_AFTER.before}
            after={BEFORE_AFTER.after}
            beforeAlt={BEFORE_AFTER.beforeAlt}
            afterAlt={BEFORE_AFTER.afterAlt}
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ── 6 · Banda azul royal ───────────────────────────────── */
export function GoalBand() {
  return (
    <section className={`theme-blue bg-ink text-center ${SECTION}`}>
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <Reveal as="div">
          <Eyebrow>Primera asesoría gratis</Eyebrow>
          <H2 light="Cuéntame tu objetivo." strong="Yo te digo qué plan te encaja." className="mt-6" />
        </Reveal>
        <p className="mx-auto mt-7 max-w-[560px] text-lg leading-[1.55] text-white/90 md:text-[19px]">
          Sin compromiso. Y si dudas, hazte antes el test de estudihambre: {TEST.questions} preguntas, {TEST.duration}.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Button to="/contacto" className={BTN}>
            Reservar mi asesoría
          </Button>
          <Button to="/test" variant="secondary" className={BTN_O}>
            Hazte el test
          </Button>
        </div>
      </div>
    </section>
  )
}
