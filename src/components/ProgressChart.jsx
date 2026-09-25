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

export default function ProgressChart() {
  return (
    <div className="h-56 w-full md:h-64" role="img" aria-label="Progreso ficticio de sentadilla: de 80 kg a 100 kg en 12 semanas">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={DATA} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
          <CartesianGrid vertical={false} stroke="#1A1F2B" />
          <XAxis dataKey="semana" tickLine={false} axisLine={false} tick={{ fill: '#7C8497', fontSize: 11 }} interval={1} />
          <YAxis domain={[75, 105]} ticks={[80, 90, 100]} tickLine={false} axisLine={false} tick={{ fill: '#7C8497', fontSize: 11 }} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#3D8BFF', strokeOpacity: 0.4, strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="kg"
            stroke="#3D8BFF"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: '#3D8BFF', stroke: '#0B0D12', strokeWidth: 2 }}
            animationDuration={1400}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
