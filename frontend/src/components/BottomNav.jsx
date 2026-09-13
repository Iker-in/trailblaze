import { NavLink } from "react-router-dom"
import useAuthStore from "../store/authStore.js"

const baseTabs = [
  { to: "/", label: "Inicio", icon: "🏠", end: true },
  { to: "/routes", label: "Rutas", icon: "🥾" },
  { to: "/routes/create", label: "Crear", icon: "➕" },
  { to: "/ranking", label: "Ranking", icon: "🏆" }
]

function BottomNav() {
  const { isAuthenticated, user } = useAuthStore()
  const profileTab = isAuthenticated
    ? { to: "/profile/" + user.username, label: "Perfil", icon: "👤" }
    : { to: "/login", label: "Perfil", icon: "👤" }

  const items = [...baseTabs, profileTab]

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#0D1F35",
      borderTop: "1px solid #1A3050",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      height: "60px",
      paddingBottom: "env(safe-area-inset-bottom)",
      zIndex: 1000
    }}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          style={({ isActive }) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            textDecoration: "none",
            color: isActive ? "#FFB88A" : "#6B8CAE",
            fontSize: "10px",
            fontWeight: isActive ? "600" : "400",
            WebkitTapHighlightColor: "transparent"
          })}
        >
          <span style={{ fontSize: "20px" }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
