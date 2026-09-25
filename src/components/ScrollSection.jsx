import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

// Transiciones entre apartados al hacer scroll. Se intercalan para que no todas sean iguales:
//
//  - "stack":    el apartado se queda fijo y el siguiente sube por encima tapándolo
//                (el de debajo se encoge y se oscurece).
//  - "zoom":     el apartado entra pequeño y con esquinas redondeadas, y crece hasta ocupar todo.
//  - "clip":     el apartado entra "recortado" por los lados y se abre como un telón.
//  - "parallax": al salir de pantalla, su contenido se queda un poco atrás y se desvanece.
//
// Todas las <ScrollSection> de una página deben ser hermanas directas dentro de <main>
// (si no, el sticky de "stack" no funciona).
export default function ScrollSection({ effect = 'stack', first = false, last = false, bg = 'bg-ink', children }) {
  const reduce = useReducedMotion()
  if (effect === 'stack') return <Stack {...{ first, last, bg, reduce }}>{children}</Stack>
  if (reduce) {
    return <div className={`relative overflow-hidden ${bg} ${first ? '' : 'rounded-t-[28px]'}`}>{children}</div>
  }
  const Effect = { zoom: Zoom, clip: Clip, parallax: Parallax }[effect]
  return <Effect {...{ first, bg }}>{children}</Effect>
}

function Stack({ first, last, bg, reduce, children }) {
  const ref = useRef(null)
  const endRef = useRef(null)
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
  // Una vez tapado del todo se oculta, para que no asome por los huecos de "zoom" o "clip" más abajo.
  const visibility = useTransform(scrollYProgress, (v) => (v >= 0.999 ? 'hidden' : 'visible'))
  const animated = !last

  return (
    <>
      <motion.div
        ref={ref}
        className="sticky"
        style={{ top: layout.top, visibility: animated ? visibility : 'visible' }}
      >
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
      </motion.div>
      <div ref={endRef} aria-hidden="true" />
    </>
  )
}

function Zoom({ bg, children }) {
  const ref = useRef(null)
  // 0 → el apartado asoma por abajo · 1 → su borde superior llega al 25% de la pantalla.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0])
  return (
    <div ref={ref} className="relative">
      <motion.div
        style={{ scale, borderRadius: radius, transformOrigin: '50% 0%' }}
        className={`overflow-hidden ${bg} ring-1 ring-line`}
      >
        {children}
      </motion.div>
    </div>
  )
}

function Clip({ bg, children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.2'] })
  const clipPath = useTransform(scrollYProgress, (v) => {
    const side = 10 * (1 - v)
    return `inset(0% ${side}% 0% ${side}% round ${48 * (1 - v)}px)`
  })
  return (
    <div ref={ref} className="relative">
      <motion.div style={{ clipPath }} className={bg}>
        {children}
      </motion.div>
    </div>
  )
}

function Parallax({ first, bg, children }) {
  const ref = useRef(null)
  // 0 → el apartado toca el borde superior · 1 → ha salido por completo.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15])
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${bg} ${
        first ? '' : 'rounded-t-[28px] shadow-[0_-30px_60px_-10px_rgba(0,0,0,0.75)] ring-1 ring-line'
      }`}
    >
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </div>
  )
}
