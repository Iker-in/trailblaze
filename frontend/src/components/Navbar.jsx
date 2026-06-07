import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import NotificationBell from './NotificationBell.jsx'

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{background: '#0f172a', borderBottom: '1px solid #ec4899', padding: '0 24px', height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <a href="/" style={{color: '#eab308', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}}>TrailBlaze</a>
      <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
        <a href="/routes" style={{color: '#eab308', fontSize: '14px', textDecoration: 'none', fontWeight: '500'}}>Rutas</a>
        <a href="/ranking" style={{color: '#eab308', fontSize: '14px', textDecoration: 'none', fontWeight: '500'}}>Ranking</a>
        <a href="/achievements" style={{color: '#eab308', fontSize: '14px', textDecoration: 'none', fontWeight: '500'}}>Logros</a>
        {isAuthenticated ? (
          <>
            <a href="/routes/create" style={{background: '#7c3aed', color: 'white', padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', textDecoration: 'none', border: '1px solid #ec4899'}}>
              Publicar ruta
            </a>
            <NotificationBell />
            <a href={"/profile/" + user.username} style={{color: '#ec4899', fontSize: '14px', textDecoration: 'none', fontWeight: '500'}}>
              {user.username}
            </a>
            <button onClick={handleLogout} style={{color: '#64748b', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer'}}>
              Salir
            </button>
          </>
        ) : (
          <>
            <a href="/login" style={{color: '#eab308', fontSize: '14px', textDecoration: 'none', fontWeight: '500'}}>Iniciar sesion</a>
            <a href="/register" style={{background: '#eab308', color: '#0f172a', padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none'}}>
              Registrarse
            </a>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
