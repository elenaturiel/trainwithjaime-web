import WaveCTA from '../components/WaveCTA.jsx'
import TopBar from '../components/TopBar.jsx'
import { GALLERY } from '../data/galeria.js'
import {
  Accompanied,
  Adapts,
  Coach,
  Faq,
  ForWho,
  Hero,
  HowItWorks,
  HyroxSection,
  PhotoStrip,
  PricingSection,
  Reviews,
  SloganMarquee,
  TestBand,
} from '../components/HomeSections.jsx'

// Home (rediseño minimalista). Cada sección vive en src/components/HomeSections.jsx; aquí solo está el orden.
// Las secciones de la home anterior (SnapText, ScrollExpand, ProgressChart, carrusel…) siguen en el repo pero ya no se usan aquí.

export default function Home() {
  return (
    <>
      <TopBar />
      <Hero />
      <SloganMarquee />
      <Adapts />
      <Accompanied />
      <HyroxSection />
      <PricingSection />
      <ForWho />
      <Coach />
      <TestBand />
      <PhotoStrip photos={GALLERY} />
      <HowItWorks />
      <Reviews />
      <Faq />
      <WaveCTA />
    </>
  )
}
