import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Servicios from './pages/Servicios.jsx'
import SobreJaime from './pages/SobreJaime.jsx'
import Contacto from './pages/Contacto.jsx'
import Test from './pages/Test.jsx'
import AvisoLegal from './pages/legal/AvisoLegal.jsx'
import Privacidad from './pages/legal/Privacidad.jsx'
import Cookies from './pages/legal/Cookies.jsx'

export default function App() {
  // reducedMotion="user": con prefers-reduced-motion activado, Framer Motion
  // desactiva las animaciones de transformación (y, scale…) y deja solo el fade.
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
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
