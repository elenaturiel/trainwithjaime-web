import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

/* ══ Scroll expand ════════════════════════════════════════
   A framed picture that opens up as you scroll. It starts as a small rounded frame in the middle of the
   screen with a title on it; the page scroll (the section is taller than the screen and the stage inside it
   is sticky) widens it to the full screen — corners straightening, the picture settling from a zoom, a
   scrim darkening it — and then it hands the stage over to the content you put inside.

   Written for this project with framer-motion (the usual ScrollExpand props). Differences, on purpose:
   - It is driven by the PAGE scroll, with no scroll box of its own (an inner scroller would trap the wheel
     and the finger). Must not live inside a <ScrollSection>: those wrappers clip overflow and break sticky.
   - The content is mounted only once the frame is open, so what it animates on entering (the numbers that
     roll, the chart that draws) happens when you can see it.
   - On small screens the frame starts wider, so it is not a postage stamp.
   - With "reduce motion" there is no scroll story: the frame is simply open, with the content on it.

   scrollDistance / holdDistance are in screen heights: how much scrolling the opening takes, and how much
   the finished stage stays put before the page moves on. */

const SPRING = { stiffness: 140, damping: 30, mass: 0.4 }
const lerp = (a, b, t) => a + (b - a) * t
const ease = (t) => 1 - Math.pow(1 - t, 3) // starts fast, lands softly

export default function ScrollExpand({
  src,
  alt = '',
  title,
  children,
  startWidth = 42, // % of the stage
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  overlayScrim = 0.45, // darkness of the picture once open…
  contentScrim = 0.7, // …and once the content is on it
  className = '',
}) {
  const reduced = !!useReducedMotion()
  const ref = useRef(null)
  const [compact, setCompact] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setCompact(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const spring = useSpring(scrollYProgress, SPRING)
  const progress = reduced ? scrollYProgress : spring

  // the opening takes the first part of the scroll; the content arrives at the end of it
  const open = scrollDistance / (scrollDistance + holdDistance)
  const t = useTransform(progress, (v) => ease(Math.min(1, Math.max(0, v / open))))
  const sw = compact ? 78 : startWidth
  const sh = compact ? 46 : startHeight

  const width = useTransform(t, (v) => `${lerp(sw, 100, v)}%`)
  const height = useTransform(t, (v) => `${lerp(sh, 100, v)}%`)
  const radius = useTransform(t, (v) => lerp(startRadius, endRadius, v))
  const zoom = useTransform(t, (v) => lerp(mediaZoom, 1, v))
  const scrim = useTransform(progress, (v) => {
    const k = Math.min(1, Math.max(0, v / open))
    const c = Math.min(1, Math.max(0, (v - open * 0.8) / (1 - open * 0.8)))
    return lerp(0, overlayScrim, ease(k)) + (contentScrim - overlayScrim) * c
  })
  // the title fades and grows away while the frame opens
  const titleOpacity = useTransform(t, [0, 0.45], [1, 0])
  const titleScale = useTransform(t, [0, 1], [1, 1.25])
  useMotionValueEvent(progress, 'change', (v) => setShown(v > open * 0.8))

  const isShown = reduced || shown

  return (
    <div
      ref={ref}
      className={`theme-dark relative bg-ink ${className}`}
      style={reduced ? undefined : { height: `${(1 + scrollDistance + holdDistance) * 100}svh` }}
    >
      <div className={`${reduced ? 'relative min-h-svh' : 'sticky top-0 h-svh min-h-[560px]'} flex items-center justify-center overflow-hidden`}>
        <motion.div
          className="absolute overflow-hidden bg-panel-2"
          style={reduced ? { inset: 0 } : { width, height, borderRadius: radius }}
        >
          <motion.img
            src={src}
            alt={alt}
            draggable={false}
            className="size-full select-none object-cover"
            style={reduced ? undefined : { scale: zoom }}
          />
          <motion.div aria-hidden="true" className="absolute inset-0 bg-[#041037]" style={{ opacity: reduced ? contentScrim : scrim }} />
        </motion.div>

        {title && !reduced && (
          <motion.p
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 z-10 px-5 text-center font-display text-5xl font-bold uppercase leading-none text-white md:text-8xl"
            style={{ opacity: titleOpacity, scale: titleScale }}
          >
            {title}
          </motion.p>
        )}

        <div
          className={`z-10 w-full transition-opacity duration-500 ${reduced ? 'relative py-24' : 'absolute inset-x-0'} ${
            isShown ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {isShown && children}
        </div>
      </div>
    </div>
  )
}
