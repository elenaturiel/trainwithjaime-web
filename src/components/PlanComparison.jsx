import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Button from './Button.jsx'
import { BillingPrice, BillingToggle, Counter } from './BillingToggle.jsx'
import { ArrowIcon, CheckIcon, StarIcon } from './Icons.jsx'
import { BILLING_OPTIONS, setBilling, useBilling } from '../lib/billing.js'
import { COMPARE_GROUPS, PRICING, YEARLY_DISCOUNT, num, yearlyMonthly } from '../data/pricing.js'

/* ══ Plan comparison ══════════════════════════════════════
   The comparison table, as a grid of rows (role="table") so that rows can open and close in height:
   - Billing switch (shared with the cards above): the prices in the header roll to the new amount.
   - "Solo diferencias": hides the rows that read the same in every plan, with a counter of what is shown.
   - Choosing a plan: tints its column and a rail glides between the headers; a bar below then offers to continue.
   - The "Más popular" column stays framed from top to bottom.
   Based on a two-plan comparison component, rewritten for four plans, this project's tokens and framer-motion. */

const POPULAR = 'allin'
const SPRING = { type: 'spring', visualDuration: 0.34, bounce: 0 }
const EASE_ENTER = [0.16, 0.84, 0.3, 1]
const COLS = 'grid-cols-[34%_repeat(4,minmax(0,1fr))] md:grid-cols-[30%_repeat(4,minmax(0,1fr))]'
const money = (v) => `${v.toFixed(2).replace('.', ',')}€`

// Cada plan: precio mensual base y si admite el pago anual (Peak es un pack cerrado)
const BASE = Object.fromEntries(
  PRICING.map((p) => [
    p.id,
    p.options
      ? { amount: Math.min(...p.options.map((o) => num(o.price))), decimals: 0, from: true, period: '/pack', annual: false }
      : { amount: p.amount, decimals: 2, was: p.oldAmount, period: '/mes', annual: true },
  ]),
)

const hrefFor = (id, yearly) =>
  `/contacto?plan=${id}${id === 'peak' ? '&semanas=10' : ''}${yearly && BASE[id].annual ? '&periodo=anual' : ''}`

function Value({ value }) {
  if (value === true)
    return (
      <>
        <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-brand/15 text-brand md:h-6 md:w-6">
          <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="sr-only">Incluido</span>
      </>
    )
  if (!value)
    return (
      <>
        <span aria-hidden="true" className="text-muted-2">
          —
        </span>
        <span className="sr-only">No incluido</span>
      </>
    )
  return <span className="block text-[11px] leading-tight text-fg-2 md:text-sm">{value}</span>
}

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`mt-1 h-4 w-4 shrink-0 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

// Switch accesible (role="switch") con la pastilla que se desliza
function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-3 text-sm font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-brand' : 'bg-fg/20'}`}
      >
        <motion.span
          aria-hidden="true"
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow"
          initial={false}
          animate={{ x: checked ? 20 : 0 }}
          transition={SPRING}
        />
      </span>
      {label}
    </button>
  )
}

