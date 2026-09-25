// Encabezado de sección numerada estilo "01 — LA DIFERENCIA".
export default function SectionHeading({ number, eyebrow, title, className = '' }) {
  return (
    <div className={className}>
      {(number || eyebrow) && (
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          {number && <span className="text-brand">{number}</span>}
          {number && eyebrow && <span className="h-px w-8 bg-line" />}
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-5xl uppercase leading-[0.9] md:text-7xl">{title}</h2>
    </div>
  )
}
