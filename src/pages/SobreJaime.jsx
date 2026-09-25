import SectionHeading from '../components/SectionHeading.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import Button from '../components/Button.jsx'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { motion } from 'framer-motion'
import { EASE } from '../lib/motion.js'

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
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-2 md:items-center md:gap-16 md:px-8">
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
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand">Sobre Jaime</p>
              <h1 className="font-display text-7xl uppercase leading-[0.9] md:text-9xl">Soy Jaime</h1>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                <li className="flex items-baseline justify-between gap-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Formación</span>
                  <span className="text-right text-fg">CAFYD · 4º curso</span>
                </li>
                <li className="flex items-baseline justify-between gap-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Compite en</span>
                  <span className="text-right text-fg">Atleta de HYROX</span>
                </li>
                <li className="flex items-baseline justify-between gap-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Filosofía</span>
                  <span className="text-right text-fg">Anti-postureo</span>
                </li>
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
                  <p className="font-display text-6xl leading-none text-brand transition-colors duration-200 group-hover:text-accent">
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
            <blockquote className="font-display text-6xl uppercase leading-[0.9] md:text-[140px]">
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
