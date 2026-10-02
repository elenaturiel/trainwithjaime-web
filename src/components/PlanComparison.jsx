import { Stagger } from './Reveal.jsx'
import Button from './Button.jsx'
import { ArrowIcon, CheckIcon, StarIcon } from './Icons.jsx'
import { COMPARE_ROWS, MVP_PRICE, MVP_PRICE_OLD, PRICING } from '../data/pricing.js'

const POPULAR = 'allin'

// Texto que se muestra bajo el nombre de cada plan en la cabecera de la tabla.
const HEAD_PRICE = {
  rookie: { price: '24,90€', period: '/mes' },
  allin: { price: '44,90€', period: '/mes' },
  mvp: { price: MVP_PRICE, period: '/mes', old: MVP_PRICE_OLD },
  peak: { price: '149€', period: '/pack', from: true },
}

function Cell({ value }) {
  if (value === true)
    return (
      <>
        <CheckIcon className="mx-auto h-5 w-5 text-brand" aria-hidden="true" />
        <span className="sr-only">Incluido</span>
      </>
    )
  if (value === false || value == null)
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

// Tabla comparativa de los 4 planes. All In va enmarcado como "Más popular".
export default function PlanComparison() {
  const cols = PRICING
  const last = COMPARE_ROWS.length - 1
  const pop = (id) => id === POPULAR

  return (
    <div>
      <div
        className="-mx-5 overflow-x-auto px-5 pb-2 pt-6 md:mx-0 md:px-0"
        // región con scroll horizontal: accesible con teclado
        role="region"
        aria-label="Tabla comparativa de planes"
        tabIndex={0}
      >
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
          <caption className="sr-only">Comparativa de los planes Rookie, All In, MVP y Peak</caption>
          <thead>
            <tr>
              <td className="w-[28%] border-b border-line" />
              {cols.map((p) => {
                const h = HEAD_PRICE[p.id]
                return (
                  <th
                    key={p.id}
                    scope="col"
                    className={`relative border-b border-line px-3 pb-5 pt-6 align-top font-normal ${
                      pop(p.id) ? 'rounded-t-2xl border-x-2 border-t-2 border-x-accent border-t-accent bg-panel-2' : ''
                    }`}
                  >
                    {pop(p.id) && (
                      <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-on-accent">
                        <StarIcon className="h-3 w-3" />
                        Más popular
                      </span>
                    )}
                    <span className="block text-center font-display text-3xl leading-none text-fg">{p.name}</span>
                    <span className="mt-3 block text-center text-fg">
                      {h.from && <span className="mr-1 text-xs text-muted">desde</span>}
                      <span className="font-display text-2xl leading-none">{h.price}</span>
                      <span className="ml-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                        {h.period}
                      </span>
                    </span>
                    {h.old && (
                      <span className="mt-1 block text-center text-sm text-muted line-through">
                        <span className="sr-only">Precio anterior: </span>
                        {h.old}
                      </span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row, i) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-b border-line bg-ink py-3.5 pr-3 text-sm font-semibold text-fg"
                >
                  {row.label}
                </th>
                {cols.map((p) => (
                  <td
                    key={p.id}
                    className={`border-b border-line px-3 py-3.5 text-center ${
                      pop(p.id)
                        ? `border-x-2 border-x-accent bg-panel-2 ${i === last ? 'border-b-0' : ''}`
                        : ''
                    }`}
                  >
                    <Cell value={row.values[p.id]} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="bg-ink pt-6" />
              {cols.map((p) => (
                <td
                  key={p.id}
                  className={`px-3 pb-6 pt-6 ${
                    pop(p.id) ? 'rounded-b-2xl border-x-2 border-b-2 border-x-accent border-b-accent bg-panel-2' : ''
                  }`}
                >
                  <Button
                    to={`/contacto?plan=${p.id}${p.id === 'peak' ? '&semanas=10' : ''}`}
                    variant={pop(p.id) ? 'primary' : 'secondary'}
                    className="w-full !px-3"
                  >
                    {p.cta} <ArrowIcon className="h-4 w-4 shrink-0" />
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted md:hidden">Desliza la tabla para ver todos los planes →</p>
    </div>
  )
}
