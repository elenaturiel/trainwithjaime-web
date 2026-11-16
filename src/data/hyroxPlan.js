// Textos y datos de la página /entrenamiento-hyrox (src/pages/HyroxPlan.jsx). Todo lo que hay que revisar o rellenar
// está aquí, sin tocar el diseño. Busca ⚠️ para ver lo pendiente.

// Enlace de todos los botones "Quiero mi plan": el formulario de contacto llega con el plan HYROX elegido y apuntando
// a que viene de la página de HYROX (se ve en el aviso del formulario y en el email que recibe Jaime).
export const HYROX_CONTACT = '/contacto?plan=hyrox&origen=hyrox'

// ⚠️ RELLENAR: fecha y detalles de la carrera de Barcelona. Mientras `fecha` esté vacía no se muestra.
export const HYROX_EVENT = {
  nombre: 'HYROX Barcelona',
  modalidad: 'Dobles mixtos',
  fecha: '', // p. ej. '14 de marzo de 2027'
}

// Las 8 estaciones del recorrido (entre cada una, 1 km corriendo)
export const HYROX_STATIONS = ['SkiErg', 'Sled Push', 'Sled Pull', 'Burpee Broad Jumps', 'Remo', 'Farmers Carry', 'Sandbag Lunges', 'Wall Balls']

// ⚠️ FOTOS PROVISIONALES (fotos de la web): sustitúyelas por las de HYROX cuando las pases. Verticales, 3:4.
export const HYROX_PHOTOS = {
  metodo: { src: '/img-11.jpg', alt: 'Jaime entrenando en un gimnasio normal' },
  barcelona: { src: '/img-08.jpg', alt: 'Jaime sonriendo en el gimnasio' },
}

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
  { title: 'Hablamos (gratis)', text: 'Primera asesoría sin compromiso: tu nivel, tu fecha y, si vais en dobles, con quién vas.' },
  { title: 'Tu plan, a medida', text: 'Jaime lo diseña para ti: tu punto de partida, tu calendario y el gimnasio donde entrenas.' },
  { title: 'Entrenas con seguimiento', text: 'Seguimiento por WhatsApp y ajustes según cómo te vaya, sin PDF y adiós.' },
  { title: 'Llegas a la salida', text: 'Con ritmos, estrategia y la cabeza tranquila. A disfrutarlo (y a sufrir un poquito, que es HYROX).' },
]

export const HYROX_FOR = [
  { title: 'Nunca has hecho HYROX', text: 'Ni falta que hace. El plan empieza donde estás tú, no donde “deberías” estar.' },
  { title: 'Entrenas en el gym, pero no compites', text: 'Ya tienes la base. Te falta convertirla en una carrera con un plan que tenga sentido.' },
  { title: 'Vas con tu pareja de equipo', text: 'Dobles mixtos: chico y chica, juntos desde la salida hasta la meta.' },
]

// ⚠️ REVISAR: qué incluye el plan (Jaime debe confirmar el contenido real).
export const HYROX_INCLUDES = [
  'Plan HYROX 100 % personalizado, pensado para un gimnasio normal',
  'Carrera y fuerza integradas, en cuenta atrás hacia tu fecha',
  'Seguimiento por WhatsApp y ajustes del plan',
  'Estrategia y ritmos para el día de la carrera',
  'Si vais en dobles mixtos, el plan tiene en cuenta a los dos',
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
    a: 'Es un plan personalizado, así que el precio se consulta con Jaime: depende de tu nivel, de tu fecha y de si vais en dobles. La primera asesoría es gratis y sin compromiso.',
  },
  {
    q: '¿Tengo que ir en dobles mixtos?',
    a: 'No. Dobles mixtos es la modalidad que proponemos para debutar en Barcelona, pero cuéntale a Jaime cómo quieres competir y adapta el plan.',
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
