import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopStrip from './TopStrip.jsx'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'
import CursorFollower from './CursorFollower.jsx'

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
    window.scrollTo(0, 0)
  }, [pathname, hash, key])
  return null
}

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <CursorFollower />
      <TopStrip />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
