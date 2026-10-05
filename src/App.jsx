import { lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
const Servicios = lazy(() => import('./pages/Servicios.jsx'))
const SobreJaime = lazy(() => import('./pages/SobreJaime.jsx'))
const Precios = lazy(() => import('./pages/Precios.jsx'))
const Contacto = lazy(() => import('./pages/Contacto.jsx'))
const Test = lazy(() => import('./pages/Test.jsx'))
const AvisoLegal = lazy(() => import('./pages/legal/AvisoLegal.jsx'))
const Privacidad = lazy(() => import('./pages/legal/Privacidad.jsx'))
const Cookies = lazy(() => import('./pages/legal/Cookies.jsx'))

// Cada página se descarga cuando se visita (la home va en el paquete principal): la primera carga pesa menos.
// Cuando el navegador queda libre se descargan también las demás, para que al navegar no haya espera.
const PAGES = [
  () => import('./pages/Servicios.jsx'),
  () => import('./pages/Precios.jsx'),
  () => import('./pages/SobreJaime.jsx'),
  () => import('./pages/Contacto.jsx'),
  () => import('./pages/Test.jsx'),
]

export default function App() {
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((f) => setTimeout(f, 2000))
    const id = idle(() => PAGES.forEach((load) => load()))
    return () => (window.cancelIdleCallback ?? clearTimeout)(id)
  }, [])

  // reducedMotion="user": con prefers-reduced-motion activado, Framer Motion
  // desactiva las animaciones de transformación (y, scale…) y deja solo el fade.
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/precios" element={<Precios />} />
          <Route path="/sobre-jaime" element={<SobreJaime />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/test" element={<Test />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}
