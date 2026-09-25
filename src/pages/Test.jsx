import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import Button from '../components/Button.jsx'
import { ArrowIcon, CheckIcon } from '../components/Icons.jsx'
import { PRICING } from '../data/pricing.js'

// Test de estudihambre: 6 preguntas rápidas → plan recomendado (Rookie, All In o Peak).
const QUESTIONS = [
  {
    id: 'objetivo',
    q: '¿Qué quieres conseguir?',
    options: [
      { v: 'fuerza', label: 'Más peso en la barra', hint: 'Fuerza, músculo, gym' },
      { v: 'running', label: 'Correr más y mejor', hint: 'Bajar tiempos, aguantar más' },
      { v: 'evento', label: 'Llegar a tope a una prueba', hint: '10K, HYROX, media, trail…' },
      { v: 'forma', label: 'Ponerme en forma', hint: 'Sentirme mejor, coger hábito' },
    ],
  },
  {
    id: 'prueba',
    q: '¿Tienes una prueba con fecha en el calendario?',
    options: [
      { v: 'pronto', label: 'Sí, en los próximos 2-3 meses' },
      { v: 'lejos', label: 'Sí, pero queda lejos' },
      { v: 'no', label: 'No, de momento no' },
    ],
  },
  {
    id: 'comida',
    q: 'Sé sincero: ¿cómo comes ahora mismo?',
    options: [
      { v: 'bien', label: 'Bien, lo tengo controlado' },
      { v: 'regular', label: 'Regular: tuppers de casa y lo que pillo' },
      { v: 'mal', label: 'Estudihambre total: pasta, pizza y lo que caiga' },
    ],
  },
  {
    id: 'nutricion',
    q: '¿Quieres que Jaime te lleve también la nutrición?',
    options: [
      { v: 'si', label: 'Sí, quiero el pack completo' },
      { v: 'nose', label: 'No lo sé, ¿me haría falta?' },
      { v: 'no', label: 'No, solo quiero entrenar' },
    ],
  },
  {
    id: 'seguimiento',
    q: '¿Cuánto seguimiento quieres?',
    options: [
      { v: 'libre', label: 'Voy por libre: con una revisión cada 15 días me vale' },
      { v: 'cerca', label: 'Quiero a Jaime cerca: revisión semanal y videollamada' },
    ],
  },
  {
    id: 'amigos',
    q: '¿Vas a entrenar con algún amigo?',
    options: [
      { v: 'si', label: 'Sí, nos apuntaríamos juntos' },
      { v: 'no', label: 'No, voy solo' },
    ],
  },
]

function recommend(a) {
  const reasons = []
  if (a.prueba === 'pronto') {
    reasons.push('Tienes una prueba con fecha cerca: necesitas un plan cerrado con deadline.')
    if (a.comida !== 'bien') reasons.push('Incluye nutrición durante toda la preparación.')
    reasons.push('Elige 8, 10 o 12 semanas según tu prueba (10K, HYROX, media maratón, trail corto…).')
    return { id: 'peak', reasons }
  }
  let score = 0
  if (a.nutricion === 'si') ((score += 2), reasons.push('Quieres entrenamiento y nutrición en el mismo plan.'))
  if (a.nutricion === 'nose') score += 1
  if (a.comida === 'mal')
    ((score += 2), reasons.push('Tu alimentación tiene margen de mejora: el plan nutricional marcará la diferencia.'))
  if (a.comida === 'regular') score += 1
  if (a.seguimiento === 'cerca')
    ((score += 2), reasons.push('Buscas seguimiento cercano: revisión semanal y una videollamada al mes.'))
  if (score >= 3) return { id: 'allin', reasons }
  return {
    id: 'rookie',
    reasons: [
      'Quieres centrarte en entrenar con un plan hecho para ti.',
      'Con una revisión cada 15 días tienes el seguimiento que buscas.',
      a.objetivo === 'running' ? 'Plan de running o gym, tú eliges.' : 'Plan de gym o running, tú eliges.',
    ],
  }
}

export default function Test() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const done = step >= QUESTIONS.length
  const current = QUESTIONS[step]

  const choose = (v) => {
    setAnswers((a) => ({ ...a, [current.id]: v }))
    setStep((s) => s + 1)
  }
  const restart = () => {
    setAnswers({})
    setStep(0)
  }

  const result = done ? recommend(answers) : null
  const plan = result && PRICING.find((p) => p.id === result.id)
  const price = plan && (plan.price || `desde ${plan.options[0].price}`)

  return (
    <>
      <PageHero eyebrow="Test de estudihambre" title="¿Qué plan es para ti?">
        6 preguntas, 1 minuto. Al final te decimos qué plan te encaja mejor.
      </PageHero>

      <section className="bg-ink py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          {/* Progreso */}
          <div className="mb-10 flex items-center gap-4">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full bg-accent"
                animate={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted tabular-nums">
              {done ? 'Resultado' : `${step + 1} / ${QUESTIONS.length}`}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-display text-4xl uppercase leading-[1.02] md:text-6xl">{current.q}</h2>
                <div className="mt-8 grid gap-3">
                  {current.options.map((o) => (
                    <motion.button
                      key={o.v}
                      type="button"
                      onClick={() => choose(o.v)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`flex items-center justify-between gap-4 rounded-xl border bg-panel px-5 py-4 text-left transition-colors duration-150 hover:border-accent hover:bg-panel-2 ${
                        answers[current.id] === o.v ? 'border-accent' : 'border-line'
                      }`}
                    >
                      <span>
                        <span className="block font-semibold text-fg">{o.label}</span>
                        {o.hint && <span className="mt-0.5 block text-sm text-muted">{o.hint}</span>}
                      </span>
                      <ArrowIcon className="h-4 w-4 shrink-0 text-muted" />
                    </motion.button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted hover:text-fg"
                  >
                    ← Anterior
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border border-accent/40 bg-panel p-7 md:p-10"
                role="status"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Tu plan</p>
                <h2 className="mt-3 font-display text-7xl uppercase leading-none md:text-8xl">{plan.name}</h2>
                <p className="mt-2 text-fg-2">
                  {plan.tagline}{' '}
                  <span className="text-fg">
                    · {price}
                    {plan.period}
                  </span>
                </p>
                <ul className="mt-8 space-y-3 border-t border-line pt-6">
                  {result.reasons.map((r) => (
                    <li key={r} className="flex gap-3 text-fg-2">
                      <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      {r}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 space-y-2 text-sm text-muted">
                  {answers.amigos === 'si' && (
                    <p>
                      <strong className="text-fg">Vienes con amigos:</strong> con el descuento squad ahorráis un 15% (2
                      personas) o un 25% (3 o más) en Rookie y All In.
                    </p>
                  )}
                  <p>
                    <strong className="text-fg">-10% con carné universitario</strong>, que Jaime verifica cuando
                    habléis.
                  </p>
                  {answers.prueba === 'lejos' && result.id !== 'peak' && (
                    <p>Cuando se acerque tu prueba, echa un ojo al plan Peak.</p>
                  )}
                  <p>El primer contacto con Jaime es gratis y sin compromiso.</p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    to={`/contacto?plan=${answers.amigos === 'si' && result.id !== 'peak' ? 'squad' : plan.id}&test=${plan.id}`}
                  >
                    {plan.cta} <ArrowIcon className="h-4 w-4" />
                  </Button>
                  <Button to="/#precios" variant="secondary">
                    Ver todos los planes
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={restart}
                  className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted hover:text-fg"
                >
                  Repetir el test
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
