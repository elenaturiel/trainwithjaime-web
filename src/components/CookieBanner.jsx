import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import { getConsent, onConsentChange, onOpenCookieSettings, setConsent } from '../lib/consent.js'

function Toggle({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? 'bg-accent' : 'bg-line'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-150 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

// Aviso de cookies al entrar + carga de la analítica de Vercel solo si el usuario la acepta.
export default function CookieBanner() {
  const [consent, setConsentState] = useState(() => getConsent())
  const [open, setOpen] = useState(() => !getConsent())
  const [custom, setCustom] = useState(false)
  const [analytics, setAnalytics] = useState(() => getConsent()?.analytics ?? false)

  useEffect(() => onConsentChange(setConsentState), [])
  useEffect(
    () =>
      onOpenCookieSettings(() => {
        setAnalytics(getConsent()?.analytics ?? false)
        setCustom(true)
        setOpen(true)
      }),
    [],
  )

  const save = (value) => {
    setConsent({ analytics: value })
    setOpen(false)
    setCustom(false)
  }

  const btn =
    'rounded-lg px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

  return (
    <>
      {consent?.analytics && <Analytics />}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookies-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-2xl border border-line bg-panel-2/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur md:bottom-6 md:p-7"
          >
            <h2 id="cookies-title" className="font-display text-3xl uppercase leading-none">
              Cookies, sin postureo
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">
              Usamos almacenamiento técnico para que la web funcione y, solo si aceptas, una analítica de visitas
              anónima (Vercel Web Analytics, sin cookies publicitarias) para saber qué páginas se ven más. Puedes
              cambiar de idea cuando quieras desde "Configurar cookies" en el pie de página.{' '}
              <Link to="/cookies" className="font-semibold text-fg underline underline-offset-4 hover:text-accent">
                Política de cookies
              </Link>
            </p>

            {custom && (
              <ul className="mt-5 divide-y divide-line rounded-xl border border-line bg-ink/60">
                <li className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-semibold text-fg">Técnicas (necesarias)</p>
                    <p className="text-xs text-muted">Guardan tu elección de cookies. Siempre activas.</p>
                  </div>
                  <Toggle checked disabled label="Cookies técnicas" />
                </li>
                <li className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-semibold text-fg">Analítica</p>
                    <p className="text-xs text-muted">Estadísticas de visitas anónimas y agregadas.</p>
                  </div>
                  <Toggle checked={analytics} onChange={setAnalytics} label="Cookies de analítica" />
                </li>
              </ul>
            )}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              {custom ? (
                <button
                  type="button"
                  onClick={() => save(analytics)}
                  className={`${btn} bg-accent text-ink hover:bg-[#ffd666]`}
                >
                  Guardar preferencias
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setCustom(true)}
                    className={`${btn} text-fg-2 underline-offset-4 hover:text-fg hover:underline`}
                  >
                    Configurar
                  </button>
                  {/* Rechazar y aceptar con el mismo peso visual, como pide la AEPD */}
                  <button
                    type="button"
                    onClick={() => save(false)}
                    className={`${btn} border border-white/25 text-fg hover:border-white/60 hover:bg-white/5`}
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    onClick={() => save(true)}
                    className={`${btn} bg-accent text-ink hover:bg-[#ffd666]`}
                  >
                    Aceptar
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
