// Textos y datos de la página /entrenamiento-hyrox (src/pages/HyroxPlan.jsx). Todo lo que hay que revisar o rellenar
// está aquí, sin tocar el diseño. Busca ⚠️ para ver lo pendiente.

// Enlace de todos los botones "Quiero mi plan": el formulario de contacto llega con el plan HYROX elegido y apuntando
// a que viene de la página de HYROX (se ve en el aviso del formulario y en el email que recibe Jaime).
export const HYROX_CONTACT = '/contacto?plan=hyrox&origen=hyrox'

// La carrera que ya fue y la siguiente. `iso` es el momento exacto de la cuenta atrás (00:00 hora de España).
export const HYROX_PAST = { nombre: 'HYROX Barcelona', modalidad: 'Dobles mixtos', fecha: '14 de noviembre de 2026' }
export const HYROX_NEXT = {
  fecha: '20 de marzo de 2027',
  iso: '2027-03-20T00:00:00+01:00',
  lugar: '', // ⚠️ RELLENAR: ciudad / evento de la próxima carrera (si se deja vacío, no se muestra)
}

// Las 8 estaciones del recorrido (entre cada una, 1 km corriendo)
export const HYROX_STATIONS = ['SkiErg', 'Sled Push', 'Sled Pull', 'Burpee Broad Jumps', 'Remo', 'Farmers Carry', 'Sandbag Lunges', 'Wall Balls']

// Fotos: método (foto de la web), vídeo de Barcelona y galería "Así lo vivimos" (fotos de HYROX Barcelona, verticales 3:4).
export const HYROX_PHOTOS = {
  metodo: { src: '/hyrox-cartel.jpg', alt: 'Jaime con el cartel “My first HYROX” en HYROX Barcelona' },
  cuentaAtras: { src: '/hyrox-flex.jpg', alt: 'Jaime marcando bíceps con los dos brazos delante del panel de HYROX' },
}
// Tu HYROX, a tu manera: individual, dobles o dobles mixtos (el plan vale para cualquiera).
export const HYROX_MODES = [
  { title: 'Individual', text: 'Tú contra el recorrido. Todo el ritmo y toda la estrategia, a tu medida.', photo: { src: '/hyrox-podio.jpg', alt: 'Jaime sentado en el podio con el cartel “My first HYROX”' } },
  { title: 'Dobles', text: 'Dos personas, un equipo: os repartís las estaciones y corréis juntos.', photo: { src: '/hyrox-kit.jpg', alt: 'Parches de HYROX Barcelona de la temporada de dobles' } },
  { title: 'Dobles mixtos', text: 'Chico y chica en el mismo equipo. La modalidad que vivimos en Barcelona.', photo: { src: '/hyrox-pareja.jpg', alt: 'Jaime y su pareja de dobles mixtos delante del panel de HYROX' } },
]

export const HYROX_VIDEO = { src: '/hyrox-bcn.mp4', poster: '/hyrox-bcn-poster.jpg' }
// Vídeo de fondo de la portada: montaje de la competición (horizontal, 13 s, sin sonido, en bucle)
export const HYROX_HERO_VIDEO = { src: '/hyrox-comp.mp4', poster: '/hyrox-comp-poster.jpg' }
// Foto grande a todo el ancho entre secciones
export const HYROX_BAND = { src: '/hyrox-barcelona.jpg', alt: 'Jaime marcando bíceps delante del panel de HYROX Barcelona' }

// ⚠️ REVISAR: pies de foto propuestos.
export const HYROX_GALLERY = [
  { src: '/hyrox-barcelona.jpg', alt: 'Jaime marcando bíceps delante del panel de HYROX Barcelona', title: 'HYROX Barcelona · 14/11/2026' },
  { src: '/hyrox-pareja.jpg', alt: 'Jaime y su pareja abrazados delante del panel de HYROX', title: 'Dobles mixtos: mejor en equipo' },
  { src: '/hyrox-podio.jpg', alt: 'Jaime sentado en el podio con el cartel “My first HYROX”', title: 'My first HYROX' },
  { src: '/hyrox-flex.jpg', alt: 'Jaime marcando bíceps con los dos brazos', title: 'Sin postureo, con muchas ganas' },
  { src: '/hyrox-kit.jpg', alt: 'Parches y pulseras del kit de HYROX Barcelona', title: 'El kit de HYROX Barcelona' },
]

