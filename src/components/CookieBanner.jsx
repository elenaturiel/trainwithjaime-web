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
    'rounded-lg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:py-3'
  const link = 'font-semibold text-fg underline underline-offset-4 hover:text-accent-ink'

  return (
    <>
      {consent?.analytics && <Analytics />}
      <AnimatePresence>
        {open && (
          // Barra fija abajo, a todo el ancho: ocupa solo su alto y no bloquea ni el scroll ni los clics de lo de encima
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookies-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-[80] max-h-[70svh] overflow-y-auto border-t border-line bg-ink shadow-[0_-8px_28px_rgba(4,16,55,0.18)] pb-[env(safe-area-inset-bottom)]"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:gap-y-4 md:px-8 md:py-4">
              <p className="text-[13px] leading-snug text-fg-2 md:min-w-[22rem] md:flex-1 md:text-sm md:leading-relaxed">
                <strong id="cookies-title" className="font-display text-base font-semibold text-fg md:text-lg">
                  Cookies, sin postureo.
                </strong>{' '}
                {/* móvil: versión corta · escritorio: el texto completo */}
                <span className="md:hidden">Solo si aceptas, usamos una analítica de visitas anónima. </span>
                <span className="hidden md:inline">
                  Usamos almacenamiento técnico para que la web funcione y, solo si aceptas, una analítica de visitas
                  anónima (Vercel Web Analytics, sin cookies publicitarias). Puedes cambiar de idea cuando quieras desde
                  "Configurar cookies" en el pie de página.{' '}
                </span>
                <Link to="/cookies" className={link}>
                  Política de cookies
                </Link>
                {!custom && (
                  <>
                    <span className="md:hidden" aria-hidden="true">
                      {' · '}
                    </span>
                    <button type="button" onClick={() => setCustom(true)} className={`${link} md:hidden`}>
                      Configurar
                    </button>
                  </>
                )}
              </p>

              {custom && (
                <ul className="divide-y divide-line rounded-xl border border-line bg-ink/60 md:basis-full md:grid md:grid-cols-2 md:divide-x md:divide-y-0">
                  <li className="flex items-center justify-between gap-4 p-3 md:p-4">
                    <div>
                      <p className="text-sm font-semibold text-fg">Técnicas (necesarias)</p>
                      <p className="text-xs text-muted">Guardan tu elección de cookies. Siempre activas.</p>
                    </div>
                    <Toggle checked disabled label="Cookies técnicas" />
                  </li>
                  <li className="flex items-center justify-between gap-4 p-3 md:p-4">
                    <div>
                      <p className="text-sm font-semibold text-fg">Analítica</p>
                      <p className="text-xs text-muted">Estadísticas de visitas anónimas y agregadas.</p>
                    </div>
                    <Toggle checked={analytics} onChange={setAnalytics} label="Cookies de analítica" />
                  </li>
                </ul>
              )}

              {custom ? (
                <button
                  type="button"
                  onClick={() => save(analytics)}
                  className={`${btn} bg-accent text-on-accent hover:bg-[#ffd666] md:ml-auto`}
                >
                  Guardar preferencias
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 md:ml-auto md:flex md:items-center md:gap-3">
                  {/* en escritorio, "Configurar" es un enlace de texto junto a los botones (en móvil va en la línea de arriba) */}
                  <button
                    type="button"
                    onClick={() => setCustom(true)}
                    className="hidden px-2 py-3 text-xs font-semibold uppercase tracking-wider text-fg-2 underline-offset-4 hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:inline-block"
                  >
                    Configurar
                  </button>
                  {/* Rechazar y aceptar con el mismo tamaño y peso, como pide la AEPD */}
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
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
