// Cinta de texto que se desplaza sin fin (la lista se repite dos veces y se mueve la mitad, sin saltos).
// Se pausa al pasar el ratón y no se mueve con "reducir movimiento" (queda la lista estática y centrada).
export default function Marquee({ items, className = '' }) {
  const row = (
    <ul className="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-6 whitespace-nowrap md:gap-10">
          <span className="font-display text-2xl font-bold uppercase leading-none tracking-[-0.01em] md:text-4xl">{t}</span>
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent md:h-2.5 md:w-2.5" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="marquee flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
        {row}
        <div className="flex motion-reduce:hidden" aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  )
}
