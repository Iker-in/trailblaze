import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'

function Home() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        {isAuthenticated ? (
          <>
            <h2 className="text-3xl font-bold text-green-800 mb-4">Bienvenido de vuelta, {user.username}</h2>
            <p className="text-green-600 mb-8">Listo para tu proxima aventura?</p>
            <div className="flex gap-4 justify-center">
              <a href="/routes" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800">Explorar rutas</a>
              <a href="/routes/create" className="border border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-100">Publicar ruta</a>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-bold text-green-800 mb-4">TrailBlaze</h1>
            <p className="text-xl text-green-600 mb-8">Descubre, comparte y conquista rutas de senderismo</p>
            <div className="flex gap-4 justify-center">
              <a href="/register" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800">Crear cuenta</a>
              <a href="/login" className="border border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-100">Iniciar sesion</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
