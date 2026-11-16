import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
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
import {
  HYROX_CONTACT,
  HYROX_EVENT,
  HYROX_FAQ,
  HYROX_FOR,
  HYROX_INCLUDES,
  HYROX_METHOD,
  HYROX_PHOTOS,
  HYROX_STATIONS,
  HYROX_STEPS,
} from '../data/hyroxPlan.js'

// Página de venta del entrenamiento HYROX. Los textos y datos están en src/data/hyroxPlan.js.
const kicker = 'text-xs font-bold uppercase tracking-[0.25em] text-accent-ink'

function Photo({ photo, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-panel ${className}`}>
      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" draggable={false} className="aspect-[3/4] w-full object-cover" />
    </div>
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
      {/* ── Portada ─────────────────────────────── */}
      <ScrollSection effect="stack" first dark>
        <PageHero
          center
          title={
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
          }
        >
          <p className="font-semibold text-fg">
            Prepara tu primer HYROX en un gimnasio normal. <span className="text-accent-ink">Sin trineos, sin material raro y sin postureo.</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to={HYROX_CONTACT}>
              Quiero mi plan HYROX <ArrowIcon className="h-4 w-4" />
            </Button>
            <Button href="#metodo" variant="secondary">
              Cómo funciona
            </Button>
          </div>
        </PageHero>
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
                <StaggerItem key={label} className="rounded-2xl border border-line bg-panel p-7">
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
      <section id="metodo" className="theme-dark relative bg-ink py-24 md:py-32">
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
          <Reveal as="div" className="mx-auto w-full max-w-sm lg:max-w-none">
            <Photo photo={HYROX_PHOTOS.metodo} />
          </Reveal>
        </div>
      </section>

      {/* ── Barcelona · dobles mixtos ──────────── */}
      <section id="barcelona" className="relative overflow-hidden bg-ink py-24 md:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(255,201,60,0.14),transparent_55%)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <Reveal as="div" className="order-2 mx-auto w-full max-w-sm lg:order-1 lg:max-w-none">
            <Photo photo={HYROX_PHOTOS.barcelona} />
          </Reveal>
          <div className="order-1 lg:order-2">
            <Reveal as="div">
              <p className={kicker}>Tu primera carrera</p>
              <SectionHeading title={`${HYROX_EVENT.nombre}, en ${HYROX_EVENT.modalidad.toLowerCase()}`} className="mt-4" />
              {HYROX_EVENT.fecha && (
                <p className="mt-4 inline-flex rounded-full border border-accent/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-ink">
                  {HYROX_EVENT.fecha}
                </p>
              )}
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-2 md:text-lg">
                Barcelona es el sitio perfecto para debutar. Y la mejor forma de hacerlo: en dobles mixtos. Vais en
                pareja, un chico y una chica; corréis juntos los 8 km y os repartís el trabajo de las estaciones. Mismo
                recorrido, la mitad de miedo y el doble de risas.
              </p>
            </Reveal>
            <Stagger as="ul" className="mt-8 space-y-4">
              {[
                ['Tú + tu pareja de equipo', 'Entrenáis para lo mismo y llegáis juntos a la salida.'],
                ['Chico y chica', 'La modalidad mixta: un equipo de dos, un solo objetivo.'],
                ['Ideal para debutar', 'El esfuerzo se comparte, y la salida da bastante menos respeto.'],
              ].map(([t, d]) => (
                <StaggerItem key={t} as="li" className="flex gap-4">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold text-fg">{t}</span>
                    <span className="text-fg-2">{d}</span>
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal as="div" className="mt-10 flex flex-wrap items-center gap-4">
              <Button to={HYROX_CONTACT}>
                Quiero prepararme para Barcelona <ArrowIcon className="h-4 w-4" />
              </Button>
              <p className="text-sm text-muted">¿Aún no tienes pareja? Cuéntaselo a Jaime.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ──────────────────────── */}
      <section className="theme-dark relative bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal as="div" className="mb-12 md:mb-16">
            <SectionHeading title="Así de fácil" />
            <p className="mt-4 max-w-xl text-base text-fg-2 md:text-lg">Cuatro pasos, y el primero es gratis.</p>
          </Reveal>
          <Stagger as="ol" className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {HYROX_STEPS.map((s, i) => (
              <StaggerItem key={s.title} as="li" className="rounded-2xl border border-line bg-panel p-7">
                <span className="font-display text-6xl font-bold leading-none text-accent-ink">{i + 1}</span>
                <h3 className="mt-5 font-display text-2xl font-semibold leading-tight">{s.title}</h3>
                <p className="mt-3 text-fg-2">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Para quién ─────────────────────────── */}
      <section className="bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal as="div" className="mb-12 md:mb-16">
            <SectionHeading title="¿Es para ti?" />
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {HYROX_FOR.map((f) => (
              <StaggerItem key={f.title} hover className="rounded-2xl border border-line bg-panel p-7 hover:border-brand/60 hover:bg-panel-2 md:p-8">
                <UsersIcon className="h-7 w-7 text-brand" />
                <h3 className="mt-5 font-display text-2xl font-semibold leading-tight md:text-3xl">{f.title}</h3>
                <p className="mt-3 text-fg-2">{f.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── El plan y el precio ────────────────── */}
      <section id="plan" className="theme-dark relative overflow-hidden bg-ink py-24 md:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(61,139,255,0.18),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-5xl px-5 md:px-8">
          <Reveal as="div" className="text-center">
            <p className={kicker}>El plan</p>
            <SectionHeading title="Plan HYROX" className="mt-4" />
          </Reveal>
          <Reveal as="div" className="mt-12 grid gap-8 rounded-3xl border border-accent/50 bg-panel-2 p-7 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:p-12">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-accent">
                <StarIcon className="h-3 w-3" /> 100 % personalizado
              </span>
              <ul className="mt-6 space-y-4">
                {HYROX_INCLUDES.map((t) => (
                  <li key={t} className="flex gap-3 text-fg-2">
                    <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-accent-ink" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center border-t border-line pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Precio</p>
              <p className="mt-2 font-display text-5xl font-bold leading-none md:text-6xl">A consultar</p>
              <p className="mt-4 text-sm leading-relaxed text-fg-2">
                Es un plan hecho a tu medida, así que el precio lo ves con Jaime: depende de tu nivel, tu fecha y de si vais
                en dobles. La primera asesoría es gratis y sin compromiso.
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

      {/* ── Preguntas ──────────────────────────── */}
      <section className="bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal as="div" className="mb-10">
            <SectionHeading title="Preguntas sobre HYROX" />
          </Reveal>
          <div className="divide-y divide-line border-y border-line">
            {HYROX_FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="text-2xl leading-none text-accent-ink transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-fg-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="theme-dark relative z-10">
        <FinalCTA />
      </div>
    </>
  )
}
