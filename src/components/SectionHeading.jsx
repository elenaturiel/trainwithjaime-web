// Titular de sección. Sin etiqueta ni número encima: el titular se sostiene solo.
export default function SectionHeading({ title, className = '' }) {
  return (
    <h2 className={`font-display text-4xl uppercase leading-[1.02] md:text-6xl lg:text-7xl ${className}`}>{title}</h2>
  )
}
