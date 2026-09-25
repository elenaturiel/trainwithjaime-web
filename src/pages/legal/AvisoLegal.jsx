import LegalLayout, { A, H2, P, UL } from './LegalLayout.jsx'
import { EMAIL, LEGAL, WHATSAPP_DISPLAY } from '../../config.js'

// ⚠️ REVISAR: completa los datos del titular en src/config.js (LEGAL). Texto orientativo: conviene que lo revise un profesional.
export default function AvisoLegal() {
  return (
    <LegalLayout title="Aviso legal">
      <H2>1. Datos identificativos</H2>
      <P>
        En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio
        Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:
      </P>
      <UL>
        <li>Titular: {LEGAL.owner}, que opera bajo la marca «Train with Jaime».</li>
        <li>NIF: {LEGAL.nif}</li>
        <li>Domicilio: {LEGAL.address}</li>
        <li>
          Email: <A href={`mailto:${EMAIL}`}>{EMAIL}</A>
        </li>
        <li>WhatsApp: {WHATSAPP_DISPLAY}</li>
        <li>Sitio web: {LEGAL.domain}</li>
      </UL>

      <H2>2. Objeto</H2>
      <P>
        Este sitio web informa sobre los servicios de Train with Jaime —planificación de entrenamiento personalizado,
        pautas de alimentación y seguimiento online, principalmente para estudiantes universitarios— y ofrece un canal
        para contactar y solicitar información. El acceso y uso de la web implica la aceptación de este aviso legal.
      </P>

      <H2>3. Uso de la web</H2>
      <P>
        Te comprometes a hacer un uso adecuado y lícito de la web y de sus contenidos, a no emplearlos para actividades
        contrarias a la ley o a la buena fe, y a no dañar, inutilizar o sobrecargar la web ni los sistemas que la
        soportan. Los datos que facilites en los formularios deben ser veraces.
      </P>

      <H2>4. Naturaleza de los servicios y salud</H2>
      <P>
        Jaime es estudiante del Grado en Ciencias de la Actividad Física y del Deporte y no es, por ahora, entrenador
        certificado, médico ni dietista-nutricionista colegiado. Los planes de entrenamiento y las pautas de
        alimentación de Train with Jaime son recomendaciones generales para personas sanas y no sustituyen el
        diagnóstico, tratamiento ni consejo de un profesional sanitario.
      </P>
      <UL>
        <li>
          Antes de empezar cualquier programa de ejercicio, consulta con tu médico, especialmente si tienes alguna
          lesión, enfermedad, estás embarazada o tomas medicación.
        </li>
        <li>
          Las pautas nutricionales no son tratamientos dietéticos de patologías ni trastornos de la conducta
          alimentaria. Si es tu caso, acude a un profesional sanitario.
        </li>
        <li>
          Si durante el entrenamiento notas dolor, mareo o cualquier síntoma anómalo, detente y consulta con un médico.
        </li>
      </UL>

      <H2>5. Precios, descuentos y contratación</H2>
      <P>
        Los precios que aparecen en la web son informativos. La contratación de cualquier plan, la forma de pago, su
        duración y las condiciones de baja se acuerdan directamente con Jaime antes de empezar. Los descuentos (código
        de amigo «squad» y descuento con carné universitario) están sujetos a verificación y a las condiciones que se
        indiquen en cada momento. El primer contacto y asesoramiento es gratuito y sin compromiso.
      </P>

      <H2>6. Propiedad intelectual e industrial</H2>
      <P>
        Los textos, imágenes, vídeos, logotipos, diseño y demás contenidos de la web, así como los planes y materiales
        entregados a los clientes, pertenecen al titular o se usan con autorización. Queda prohibida su reproducción,
        distribución o transformación sin permiso expreso, salvo para uso personal y privado.
      </P>

      <H2>7. Responsabilidad y enlaces</H2>
      <P>
        El titular trabaja para que la información de la web sea correcta y esté actualizada, pero no garantiza la
        ausencia de errores ni la disponibilidad continua de la web. Los enlaces a sitios de terceros (Instagram,
        WhatsApp, etc.) se ofrecen como referencia; el titular no se hace responsable de sus contenidos ni de sus
        políticas.
      </P>

      <H2>8. Legislación aplicable</H2>
      <P>
        Este aviso legal se rige por la legislación española. Para cualquier controversia serán competentes los juzgados
        y tribunales que correspondan conforme a la normativa aplicable; si eres consumidor, los de tu domicilio.
      </P>
    </LegalLayout>
  )
}
