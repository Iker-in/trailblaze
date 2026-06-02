import { useState, useEffect } from 'react'
import { getRoutes } from '../services/routes.service.js'
import useAuthStore from '../store/authStore.js'

const DIFFICULTY_COLORS = {
  facil: 'bg-green-100 text-green-800',
  moderado: 'bg-yellow-100 text-yellow-800',
  dificil: 'bg-orange-100 text-orange-800',
  experto: 'bg-red-100 text-red-800'
}

function Routes() {
  const { isAuthenticated } = useAuthStore()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [difficulty, setDifficulty] = useState('')

  useEffect(() => {
    loadRoutes()
  }, [difficulty])

  const loadRoutes = async () => {
    setLoading(true)
    try {
      const params = {}
      if (difficulty) params.difficulty = difficulty
      const data = await getRoutes(params)
      setRoutes(data.routes)
    } catch (err) {
      setError('Error al cargar las rutas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-bold text-green-800">TrailBlaze</a>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <a href="/routes/create" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800">
              Publicar ruta
            </a>
          ) : (
            <a href="/login" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800">
              Iniciar sesion
            </a>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">Rutas de senderismo</h1>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todas las dificultades</option>
            <option value="facil">Facil</option>
            <option value="moderado">Moderado</option>
            <option value="dificil">Dificil</option>
            <option value="experto">Experto</option>
          </select>
        </div>

        {loading && (
          <div className="text-center py-16 text-green-600">Cargando rutas...</div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        {!loading && routes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No hay rutas todavia.</p>
            {isAuthenticated && (
              <a href="/routes/create" className="mt-4 inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800">
                Publica la primera
              </a>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {routes.map((route) => (
            <div key={route.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-800">{route.title}</h2>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIFFICULTY_COLORS[route.difficulty]}`}>
                  {route.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{route.description}</p>
              <div className="flex gap-6 text-sm text-gray-500 mb-4">
                <span>distancia: {route.distanceKm} km</span>
                {route.elevationM && <span>elevacion: {route.elevationM} m</span>}
                {route.estimatedTime && <span>tiempo: {route.estimatedTime} min</span>}
                <span>completada: {route._count.completions} veces</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">por {route.user.username}</span>
                <a href={`/routes/${route.id}`} className="text-green-700 font-semibold text-sm hover:underline">
                  Ver ruta
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Routes