import Button from './Button.jsx'
import { Reveal } from './Reveal.jsx'
import { ArrowIcon } from './Icons.jsx'

// Bloque de la home que presenta el plan HYROX (ya activo) y lleva a su página.
export default function HyroxPromo() {
  return (
    <section className="theme-dark relative overflow-hidden bg-ink py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,201,60,0.16),transparent_55%)]"
      />
      <Reveal as="div" className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-ink">Nuevo plan · HYROX</p>
          <h2 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-[1.02] md:text-7xl xl:text-8xl">Entrena para tu HYROX</h2>
          <p className="mt-6 max-w-xl text-base text-fg-2 md:text-lg">
            Prepárate para cualquier HYROX en un gimnasio normal, sin material específico y sin postureo. Individual,
            parejas o mixtos: Jaime te hace el plan a tu medida.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button to="/entrenamiento-hyrox">
              Ver el plan HYROX <ArrowIcon className="h-4 w-4" />
            </Button>
            <Button to="/contacto?plan=hyrox&origen=hyrox" variant="secondary">
              Consultar precio
            </Button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-line lg:max-w-none">
          <img
            src="/hyrox-podio.jpg"
            alt="Jaime sentado en el podio de HYROX Barcelona con el cartel “My first HYROX”"
            loading="lazy"
            decoding="async"
            draggable={false}
            className="aspect-[3/4] w-full object-cover"
          />
        </div>
      </Reveal>
    </section>
  )
}
