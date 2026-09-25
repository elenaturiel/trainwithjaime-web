import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowIcon } from './Icons.jsx'

const pad = (n) => String(n).padStart(2, '0')

// Carrusel de fotos: una foto grande a la vez (con la siguiente asomando), flechas, contador y puntos.
// Usa scroll nativo con "snap": se puede deslizar con el dedo, con el trackpad o con las flechas del teclado.
export default function Carousel({ items, label = 'Galería' }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  const slides = () => Array.from(trackRef.current?.children || [])

  const goTo = useCallback((i) => {
    const track = trackRef.current
    const list = Array.from(track?.children || [])
    if (!list.length) return
    const target = Math.max(0, Math.min(list.length - 1, i))
    track.scrollTo({ left: list[target].offsetLeft, behavior: 'smooth' })
  }, [])

  // Averigua qué foto está delante según la posición del scroll.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const list = slides()
        const step = list.length > 1 ? list[1].offsetLeft - list[0].offsetLeft : 1
        // Al final del todo, la última foto puede no llegar al borde: la damos por activa.
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
        setIndex(atEnd ? list.length - 1 : Math.round(track.scrollLeft / step))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') (e.preventDefault(), goTo(index + 1))
    if (e.key === 'ArrowLeft') (e.preventDefault(), goTo(index - 1))
  }

  const arrow =
    'flex h-12 w-12 items-center justify-center rounded-full border border-fg/20 text-fg transition-[border-color,background-color,transform] duration-150 hover:border-fg hover:bg-fg hover:text-ink disabled:pointer-events-none disabled:opacity-30 motion-safe:hover:scale-105'

  return (
    <div aria-roledescription="carrusel" aria-label={label}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <p className="font-display text-4xl leading-none tabular-nums md:text-5xl">
          {pad(index + 1)}
          <span className="text-muted-2"> / {pad(items.length)}</span>
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Foto anterior"
            className={arrow}
          >
            <ArrowIcon className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === items.length - 1}
            aria-label="Foto siguiente"
            className={arrow}
          >
            <ArrowIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth rounded-2xl [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it, i) => (
          <figure
            key={it.src}
            role="group"
            aria-roledescription="foto"
            aria-label={`${i + 1} de ${items.length}`}
            className="group relative shrink-0 basis-[86%] snap-start overflow-hidden rounded-2xl bg-panel md:basis-[72%]"
          >
            <img
              src={it.src}
              alt={it.alt}
              loading={i < 2 ? 'eager' : 'lazy'}
              draggable={false}
              className={`aspect-[4/5] w-full object-cover transition-[transform,opacity] duration-500 sm:aspect-[16/10] motion-safe:group-hover:scale-[1.03] ${
                i === index ? 'opacity-100' : 'opacity-60'
              }`}
            />
          </figure>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Elegir foto">
        {items.map((it, i) => (
          <button
            key={it.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Ir a la foto ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-fg' : 'w-2 bg-fg/25 hover:bg-fg/50'}`}
          />
        ))}
      </div>
    </div>
  )
}
