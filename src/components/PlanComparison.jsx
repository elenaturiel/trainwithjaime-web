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
        <span className="mx-auto flex h-5 w-5 items-center md:h-6 md:w-6 justify-center rounded-full bg-brand/15 text-brand">
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
      <div className="pt-8">
        <table className="w-full table-fixed border-separate border-spacing-0 text-left">
          <caption className="sr-only">Comparativa de los planes Rookie, All In, MVP y Peak</caption>
          <thead>
            <tr>
              <td className="w-[34%] border-b border-line md:w-[30%]" />
              {PRICING.map((p) => {
                const h = HEAD_PRICE[p.id]
                return (
                  <th
                    key={p.id}
                    scope="col"
                    className={`border-b border-line px-1 pb-4 pt-6 align-top font-normal md:px-3 ${
                      pop(p.id) ? `${popCell} rounded-t-2xl border-t-2 border-t-accent` : ''
                    }`}
                  >
                    <span className="relative block text-center">
                      {pop(p.id) && (
                        <span className="absolute -top-[38px] left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-on-accent">
                          <StarIcon className="h-3 w-3" />
                          Más popular
                        </span>
                      )}
                      <span className="block font-display text-lg leading-none text-fg md:text-3xl">{p.name}</span>
                      <span className="mt-2 block text-fg">
                        {h.from && <span className="mr-1 text-[10px] text-muted md:text-xs">desde</span>}
                        <span className="font-display text-sm leading-none md:text-2xl">{h.price}</span>
                        <span className="ml-1 hidden text-[11px] font-semibold uppercase tracking-[0.15em] text-muted md:inline">
                          {h.period}
                        </span>
                        {h.old && (
                          <span className="ml-2 hidden text-sm text-muted line-through md:inline">
                            <span className="sr-only">Precio anterior: </span>
                            {h.old}
                          </span>
                        )}
                      </span>
                    </span>
                    <Button
                      to={hrefFor(p.id)}
                      variant={pop(p.id) ? 'primary' : 'secondary'}
                      className="mt-4 w-full !px-2 !py-2.5 text-xs max-md:hidden"
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
                    className="border-b border-line pb-3 pt-9 text-left font-normal"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(g.title)}
                      aria-expanded={open}
                      className="flex items-start gap-2 text-left font-display text-xl leading-none text-fg md:text-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                    >
                      <ChevronIcon open={open} />
                      {g.title}
                    </button>
                  </th>
                  {PRICING.map((p) => (
                    <td
                      key={p.id}
                      className={`border-b border-line ${pop(p.id) ? popCell : ''}`}
                    />
                  ))}
                </tr>
                {open &&
                  g.rows.map((row, ri) => (
                    <tr key={row.label}>
                      <th scope="row" className="border-b border-line py-3 pr-2 text-left font-normal md:py-4 md:pr-3">
                        <span className="block text-xs font-semibold leading-snug text-fg md:text-sm">{row.label}</span>
                        {row.note && <span className="mt-0.5 hidden text-xs leading-relaxed text-muted md:block">{row.note}</span>}
                      </th>
                      {PRICING.map((p) => (
                        <td
                          key={p.id}
                          className={`border-b border-line px-1 py-3 text-center md:px-3 md:py-4 ${
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
      <div className="mt-8 grid grid-cols-2 gap-3 md:hidden">
        {PRICING.map((p) => (
          <Button key={p.id} to={hrefFor(p.id)} variant={pop(p.id) ? 'primary' : 'secondary'} className="!px-3 text-xs">
            {p.cta}
          </Button>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        Todos los planes empiezan con una primera asesoría gratis con Jaime.{' '}
        <Link to="/contacto" className="font-semibold text-brand underline-offset-4 hover:underline">
          Reservar mi asesoría <ArrowIcon className="inline h-3.5 w-3.5" />
        </Link>
      </p>
    </div>
  )
}
