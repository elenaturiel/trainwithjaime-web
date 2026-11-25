import WaveCTA from '../components/WaveCTA.jsx'
import { Figures, Gallery, GoalBand, HowITrain, HyroxAbout, MyChange, SobreHero, Values } from '../components/SobreJaimeSections.jsx'

// /sobre-jaime (rediseño minimalista). Cada sección vive en src/components/SobreJaimeSections.jsx; aquí solo está el orden.
// Textos: src/data/sobreJaime.js · cifras: COACH_FACTS (HomeSections.jsx) · fechas HYROX: hyroxPlan.js · fotos: galeria.js.
// ⚠️ El texto "No soy un entrenador certificado (aún)…" (src/data/sobreJaime.js) se mantiene tal cual; no cambiar sin avisar a Jaime.
export default function SobreJaime() {
  return (
    <>
      <SobreHero />
      <Figures />
      <HowITrain />
      <Values />
      <HyroxAbout />
      <Gallery />
      <MyChange />
      <GoalBand />
      <WaveCTA />
    </>
  )
}
