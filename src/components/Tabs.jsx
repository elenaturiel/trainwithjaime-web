import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'framer-motion'

/* ══ Tabs ═════════════════════════════════════════════════
   A tab list whose selection pill glides between tabs (critically damped spring: it lands without bouncing),
   and a panel that changes with direction: the old content leaves a little toward where the old tab was, the new
   content arrives from the side of the tab you chose, and the panel's height eases from the old content's height
   to the new one's, so whatever sits below glides instead of jumping.
   Adapted from a Radix-based Tabs component, as a small self-contained one for this project (framer-motion only).
   Keyboard: ← → Home End move between tabs (and select them, as in the automatic-activation pattern).
   With "reduce motion" the pill jumps and the panels cross-fade in place. */

const SELECTION = { type: 'spring', visualDuration: 0.34, bounce: 0 }
const SMOOTH = { type: 'spring', visualDuration: 0.4, bounce: 0 }
const ENTER = [0.16, 0.84, 0.3, 1]

const panelMotion = {
  enter: (d) => ({ opacity: 0, x: d * 8 }),
  center: { opacity: 1, x: 0, transition: { opacity: { duration: 0.28, ease: ENTER }, x: SMOOTH } },
  exit: (d) => ({ opacity: 0, x: d * -6, transition: { duration: 0.1 } }),
}
const panelFade = {
  enter: { opacity: 0, x: 0 },
  center: { opacity: 1, x: 0, transition: { duration: 0.1 } },
  exit: { opacity: 0, x: 0, transition: { duration: 0.1 } },
}

function Panel({ id, tabId, direction, reduced, onHeight, children }) {
  const ref = useRef(null)
  const present = useIsPresent()
  useLayoutEffect(() => {
    const node = ref.current
    if (!node || !present) return
    onHeight(node.offsetHeight)
    const ro = new ResizeObserver(() => onHeight(node.offsetHeight))
    ro.observe(node)
    return () => ro.disconnect()
  }, [present, onHeight])
  return (
    <motion.div
      ref={ref}
      id={id}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      className="w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      custom={direction}
      variants={reduced ? panelFade : panelMotion}
      initial="enter"
      animate="center"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

/** tabs: [{ value, label, content }] — controlled with `value` / `onValueChange`. */
export default function Tabs({ tabs, value, onValueChange, label = 'Servicios', className = '' }) {
  const uid = useId()
  const reduced = !!useReducedMotion()
  const [direction, setDirection] = useState(1)
  const [height, setHeight] = useState(null)
  const listRef = useRef(null)
  const refs = useRef([])
  const index = Math.max(0, tabs.findIndex((t) => t.value === value))
  const active = tabs[index]

  const select = (next) => {
    const to = tabs.findIndex((t) => t.value === next)
    if (to < 0 || to === index) return
    setDirection(to > index ? 1 : -1)
    onValueChange(next)
  }

  // Keep the chosen tab in view when the list scrolls (narrow screens)
  useLayoutEffect(() => {
    const el = refs.current[index]
    const list = listRef.current
    if (!el || !list) return
    const left = el.offsetLeft - 16
    const right = el.offsetLeft + el.offsetWidth + 16
    if (left < list.scrollLeft) list.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' })
    else if (right > list.scrollLeft + list.clientWidth) list.scrollTo({ left: right - list.clientWidth, behavior: reduced ? 'auto' : 'smooth' })
  }, [index, reduced])

  const onKeyDown = (e, i) => {
    const target = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : -1
    if (target < 0) return
    e.preventDefault()
    select(tabs[target].value)
    refs.current[target]?.focus()
  }
  const onHeight = useCallback((h) => setHeight((cur) => (cur === h ? cur : h)), [])

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative mx-auto flex gap-1 rounded-full bg-panel-2 p-1">
          {tabs.map((t, i) => {
            const on = i === index
            return (
              <button
                key={t.value}
                ref={(n) => (refs.current[i] = n)}
                id={`${uid}-tab-${t.value}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => select(t.value)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`relative shrink-0 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-6 sm:text-sm ${
                  on ? 'text-ink' : 'text-muted hover:text-fg'
                }`}
              >
                {on && (
                  <motion.span layoutId={`${uid}-selection`} aria-hidden="true" className="absolute inset-0 rounded-full bg-fg" transition={reduced ? { duration: 0 } : SELECTION} />
                )}
                <span className="relative">{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <motion.div
        className="relative mt-8 md:mt-12"
        initial={false}
        animate={height === null ? undefined : { height }}
        transition={reduced ? { duration: 0 } : SMOOTH}
      >
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <Panel key={active.value} id={`${uid}-panel`} tabId={`${uid}-tab-${active.value}`} direction={direction} reduced={reduced} onHeight={onHeight}>
            {active.content}
          </Panel>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
