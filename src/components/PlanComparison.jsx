import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button.jsx'
import { ArrowIcon, CheckIcon, StarIcon } from './Icons.jsx'
import { COMPARE_GROUPS, MVP_PRICE, MVP_PRICE_OLD, PRICING } from '../data/pricing.js'

const POPULAR = 'allin'

const HEAD_PRICE = {
  rookie: { price: '24,90€', period: '/mes' },
  allin: { price: '44,90€', period: '/mes' },
  mvp: { price: MVP_PRICE, period: '/mes', old: MVP_PRICE_OLD },
  peak: { price: '149€', period: '/pack', from: true },
}

const hrefFor = (id) => `/contacto?plan=${id}${id === 'peak' ? '&semanas=10' : ''}`

function Cell({ value }) {
  if (value === true)
    return (
      <>
        <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-brand">
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
  return <span className="text-sm text-fg-2">{value}</span>
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
      className={`h-4 w-4 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

// Comparativa de planes estilo WHOOP: cabecera fija con precio y botón, bloques desplegables y
// la columna del plan más popular enmarcada.
export default function PlanComparison() {
  const [closed, setClosed] = useState({})
  const toggle = (t) => setClosed((c) => ({ ...c, [t]: !c[t] }))
  const pop = (id) => id === POPULAR
  const lastGroup = COMPARE_GROUPS.length - 1

  // Columna popular: tinte y marco continuos a lo largo de toda la tabla
  const popCell = 'border-x-2 border-x-accent bg-panel-2'

  return (
    <div>
      <div
        className="-mx-5 overflow-x-auto px-5 pt-6 md:mx-0 md:overflow-visible md:px-0"
        role="region"
        aria-label="Tabla comparativa de planes"
        tabIndex={0}
      >
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left md:min-w-0">
          <caption className="sr-only">Comparativa de los planes Rookie, All In, MVP y Peak</caption>
          <thead>
            <tr>
              <td className="w-[30%] border-b border-line bg-ink md:sticky md:top-[72px] md:z-20" />
              {PRICING.map((p) => {
                const h = HEAD_PRICE[p.id]
                return (
                  <th
                    key={p.id}
                    scope="col"
                    className={`border-b border-line px-3 pb-4 pt-6 align-top font-normal md:sticky md:top-[72px] md:z-20 ${
                      pop(p.id) ? `${popCell} rounded-t-2xl border-t-2 border-t-accent` : 'bg-ink'
                    }`}
                  >
                    <span className="relative block text-center">
                      {pop(p.id) && (
                        <span className="absolute -top-[38px] left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-on-accent">
                          <StarIcon className="h-3 w-3" />
                          Más popular
                        </span>
                      )}
                      <span className="block font-display text-3xl leading-none text-fg">{p.name}</span>
                      <span className="mt-2 block text-fg">
                        {h.from && <span className="mr-1 text-xs text-muted">desde</span>}
                        <span className="font-display text-2xl leading-none">{h.price}</span>
                        <span className="ml-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                          {h.period}
                        </span>
                        {h.old && (
                          <span className="ml-2 text-sm text-muted line-through">
                            <span className="sr-only">Precio anterior: </span>
                            {h.old}
                          </span>
                        )}
                      </span>
                    </span>
                    <Button
                      to={hrefFor(p.id)}
                      variant={pop(p.id) ? 'primary' : 'secondary'}
                      className="mt-4 w-full !px-2 !py-2.5 text-xs"
                    >
                      {p.cta}
                    </Button>
                  </th>
                )
              })}
            </tr>
          </thead>

          {COMPARE_GROUPS.map((g, gi) => {
            const open = !closed[g.title]
            const isLast = gi === lastGroup
            return (
              <tbody key={g.title}>
                <tr>
                  <th
                    scope="colgroup"
                    className="border-b border-line bg-ink pb-3 pt-9 text-left font-normal"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(g.title)}
                      aria-expanded={open}
                      className="flex items-center gap-2 font-display text-2xl leading-none text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                    >
                      <ChevronIcon open={open} />
                      {g.title}
                    </button>
                  </th>
                  {PRICING.map((p) => (
                    <td
                      key={p.id}
                      className={`border-b border-line ${pop(p.id) ? popCell : 'bg-ink'}`}
                    />
                  ))}
                </tr>
                {open &&
                  g.rows.map((row, ri) => (
                    <tr key={row.label}>
                      <th scope="row" className="border-b border-line bg-ink py-4 pr-3 text-left font-normal">
                        <span className="block text-sm font-semibold text-fg">{row.label}</span>
                        {row.note && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{row.note}</span>}
                      </th>
                      {PRICING.map((p) => (
                        <td
                          key={p.id}
                          className={`border-b border-line px-3 py-4 text-center ${
                            pop(p.id)
                              ? `${popCell} ${isLast && ri === g.rows.length - 1 ? 'rounded-b-2xl border-b-2 border-b-accent' : ''}`
                              : ''
                          }`}
                        >
                          <Cell value={row.values[p.id]} />
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            )
          })}
        </table>
      </div>
      <p className="mt-4 text-xs text-muted md:hidden">Desliza la tabla para ver todos los planes →</p>
      <p className="mt-8 text-center text-sm text-muted">
        Todos los planes empiezan con una primera asesoría gratis con Jaime.{' '}
        <Link to="/contacto" className="font-semibold text-brand underline-offset-4 hover:underline">
          Reservar mi asesoría <ArrowIcon className="inline h-3.5 w-3.5" />
        </Link>
      </p>
    </div>
  )
}
