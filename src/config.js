// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN GLOBAL — todo lo que hay que sustituir está aquí
// ─────────────────────────────────────────────────────────────

// ⚠️ SUSTITUIR: ID real del formulario de Formspree (lo de después de /f/ en la URL
// del endpoint, p. ej. "xyzabcd"). Los envíos llegan a trainwithjaimesanz@gmail.com.
export const FORMSPREE_FORM_ID = 'TU_FORM_ID'
export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`

// ⚠️ SUSTITUIR: número de WhatsApp en formato internacional, sin "+", espacios ni guiones.
export const WHATSAPP_NUMBER = '34600000000'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hola Jaime, vengo de la web de Train with Jaime',
)}`

export const EMAIL = 'trainwithjaimesanz@gmail.com'
export const INSTAGRAM_HANDLE = '@trainwithjaime'
export const INSTAGRAM_URL = 'https://instagram.com/trainwithjaime'

// ⚠️ SUSTITUIR: testimonios reales (tira superior rotatoria).
export const TOP_STRIP_TESTIMONIALS = [
  '[testimonio real pendiente]',
  '[testimonio real pendiente]',
  '[testimonio real pendiente]',
]

// ⚠️ SUSTITUIR: testimonio grande a pantalla completa de la home.
export const FEATURED_TESTIMONIAL = {
  quote: '[testimonio real pendiente de confirmar]',
  author: '[nombre pendiente]',
}

export const PLANS = {
  rookie: 'Rookie',
  allin: 'All In',
  peak: 'Peak',
  squad: 'Squad discount (Rookie / All In en grupo)',
}
