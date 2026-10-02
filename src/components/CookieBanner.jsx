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
            className="fixed inset-x-2 bottom-2 z-[80] mx-auto max-w-3xl rounded-2xl border border-line bg-ink p-4 shadow-[0_12px_32px_rgba(4,16,55,0.22)] sm:inset-x-3 sm:bottom-3 sm:p-5 md:bottom-6 md:left-auto md:right-6 md:max-w-lg md:p-6"
          >
            <h2 id="cookies-title" className="font-display text-xl leading-none sm:text-3xl">
              Cookies, sin postureo
            </h2>
            {/* En móvil, versión corta para no tapar el hero; el texto completo, en pantallas grandes */}
            <p className="mt-2 text-sm leading-snug text-fg-2 sm:mt-3 sm:leading-relaxed">
              <span className="sm:hidden">Solo si aceptas, usamos una analítica de visitas anónima. </span>
              <span className="hidden sm:inline">
                Usamos almacenamiento técnico para que la web funcione y, solo si aceptas, una analítica de visitas
                anónima (Vercel Web Analytics, sin cookies publicitarias) para saber qué páginas se ven más. Puedes
                cambiar de idea cuando quieras desde "Configurar cookies" en el pie de página.{' '}
              </span>
              <Link to="/cookies" className="font-semibold text-fg underline underline-offset-4 hover:text-accent-ink">
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

            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:justify-end">
              {custom ? (
                <button
                  type="button"
                  onClick={() => save(analytics)}
                  className={`${btn} col-span-2 bg-accent text-on-accent hover:bg-[#ffd666]`}
                >
                  Guardar preferencias
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setCustom(true)}
                    className={`${btn} order-last col-span-2 py-1 text-fg-2 underline-offset-4 hover:text-fg hover:underline sm:order-none sm:py-3`}
                  >
                    Configurar
                  </button>
                  {/* Rechazar y aceptar con el mismo peso visual, como pide la AEPD */}
                  <button
                    type="button"
                    onClick={() => save(false)}
                    className={`${btn} border border-fg/25 text-fg hover:border-fg/60 hover:bg-fg/5`}
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    onClick={() => save(true)}
                    className={`${btn} bg-accent text-on-accent hover:bg-[#ffd666]`}
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
