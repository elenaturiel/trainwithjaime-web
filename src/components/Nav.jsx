import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useIsPresent,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import Button from './Button.jsx'
import { ArrowIcon, AppleIcon, ChatIcon, DumbbellIcon, HeartIcon, SparklesIcon, StarIcon, UsersIcon } from './Icons.jsx'
import { useHasTopBar } from '../lib/topbar.js'

/* ══ Site header ══════════════════════════════════════════
   Sticky bar that is clear over the hero and turns solid once the page scrolls. It marks the current page with a
   pill that glides between links, and a softer pill follows the pointer. Items with `links` open a mega panel:
   it drops in from the bar, its height eases to the content, and the content slides in from the side of the item
   you moved toward (opening from closed drops it in). On narrow screens it folds into a menu sheet with staggered
   rows and groups that expand.
   Adapted from a three-layout site header (this is its "mega" layout), for react-router and this project's tokens.

   Keyboard: ← → move between top-level items (and swap the open panel), ↓ opens a panel and enters it, ↑ ↓ Home End
   move inside it, Esc closes and returns focus, a press outside closes. Hover opens with a short intent delay and
   closes with a grace period, so crossing the gap to the panel does not close it. */

const physical = (visualDuration, bounce) => {
  const root = (2 * Math.PI) / (visualDuration * 1.2)
  return { type: 'spring', stiffness: root * root, damping: 2 * (1 - bounce) * root, mass: 1 }
}
const GROW = physical(0.44, 0.12)
const SHRINK = physical(0.34, 0)
const GLIDE = physical(0.3, 0.1)
const SLIDE = physical(0.4, 0.06)
const SELECTION = { type: 'spring', visualDuration: 0.34, bounce: 0 }
const ENTER = [0.16, 0.84, 0.3, 1]
const STANDARD = [0.4, 0, 0.2, 1]
const HOVER_INTENT = 70
const LEAVE_GRACE = 180
const TRAVEL = 36

const faceVariants = {
  hidden: (d) => ({ opacity: 0, x: d * TRAVEL, y: d ? 0 : -6, filter: 'blur(3px)' }),
  shown: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: { x: SLIDE, y: SLIDE, opacity: { duration: 0.16, ease: ENTER, delay: 0.02 }, filter: { duration: 0.28, ease: ENTER } },
  },
  gone: (d) => ({
    opacity: 0,
    x: d * -TRAVEL * 0.6,
    filter: 'blur(3px)',
    transition: { x: SLIDE, opacity: { duration: 0.1, ease: STANDARD }, filter: { duration: 0.1, ease: STANDARD } },
  }),
}
const fadeVariants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.16 } },
  gone: { opacity: 0, transition: { duration: 0.1 } },
}

const ICON = 'h-4 w-4'
const ITEMS = [
  {
    value: 'servicios',
    label: 'Servicios',
    to: '/servicios',
    links: [
      { label: 'Entrenamiento', description: 'Plan personalizado: gym o running', icon: <DumbbellIcon className={ICON} />, to: '/servicios#entrenamiento' },
      { label: 'Nutrición', description: 'Pensada para presupuesto de estudiante', icon: <AppleIcon className={ICON} />, to: '/servicios#nutricion' },
      { label: 'Seguimiento', description: 'Cada semana, por WhatsApp', icon: <ChatIcon className={ICON} />, to: '/servicios#seguimiento' },
      { label: 'Plataforma y comunidad', description: 'Exclusiva para clientes', icon: <UsersIcon className={ICON} />, to: '/servicios#comunidad' },
    ],
    feature: { title: 'Hazte el test de estudihambre', description: 'Descubre qué plan te encaja.', to: '/test', image: { src: '/gallery-5.jpg', alt: '' } },
  },
  {
    value: 'sobre-jaime',
    label: 'Sobre Jaime',
    to: '/sobre-jaime',
    links: [
      { label: 'Quién es Jaime', description: 'Un estudiante que entiende a estudiantes', icon: <HeartIcon className={ICON} />, to: '/sobre-jaime' },
      { label: 'Lo que defiendo', description: 'Anti-postureo y resultados sin humo', icon: <SparklesIcon className={ICON} />, to: '/sobre-jaime#valores' },
    ],
  },
  {
    value: 'precios',
    label: 'Precios',
    to: '/precios',
    links: [
      { label: 'Planes y precios', description: 'Cuatro planes desde 24,90 €/mes', icon: <StarIcon className={ICON} />, to: '/precios' },
      { label: 'Comparar los planes', description: 'Qué cambia de uno a otro', icon: <ChatIcon className={ICON} />, to: '/precios#comparar' },
      { label: 'Descuentos', description: 'Carné universitario y squad', icon: <UsersIcon className={ICON} />, to: '/precios#descuentos' },
    ],
    feature: { title: 'Primera asesoría gratis', description: 'Cuéntale a Jaime tu objetivo.', to: '/contacto', image: { src: '/gallery-2.jpg', alt: '' } },
  },
  { value: 'contacto', label: 'Contacto', to: '/contacto' },
]

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`whitespace-nowrap font-display text-xl font-bold leading-none tracking-wide text-fg ${className}`}>
      TRAIN WITH <span className="text-brand">JAIME</span>
    </Link>
  )
}

