import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Gráfica de progreso en SVG propio (sin librería de gráficos: pesaba ~350 KB y bloqueaba el scroll al cargarse).

// Datos ficticios de progreso (sentadilla, kg) — solo ilustrativos.
const DATA = [
  { semana: 'S1', kg: 80 },
  { semana: 'S2', kg: 82.5 },
  { semana: 'S3', kg: 82.5 },
  { semana: 'S4', kg: 85 },
  { semana: 'S5', kg: 87.5 },
  { semana: 'S6', kg: 87.5 },
  { semana: 'S7', kg: 90 },
  { semana: 'S8', kg: 92.5 },
  { semana: 'S9', kg: 95 },
  { semana: 'S10', kg: 95 },
  { semana: 'S11', kg: 97.5 },
  { semana: 'S12', kg: 100 },
]
const Y_MIN = 75
const Y_MAX = 105
const TICKS = [80, 90, 100]
const M = { top: 10, right: 12, bottom: 24, left: 30 }

// Curva monótona (como "monotone" de las librerías de gráficas): suave y sin pasarse de los datos.
function monotonePath(pts) {
  const n = pts.length
  const dx = []
  const m = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0])
    m.push((pts[i + 1][1] - pts[i][1]) / dx[i])
  }
  const t = [m[0]]
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2)
  t.push(m[n - 2])
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3
    d += ` C${pts[i][0] + h},${pts[i][1] + t[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`
  }
  return d
}

// Lee los colores del tema (claro, azul marino o azul) en el que esté la gráfica.
function useThemeColors(ref) {
  const [c, setC] = useState({ line: '#DFE5EF', muted: '#56668A', brand: '#1D64D8', panel: '#F4F6FA', ink: '#FFFFFF', fg: '#041037' })
  useLayoutEffect(() => {
    const cs = getComputedStyle(ref.current)
    const v = (n) => cs.getPropertyValue(n).trim()
    setC({ line: v('--color-line'), muted: v('--color-muted'), brand: v('--color-brand'), panel: v('--color-panel'), ink: v('--color-ink'), fg: v('--color-fg') })
  }, [ref])
  return c
}

export default function ProgressChart() {
  const ref = useRef(null)
  const c = useThemeColors(ref)
  const reduced = useReducedMotion()
  const [size, setSize] = useState({ w: 320, h: 224 })
  const [hover, setHover] = useState(null)

  useLayoutEffect(() => {
    const el = ref.current
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w, h } = size
  const iw = Math.max(1, w - M.left - M.right)
  const ih = Math.max(1, h - M.top - M.bottom)
  const x = (i) => M.left + (i / (DATA.length - 1)) * iw
  const y = (v) => M.top + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * ih
  const pts = DATA.map((d, i) => [x(i), y(d.kg)])

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left - M.left) / iw) * (DATA.length - 1))
    setHover(Math.max(0, Math.min(DATA.length - 1, i)))
  }

  return (
    <div
      ref={ref}
      className="relative h-56 w-full touch-pan-y md:h-64"
      role="img"
      aria-label="Progreso ficticio de sentadilla: de 80 kg a 100 kg en 12 semanas"
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block" aria-hidden="true">
        {TICKS.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={w - M.right} y1={y(t)} y2={y(t)} stroke={c.line} />
            <text x={M.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill={c.muted}>
              {t}
            </text>
          </g>
        ))}
        {DATA.map((d, i) =>
          i % 2 === 0 ? (
            <text key={d.semana} x={x(i)} y={h - 6} textAnchor="middle" fontSize="11" fill={c.muted}>
              {d.semana}
            </text>
          ) : null,
        )}
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={M.top} y2={M.top + ih} stroke={c.brand} strokeOpacity="0.4" />}
        <motion.path
          d={monotonePath(pts)}
          fill="none"
          stroke={c.brand}
          strokeWidth="2"
          strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 0.84, 0.3, 1] }}
        />
        {hover !== null && <circle cx={x(hover)} cy={y(DATA[hover].kg)} r="5" fill={c.brand} stroke={c.panel} strokeWidth="2" />}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-lg border border-line bg-ink px-3 py-2 text-xs"
          style={{ left: Math.min(Math.max(x(hover), 40), w - 40), top: Math.max(0, y(DATA[hover].kg) - 56) }}
        >
          <p className="text-muted">{DATA[hover].semana}</p>
          <p className="font-semibold text-fg">{DATA[hover].kg.toLocaleString('es-ES')} kg</p>
        </div>
      )}
    </div>
  )
}
