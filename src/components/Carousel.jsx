import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { ArrowIcon } from './Icons.jsx'

const COPIES = 3 // la lista se repite 3 veces; siempre nos quedamos en la del medio

// Carrusel infinito de fotos: la foto activa va centrada con las vecinas asomando a los lados, y después de la
// última vuelve a salir la primera sin cortes (nunca acaba). Pasa solo cada `interval` ms; se detiene mientras el
// ratón está encima, se toca/arrastra o se navega con el teclado, cuando no se ve en pantalla y si el usuario pulsa
// pausa (y no arranca con "reducir movimiento"). Se puede arrastrar con el dedo o el ratón, o usar las flechas.
export default function Carousel({ items, label = 'Galería', interval = 4500 }) {
  const n = items.length
  const all = Array.from({ length: COPIES }, (_, c) => items.map((it, i) => ({ ...it, c, i }))).flat()

  const rootRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const touchTimer = useRef(0)
  const anim = useRef(null)
  const metrics = useRef({ step: 0, offset: 0 })
  const x = useMotionValue(0)
  const pos = useRef(n) // posición global (0 … 3n-1) de la foto activa
  const [p, setP] = useState(n)
  const [ready, setReady] = useState(0) // se incrementa al medir, para recolocar

  const reduce = useReducedMotion()
  const [userPaused, setUserPaused] = useState(false)
  const [hover, setHover] = useState(false)
  const [focusKb, setFocusKb] = useState(false)
  const [touching, setTouching] = useState(false)
  const [visible, setVisible] = useState(false)
  const autoplay = !reduce && !userPaused
  const running = autoplay && visible && !hover && !focusKb && !touching

  const target = (g) => metrics.current.offset - g * metrics.current.step

  // Mide una foto y el hueco entre fotos; la activa se centra en el visor
  const measure = useCallback(() => {
    const vp = viewportRef.current
    const slides = trackRef.current?.children
    if (!vp || !slides || slides.length < 2) return
    metrics.current = {
      step: slides[1].offsetLeft - slides[0].offsetLeft,
      offset: (vp.clientWidth - slides[0].offsetWidth) / 2,
    }
    setReady((r) => r + 1)
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(viewportRef.current)
    return () => ro.disconnect()
  }, [measure])

  // Recoloca sin animar cuando cambian las medidas (carga, giro de pantalla…)
  useLayoutEffect(() => {
    x.set(target(pos.current))
  }, [ready, x])

  // Si la posición se sale de la copia del medio, salta a la equivalente (se ve igual: las copias son idénticas)
  const settle = useCallback(() => {
    const cur = pos.current
    if (cur >= n && cur < 2 * n) return
    const np = (((cur % n) + n) % n) + n
    x.set(x.get() - (np - cur) * metrics.current.step)
    pos.current = np
    setP(np)
  }, [n, x])

  // Se mueve en relativo (+1 siguiente, -1 anterior, 0 vuelve a encajar)
  const moveBy = useCallback(
    (delta, instant = false) => {
      anim.current?.stop()
      settle() // por si se pulsa muy rápido mientras aún se está animando
      const dest = pos.current + delta
      pos.current = dest
      setP(dest)
      if (instant || reduce) {
        x.set(target(dest))
        settle()
        return
      }
      anim.current = animate(x, target(dest), {
        type: 'tween',
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        onComplete: settle,
      })
    },
    [reduce, settle, x],
  )
  const go = useCallback((dir) => moveBy(dir), [moveBy])

  // Solo avanza solo mientras el carrusel está a la vista
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => () => clearTimeout(touchTimer.current), [])

  // Ratón encima = pausa. Se comprueba en cada movimiento en vez de con "entra/sale": al pulsar un botón se
  // sustituye su icono y el navegador no avisa de que el ratón salió, y el pase se quedaba parado para siempre.
  useEffect(() => {
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      setHover(rootRef.current?.contains(e.target) ?? false)
    }
    const leave = () => setHover(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [])

  // Al tocar o arrastrar se pausa; se reanuda un momento después de soltar
  const touchStart = () => {
    clearTimeout(touchTimer.current)
    setTouching(true)
  }
  const touchEnd = () => {
    clearTimeout(touchTimer.current)
    touchTimer.current = setTimeout(() => setTouching(false), 2500)
  }

  const onDragEnd = (_, info) => {
    const { step } = metrics.current
    const dir =
      info.offset.x < -step * 0.18 || info.velocity.x < -450
        ? 1
        : info.offset.x > step * 0.18 || info.velocity.x > 450
          ? -1
          : 0
    moveBy(dir)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') (e.preventDefault(), go(1))
    if (e.key === 'ArrowLeft') (e.preventDefault(), go(-1))
  }

  const current = ((p % n) + n) % n
  const arrow =
    'flex h-12 w-12 items-center justify-center rounded-full border border-fg/20 text-fg transition-[border-color,background-color,transform] duration-150 hover:border-fg hover:bg-fg hover:text-ink motion-safe:hover:scale-105'

  return (
    <div
      ref={rootRef}
      aria-roledescription="carrusel"
      aria-label={label}
      // táctil o lápiz: pausa mientras se toca/arrastra (con ratón ya pausa el hover)
      onPointerDown={(e) => e.pointerType !== 'mouse' && touchStart()}
      onPointerUp={(e) => e.pointerType !== 'mouse' && touchEnd()}
      onPointerCancel={(e) => e.pointerType !== 'mouse' && touchEnd()}
      onFocus={(e) => setFocusKb(e.target.matches(':focus-visible'))}
      onBlur={() => setFocusKb(false)}
    >
      <div
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <motion.div
          ref={trackRef}
          style={{ x, touchAction: 'pan-y' }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.1}
          dragConstraints={{ left: -1e6, right: 1e6 }}
          onDragStart={() => anim.current?.stop()}
          onDragEnd={onDragEnd}
          className="flex cursor-grab gap-4 will-change-transform active:cursor-grabbing md:gap-6"
        >
          {all.map((it, g) => {
            const active = g === p
            const original = it.c === 1 // las copias de los lados no se leen dos veces con un lector de pantalla
            return (
              <figure
                key={`${it.c}-${it.i}`}
                role="group"
                aria-roledescription="foto"
                aria-label={`${it.i + 1} de ${n}`}
                aria-hidden={original ? undefined : true}
                className="group relative shrink-0 basis-[86%] select-none overflow-hidden rounded-2xl bg-panel md:basis-[72%]"
              >
                <img
                  src={it.src}
                  alt={original ? it.alt : ''}
                  loading={original ? 'eager' : 'lazy'}
                  draggable={false}
                  className={`aspect-[4/5] w-full object-cover transition-[transform,opacity] duration-500 sm:aspect-[16/10] motion-safe:group-hover:scale-[1.03] ${
                    active ? 'opacity-100' : 'opacity-60'
                  }`}
                />
                {it.title && (
                  <figcaption className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#041037]/70 to-transparent p-6 pb-16 md:p-8 md:pb-24">
                    <span className="block max-w-md font-display text-3xl leading-[1.02] text-white md:text-5xl">
                      {it.title}
                    </span>
                  </figcaption>
                )}
              </figure>
            )
          })}
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Elegir foto">
          {items.map((it, i) => {
            const active = i === current
            return (
              <button
                key={it.src}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Ir a la foto ${i + 1}`}
                onClick={() => moveBy(i - current)}
                className={`relative h-2 overflow-hidden rounded-full bg-fg/25 transition-all duration-300 hover:bg-fg/50 ${
                  active ? 'w-12' : 'w-2'
                }`}
              >
                {active && (
                  // key={p}: la barra se reinicia en cada foto; al llenarse, pasa a la siguiente
                  <span
                    key={p}
                    className="absolute inset-0 origin-left bg-fg"
                    style={
                      autoplay
                        ? {
                            animation: `dot-fill ${interval}ms linear forwards`,
                            animationPlayState: running ? 'running' : 'paused',
                          }
                        : undefined
                    }
                    onAnimationEnd={autoplay ? () => go(1) : undefined}
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex gap-3">
          {!reduce && (
            <button
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              aria-pressed={userPaused}
              aria-label={userPaused ? 'Reanudar el pase automático' : 'Pausar el pase automático'}
              className={arrow}
            >
              {userPaused ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              )}
            </button>
          )}
          <button type="button" onClick={() => go(-1)} aria-label="Foto anterior" className={arrow}>
            <ArrowIcon className="h-5 w-5 rotate-180" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Foto siguiente" className={arrow}>
            <ArrowIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
