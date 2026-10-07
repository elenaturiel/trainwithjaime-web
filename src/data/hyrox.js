// Preguntas del formulario HYROX (src/pages/Hyrox.jsx). `value` es lo que se guarda; `label`, lo que se ve.
// Si cambias un `value`, cámbialo también en api/_lib/hyrox.js (NIVELES / CUANDO), que solo acepta estos.
export const NIVEL = {
  title: '¿Cuál es tu nivel?',
  options: [
    { value: 'nunca', label: 'Nunca he hecho HYROX ni nada parecido' },
    { value: 'gimnasio', label: 'Entreno en el gimnasio, pero sin competir' },
    { value: 'competido', label: 'Ya he hecho alguna carrera o HYROX' },
  ],
}

export const CUANDO = {
  title: '¿Cuándo te gustaría hacer tu HYROX?',
  options: [
    { value: '3m', label: 'En los próximos 3 meses' },
    { value: '3-6m', label: 'Entre 3 y 6 meses' },
    { value: 'mas-adelante', label: 'Más adelante' },
    { value: 'curioseando', label: 'Solo estoy curioseando' },
  ],
}
