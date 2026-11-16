import { useLocation } from 'react-router-dom'

// La barra HYROX de arriba sale en todas las páginas menos en las propias de HYROX (formulario y página del plan) y en la vista privada.
const HIDDEN = ['/hyrox', '/entrenamiento-hyrox', '/admin']
export const useHasTopBar = () => {
  const { pathname } = useLocation()
  return !HIDDEN.some((p) => pathname === p || pathname.startsWith(p + '/'))
}
