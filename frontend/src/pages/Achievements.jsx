import { useState, useEffect } from 'react'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'

function Achievements() {
  const { user } = useAuthStore()
  const [achievements, setAchievements] = useState([])
  const [userAchievements, setUserAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAchievements() }, [])

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
    <div style={{minHeight: '100vh', background: '#050B18'}}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 style={{color: 'white'}} className="text-2xl font-bold mb-2">Logros</h1>
        <p style={{color: '#4A6480', fontSize: '14px', marginBottom: '24px'}}>{earnedIds.size} de {achievements.length} logros obtenidos</p>
        {loading && <div style={{color: '#6B8CAE'}} className="text-center py-16">Cargando logros...</div>}
        <div className="flex flex-col gap-3">
          {achievements.map((achievement) => {
            const earned = earnedIds.has(achievement.id)
            return (
              <div key={achievement.id} style={{background: earned ? '#0D1F35' : '#050B18', border: earned ? '1px solid #1A3050' : '1px solid #0D1F35', borderLeft: earned ? '3px solid #f43f5e' : '3px solid #0D1F35', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', opacity: earned ? 1 : 0.5}}>
                <div style={{width: '42px', height: '42px', borderRadius: '10px', background: earned ? '#4c1d95' : '#0D1F35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', color: earned ? '#c4b5fd' : '#2A4A6A'}}>
                  {earned ? 'ok' : '?'}
                </div>
                <div style={{flex: 1}}>
                  <p style={{color: earned ? 'white' : '#2A4A6A', fontWeight: '500', margin: 0, fontSize: '15px'}}>{achievement.name}</p>
                  <p style={{color: '#4A6480', fontSize: '13px', margin: 0}}>{achievement.description}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{color: earned ? '#f43f5e' : '#2A4A6A', fontWeight: '500', margin: 0}}>+{achievement.points}</p>
                  <p style={{color: '#2A4A6A', fontSize: '12px', margin: 0}}>puntos</p>
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
