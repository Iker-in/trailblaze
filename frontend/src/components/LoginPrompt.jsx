import { Link } from "react-router-dom"

function LoginPrompt({ message = "Inicia sesion para continuar" }) {
  return (
    <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "14px", padding: "24px", textAlign: "center", margin: "12px 0"}}>
      <p style={{fontSize: "24px", margin: "0 0 8px"}}>🔒</p>
      <p style={{color: "white", fontSize: "15px", fontWeight: "500", margin: "0 0 6px"}}>{message}</p>
      <p style={{color: "#4A6480", fontSize: "13px", margin: "0 0 16px"}}>Crea una cuenta gratis o inicia sesion</p>
      <div style={{display: "flex", gap: "10px", justifyContent: "center"}}>
        <Link to="/register" style={{background: "#f97316", color: "white", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "500", textDecoration: "none"}}>Crear cuenta</Link>
        <Link to="/login" style={{background: "#0D1F35", color: "#6B8CAE", border: "1px solid #1A3050", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", textDecoration: "none"}}>Iniciar sesion</Link>
      </div>
    </div>
  )
}

export default LoginPrompt
