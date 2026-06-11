import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, getUserRoutes, getUserCompletions, followUser, unfollowUser, getFollowStatus } from '../services/users.service.js'
import useAuthStore from '../store/authStore.js'
import { Helmet } from 'react-helmet-async'

const DIFFICULTY_COLORS = {
  facil: 'bg-green-100 text-green-800',
  moderado: 'bg-yellow-100 text-yellow-800',
  dificil: 'bg-orange-100 text-orange-800',
  experto: 'bg-red-100 text-red-800'
}

function Profile() {
  const { username } = useParams()
  const { user: currentUser } = useAuthStore()

  const [profile, setProfile] = useState(null)
  const [routes, setRoutes] = useState([])
  const [completions, setCompletions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('routes')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  const isOwnProfile = currentUser?.username === username

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const [profileData, routesData, completionsData] = await Promise.all([
        getProfile(username),
        getUserRoutes(username),
        getUserCompletions(username)
      ])
      setProfile(profileData.user)
      setRoutes(routesData.routes)
      setCompletions(completionsData.completions)
    } catch (err) {
      setError('Usuario no encontrado')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-green-600">Cargando perfil...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <a href="/routes" className="text-green-700 hover:underline">Ver rutas</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-bold text-green-800">TrailBlaze</a>
        <a href="/routes" className="text-green-700 hover:underline text-sm">Explorar rutas</a>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-2xl font-bold text-green-800">
              {profile.username[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{profile.username}</h1>
              {profile.bio && <p className="text-gray-500 mt-1">{profile.bio}</p>}
              {!profile.bio && isOwnProfile && (
                <p className="text-gray-400 text-sm mt-1">Agrega una bio a tu perfil</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 bg-green-50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">{profile.points}</p>
              <p className="text-xs text-gray-500">puntos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">{profile._count.routes}</p>
              <p className="text-xs text-gray-500">rutas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">{profile._count.completions}</p>
              <p className="text-xs text-gray-500">completadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">{profile._count.followers}</p>
              <p className="text-xs text-gray-500">seguidores</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('routes')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${tab === 'routes' ? 'bg-green-700 text-white' : 'bg-white text-gray-600 hover:bg-green-50'}`}
          >
            Rutas publicadas ({routes.length})
          </button>
          <button
            onClick={() => setTab('completions')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${tab === 'completions' ? 'bg-green-700 text-white' : 'bg-white text-gray-600 hover:bg-green-50'}`}
          >
            Rutas completadas ({completions.length})
          </button>
        </div>

        {tab === 'routes' && (
          <div className="flex flex-col gap-4">
            {routes.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center text-gray-400">
                No ha publicado rutas todavia.
              </div>
            )}
            {routes.map((route) => (
              <div key={route.id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{route.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${DIFFICULTY_COLORS[route.difficulty]}`}>
                    {route.difficulty}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500 mb-3">
                  <span>{route.distanceKm} km</span>
                  <span>completada {route._count.completions} veces</span>
                </div>
                <a href={`/routes/${route.id}`} className="text-green-700 text-sm font-medium hover:underline">
                  Ver ruta
                </a>
              </div>
            ))}
          </div>
        )}

        {tab === 'completions' && (
          <div className="flex flex-col gap-4">
            {completions.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center text-gray-400">
                No ha completado rutas todavia.
              </div>
            )}
            {completions.map((completion) => (
              <div key={completion.id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{completion.route.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${DIFFICULTY_COLORS[completion.route.difficulty]}`}>
                    {completion.route.difficulty}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500 mb-3">
                  <span>{completion.route.distanceKm} km</span>
                  {completion.realTime && <span>{completion.realTime} min</span>}
                </div>
                <a href={`/routes/${completion.route.id}`} className="text-green-700 text-sm font-medium hover:underline">
                  Ver ruta
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile