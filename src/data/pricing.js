// Planes de precios.
// ⚠️ REVISAR: las listas de "features" son provisionales — sustituir por las de la
// tabla definitiva de planes. Los botones enlazan a /contacto?plan=<id>.
export const PRICING = [
  {
    id: 'rookie',
    name: 'Rookie',
    price: '24,90€',
    period: '/mes',
    features: ['Plan de entrenamiento personalizado', 'Ajustes mensuales del plan', 'Soporte por WhatsApp'],
  },
  {
    id: 'allin',
    name: 'All In',
    price: '44,90€',
    period: '/mes',
    featured: true,
    badge: 'Más elegido',
    features: [
      'Entrenamiento personalizado',
      'Nutrición sin postureo',
      'Seguimiento y ajustes semanales',
      'Soporte por WhatsApp',
    ],
  },
  {
    id: 'peak',
    name: 'Peak',
    price: 'Desde 149€',
    period: '',
    features: ['Todo lo de All In', 'Sesiones presenciales en Pamplona', 'Videollamadas adicionales'],
  },
]