function Chevron({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

// A panel face reports its natural height while it is the current one; a leaving face floats out of flow and turns inert.
function Face({ direction, reduced, onHeight, children }) {
  const ref = useRef(null)
  const present = useIsPresent()
  useLayoutEffect(() => {
    const node = ref.current
    if (!node || !present) return
    onHeight(node.offsetHeight)
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => onHeight(node.offsetHeight))
    ro.observe(node)
    return () => ro.disconnect()
  }, [present, onHeight])
  return (
    <motion.div
      ref={ref}
      data-face=""
      data-leaving={present ? undefined : ''}
      inert={!present ? '' : undefined}
      className={present ? '' : 'pointer-events-none absolute inset-x-0 top-0'}
      custom={direction}
      variants={reduced ? fadeVariants : faceVariants}
      initial="hidden"
      animate="shown"
      exit="gone"
    >
      {children}
    </motion.div>
  )
}

const linkBase =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

export default function Nav() {
  const id = useId()
  const reduced = !!useReducedMotion()
  const hasTopBar = useHasTopBar()
  const { scrollY } = useScroll()
  const location = useLocation()
  const [solid, setSolid] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [open, setOpen] = useState(null) // { value, direction }
  const [panel, setPanel] = useState({ height: null, grow: true })
  const [menuOpen, setMenuOpen] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const rootRef = useRef(null)
  const menuButtonRef = useRef(null)
  const triggerRefs = useRef(new Map())
  const panelRef = useRef(null)
  const openTimer = useRef(0)
  const closeTimer = useRef(0)
  const focusFirst = useRef(false)
  const lastPointer = useRef('mouse')

  // Transparente sobre el hero → sólido con blur a partir de 80px de scroll.
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 80))

  const current = ITEMS.find((i) => i.to === location.pathname)?.value
  const openItem = open ? ITEMS.find((i) => i.value === open.value) : undefined

  const clearTimers = useCallback(() => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
  }, [])
  useEffect(() => clearTimers, [clearTimers])

  const openPanel = useCallback((value) => {
    setOpen((prev) => {
      if (!value) return null
      if (prev?.value === value) return prev
      const from = prev ? ITEMS.findIndex((i) => i.value === prev.value) : -1
      const to = ITEMS.findIndex((i) => i.value === value)
      return { value, direction: from < 0 ? 0 : Math.sign(to - from) }
    })
    if (!value) setPanel({ height: null, grow: true })
  }, [])

  const close = useCallback(
    (restoreFocus = false) => {
      clearTimers()
      const was = open?.value
      openPanel(null)
      if (restoreFocus && was) triggerRefs.current.get(was)?.focus()
    },
    [open, openPanel, clearTimers],
  )
  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpen(false)
    setExpanded(null)
    if (restoreFocus) menuButtonRef.current?.focus()
  }, [])

  // Navigating closes both layers
  useEffect(() => {
    close()
    closeMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  // Outside presses and Escape close whichever layer is open
  useEffect(() => {
    if (!open && !menuOpen) return
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) {
        close()
        closeMenu()
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') (open ? close(true) : closeMenu(true))
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, menuOpen, close, closeMenu])

  // The sheet holds the page still while open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // The sheet belongs to narrow screens (below 1024 px, tablets included, where the full menu does not fit): widening closes it, narrowing closes the panel
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => (mq.matches ? closeMenu() : openPanel(null))
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [closeMenu, openPanel])

  useEffect(() => {
    if (!open || !focusFirst.current) return
    focusFirst.current = false
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector('[data-panel-link]')?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  const onTriggerPointerEnter = (e, value) => {
    if (e.pointerType !== 'mouse') return
    window.clearTimeout(closeTimer.current)
    window.clearTimeout(openTimer.current)
    if (open) openPanel(value)
    else openTimer.current = window.setTimeout(() => openPanel(value), HOVER_INTENT)
  }
  const onRegionPointerLeave = (e) => {
    if (e.pointerType !== 'mouse') return
    window.clearTimeout(openTimer.current)
    closeTimer.current = window.setTimeout(() => openPanel(null), LEAVE_GRACE)
  }
  const onRegionPointerEnter = (e) => {
    if (e.pointerType === 'mouse') window.clearTimeout(closeTimer.current)
  }

  const onNavKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const triggers = Array.from(e.currentTarget.querySelectorAll('[data-nav-item]'))
    const index = triggers.indexOf(document.activeElement)
    if (index < 0) return
    e.preventDefault()
    const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + triggers.length) % triggers.length
    triggers[next].focus()
    if (open) {
      const item = ITEMS[next]
      openPanel(item?.links?.length ? item.value : null)
    }
  }
  const onTriggerKeyDown = (e, value) => {
    if (e.key !== 'ArrowDown') return
    e.preventDefault()
    focusFirst.current = true
    openPanel(value)
    if (open?.value === value) panelRef.current?.querySelector('[data-panel-link]')?.focus()
  }
  const onPanelKeyDown = (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
    const list = Array.from(e.currentTarget.querySelectorAll('[data-face]:not([data-leaving]) [data-panel-link]'))
    if (!list.length) return
    e.preventDefault()
    const index = list.indexOf(document.activeElement)
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : e.key === 'ArrowDown' ? Math.min(index + 1, list.length - 1) : index - 1
    if (next < 0) return close(true)
    list[next]?.focus()
  }

  // Growing carries a little life; shrinking settles without overshoot
  const onHeight = useCallback(
    (height) => setPanel((p) => (p.height === height ? p : { height, grow: p.height === null || height > p.height })),
    [],
  )

  const isSolid = solid || menuOpen || !!open
  // Todas las páginas empiezan con una banda azul marino: sin scroll, el menú va en blanco.
  const overDark = !isSolid

  return (
    <header
      ref={rootRef}
      className={`fixed inset-x-0 ${hasTopBar ? 'top-9' : 'top-0'} z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        isSolid ? 'border-line bg-ink/90 backdrop-blur-md' : 'border-transparent bg-transparent'
      } ${overDark ? 'theme-dark' : ''}`}
    >
      <div className="relative mx-auto max-w-7xl" onPointerLeave={onRegionPointerLeave} onPointerEnter={onRegionPointerEnter}>
        <div className="flex h-16 items-center justify-between px-5 md:h-18 md:px-8">
          <Logo />

          <LayoutGroup id={id}>
            <nav aria-label="Principal" onKeyDown={onNavKeyDown} onPointerLeave={() => setHovered(null)} className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {ITEMS.map((item) => {
                  const isCurrent = current === item.value
                  const withPanel = !!item.links?.length
                  const isOpen = open?.value === item.value
                  const common = {
                    'data-nav-item': '',
                    'data-open': isOpen ? '' : undefined,
                    className: `relative flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-150 hover:text-fg ${linkBase} ${
                      isCurrent || isOpen ? 'text-fg' : 'text-fg-2'
                    }`,
                    onPointerEnter: (e) => {
                      if (e.pointerType === 'mouse') setHovered(item.value)
                      if (withPanel) onTriggerPointerEnter(e, item.value)
                      else if (e.pointerType === 'mouse' && open) closeTimer.current = window.setTimeout(() => openPanel(null), LEAVE_GRACE)
                    },
                    onFocus: () => setHovered(null),
                    onPointerDown: (e) => (lastPointer.current = e.pointerType),
                  }
                  const decorations = (
                    <>
                      {hovered === item.value && (
                        <motion.span layoutId="nav-hover" aria-hidden="true" className="absolute inset-0 rounded-full bg-fg/5" transition={reduced ? { duration: 0 } : GLIDE} />
                      )}
                      {isCurrent && (
                        <motion.span layoutId="nav-selection" aria-hidden="true" className="absolute inset-0 rounded-full bg-fg/10" transition={reduced ? { duration: 0 } : SELECTION} />
                      )}
                    </>
                  )
                  return (
                    <li key={item.value}>
                      {withPanel ? (
                        // un enlace a la página + un panel: el clic va a la página, la flecha ↓ o pasar el ratón abren el panel
                        <Link
                          to={item.to}
                          ref={(n) => (n ? triggerRefs.current.set(item.value, n) : triggerRefs.current.delete(item.value))}
                          aria-haspopup="true"
                          aria-expanded={isOpen}
                          aria-current={isCurrent ? 'page' : undefined}
                          onKeyDown={(e) => onTriggerKeyDown(e, item.value)}
                          // con el dedo no hay hover: el primer toque abre el panel y el segundo va a la página
                          onClick={(e) => {
                            if (lastPointer.current === 'touch' && !isOpen) {
                              e.preventDefault()
                              openPanel(item.value)
                            }
                          }}
                          {...common}
                        >
                          {decorations}
                          <span className="relative">{item.label}</span>
                          <Chevron className={`relative h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        </Link>
                      ) : (
                        <Link
                          to={item.to}
                          ref={(n) => (n ? triggerRefs.current.set(item.value, n) : triggerRefs.current.delete(item.value))}
                          aria-current={isCurrent ? 'page' : undefined}
                          {...common}
                        >
                          {decorations}
                          <span className="relative">{item.label}</span>
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
          </LayoutGroup>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <Button to="/contacto" className="px-5 py-2.5 text-xs">
                Primera asesoría gratis
              </Button>
            </div>

            {/* Hamburguesa (< 1024px: móvil y tablet) */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls={`${id}-sheet`}
              className={`relative z-50 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden ${linkBase}`}
            >
              <span className="relative block h-3.5 w-6">
                <span className={`absolute left-0 h-0.5 w-6 bg-fg transition-transform duration-200 ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-0.5 w-6 bg-fg transition-transform duration-200 ${menuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Mega panel (desktop) */}
        <AnimatePresence>
          {openItem?.links && (
            <motion.div
              key="panel"
              id={`${id}-panel`}
              ref={panelRef}
              role="region"
              aria-label={openItem.label}
              onKeyDown={onPanelKeyDown}
              className="absolute right-1/2 top-full z-10 mt-2 hidden w-[min(44rem,calc(100vw-2.5rem))] translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-ink shadow-2xl shadow-[#041037]/20 lg:block"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1, height: panel.height ?? 'auto' }}
              exit={reduced ? { opacity: 0, transition: { duration: 0.1 } } : { opacity: 0, y: -4, scale: 0.99, transition: { duration: 0.14, ease: STANDARD } }}
              transition={reduced ? { duration: 0 } : { height: panel.grow ? GROW : SHRINK, y: GROW, scale: GROW, opacity: { duration: 0.16, ease: ENTER } }}
            >
              <div className="relative">
                <AnimatePresence initial={false} custom={open?.direction ?? 0}>
                  <Face key={openItem.value} direction={open?.direction ?? 0} reduced={reduced} onHeight={onHeight}>
                    <div className={`grid gap-2 p-3 ${openItem.feature ? 'grid-cols-[1fr_15rem]' : ''}`}>
                      <ul className="flex flex-col gap-0.5">
                        {openItem.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              to={link.to}
                              data-panel-link=""
                              className={`group flex items-start gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-fg/5 focus-visible:bg-fg/5 ${linkBase}`}
                            >
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-brand transition-colors duration-150 group-hover:border-brand/50">
                                {link.icon}
                              </span>
                              <span className="flex min-w-0 flex-col">
                                <span className="text-sm font-semibold text-fg">{link.label}</span>
                                <span className="text-xs leading-snug text-muted">{link.description}</span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {openItem.feature && (
                        <Link
                          to={openItem.feature.to}
                          data-panel-link=""
                          className={`group flex flex-col overflow-hidden rounded-xl border border-line bg-panel transition-colors duration-150 hover:border-brand/50 ${linkBase}`}
                        >
                          <span className="relative block aspect-[4/3] overflow-hidden bg-panel-2">
                            <img src={openItem.feature.image.src} alt={openItem.feature.image.alt} draggable={false} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </span>
                          <span className="flex items-center gap-1.5 px-3 pt-3 text-sm font-semibold text-fg">
                            {openItem.feature.title}
                            <ArrowIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </span>
                          <span className="px-3 pb-3 pt-1 text-xs leading-snug text-muted">{openItem.feature.description}</span>
                        </Link>
                      )}
                    </div>
                  </Face>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menú móvil: hoja que se despliega bajo la barra */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="scrim"
              aria-hidden="true"
              onClick={() => closeMenu()}
              className="fixed inset-0 -z-10 bg-[#041037]/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.28, ease: STANDARD }}
            />
            <motion.div
              key="sheet"
              id={`${id}-sheet`}
              className="absolute inset-x-0 top-full overflow-hidden border-b border-line bg-ink lg:hidden"
              initial={reduced ? { opacity: 0 } : { height: 0 }}
              animate={reduced ? { opacity: 1 } : { height: 'auto' }}
              exit={reduced ? { opacity: 0 } : { height: 0, transition: SHRINK }}
              transition={reduced ? { duration: 0 } : GROW}
            >
              <nav aria-label="Principal" className="max-h-[calc(100svh-4rem)] overflow-y-auto px-5 pb-6 pt-2">
                <ul>
                  {ITEMS.map((item, index) => {
                    const isCurrent = current === item.value
                    const group = !!item.links?.length
                    const isExpanded = expanded === item.value
                    const rowMotion = {
                      initial: reduced ? false : { opacity: 0, y: -6 },
                      animate: { opacity: 1, y: 0 },
                      transition: { duration: 0.28, ease: ENTER, delay: reduced ? 0 : 0.04 + index * 0.05 },
                    }
                    return (
                      <motion.li key={item.value} className="border-b border-line" {...rowMotion}>
                        {group ? (
                          <>
                            <div className="flex items-center">
                              <Link to={item.to} aria-current={isCurrent ? 'page' : undefined} className={`flex-1 py-4 font-display text-3xl leading-none text-fg ${linkBase}`}>
                                {item.label}
                                {isCurrent && <span aria-hidden="true" className="ml-3 inline-block h-2 w-2 rounded-full bg-accent" />}
                              </Link>
                              <button
                                type="button"
                                aria-expanded={isExpanded}
                                aria-controls={`${id}-group-${item.value}`}
                                aria-label={`Ver ${item.label}`}
                                onClick={() => setExpanded(isExpanded ? null : item.value)}
                                className={`flex h-11 w-11 items-center justify-center text-fg ${linkBase}`}
                              >
                                <Chevron className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  key="group"
                                  id={`${id}-group-${item.value}`}
                                  className="overflow-hidden"
                                  initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                  animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                  transition={reduced ? { duration: 0 } : { height: { type: 'spring', visualDuration: 0.34, bounce: 0 }, opacity: { duration: 0.16 } }}
                                >
                                  <ul className="pb-3">
                                    {item.links.map((link) => (
                                      <li key={link.label}>
                                        <Link to={link.to} className={`flex items-center gap-3 py-2.5 text-base text-fg-2 ${linkBase}`}>
                                          <span className="text-brand">{link.icon}</span>
                                          {link.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link to={item.to} aria-current={isCurrent ? 'page' : undefined} className={`flex items-center py-4 font-display text-3xl leading-none text-fg ${linkBase}`}>
                            {item.label}
                            {isCurrent && <span aria-hidden="true" className="ml-3 inline-block h-2 w-2 rounded-full bg-accent" />}
                          </Link>
                        )}
                      </motion.li>
                    )
                  })}
                </ul>
                <motion.div
                  className="pt-5"
                  initial={reduced ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: ENTER, delay: reduced ? 0 : 0.04 + ITEMS.length * 0.05 }}
                >
                  <Button to="/contacto" className="w-full">
                    Primera asesoría gratis
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
