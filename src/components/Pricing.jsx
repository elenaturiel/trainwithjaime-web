import { Link } from 'react-router-dom'
import { useState } from 'react'
import { BILLING_OPTIONS, setBilling, useBilling } from '../lib/billing.js'
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


// Versión compacta (home): una tarjeta con una fila por plan — nombre y resumen de una línea a la izquierda,
// precio a la derecha. Los detalles completos están en /precios.
function PricingList({ yearly, billing }) {
  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-line bg-panel p-5 sm:p-7 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-display text-2xl font-semibold leading-none md:text-3xl">Elige tu plan</h3>
        {billing}
      </div>
      <ul className="mt-6 divide-y divide-line border-t border-line">
        {PRICING.map((p) => {
          const peak = !!p.options
          const base = peak ? Math.min(...p.options.map((o) => num(o.price))) : p.amount
          const annual = yearly && !peak
          const amount = annual ? yearlyMonthly(base) : base
          const was = annual ? base : p.oldAmount
          const href = `/contacto?plan=${p.id}${annual ? '&periodo=anual' : ''}${peak ? '&semanas=10' : ''}`
          return (
            <li key={p.id} className="grid items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h4 className="font-display text-2xl font-semibold leading-none md:text-3xl">{p.name}</h4>
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-on-accent">
                      <StarIcon className="h-2.5 w-2.5" />
                      {p.badge}
                    </span>
                  )}
                  {p.id === 'mvp' && (
                    <span className="rounded-full border border-accent/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent-ink">
                      {p.badge.split(' · ')[0]}
                    </span>
                  )}
                  {p.tag && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{p.tag}</span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-muted">{p.summary}</p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-left sm:text-right">
                  <BillingPrice
                    compact
                    amount={amount}
                    decimals={peak ? 0 : 2}
                    was={was}
                    period={p.period}
                    prefix={peak ? 'desde' : undefined}
                    className="text-3xl md:text-4xl"
                  />
                  <p className="mt-1 h-4 text-xs text-muted">{annual ? `${money(amount * 12)} al año` : '\u00A0'}</p>
                </div>
                <Link
                  to={href}
                  aria-label={`${p.cta}${annual ? ' (plan anual)' : ''}`}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    p.featured
                      ? 'border-accent bg-accent text-on-accent hover:bg-[#ffd666]'
                      : 'border-fg/25 text-fg hover:border-fg/60 hover:bg-fg/5'
                  }`}
                >
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function PricingCards({ compact = false }) {
  const billing = useBilling()
  const yearly = billing === 'yearly'
  const toggle = <BillingToggle value={billing} onValueChange={setBilling} options={BILLING_OPTIONS} />
  const note = (
    <p className="max-w-md text-xs text-muted">
      {Math.round(YEARLY_DISCOUNT * 100)}% de descuento si coges el año entero en Rookie, All In o MVP. Peak es un pack
      cerrado y no cambia.
    </p>
  )
  return (
    <>
      {compact ? (
        <>
          <PricingList yearly={yearly} billing={toggle} />
          <div className="mt-4 flex justify-center text-center">{note}</div>
        </>
      ) : (
        <>
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            {toggle}
            {note}
          </div>
      <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:items-stretch">
        {PRICING.map((p) => (
          <PlanCard key={p.id} p={p} yearly={yearly} />
        ))}
      </Stagger>
        </>
      )}
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
