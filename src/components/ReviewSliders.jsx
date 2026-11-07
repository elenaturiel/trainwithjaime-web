import Carousel from './Carousel.jsx'
import ReviewCard, { ChangeCard } from './ReviewCard.jsx'

// Dos carruseles separados, con el mismo deslizamiento lento que el de fotos:
//   · ReviewsSlider → reseñas que escriben los clientes (3 a la vez en escritorio, 4 en pantallas grandes)
//   · ChangesSlider → los cambios con foto que sube Jaime
// Si hay pocas para llenar la pantalla se muestran quietas y centradas (un carrusel con 2 tarjetas repetiría las mismas).
const REVIEWS_BASIS = 'basis-[86%] sm:basis-[48%] lg:basis-[32%] xl:basis-[24%]'
const CHANGES_BASIS = 'basis-[72%] sm:basis-[42%] lg:basis-[28%] xl:basis-[23%]'

export function ReviewsSlider({ items, label = 'Reseñas de clientes' }) {
  if (items.length < 5)
    return (
      <div className="grid justify-center gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),24rem))]">
        {items.map((r) => (
          <ReviewCard key={r.id} r={r} />
        ))}
      </div>
    )
  return (
    <Carousel
      items={items}
      label={label}
      noun="reseña"
      inactiveClass="opacity-85"
      interval={7000}
      basis={REVIEWS_BASIS}
      renderItem={(r) => <ReviewCard r={r} />}
    />
  )
}

export function ChangesSlider({ items, label = 'Cambios con foto' }) {
  if (items.length < 3)
    return (
      <div className="grid justify-center gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),20rem))]">
        {items.map((c) => (
          <ChangeCard key={c.id} c={c} />
        ))}
      </div>
    )
  return (
    <Carousel
      items={items}
      label={label}
      noun="cambio"
      interval={6000}
      basis={CHANGES_BASIS}
      renderItem={(c) => <ChangeCard c={c} />}
    />
  )
}
