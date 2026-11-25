import WaveCTA from '../components/WaveCTA.jsx'
import {
  Extras,
  HowWeWork,
  PrepareDay,
  ServiceBlocks,
  ServiciosHero,
  SpecialtiesMarquee,
  SquadBand,
} from '../components/ServiciosSections.jsx'

// /servicios (rediseño minimalista). Cada sección vive en src/components/ServiciosSections.jsx; aquí solo está el orden.
// Textos y precios de los extras: src/data/servicios.js. Las anclas del menú (/servicios#nutricion…) son los ids de los bloques.
// El plan Peak ya no se muestra en esta página.
export default function Servicios() {
  return (
    <>
      <ServiciosHero />
      <SpecialtiesMarquee />
      <ServiceBlocks />
      <HowWeWork />
      <Extras />
      <SquadBand />
      <PrepareDay />
      <WaveCTA />
    </>
  )
}
