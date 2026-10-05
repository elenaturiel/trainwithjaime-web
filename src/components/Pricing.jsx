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
    <div className="mt-4">
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
              className={`rounded-lg py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand ${
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

// Tarjeta de plan. Es una "subcuadrícula" de 4 filas (cabecera · precio · prestaciones · botón) que comparte filas con
// las demás tarjetas: así los 4 precios y los 4 botones quedan siempre alineados en la misma línea, aunque los
// textos de arriba tengan distinta altura.
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
      className={`relative row-span-4 grid min-w-0 snap-start grid-rows-subgrid rounded-2xl border bg-panel p-5 xl:p-6 ${
        p.featured
          ? 'border-accent/50 bg-panel-2 hover:border-accent'
          : p.tag
            ? 'border-dashed border-fg/25 hover:border-brand/60 hover:bg-panel-2'
            : 'border-line hover:border-brand/60 hover:bg-panel-2'
      }`}
    >
      {p.featured && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-accent" />}

      {/* 1 · cabecera */}
      <div className="pb-5">
        <div className="flex h-6 items-center">
          {p.featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-on-accent">
              <StarIcon className="h-3 w-3" />
              {p.badge}
            </span>
          )}
          {p.tag && <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">{p.tag}</span>}
        </div>
        <h3 className="mt-2 font-display text-4xl leading-none xl:text-5xl">{p.name}</h3>
        <p className="mt-2 text-sm text-muted">{p.tagline}</p>
        {p.lead && <p className="mt-2 text-sm font-semibold text-fg">{p.lead}</p>}
      </div>

      {/* 2 · precio */}
      <div className="border-t border-line pt-5">
        <BillingPrice
          flush
          amount={amount}
          decimals={option ? 0 : 2}
          was={was}
          period={p.period}
          className="text-5xl sm:text-6xl lg:text-5xl 2xl:text-6xl"
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
          <p className="mt-3 inline-flex rounded-full border border-accent/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-ink">
            {p.badge}
          </p>
        )}
        {p.options && (
          <>
            <WeeksPicker options={p.options} value={weeks} onChange={setWeeks} />
            {option.events && <p className="mt-2 text-xs text-muted">{option.events}</p>}
          </>
        )}
      </div>

      {/* 3 · prestaciones */}
      <ul className="mt-5 space-y-3 border-t border-line pt-5">
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

      {/* 4 · botón (abajo del todo, alineado con los demás) */}
      <div className="flex flex-col justify-end pt-6">
        {p.extra && <p className="mb-4 text-xs leading-relaxed text-muted">{p.extra}</p>}
        {p.note && (
          <p className="mb-4 text-sm leading-relaxed text-muted">
            {p.note}{' '}
            <Link to={`/contacto?plan=${p.id}`} className="font-semibold text-brand hover:text-accent-ink">
              Hablar con Jaime →
            </Link>
          </p>
        )}
        <Button to={href} variant={p.featured ? 'primary' : 'secondary'} className="w-full !px-3">
          {p.cta} <ArrowIcon className="h-4 w-4 shrink-0" />
        </Button>
      </div>
    </StaggerItem>
  )
}

// Fila de precios (móvil y tablet): los 4 precios uno al lado del otro, siempre visibles a la vez; debajo, las tarjetas.
function PriceStrip({ yearly }) {
  return (
    <div className="mb-5 grid grid-cols-4 divide-x divide-line rounded-2xl border border-line bg-panel py-4 lg:hidden">
      {PRICING.map((p) => {
        const peak = !!p.options
        const base = peak ? Math.min(...p.options.map((o) => num(o.price))) : p.amount
        const annual = yearly && !peak
        return (
          <div key={p.id} className={`min-w-0 px-1 text-center ${p.featured ? 'bg-accent/10' : ''}`}>
            <p className="font-display text-base font-semibold leading-none sm:text-xl">{p.name}</p>
            <div className="mt-2 text-fg">
              {peak && <span className="block text-[10px] leading-none text-muted">desde</span>}
              <BillingPrice
                center
                amount={annual ? yearlyMonthly(base) : base}
                decimals={peak ? 0 : 2}
                period={p.period}
                periodClass="hidden"
                className="text-base sm:text-2xl"
              />
            </div>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">{peak ? '/pack' : '/mes'}</p>
          </div>
        )
      })}
    </div>
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
      <PriceStrip yearly={yearly} />
      {/* Los 4 planes siempre en la misma fila: en pantallas anchas, 4 columnas; en móvil y tablet, una fila que se
          desliza de lado (con imán), para que los precios se comparen uno al lado del otro */}
      <div className="-mx-5 snap-x snap-mandatory overflow-x-auto px-5 pb-4 [scrollbar-width:none] lg:mx-0 lg:snap-none lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
        <Stagger className="grid grid-flow-col auto-cols-[80%] grid-rows-[auto_auto_1fr_auto] gap-x-4 sm:auto-cols-[46%] lg:auto-cols-fr lg:gap-x-4 xl:gap-x-5">
          {PRICING.map((p) => (
            <PlanCard key={p.id} p={p} yearly={yearly} />
          ))}
        </Stagger>
      </div>
      <p className="mt-2 text-center text-xs text-muted lg:hidden">Desliza para ver todos los planes →</p>
        </>
      )}
      {/* Descuentos: una sola franja (sin tarjetas), justo debajo de los planes */}
      <div id="descuentos" className="mt-16 grid gap-8 border-y border-line py-10 md:mt-20 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line">
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
