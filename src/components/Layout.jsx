import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopStrip from './TopStrip.jsx'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'
import CookieBanner from './CookieBanner.jsx'

// Sube arriba al cambiar de ruta, o salta a la #ancla si la URL la trae (p. ej. /#precios).
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      // Espera a que la página nueva pinte antes de buscar el ancla.
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
      return () => clearTimeout(t)
    }
    // instantáneo: con scroll-behavior: smooth en el CSS, scrollTo(0, 0) a secas haría un barrido lento hasta arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, key])
  return null
}

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <TopStrip />
      <Nav />
      <main>
        <Suspense fallback={<div className="min-h-svh bg-ink" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
