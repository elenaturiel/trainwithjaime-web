import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../config.js'
import { Logo } from './Nav.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <Logo className="text-xl" />
        <div className="flex flex-col gap-2 md:flex-row md:gap-8">
          <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-accent">
            {EMAIL}
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
            {INSTAGRAM_HANDLE}
          </a>
        </div>
        <p className="text-muted-2">© {new Date().getFullYear()} Train with Jaime</p>
      </div>
    </footer>
  )
}
