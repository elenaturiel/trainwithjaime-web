import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import ScrollSection from '../components/ScrollSection.jsx'
import Button from '../components/Button.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { CheckIcon, InstagramIcon, MailIcon, PlusIcon, UsersIcon, WhatsAppIcon } from '../components/Icons.jsx'
import { normalizeCode, referral } from '../lib/referral.js'
import {
  EMAIL,
  FORMSPREE_ENDPOINT,
  FORMSPREE_FORM_ID,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PLANS,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from '../config.js'

const GOALS = ['Entrenamiento + nutrición', 'Solo entrenamiento', 'Solo nutrición', 'No lo tengo claro']

const FAQ = [
  {
    q: '¿El primer contacto tiene coste?',
    a: 'No. El primer contacto y asesoramiento con Jaime es gratis y sin compromiso: le cuentas tu objetivo y te dice qué plan te encaja.',
  },
  {
    q: '¿Necesito experiencia previa?',
    a: 'No. El plan se adapta a tu nivel, tanto si nunca has pisado un gimnasio como si ya compites.',
  },
  {
    q: '¿Cómo funciona el seguimiento?',
    a: 'Depende del plan: en Rookie, revisión por WhatsApp cada 15 días; en All In y Peak, revisión semanal (All In incluye además una videollamada al mes). Y si te surge una duda antes de entrenar, me escribes.',
  },
  {
    q: '¿Hay descuento para universitarios?',
    a: 'Sí: un 10% con carné universitario. Se verifica al hablar con Jaime. Y si te apuntas con amigos, tienes también el descuento squad.',
  },
  {
    q: '¿Tengo que estar en Pamplona?',
    a: 'No. Todo el plan funciona online; las sesiones presenciales en Pamplona (25€) son un extra opcional.',
  },
]

const inputCls =
  'w-full rounded-lg border border-line bg-ink px-4 py-3.5 text-fg placeholder:text-muted-2 transition-colors duration-150 hover:border-muted-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
const labelCls = 'mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-fg-2'

function ContactForm({ plan, weeks, initialCode, testPlan }) {
  const planLabel = plan ? `${PLANS[plan]}${weeks ? ` · ${weeks} semanas` : ''}` : null
  const formRef = useRef(null)
  const codeRef = useRef(null)
  // idle | submitting | success | error
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Descuento con amigos
  const [wantsCode, setWantsCode] = useState(plan === 'squad' && !initialCode)
  const [friendCode, setFriendCode] = useState(initialCode)
  // { state: 'idle' | 'checking' | 'valid' | 'invalid' | 'unknown', msg }
  const [codeCheck, setCodeCheck] = useState({ state: 'idle', msg: '' })
  const [myCode, setMyCode] = useState(null) // código generado para dárselo a un amigo
  const [myCodeFailed, setMyCodeFailed] = useState(false)

  const successRef = useRef(null)
  const currentEmail = () => formRef.current?.elements.email?.value || ''

  async function checkFriendCode(value = friendCode) {
    const code = normalizeCode(value)
    if (!code) return setCodeCheck({ state: 'idle', msg: '' })
    setCodeCheck({ state: 'checking', msg: 'Comprobando código…' })
    const r = await referral('check', { code, email: currentEmail() })
    if (r.ok) setCodeCheck({ state: 'valid', msg: 'Código válido: tú y tu amigo tenéis el descuento squad.' })
    else if (r.unavailable)
      setCodeCheck({ state: 'unknown', msg: 'No podemos comprobarlo ahora; Jaime lo revisará a mano.' })
    else setCodeCheck({ state: 'invalid', msg: r.error })
  }

  // Si el código viene en el enlace (?codigo=...), lo comprobamos al entrar.
  useEffect(() => {
    if (initialCode) checkFriendCode(initialCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'submitting') return // evita envíos duplicados
    setStatus('submitting')
    setErrorMsg('')

    if (FORMSPREE_FORM_ID === 'TU_FORM_ID') {
      console.warn('[Contacto] Falta configurar FORMSPREE_FORM_ID en src/config.js')
    }

    const formData = new FormData(formRef.current)
    const name = formData.get('nombre')
    const email = formData.get('email')

    // 1) Canjear el código del amigo (solo se puede usar una vez).
    const code = normalizeCode(friendCode)
    if (code) {
      const r = await referral('redeem', { code, email, name })
      if (!r.ok && !r.unavailable) {
        setCodeCheck({ state: 'invalid', msg: r.error })
        setStatus('idle')
        codeRef.current?.focus()
        return
      }
      formData.append('codigo_amigo_usado', code)
      formData.append('codigo_amigo_estado', r.ok ? 'válido (canjeado)' : 'SIN VERIFICAR — revisar a mano')
    }

    // 2) Generar su propio código para dárselo a un amigo.
    let generated = null
    if (wantsCode) {
      const r = await referral('create', { name, email })
      generated = r.ok ? r.code : null
      formData.append('codigo_para_su_amigo', generated || 'no se pudo generar — pásale uno a mano')
    }

    // 3) Se envía a la vez a Google Sheets (se guarda una fila) y a Formspree (aviso por email a Jaime).
    //    Basta con que uno de los dos funcione para no perder la inscripción.
    const saveToSheet = fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    }).then((r) => r.ok)
    const sendEmail = fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    }).then(async (r) => {
      if (r.ok) return true
      const data = await r.json().catch(() => null)
      throw new Error(data?.errors?.map((er) => er.message).join(' · ') || '')
    })
    const [sheetResult, emailResult] = await Promise.allSettled([saveToSheet, sendEmail])
    if (sheetResult.value === true || emailResult.value === true) {
      setMyCode(generated)
      setMyCodeFailed(wantsCode && !generated)
      setStatus('success')
      return
    }
    setErrorMsg(emailResult.reason?.message || '')
    setStatus('error')
  }

  if (status === 'success') {
    return (
      <motion.div
        ref={successRef}
        id="contacto-enviado"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        // Al enviar, el panel (con el código) puede quedar fuera de pantalla: lo traemos a la vista.
        onAnimationComplete={() => successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        className="flex min-h-[420px] flex-col items-start justify-center rounded-2xl border border-brand/40 bg-panel p-8 md:p-12"
        role="status"
      >
        <p className="font-display text-6xl leading-none text-brand">✓</p>
        <h2 className="mt-6 font-display text-5xl uppercase leading-none md:text-6xl">
          ¡Gracias! Jaime te responde en menos de 24h
        </h2>
        {myCode && <MyCodeCard code={myCode} />}
        {myCodeFailed && (
          <p className="mt-6 text-sm text-fg-2">
            No hemos podido generar tu código de amigo ahora mismo. Jaime te lo pasará por WhatsApp.
          </p>
        )}
        <HelpNote className="mt-8" />
        <button
          type="button"
          onClick={() => {
            setStatus('idle')
            setFriendCode('')
            setCodeCheck({ state: 'idle', msg: '' })
            setWantsCode(false)
            setMyCode(null)
            setMyCodeFailed(false)
          }}
          className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Enviar otro mensaje
        </button>
      </motion.div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-panel p-6 md:p-10"
      noValidate={false}
    >
      {plan && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
          Interesado en: {planLabel}
        </p>
      )}

      {/* Campos ocultos para Formspree */}
      <input type="hidden" name="_subject" value="Nuevo contacto desde la web — Train with Jaime" />
      {plan && <input type="hidden" name="plan" value={planLabel} />}
      {testPlan && <input type="hidden" name="recomendacion_test" value={PLANS[testPlan]} />}
      {/* Honeypot anti-spam de Formspree: los humanos no lo ven */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="nombre" className={labelCls}>
            Nombre
          </label>
          <input id="nombre" name="nombre" type="text" required autoComplete="name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            // El resultado de la comprobación depende de quién eres (tu propio código, ya canjeado por ti…).
            onBlur={() => friendCode && checkFriendCode()}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="telefono" className={labelCls}>
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className={inputCls}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="busca" className={labelCls}>
            Qué buscas
          </label>
          <select
            id="busca"
            name="que_buscas"
            defaultValue={GOALS[0]}
            className={`${inputCls} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238A93A6' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-12`}
          >
            {GOALS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
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

      {/* Descuento con amigos (squad) */}
      <fieldset className="mt-8 rounded-xl border border-brand/40 bg-brand/5 p-5 md:p-6">
        <legend className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          <UsersIcon className="h-4 w-4" /> Descuentos
        </legend>

        <label className="mb-6 flex cursor-pointer items-start gap-3 border-b border-line pb-6">
          <input type="checkbox" name="carne_universitario" value="Sí (verificar al hablar)" className="peer sr-only" />
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-muted-2 bg-ink text-transparent transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:ring-2 peer-focus-visible:ring-brand"
          >
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
          <span>
            <span className="font-semibold text-fg">Tengo carné universitario (-10%)</span>
            <span className="mt-1 block text-sm text-muted">Jaime lo verifica cuando habléis.</span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={wantsCode}
            onChange={(e) => setWantsCode(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-muted-2 bg-ink text-on-accent transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-brand"
          >
            {wantsCode && <CheckIcon className="h-3.5 w-3.5" />}
          </span>
          <span>
            <span className="font-semibold text-fg">¿Vienes con un amigo? Dale este código</span>
            <span className="mt-1 block text-sm text-muted">
              Al enviar el formulario te daremos un código único para tu amigo. Cuando se apunte con él, los dos tenéis
              el descuento squad. Solo sirve para una persona.
            </span>
          </span>
        </label>

        <div className="mt-6 border-t border-line pt-6">
          <label htmlFor="codigo" className={labelCls}>
            ¿Te han dado un código? <span className="normal-case tracking-normal text-muted-2">(opcional)</span>
          </label>
          <input
            ref={codeRef}
            id="codigo"
            type="text"
            value={friendCode}
            onChange={(e) => {
              setFriendCode(e.target.value)
              if (codeCheck.state !== 'idle') setCodeCheck({ state: 'idle', msg: '' })
            }}
            onBlur={() => checkFriendCode()}
            placeholder="TWJ-XXXXXX"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={14}
            aria-invalid={codeCheck.state === 'invalid'}
            aria-describedby="codigo-estado"
            className={`${inputCls} font-mono uppercase tracking-widest ${
              codeCheck.state === 'invalid'
                ? '!border-red-500'
                : codeCheck.state === 'valid'
                  ? '!border-emerald-500'
                  : ''
            }`}
          />
          <p
            id="codigo-estado"
            aria-live="polite"
            className={`mt-2 min-h-5 text-sm ${
              codeCheck.state === 'invalid'
                ? 'text-red-600'
                : codeCheck.state === 'valid'
                  ? 'text-emerald-700'
                  : 'text-muted'
            }`}
          >
            {codeCheck.msg}
          </p>
        </div>
      </fieldset>

      {/* Consentimiento RGPD + información básica de protección de datos */}
      <label className="mt-8 flex cursor-pointer items-start gap-3">
        <input type="checkbox" name="acepta_privacidad" value="Sí" required className="peer sr-only" />
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-muted-2 bg-ink text-transparent transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-user-invalid:border-red-500"
        >
          <CheckIcon className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm text-fg-2">
          He leído y acepto la{' '}
          <Link
            to="/privacidad"
            target="_blank"
            className="font-semibold text-fg underline underline-offset-4 hover:text-accent-ink"
          >
            política de privacidad
          </Link>
          .
        </span>
      </label>
      <p className="mt-3 text-xs leading-relaxed text-muted-2">
        Responsable: Train with Jaime. Finalidad: responder a tu solicitud y, si lo pides, gestionar tu código de amigo.
        Legitimación: tu consentimiento. No se ceden datos a terceros salvo proveedores necesarios para el servicio.
        Derechos: acceso, rectificación, supresión y otros, escribiendo a {EMAIL}. Más información en la política de
        privacidad.
      </p>

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
                No se ha podido enviar el mensaje{errorMsg ? `: ${errorMsg}` : ''}. Revisa tu conexión e inténtalo de
                nuevo, escríbeme por WhatsApp o a {EMAIL}.
              </p>
              <button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                className="shrink-0 rounded-md border border-fg/25 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-fg hover:bg-fg/5"
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
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-on-accent/30 border-t-on-accent"
              aria-hidden="true"
            />
            Enviando…
          </>
        ) : (
          'Enviar'
        )}
      </Button>

      <HelpNote className="mt-6" />
    </form>
  )
}

function HelpNote({ className = '' }) {
  return (
    <p className={`text-sm text-muted ${className}`}>
      ¿Ha habido algún error o tienes alguna duda? Escríbenos a{' '}
      <a
        href={`mailto:${EMAIL}`}
        className="font-semibold text-fg underline-offset-4 hover:text-accent-ink hover:underline"
      >
        {EMAIL}
      </a>
    </p>
  )
}

// Código generado para que el usuario se lo pase a su amigo.
function MyCodeCard({ code }) {
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/contacto?plan=squad&codigo=${code}`
  const shareText = `¡Vente a entrenar con Train with Jaime! Pon mi código ${code} al apuntarte y los dos tenemos descuento: ${link}`

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* el usuario puede copiarlo a mano */
    }
  }

  return (
    <div className="mt-8 w-full rounded-xl border border-accent/40 bg-accent/5 p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">Tu código para tu amigo</p>
      <p className="mt-3 select-all font-mono text-3xl font-bold tracking-[0.15em] text-fg md:text-4xl">{code}</p>
      <p className="mt-2 text-sm text-muted">
        Guárdalo: solo sirve para una persona. Cuando tu amigo se apunte con él, los dos tenéis el descuento squad.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="secondary" onClick={copy}>
          {copied ? '¡Copiado!' : 'Copiar código'}
        </Button>
        <Button
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          variant="brand"
        >
          <WhatsAppIcon className="h-5 w-5" /> Enviar por WhatsApp
        </Button>
      </div>
    </div>
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
        className="group flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-fg transition-colors duration-150 hover:text-accent-ink"
      >
        {q}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-brand transition-colors group-hover:text-accent-ink"
        >
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
  const weeksParam = params.get('semanas')
  const weeks = plan === 'peak' && ['8', '10', '12'].includes(weeksParam) ? weeksParam : null
  const initialCode = normalizeCode(params.get('codigo') || '')
  const testParam = params.get('test')
  const testPlan = testParam && PLANS[testParam] ? testParam : null

  return (
    <>
      <ScrollSection effect="stack" first dark>
        <PageHero eyebrow="Hablemos" title="Contacto">
          <strong className="text-accent-ink">El primer contacto es gratis:</strong> cuéntale a Jaime tu objetivo y te
          asesora sin compromiso.
        </PageHero>
      </ScrollSection>

      <ScrollSection effect="clip" last>
        <section className="bg-ink py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <Reveal as="div">
              <ContactForm plan={plan} weeks={weeks} initialCode={initialCode} testPlan={testPlan} />
            </Reveal>

            <Reveal as="aside" className="flex flex-col gap-10">
              <div className="rounded-2xl border border-line bg-panel p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Directo</p>
                <h2 className="mt-3 font-display text-4xl uppercase leading-none">Escríbeme por WhatsApp</h2>
                <Button href={WHATSAPP_URL} target="_blank" rel="noreferrer" variant="brand" className="mt-6 w-full">
                  <WhatsAppIcon className="h-5 w-5" /> Abrir WhatsApp
                </Button>
                <p className="mt-3 text-center text-sm text-muted">{WHATSAPP_DISPLAY}</p>
                <ul className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
                  <li>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="flex items-center gap-3 text-fg-2 transition-[color,transform] duration-200 hover:translate-x-1 hover:text-accent-ink"
                    >
                      <MailIcon className="h-5 w-5 text-brand" /> {EMAIL}
                    </a>
                  </li>
                  <li>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-fg-2 transition-[color,transform] duration-200 hover:translate-x-1 hover:text-accent-ink"
                    >
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
      </ScrollSection>
    </>
  )
}
