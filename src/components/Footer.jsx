import { Link } from 'react-router-dom'
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from '../config.js'
import { openCookieSettings } from '../lib/consent.js'
import { Logo } from './Nav.jsx'

const LEGAL_LINKS = [
  { to: '/aviso-legal', label: 'Aviso legal' },
  { to: '/privacidad', label: 'Política de privacidad' },
  { to: '/cookies', label: 'Política de cookies' },
]

export default function Footer() {
  const link = 'transition-colors hover:text-accent'
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <Logo className="text-xl" />
        <div className="flex flex-col gap-2 md:flex-row md:gap-8">
          <a href={`mailto:${EMAIL}`} className={link}>
            {EMAIL}
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={link}>
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={link}>
            {INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs text-muted-2 md:flex-row md:items-center md:justify-between md:px-8">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={link}>
                {l.label}
              </Link>
            ))}
            <button type="button" onClick={openCookieSettings} className={link}>
              Configurar cookies
            </button>
          </nav>
          <p>© {new Date().getFullYear()} Train with Jaime</p>
        </div>
      </div>
    </footer>
  )
}
