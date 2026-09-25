import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import Button from '../components/Button.jsx'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx'
import { AppleIcon, ArrowIcon, ChatIcon, DumbbellIcon, UsersIcon } from '../components/Icons.jsx'
import PlanExtras from '../components/PlanExtras.jsx'

const SERVICES = [
  {
    Icon: DumbbellIcon,
    title: 'Entrenamiento personalizado',
    text: 'Diseño tu plan de entrenamiento desde cero según tu nivel, tus objetivos y el material que tienes disponible. Gym, running, trail, HYROX, obstáculos, o una combinación. Cada rutina se adapta a ti y se actualiza para seguir progresando.',
  },
  {
    Icon: AppleIcon,
    title: 'Nutrición adaptada a tu vida',
    text: 'Planes de nutrición pensados para quien vive en un piso de estudiantes, come tuppers en la uni o cena fuera los fines de semana. Recetas Mercadona, listas de la compra realistas, y estrategias para comer bien sin gastarte lo que no tienes. No es una dieta, es aprender a comer.',
  },
  {
    Icon: ChatIcon,
    title: 'Seguimiento real, no un PDF y adiós',
    text: 'Estoy contigo cada semana. Revisiones periódicas por WhatsApp, videollamadas mensuales en el plan All In, y análisis de técnica en vídeo cuando lo necesites, sin coste extra (que estamos para aprender). Si tienes una duda a las 22h antes del entreno de mañana, ¡mándamela!',
  },
  {
    Icon: UsersIcon,
    title: 'La comunidad de Train with Jaime',
    text: 'Train with Jaime tiene su propia plataforma, exclusiva para clientes: ahí gestionas tus entrenos y tu nutrición, y además encuentras entradas de blog, recetas, recomendaciones, un espacio para resolver tus dudas y retos. Y todos los clientes entran también en la Comunidad de WhatsApp: tips semanales de entreno y nutrición, retos mensuales, y un equipo que te empuja cuando la motivación flojea. Aquí no entrenas solo.',
    tags: ['Entrenos', 'Nutrición', 'Blog', 'Recetas', 'Recomendaciones', 'Dudas', 'Retos'],
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
            <Stagger className="grid gap-5 md:grid-cols-2">
              {SERVICES.map(({ Icon, title, text, tags }) => (
                <StaggerItem
                  key={title}
                  hover
                  className="group flex flex-col rounded-2xl border border-line bg-panel p-7 hover:border-brand/60 hover:bg-panel-2 md:p-10"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand transition-colors duration-200 group-hover:border-accent/50 group-hover:bg-accent/10 group-hover:text-accent-ink">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h2 className="mt-8 font-display text-4xl uppercase leading-[1.02] md:text-5xl">{title}</h2>
                  <p className="mt-4 leading-relaxed text-fg-2">{text}</p>
                  {tags && (
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label="En la plataforma">
                      {tags.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-line bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fg-2"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
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
                {[
                  ['Videollamada extra', '15€'],
                  ['Sesión presencial en Pamplona', '25€'],
                ].map(([label, price]) => (
                  <li
                    key={label}
                    className="flex items-baseline justify-between gap-4 py-4 text-fg-2 transition-[color,padding] duration-200 hover:pl-2 hover:text-fg"
                  >
                    {label}
                    <span className="font-display text-3xl leading-none text-fg">{price}</span>
                  </li>
                ))}
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

      <ScrollSection effect="zoom">
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <PlanExtras />
          </div>
        </section>
      </ScrollSection>

      <ScrollSection effect="parallax" bg="bg-panel" last>
        <Reveal className="border-t border-line bg-panel py-20 md:py-28">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 md:flex-row md:items-end md:justify-between md:px-8">
            <h2 className="font-display text-5xl uppercase leading-[1.02] md:text-7xl">Elige tu plan</h2>
            <Button to="/#precios">
              Ver precios <ArrowIcon className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </ScrollSection>
    </>
  )
}
