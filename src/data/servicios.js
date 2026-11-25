// Textos y datos de /servicios (única fuente: los componentes de la página no los repiten).
// Los textos largos, las listas cortas ("chips") y los pasos son los de siempre de la web.
// Los precios de los extras son los que ya había (15 € / 25 €).

// Cada servicio es un bloque numerado. `value` coincide con las anclas del menú (/servicios#nutricion…).
// `heading` = [parte ligera, parte en negrita] del titular.
// ⚠️ Fotos: el prototipo pedía foto-5.jpg (nutrición) y foto-3.jpg (comunidad), pero esos archivos son dos fotos casi iguales de
// Jaime con un disco, no de comida ni de gente; se usan las que ya tenía la web y sí muestran el tema (img-31, hyrox-pareja).
export const SERVICES = [
  {
    value: 'entrenamiento',
    label: 'Entrenamiento',
    heading: ['Entrenamiento', 'personalizado.'],
    text: 'Diseño tu plan de entrenamiento desde cero según tu nivel, tus objetivos y el material que tienes disponible. Gym, running, trail, HYROX, obstáculos, o una combinación. Cada rutina se adapta a ti y se actualiza para seguir progresando.',
    chips: ['HYROX', 'Entrenamiento funcional', 'Gym/hipertrofia', 'Running para principiantes', 'Programación a medida'],
    image: '/img-11.jpg',
    alt: 'Jaime en la máquina Smith, agarrando la barra',
    // Enlace amarillo bajo los chips
    link: { to: '/entrenamiento-hyrox', label: 'Jaime te entrena también para tu HYROX →' },
  },
  {
    value: 'nutricion',
    label: 'Nutrición',
    heading: ['Nutrición', 'adaptada a tu vida.'],
    text: 'Planes de nutrición pensados para quien vive en un piso de estudiantes, come tuppers en la uni o cena fuera los fines de semana. Recetas Mercadona, listas de la compra realistas, y estrategias para comer bien sin gastarte lo que no tienes. No es una dieta, es aprender a comer.',
    chips: ['Recetas Mercadona', 'Tuppers', 'Comer fuera', 'Listas de la compra'],
    note: 'Incluida desde el plan All In.',
    image: '/img-31.jpg',
    alt: 'Plato de pollo con verduras salteadas',
  },
  {
    value: 'seguimiento',
    label: 'Seguimiento',
    heading: ['Seguimiento real,', 'no un PDF y adiós.'],
    text: 'Estoy contigo cada semana. Revisiones periódicas por WhatsApp, videollamadas mensuales en el plan All In, y análisis de técnica en vídeo cuando lo necesites, sin coste extra (que estamos para aprender). Si tienes una duda a las 22h antes del entreno de mañana, ¡mándamela!',
    chips: ['Revisión por WhatsApp', 'Videollamada mensual', 'Análisis de técnica en vídeo'],
    image: '/img-26.jpg',
    alt: 'Portátil con el calendario de entrenos en pantalla y una libreta delante',
  },
  {
    value: 'comunidad',
    label: 'Comunidad',
    heading: ['La comunidad de', 'Train with Jaime.'],
    text: 'Train with Jaime tiene su propia plataforma, exclusiva para clientes: ahí gestionas tus entrenos y tu nutrición, y además encuentras entradas de blog, recetas, recomendaciones, un espacio para resolver tus dudas y retos. Y todos los clientes entran también en la Comunidad de WhatsApp: tips semanales de entreno y nutrición, retos mensuales, y un equipo que te empuja cuando la motivación flojea. Aquí no entrenas solo.',
    chips: ['Entrenos', 'Nutrición', 'Blog', 'Recetas', 'Recomendaciones', 'Dudas', 'Retos'],
    image: '/hyrox-pareja.jpg',
    alt: 'Jaime y su pareja de dobles mixtos delante del panel de HYROX Barcelona',
  },
]

export const SPECIALTIES = ['HYROX', 'Funcional', 'Gym', 'Running', 'A tu medida']

// ⚠️ REVISAR: copy propuesto, hecho con lo que ya dice la web (asesoría gratis, plan a medida, seguimiento, progreso).
export const STEPS = [
  { title: 'Primera asesoría gratis', text: 'Le cuentas tu objetivo a Jaime y te dice qué plan te encaja, sin compromiso.' },
  { title: 'Un plan hecho para ti', text: 'Entrenamiento y nutrición diseñados alrededor de tus clases, tus exámenes y tu presupuesto real.' },
  { title: 'Seguimiento de verdad', text: 'Revisiones por WhatsApp, análisis de técnica en vídeo y una plataforma solo para clientes.' },
  { title: 'Resultados que se miden', text: 'Medimos marcas, no likes: registramos tu progreso y ajustamos el plan cuando hace falta.' },
]

// Extras con precio. Una descripción que empieza por "[" está pendiente y NO se muestra (misma convención que config.js).
// ⚠️ TODO (Jaime): confirmar las descripciones de los dos primeros extras. Son las propuestas del prototipo; para publicarlas,
// quita el "[TODO] " del principio.
export const EXTRAS = [
  { label: 'Videollamada extra', value: '15', description: '[TODO] Una videollamada más con Jaime cuando la necesites.' },
  { label: 'Sesión presencial en Pamplona', value: '25', description: '[TODO] Entrena con Jaime en persona.' },
]

export const SUPPLEMENT = {
  big: 'Honesta',
  label: 'Suplementación',
  description: 'Creatina y proteína cuando aportan, sin vender humo.',
}

// Squad: texto de siempre (antes en PlanExtras) y los dos descuentos.
export const SQUAD = {
  title: ['Entrena con', 'tu gente.'],
  intro: 'Los mejores resultados no se consiguen solo. Si te apuntas con tus amigos, todos ahorráis.',
  note: 'Alta conjunta, aplicable a Rookie y All In. Ideal para grupos de la uni, compañeros de piso, o equipos que entrenan juntos para el mismo evento.',
  discounts: [
    { value: '−15%', label: '2 amigos entrando juntos, cada uno' },
    { value: '−25%', label: '3 o más, cada uno' },
  ],
  cta: 'Entrar con mi squad',
  href: '/contacto?plan=squad',
}

// "Prepárate para tu día": pruebas de la lista de siempre (sin plan Peak) y el enlace al plan HYROX.
export const EVENTS = ['10K', 'Media maratón', 'Trail', 'San Silvestre', 'Oposiciones']
export const EVENT_NOTE = '¿Preparas otra prueba? Consulta con Jaime para entrenamientos de pruebas personalizadas.'
