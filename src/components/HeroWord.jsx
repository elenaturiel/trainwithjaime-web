import { WRAP } from './HomeSections.jsx'

// Palabra gigante para los héroes de /servicios y /precios: alineada a la izquierda, a todo el ancho y con degradado azul
// (del azul royal al más claro). Va justo debajo del contenido del héroe y se mete un poco por detrás de los botones, así se
// lee entera y el contenido se lee encima. Es decorativa (aria-hidden; el eyebrow ya dice lo mismo para lectores de pantalla).
// El azul se elige para que el texto blanco encima conserve ≥ 4.5:1 y la palabra se lea sobre el navy (≥ 3:1).
// `size` es el font-size (clamp) que hace que la palabra ocupe el ancho de la página según su longitud.
export default function HeroWord({ children, size }) {
  return (
    <div aria-hidden="true" className={`${WRAP} pointer-events-none relative z-0 select-none`}>
      <span
        className={`-mt-[0.08em] block bg-gradient-to-b from-[#3363E0] to-[#1646C2] bg-clip-text font-variable font-extrabold uppercase leading-[.85] tracking-[-0.04em] text-transparent ${size}`}
      >
        {children}
      </span>
    </div>
  )
}