export default function PlanComparison() {
  const reduced = !!useReducedMotion()
  const billing = useBilling()
  const yearly = billing === 'yearly'
  const [closed, setClosed] = useState({})
  const [diffOnly, setDiffOnly] = useState(false)
  const [selected, setSelected] = useState(null)
  const pop = (id) => id === POPULAR
  const toggleGroup = (t) => setClosed((c) => ({ ...c, [t]: !c[t] }))

  // Filas visibles: las de los bloques abiertos y, con "solo diferencias", las que no son iguales en todos los planes
  const groups = useMemo(
    () =>
      COMPARE_GROUPS.map((g) => ({
        ...g,
        rows: g.rows.map((r) => ({ ...r, shared: new Set(PRICING.map((p) => String(r.values[p.id]))).size === 1 })),
      })).map((g) => ({ ...g, shown: g.rows.filter((r) => !diffOnly || !r.shared) })),
    [diffOnly],
  )
  const total = COMPARE_GROUPS.reduce((n, g) => n + g.rows.length, 0)
  const visible = groups.reduce((n, g) => n + g.shown.length, 0)
  const visibleGroups = groups.filter((g) => g.shown.length > 0)
  // la última fila que se ve (para redondear el marco de la columna popular): la del último bloque, o su cabecera si está cerrado
  const lastGroup = visibleGroups[visibleGroups.length - 1]
  const lastRowKey = lastGroup
    ? closed[lastGroup.title]
      ? `${lastGroup.title}/head`
      : `${lastGroup.title}/${lastGroup.shown[lastGroup.shown.length - 1].label}`
    : null

  const tint = (id) => (selected === id ? 'bg-brand/10' : '')
  // columna popular: marco continuo de arriba abajo
  const frame = 'border-x-2 border-x-accent bg-panel-2'
  const cell = (id, key, extra = '') =>
    `border-b border-line ${pop(id) ? `${frame} ${key === lastRowKey ? 'rounded-b-2xl border-b-2 border-b-accent' : ''}` : tint(id)} ${extra}`

  const rowMotion = {
    initial: reduced ? false : { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: reduced ? undefined : { height: 0, opacity: 0, transition: { height: SPRING, opacity: { duration: 0.16 } } },
    transition: reduced ? { duration: 0 } : { height: SPRING, opacity: { duration: 0.28, ease: EASE_ENTER, delay: 0.04 } },
  }

  const chosen = PRICING.find((p) => p.id === selected)
  const chosenAmount = chosen && (yearly && BASE[chosen.id].annual ? yearlyMonthly(BASE[chosen.id].amount) : BASE[chosen.id].amount)

  return (
    <div>
      {/* billing + filter */}
      <div className="flex flex-col gap-5 pt-2 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-start gap-2">
          <BillingToggle value={billing} onValueChange={setBilling} options={BILLING_OPTIONS} />
          <p className="text-xs text-muted">
            {yearly
              ? `Pago anual: ${Math.round(YEARLY_DISCOUNT * 100)}% menos en Rookie, All In y MVP. Peak es un pack cerrado.`
              : 'Pago mes a mes.'}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <Switch checked={diffOnly} onChange={setDiffOnly} label="Solo diferencias" />
          <p className="text-xs text-muted" aria-live="polite">
            <Counter value={visible} decimals={0} /> de {total} prestaciones
          </p>
        </div>
      </div>

      <div role="table" aria-label="Comparativa de los planes Rookie, All In, MVP y Peak" className="pt-12">
        {/* header: one button per plan (choose it) */}
        <div role="row" className={`grid ${COLS}`}>
          <div role="columnheader" className="border-b border-line" />
          {PRICING.map((p) => {
            const b = BASE[p.id]
            const annual = yearly && b.annual
            const on = selected === p.id
            return (
              <div
                key={p.id}
                role="columnheader"
                className={`relative border-b border-line ${
                  pop(p.id) ? `${frame} rounded-t-2xl border-t-2 border-t-accent` : tint(p.id)
                }`}
              >
                {pop(p.id) && (
                  <span className="absolute -top-[38px] left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-on-accent">
                    <StarIcon className="h-3 w-3" />
                    Más popular
                  </span>
                )}
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSelected((c) => (c === p.id ? null : p.id))}
                  className="flex w-full flex-col items-center px-1 pb-4 pt-6 text-center focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand md:px-3"
                >
                  <span className="font-display text-lg leading-none text-fg md:text-3xl">{p.name}</span>
                  <span className="mt-2 text-fg">
                    <BillingPrice
                      compact
                      amount={annual ? yearlyMonthly(b.amount) : b.amount}
                      decimals={b.decimals}
                      was={annual ? b.amount : b.was}
                      prefix={b.from ? 'desde' : undefined}
                      period={b.period}
                      periodClass="hidden md:inline"
                      wasClass="hidden md:inline"
                      className="text-sm md:text-2xl"
                    />
                  </span>
                  <span
                    className={`mt-3 hidden rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors duration-150 md:inline-block ${
                      on ? 'border-fg bg-fg text-ink' : 'border-fg/25 text-fg'
                    }`}
                  >
                    {on ? 'Elegido' : 'Elegir'}
                  </span>
                  <span className="sr-only">{on ? ' (elegido)' : ' (pulsa para elegir este plan)'}</span>
                </button>
                {on && (
                  <motion.span
                    layoutId="plan-rail"
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[-1px] h-1 rounded-full bg-brand"
                    transition={reduced ? { duration: 0 } : SPRING}
                  />
                )}
              </div>
            )
          })}
        </div>

        <div role="rowgroup">
          <AnimatePresence initial={false}>
            {visibleGroups.map((g) => {
              const open = !closed[g.title]
              return (
                <motion.div key={g.title} role="rowgroup" className="overflow-hidden" {...rowMotion}>
                  <div role="row" className={`grid ${COLS}`}>
                    <div role="rowheader" className="border-b border-line pb-3 pt-8 text-left">
                      <button
                        type="button"
                        onClick={() => toggleGroup(g.title)}
                        aria-expanded={open}
                        className="flex items-start gap-2 text-left font-display text-xl leading-none text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:text-2xl"
                      >
                        <ChevronIcon open={open} />
                        {g.title}
                      </button>
                    </div>
                    {PRICING.map((p) => (
                      <div key={p.id} role="cell" className={cell(p.id, `${g.title}/head`, 'pt-8')} />
                    ))}
                  </div>
                  <AnimatePresence initial={false}>
                    {open &&
                      g.shown.map((row) => (
                        <motion.div key={row.label} role="row" className="overflow-hidden" {...rowMotion}>
                          <div className={`grid ${COLS}`}>
                            <div role="rowheader" className="border-b border-line py-3 pr-2 text-left md:py-4 md:pr-3">
                              <span className="block text-xs font-semibold leading-snug text-fg md:text-sm">{row.label}</span>
                              {row.note && (
                                <span className="mt-0.5 hidden text-xs leading-relaxed text-muted md:block">{row.note}</span>
                              )}
                            </div>
                            {PRICING.map((p) => (
                              <div
                                key={p.id}
                                role="cell"
                                className={cell(p.id, `${g.title}/${row.label}`, 'flex items-center justify-center px-1 py-3 text-center md:px-3 md:py-4')}
                              >
                                <div>
                                  <Value value={row.values[p.id]} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {visible === 0 && <p className="mt-8 text-center text-sm text-muted">No hay diferencias que mostrar en los bloques abiertos.</p>}

      {/* what was chosen, and the way on */}
      <div className="mt-10 min-h-[4.5rem]" role="status" aria-live="polite">
        <AnimatePresence initial={false} mode="wait">
          {chosen ? (
            <motion.div
              key={`${chosen.id}-${yearly}`}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand/40 bg-brand/5 p-5 sm:flex-row"
            >
              <p className="text-center text-sm text-fg sm:text-left">
                Has elegido <strong>{chosen.name}</strong>
                {yearly && BASE[chosen.id].annual ? ' (pago anual)' : ''} ·{' '}
                {BASE[chosen.id].from ? 'desde ' : ''}
                {BASE[chosen.id].from ? `${chosenAmount}€` : money(chosenAmount)}
                {BASE[chosen.id].period}
              </p>
              <Button to={hrefFor(chosen.id, yearly)} variant={pop(chosen.id) ? 'primary' : 'secondary'} className="shrink-0">
                {chosen.cta} <ArrowIcon className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.p key="hint" initial={false} className="text-center text-sm text-muted">
              Pulsa un plan para elegirlo y seguir con Jaime.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Todos los planes empiezan con una primera asesoría gratis con Jaime.{' '}
        <Link to="/contacto" className="font-semibold text-brand underline-offset-4 hover:underline">
          Reservar mi asesoría <ArrowIcon className="inline h-3.5 w-3.5" />
        </Link>
      </p>
    </div>
  )
}
