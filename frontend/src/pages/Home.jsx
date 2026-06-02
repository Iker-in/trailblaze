import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'

function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-green-50">
        <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-800">TrailBlaze</h1>
          <div className="flex items-center gap-4">
            <a href="/routes" className="text-green-700 font-medium hover:underline text-sm">Ver rutas</a>
            <a href="/routes/create" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800">Publicar ruta</a>
            <a href={`/profile/${user.username}`} className="text-gray-600 text-sm hover:text-green-700">
  Hola, {user.username}
</a>
            <button onClick={handleLogout} className="text-red-600 hover:underline text-sm">
              Cerrar sesion
            </button>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Bienvenido de vuelta, {user.username}</h2>
          <p className="text-green-600 mb-8">Listo para tu proxima aventura?</p>
          <div className="flex gap-4 justify-center">
            <a href="/routes" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800">
              Explorar rutas
            </a>
            <a href="/routes/create" className="border border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-100">
              Publicar ruta
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-green-800 mb-4">TrailBlaze</h1>
        <p className="text-xl text-green-600 mb-8">Descubre, comparte y conquista rutas de senderismo</p>
        <div className="flex gap-4 justify-center">
          <a href="/register" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800">Crear cuenta</a>
          <a href="/login" className="border border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-100">Iniciar sesion</a>
        </div>
      </div>
    </div>
  )
}

export default Home
