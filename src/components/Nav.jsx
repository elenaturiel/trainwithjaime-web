import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Button from './Button.jsx'

const LINKS = [
  { to: '/servicios', label: 'Servicios' },
  { to: '/sobre-jaime', label: 'Sobre Jaime' },
  { to: '/#precios', label: 'Precios' },
  { to: '/contacto', label: 'Contacto' },
]

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`font-display text-2xl leading-none tracking-wide text-fg ${className}`}>
      TRAIN WITH <span className="text-brand">JAIME</span>
    </Link>
  )
}

export default function Nav() {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Transparente sobre el hero → sólido con blur a partir de 80px de scroll.
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 80))

  // Cierra el menú móvil al navegar.
  useEffect(() => setOpen(false), [location.key])

  // Bloquea el scroll del body con el menú abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isSolid = solid || open

  return (
    <>
      <header
        className={`fixed inset-x-0 top-9 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          isSolid ? 'border-line bg-ink/85 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-18 md:px-8">
          <Logo />

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end
                  className={({ isActive }) =>
                    `relative py-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-150 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:text-fg hover:after:scale-x-100 ${
                      isActive && !l.to.includes('#') ? 'text-fg' : 'text-fg-2'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Button to="/contacto" className="px-5 py-2.5 text-xs">
              Empieza gratis
            </Button>
          </div>

          {/* Hamburguesa (< 768px) */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            className="relative z-50 -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={`absolute left-0 h-0.5 w-6 bg-fg transition-transform duration-200 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-6 bg-fg transition-transform duration-200 ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Menú móvil a pantalla completa */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 flex flex-col bg-ink px-5 pb-10 pt-32 md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
              className="flex flex-1 flex-col gap-2"
            >
              {LINKS.map((l) => (
                <motion.li
                  key={l.to}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  className="border-b border-line"
                >
                  <Link
                    to={l.to}
                    className="block py-4 font-display text-5xl leading-none text-fg transition-colors active:text-accent"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <Button to="/contacto" className="w-full">
              Empieza gratis
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
