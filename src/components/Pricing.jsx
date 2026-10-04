import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PRICING, YEARLY_DISCOUNT, num, yearlyMonthly } from '../data/pricing.js'
import { BillingPrice, BillingToggle } from './BillingToggle.jsx'
import { Stagger, StaggerItem } from './Reveal.jsx'
import Button from './Button.jsx'
import { ArrowIcon, CheckIcon, StarIcon } from './Icons.jsx'

// Selector 8 / 10 / 12 semanas del plan Peak.
function WeeksPicker({ options, value, onChange }) {
  return (
    <div className="mt-6">
      {/* Control segmentado: una sola pieza, sin bordes por opción */}
      <div
        role="radiogroup"
        aria-label="Duración del pack"
        className="grid grid-cols-3 gap-1 rounded-xl bg-panel-2 p-1"
      >
        {options.map((o) => {
          const active = o.weeks === value
          return (
            <button
              key={o.weeks}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.weeks)}
              className={`rounded-lg py-2.5 text-sm font-bold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand ${
                active ? 'bg-fg text-ink' : 'text-muted hover:text-fg'
              }`}
            >
              {o.weeks} sem
            </button>
          )
        })}
      </div>
    </div>
  )
}

const money = (v) => `${v.toFixed(2).replace('.', ',')}€`

function PlanCard({ p, yearly }) {
  const [weeks, setWeeks] = useState(p.defaultWeeks)
  const option = p.options?.find((o) => o.weeks === weeks)
  // El pago anual (-20 %) solo aplica a los planes mensuales; Peak es un pack cerrado
  const annual = yearly && !option && p.amount !== undefined
  const base = option ? num(option.price) : p.amount
  const amount = annual ? yearlyMonthly(base) : base
  const was = annual ? base : p.oldAmount
  const href = option
    ? `/contacto?plan=${p.id}&semanas=${weeks}`
    : `/contacto?plan=${p.id}${annual ? '&periodo=anual' : ''}`

  return (
    <StaggerItem
      hover
      className={`relative flex min-w-0 flex-col rounded-2xl border bg-panel p-6 sm:p-7 ${
        p.featured
          ? 'border-accent/40 bg-panel-2 hover:border-accent xl:-my-4 xl:py-12'
          : p.tag
            ? 'border-dashed border-fg/25 hover:border-brand/60 hover:bg-panel-2'
            : 'border-line hover:border-brand/60 hover:bg-panel-2'
      }`}
    >
      {p.featured && (
        <>
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-accent" />
          <span className="absolute right-5 top-6 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-on-accent">
            <StarIcon className="h-3 w-3" />
            {p.badge}
          </span>
        </>
      )}
      {p.tag && (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">{p.tag}</p>
      )}
      <h3 className="font-display text-5xl leading-none">{p.name}</h3>
      <p className="mt-2 text-sm text-muted">{p.tagline}</p>
      {p.lead && <p className="mt-3 text-sm font-semibold text-fg">{p.lead}</p>}

      {p.options && (
        <>
          <WeeksPicker options={p.options} value={weeks} onChange={setWeeks} />
          {option.events && <p className="mt-3 text-sm text-muted">{option.events}</p>}
        </>
      )}

      <BillingPrice
        amount={amount}
        decimals={option ? 0 : 2}
        was={was}
        period={p.period}
        className="text-5xl sm:text-6xl md:text-6xl xl:text-5xl 2xl:text-6xl"
      />
      <AnimatePresence initial={false}>
        {annual && (
          <motion.p
            key="year"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden text-xs leading-relaxed text-muted"
          >
            <span className="mt-2 block">
              Pagas {money(amount * 12)} al año · ahorras {money((base - amount) * 12)}
            </span>
          </motion.p>
        )}
      </AnimatePresence>
      {p.id === 'mvp' && p.badge && (
        <p className="mt-3 inline-flex self-start rounded-full border border-accent/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent-ink">
          {p.badge}
        </p>
      )}

      <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-6">
        {p.features.map((f) => {
          const item = typeof f === 'string' ? { title: f } : f
          return (
            <li key={item.title} className="flex gap-3 text-sm text-fg-2">
              <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? 'text-accent-ink' : 'text-brand'}`} />
              <span className="min-w-0">
                {item.title}
                {item.note && <span className="mt-1 block text-xs leading-relaxed text-muted">{item.note}</span>}
              </span>
            </li>
          )
        })}
      </ul>
      {p.extra && <p className="mt-6 text-xs leading-relaxed text-muted">{p.extra}</p>}
      {p.note && (
        <p className="mt-6 text-sm leading-relaxed text-muted">
          {p.note}{' '}
          <Link to={`/contacto?plan=${p.id}`} className="font-semibold text-brand hover:text-accent-ink">
            Hablar con Jaime →
          </Link>
        </p>
      )}
      <Button to={href} variant={p.featured ? 'primary' : 'secondary'} className="mt-8 w-full">
        {p.cta} <ArrowIcon className="h-4 w-4" />
      </Button>
    </StaggerItem>
  )
}

const BILLING = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual', badge: `Ahorra ${Math.round(YEARLY_DISCOUNT * 100)}%`, activeBadge: `Ahorras ${Math.round(YEARLY_DISCOUNT * 100)}%` },
]

export default function PricingCards() {
  const [billing, setBilling] = useState('monthly')
  const yearly = billing === 'yearly'
  return (
    <>
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <BillingToggle value={billing} onValueChange={setBilling} options={BILLING} />
        <p className="max-w-md text-xs text-muted">
          {Math.round(YEARLY_DISCOUNT * 100)}% de descuento si coges el año entero en Rookie, All In o MVP. Peak es un
          pack cerrado y no cambia.
        </p>
      </div>
      <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:items-stretch">
        {PRICING.map((p) => (
          <PlanCard key={p.id} p={p} yearly={yearly} />
        ))}
      </Stagger>
      {/* Descuentos: una sola franja (sin tarjetas), justo debajo de los planes */}
      <div className="mt-16 grid gap-8 border-y border-line py-10 md:mt-20 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line">
        <div className="md:pr-10">
          <p className="font-display text-3xl leading-none lg:text-4xl xl:text-5xl">
            <span className="text-accent-ink">-10%</span> con carné universitario
          </p>
          <p className="mt-3 text-fg-2">Se verifica cuando hablas con Jaime.</p>
        </div>
        <div className="md:pl-10">
          <p className="font-display text-3xl leading-none lg:text-4xl xl:text-5xl">
            <span className="text-accent-ink">-15%</span> / <span className="text-accent-ink">-25%</span> con tu squad
          </p>
          <p className="mt-3 text-fg-2">
            Si os apuntáis 2 amigos, -15% cada uno; 3 o más, -25%. Alta conjunta en Rookie y All In.{' '}
            <Link to="/contacto?plan=squad" className="font-semibold text-brand underline-offset-4 hover:underline">
              Entrar con mi squad →
            </Link>
          </p>
        </div>
      </div>
      <p className="mt-8 text-center text-fg-2">
        ¿No sabes qué plan elegir?{' '}
        <Link to="/test" className="font-semibold text-brand underline-offset-4 hover:underline">
          Hazte el test de estudihambre →
        </Link>
      </p>
    </>
  )
}
