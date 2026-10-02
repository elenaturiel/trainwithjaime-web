import { useLayoutEffect, useRef, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-line bg-ink px-3 py-2 text-xs">
      <p className="text-muted">{label}</p>
      <p className="font-semibold text-fg">{payload[0].value.toLocaleString('es-ES')} kg</p>
    </div>
  )
}

// Lee los colores del tema (claro, azul marino o azul) en el que esté la gráfica.
function useThemeColors(ref) {
  const [c, setC] = useState({ line: '#DFE5EF', muted: '#56668A', brand: '#1D64D8', panel: '#F4F6FA' })
  useLayoutEffect(() => {
    const cs = getComputedStyle(ref.current)
    const v = (n) => cs.getPropertyValue(n).trim()
    setC({ line: v('--color-line'), muted: v('--color-muted'), brand: v('--color-brand'), panel: v('--color-panel') })
  }, [ref])
  return c
}

export default function ProgressChart() {
  const ref = useRef(null)
  const c = useThemeColors(ref)
  return (
    <div
      ref={ref}
      className="h-56 w-full md:h-64"
      role="img"
      aria-label="Progreso ficticio de sentadilla: de 80 kg a 100 kg en 12 semanas"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={DATA} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
          <CartesianGrid vertical={false} stroke={c.line} />
          <XAxis
            dataKey="semana"
            tickLine={false}
            axisLine={false}
            tick={{ fill: c.muted, fontSize: 11 }}
            interval={1}
          />
          <YAxis
            domain={[75, 105]}
            ticks={[80, 90, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: c.muted, fontSize: 11 }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: c.brand, strokeOpacity: 0.4, strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="kg"
            stroke={c.brand}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: c.brand, stroke: c.panel, strokeWidth: 2 }}
            animationDuration={1400}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
