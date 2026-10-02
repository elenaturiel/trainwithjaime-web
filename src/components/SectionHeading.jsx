// Titular de sección. Sin etiqueta ni número encima: el titular se sostiene solo.
export default function SectionHeading({ title, className = '' }) {
  return <h2 className={`font-display text-5xl leading-[1.02] md:text-7xl ${className}`}>{title}</h2>
}