// ⚠️ REVISAR: copy propuesto sobre el método (Jaime debe confirmar que describe bien cómo trabaja).
export const HYROX_METHOD = [
  {
    title: 'Cada estación, traducida',
    text: 'Convertimos las 8 estaciones en ejercicios que puedes hacer con lo que hay en cualquier gimnasio: barras, mancuernas, kettlebells, cintas, bicis y remos.',
  },
  {
    title: 'Correr con las piernas cargadas',
    text: 'Trabajamos carrera y fuerza juntas, para que te acostumbres a correr cansado. Que es justo lo que pasa el día de la carrera.',
  },
  {
    title: 'Ritmo y estrategia',
    text: 'Aprendes a repartir el esfuerzo: salir sin quemarte, hacer transiciones rápidas y saber qué hacer cuando llega el bajón.',
  },
  {
    title: 'Con tu fecha en el calendario',
    text: 'El plan se construye hacia tu carrera, adaptado a tu nivel, tus horarios de universitario y el gimnasio que tienes.',
  },
]

export const HYROX_STEPS = [
  { title: 'Hablamos (gratis)', text: 'Primera asesoría sin compromiso: tu nivel, tu fecha y cómo quieres competir (individual, dobles o mixtos).' },
  { title: 'Tu plan, a medida', text: 'Jaime lo diseña para ti: tu punto de partida, tu calendario y el gimnasio donde entrenas.' },
  { title: 'Entrenas con seguimiento', text: 'Seguimiento por WhatsApp y ajustes según cómo te vaya, sin PDF y adiós.' },
  { title: 'Llegas a la salida', text: 'Con ritmos, estrategia y la cabeza tranquila. A disfrutarlo (y a sufrir un poquito, que es HYROX).' },
]

export const HYROX_FOR = [
  { title: 'Nunca has hecho HYROX', text: 'Ni falta que hace. El plan empieza donde estás tú, no donde “deberías” estar.' },
  { title: 'Entrenas en el gym, pero no compites', text: 'Ya tienes la base. Te falta convertirla en una carrera con un plan que tenga sentido.' },
  { title: 'Ya has competido y quieres mejorar', text: 'Más ritmo, mejores transiciones y estaciones que dejen de ser tu punto débil.' },
]

// ⚠️ REVISAR: qué incluye el plan (Jaime debe confirmar el contenido real).
export const HYROX_INCLUDES = [
  'Plan HYROX 100 % personalizado, pensado para un gimnasio normal',
  'Carrera y fuerza integradas, en cuenta atrás hacia tu fecha',
  'Seguimiento por WhatsApp y ajustes del plan',
  'Estrategia y ritmos para el día de la carrera',
  'Individual, dobles o mixtos: el plan se adapta a cómo vayas a competir',
]

export const HYROX_FAQ = [
  {
    q: '¿Necesito material específico de HYROX?',
    a: 'No. El método de Jaime está pensado para entrenar en un gimnasio normal, sin trineo, sin SkiErg y sin ningún material especial de HYROX.',
  },
  {
    q: '¿Y si nunca he hecho HYROX ni he competido?',
    a: 'Perfecto, el plan se adapta a tu nivel. Para eso empezamos con una primera asesoría gratis: le cuentas a Jaime dónde estás y te dice por dónde empezar.',
  },
  {
    q: '¿Cuánto cuesta el plan HYROX?',
    a: 'Es un plan personalizado, así que el precio se consulta con Jaime: depende de tu nivel, de tu fecha y de cómo quieras competir. La primera asesoría es gratis y sin compromiso.',
  },
  {
    q: '¿Individual, dobles o mixtos?',
    a: 'Da igual. Jaime te prepara para cualquier HYROX, vayas solo, en pareja o en dobles mixtos. Cuéntale cómo quieres competir y adapta el plan.',
  },
  {
    q: '¿Cómo funciona el entrenamiento?',
    a: 'Todo online, como el resto de planes: tu plan, tu seguimiento por WhatsApp y tú entrenando en tu gimnasio de siempre.',
  },
  {
    q: '¿Con cuánto tiempo tengo que empezar?',
    a: 'Depende de tu punto de partida y de tu fecha. Cuanto antes empieces, más tranquilo llegarás. Cuéntale a Jaime cuándo es tu carrera y te dice qué tal vas de tiempo.',
  },
]
