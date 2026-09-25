// Variants compartidos de Framer Motion.
// Con <MotionConfig reducedMotion="user"> el desplazamiento en Y se anula
// automáticamente para quien tenga prefers-reduced-motion y queda solo el fade.

export const EASE = [0.22, 1, 0.36, 1]

export const VIEWPORT = { once: true, amount: 0.2 }

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.99 },
  transition: { duration: 0.15 },
}
