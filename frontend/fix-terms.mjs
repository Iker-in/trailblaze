import { writeFileSync } from "fs"

const content = `import Navbar from "../components/Navbar.jsx"

function TermsAndConditions() {
  return (
    <div style={{minHeight: "100vh", background: "#050B18"}}>
      <Navbar />
      <div style={{maxWidth: "800px", margin: "0 auto", padding: "40px 24px"}}>
        <h1 style={{color: "white", fontSize: "28px", fontWeight: "500", marginBottom: "8px"}}>Terminos y Condiciones</h1>
        <p style={{color: "#4A6480", fontSize: "13px", marginBottom: "40px"}}>Ultima actualizacion: julio 2026</p>

        {[
          {
            title: "1. Aceptacion de los terminos",
            content: "Al crear una cuenta o usar ARVENTRA, aceptas estos Terminos y Condiciones y nuestra Politica de Privacidad. Si no estas de acuerdo, no debes usar la aplicacion."
          },
          {
            title: "2. Descripcion del servicio",
            content: "ARVENTRA es una plataforma comunitaria para descubrir, grabar, compartir y completar rutas de senderismo. El contenido de las rutas (trazados, dificultad, distancia, fotos, condiciones del sendero) es aportado principalmente por otros usuarios de la comunidad, no por ARVENTRA."
          },
          {
            title: "3. Cuentas de usuario",
            content: "Debes proporcionar informacion veridica al registrarte y eres responsable de mantener la seguridad de tu contrasena. ARVENTRA no esta dirigida a menores de 13 anos. Eres responsable de toda actividad que ocurra bajo tu cuenta."
          },
          {
            title: "4. Contenido generado por usuarios",
            content: "Al subir rutas, fotos, comentarios o cualquier otro contenido a ARVENTRA, conservas tus derechos de autor sobre ese contenido, pero nos otorgas una licencia no exclusiva para mostrarlo, distribuirlo y almacenarlo dentro de la aplicacion, con el fin de operar el servicio. No subas contenido que no te pertenezca, que infrinja derechos de terceros, o que sea ofensivo, ilegal o enganoso."
          },
          {
            title: "5. Conducta prohibida",
            content: "No esta permitido: suplantar a otros usuarios, publicar spam o contenido fraudulento, acosar o amenazar a otros miembros de la comunidad, publicar rutas o informacion de condiciones falsas a proposito, o intentar vulnerar la seguridad de la plataforma. Nos reservamos el derecho de eliminar contenido o suspender cuentas que incumplan estas reglas."
          },
          {
            title: "6. Seguridad Outdoor - Descargo de responsabilidad",
            content: "ARVENTRA es una herramienta informativa y social. Las rutas, el estado del sendero y los datos de clima mostrados provienen de la comunidad de usuarios o de servicios meteorologicos de terceros, y pueden no reflejar las condiciones reales en el momento en que decides realizar una actividad.\\n\\nARVENTRA no garantiza la exactitud, seguridad ni vigencia de esta informacion. Antes de iniciar cualquier actividad al aire libre, es tu responsabilidad evaluar el clima, tu condicion fisica, tu equipo y las condiciones reales del terreno, y consultar fuentes oficiales cuando sea posible. El uso de las rutas y de cualquier informacion de la aplicacion es bajo tu propio riesgo.\\n\\nLa funcion de seguimiento en vivo es una herramienta de acompanamiento entre usuarios y NO sustituye a los servicios oficiales de emergencia o rescate. En caso de emergencia real, contacta siempre a los servicios de emergencia de tu localidad."
          },
          {
            title: "7. Propiedad intelectual",
            content: "El nombre ARVENTRA, su logotipo y el diseno de la aplicacion son propiedad de sus creadores. No esta permitido copiar, reproducir o distribuir estos elementos sin autorizacion."
          },
          {
            title: "8. Limitacion de responsabilidad",
            content: "ARVENTRA se proporciona tal cual, sin garantias de ningun tipo. En la maxima medida permitida por la ley, no seremos responsables por lesiones, danos, perdidas o inconvenientes derivados del uso de la aplicacion o de la realizacion de actividades outdoor basadas en informacion obtenida en ARVENTRA."
          },
          {
            title: "9. Terminacion de cuenta",
            content: "Puedes eliminar tu cuenta en cualquier momento desde tu perfil (Perfil > Eliminar mi cuenta), lo cual borra permanentemente tu informacion de forma irreversible. Tambien podemos suspender o eliminar cuentas que incumplan estos terminos."
          },
          {
            title: "10. Cambios a estos terminos",
            content: "Podemos actualizar estos terminos ocasionalmente. Te notificaremos sobre cambios significativos mediante un aviso en la aplicacion."
          },
          {
            title: "11. Contacto",
            content: "Si tienes preguntas sobre estos terminos, contactanos en: soporte.arventra@gmail.com (correo temporal, se actualizara cuando el dominio arventra.app este activo)"
          }
        ].map((section) => (
          <div key={section.title} style={{marginBottom: "32px"}}>
            <h2 style={{color: "#fb923c", fontSize: "16px", fontWeight: "500", marginBottom: "12px"}}>{section.title}</h2>
            <p style={{color: "#6B8CAE", fontSize: "14px", lineHeight: "1.7", whiteSpace: "pre-line", margin: 0}}>{section.content}</p>
          </div>
        ))}

        <div style={{borderTop: "1px solid #1A3050", paddingTop: "24px", marginTop: "40px"}}>
          <p style={{color: "#4A6480", fontSize: "12px", textAlign: "center"}}>© 2026 ARVENTRA. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
`

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/TermsAndConditions.jsx", content)
console.log("TermsAndConditions.jsx creado")
