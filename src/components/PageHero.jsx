import { motion } from 'framer-motion'
import { EASE } from '../lib/motion.js'

// Hero corto para páginas interiores.
export default function PageHero({ title, children, center = false }) {
  return (
    <section className="theme-dark relative overflow-hidden border-b border-line bg-ink pb-16 pt-40 md:pb-24 md:pt-52">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(61,139,255,0.14),transparent_60%)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`relative mx-auto max-w-7xl px-5 md:px-8 ${center ? 'text-center' : ''}`}
      >
        <h1 className={center ? 'font-display text-[3.25rem] font-bold uppercase leading-[1.02] sm:text-7xl md:text-[9rem] lg:text-[11rem]' : 'font-display text-6xl leading-[1.02] md:text-9xl'}>
          {title}
        </h1>
        {children && (
          <div className={`mt-6 max-w-2xl text-base text-fg-2 md:text-lg ${center ? 'mx-auto' : ''}`}>{children}</div>
        )}
      </motion.div>
    </section>
  )
}
