import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'

/* ══ Billing toggle + price ═══════════════════════════════
   Adapted from a "billing toggle" component (motion/react + CSS module) to this project's stack:
   framer-motion, Tailwind classes and the site's own tokens. The motion tokens it imported
   (duration / ease / blur) are inlined below.

   ── ONE THUMB, CRITICALLY DAMPED ────────────────────────
   A single thumb glides between the options and lands without overshoot (bounce: 0), so it reads
   as a switch and not as a bouncing toy.

   ── NOTHING AROUND IT MOVES ─────────────────────────────
   The savings note rewrites itself in place. Every candidate text sits in the same grid cell, so
   the box always has the width of the longest one and the options never shift when it changes.
   The same goes for the struck-through price: its slot eases its width instead of popping in. */

const DURATION = { fast: 0.16, standard: 0.28 }
const EASE_ENTER = [0.16, 0.84, 0.3, 1]
const EASE_STANDARD = [0.4, 0, 0.2, 1]
const BLUR = 3

/** Critically damped: the thumb glides and lands without overshoot. */
const glide = { type: 'spring', visualDuration: 0.34, bounce: 0 }
const clip = { type: 'spring', visualDuration: 0.36, bounce: 0 }

const swap = {
  hidden: { opacity: 0, y: '0.45em', filter: `blur(${BLUR}px)` },
  shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: DURATION.standard, ease: EASE_ENTER } },
  gone: { opacity: 0, y: '-0.45em', filter: `blur(${BLUR}px)`, transition: { duration: DURATION.fast, ease: EASE_STANDARD } },
}
const still = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: DURATION.fast } },
  gone: { opacity: 0, transition: { duration: 0 } },
}

/* Text that swaps in place: all candidates share one grid cell (see above). */
function StableSwap({ text, candidates, reduced }) {
  return (
    <span className="inline-grid">
      {[...new Set(candidates)].map((c) => (
        <span key={c} aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {c}
        </span>
      ))}
      <AnimatePresence initial={false}>
        <motion.span
          key={text}
          className="col-start-1 row-start-1 whitespace-nowrap"
          variants={reduced ? still : swap}
          initial="hidden"
          animate="shown"
          exit="gone"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/**
 * options: [{ value, label, badge?, activeBadge? }]. `badge` is the short savings note; `activeBadge` is
 * what it says once the option is selected (defaults to `badge`).
 */
export function BillingToggle({ value, onValueChange, options, label = 'Periodo de facturación', className = '' }) {
  const reduced = !!useReducedMotion()
  const rootRef = useRef(null)
  const refs = useRef([])
  const [thumb, setThumb] = useState(null)
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value))

  const measure = useCallback(() => {
    const node = refs.current[selectedIndex]
    if (!node) return
    setThumb((cur) =>
      cur && cur.x === node.offsetLeft && cur.width === node.offsetWidth ? cur : { x: node.offsetLeft, width: node.offsetWidth },
    )
  }, [selectedIndex])

  useLayoutEffect(() => {
    measure()
    const root = rootRef.current
    if (!root || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => ro.disconnect()
  }, [measure])

  const onKeyDown = (e, index) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    const target = e.key === 'Home' ? 0 : e.key === 'End' ? options.length - 1 : step ? (index + step + options.length) % options.length : -1
    if (target < 0) return
    e.preventDefault()
    onValueChange(options[target].value)
    refs.current[target]?.focus()
  }

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      aria-label={label}
      className={`relative inline-flex rounded-full bg-panel-2 p-1 ${className}`}
    >
      {thumb && (
        <motion.span
          aria-hidden="true"
          className="absolute bottom-1 left-0 top-1 rounded-full bg-fg"
          initial={false}
          animate={{ x: thumb.x, width: thumb.width }}
          transition={reduced ? { duration: 0 } : glide}
        />
      )}
      {options.map((o, i) => {
        const selected = i === selectedIndex
        const badgeText = selected ? (o.activeBadge ?? o.badge) : o.badge
        const candidates = [o.badge, o.activeBadge].filter(Boolean)
        return (
          <button
            key={o.value}
            ref={(n) => {
              refs.current[i] = n
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onValueChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-5 ${
              selected ? 'text-ink' : 'text-muted hover:text-fg'
            } ${selected && !thumb ? 'bg-fg' : ''}`}
          >
            <span>{o.label}</span>
            {badgeText && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest transition-colors duration-200 ${
                  selected ? 'bg-accent text-on-accent' : 'bg-accent/25 text-accent-ink'
                }`}
              >
                <StableSwap text={badgeText} candidates={candidates} reduced={reduced} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

const fmt = (v, decimals) => v.toFixed(decimals).replace('.', ',')

/* The amount rolls to its new value (stands in for the AnimatedCounter of the original). */
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
 * A price that rolls to its new amount. The struck-through old price eases its width in and out, so
 * nothing beside it jumps. `was` is shown only when it is higher than `amount`.
 */
export function BillingPrice({ amount, decimals = 2, was, period, prefix, compact = false, className = '', periodClass = '', wasClass = '' }) {
  const reduced = !!useReducedMotion()
  const showWas = was !== undefined && was > amount
  return (
    <p className={`flex flex-wrap items-baseline gap-x-1.5 gap-y-1 ${compact ? 'justify-end' : 'mt-6'}`}>
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
