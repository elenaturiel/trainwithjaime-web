import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

// ⚠️ SUSTITUIR VÍDEO DEL HERO: /public/hero.mp4 (H.264, 1080p, < 8 MB, sin audio) y su fotograma /public/hero-poster.jpg.
const HERO_VIDEO = '/hero.mp4'
const HERO_POSTER = '/hero-poster.jpg'

// Vídeo decorativo de fondo a pantalla completa (aria-hidden). Solo carga metadatos y poster hasta que se reproduce;
// se reproduce solo mientras se ve (no gasta batería fuera de pantalla) y no arranca con "reducir movimiento".
// Va dentro de una sección `relative isolate`; el velo degradado lo pone cada hero encima.
export default function HeroVideo({ className = 'opacity-55' }) {
  const ref = useRef(null)
  const reduced = !!useReducedMotion()

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (reduced) return v.pause()
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 })
    io.observe(v)
    return () => io.disconnect()
  }, [reduced])

  return (
    <video
      ref={ref}
      className={`absolute inset-0 -z-20 size-full object-cover ${className}`}
      src={HERO_VIDEO}
      poster={HERO_POSTER}
      autoPlay={!reduced}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
