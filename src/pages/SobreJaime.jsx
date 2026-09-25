import SectionHeading from '../components/SectionHeading.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import Button from '../components/Button.jsx'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx'
import { ArrowIcon, GradCapIcon, HeartIcon, SparklesIcon, UsersIcon } from '../components/Icons.jsx'
import { motion } from 'framer-motion'
import { EASE } from '../lib/motion.js'

const HIGHLIGHTS = [
  { Icon: GradCapIcon, label: 'Formación universitaria' },
  { Icon: HeartIcon, label: 'Pasión por ayudar' },
  { Icon: UsersIcon, label: 'Trato cercano y personal' },
  { Icon: SparklesIcon, label: 'Precios accesibles' },
]

// ⚠️ REVISAR: textos descriptivos de los valores = copy propuesto.
const VALUES = [
  { n: '01', title: 'Anti-postureo', text: 'Entrenamos para rendir, no para la foto.' },
  { n: '02', title: 'Presupuesto real', text: 'Planes y comida pensados para bolsillo de universitario.' },
  { n: '03', title: 'Resultados sin humo', text: 'Si no se mide en tus marcas, no cuenta.' },
]

export default function SobreJaime() {
  return (
    <>
      <ScrollSection effect="stack" first>
        <section className="bg-ink pb-20 pt-36 md:pb-32 md:pt-48">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-16 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="group overflow-hidden rounded-2xl border border-line bg-panel"
            >
              {/* ⚠️ SUSTITUIR: foto de Jaime en /public/jaime.jpg (vertical, ~1000×1300) */}
              <img
                src="/jaime.jpg"
                alt="Jaime, entrenador de Train with Jaime"
                className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            >
              <div className="flex flex-wrap gap-2">
                {['CAFYD · 4º curso', 'Atleta de HYROX', 'Anti-postureo'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="mt-6 font-display text-5xl uppercase leading-[1.02] md:text-7xl">
                Un estudiante que entiende a otros estudiantes
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-fg-2">
                Hola, soy Jaime y estudio Ciencias de la Actividad Física y del Deporte. Soy un loco del deporte y me
                encanta ayudar a otras personas a mejorar sus hábitos, su confianza y alcanzar su mayor potencial.
                ¿Preparado para ganar?
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                No soy un entrenador certificado (aún), pero tengo experiencia ayudando a estudiantes a alcanzar sus
                metas y retos físicos. Entiendo tu vida, tus horarios, tus limitaciones y tu presupuesto. Aplico todo lo
                que sé de mi formación universitaria mezclado con lo que he ido adquiriendo por experiencia propia.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {HIGHLIGHTS.map(({ Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-line bg-panel px-5 py-4 text-fg transition-[border-color,transform] duration-200 hover:border-brand/60 motion-safe:hover:-translate-y-0.5"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-brand" />
                    {label}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      </ScrollSection>

      <ScrollSection effect="clip" bg="bg-panel">
        <section className="border-y border-line bg-panel py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal as="div">
              <SectionHeading number="01" eyebrow="Valores" title="Lo que defiendo" />
            </Reveal>
            <Stagger className="mt-14 grid border-t border-line md:grid-cols-3">
              {VALUES.map((v) => (
                <StaggerItem
                  key={v.n}
                  hover
                  className="group rounded-xl border-b border-line px-4 py-10 hover:bg-panel-2 md:border-b-0 md:border-l md:px-8 md:first:border-l-0"
                >
                  <p className="font-display text-6xl leading-none text-brand transition-colors duration-200 group-hover:text-accent-ink">
                    {v.n}
                  </p>
                  <h3 className="mt-6 font-display text-3xl uppercase">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-2">{v.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      </ScrollSection>

      <ScrollSection effect="zoom" last>
        <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-ink">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(61,139,255,0.18),transparent_60%)]"
          />
          <Reveal as="figure" className="relative mx-auto max-w-5xl px-5 text-center md:px-8">
            <blockquote className="font-display text-6xl uppercase leading-[1.02] md:text-[140px]">
              “¿Y tú, quieres ganar?”
            </blockquote>
            <figcaption className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
              — Jaime
            </figcaption>
            <div className="mt-10 flex justify-center">
              <Button to="/contacto">
                Contacta con Jaime <ArrowIcon className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </section>
      </ScrollSection>
    </>
  )
}
