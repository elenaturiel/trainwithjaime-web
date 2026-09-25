import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TOP_STRIP_TESTIMONIALS } from '../config.js'

// Tira superior fija con testimonio rotatorio.
// ⚠️ SUSTITUIR los testimonios en src/config.js (TOP_STRIP_TESTIMONIALS).
export default function TopStrip() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (TOP_STRIP_TESTIMONIALS.length < 2) return
    const id = setInterval(() => setI((n) => (n + 1) % TOP_STRIP_TESTIMONIALS.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-9 overflow-hidden border-b border-line bg-ink">
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center px-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="truncate text-center text-xs text-fg-2"
          >
            <span className="mr-2 text-accent">★★★★★</span>
            {TOP_STRIP_TESTIMONIALS[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
