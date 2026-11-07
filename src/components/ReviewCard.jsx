import { Stars } from './Stars.jsx'
import { formatDate } from '../lib/resenas.js'

// Tarjeta de una reseña publicada (las escritas a mano en config.js no llevan estrellas ni fecha).
export default function ReviewCard({ r }) {
  const meta = [r.detalle, r.fecha && formatDate(r.fecha)].filter(Boolean).join(' · ')
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-panel p-6 md:p-7">
      {r.estrellas > 0 && <Stars value={r.estrellas} className="h-5 w-5" />}
      <blockquote className="mt-3 flex-1 whitespace-pre-line break-words text-base leading-relaxed text-fg">
        {r.texto}
      </blockquote>
      <figcaption className="mt-5 border-t border-line pt-4">
        <span className="block font-semibold text-fg">{r.nombre}</span>
        {meta && <span className="text-sm text-muted">{meta}</span>}
      </figcaption>
    </figure>
  )
}

// Tarjeta de un cambio: la foto entera (3:4) con su mini texto debajo.
export function ChangeCard({ c }) {
  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel">
      <img
        src={c.foto}
        alt={c.titulo}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="aspect-[3/4] w-full bg-panel-2 object-cover"
      />
      <figcaption className="flex-1 p-6">
        <span className="block font-display text-2xl font-semibold leading-tight text-fg">{c.titulo}</span>
        {c.texto && <span className="mt-2 block break-words text-base leading-relaxed text-fg-2">{c.texto}</span>}
        {c.nombre && <span className="mt-4 block text-sm font-semibold text-muted">{c.nombre}</span>}
      </figcaption>
    </figure>
  )
}
