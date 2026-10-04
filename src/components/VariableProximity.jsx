import { createElement, useEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/* ══ Variable proximity ═══════════════════════════════════
   Each letter reads how far the pointer is from it and moves along a variable-font axis (here the
   weight) between two settings: the closer the pointer, the closer to `to`. So the heaviest letters
   follow the cursor across the line.

   Written for this project (the usual VariableProximity props). Differences, on purpose:
   - It listens on the window, so it works wherever the pointer is, and also follows a finger while
     it is touching or scrolling (touchmove), where there is no hover.
   - `containerRef` is optional: if it is not given, the text's own box is used.
   - It needs a VARIABLE font ("Outfit Variable" here). With a static font nothing would change.
   - With "reduce motion" the text just stays at `from`. */

const parse = (s) =>
  s
    .split(',')
    .map((p) => p.trim().match(/^['"]?([A-Za-z0-9]{4})['"]?\s+(-?[\d.]+)$/))
    .filter(Boolean)
    .map((m) => [m[1], parseFloat(m[2])])

const FALLOFF = {
  linear: (t) => t,
  exponential: (t) => t * t,
  gaussian: (t) => Math.exp(-((1 - t) ** 2) / 0.18),
}

export default function VariableProximity({
  label,
  as = 'span',
  fromFontVariationSettings = "'wght' 400",
  toFontVariationSettings = "'wght' 900",
  radius = 100,
  falloff = 'linear',
  containerRef,
  className = '',
  style,
}) {
  const reduced = useReducedMotion()
  const root = useRef(null)
  const letters = useRef([])
  const from = useMemo(() => parse(fromFontVariationSettings), [fromFontVariationSettings])
  const to = useMemo(() => parse(toFontVariationSettings), [toFontVariationSettings])
  const words = label.split(' ')
  let n = 0

  useEffect(() => {
    if (reduced) return
    const curve = FALLOFF[falloff] ?? FALLOFF.linear
    let pointer = null
    let raf = 0

    const paint = () => {
      raf = 0
      const box = (containerRef?.current ?? root.current)?.getBoundingClientRect()
      // far from the text: nothing to measure, everything back at `from`
      const near = pointer && box && pointer.x > box.left - radius && pointer.x < box.right + radius && pointer.y > box.top - radius && pointer.y < box.bottom + radius
      letters.current.forEach((el) => {
        if (!el) return
        let t = 0
        if (near) {
          const r = el.getBoundingClientRect()
          const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2))
          t = d >= radius ? 0 : curve(1 - d / radius)
        }
        el.style.fontVariationSettings = from
          .map(([axis, a], i) => `'${axis}' ${Math.round(a + ((to[i]?.[1] ?? a) - a) * t)}`)
          .join(', ')
      })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const move = (x, y) => {
      pointer = { x, y }
      schedule()
    }
    const onPointer = (e) => move(e.clientX, e.clientY)
    const onTouch = (e) => e.touches[0] && move(e.touches[0].clientX, e.touches[0].clientY)
    const clear = () => {
      pointer = null
      schedule()
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchend', clear)
    window.addEventListener('pointercancel', clear)
    document.documentElement.addEventListener('mouseleave', clear)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', clear)
      window.removeEventListener('pointercancel', clear)
      document.documentElement.removeEventListener('mouseleave', clear)
    }
  }, [reduced, falloff, radius, from, to, containerRef])

  const base = fromFontVariationSettings
  return createElement(
    as,
    { ref: root, className, style: { ...style, fontVariationSettings: base }, 'aria-label': label },
    words.map((word, wi) => (
      <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
        {[...word].map((c, ci) => (
          <span
            key={ci}
            ref={(el) => {
              letters.current[n] = el
              n++
            }}
            className="inline-block"
            style={{ fontVariationSettings: base }}
          >
            {c}
          </span>
        ))}
        {wi < words.length - 1 && ' '}
      </span>
    )),
  )
}
