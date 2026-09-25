// Planes de precios. Los botones enlazan a /contacto?plan=<id> (y &semanas=<n> en Peak).
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
    id: 'peak',
    name: 'Peak',
    tagline: 'Prepárate para tu día. Fecha, plan y objetivo claros.',
    period: '/pack',
    cta: 'Voy a por mi Peak',
    // Pack cerrado: el precio depende de las semanas elegidas.
    // ⚠️ REVISAR: precio de 8 semanas = 149€ (el "Desde 149€" del brief) y falta su texto de eventos.
    options: [
      { weeks: 8, price: '149€', events: '' },
      { weeks: 10, price: '179€', events: 'HYROX, media maratón' },
      { weeks: 12, price: '209€', events: 'Maratón, trail largo' },
    ],
    defaultWeeks: 10,
    features: [
      'Entrenamiento específico para tu evento',
      'Plan nutricional durante toda la preparación',
      'Seguimiento semanal por WhatsApp',
      'Comunidad WhatsApp incluida',
    ],
  },
]
