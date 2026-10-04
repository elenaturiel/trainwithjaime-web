// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN GLOBAL — todo lo que hay que sustituir está aquí
// ─────────────────────────────────────────────────────────────

// ID del formulario de Formspree (lo de después de /f/ en la URL del endpoint).
// Los envíos llegan a trainwithjaimesanz@gmail.com.
export const FORMSPREE_FORM_ID = 'mjykeabq'
export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`

// Número de WhatsApp en formato internacional, sin "+", espacios ni guiones.
export const WHATSAPP_NUMBER = '34684034156'
export const WHATSAPP_DISPLAY = '+34 684 034 156'
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

// ⚠️ SUSTITUIR: testimonios de la home (tarjetas debajo de los precios).
// `detail` = plan, carrera o marca conseguida; puede quedarse vacío.
export const TESTIMONIALS = [
  { quote: '[testimonio real pendiente]', author: '[nombre pendiente]', detail: '[plan o carrera]' },
  { quote: '[testimonio real pendiente]', author: '[nombre pendiente]', detail: '[plan o carrera]' },
  { quote: '[testimonio real pendiente]', author: '[nombre pendiente]', detail: '[plan o carrera]' },
]

// ⚠️ SUSTITUIR: fotos de antes y después de Jaime (Sobre Jaime). Sube las dos a /public (mismo encuadre y
// tamaño, mejor vertical 3:4) y pon aquí sus rutas, p. ej. '/antes.jpg' y '/despues.jpg'.
// Mientras estén vacías, el apartado no se muestra.
export const BEFORE_AFTER = {
  // ⚠️ FOTOS DE PRUEBA (de la galería) para ver cómo queda: cámbialas por el antes y el después reales
  before: '/gallery-1.jpg',
  after: '/gallery-2.jpg',
  beforeAlt: 'Jaime, foto de antes',
  afterAlt: 'Jaime, foto de después',
}

// ⚠️ SUSTITUIR: datos del titular de la web para el aviso legal y la política de privacidad
// (obligatorios por la LSSI y el RGPD). Mientras estén entre corchetes se ven así en las páginas legales.
export const LEGAL = {
  owner: '[Nombre y apellidos del titular]',
  nif: '[NIF]',
  address: '[Domicilio completo]',
  domain: 'trainwithjaime.com',
  updated: '25 de septiembre de 2026',
}

// Un texto entre corchetes ("[testimonio real pendiente]") es de relleno: no se muestra en la web.
// Así nunca aparecen estrellas o testimonios falsos; en cuanto pongas uno real, sale solo.
const isPlaceholder = (text) => /^\s*\[/.test(text || '')
export const REAL_TOP_STRIP = TOP_STRIP_TESTIMONIALS.filter((t) => !isPlaceholder(t))
export const REAL_TESTIMONIALS = TESTIMONIALS.filter((t) => !isPlaceholder(t.quote) && !isPlaceholder(t.author))
export const HAS_TOP_STRIP = REAL_TOP_STRIP.length > 0

export const PLANS = {
  rookie: 'Rookie',
  allin: 'All In',
  mvp: 'MVP',
  peak: 'Peak',
  squad: 'Squad discount (Rookie / All In en grupo)',
}
