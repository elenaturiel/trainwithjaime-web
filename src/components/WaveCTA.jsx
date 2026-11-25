import Button from './Button.jsx'
import { Reveal } from './Reveal.jsx'
import { ArrowIcon } from './Icons.jsx'

// Cada letra es un <span class="lt">; las palabras van en inline-block para no partirse. La ola se hace solo con CSS
// (.wave en index.css): al pasar el ratón la letra crece y se pone amarilla, y sus vecinas crecen menos.
const Word = ({ text }) => (
  <span className="inline-block whitespace-nowrap">
    {[...text].map((c, i) => (
      <span key={i} className="lt">
        {c}
      </span>
    ))}
  </span>
)

// CTA final de las páginas rediseñadas (home y /precios): "Y tú, ¿quieres ganar?" con la ola de letras.
export default function WaveCTA() {
  return (
    <section className="theme-dark bg-panel px-5 py-24 text-center md:px-8 md:py-[160px]">
      <Reveal as="div">
        {/* El h2 lleva el texto completo; las letras sueltas se ocultan al lector de pantalla */}
        <h2
          aria-label="Y tú, ¿quieres ganar?"
          className="wave font-variable text-[clamp(2.75rem,8.9vw,128px)] font-light leading-none tracking-[-0.045em]"
        >
          <span aria-hidden="true">
            <Word text="Y" /> <Word text="tú," />
            <br />
            <span className="ul-draw font-extrabold">
              <Word text="¿quieres" /> <Word text="ganar?" />
            </span>
          </span>
        </h2>
      </Reveal>
      <div className="mt-10 flex justify-center md:mt-12">
        <Button
          to="/contacto"
          className="!min-h-12 !rounded-full !px-7 !py-0 !text-[13px] !font-bold !tracking-[1.2px]"
        >
          Primera asesoría gratis <ArrowIcon className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
