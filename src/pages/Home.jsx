import WaveCTA from '../components/WaveCTA.jsx'
import TopBar from '../components/TopBar.jsx'
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

// Las 9 fotos de la galería de la home anterior (verticales 3:4). `alt` descriptivo en español.
const GALLERY = [
  { src: '/img-42.jpg', alt: 'Jaime y un amigo sonriendo en un selfie al aire libre' },
  { src: '/img-41.jpg', alt: 'Jaime en el rack de sentadillas del gimnasio' },
  { src: '/img-25.jpg', alt: 'Jaime tomando apuntes en su cuaderno junto a la ventana' },
  { src: '/hyrox-barcelona.jpg', alt: 'Jaime marcando bíceps delante del panel de HYROX Barcelona' },
  { src: '/resultados.jpg', alt: 'Reloj Garmin en la muñeca con una carrera de 10,11 km en 51:29' },
  { src: '/foto-2.jpg', alt: 'Jaime sentado en un cajón de salto, en el gimnasio' },
  { src: '/img-46.jpg', alt: 'Portátil con un documento abierto y un cuaderno con el plan de entrenos' },
  { src: '/hyrox-cartel.jpg', alt: 'Jaime con el cartel “My first HYROX” en HYROX Barcelona' },
  { src: '/hyrox-podio.jpg', alt: 'Jaime sentado en el podio de HYROX Barcelona' },
]

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
