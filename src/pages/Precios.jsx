import WaveCTA from '../components/WaveCTA.jsx'
import { CompareTable, Discounts, Plans, PreciosFaq, PreciosHero, TestBand } from '../components/PreciosSections.jsx'

// /precios (rediseño minimalista). Cada sección vive en src/components/PreciosSections.jsx; aquí solo está el orden.
// Planes, precios, prestaciones y tabla salen de src/data/pricing.js. El plan Peak ya no se muestra en esta página.
export default function Precios() {
  return (
    <>
      <PreciosHero />
      <Plans />
      <Discounts />
      <CompareTable />
      <TestBand />
      <PreciosFaq />
      <WaveCTA />
    </>
  )
}
