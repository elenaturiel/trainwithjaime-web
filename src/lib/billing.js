import { useSyncExternalStore } from 'react'
import { YEARLY_DISCOUNT } from '../data/pricing.js'

// Periodo de facturación compartido: el selector Mensual/Anual de las tarjetas, el de la tabla comparativa y el de
// la lista de la home muestran siempre lo mismo (una pequeña tienda externa, sin contexto ni dependencias).
let billing = 'monthly'
const listeners = new Set()

export const setBilling = (next) => {
  if (next === billing) return
  billing = next
  listeners.forEach((l) => l())
}

export const useBilling = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => billing,
    () => 'monthly',
  )

const pct = Math.round(YEARLY_DISCOUNT * 100)
export const BILLING_OPTIONS = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual', badge: `Ahorra ${pct}%`, activeBadge: `Ahorras ${pct}%` },
]
