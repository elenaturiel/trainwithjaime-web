import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FoldText from '../components/FoldText.jsx'
import PageHero from '../components/PageHero.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import FinalCTA from '../components/FinalCTA.jsx'
import ReviewCard, { ChangeCard } from '../components/ReviewCard.jsx'
import { Stars, StarPicker } from '../components/Stars.jsx'
import { CheckIcon } from '../components/Icons.jsx'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx'
import { useReviews } from '../lib/resenas.js'

const inputCls =
  'w-full rounded-lg border border-line bg-ink px-4 py-3.5 text-fg placeholder:text-muted-2 transition-colors duration-150 hover:border-muted-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
const labelCls = 'mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-fg-2'

function ReviewForm() {
  const [stars, setStars] = useState(0)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const [count, setCount] = useState(0)
  const opened = useRef(Date.now())
  const successRef = useRef(null)

  useEffect(() => {
    if (status === 'sent') successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [status])

  async function submit(e) {
    e.preventDefault()
    if (status === 'sending') return
    if (!stars) {
      setError('Elige una valoración de 1 a 5 estrellas.')
      setStatus('error')
      return
    }
    // Rellenarlo en menos de 4 s no lo hace una persona: se finge éxito sin guardar nada
    if (Date.now() - opened.current < 4000) {
      setStatus('sent')
      return
    }
    const f = new FormData(e.currentTarget)
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: f.get('nombre'),
          detalle: f.get('detalle'),
          texto: f.get('texto'),
          estrellas: stars,
          consentimiento: f.get('consentimiento') === 'on',
          website: f.get('website'),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se ha podido enviar. Inténtalo de nuevo en un rato.')
      setStatus('sent')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div
        ref={successRef}
        role="status"
        className="rounded-2xl border border-brand/40 bg-panel p-8 md:p-12"
      >
        <p className="font-display text-6xl leading-none text-brand">✓</p>
        <h3 className="mt-6 font-display text-4xl leading-none md:text-5xl">¡Gracias por tu reseña!</h3>
        <p className="mt-4 max-w-xl text-base text-fg-2 md:text-lg">
          Jaime la lee antes de publicarla, así que puede tardar un poco en aparecer.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-panel p-6 md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="rs-nombre" className={labelCls}>
            Nombre
          </label>
          <input
            id="rs-nombre"
            name="nombre"
            type="text"
            required
            minLength={2}
            maxLength={40}
            autoComplete="given-name"
            placeholder="Nombre y una inicial"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="rs-detalle" className={labelCls}>
            Tu plan o tu reto <span className="font-normal normal-case tracking-normal text-muted">(opcional)</span>
          </label>
          <input
            id="rs-detalle"
            name="detalle"
            type="text"
            maxLength={60}
            placeholder="Ej.: Plan All In · mi primer 10K"
            className={inputCls}
          />
        </div>
        <div className="md:col-span-2">
          <span className={labelCls}>Valoración</span>
          <StarPicker value={stars} onChange={setStars} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="rs-texto" className={labelCls}>
            Tu reseña
          </label>
          <textarea
            id="rs-texto"
            name="texto"
            rows={5}
            required
            minLength={20}
            maxLength={600}
            onChange={(e) => setCount(e.target.value.length)}
            placeholder="¿Cómo ha sido entrenar con Jaime? ¿Qué ha cambiado en ti?"
            className={`${inputCls} resize-y`}
          />
          <p className="mt-1.5 text-right text-xs text-muted-2">{count}/600</p>
        </div>
      </div>

      {/* Campo trampa para bots: las personas no lo ven */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input type="checkbox" name="consentimiento" required className="peer sr-only" />
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-muted-2 bg-ink text-transparent transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-user-invalid:border-red-500"
        >
          <CheckIcon className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm text-fg-2">
          Acepto que Train with Jaime publique mi reseña con el nombre que he puesto, y he leído la{' '}
          <Link to="/privacidad" target="_blank" className="font-semibold text-fg underline underline-offset-4 hover:text-accent-ink">
            política de privacidad
          </Link>
          .
        </span>
      </label>
      <p className="mt-3 text-xs leading-relaxed text-muted-2">
        Responsable: Train with Jaime. Finalidad: publicar tu reseña en esta web, tras revisarla. Puedes pedir que la
        quitemos cuando quieras escribiendo a Jaime.
      </p>

      {status === 'error' && (
        <p role="alert" className="mt-6 rounded-xl border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm font-semibold text-fg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-on-accent transition-colors hover:bg-[#ffd666] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' ? 'Enviando…' : 'Enviar reseña'}
      </button>
    </form>
  )
}

export default function Resenas() {
  const { data, loading } = useReviews()
  const resenas = data?.resenas ?? []
  const cambios = data?.cambios ?? []

  return (
    <>
      <ScrollSection effect="stack" first dark>
        <PageHero
          center
          title={
            <FoldText
              text="Reseñas"
              splitBy="char"
              hinge="top"
              trigger="mount"
              duration={0.65}
              stagger={0.045}
              ease="power3.out"
              perspective={700}
              creaseShading={0.55}
              className="block"
            />
          }
        >
          Lo que dicen nuestros clientes: sus cambios y sus palabras, sin filtros.
        </PageHero>
      </ScrollSection>

      {cambios.length > 0 && (
        <ScrollSection effect="zoom">
          <section className="bg-ink py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-5 md:px-8">
              <Reveal as="div" className="mb-12 md:mb-16">
                <SectionHeading title="Cambios reales" />
                <p className="mt-4 max-w-xl text-base text-fg-2 md:text-lg">
                  Personas de verdad, con su permiso. Cada una tiene su punto de partida y su ritmo.
                </p>
              </Reveal>
              <Stagger className="grid justify-center gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),23rem))]">
                {cambios.map((c) => (
                  <StaggerItem key={c.id}>
                    <ChangeCard c={c} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>
        </ScrollSection>
      )}

      <ScrollSection effect="clip" blue>
        <section className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal as="div" className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
              <SectionHeading title="Lo que dicen" />
              {data?.total > 0 && (
                <p className="flex items-center gap-3 text-fg-2">
                  <Stars value={data.media} className="h-6 w-6" />
                  <span className="text-lg font-semibold text-fg">{String(data.media).replace('.', ',')}</span>
                  <span className="text-sm">
                    · {data.total} {data.total === 1 ? 'reseña' : 'reseñas'}
                  </span>
                </p>
              )}
            </Reveal>

            {resenas.length > 0 ? (
              <Stagger className="grid justify-center gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),25rem))]">
                {resenas.map((r) => (
                  <StaggerItem key={r.id}>
                    <ReviewCard r={r} />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              !loading && (
                <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-lg text-fg-2">
                  Aún no hay reseñas publicadas. ¿Quieres ser la primera persona en contar su experiencia?
                </p>
              )
            )}
          </div>
        </section>
      </ScrollSection>

      <ScrollSection effect="parallax">
        <section id="escribir" className="bg-ink py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <Reveal as="div" className="mb-10">
              <SectionHeading title="Cuéntanos tu experiencia" />
              <p className="mt-4 text-base text-fg-2 md:text-lg">
                Si has entrenado con Jaime, tu opinión ayuda a otras personas a decidirse. La revisamos antes de publicarla.
              </p>
            </Reveal>
            <ReviewForm />
          </div>
        </section>
      </ScrollSection>

      <ScrollSection effect="parallax" bg="bg-panel" last dark>
        <FinalCTA />
      </ScrollSection>
    </>
  )
}
