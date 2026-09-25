import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import Button from '../components/Button.jsx'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx'
import { ArrowIcon } from '../components/Icons.jsx'

// ⚠️ REVISAR: las descripciones de cada servicio son copy propuesto.
const SERVICES = [
  {
    n: '01',
    title: 'Entrenamiento personalizado',
    text: 'Un plan diseñado para tu objetivo, tu nivel y tu horario de clases. Fuerza, resistencia o las dos.',
  },
  {
    n: '02',
    title: 'Nutrición sin postureo',
    text: 'Comer bien con presupuesto de estudiante. Sin dietas imposibles ni alimentos que no vas a comprar.',
  },
  {
    n: '03',
    title: 'Seguimiento y ajustes',
    text: 'Revisamos tus marcas y tus sensaciones y ajustamos el plan para que sigas progresando.',
  },
]

const SPECIALTIES = [
  'HYROX',
  'Entrenamiento funcional',
  'Gym/hipertrofia',
  'Running para principiantes',
  'Programación a medida',
]

export default function Servicios() {
  return (
    <>
      <ScrollSection effect="stack" first>
        <PageHero eyebrow="Qué hacemos" title="Servicios" />
      </ScrollSection>

      <ScrollSection effect="zoom">
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Stagger className="grid gap-5 md:grid-cols-3">
              {SERVICES.map((s) => (
                <StaggerItem
                  key={s.n}
                  hover
                  className="group flex flex-col rounded-2xl border border-line bg-panel p-7 hover:border-brand/60 hover:bg-panel-2 md:p-8"
                >
                  <p className="font-display text-6xl leading-none text-brand transition-colors duration-200 group-hover:text-accent">
                    {s.n}
                  </p>
                  <h2 className="mt-10 font-display text-4xl uppercase leading-none">{s.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-fg-2">{s.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      </ScrollSection>

      <ScrollSection effect="stack" bg="bg-panel">
        <Reveal className="border-y border-line bg-panel py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeading number="02" eyebrow="Especialidades" title="Lo que entrenamos" />
            <ul className="mt-10 flex flex-wrap gap-3">
              {SPECIALTIES.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line bg-panel-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-fg-2 transition-[border-color,color,transform] duration-200 hover:border-accent hover:text-fg motion-safe:hover:scale-105"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </ScrollSection>

      <ScrollSection effect="clip">
        <section className="bg-ink py-24 md:py-32">
          <Stagger className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-2 md:px-8">
            <StaggerItem
              hover
              className="rounded-2xl border border-line bg-panel p-7 hover:border-brand/60 hover:bg-panel-2 md:p-10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">03</p>
              <h2 className="mt-4 font-display text-5xl uppercase leading-none">Extras</h2>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                <li className="py-4 text-fg-2 transition-[color,padding] duration-200 hover:pl-2 hover:text-fg">
                  Videollamadas adicionales
                </li>
                <li className="py-4 text-fg-2 transition-[color,padding] duration-200 hover:pl-2 hover:text-fg">
                  Sesiones presenciales en Pamplona
                </li>
              </ul>
            </StaggerItem>
            <StaggerItem
              hover
              className="rounded-2xl border border-line bg-panel p-7 hover:border-brand/60 hover:bg-panel-2 md:p-10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">04</p>
              <h2 className="mt-4 font-display text-5xl uppercase leading-none">Suplementación honesta</h2>
              <p className="mt-8 text-fg-2">Creatina y proteína cuando aportan, sin vender humo.</p>
            </StaggerItem>
          </Stagger>
        </section>
      </ScrollSection>

      <ScrollSection effect="parallax" bg="bg-panel" last>
        <Reveal className="border-t border-line bg-panel py-20 md:py-28">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 md:flex-row md:items-end md:justify-between md:px-8">
            <h2 className="font-display text-5xl uppercase leading-[0.9] md:text-7xl">Elige tu plan</h2>
            <Button to="/#precios">
              Ver precios <ArrowIcon className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </ScrollSection>
    </>
  )
}
