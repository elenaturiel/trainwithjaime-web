import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import PricingCards from '../components/Pricing.jsx'
import PlanComparison from '../components/PlanComparison.jsx'
import { Reveal } from '../components/Reveal.jsx'

export default function Precios() {
  return (
    <>
      <ScrollSection effect="stack" first dark>
        <PageHero title="Precios">Elige el plan que encaja contigo. La primera asesoría con Jaime es gratis.</PageHero>
      </ScrollSection>

      <ScrollSection effect="clip">
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <PricingCards />
          </div>
        </section>
      </ScrollSection>

      <ScrollSection effect="parallax" last dark>
        <section className="overflow-x-clip bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal as="div" className="mb-10">
              <SectionHeading title="Compara los planes" />
            </Reveal>
            <PlanComparison />
          </div>
        </section>
      </ScrollSection>
    </>
  )
}
