import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import FoldText from '../components/FoldText.jsx'
import SnapText from '../components/SnapText.jsx'
import Tabs from '../components/Tabs.jsx'
import Marquee from '../components/Marquee.jsx'
import RollingNumber from '../components/RollingNumber.jsx'
import FinalCTA from '../components/FinalCTA.jsx'
import PlanExtras from '../components/PlanExtras.jsx'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx'
import { AppleIcon, ChatIcon, DumbbellIcon, UsersIcon } from '../components/Icons.jsx'

// Cada servicio es una pestaña. `value` coincide con las anclas del menú (/servicios#nutricion…).
// ⚠️ REVISAR: los textos largos son los de siempre; las listas cortas ("chips") salen de esos mismos textos.
const SERVICES = [
  {
    value: 'entrenamiento',
    label: 'Entrenamiento',
    Icon: DumbbellIcon,
    title: 'Entrenamiento personalizado',
    text: 'Diseño tu plan de entrenamiento desde cero según tu nivel, tus objetivos y el material que tienes disponible. Gym, running, trail, HYROX, obstáculos, o una combinación. Cada rutina se adapta a ti y se actualiza para seguir progresando.',
    chips: ['HYROX', 'Entrenamiento funcional', 'Gym/hipertrofia', 'Running para principiantes', 'Programación a medida'],
    image: '/foto-4.jpg',
    alt: 'Jaime con un disco en las manos, mirando a cámara',
  },
  {
    value: 'nutricion',
    label: 'Nutrición',
    Icon: AppleIcon,
    title: 'Nutrición adaptada a tu vida',
    text: 'Planes de nutrición pensados para quien vive en un piso de estudiantes, come tuppers en la uni o cena fuera los fines de semana. Recetas Mercadona, listas de la compra realistas, y estrategias para comer bien sin gastarte lo que no tienes. No es una dieta, es aprender a comer.',
    chips: ['Recetas Mercadona', 'Tuppers', 'Comer fuera', 'Listas de la compra'],
    image: '/foto-1.jpg',
    alt: 'Jaime sonriendo, sentado en un banco del gimnasio',
  },
  {
    value: 'seguimiento',
    label: 'Seguimiento',
    Icon: ChatIcon,
    title: 'Seguimiento real, no un PDF y adiós',
    text: 'Estoy contigo cada semana. Revisiones periódicas por WhatsApp, videollamadas mensuales en el plan All In, y análisis de técnica en vídeo cuando lo necesites, sin coste extra (que estamos para aprender). Si tienes una duda a las 22h antes del entreno de mañana, ¡mándamela!',
    chips: ['Revisión por WhatsApp', 'Videollamada mensual', 'Análisis de técnica en vídeo'],
    image: '/foto-2.jpg',
    alt: 'Jaime sentado en un cajón de salto',
  },
  {
    value: 'comunidad',
    label: 'Comunidad',
    Icon: UsersIcon,
    title: 'La comunidad de Train with Jaime',
    text: 'Train with Jaime tiene su propia plataforma, exclusiva para clientes: ahí gestionas tus entrenos y tu nutrición, y además encuentras entradas de blog, recetas, recomendaciones, un espacio para resolver tus dudas y retos. Y todos los clientes entran también en la Comunidad de WhatsApp: tips semanales de entreno y nutrición, retos mensuales, y un equipo que te empuja cuando la motivación flojea. Aquí no entrenas solo.',
    chips: ['Entrenos', 'Nutrición', 'Blog', 'Recetas', 'Recomendaciones', 'Dudas', 'Retos'],
    image: '/foto-6.jpg',
    alt: 'Jaime con los brazos cruzados frente a las mancuernas',
  },
]

const SPECIALTIES = ['HYROX', 'Funcional', 'Gym', 'Running', 'A tu medida']

// ⚠️ REVISAR: copy propuesto, hecho con lo que ya dice la web (asesoría gratis, plan a medida, seguimiento, progreso).
const STEPS = [
  { title: 'Primera asesoría gratis', text: 'Le cuentas tu objetivo a Jaime y te dice qué plan te encaja, sin compromiso.' },
  { title: 'Un plan hecho para ti', text: 'Entrenamiento y nutrición diseñados alrededor de tus clases, tus exámenes y tu presupuesto real.' },
  { title: 'Seguimiento de verdad', text: 'Revisiones por WhatsApp, análisis de técnica en vídeo y una plataforma solo para clientes.' },
  { title: 'Resultados que se miden', text: 'Medimos marcas, no likes: registramos tu progreso y ajustamos el plan cuando hace falta.' },
]
const STEP_IMAGES = ['/foto-5.jpg', '/foto-3.jpg', '/foto-1.jpg', '/foto-2.jpg']

