import { motion } from 'framer-motion'
import { cardHover, fadeUp, stagger, VIEWPORT } from '../lib/motion.js'

// Sección que entra con fade + translateY(24px → 0) al aparecer en el viewport.
export function Reveal({ as = 'section', children, className = '', ...props }) {
  const Comp = motion[as]
  return (
    <Comp variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT} className={className} {...props}>
      {children}
    </Comp>
  )
}

// Contenedor que revela a sus hijos <StaggerItem> en cascada (100 ms).
export function Stagger({ as = 'div', children, className = '', ...props }) {
  const Comp = motion[as]
  return (
    <Comp variants={stagger} initial="hidden" whileInView="show" viewport={VIEWPORT} className={className} {...props}>
      {children}
    </Comp>
  )
}

// `hover`: la tarjeta se eleva y crece al pasar el cursor.
export function StaggerItem({ as = 'div', hover = false, children, className = '', ...props }) {
  const Comp = motion[as]
  return (
    <Comp
      variants={fadeUp}
      className={`${className} ${hover ? 'transition-colors duration-200' : ''}`}
      {...(hover ? cardHover : {})}
      {...props}
    >
      {children}
    </Comp>
  )
}
