import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { hoverScale } from '../lib/motion.js'

const MotionLink = motion.create(Link)

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60'

const styles = {
  primary: 'bg-accent text-on-accent hover:bg-[#ffd666]',
  secondary: 'border border-fg/25 text-fg hover:border-fg/60 hover:bg-fg/5',
  brand: 'bg-brand text-white hover:brightness-110',
}

// Botón / enlace con micro-interacción (scale 1.02 en hover, 150 ms).
export default function Button({ to, href, variant = 'primary', className = '', children, ...props }) {
  const cls = `${base} ${styles[variant]} ${className}`
  if (to) {
    return (
      <MotionLink to={to} className={cls} {...hoverScale} {...props}>
        {children}
      </MotionLink>
    )
  }
  if (href) {
    return (
      <motion.a href={href} className={cls} {...hoverScale} {...props}>
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button className={cls} {...hoverScale} {...props}>
      {children}
    </motion.button>
  )
}
