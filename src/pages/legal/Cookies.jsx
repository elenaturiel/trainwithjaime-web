import LegalLayout, { A, H2, P, Table } from './LegalLayout.jsx'
import { EMAIL } from '../../config.js'
import { openCookieSettings } from '../../lib/consent.js'

export default function Cookies() {
  return (
    <LegalLayout title="Cookies">
      <H2>1. Qué son</H2>
      <P>
        Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos o datos
        que una web guarda en tu dispositivo para funcionar o para obtener información sobre su uso.
      </P>

      <H2>2. Qué usa esta web</H2>
      <P>
        Esta web no usa cookies publicitarias ni de redes sociales. Las fuentes y el vídeo se sirven desde nuestro
        propio dominio, sin llamadas a terceros.
      </P>
      <Table
        head={['Nombre', 'Tipo', 'Para qué', 'Duración']}
        rows={[
          [
            'twj-cookies-v1',
            'Técnica, propia (almacenamiento local)',
            'Guardar tu elección sobre cookies para no volver a preguntarte',
            'Hasta que la borres',
          ],
          [
            'Vercel Web Analytics',
            'Analítica (Vercel Inc.)',
            'Contar visitas y páginas vistas de forma anónima y agregada. No usa cookies ni identificadores persistentes',
            'Solo si la aceptas',
          ],
        ]}
      />
      <P>
        Los enlaces a Instagram y WhatsApp solo te llevan a esos servicios cuando haces clic; a partir de ahí se aplican
        sus propias políticas de cookies.
      </P>

      <H2>3. Cómo cambiar tu elección</H2>
      <P>
        Puedes aceptar o rechazar la analítica cuando quieras desde{' '}
        <button
          type="button"
          onClick={openCookieSettings}
          className="font-semibold text-fg underline underline-offset-4 hover:text-accent-ink"
        >
          Configurar cookies
        </button>{' '}
        (también en el pie de página). Además, puedes borrar o bloquear el almacenamiento desde la configuración de tu
        navegador.
      </P>

      <H2>4. Contacto</H2>
      <P>
        Si tienes dudas sobre esta política, escríbenos a <A href={`mailto:${EMAIL}`}>{EMAIL}</A>.
      </P>
    </LegalLayout>
  )
}
