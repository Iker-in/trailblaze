import Navbar from "../components/Navbar.jsx"

function PrivacyPolicy() {
  return (
    <div style={{minHeight: "100vh", background: "#050B18"}}>
      <Navbar />
      <div style={{maxWidth: "800px", margin: "0 auto", padding: "40px 24px"}}>
        <h1 style={{color: "white", fontSize: "28px", fontWeight: "500", marginBottom: "8px"}}>Política de Privacidad</h1>
        <p style={{color: "#4A6480", fontSize: "13px", marginBottom: "40px"}}>Última actualización: junio 2026</p>

        {[
          {
            title: "1. Información que recopilamos",
            content: `Al usar ARVENTRA recopilamos la siguiente información:
- Datos de cuenta: nombre de usuario, dirección de correo electrónico y contraseña (almacenada de forma segura con cifrado).
- Ubicación GPS: cuando grabas una ruta, recopilamos tus coordenadas de ubicación en tiempo real. Esta información solo se almacena si decides guardar la ruta.
- Fotos: las imágenes que subes a las rutas se almacenan en Cloudinary, un servicio seguro de almacenamiento en la nube.
- Actividad en la app: rutas creadas, completadas, comentarios, seguidores y logros.`
          },
          {
            title: "2. Cómo usamos tu información",
            content: `Usamos tu información para:
- Proporcionar y mejorar el servicio de ARVENTRA.
- Mostrar tu perfil, rutas y estadísticas a otros usuarios según tu configuración de privacidad.
- Enviar notificaciones sobre actividad en tu cuenta (nuevos seguidores, comentarios).
- Calcular tu posición en el ranking y otorgar logros.`
          },
          {
            title: "3. Compartir información con terceros",
            content: `Compartimos datos limitados con los siguientes servicios:
- Cloudinary: almacenamiento de imágenes de perfil y rutas.
- Resend: envío de correos electrónicos de recuperación de contraseña.
- Railway y Supabase: infraestructura de servidores y base de datos.
No vendemos ni compartimos tu información personal con terceros con fines publicitarios.`
          },
          {
            title: "4. Ubicación GPS",
            content: `ARVENTRA solicita acceso a tu ubicación GPS únicamente cuando estás grabando una ruta o usando el seguimiento de seguridad en tiempo real. Puedes desactivar el acceso a la ubicación en la configuración de tu dispositivo en cualquier momento. El seguimiento de seguridad en tiempo real es completamente opcional y solo se activa si tú lo inicias.`
          },
          {
            title: "5. Seguridad",
            content: `Protegemos tu información con:
- Contraseñas cifradas con bcrypt.
- Tokens de autenticación JWT con expiración automática.
- Conexiones HTTPS en todas las comunicaciones.
- Rate limiting para prevenir ataques de fuerza bruta.`
          },
          {
            title: "6. Tus derechos",
            content: `Tienes derecho a:
- Acceder a tu información personal en cualquier momento desde tu perfil.
- Editar tu información de perfil y bio.
- Eliminar tus rutas y comentarios.
- Solicitar la eliminación de tu cuenta enviando un correo a: privacidad@arventra.app`
          },
          {
            title: "7. Menores de edad",
            content: `ARVENTRA no está dirigida a menores de 13 años. No recopilamos intencionalmente información de menores de 13 años. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos.`
          },
          {
            title: "8. Cambios a esta política",
            content: `Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos mediante un aviso en la aplicación. El uso continuado de ARVENTRA después de dichos cambios constituye tu aceptación de la nueva política.`
          },
          {
            title: "9. Contacto",
            content: `Si tienes preguntas sobre esta política de privacidad, contáctanos en: privacidad@arventra.app`
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

export default PrivacyPolicy
