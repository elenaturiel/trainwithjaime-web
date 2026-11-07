import { useCallback, useEffect, useState } from 'react'
import { Stars } from '../components/Stars.jsx'
import { resetReviews } from '../lib/resenas.js'

// Panel privado de reseñas (solo para Jaime): /admin/resenas. Usa la misma clave que /admin/hyrox
// (HYROX_ADMIN_TOKEN en Vercel), la guarda solo en esta pestaña y la manda en una cabecera a /api/resenas-admin.
//   · Reseñas: las que escribe la gente llegan "pendientes"; aquí se publican, se ocultan o se borran.
//   · Cambios: Jaime sube la foto de un cliente con un mini texto; se publica al guardarla.
const KEY = 'twj-admin-token'
const btn =
  'rounded-lg border border-fg/25 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-fg transition-colors hover:border-fg/60 hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50'
const btnPrimary =
  'rounded-lg bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-on-accent transition-colors hover:bg-[#ffd666] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50'
const inputCls =
  'w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-fg placeholder:text-muted-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-fg-2'

// Reduce la foto (lado largo ≤ 1200 px) y la convierte a JPEG para que pese poco. Devuelve base64 sin cabecera.
async function photoToBase64(file) {
  const bmp = await createImageBitmap(file)
  const MAX = 1200
  const scale = Math.min(1, MAX / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * scale)
  const h = Math.round(bmp.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(bmp, 0, 0, w, h)
  bmp.close?.()
  for (const q of [0.85, 0.75, 0.65, 0.55]) {
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', q))
    const b64 = await new Promise((res, rej) => {
      const fr = new FileReader()
      fr.onload = () => res(String(fr.result).split(',')[1])
      fr.onerror = rej
      fr.readAsDataURL(blob)
    })
    if (b64.length < 850_000) return { b64, preview: URL.createObjectURL(blob) }
  }
  throw new Error('La foto sigue pesando demasiado. Prueba con otra.')
}

function ReviewRow({ r, act, busy }) {
  const pending = r.estado === 'pendiente'
  return (
    <li className="rounded-xl border border-line bg-panel p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <Stars value={r.estrellas} />
          <span className="font-semibold text-fg">{r.nombre}</span>
          {r.detalle && <span className="text-sm text-muted">· {r.detalle}</span>}
        </div>
        <span className="text-xs text-muted">{new Date(r.fecha).toLocaleString('es-ES')}</span>
      </div>
      <p className="mt-3 whitespace-pre-line break-words text-fg-2">{r.texto}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {pending ? (
          <button type="button" disabled={busy} onClick={() => act('publicar', r.id)} className={btnPrimary}>
            Publicar
          </button>
        ) : (
          <button type="button" disabled={busy} onClick={() => act('ocultar', r.id)} className={btn}>
            Quitar de la web
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => window.confirm('¿Borrar esta reseña para siempre?') && act('borrar', r.id)}
          className={btn}
        >
          Borrar
        </button>
      </div>
    </li>
  )
}

function ChangeRow({ c, act, busy }) {
  const [edit, setEdit] = useState(false)
  const [f, setF] = useState({ titulo: c.titulo, texto: c.texto, nombre: c.nombre })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  return (
    <li className="flex gap-4 rounded-xl border border-line bg-panel p-4">
      <img src={c.foto} alt="" className="aspect-[3/4] w-24 shrink-0 rounded-lg bg-panel-2 object-cover md:w-28" />
      <div className="min-w-0 flex-1">
        {edit ? (
          <div className="space-y-2">
            <input aria-label="Título" value={f.titulo} onChange={set('titulo')} maxLength={60} className={inputCls} />
            <textarea aria-label="Texto" value={f.texto} onChange={set('texto')} maxLength={240} rows={3} className={inputCls} />
            <input aria-label="Nombre" value={f.nombre} onChange={set('nombre')} maxLength={40} placeholder="Nombre (opcional)" className={inputCls} />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={async () => (await act('cambio-editar', c.id, f)) && setEdit(false)}
                className={btnPrimary}
              >
                Guardar
              </button>
              <button type="button" onClick={() => setEdit(false)} className={btn}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="font-display text-xl font-semibold text-fg">{c.titulo}</p>
            {c.texto && <p className="mt-1 break-words text-sm text-fg-2">{c.texto}</p>}
            {c.nombre && <p className="mt-2 text-xs font-semibold text-muted">{c.nombre}</p>}
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setEdit(true)} className={btn}>
                Editar
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => window.confirm('¿Borrar este cambio y su foto?') && act('cambio-borrar', c.id)}
                className={btn}
              >
                Borrar
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  )
}

function NewChange({ onCreate, busy }) {
  const [photo, setPhoto] = useState(null) // { b64, preview }
  const [err, setErr] = useState('')
  const [key, setKey] = useState(0) // reinicia el formulario tras guardar

  async function pick(e) {
    const file = e.target.files?.[0]
    setErr('')
    setPhoto(null)
    if (!file) return
    try {
      setPhoto(await photoToBase64(file))
    } catch (x) {
      setErr(x.message || 'No se ha podido leer la foto.')
    }
  }
  async function submit(e) {
    e.preventDefault()
    if (!photo) return setErr('Elige una foto.')
    const f = new FormData(e.currentTarget)
    const ok = await onCreate({
      foto: photo.b64,
      titulo: f.get('titulo'),
      texto: f.get('texto'),
      nombre: f.get('nombre'),
      permiso: f.get('permiso') === 'on',
    })
    if (ok) {
      setPhoto(null)
      setKey((k) => k + 1)
    }
  }
  return (
    <form key={key} onSubmit={submit} className="grid gap-5 rounded-2xl border border-line bg-panel p-5 md:grid-cols-[10rem_1fr] md:p-6">
      <div>
        <span className={labelCls}>Foto</span>
        <label className="block cursor-pointer">
          <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-muted-2 bg-ink text-center text-xs text-muted">
            {photo ? <img src={photo.preview} alt="Vista previa" className="size-full object-cover" /> : 'Toca para elegir'}
          </div>
          <input type="file" accept="image/*" onChange={pick} className="sr-only" />
        </label>
        <p className="mt-2 text-xs text-muted-2">Mejor vertical (3:4). Se reduce sola.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="c-titulo" className={labelCls}>
            Título corto
          </label>
          <input id="c-titulo" name="titulo" required maxLength={60} placeholder="Ej.: −8 kg en 12 semanas" className={inputCls} />
        </div>
        <div>
          <label htmlFor="c-texto" className={labelCls}>
            Mini texto
          </label>
          <textarea id="c-texto" name="texto" rows={3} maxLength={240} placeholder="Qué ha cambiado y cómo lo ha conseguido" className={inputCls} />
        </div>
        <div>
          <label htmlFor="c-nombre" className={labelCls}>
            Nombre <span className="font-normal normal-case tracking-normal text-muted">(opcional)</span>
          </label>
          <input id="c-nombre" name="nombre" maxLength={40} placeholder="Ej.: Marcos, 21 años" className={inputCls} />
        </div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-fg-2">
          <input type="checkbox" name="permiso" required className="mt-1 h-4 w-4 accent-[#FFC93C]" />
          Tengo el permiso de la persona para publicar su foto y su texto en la web.
        </label>
        {err && (
          <p role="alert" className="text-sm font-semibold text-red-500">
            {err}
          </p>
        )}
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? 'Subiendo…' : 'Publicar cambio'}
        </button>
      </div>
    </form>
  )
}

export default function AdminResenas() {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) || ''
    } catch {
      return ''
    }
  })
  const [input, setInput] = useState('')
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('resenas')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Que ningún buscador la indexe
  useEffect(() => {
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex, nofollow'
    document.head.appendChild(m)
    const prev = document.title
    document.title = 'Reseñas · privado'
    return () => {
      m.remove()
      document.title = prev
    }
  }, [])

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      /* nada */
    }
    setToken('')
    setData(null)
  }, [])

  const call = useCallback(
    async (method, body) => {
      const res = await fetch('/api/resenas-admin', {
        method,
        headers: { 'x-admin-token': token, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store',
      })
      const json = await res.json().catch(() => ({}))
      if (res.status === 401) logout()
      if (!res.ok || !json.ok) throw new Error(json.error || `Error ${res.status}`)
      return json
    },
    [token, logout],
  )

  const load = useCallback(async () => {
    setError('')
    try {
      setData(await call('GET'))
    } catch (e) {
      setData(null)
      setError(e.message)
    }
  }, [call])

  useEffect(() => {
    if (token) load()
  }, [token, load])

  // Ejecuta una acción y recarga. Devuelve true si ha ido bien.
  const act = useCallback(
    async (action, id, extra) => {
      setBusy(true)
      setError('')
      try {
        await call('POST', { action, id, ...extra })
        resetReviews() // la web pública vuelve a pedir la lista
        await load()
        return true
      } catch (e) {
        setError(e.message)
        return false
      } finally {
        setBusy(false)
      }
    },
    [call, load],
  )
  const create = (payload) => act('cambio-crear', undefined, payload)

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
    setInput('')
  }

  const pendientes = data?.resenas.filter((r) => r.estado === 'pendiente') ?? []
  const publicadas = data?.resenas.filter((r) => r.estado === 'publicada') ?? []
  const tabBtn = (v, label, n) => (
    <button
      type="button"
      onClick={() => setTab(v)}
      aria-pressed={tab === v}
      className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
        tab === v ? 'bg-accent text-on-accent' : 'border border-fg/25 text-fg hover:border-fg/60'
      }`}
    >
      {label}
      {n > 0 && <span className="ml-2 opacity-70">({n})</span>}
    </button>
  )

  return (
    <div className="theme-dark min-h-svh bg-ink pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">Privado</p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-none md:text-6xl">Reseñas</h1>
          </div>
          {token && (
            <div className="flex gap-3">
              <button type="button" onClick={load} disabled={busy} className={btn}>
                Actualizar
              </button>
              <button type="button" onClick={logout} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-fg">
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
            <button type="submit" className={btnPrimary}>
              Entrar
            </button>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-6 rounded-xl border border-accent/60 bg-accent/10 px-4 py-3 text-sm font-semibold text-fg">
            {error}
          </p>
        )}

        {data && (
          <div className="mt-8">
            <div className="flex flex-wrap gap-3">
              {tabBtn('resenas', 'Reseñas', pendientes.length)}
              {tabBtn('cambios', 'Cambios con foto', 0)}
            </div>

            {tab === 'resenas' && (
              <div className="mt-8 space-y-10">
                <section>
                  <h2 className="font-display text-2xl font-semibold">Por revisar ({pendientes.length})</h2>
                  <p className="mt-1 text-sm text-muted">Nada se publica hasta que le des a “Publicar”.</p>
                  <ul className="mt-4 space-y-3">
                    {pendientes.map((r) => (
                      <ReviewRow key={r.id} r={r} act={act} busy={busy} />
                    ))}
                    {pendientes.length === 0 && <li className="text-sm text-muted">No hay reseñas pendientes.</li>}
                  </ul>
                </section>
                <section>
                  <h2 className="font-display text-2xl font-semibold">Publicadas ({publicadas.length})</h2>
                  <ul className="mt-4 space-y-3">
                    {publicadas.map((r) => (
                      <ReviewRow key={r.id} r={r} act={act} busy={busy} />
                    ))}
                    {publicadas.length === 0 && <li className="text-sm text-muted">Todavía no hay ninguna publicada.</li>}
                  </ul>
                </section>
              </div>
            )}

            {tab === 'cambios' && (
              <div className="mt-8 space-y-8">
                <section>
                  <h2 className="mb-4 font-display text-2xl font-semibold">Añadir un cambio</h2>
                  <NewChange onCreate={create} busy={busy} />
                </section>
                <section>
                  <h2 className="font-display text-2xl font-semibold">Publicados ({data.cambios.length})</h2>
                  <ul className="mt-4 space-y-3">
                    {data.cambios.map((c) => (
                      <ChangeRow key={c.id} c={c} act={act} busy={busy} />
                    ))}
                    {data.cambios.length === 0 && <li className="text-sm text-muted">Todavía no hay ninguno.</li>}
                  </ul>
                </section>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