const EXTRAS = [
  { label: 'Videollamada extra', value: '15' },
  { label: 'Sesión presencial en Pamplona', value: '25' },
]

const heading = (text, cls = '') => (
  <FoldText
    as="h2"
    text={text}
    splitBy="char"
    hinge="top"
    trigger="inView"
    duration={0.65}
    stagger={0.045}
    ease="power3.out"
    perspective={700}
    creaseShading={0.55}
    className={`block text-center font-display font-bold uppercase leading-none ${cls}`}
  />
)

function ServiceTabs() {
  const { hash } = useLocation()
  const [value, setValue] = useState(SERVICES[0].value)

  // Las anclas del menú (/servicios#nutricion) eligen la pestaña
  useEffect(() => {
    const id = hash.slice(1)
    if (SERVICES.some((s) => s.value === id)) setValue(id)
  }, [hash])

  const tabs = SERVICES.map((s) => ({
    value: s.value,
    label: s.label,
    content: (
      <div className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
        <div>
          <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
            <s.Icon className="h-7 w-7" />
          </span>
          <h3 className="mt-6 font-display text-4xl leading-[1.02] md:text-6xl">{s.title}</h3>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-2 md:text-lg">{s.text}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Incluye">
            {s.chips.map((c) => (
              <li
                key={c}
                className="rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fg-2 md:text-sm"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-panel-2 md:max-w-none">
          <img src={s.image} alt={s.alt} draggable={false} className="aspect-[3/4] w-full object-cover" />
        </div>
      </div>
    ),
  }))

  return (
    <div className="relative">
      {/* Anclas del menú: dejan el scroll justo encima de las pestañas */}
      {SERVICES.map((s) => (
        <span key={s.value} id={s.value} aria-hidden="true" className="absolute -top-24" />
      ))}
      <Tabs tabs={tabs} value={value} onValueChange={setValue} label="Servicios" />
    </div>
  )
}

export default function Servicios() {
  return (
    <>
      <ScrollSection effect="stack" first dark>
        <PageHero
          center
          title={
            <FoldText
              text="Servicios"
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
          Entrenamiento, nutrición y seguimiento de verdad, todo online y pensado para universitarios.
        </PageHero>
      </ScrollSection>

      <ScrollSection effect="zoom">
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <ServiceTabs />
          </div>
        </section>
      </ScrollSection>

      {/* Sin ScrollSection: así la cinta mantiene siempre su tamaño (esos contenedores se abren al hacer scroll) */}
      <section className="theme-dark relative z-10 border-y border-line bg-panel py-7 md:py-9" aria-label="Lo que entrenamos">
        <Marquee items={SPECIALTIES} className="text-fg" />
      </section>

      {/* Sin ScrollSection: su contenedor recorta el desbordamiento y rompería el sticky de SnapText */}
      <section className="theme-dark relative bg-ink">
        <SnapText
          items={STEPS}
          images={STEP_IMAGES}
          colors={['#FFC93C', '#5C9DFF', '#FFFFFF', '#FFC93C']}
          heading={heading('Cómo funciona', 'text-4xl md:text-[5.25rem]')}
        />
      </section>

      <ScrollSection effect="clip">
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal as="div" className="mb-12 md:mb-16">
              {heading('Extras', 'text-5xl md:text-[7rem]')}
            </Reveal>
            <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {EXTRAS.map((e) => (
                <StaggerItem
                  key={e.label}
                  hover
                  className="min-w-0 rounded-2xl border border-line bg-panel p-7 hover:border-brand/60 hover:bg-panel-2 md:p-10"
                >
                  <p className="font-display text-7xl font-bold leading-none xl:text-8xl">
                    <RollingNumber value={e.value} suffix="€" />
                  </p>
                  <p className="mt-6 text-lg text-fg-2">{e.label}</p>
                </StaggerItem>
              ))}
              <StaggerItem
                hover
                className="flex min-w-0 flex-col justify-between md:col-span-2 xl:col-span-1 rounded-2xl border border-line bg-panel p-7 hover:border-brand/60 hover:bg-panel-2 md:p-10"
              >
                <h3 className="font-display text-3xl leading-none sm:text-4xl xl:text-5xl">Suplementación honesta</h3>
                <p className="mt-6 text-lg text-fg-2">Creatina y proteína cuando aportan, sin vender humo.</p>
              </StaggerItem>
            </Stagger>
          </div>
        </section>
      </ScrollSection>

      <ScrollSection effect="zoom" dark>
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <PlanExtras />
          </div>
        </section>
      </ScrollSection>

      <ScrollSection effect="parallax" bg="bg-panel" last dark>
        <FinalCTA />
      </ScrollSection>
    </>
  )
}
