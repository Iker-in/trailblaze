import { useState, useEffect } from 'react'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'

function Achievements() {
  const { user } = useAuthStore()
  const [achievements, setAchievements] = useState([])
  const [userAchievements, setUserAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      const [allRes, userRes] = await Promise.all([
        api.get('/achievements'),
        user ? api.get('/users/' + user.username + '/achievements') : Promise.resolve({ data: { achievements: [] } })
      ])
      setAchievements(allRes.data.achievements)
      setUserAchievements(userRes.data.achievements || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const earnedIds = new Set(userAchievements.map((ua) => ua.achievementId))

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-green-800 mb-2">Logros</h1>
        <p className="text-gray-500 mb-6">{earnedIds.size} de {achievements.length} logros obtenidos</p>

        {loading && <div className="text-center py-16 text-green-600">Cargando logros...</div>}

        <div className="grid grid-cols-1 gap-4">
          {achievements.map((achievement) => {
            const earned = earnedIds.has(achievement.id)
            return (
              <div key={achievement.id} className={"bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 " + (earned ? 'border-l-4 border-green-500' : 'opacity-60')}>
                <div className={"w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold " + (earned ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400')}>
                  {earned ? 'ok' : '?'}
                </div>
                <div className="flex-1">
                  <p className={"font-bold " + (earned ? 'text-gray-800' : 'text-gray-400')}>{achievement.name}</p>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <p className={"font-bold " + (earned ? 'text-green-700' : 'text-gray-400')}>+{achievement.points}</p>
                  <p className="text-xs text-gray-400">puntos</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Achievements