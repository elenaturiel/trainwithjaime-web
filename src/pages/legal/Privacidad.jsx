import LegalLayout, { A, H2, P, Table, UL } from './LegalLayout.jsx'
import { EMAIL, LEGAL } from '../../config.js'

// ⚠️ REVISAR: completa los datos del titular en src/config.js (LEGAL) y confirma los plazos de conservación.
// Texto orientativo: conviene que lo revise un profesional.
export default function Privacidad() {
  return (
    <LegalLayout title="Privacidad">
      <P>
        Esta política explica cómo Train with Jaime trata tus datos personales conforme al Reglamento (UE) 2016/679
        (RGPD) y a la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales
        (LOPDGDD).
      </P>

      <H2>1. Responsable del tratamiento</H2>
      <UL>
        <li>Responsable: {LEGAL.owner} («Train with Jaime»)</li>
        <li>NIF: {LEGAL.nif}</li>
        <li>Domicilio: {LEGAL.address}</li>
        <li>
          Email de contacto: <A href={`mailto:${EMAIL}`}>{EMAIL}</A>
        </li>
      </UL>

      <H2>2. Qué datos tratamos</H2>
      <UL>
        <li>
          <strong className="text-fg">Formulario de contacto:</strong> nombre, email, teléfono, qué buscas, tu mensaje,
          el plan que te interesa y si indicas tener carné universitario.
        </li>
        <li>
          <strong className="text-fg">Códigos de amigo:</strong> si pides un código o canjeas uno, guardamos el código
          junto a tu nombre y email para comprobar que cada código se usa una sola vez.
        </li>
        <li>
          <strong className="text-fg">Clientes:</strong> si contratas un plan, los datos necesarios para prestarlo
          (objetivos, nivel, marcas, hábitos, disponibilidad y datos de pago). Si nos cuentas datos de salud (por
          ejemplo, lesiones), solo se usarán para adaptar tu plan y con tu consentimiento explícito.
        </li>
        <li>
          <strong className="text-fg">Navegación:</strong> si aceptas la analítica, estadísticas anónimas y agregadas de
          visitas (ver la política de cookies).
        </li>
      </UL>

      <H2>3. Para qué y con qué base legal</H2>
      <Table
        head={['Finalidad', 'Base legal']}
        rows={[
          ['Responder a tu solicitud y darte el primer asesoramiento gratuito', 'Tu consentimiento (art. 6.1.a RGPD)'],
          ['Generar, comprobar y canjear códigos de amigo y aplicar descuentos', 'Tu consentimiento (art. 6.1.a RGPD)'],
          [
            'Prestar el servicio contratado: planes, seguimiento y acceso a la plataforma de clientes',
            'Ejecución del contrato (art. 6.1.b RGPD); datos de salud: consentimiento explícito (art. 9.2.a RGPD)',
          ],
          ['Facturación y obligaciones fiscales', 'Obligación legal (art. 6.1.c RGPD)'],
          ['Estadísticas de uso de la web', 'Tu consentimiento, que puedes retirar en cualquier momento'],
        ]}
      />
      <P>No tomamos decisiones automatizadas ni elaboramos perfiles con tus datos, y no los usamos para publicidad.</P>

      <H2>4. Cuánto tiempo los guardamos</H2>
      <UL>
        <li>Solicitudes de contacto que no acaban en contratación: hasta 12 meses.</li>
        <li>Códigos de amigo: mientras la promoción esté activa y, como máximo, 24 meses.</li>
        <li>
          Clientes: mientras dure la relación y, después, durante los plazos legales de prescripción y conservación
          fiscal.
        </li>
      </UL>

      <H2>5. Con quién los compartimos</H2>
      <P>
        No vendemos ni cedemos tus datos. Para que la web funcione usamos proveedores que tratan datos por cuenta de
        Train with Jaime (encargados del tratamiento):
      </P>
      <Table
        head={['Proveedor', 'Para qué', 'Ubicación']}
        rows={[
          ['Formspree, Inc.', 'Recibir los formularios y reenviarlos por email', 'EE. UU.'],
          ['Vercel Inc.', 'Alojamiento de la web y analítica de visitas', 'EE. UU. / UE'],
          ['Upstash, Inc.', 'Base de datos de códigos de amigo', 'EE. UU. / UE'],
          ['Google (Gmail y Google Sheets)', 'Correo electrónico y registro de inscripciones', 'EE. UU. / UE'],
          ['WhatsApp (Meta)', 'Comunicación, si nos escribes por WhatsApp', 'EE. UU. / UE'],
        ]}
      />
      <P>
        Cuando hay transferencias internacionales, se amparan en el Marco de Privacidad de Datos UE-EE. UU. o en las
        cláusulas contractuales tipo aprobadas por la Comisión Europea.
      </P>

      <H2>6. Tus derechos</H2>
      <P>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y
        portabilidad, y retirar tu consentimiento en cualquier momento, escribiendo a{' '}
        <A href={`mailto:${EMAIL}`}>{EMAIL}</A> e indicando qué derecho quieres ejercer. Si consideras que no hemos
        tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos (
        <A href="https://www.aepd.es" target="_blank" rel="noreferrer">
          www.aepd.es
        </A>
        ).
      </P>

      <H2>7. Menores de edad</H2>
      <P>
        Los servicios están dirigidos a mayores de 14 años. Si tienes menos de 14 años, necesitas el consentimiento de
        tus padres o tutores para enviarnos tus datos.
      </P>

      <H2>8. Seguridad y cambios</H2>
      <P>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus datos (conexión cifrada, accesos
        limitados). Podemos actualizar esta política; la fecha de la última versión aparece arriba.
      </P>
    </LegalLayout>
  )
}
