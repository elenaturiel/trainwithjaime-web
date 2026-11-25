import { Link } from 'react-router-dom'
import { ArrowIcon } from './Icons.jsx'

// Barra amarilla fija arriba (solo en la home): anuncia el entrenamiento HYROX. El menú se baja 36 px para dejarle sitio
// (ver `hasTopBar` en Nav.jsx).
export default function TopBar() {
  return (
    <Link
      to="/entrenamiento-hyrox"
      className="fixed inset-x-0 top-0 z-50 flex h-9 items-center justify-center gap-2 bg-accent px-4 text-xs font-semibold text-on-accent transition-colors hover:bg-[#ffd666] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-on-accent"
    >
      <span className="min-w-0 truncate">
        <strong className="font-extrabold uppercase tracking-wider">Nuevo</strong> · Jaime te entrena también para tu HYROX
      </span>
      <ArrowIcon className="h-3 w-3 shrink-0" />
    </Link>
  )
}
