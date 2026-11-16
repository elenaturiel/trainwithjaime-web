import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

// Pegatina redonda que llama la atención sobre el plan HYROX. El texto del aro gira despacio; con "reducir movimiento"
// se queda quieta. Lleva a la página del entrenamiento HYROX.
const RING = 'ENTRENA PARA TU HYROX • NUEVO PLAN • '

export default function HyroxSticker({ className = '' }) {
  const reduced = !!useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { scale: 0, rotate: -40, opacity: 0 }}
      animate={{ scale: 1, rotate: -12, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 1 }}
      className={`z-20 ${className}`}
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -6, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Link
          to="/entrenamiento-hyrox"
          aria-label="Nuevo plan: entrena para tu HYROX"
          className="group relative flex h-[7.25rem] w-[7.25rem] items-center justify-center rounded-full bg-accent text-on-accent shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-4 ring-white/80 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-32 sm:w-32 md:h-40 md:w-40"
        >
          {!reduced && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full bg-accent"
              animate={{ scale: [1, 1.22], opacity: [0.55, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <svg
            viewBox="0 0 200 200"
            aria-hidden="true"
            className={`absolute inset-0 size-full ${reduced ? '' : 'animate-[spin_22s_linear_infinite]'}`}
          >
            <defs>
              <path id="hyrox-ring" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
            </defs>
            <text className="fill-current font-sans text-[15.5px] font-extrabold" textLength="470" lengthAdjust="spacing">
              <textPath href="#hyrox-ring" textLength="470" lengthAdjust="spacing">
                {RING}
              </textPath>
            </text>
          </svg>
          <span className="relative flex flex-col items-center leading-none">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] md:text-[11px]">Nuevo</span>
            <span className="mt-0.5 font-display text-[1.3rem] font-extrabold leading-none tracking-tight md:text-[1.85rem]">HYROX</span>
            <span className="mt-1 rounded-full bg-on-accent px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-accent md:text-[10px]">
              Plan
            </span>
          </span>
        </Link>
      </motion.div>
    </motion.div>
  )
}
