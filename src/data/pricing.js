// Planes de precios. Los botones enlazan a /contacto?plan=<id> (y &semanas=<n> en Peak).
// Los elementos de `features` pueden ser texto o { title, note } (título + frase explicativa debajo).

// ✏️ Editables: plan MVP (precio fundador) y sesión extra.
export const MVP_PRICE = '59,90€'
export const MVP_PRICE_OLD = '64,90€'
export const MVP_BADGE = 'Precio fundador · primeras 6 plazas'
export const EXTRA_SESSION_PRICE = '25 €'

export const PRICING = [
  {
    id: 'rookie',
    name: 'Rookie',
    tagline: 'Empieza a entrenar con cabeza.',
    price: '24,90€',
    period: '/mes',
    cta: 'Empezar con Rookie',
    features: [
      'Plan de entrenamiento personalizado (gym o running, tú eliges)',
      'Actualización cada 4 semanas',
      'Revisión por WhatsApp cada 15 días',
      'Análisis de técnica en vídeo cuando lo necesites',
      'Comunidad WhatsApp: tips semanales + reto mensual',
    ],
  },
  {
    id: 'allin',
    name: 'All In',
    tagline: 'Entrenamiento + nutrición. Todo dentro.',
    price: '44,90€',
    period: '/mes',
    featured: true,
    badge: 'El más elegido',
    cta: 'Voy All In',
    features: [
      'Todo lo de Rookie',
      'Plan nutricional para presupuesto de estudiante',
      'Recetas Mercadona, tuppers, comer fuera sin salirte',
      'Revisión semanal por WhatsApp',
      '1 videollamada al mes con Jaime',
      'Análisis de técnica en vídeo ilimitado',
    ],
  },
  {
    id: 'mvp',
    name: 'MVP',
    tagline: 'Jaime contigo en tus entrenos clave. Tú juegas, él te lleva.',
    price: MVP_PRICE,
    oldPrice: MVP_PRICE_OLD,
    period: '/mes',
    badge: MVP_BADGE,
    cta: 'Voy MVP',
    features: [
      {
        title: 'Todo lo de All In',
        note: 'Incluye la videollamada mensual con Jaime para hablar de tu plan y de todo lo que necesites.',
      },
      {
        title: '2 entrenos al mes en directo con Jaime (~1 h cada uno)',
        note: 'Un añadido de este plan: entrenas y Jaime te acompaña por videollamada durante toda la sesión.',
      },
      'En casa o en el gym: tú eliges dónde entrenas',
      'Corrección de técnica, cargas y ritmo en directo',
      'Jaime revisa tu semana antes de cada sesión, para que el tiempo sea solo de entreno',
      {
        title: 'Resumen de cada sesión en la plataforma',
        note: 'Al acabar, tus 3 objetivos hasta la siguiente sesión quedan guardados.',
      },
      {
        title: 'Test inicial y retest cada 4 semanas',
        note: 'Repetimos las pruebas del principio para que veas cuánto has mejorado.',
      },
      'Respuesta prioritaria por WhatsApp',
      'Plazas limitadas',
    ],
    extra: `¿Quieres más? Sesión extra de 1 h con Jaime: ${EXTRA_SESSION_PRICE}.`,
  },
  {
    id: 'peak',
    name: 'Peak',
    tagline: 'Prepárate para tu día. Fecha, plan y objetivo claros.',
    tag: 'A medida',
    lead: 'Todo lo de MVP, hecho a tu medida.',
    period: '/pack',
    cta: 'Voy a por mi Peak',
    // Pack cerrado: el precio depende de las semanas elegidas.
    options: [
      { weeks: 8, price: '149€', events: '10K' },
      { weeks: 10, price: '179€', events: 'HYROX, media maratón' },
      { weeks: 12, price: '209€', events: 'Trail corto' },
    ],
    note: '¿Preparas otra prueba? Consulta con Jaime para entrenamientos de pruebas personalizadas.',
    defaultWeeks: 10,
    features: [
      'Todo lo de MVP',
      {
        title: 'Sesión de arranque 1:1 (45 min)',
        note: 'Una llamada para conocerte y fijar tu objetivo, tu nivel y tu calendario.',
      },
      'Entrenamiento 100% personalizado para tu evento',
      {
        title: 'Menú y plan nutricional a medida',
        note: 'Se ajusta cada semana según cómo te vaya el entrenamiento.',
      },
      'Análisis de técnica en vídeo ilimitado',
      {
        title: 'Plan del día del evento',
        note: 'Tu guía para el gran día: ritmos, qué comer y beber, y cuándo.',
      },
      'Seguimiento semanal prioritario por WhatsApp',
      'Comunidad WhatsApp incluida',
    ],
  },
]

// Tabla comparativa por bloques: true = incluido, false = no incluido, texto = matiz.
export const COMPARE_GROUPS = [
  {
    title: 'Entrenamiento',
    rows: [
      { label: 'Plan de entrenamiento personalizado', note: 'Gym o running, tú eliges.', values: { rookie: true, allin: true, mvp: true, peak: '100% para tu evento' } },
      { label: 'Análisis de técnica en vídeo', values: { rookie: 'Cuando lo necesites', allin: 'Ilimitado', mvp: 'Ilimitado', peak: 'Ilimitado' } },
      { label: 'Test inicial y retest cada 4 semanas', note: 'Repetimos las pruebas del principio para que veas cuánto has mejorado.', values: { rookie: false, allin: false, mvp: true, peak: true } },
    ],
  },
  {
    title: 'Nutrición',
    rows: [
      { label: 'Plan nutricional', note: 'Pensado para presupuesto de estudiante.', values: { rookie: false, allin: true, mvp: true, peak: 'A medida, ajustado cada semana' } },
      { label: 'Recetas Mercadona, tuppers y comer fuera', values: { rookie: false, allin: true, mvp: true, peak: true } },
    ],
  },
  {
    title: 'Seguimiento con Jaime',
    rows: [
      { label: 'Revisión por WhatsApp', values: { rookie: 'Cada 15 días', allin: 'Semanal', mvp: 'Semanal', peak: 'Semanal prioritaria' } },
      { label: 'Videollamada mensual con Jaime', note: 'Para hablar de tu plan y de todo lo que necesites.', values: { rookie: false, allin: '1 al mes', mvp: '1 al mes', peak: '1 al mes' } },
      { label: 'Entrenos en directo con Jaime', note: 'Por videollamada, durante toda la sesión.', values: { rookie: false, allin: false, mvp: '2 al mes (~1 h)', peak: '2 al mes (~1 h)' } },
      { label: 'Resumen de cada sesión en la plataforma', note: 'Tus 3 objetivos hasta la siguiente sesión quedan guardados.', values: { rookie: false, allin: false, mvp: true, peak: true } },
      { label: 'Respuesta prioritaria por WhatsApp', values: { rookie: false, allin: false, mvp: true, peak: true } },
    ],
  },
  {
    title: 'Para tu evento',
    rows: [
      { label: 'Sesión de arranque 1:1 (45 min)', note: 'Fijamos tu objetivo, tu nivel y tu calendario.', values: { rookie: false, allin: false, mvp: false, peak: true } },
      { label: 'Plan del día del evento', note: 'Ritmos, qué comer y beber, y cuándo.', values: { rookie: false, allin: false, mvp: false, peak: true } },
    ],
  },
  {
    title: 'Comunidad',
    rows: [
      { label: 'Comunidad WhatsApp', note: 'Tips semanales y reto mensual.', values: { rookie: true, allin: true, mvp: true, peak: true } },
    ],
  },
]
