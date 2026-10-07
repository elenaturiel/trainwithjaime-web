import { Link } from 'react-router-dom'
import Button from './Button.jsx'
import { Reveal } from './Reveal.jsx'
import { ArrowIcon } from './Icons.jsx'
import { HYROX_BANNER } from '../config.js'
import { useHasTopBar } from '../lib/topbar.js'

/* ══ Banner HYROX ═════════════════════════════════════════
   Un solo componente para las 4 ubicaciones. El texto sale de HYROX_BANNER (src/config.js): cambia ahí la frase
   para probar variantes, y se actualizan los cuatro a la vez. Cada uno enlaza a /hyrox?ub=<ubicacion>, y esa
   ubicación queda guardada con el registro, así se ve cuál trae más gente.

     ubicacion="barra"   → barra fina fija arriba, en todas las páginas
     ubicacion="home"    → bloque grande de la home
     ubicacion="planes"  → bloque entre las secciones de planes
     ubicacion="footer"  → pie de página */

export default function HyroxBanner({ ubicacion, text = HYROX_BANNER.text, cta = HYROX_BANNER.cta }) {
  const to = `/hyrox?ub=${ubicacion}`
  const hasBar = useHasTopBar()

  if (ubicacion === 'barra') {
    if (!hasBar) return null
    return (
      <Link
        to={to}
        className="fixed inset-x-0 top-0 z-50 flex h-9 items-center justify-center gap-3 bg-accent px-4 text-xs font-semibold text-on-accent transition-colors hover:bg-[#ffd666] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-on-accent"
      >
        <span className="min-w-0 truncate">{text}</span>
        <span className="flex shrink-0 items-center gap-1 underline underline-offset-2">
          {cta} <ArrowIcon className="h-3 w-3" />
        </span>
      </Link>
    )
  }

  if (ubicacion === 'home') {
    return (
      <section className="theme-dark relative overflow-hidden bg-ink py-24 md:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,201,60,0.16),transparent_55%)]"
        />
        <Reveal as="div" className="relative mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-ink">HYROX · sin postureo</p>
          <h2 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-[1.02] md:text-8xl">{text}</h2>
          <p className="mt-6 max-w-xl text-base text-fg-2 md:text-lg">
            Jaime está preparando un plan para quien llega sin saber ni por dónde empezar. Déjanos tu email y te
            escribimos antes que a nadie.
          </p>
          <div className="mt-10">
            <Button to={to}>
              {cta} <ArrowIcon className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </section>
    )
  }

  if (ubicacion === 'planes') {
    return (
      <section className="bg-ink py-10 md:py-14">
        <Reveal
          as="div"
          className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-center md:px-8"
        >
          <div className="rounded-3xl border border-accent/60 bg-accent/10 px-6 py-8 md:flex md:w-full md:items-center md:justify-between md:gap-8 md:px-10">
            <p className="font-display text-3xl font-bold leading-[1.05] md:max-w-2xl md:text-5xl">{text}</p>
            <div className="mt-6 shrink-0 md:mt-0">
              <Button to={to}>
                {cta} <ArrowIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    )
  }

  // footer (no en el propio formulario ni en la vista privada)
  if (!hasBar) return null
  return (
    <div className="border-b border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-display text-xl font-semibold leading-tight text-fg md:text-2xl">{text}</p>
        <Link
          to={to}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-fg/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-fg transition-colors hover:border-fg/60 hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {cta} <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
