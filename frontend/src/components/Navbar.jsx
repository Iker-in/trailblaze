import { useNavigate, Link } from "react-router-dom"
import useAuthStore from "../store/authStore.js"
import NotificationBell from "./NotificationBell.jsx"
import UserSearch from "./UserSearch.jsx"

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav style={{background: "#160d28", borderBottom: "1px solid #ec4899", padding: "0 24px", height: "60px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <Link to="/" style={{display: "flex", alignItems: "center", gap: "10px", textDecoration: "none"}}>
        <img src="/logo.png" alt="ARVENTRA" style={{width: "38px", height: "38px", borderRadius: "8px"}} />
        <span style={{color: "#fbbf24", fontSize: "20px", fontWeight: "bold", letterSpacing: "1px"}}>ARVENTRA</span>
      </Link>
      <div style={{display: "flex", alignItems: "center", gap: "24px"}}>
        <UserSearch />
        <Link to="/routes" style={{color: "#fbbf24", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>Rutas</Link>
        <Link to="/ranking" style={{color: "#fbbf24", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>Ranking</Link>
        <Link to="/achievements" style={{color: "#fbbf24", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>Logros</Link>
        {isAuthenticated ? (
          <>
            <Link to="/routes/create" style={{background: "#f97316", color: "white", padding: "7px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", textDecoration: "none", border: "1px solid #ec4899"}}>
              Publicar ruta
            </Link>
            <NotificationBell />
            <Link to={"/profile/" + user.username} style={{color: "#ec4899", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>
              {user.username}
            </Link>
            <button onClick={handleLogout} style={{color: "#a78bb5", fontSize: "13px", background: "none", border: "none", cursor: "pointer"}}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{color: "#fbbf24", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>Iniciar sesion</Link>
            <Link to="/register" style={{background: "#fbbf24", color: "#160d28", padding: "7px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", textDecoration: "none"}}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
