import { PRICING } from '../data/pricing.js'
import { Stagger, StaggerItem } from './Reveal.jsx'
import Button from './Button.jsx'
import { CheckIcon } from './Icons.jsx'

export default function PricingCards() {
  return (
    <Stagger className="grid gap-5 md:grid-cols-3 md:items-stretch">
      {PRICING.map((p) => (
        <StaggerItem
          key={p.id}
          className={`relative flex flex-col rounded-2xl border bg-panel p-7 md:p-8 ${
            p.featured ? 'border-accent/40 bg-panel-2 md:-my-4 md:py-12' : 'border-line'
          }`}
        >
          {p.featured && (
            <>
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-accent" />
              <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
                {p.badge}
              </span>
            </>
          )}
          <h3 className="font-display text-4xl uppercase tracking-wide">{p.name}</h3>
          <p className="mt-6 flex items-baseline gap-1">
            <span className="font-display text-6xl leading-none md:text-7xl">{p.price}</span>
            {p.period && <span className="text-sm text-muted">{p.period}</span>}
          </p>
          <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-6">
            {p.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm text-fg-2">
                <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? 'text-accent' : 'text-brand'}`} />
                {f}
              </li>
            ))}
          </ul>
          <Button
            to={`/contacto?plan=${p.id}`}
            variant={p.featured ? 'primary' : 'secondary'}
            className="mt-8 w-full"
          >
            Elegir {p.name}
          </Button>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
