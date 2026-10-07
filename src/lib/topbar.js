import { useLocation } from 'react-router-dom'

// La barra HYROX de arriba sale en todas las páginas menos en el propio formulario y en la vista privada.
const HIDDEN = ['/hyrox', '/admin']
export const useHasTopBar = () => {
  const { pathname } = useLocation()
  return !HIDDEN.some((p) => pathname === p || pathname.startsWith(p + '/'))
}
