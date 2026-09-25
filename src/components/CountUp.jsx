import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

const fmt = (n, decimals) =>
  n.toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

// Cuenta de `from` a `to` solo cuando el número entra en pantalla (una vez).
export default function CountUp({
  from = 0,
  to,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
  className = '',
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (!inView) return
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, from, to, duration])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {fmt(value, decimals)}
      {suffix}
    </span>
  )
}
