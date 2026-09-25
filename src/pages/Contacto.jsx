import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import Button from '../components/Button.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { InstagramIcon, MailIcon, PlusIcon, WhatsAppIcon } from '../components/Icons.jsx'
import {
  EMAIL,
  FORMSPREE_ENDPOINT,
  FORMSPREE_FORM_ID,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PLANS,
  WHATSAPP_URL,
} from '../config.js'

const GOALS = ['Entrenamiento + nutrición', 'Solo entrenamiento', 'Solo nutrición', 'No lo tengo claro']

// ⚠️ REVISAR: preguntas y respuestas del FAQ = copy provisional, confirmar con Jaime.
const FAQ = [
  {
    q: '¿Necesito experiencia previa?',
    a: 'No. El plan se adapta a tu nivel, tanto si nunca has pisado un gimnasio como si ya compites.',
  },
  {
    q: '¿Cómo funciona el seguimiento?',
    a: 'Revisamos tus marcas y sensaciones y ajustamos el plan. Tienes a Jaime por WhatsApp para dudas.',
  },
  {
    q: '¿Tengo que estar en Pamplona?',
    a: 'No. Todo el plan funciona online; las sesiones presenciales en Pamplona son un extra opcional.',
  },
]

const inputCls =
  'w-full rounded-lg border border-line bg-ink px-4 py-3.5 text-fg placeholder:text-muted-2 transition-colors duration-150 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
const labelCls = 'mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-fg-2'

function ContactForm({ plan }) {
  const formRef = useRef(null)
  // idle | submitting | success | error
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'submitting') return // evita envíos duplicados
    setStatus('submitting')
    setErrorMsg('')

    if (FORMSPREE_FORM_ID === 'TU_FORM_ID') {
      console.warn('[Contacto] Falta configurar FORMSPREE_FORM_ID en src/config.js')
    }

    try {
      const formData = new FormData(formRef.current)
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      if (res.ok) {
        setStatus('success')
        formRef.current.reset()
        return
      }
      const data = await res.json().catch(() => null)
      setErrorMsg(data?.errors?.map((er) => er.message).join(' · ') || '')
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[420px] flex-col items-start justify-center rounded-2xl border border-brand/40 bg-panel p-8 md:p-12"
        role="status"
      >
        <p className="font-display text-6xl leading-none text-brand">✓</p>
        <h2 className="mt-6 font-display text-5xl uppercase leading-none md:text-6xl">¡Gracias! Jaime te responde en menos de 24h</h2>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Enviar otro mensaje
        </button>
      </motion.div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-2xl border border-line bg-panel p-6 md:p-10" noValidate={false}>
      {plan && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Interesado en: {PLANS[plan]}
        </p>
      )}

      {/* Campos ocultos para Formspree */}
      <input type="hidden" name="_subject" value="Nuevo contacto desde la web — Train with Jaime" />
      {plan && <input type="hidden" name="plan" value={PLANS[plan]} />}
      {/* Honeypot anti-spam de Formspree: los humanos no lo ven */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="nombre" className={labelCls}>Nombre</label>
          <input id="nombre" name="nombre" type="text" required autoComplete="name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputCls} />
        </div>
        <div>
          <label htmlFor="whatsapp" className={labelCls}>WhatsApp</label>
          <input id="whatsapp" name="whatsapp" type="tel" required autoComplete="tel" inputMode="tel" className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="busca" className={labelCls}>Qué buscas</label>
          <select id="busca" name="que_buscas" defaultValue={GOALS[0]} className={`${inputCls} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238A93A6' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-12`}>
            {GOALS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="mensaje" className={labelCls}>
            Mensaje <span className="normal-case tracking-normal text-muted-2">(opcional)</span>
          </label>
          <textarea id="mensaje" name="mensaje" rows={5} className={`${inputCls} resize-y`} />
        </div>
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            role="alert"
          >
            <div className="mt-6 flex flex-col gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-fg-2 sm:flex-row sm:items-center sm:justify-between">
              <p>
                No se ha podido enviar el mensaje{errorMsg ? `: ${errorMsg}` : ''}. Revisa tu conexión e inténtalo de nuevo, o escríbeme por WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                className="shrink-0 rounded-md border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-fg hover:bg-white/5"
              >
                Reintentar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button type="submit" disabled={submitting} aria-busy={submitting} className="mt-8 w-full md:w-auto">
        {submitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" aria-hidden="true" />
            Enviando…
          </>
        ) : (
          'Enviar'
        )}
      </Button>
    </form>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-fg"
      >
        {q}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-brand">
          <PlusIcon className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-fg-2">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default function Contacto() {
  const [params] = useSearchParams()
  const planParam = params.get('plan')
  const plan = planParam && PLANS[planParam] ? planParam : null

  return (
    <>
      <PageHero eyebrow="Hablemos" title="Contacto" />

      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <Reveal as="div">
            <ContactForm plan={plan} />
          </Reveal>

          <Reveal as="aside" className="flex flex-col gap-10">
            <div className="rounded-2xl border border-line bg-panel p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Directo</p>
              <h2 className="mt-3 font-display text-4xl uppercase leading-none">Escríbeme por WhatsApp</h2>
              {/* ⚠️ SUSTITUIR el número en src/config.js (WHATSAPP_NUMBER) */}
              <Button href={WHATSAPP_URL} target="_blank" rel="noreferrer" variant="brand" className="mt-6 w-full">
                <WhatsAppIcon className="h-5 w-5" /> Abrir WhatsApp
              </Button>
              <ul className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
                <li>
                  <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-fg-2 transition-colors hover:text-fg">
                    <MailIcon className="h-5 w-5 text-brand" /> {EMAIL}
                  </a>
                </li>
                <li>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-fg-2 transition-colors hover:text-fg">
                    <InstagramIcon className="h-5 w-5 text-brand" /> {INSTAGRAM_HANDLE}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">FAQ</p>
              <ul className="mt-2 border-t border-line">
                {FAQ.map((f) => (
                  <FaqItem key={f.q} {...f} />
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
