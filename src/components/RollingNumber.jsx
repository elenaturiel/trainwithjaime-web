import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 0.84, 0.3, 1] // frena suave al final (menos brusco que un expo-out)
const LAPS = 2 // vueltas completas de 0-9 antes de caer en la cifra
const COLUMN = Array.from({ length: 10 * (LAPS + 2) }, (_, i) => i % 10)

// Una cifra: columna 0-9-0-9… que sube (o baja) hasta quedarse en `digit`.
function Digit({ digit, index, active, direction }) {
  const up = direction === 'up'
  // Desplazamiento en % de la propia columna (alto = nº de filas × 1.1em): fila k → -k/total·100 %
  const pct = (row) => `${-(row / COLUMN.length) * 100}%`
  const from = pct(up ? 0 : COLUMN.length - 1)
  const to = pct(up ? 10 * LAPS + digit : 10 + digit)
  return (
    <span className="relative inline-block h-[1.1em] w-[0.62em] overflow-hidden text-center align-top leading-[1.1]">
      {/* cifra final invisible: fija el alto/ancho y es lo que lee un lector de pantalla */}
      <span className="invisible">{digit}</span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: active ? to : from }}
        transition={
          active ? { duration: 1.5 + index * 0.22, delay: index * 0.07, ease: EASE } : { duration: 0 } // al salir de pantalla vuelve al inicio sin animar, para repetirse la próxima vez
        }
      >
        {COLUMN.map((n, i) => (
          <span key={i} className="block h-[1.1em] leading-[1.1]">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

// Número que "rueda" dígito a dígito al entrar en pantalla (y otra vez cada vez que vuelves a verlo).
// value: texto final tal cual se muestra, p. ej. "24,90" · prefix/suffix: "-", "€", "%", "kg"…
export default function RollingNumber({ value, prefix = '', suffix = '', direction = 'up', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.6 })
  const reduce = useReducedMotion()
  const chars = String(value).split('')
  const digits = chars.filter((c) => /\d/.test(c)).length
  let d = -1

  return (
    <span
      ref={ref}
      className={`inline-flex items-baseline whitespace-nowrap ${className}`}
      aria-label={`${prefix}${value}${suffix}`}
    >
      <span aria-hidden="true" className="inline-flex">
        {prefix && <span className="inline-block h-[1.1em] leading-[1.1]">{prefix}</span>}
        {chars.map((c, i) => {
          if (!/\d/.test(c))
            return (
              <span key={i} className="inline-block h-[1.1em] leading-[1.1]">
                {c}
              </span>
            )
          d += 1
          // sin movimiento reducido: mostramos el número final directamente
          if (reduce)
            return (
              <span key={i} className="inline-block h-[1.1em] w-[0.62em] text-center leading-[1.1]">
                {c}
              </span>
            )
          return <Digit key={i} digit={Number(c)} index={d} active={inView} direction={direction} total={digits} />
        })}
        {suffix && <span className="inline-block h-[1.1em] leading-[1.1]">{suffix}</span>}
      </span>
    </span>
  )
}
