import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRoute, completeRoute } from '../services/routes.service.js'
import useAuthStore from '../store/authStore.js'

const DIFFICULTY_COLORS = {
  facil: 'bg-green-100 text-green-800',
  moderado: 'bg-yellow-100 text-yellow-800',
  dificil: 'bg-orange-100 text-orange-800',
  experto: 'bg-red-100 text-red-800'
}

function RouteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    loadRoute()
  }, [id])

  const loadRoute = async () => {
    try {
      const data = await getRoute(id)
      setRoute(data.route)
    } catch (err) {
      setError('Ruta no encontrada')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setCompleting(true)
    try {
      const data = await completeRoute(id)
      setCompleted(true)
      setSuccessMsg(data.message)
      setRoute((prev) => ({
        ...prev,
        _count: { completions: prev._count.completions + 1 }
      }))
    } catch (err) {
      setError(err.response?.data?.error || 'Error al completar la ruta')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-green-600">Cargando ruta...</p>
      </div>
    )
  }

  if (error && !route) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <a href="/routes" className="text-green-700 hover:underline">Volver a rutas</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-bold text-green-800">TrailBlaze</a>
        <a href="/routes" className="text-green-700 hover:underline text-sm">Ver todas las rutas</a>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {successMsg && (
          <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6 font-semibold">
            {successMsg}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{route.title}</h1>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${DIFFICULTY_COLORS[route.difficulty]}`}>
              {route.difficulty}
            </span>
          </div>

          <p className="text-gray-500 text-sm mb-6">
            Publicada por <span className="font-medium text-green-700">{route.user.username}</span>
          </p>

          <div className="grid grid-cols-3 gap-4 bg-green-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">{route.distanceKm}</p>
              <p className="text-sm text-gray-500">km</p>
            </div>
            {route.elevationM && (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">{route.elevationM}</p>
                <p className="text-sm text-gray-500">metros elevacion</p>
              </div>
            )}
            {route.estimatedTime && (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">{route.estimatedTime}</p>
                <p className="text-sm text-gray-500">minutos</p>
              </div>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">{route.description}</p>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              Completada {route._count.completions} {route._count.completions === 1 ? 'vez' : 'veces'}
            </p>

            {isAuthenticated && route.userId !== user?.id && (
              <button
                onClick={handleComplete}
                disabled={completing || completed}
                className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50"
              >
                {completed ? 'Completada' : completing ? 'Guardando...' : 'Marcar como completada'}
              </button>
            )}

            {!isAuthenticated && (
              <a href="/login" className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800">
                Inicia sesion para completar
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteDetail