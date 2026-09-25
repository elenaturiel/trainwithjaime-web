import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PRICING } from '../data/pricing.js'
import { Stagger, StaggerItem } from './Reveal.jsx'
import Button from './Button.jsx'
import { ArrowIcon, CheckIcon, StarIcon } from './Icons.jsx'

function Price({ value, period }) {
  return (
    <p className="mt-6 flex items-baseline gap-1.5">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="font-display text-6xl leading-none md:text-7xl"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">{period}</span>
    </p>
  )
}

// Selector 8 / 10 / 12 semanas del plan Peak.
function WeeksPicker({ options, value, onChange }) {
  return (
    <div className="mt-6">
      <div role="radiogroup" aria-label="Duración del pack" className="grid grid-cols-3 gap-2">
        {options.map((o) => {
          const active = o.weeks === value
          return (
            <button
              key={o.weeks}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.weeks)}
              className={`rounded-lg border py-2.5 text-sm font-bold uppercase tracking-wider transition-colors duration-150 ${
                active ? 'border-fg bg-panel-2 text-fg' : 'border-line text-muted hover:border-muted-2 hover:text-fg-2'
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

function PlanCard({ p }) {
  const [weeks, setWeeks] = useState(p.defaultWeeks)
  const option = p.options?.find((o) => o.weeks === weeks)
  const price = option ? option.price : p.price
  const href = option ? `/contacto?plan=${p.id}&semanas=${weeks}` : `/contacto?plan=${p.id}`

  return (
    <StaggerItem
      hover
      className={`relative flex flex-col rounded-2xl border bg-panel p-7 md:p-8 ${
        p.featured
          ? 'border-accent/40 bg-panel-2 hover:border-accent md:-my-4 md:py-12'
          : 'border-line hover:border-brand/60 hover:bg-panel-2'
      }`}
    >
      {p.featured && (
        <>
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-accent" />
          <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
            <StarIcon className="h-3 w-3" />
            {p.badge}
          </span>
        </>
      )}
      <h3 className="font-display text-5xl uppercase leading-none">{p.name}</h3>
      <p className="mt-2 text-sm text-muted">{p.tagline}</p>

      {p.options && (
        <>
          <WeeksPicker options={p.options} value={weeks} onChange={setWeeks} />
          {option.events && <p className="mt-3 text-sm text-muted">{option.events}</p>}
        </>
      )}

      <Price value={price} period={p.period} />

      <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-6">
        {p.features.map((f) => (
          <li key={f} className="flex gap-3 text-sm text-fg-2">
            <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? 'text-accent' : 'text-brand'}`} />
            {f}
          </li>
        ))}
      </ul>
      <Button to={href} variant={p.featured ? 'primary' : 'secondary'} className="mt-8 w-full">
        {p.cta} <ArrowIcon className="h-4 w-4" />
      </Button>
    </StaggerItem>
  )
}

export default function PricingCards() {
  return (
    <Stagger className="grid gap-5 md:grid-cols-3 md:items-stretch">
      {PRICING.map((p) => (
        <PlanCard key={p.id} p={p} />
      ))}
    </Stagger>
  )
}
