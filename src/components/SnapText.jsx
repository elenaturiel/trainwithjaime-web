import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

/* ══ Snap text ════════════════════════════════════════════
   A list of big lines and a picture beside it. As you scroll, the track slides up one line at a
   time: the line in focus fills with its colour, the others shrink, fade, step to the right and
   turn into outlines, and the picture cross-fades to the one that goes with the line.

   Adapted from a "SnapText" component (motion/react + shadcn). Differences, on purpose:
   - It has no scroll box of its own. The original scrolled an inner element, which traps the wheel
     and the finger inside the block; here the PAGE scroll drives it: the section is N screens tall
     and the stage inside it is sticky, so you scroll through it and out the other side.
   - Sizes are in em, so one font-size controls the row height, the indent and the track offset.
   - Each item carries a short text that sits under its big line and travels with it: it only reads
     while its line is in focus. Titles may wrap to two lines (rows have a fixed height in em).
   - On small screens the picture goes above the lines instead of beside them.
   - It must NOT live inside a <ScrollSection>: those wrappers clip overflow, which breaks sticky. */

const SPRING = { damping: 30, mass: 0.8, stiffness: 280 }
const EFFECTS = {
  imageOffsetPercent: 24, // how far the pictures slide while they fade
  imageScaleFalloff: 0.04,
  maxIndentSteps: 3,
  rowMinOpacity: 0.24,
  rowOpacityFalloff: 0.68,
  rowMinScale: 0.8,
  rowScaleFalloff: 0.1,
  rowStretch: 0.1, // a line stretches a little in the middle of its way out, like rubber
  outlineWidth: 1,
}
const ROW = 3.1 // row height, in em: a title of up to two lines, and the small text under it

function Picture({ index, progress, reduced, src }) {
  const opacity = useTransform(progress, (p) => Math.max(0, 1 - Math.abs(index - p)))
  const transform = useTransform(progress, (p) => {
    if (reduced) return 'translate3d(0px, 0%, 0px) scale3d(1, 1, 1)'
    const d = index - p
    const clamped = Math.max(-1, Math.min(1, d))
    const scale = 1 - Math.min(Math.abs(d), 1) * EFFECTS.imageScaleFalloff
    return `translate3d(0px, ${clamped * EFFECTS.imageOffsetPercent}%, 0px) scale3d(${scale}, ${scale}, 1)`
  })
  return (
    <motion.div className="absolute inset-0 origin-center will-change-[transform,opacity]" style={{ opacity, transform }}>
      <img alt="" src={src} draggable={false} className="size-full select-none object-cover" />
    </motion.div>
  )
}

function Row({ color, index, inactiveColor, item, progress }) {
  const opacity = useTransform(progress, (p) =>
    Math.max(EFFECTS.rowMinOpacity, 1 - Math.abs(index - p) * EFFECTS.rowOpacityFalloff),
  )
  const fill = useTransform(progress, (p) => Math.max(0, 1 - Math.abs(index - p)))
  const outline = useTransform(fill, (f) => 1 - f)
  const transform = useTransform(progress, (p) => {
    const d = Math.abs(index - p)
    const x = Math.min(d, EFFECTS.maxIndentSteps) * 0.35
    const scale = Math.max(EFFECTS.rowMinScale, 1 - d * EFFECTS.rowScaleFalloff)
    const stretch = 1 + Math.sin(Math.min(d, 1) * Math.PI) * EFFECTS.rowStretch
    return `translate3d(${x}em, 0px, 0px) scale3d(${scale * stretch}, ${scale}, 1)`
  })
  return (
    <motion.li
      aria-label={item.title}
      className="flex origin-left flex-col justify-center will-change-transform"
      style={{ height: `${ROW}em`, opacity, transform }}
    >
      {/* the big line: an outline while it is out of focus… */}
      <span className="grid font-display font-semibold leading-[1.02] tracking-[-0.03em] [text-wrap:balance]">
        <motion.span
          aria-hidden="true"
          className="col-start-1 row-start-1 text-transparent"
          style={{ opacity: outline, WebkitTextStroke: `${EFFECTS.outlineWidth}px ${inactiveColor}` }}
        >
          {item.title}
        </motion.span>
        {/* …and its colour, filled in, when it is the one in focus */}
        <motion.span aria-hidden="true" className="col-start-1 row-start-1" style={{ color, opacity: fill }}>
          {item.title}
        </motion.span>
      </span>
      {/* the small text under it travels with it, and only reads while its line is in focus */}
      {item.text && (
        <motion.span
          aria-hidden="true"
          className="mt-[0.3em] block max-w-[34rem] font-sans font-normal leading-relaxed tracking-normal text-fg-2"
          style={{ opacity: fill, fontSize: 'clamp(0.9rem, 1.45vw, 1.3rem)' }}
        >
          {item.text}
        </motion.span>
      )}
    </motion.li>
  )
}

/**
 * items: [{ title, text }] · images: one src per item (cycled if fewer) · colors: one per item (cycled).
 * `screens` = how many screen heights of scroll each line takes.
 */
export default function SnapText({
  items,
  images = [],
  colors = ['#5C9DFF', '#FFC93C', '#FFFFFF'],
  inactiveColor = '#9AA8C6',
  heading,
  screens = 0.7,
  className = '',
}) {
  const reduced = !!useReducedMotion()
  const ref = useRef(null)
  const n = items.length
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const raw = useTransform(scrollYProgress, (v) => v * (n - 1))
  const spring = useSpring(raw, SPRING)
  // With reduced motion the lines follow the scroll directly, with no spring
  const progress = reduced ? raw : spring
  useMotionValueEvent(raw, 'change', (v) => setActive(Math.min(n - 1, Math.max(0, Math.round(v)))))

  const track = useTransform(progress, (p) => `translate3d(0px, ${-ROW / 2 - p * ROW}em, 0px)`)
  const color = colors[active % colors.length]

  return (
    <div ref={ref} className={`relative ${className}`} style={{ height: `${100 + (n - 1) * screens * 100}svh` }}>
      <div className="sticky top-0 h-svh min-h-[520px] overflow-hidden" style={{ fontSize: 'clamp(1.9rem, 6vw, 5.75rem)' }}>
        {heading && (
          <div className="absolute inset-x-0 top-24 z-10 mx-auto max-w-7xl px-5 text-fg md:top-28 md:px-8" style={{ fontSize: '1rem' }}>
            {heading}
          </div>
        )}

        {/* mobile: the picture on top, the lines under it · desktop: picture left, lines right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-14 top-[9.5rem] mx-auto flex max-w-7xl flex-col gap-4 px-5 md:top-[9.5rem] md:flex-row md:items-center md:gap-[clamp(1.5rem,3vw,3rem)] md:px-8"
        >
          {images.length > 0 && (
            <div className="relative h-[28svh] w-full shrink-0 overflow-hidden rounded-xl bg-panel-2 md:h-[min(60svh,40rem)] md:w-auto md:aspect-[4/5] md:rounded-2xl">
              {items.map((it, i) => (
                <Picture key={it.title} index={i} progress={progress} reduced={reduced} src={images[i % images.length]} />
              ))}
            </div>
          )}
          <div className="relative min-h-0 w-full min-w-0 flex-1 self-stretch">
            <motion.ul className="absolute inset-x-0 top-1/2 m-0 list-none p-0" style={{ transform: track }}>
              {items.map((it, i) => (
                <Row key={it.title} color={colors[i % colors.length]} index={i} inactiveColor={inactiveColor} item={it} progress={progress} />
              ))}
            </motion.ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="absolute inset-x-0 bottom-6 z-10 mx-auto max-w-7xl px-5 text-right font-mono text-[11px] tracking-[0.16em] md:bottom-10 md:px-8"
          style={{ fontSize: '11px' }}
        >
          <span style={{ color }}>{String(active + 1).padStart(2, '0')}</span>
          <span className="text-muted"> / {String(n).padStart(2, '0')}</span>
        </p>

        {/* everything, for screen readers, whatever the scroll position */}
        <ul className="sr-only">
          {items.map((it) => (
            <li key={it.title}>
              {it.title}. {it.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
