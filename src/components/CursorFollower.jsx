import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const INTERACTIVE = 'a, button, select, input, textarea, label, [data-cursor]'

// Círculo que sigue al ratón y se agranda sobre enlaces, botones y tarjetas.
// Solo en ordenadores con ratón (no en móvil/táctil) y sin prefers-reduced-motion.
// El cursor normal se mantiene: esto es un acompañante, no un sustituto.
export default function CursorFollower() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled || reduce) return
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      setActive(!!e.target.closest?.(INTERACTIVE))
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, reduce, x, y])

  if (!enabled || reduce) return null

  return (
    <motion.div aria-hidden="true" style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[70]">
      <motion.div
        animate={{
          width: active ? 56 : 12,
          height: active ? 56 : 12,
          opacity: visible ? 1 : 0,
          backgroundColor: active ? 'rgba(255,201,60,0.12)' : 'rgba(255,201,60,1)',
          borderColor: active ? 'rgba(255,201,60,0.9)' : 'rgba(255,201,60,0)',
        }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border"
      />
    </motion.div>
  )
}
