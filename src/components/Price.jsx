import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'

/* ══ Precio ═══════════════════════════════════════════════
   Cifra de un precio mensual (o de pack) con su precio anterior tachado si lo hay. La cifra "rueda" al entrar. */

const DURATION = { fast: 0.16, standard: 0.28 }
const EASE_ENTER = [0.16, 0.84, 0.3, 1]
const clip = { type: 'spring', visualDuration: 0.36, bounce: 0 }

const fmt = (v, decimals) => v.toFixed(decimals).replace('.', ',')

/* The amount rolls to its value. */
export function Counter({ value, decimals }) {
  const reduced = !!useReducedMotion()
  const mv = useMotionValue(value)
  const [text, setText] = useState(fmt(value, decimals))
  useEffect(() => {
    if (reduced) {
      setText(fmt(value, decimals))
      return
    }
    const c = animate(mv, value, { duration: 0.6, ease: EASE_ENTER, onUpdate: (v) => setText(fmt(v, decimals)) })
    return () => c.stop()
  }, [value, decimals, reduced, mv])
  return <span aria-hidden="true">{text}</span>
}

/**
 * A price. The struck-through old price eases its width in and out, so nothing beside it jumps.
 * `was` is shown only when it is higher than `amount`.
 */
export function Price({ amount, decimals = 2, was, period, prefix, compact = false, flush = false, center = false, className = '', periodClass = '', wasClass = '' }) {
  const reduced = !!useReducedMotion()
  const showWas = was !== undefined && was > amount
  return (
    <p className={`flex flex-wrap items-baseline gap-x-1.5 gap-y-1 ${compact ? 'justify-end' : center ? 'justify-center' : flush ? '' : 'mt-6'}`}>
      <span className="sr-only">
        {fmt(amount, decimals)}€ {period}
        {showWas ? `, precio anterior ${fmt(was, decimals)}€` : ''}
      </span>
      {prefix && (
        <span aria-hidden="true" className="text-xs text-muted">
          {prefix}
        </span>
      )}
      <span className={`font-display leading-none tabular-nums ${className}`}>
        <Counter value={amount} decimals={decimals} />
        <span aria-hidden="true">€</span>
      </span>
      <span aria-hidden="true" className={`text-xs font-semibold uppercase tracking-[0.15em] text-muted ${periodClass}`}>
        {period}
      </span>
      <AnimatePresence initial={false}>
        {showWas && (
          <motion.span
            key="was"
            aria-hidden="true"
            className={`overflow-hidden whitespace-nowrap ${wasClass}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, width: 0, transition: { ...clip, opacity: { duration: DURATION.fast } } }}
            transition={reduced ? { duration: DURATION.fast } : { ...clip, opacity: { duration: DURATION.standard, ease: EASE_ENTER } }}
          >
            <del className="ml-1 text-base text-muted decoration-1">{fmt(was, decimals)}€</del>
          </motion.span>
        )}
      </AnimatePresence>
    </p>
  )
}
