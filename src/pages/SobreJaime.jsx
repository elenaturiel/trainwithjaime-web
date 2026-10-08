import SectionHeading from '../components/SectionHeading.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx'
import { GradCapIcon, HeartIcon, SparklesIcon, UsersIcon } from '../components/Icons.jsx'
import { motion } from 'framer-motion'
import FinalCTA from '../components/FinalCTA.jsx'
import ImageCompare from '../components/ImageCompare.jsx'
import { BEFORE_AFTER } from '../config.js'
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
      <ScrollSection effect="stack" first dark>
        <section className="bg-ink pb-20 pt-36 md:pb-32 md:pt-48">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-16 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="group overflow-hidden rounded-2xl border border-line bg-panel"
            >
              <img
                src="/foto-6.jpg"
                alt="Jaime con los brazos cruzados, sonriendo"
                className="aspect-[3/4] h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            >
              <h1 className="font-display text-5xl leading-[1.02] md:text-7xl">
                Un estudiante que <span className="font-bold">entiende a otros estudiantes</span>
              </h1>
              <p className="mt-4 font-semibold text-brand">CAFYD · 4º curso · Atleta de HYROX · Anti-postureo</p>
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
        <section id="valores" className="border-y border-line bg-panel py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal as="div">
              <SectionHeading title="Lo que defiendo" />
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
                  <h3 className="mt-6 font-display text-3xl">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-2">{v.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      </ScrollSection>

      {/* Solo cuando hay fotos reales en BEFORE_AFTER (src/config.js) */}
      {BEFORE_AFTER.before && BEFORE_AFTER.after && (
        <ScrollSection effect="zoom" dark>
          <section className="bg-ink py-24 md:py-32">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-8">
              <Reveal as="div">
                <SectionHeading title="Mi cambio" />
                <p className="mt-6 max-w-md text-base leading-relaxed text-fg-2">
                  Antes y después de empezar a entrenar con cabeza. Arrastra la línea para ver la diferencia.
                </p>
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
        </ScrollSection>
      )}

      <ScrollSection effect="zoom" bg="bg-panel" last dark>
        <FinalCTA />
      </ScrollSection>
    </>
  )
}
