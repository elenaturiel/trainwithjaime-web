import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

// Efecto "apilado": cada apartado se queda fijo (sticky) cuando su parte de abajo
// llega al borde inferior de la pantalla, y el siguiente apartado sube por encima
// tapándolo, mientras el de debajo se encoge un poco y se oscurece.
//
// Todos los <StackSection> de una página tienen que ser hermanos directos dentro
// del mismo contenedor (<main>), si no el sticky no funciona.
export default function StackSection({ children, first = false, last = false, bg = 'bg-ink' }) {
  const ref = useRef(null)
  const endRef = useRef(null)
  const reduce = useReducedMotion()
  const [layout, setLayout] = useState({ top: 0, origin: '50% 50%' })

  // Sticky con top negativo para apartados más altos que la pantalla:
  // se "enganchan" justo cuando su borde inferior toca el borde inferior del viewport.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const vh = window.innerHeight
      const h = el.offsetHeight
      const top = Math.min(0, vh - h)
      // El encogido se centra en la parte que se ve, no en el centro del bloque entero.
      const origin = h > vh ? `50% ${h - vh / 2}px` : '50% 50%'
      setLayout((prev) => (prev.top === top && prev.origin === origin ? prev : { top, origin }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // 0 → el apartado empieza a quedar tapado · 1 → el siguiente ya ha llegado arriba del todo.
  const { scrollYProgress } = useScroll({ target: endRef, offset: ['start end', 'start start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.7])
  const radius = useTransform(scrollYProgress, [0, 1], [first ? 0 : 28, 40])

  const animated = !last

  return (
    <>
      <div ref={ref} className="sticky" style={{ top: layout.top }}>
        <motion.div
          style={{
            scale: animated && !reduce ? scale : 1,
            borderTopLeftRadius: animated ? radius : first ? 0 : 28,
            borderTopRightRadius: animated ? radius : first ? 0 : 28,
            transformOrigin: layout.origin,
          }}
          className={`relative overflow-hidden ${bg} ${
            first ? '' : 'shadow-[0_-30px_60px_-10px_rgba(0,0,0,0.75)] ring-1 ring-line'
          }`}
        >
          {children}
          {animated && (
            <motion.div
              aria-hidden="true"
              style={{ opacity: dim }}
              className="pointer-events-none absolute inset-0 bg-black"
            />
          )}
        </motion.div>
      </div>
      <div ref={endRef} aria-hidden="true" />
    </>
  )
}
