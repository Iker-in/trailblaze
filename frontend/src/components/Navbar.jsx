import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = async () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <a href="/" className="text-xl font-bold text-green-800">TrailBlaze</a>

      <div className="flex items-center gap-4">
        <a href="/routes" className="text-gray-600 hover:text-green-700 text-sm">Rutas</a>
        <a href="/ranking" className="text-gray-600 hover:text-green-700 text-sm">Ranking</a>

        {isAuthenticated ? (
          <>
            <a href="/routes/create" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800">
              Publicar ruta
            </a>
            <a href={"/profile/" + user.username} className="text-gray-600 hover:text-green-700 text-sm font-medium">
              {user.username}
            </a>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm">
              Salir
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="text-gray-600 hover:text-green-700 text-sm">Iniciar sesion</a>
            <a href="/register" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800">
              Registrarse
            </a>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar