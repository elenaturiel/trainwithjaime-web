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
   - Items carry a short description that appears under the stage for the line in focus.
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
const ROW = 1.6 // row height, in em

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
    const x = Math.min(d, EFFECTS.maxIndentSteps) * 0.5
    const scale = Math.max(EFFECTS.rowMinScale, 1 - d * EFFECTS.rowScaleFalloff)
    const stretch = 1 + Math.sin(Math.min(d, 1) * Math.PI) * EFFECTS.rowStretch
    return `translate3d(${x}em, 0px, 0px) scale3d(${scale * stretch}, ${scale}, 1)`
  })
  return (
    <motion.li
      aria-label={item.title}
      className="relative flex w-max max-w-full origin-left items-center whitespace-nowrap font-display font-semibold leading-none tracking-[-0.03em] will-change-transform"
      style={{ height: `${ROW}em`, opacity, transform }}
    >
      {/* an outline while it is out of focus… */}
      <motion.span
        aria-hidden="true"
        className="text-transparent"
        style={{ opacity: outline, WebkitTextStroke: `${EFFECTS.outlineWidth}px ${inactiveColor}` }}
      >
        {item.title}
      </motion.span>
      {/* …and its colour, filled in, when it is the one in focus */}
      <motion.span aria-hidden="true" className="absolute inset-0 flex items-center" style={{ color, opacity: fill }}>
        {item.title}
      </motion.span>
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
  const cur = items[active]

  return (
    <div ref={ref} className={`relative ${className}`} style={{ height: `${100 + (n - 1) * screens * 100}svh` }}>
      <div className="sticky top-0 h-svh min-h-[520px] overflow-hidden" style={{ fontSize: 'clamp(1.35rem, 4.4vw, 4.25rem)' }}>
        {heading && (
          <div className="absolute inset-x-0 mx-auto max-w-7xl px-5 md:px-8 top-24 z-10 text-fg md:top-28" style={{ fontSize: '1rem' }}>
            {heading}
          </div>
        )}

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 mx-auto max-w-7xl px-5 md:px-8 inset-y-0 flex gap-[clamp(0.75rem,2vw,2rem)]">
          {images.length > 0 && (
            <div
              className="relative shrink-0 self-center overflow-hidden rounded-xl bg-panel-2"
              style={{ aspectRatio: 4 / 5, width: 'clamp(6rem, 24vw, 22rem)' }}
            >
              {items.map((it, i) => (
                <Picture key={it.title} index={i} progress={progress} reduced={reduced} src={images[i % images.length]} />
              ))}
            </div>
          )}
          <div className="relative min-w-0 flex-1">
            <motion.ul className="absolute inset-x-0 top-1/2 m-0 list-none p-0" style={{ transform: track }}>
              {items.map((it, i) => (
                <Row key={it.title} color={colors[i % colors.length]} index={i} inactiveColor={inactiveColor} item={it} progress={progress} />
              ))}
            </motion.ul>
          </div>
        </div>

        {/* what the line in focus means */}
        <div className="absolute inset-x-0 mx-auto max-w-7xl px-5 md:px-8 bottom-8 z-10 flex items-end justify-between gap-6 md:bottom-12" style={{ fontSize: '1rem' }}>
          <p key={active} className="max-w-md text-base leading-relaxed text-fg-2 motion-safe:animate-[fade-up_0.4s_ease-out]">
            {cur.text}
          </p>
          <p aria-hidden="true" className="shrink-0 font-mono text-[11px] tracking-[0.16em]">
            <span style={{ color }}>{String(active + 1).padStart(2, '0')}</span>
            <span className="text-muted"> / {String(n).padStart(2, '0')}</span>
          </p>
        </div>

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
