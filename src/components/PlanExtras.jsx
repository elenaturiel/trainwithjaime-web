import { Stagger, StaggerItem } from './Reveal.jsx'
import Button from './Button.jsx'
import { ArrowIcon } from './Icons.jsx'

// Bloques "Squad discount" y "Plan Peak" que van debajo de los precios.
export default function PlanExtras() {
  return (
    <Stagger className="grid gap-5">
      <StaggerItem
        hover
        className="grid gap-8 rounded-2xl border border-brand/50 bg-panel p-7 hover:border-brand md:grid-cols-[1fr_auto] md:items-center md:p-12"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Squad discount</p>
          <h3 className="mt-3 font-display text-4xl uppercase leading-[1.02] md:text-6xl">Entrena con tu gente</h3>
          <p className="mt-4 max-w-2xl text-fg-2">
            Los mejores resultados no se consiguen solo. Si te apuntas con tus amigos, todos ahorráis:
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            <li className="rounded-full border border-line bg-panel-2 px-4 py-2 text-sm text-fg">
              2 amigos entrando juntos = <strong className="text-accent">-15%</strong> cada uno
            </li>
            <li className="rounded-full border border-line bg-panel-2 px-4 py-2 text-sm text-fg">
              3 o más = <strong className="text-accent">-25%</strong> cada uno
            </li>
          </ul>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Alta conjunta, aplicable a Rookie y All In. Ideal para grupos de la uni, compañeros de piso, o equipos que
            entrenan juntos para el mismo evento.
          </p>
        </div>
        <Button to="/contacto?plan=squad" variant="brand">
          Entrar con mi squad <ArrowIcon className="h-4 w-4" />
        </Button>
      </StaggerItem>

      <StaggerItem
        hover
        className="grid gap-8 rounded-2xl border border-brand/50 bg-panel p-7 hover:border-brand md:grid-cols-[1fr_auto] md:items-center md:p-12"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Plan Peak</p>
          <h3 className="mt-3 font-display text-4xl uppercase leading-[1.02] md:text-6xl">Prepárate para tu día</h3>
          <p className="mt-4 max-w-2xl text-fg-2">
            ¿Tienes una fecha en el calendario? Un HYROX, una media maratón, un trail, la San Silvestre, una prueba
            física de oposiciones... El plan PEAK es un pack cerrado de 8, 10 o 12 semanas diseñado alrededor de TU
            evento. Entrenamiento específico, nutrición durante toda la preparación, seguimiento semanal y comunidad
            incluida. Pago único, deadline claro, un solo objetivo: llegar a tu día en tu mejor versión.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            ¿Preparas otra prueba? Consulta con Jaime para entrenamientos de pruebas personalizadas.
          </p>
        </div>
        <Button to="/contacto?plan=peak" variant="secondary">
          Voy a por mi Peak <ArrowIcon className="h-4 w-4" />
        </Button>
      </StaggerItem>
    </Stagger>
  )
}
