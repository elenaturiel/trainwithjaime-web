import { useEffect, useState } from 'react'

// Reseñas publicadas y cambios (foto + mini texto) de /api/resenas. Se comparte entre la home y /resenas
// para pedirlas una sola vez. Si el servidor no responde (p. ej. en local sin Redis), la lista queda vacía.
let cache = null
let inflight = null

export function loadReviews({ force = false } = {}) {
  if (cache && !force) return Promise.resolve(cache)
  if (inflight && !force) return inflight
  inflight = fetch('/api/resenas')
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j?.ok ? j : null))
    .catch(() => null)
    .then((j) => {
      inflight = null
      cache = j || { ok: false, total: 0, media: 0, resenas: [], cambios: [] }
      return cache
    })
  return inflight
}

export function resetReviews() {
  cache = null
}

// { data, loading }
export function useReviews() {
  const [data, setData] = useState(cache)
  useEffect(() => {
    let alive = true
    loadReviews().then((d) => alive && setData(d))
    return () => {
      alive = false
    }
  }, [])
  return { data, loading: !data }
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
