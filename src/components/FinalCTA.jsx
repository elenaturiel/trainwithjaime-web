import '@fontsource-variable/outfit/wght.css'
import VariableProximity from './VariableProximity.jsx'
import Button from './Button.jsx'
import { Reveal } from './Reveal.jsx'
import { ArrowIcon } from './Icons.jsx'

// Cierre común de todas las páginas: banda azul marino con degradado, titular en dos líneas y el botón principal.
// El titular escala con el ancho de pantalla (en vez de saltos por breakpoint) y no se parte en más líneas.
export default function FinalCTA() {
  return (
    <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden bg-panel py-32 md:min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(61,139,255,0.22),transparent_60%)]"
      />
      <Reveal as="div" className="relative mx-auto w-full max-w-7xl px-5 text-center md:px-8">
        {/* Cada letra engorda según lo cerca que pase el cursor (o el dedo): fuente variable de Outfit */}
        <h2 aria-label="Y tú, ¿quieres ganar?" className="font-variable text-[clamp(2.5rem,9vw,8rem)] leading-[1.04]">
          <VariableProximity
            as="span"
            label="Y tú,"
            className="block"
            fromFontVariationSettings="'wght' 300"
            toFontVariationSettings="'wght' 800"
            radius={220}
            falloff="linear"
          />
          <VariableProximity
            as="span"
            label="¿quieres ganar?"
            className="block whitespace-nowrap"
            fromFontVariationSettings="'wght' 650"
            toFontVariationSettings="'wght' 900"
            radius={220}
            falloff="linear"
          />
        </h2>
        <div className="mt-10 flex justify-center md:mt-14">
          <Button to="/contacto">
            Primera asesoría gratis <ArrowIcon className="h-4 w-4" />
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
