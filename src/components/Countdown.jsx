import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Cuenta atrás hasta una fecha (ISO con zona horaria). Cada cifra "rueda" cuando cambia.
export function useCountdown(iso) {
  const target = new Date(iso).getTime()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const left = target - now
  const t = Math.max(0, Math.floor(left / 1000))
  return {
    done: left <= 0,
    d: Math.floor(t / 86400),
    h: Math.floor((t % 86400) / 3600),
    m: Math.floor((t % 3600) / 60),
    s: t % 60,
  }
}

function Digit({ ch, reduced }) {
  return (
    <span className="relative inline-block h-[1.05em] w-[0.62em] overflow-hidden text-center leading-[1.05]">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={ch}
          initial={reduced ? false : { y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: '100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 0.84, 0.3, 1] }}
          className="absolute inset-0"
        >
          {ch}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">{ch}</span>
    </span>
  )
}

function Unit({ value, label, pad, reduced }) {
  const text = String(value).padStart(pad, '0')
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-2 py-5 text-center backdrop-blur-sm sm:px-4 md:py-7">
      <p aria-hidden="true" className="inline-flex font-display text-[clamp(1.9rem,7.2vw,4.25rem)] font-bold tabular-nums">
        {[...text].map((ch, i) => (
          <Digit key={i} ch={ch} reduced={reduced} />
        ))}
      </p>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-fg-2 sm:text-xs">{label}</p>
    </div>
  )
}

export default function Countdown({ iso, className = '' }) {
  const reduced = !!useReducedMotion()
  const c = useCountdown(iso)
  if (c.done) return <p className={`font-display text-4xl font-bold ${className}`}>¡Hoy es el día!</p>
  return (
    <div role="timer" aria-label={`Faltan ${c.d} días y ${c.h} horas`} className={`grid grid-cols-[1.45fr_1fr_1fr_1fr] gap-2 sm:gap-4 ${className}`}>
      <Unit value={c.d} label="días" pad={2} reduced={reduced} />
      <Unit value={c.h} label="horas" pad={2} reduced={reduced} />
      <Unit value={c.m} label="min" pad={2} reduced={reduced} />
      <Unit value={c.s} label="seg" pad={2} reduced={reduced} />
    </div>
  )
}
