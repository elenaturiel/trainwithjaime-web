import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../config.js'
import { CUANDO, NIVEL } from '../data/hyrox.js'
import { saveLead, track, ubFromSearch } from '../lib/hyrox.js'
import { ArrowIcon, CheckIcon } from '../components/Icons.jsx'

// Lista de espera del plan HYROX: 3 preguntas, una por pantalla. Cada paso se guarda al momento (HyroxLead), así que
// también quedan las respuestas de quien no llega al email. Las preguntas y respuestas están en src/data/hyrox.js.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EASE = [0.16, 0.84, 0.3, 1]

function Option({ children, selected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-5 text-left text-lg font-semibold transition-[border-color,background-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-safe:active:scale-[0.99] md:px-6 md:text-xl ${
        selected ? 'border-accent bg-accent/15 text-fg' : 'border-line bg-panel text-fg hover:border-brand/60 hover:bg-panel-2'
      }`}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
          selected ? 'border-accent bg-accent text-on-accent' : 'border-line text-transparent group-hover:border-brand/60'
        }`}
      >
        <CheckIcon className="h-4 w-4" />
      </span>
    </button>
  )
}

export default function Hyrox() {
  const { search } = useLocation()
  const ub = ubFromSearch(search)
  const reduced = !!useReducedMotion()
  const [step, setStep] = useState(1) // 1, 2, 3 y 4 = pantalla final
  const [dir, setDir] = useState(1)
  const [nivel, setNivel] = useState('')
  const [cuando, setCuando] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // campo trampa para bots
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const heading = useRef(null)
  const viewed = useRef(false)

  // Vista de /hyrox (una vez por visita, aunque React monte dos veces en desarrollo)
  useEffect(() => {
    if (viewed.current) return
    viewed.current = true
    track('vista', ub)
  }, [ub])

  // Título de la pestaña mientras se está en el formulario
  useEffect(() => {
    const prev = document.title
    document.title = 'HYROX · Train with Jaime'
    return () => (document.title = prev)
  }, [])

  // Al cambiar de pantalla, el foco va al título (lectores de pantalla y teclado)
  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
  }, [step])

  const go = (n) => {
    setDir(n > step ? 1 : -1)
    setStep(n)
    setError('')
  }

  const pickNivel = (value) => {
    setNivel(value)
    saveLead({ nivel: value }, ub)
    track('paso1', ub)
    setTimeout(() => go(2), reduced ? 0 : 220)
  }
  const pickCuando = (value) => {
    setCuando(value)
    saveLead({ cuando: value }, ub)
    track('paso2', ub)
    setTimeout(() => go(3), reduced ? 0 : 220)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (sending) return
    if (!EMAIL_RE.test(email.trim())) return setError('Ese email no cuadra. Revísalo, anda.')
    if (!consent) return setError('Necesitamos que marques la casilla para poder escribirte.')
    setSending(true)
    setError('')
    const ok = await saveLead({ email: email.trim(), consentimiento: true, website }, ub)
    setSending(false)
    if (!ok) return setError('Algo ha fallado al guardarlo. Prueba otra vez, o escríbenos por Instagram.')
    track('envio', ub)
    go(4)
  }

  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: dir * 32 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
        exit: { opacity: 0, x: dir * -32, transition: { duration: 0.18 } },
      }

  const titleCls = 'font-display text-4xl font-bold leading-[1.05] outline-none md:text-6xl'
  const done = step === 4

  return (
    <div className="theme-dark relative min-h-svh overflow-hidden bg-ink pb-24 pt-36 md:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,201,60,0.14),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-2xl px-5 md:px-8">
        {!done && (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-ink">HYROX · sin postureo</p>
            <h1 className="mt-4 font-display text-2xl font-semibold leading-tight text-fg-2 md:text-3xl">
              Tu primer HYROX, sin hacerte el héroe.
            </h1>
            <p className="mt-3 text-base text-muted md:text-lg">
              Tres preguntas y te avisamos cuando esté el plan HYROX de Jaime. Sin spam, sin “rise and grind”.
            </p>

            {/* Progreso */}
            <div className="mt-10">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                <span aria-live="polite">Paso {step} de 3</span>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => go(step - 1)}
                    className="inline-flex items-center gap-1.5 rounded text-fg-2 transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  >
                    <ArrowIcon className="h-3.5 w-3.5 rotate-180" /> Atrás
                  </button>
                )}
              </div>
              <div
                role="progressbar"
                aria-label="Progreso del formulario"
                aria-valuemin={1}
                aria-valuemax={3}
                aria-valuenow={step}
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-fg/15"
              >
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={false}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={reduced ? { duration: 0 } : { type: 'spring', visualDuration: 0.4, bounce: 0 }}
                />
              </div>
            </div>
          </>
        )}

        <div className={done ? '' : 'mt-10'}>
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.section key="s1" {...slide} aria-labelledby="hy-t1">
                <h2 id="hy-t1" ref={heading} tabIndex={-1} className={titleCls}>
                  {NIVEL.title}
                </h2>
                <div className="mt-8 grid gap-3" role="group" aria-labelledby="hy-t1">
                  {NIVEL.options.map((o) => (
                    <Option key={o.value} selected={nivel === o.value} onClick={() => pickNivel(o.value)}>
                      {o.label}
                    </Option>
                  ))}
                </div>
              </motion.section>
            )}

            {step === 2 && (
              <motion.section key="s2" {...slide} aria-labelledby="hy-t2">
                <h2 id="hy-t2" ref={heading} tabIndex={-1} className={titleCls}>
                  {CUANDO.title}
                </h2>
                <div className="mt-8 grid gap-3" role="group" aria-labelledby="hy-t2">
                  {CUANDO.options.map((o) => (
                    <Option key={o.value} selected={cuando === o.value} onClick={() => pickCuando(o.value)}>
                      {o.label}
                    </Option>
                  ))}
                </div>
              </motion.section>
            )}

            {step === 3 && (
              <motion.section key="s3" {...slide} aria-labelledby="hy-t3">
                <h2 id="hy-t3" ref={heading} tabIndex={-1} className={titleCls}>
                  ¿Dónde te avisamos?
                </h2>
                <p className="mt-3 text-base text-muted md:text-lg">Un email, y nada más. Lo prometemos (y Jaime es de fiar).</p>
                <form onSubmit={submit} noValidate className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="hy-email" className="block text-sm font-semibold text-fg-2">
                      Tu email
                    </label>
                    <input
                      id="hy-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!error && !EMAIL_RE.test(email.trim())}
                      aria-describedby={error ? 'hy-error' : undefined}
                      placeholder="tu@email.com"
                      className="mt-2 w-full rounded-xl border border-line bg-panel px-4 py-4 text-lg text-fg placeholder:text-muted-2 focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    />
                  </div>

                  {/* Campo trampa: las personas no lo ven; los bots lo rellenan y se ignoran */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      No rellenar
                      <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </label>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-fg-2">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-[#FFC93C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    />
                    <span>
                      Acepto que me escribáis solo sobre el plan HYROX. Más info en la{' '}
                      <Link to="/privacidad" target="_blank" className="font-semibold text-brand underline underline-offset-4">
                        política de privacidad
                      </Link>
                      .
                    </span>
                  </label>

                  <p id="hy-error" role="alert" className="min-h-5 text-sm font-semibold text-accent-ink">
                    {error}
                  </p>

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-wider text-on-accent transition-colors duration-150 hover:bg-[#ffd666] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? 'Guardando…' : 'Avisadme'} {!sending && <ArrowIcon className="h-4 w-4" />}
                  </button>
                </form>
              </motion.section>
            )}

            {done && (
              <motion.section key="done" {...slide} aria-labelledby="hy-done" className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-on-accent">
                  <CheckIcon className="h-8 w-8" />
                </span>
                <h2 id="hy-done" ref={heading} tabIndex={-1} className="mt-8 font-display text-6xl font-bold leading-none outline-none md:text-8xl">
                  Apuntado.
                </h2>
                <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-fg-2 md:text-xl">
                  Estamos preparando el plan HYROX de Jaime. Te escribimos antes que a nadie.
                </p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 text-lg font-semibold text-brand underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  {INSTAGRAM_HANDLE} <ArrowIcon className="h-4 w-4" />
                </a>
                <p className="mt-16 font-display text-3xl leading-tight md:text-5xl">
                  ¿Y tú, <span className="font-bold">quieres ganar?</span>
                </p>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {!done && (
          <p className="mt-16 text-center font-display text-xl text-muted md:text-2xl">
            ¿Y tú, <span className="font-semibold text-fg-2">quieres ganar?</span>
          </p>
        )}
      </div>
    </div>
  )
}
