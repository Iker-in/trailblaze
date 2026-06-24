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
    <nav style={{background: "#050B18", borderBottom: "1px solid #1A3050", padding: "0 24px", height: "60px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <Link to="/" style={{display: "flex", alignItems: "center", gap: "10px", textDecoration: "none"}}>
        <img src="/logo.png" alt="ARVENTRA" style={{width: "38px", height: "38px", borderRadius: "8px"}} />
        <span style={{color: "#fb923c", fontSize: "20px", fontWeight: "bold", letterSpacing: "1px"}}>ARVENTRA</span>
      </Link>
      <div style={{display: "flex", alignItems: "center", gap: "24px"}}>
        <UserSearch />
        <Link to="/routes" style={{color: "#fb923c", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>Rutas</Link>
        <Link to="/ranking" style={{color: "#fb923c", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>Ranking</Link>
        <Link to="/achievements" style={{color: "#fb923c", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>Logros</Link>
        {isAuthenticated ? (
          <>
            <Link to="/routes/create" style={{background: "#f97316", color: "white", padding: "7px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", textDecoration: "none", border: "none"}}>
              Publicar ruta
            </Link>
            <NotificationBell />
            <Link to={"/profile/" + user.username} style={{color: "#f43f5e", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>
              {user.username}
            </Link>
            <button onClick={handleLogout} style={{color: "#6B8CAE", fontSize: "13px", background: "none", border: "none", cursor: "pointer"}}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{color: "#fb923c", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>Iniciar sesion</Link>
            <Link to="/register" style={{background: "#fb923c", color: "#050B18", padding: "7px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", textDecoration: "none"}}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
