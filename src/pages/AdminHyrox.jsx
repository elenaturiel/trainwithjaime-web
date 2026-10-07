import { useCallback, useEffect, useState } from 'react'
import { CUANDO, NIVEL } from '../data/hyrox.js'

// Vista privada de la lista HYROX (solo para Jaime): /admin/hyrox. Pide la clave (HYROX_ADMIN_TOKEN en Vercel),
// la guarda solo en esta pestaña y la manda en una cabecera a /api/hyrox-stats. Sin clave correcta no se ve nada.
const KEY = 'twj-admin-token'
const labels = (o) => Object.fromEntries(o.options.map((x) => [x.value, x.label]))
const NIVEL_L = labels(NIVEL)
const CUANDO_L = labels(CUANDO)
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '–')

function Kpi({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 font-display text-5xl font-bold leading-none">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  )
}

function Bars({ title, data, names }) {
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1])
  const total = rows.reduce((n, [, v]) => n + v, 0)
  return (
    <section className="rounded-2xl border border-line bg-panel p-5 md:p-6">
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      {rows.length === 0 && <p className="mt-4 text-sm text-muted">Todavía no hay datos.</p>}
      <ul className="mt-4 space-y-3">
        {rows.map(([k, v]) => (
          <li key={k}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-fg-2">{names?.[k] ?? k}</span>
              <span className="shrink-0 font-semibold">
                {v} <span className="font-normal text-muted">· {pct(v, total)}</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-fg/10">
              <div className="h-full rounded-full bg-brand" style={{ width: pct(v, total) }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Table({ title, rows, firstCol }) {
  return (
    <section className="rounded-2xl border border-line bg-panel p-5 md:p-6">
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[340px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <th className="py-2 pr-3 font-semibold">{firstCol}</th>
              <th className="px-2 py-2 text-right font-semibold">Visitas</th>
              <th className="px-2 py-2 text-right font-semibold">Empez.</th>
              <th className="px-2 py-2 text-right font-semibold">Emails</th>
              <th className="py-2 pl-2 text-right font-semibold">Conv.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.nombre} className="border-b border-line last:border-0">
                <td className="py-2.5 pr-3 font-semibold text-fg">{r.nombre}</td>
                <td className="px-2 py-2.5 text-right text-fg-2">{r.visitas}</td>
                <td className="px-2 py-2.5 text-right text-fg-2">{r.empezaron}</td>
                <td className="px-2 py-2.5 text-right font-semibold">{r.emails}</td>
                <td className="py-2.5 pl-2 text-right text-muted">{pct(r.emails, r.empezaron)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-3 text-muted">
                  Todavía no hay datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function AdminHyrox() {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) || ''
    } catch {
      return ''
    }
  })
  const [input, setInput] = useState('')
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Que ningún buscador la indexe
  useEffect(() => {
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex, nofollow'
    document.head.appendChild(m)
    const prev = document.title
    document.title = 'Lista HYROX · privado'
    return () => {
      m.remove()
      document.title = prev
    }
  }, [])

  const load = useCallback(async (t) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/hyrox-stats', { headers: { 'x-admin-token': t }, cache: 'no-store' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        if (res.status === 401) {
          try {
            sessionStorage.removeItem(KEY)
          } catch {
            /* nada */
          }
          setToken('')
        }
        throw new Error(json.error || `Error ${res.status}`)
      }
      setStats(json)
    } catch (e) {
      setStats(null)
      setError(e.message || 'No se han podido cargar los datos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) load(token)
  }, [token, load])

  const enter = (e) => {
    e.preventDefault()
    const t = input.trim()
    if (!t) return
    try {
      sessionStorage.setItem(KEY, t)
    } catch {
      /* se usa solo en memoria */
    }
    setToken(t)
  }
  const leave = () => {
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      /* nada */
    }
    setToken('')
    setStats(null)
    setInput('')
  }

  const s = stats
  return (
    <div className="theme-dark min-h-svh bg-ink pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">Privado</p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-none md:text-6xl">Lista HYROX</h1>
          </div>
          {token && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => load(token)}
                disabled={loading}
                className="rounded-lg border border-fg/25 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-fg transition-colors hover:border-fg/60 hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
              >
                {loading ? 'Cargando…' : 'Actualizar'}
              </button>
              <button
                type="button"
                onClick={leave}
                className="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Salir
              </button>
            </div>
          )}
        </div>

        {!token && (
          <form onSubmit={enter} className="mt-10 max-w-sm space-y-4">
            <label htmlFor="adm-token" className="block text-sm font-semibold text-fg-2">
              Clave
            </label>
            <input
              id="adm-token"
              type="password"
              autoComplete="current-password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-xl border border-line bg-panel px-4 py-3 text-fg focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            />
            <button
              type="submit"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-on-accent transition-colors hover:bg-[#ffd666] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Entrar
            </button>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-6 rounded-xl border border-accent/60 bg-accent/10 px-4 py-3 text-sm font-semibold text-fg">
            {error}
          </p>
        )}

        {s && (
          <div className="mt-10 space-y-5">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Kpi label="Visitas" value={s.visitas} hint="solo de quien acepta la analítica" />
              <Kpi label="Empezaron" value={s.empezaron} hint="respondieron al menos 1 paso" />
              <Kpi label="Emails" value={s.emails} hint="con consentimiento" />
              <Kpi label="Conversión" value={pct(s.emails, s.empezaron)} hint="emails / empezaron" />
            </div>

            <section className="rounded-2xl border border-line bg-panel p-5 md:p-6">
              <h3 className="font-display text-2xl font-semibold">Finalizados por paso</h3>
              <p className="mt-1 text-xs text-muted">Exacto: sale de las respuestas guardadas. Entre paréntesis, los eventos registrados.</p>
              <ul className="mt-4 space-y-3">
                {[
                  ['Vieron /hyrox', s.visitas, s.eventos.vista, s.visitas],
                  ['Paso 1 · nivel', s.pasos.paso1, s.eventos.paso1, s.empezaron],
                  ['Paso 2 · plazo', s.pasos.paso2, s.eventos.paso2, s.empezaron],
                  ['Envío · email', s.pasos.envio, s.eventos.envio, s.empezaron],
                ].map(([name, v, ev, base], i) => (
                  <li key={name}>
                    <div className="flex items-baseline justify-between gap-4 text-sm">
                      <span className="text-fg-2">{name}</span>
                      <span className="font-semibold">
                        {i === 0 ? s.visitas : v}
                        {i > 0 && <span className="font-normal text-muted"> ({ev}) · {pct(v, s.empezaron)}</span>}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-fg/10">
                      <div className="h-full rounded-full bg-accent" style={{ width: i === 0 ? '100%' : pct(v, base || 1) }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid gap-5 md:grid-cols-2">
              <Table title="Por ubicación del banner" firstCol="Banner" rows={s.porUbicacion} />
              <Table title="Por utm_source" firstCol="Origen" rows={s.porSource} />
              <Bars title="Nivel" data={s.nivel} names={NIVEL_L} />
              <Bars title="Plazo" data={s.cuando} names={CUANDO_L} />
            </div>
            <p className="text-xs text-muted">
              Visitas: solo de quien acepta la analítica. Empezaron, emails y conversión (emails / empezaron): exactos.
            </p>
            {s.ultimo && <p className="text-xs text-muted">Último movimiento: {new Date(s.ultimo).toLocaleString('es-ES')}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
