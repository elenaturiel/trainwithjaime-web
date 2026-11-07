import { StarIcon } from './Icons.jsx'

// Estrellas de solo lectura (valor de 0 a 5).
export function Stars({ value, className = 'h-4 w-4' }) {
  return (
    <span role="img" aria-label={`${value} de 5 estrellas`} className="inline-flex gap-0.5 text-accent">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} className={`${className} ${n <= Math.round(value) ? '' : 'opacity-25'}`} />
      ))}
    </span>
  )
}

// Selector de valoración: 5 botones (radio) accesibles con teclado.
export function StarPicker({ value, onChange, name = 'estrellas' }) {
  return (
    <div role="radiogroup" aria-label="Valoración" className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
            className="peer sr-only"
          />
          <span className="sr-only">{n} {n === 1 ? 'estrella' : 'estrellas'}</span>
          <StarIcon
            className={`h-9 w-9 rounded transition-transform duration-150 hover:scale-110 peer-focus-visible:ring-2 peer-focus-visible:ring-brand ${
              n <= value ? 'text-accent' : 'text-fg/20'
            }`}
          />
        </label>
      ))}
    </div>
  )
}
