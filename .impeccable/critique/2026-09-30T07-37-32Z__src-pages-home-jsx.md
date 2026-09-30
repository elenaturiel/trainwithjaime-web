---
target: home
total_score: 19
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 3
target_identity: "file:/home/user/trainwithjaime-web/src/pages/Home.jsx"
target_fingerprint: "sha256:90f941efa8f3c5753231442d8eef822f2c47ff20252f7fea79d0e4fe4bc08e76"
target_path: /home/user/trainwithjaime-web/src/pages/Home.jsx
timestamp: 2026-09-30T07-37-32Z
slug: src-pages-home-jsx
---
⚠️ DEGRADED: single-context (sub-agentes no autorizados explícitamente; A completada antes de ver el detector B)

## Design Health Score (Persuade) — 19/28 (68 %, Aceptable)
| # | Heurística | Nota | Problema clave |
|---|---|---|---|
| 1 | Visibilidad del estado | 3 | Contador de carrusel, menú activo, precio Peak al momento |
| 2 | Lenguaje del usuario | 3 | "test de estudihambre" sin explicar |
| 3 | Control y libertad | 3 | Cookies con rechazar/configurar, Esc en vídeo, carrusel con teclado |
| 4 | Consistencia | 2 | 5 textos para ir a Contacto; galería sin número; Peak explicado dos veces |
| 5 | Prevención de errores | 3 | Selector de semanas de Peak |
| 6 | Reconocer vs recordar | 3 | Descuentos repartidos en 3 sitios |
| 7 | Flexibilidad | n/a | Persuade |
| 8 | Estética y minimalismo | 2 | Precios sobrecargados, eyebrows en todo, placeholders, 4 transiciones |
| 9 | Recuperación de errores | n/a | Sin formulario en la home |
| 10 | Ayuda | n/a | Persuade |

## Veredicto de especificidad
Copy específico; estructura de plantilla de landing (hero → stats → 3 columnas numeradas → galería → gráfica → 3 planes → 3 testimonios → CTA). Falta la cara de Jaime y universitarios reales en el hero.
Detector (URL, 1440x900: 30; 390x844: 29): kicker-above-heading ×7, hero-eyebrow-chip, nested-cards ×6, low-contrast cookie banner sobre vídeo (1.2:1 min), undersized-ui-text 10px "El más elegido", radial-spotlight-glow, line-length ~100ch, all-caps-body ×3, gpt-thin-border-wide-shadow, image-hover-transform ×5.
Falsos positivos: overused-font Inter (fuente elegida por el usuario, el brief gana); low-contrast del H1 en móvil (texto del poster placeholder); clipped-overflow-container (recorte intencionado de ScrollSection).

## Priority Issues
- [P1] Aviso de cookies tapa ~60 % del hero en móvil y su panel translúcido no llega a contraste sobre el vídeo → barra compacta opaca abajo. (adapt)
- [P1] Prueba social falsa: ★★★★★ + "[testimonio real pendiente]" en tira superior y 3 tarjetas → ocultar mientras sean placeholders. (harden)
- [P1] Zona de precios sobrecargada: 3 planes + banda −10 % + Squad + Peak (repetido), 7 CTAs, 6 tarjetas anidadas → planes limpios + una franja de descuentos, quitar bloque Peak duplicado. (distill)
- [P2] Estructura de plantilla: eyebrow + número en cada sección, stats "0 % postureo", brillo radial → quitar eyebrows/números, sustituir stats, quitar glow. (bolder)
- [P2] Acción principal difusa: "Empieza gratis", "Reserva tu llamada", "Contacta con Jaime", "Hazte el test" → un CTA primario "Primera asesoría gratis" + test como secundario. (clarify)

## Persona Red Flags
- Jordan: "test de estudihambre" sin explicar; "Empieza gratis" sugiere prueba del plan; 7 botones en precios.
- Casey: cookies tapan el hero; home de ~10.300 px en móvil; parallax desvanece cifras al leer.
- Riley: estrellas sin reseña, fotos con "/public/gallery-1.jpg", gráfica "Ejemplo".

## Minor Observations
Etiqueta 10 px; líneas de ~100 caracteres en el texto de la galería; borde 1 px + sombra 60 px en bandas; zoom en <img> al hover; 4 tipos de transición de scroll + contadores + cascadas (un solo gesto protagonista).

## Questions to Consider
¿Hero con foto de Jaime y universitarios? ¿Hace falta explicar Peak dos veces? ¿La acción es el test o la asesoría gratis?
