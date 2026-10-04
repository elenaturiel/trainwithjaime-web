import { useEffect, useRef } from 'react'

/* ══ Border glow ══════════════════════════════════════════
   A glow on the border of its parent, on the side where the pointer is. Put it as a child of any
   element with `position: relative` (and a border-radius): it copies the radius, draws a coloured
   cone on the border facing the pointer, and a soft blurred halo of the same cone behind it.

   How it fades: it only shows when the pointer is near an edge. Inside the box the glow is full at
   the edge and gone `edgeSensitivity` % of the box towards the middle; outside, it fades out over
   `reach` px. It follows a finger too (touchmove). Nothing is drawn at rest.

   Written for this project (the usual BorderGlow props, as an overlay so it does not change the
   layout of what it sits on). `glowColor` is the HSL of the halo ("40 80 80" = hue sat light). */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export default function BorderGlow({
  colors = ['#FFC93C', '#5C9DFF', '#FFFFFF'],
  glowColor = '40 90 60',
  edgeSensitivity = 30,
  coneSpread = 25,
  glowRadius = 40,
  glowIntensity = 1,
  borderWidth = 2,
  reach = 80,
  /* how far the glow sits outside the parent's box (negative = outwards), e.g. '-1rem' */
  inset = '0px',
}) {
  const ring = useRef(null)

  useEffect(() => {
    const el = ring.current
    const host = el // the glow box itself, so `inset` moves the edge the pointer is measured against
    if (!host) return
    let raf = 0
    let pointer = null

    const paint = () => {
      raf = 0
      if (!pointer) return el.style.setProperty('--o', '0')
      const r = host.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = Math.max(r.left - pointer.x, 0, pointer.x - r.right)
      const dy = Math.max(r.top - pointer.y, 0, pointer.y - r.bottom)
      let o
      if (dx || dy) {
        o = 1 - Math.hypot(dx, dy) / reach // outside
      } else {
        const edge = Math.min(pointer.x - r.left, r.right - pointer.x, pointer.y - r.top, r.bottom - pointer.y)
        o = 1 - edge / (Math.min(r.width, r.height) * (edgeSensitivity / 100)) // inside
      }
      const angle = (Math.atan2(pointer.y - cy, pointer.x - cx) * 180) / Math.PI + 90 // conic 0° is at the top
      el.style.setProperty('--a', `${angle.toFixed(1)}deg`)
      el.style.setProperty('--o', clamp(o, 0, 1).toFixed(3))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const at = (x, y) => {
      pointer = { x, y }
      schedule()
    }
    const onPointer = (e) => at(e.clientX, e.clientY)
    const onTouch = (e) => e.touches[0] && at(e.touches[0].clientX, e.touches[0].clientY)
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
  }, [edgeSensitivity, reach])

  // the cone: transparent → the colours spread over 2 × coneSpread degrees, centred on the pointer's angle
  const span = coneSpread * 2
  const stops = colors.map((c, i) => `${c} ${((i + 0.5) / colors.length) * span}deg`).join(', ')
  const cone = `conic-gradient(from calc(var(--a, 0deg) - ${coneSpread}deg) at 50% 50%, transparent 0deg, ${stops}, transparent ${span}deg, transparent 360deg)`

  return (
    <span
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none absolute z-[1]"
      style={{ inset, borderRadius: 'inherit', '--o': 0, opacity: `calc(var(--o) * ${glowIntensity})` }}
    >
      {/* the halo: the same cone, cut to a wider band along the border and blurred, so it bleeds a little to both sides of the line and never washes over the content */}
      <span
        className="absolute inset-0"
        style={{
          borderRadius: 'inherit',
          padding: borderWidth * 5,
          background: cone,
          filter: `blur(${glowRadius / 4}px)`,
          opacity: 0.7,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
        }}
      />
      {/* the border itself: the cone cut to a ring */}
      <span
        className="absolute inset-0"
        style={{
          borderRadius: 'inherit',
          padding: borderWidth,
          background: cone,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
          boxShadow: `0 0 ${glowRadius}px hsl(${glowColor} / 0.12)`,
        }}
      />
    </span>
  )
}
