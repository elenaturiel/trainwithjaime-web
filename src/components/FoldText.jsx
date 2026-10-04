import { createElement } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/* ══ Fold text ════════════════════════════════════════════
   Text that unfolds: each letter (or word) starts folded flat against its hinge edge, seen from the
   edge, and swings open toward you in perspective, one after another. While it is folded it is dark,
   as if in the shade of the crease, and it lights up as it opens.

   Written for this project with framer-motion (the API follows the usual FoldText props; `ease` takes
   the GSAP-style names it was specified with). With "reduce motion" the text is simply there. */

const EASES = {
  linear: 'linear',
  'power1.out': [0.25, 0.46, 0.45, 0.94],
  'power2.out': [0.215, 0.61, 0.355, 1],
  'power3.out': [0.165, 0.84, 0.44, 1],
  'power4.out': [0.23, 1, 0.32, 1],
  'expo.out': [0.16, 1, 0.3, 1],
  'back.out': [0.34, 1.56, 0.64, 1],
}

export default function FoldText({
  text,
  as = 'span',
  splitBy = 'char', // 'char' | 'word'
  hinge = 'top', // 'top' | 'bottom'
  trigger = 'mount', // 'mount' | 'inView'
  duration = 0.65,
  stagger = 0.045,
  ease = 'power3.out',
  perspective = 700,
  creaseShading = 0.55, // 0 = no shading, 1 = folded text is fully dark
  fontSize,
  fontWeight,
  color,
  className = '',
}) {
  const reduced = useReducedMotion()
  const easing = Array.isArray(ease) ? ease : (EASES[ease] ?? EASES['power3.out'])
  const style = { fontSize, fontWeight, color }

  if (reduced) return createElement(as, { className, style }, text)

  const words = text.split(' ')
  const units = splitBy === 'word' ? words.map((w) => [w]) : words.map((w) => [...w])
  const fold = hinge === 'bottom' ? 90 : -90
  const trig = trigger === 'inView' ? { whileInView: 'open', viewport: { once: true, amount: 0.6 } } : { animate: 'open' }
  let n = 0

  const variants = {
    shut: { rotateX: fold, opacity: 0, filter: `brightness(${1 - creaseShading})` },
    open: (i) => ({
      rotateX: 0,
      opacity: 1,
      filter: 'brightness(1)',
      transition: { duration, delay: i * stagger, ease: easing, opacity: { duration: duration * 0.4, delay: i * stagger } },
    }),
  }

  return createElement(
    as,
    { className, style: { ...style, perspective }, 'aria-label': text },
    <>
      {units.map((chars, wi) => (
        <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
          {chars.map((c, ci) => (
            <motion.span
              key={ci}
              className="inline-block will-change-transform"
              style={{ transformOrigin: `50% ${hinge === 'bottom' ? '100%' : '0%'}` }}
              custom={n++}
              variants={variants}
              initial="shut"
              {...trig}
            >
              {c}
            </motion.span>
          ))}
          {wi < units.length - 1 && ' '}
        </span>
      ))}
    </>,
  )
}
