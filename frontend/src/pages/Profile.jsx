import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, getUserRoutes, getUserCompletions, followUser, unfollowUser, getFollowStatus, updateProfile } from '../services/users.service.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'

const DIFFICULTY_STYLES = {
  facil: { background: '#14532d', color: '#86efac' },
  moderado: { background: '#713f12', color: '#fde68a' },
  dificil: { background: '#7c2d12', color: '#fdba74' },
  experto: { background: '#450a0a', color: '#fca5a5' }
}

function Profile() {
  const { username } = useParams()
  const { user: currentUser, login } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [routes, setRoutes] = useState([])
  const [completions, setCompletions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('routes')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [editingBio, setEditingBio] = useState(false)
  const [bioValue, setBioValue] = useState('')
  const [savingBio, setSavingBio] = useState(false)

  const isOwnProfile = currentUser?.username === username

  useEffect(() => { loadProfile() }, [username])

  useEffect(() => {
    if (currentUser && profile && !isOwnProfile) {
      getFollowStatus(username).then((data) => setIsFollowing(data.isFollowing)).catch(() => {})
    }
  }, [profile])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const [profileData, routesData, completionsData] = await Promise.all([
        getProfile(username),
        getUserRoutes(username),
        getUserCompletions(username)
      ])
      setProfile(profileData.user)
      setBioValue(profileData.user.bio || '')
      setRoutes(routesData.routes)
      setCompletions(completionsData.completions)
    } catch (err) {
      setError('Usuario no encontrado')
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    setFollowLoading(true)
    try {
      if (isFollowing) {
        await unfollowUser(username)
        setIsFollowing(false)
        setProfile((prev) => ({ ...prev, _count: { ...prev._count, followers: prev._count.followers - 1 } }))
      } else {
        await followUser(username)
        setIsFollowing(true)
        setProfile((prev) => ({ ...prev, _count: { ...prev._count, followers: prev._count.followers + 1 } }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setFollowLoading(false)
    }
  }

  const handleSaveBio = async () => {
    setSavingBio(true)
    try {
      const data = await updateProfile({ bio: bioValue })
      setProfile((prev) => ({ ...prev, bio: data.user.bio }))
      setEditingBio(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingBio(false)
    }
  }

  if (loading) return <div style={{minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p style={{color: '#94a3b8'}}>Cargando perfil...</p></div>
  if (error) return <div style={{minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p style={{color: '#fca5a5'}}>{error}</p></div>

  return (
    <div style={{minHeight: '100vh', background: '#0f172a'}}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', marginBottom: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div style={{width: '56px', height: '56px', borderRadius: '50%', background: '#7c3aed', border: '2px solid #ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '500', color: 'white'}}>
                {profile.username[0].toUpperCase()}
              </div>
              <div>
                <h1 style={{color: 'white', fontSize: '20px', fontWeight: '500', margin: 0}}>{profile.username}</h1>
                {!editingBio && (
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px'}}>
                    {profile.bio
                      ? <p style={{color: '#94a3b8', fontSize: '14px', margin: 0}}>{profile.bio}</p>
                      : <p style={{color: '#475569', fontSize: '13px', margin: 0}}>Sin bio todavia</p>
                    }
                    {isOwnProfile && (
                      <button onClick={() => setEditingBio(true)} style={{color: '#7c3aed', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: '0'}}>
                        Editar
                      </button>
                    )}
                  </div>
                )}
                {editingBio && (
                  <div style={{marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start'}}>
                    <textarea
                      value={bioValue}
                      onChange={(e) => setBioValue(e.target.value)}
                      maxLength={300}
                      rows={2}
                      placeholder="Escribe algo sobre ti..."
                      style={{background: '#0f172a', border: '1px solid #ec4899', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '13px', outline: 'none', resize: 'none', width: '220px'}}
                    />
                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                      <button onClick={handleSaveBio} disabled={savingBio} style={{background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', opacity: savingBio ? 0.6 : 1}}>
                        {savingBio ? '...' : 'Guardar'}
                      </button>
                      <button onClick={() => setEditingBio(false)} style={{background: 'transparent', color: '#64748b', border: '1px solid #334155', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer'}}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {currentUser && !isOwnProfile && (
              <button onClick={handleFollow} disabled={followLoading} style={{background: isFollowing ? 'transparent' : '#7c3aed', color: isFollowing ? '#94a3b8' : 'white', border: isFollowing ? '1px solid #334155' : 'none', borderRadius: '10px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', opacity: followLoading ? 0.6 : 1}}>
                {followLoading ? '...' : isFollowing ? 'Siguiendo' : 'Seguir'}
              </button>
            )}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px'}}>
            {[
              { value: profile.points, label: 'puntos', color: '#eab308' },
              { value: profile._count.routes, label: 'rutas', color: '#7c3aed' },
              { value: profile._count.completions, label: 'completadas', color: '#ec4899' },
              { value: profile._count.followers, label: 'seguidores', color: '#94a3b8' }
            ].map((stat) => (
              <div key={stat.label} style={{background: '#0f172a', borderRadius: '12px', padding: '14px', textAlign: 'center', border: '1px solid #1e293b'}}>
                <p style={{color: stat.color, fontSize: '22px', fontWeight: '500', margin: 0}}>{stat.value}</p>
                <p style={{color: '#64748b', fontSize: '12px', margin: 0}}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{display: 'flex', gap: '8px', marginBottom: '20px'}}>
          {['routes', 'completions'].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{background: tab === t ? '#7c3aed' : '#1e293b', color: tab === t ? 'white' : '#94a3b8', border: tab === t ? 'none' : '1px solid #334155', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}>
              {t === 'routes' ? 'Rutas publicadas (' + routes.length + ')' : 'Completadas (' + completions.length + ')'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {tab === 'routes' && routes.length === 0 && <div style={{background: '#1e293b', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#475569'}}>No ha publicado rutas todavia.</div>}
          {tab === 'routes' && routes.map((route) => (
            <div key={route.id} style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '16px 20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <p style={{color: 'white', fontWeight: '500', margin: 0}}>{route.title}</p>
                <span style={{...DIFFICULTY_STYLES[route.difficulty], fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500'}}>{route.difficulty}</span>
              </div>
              <div style={{display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', marginBottom: '12px'}}>
                <span>{route.distanceKm} km</span>
                <span>completada {route._count.completions} veces</span>
              </div>
              <a href={"/routes/" + route.id} style={{color: '#7c3aed', fontSize: '13px', fontWeight: '500', textDecoration: 'none'}}>Ver ruta</a>
            </div>
          ))}
          {tab === 'completions' && completions.length === 0 && <div style={{background: '#1e293b', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#475569'}}>No ha completado rutas todavia.</div>}
          {tab === 'completions' && completions.map((completion) => (
            <div key={completion.id} style={{background: '#1e293b', border: '1px solid #334155', borderLeft: '3px solid #ec4899', borderRadius: '14px', padding: '16px 20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <p style={{color: 'white', fontWeight: '500', margin: 0}}>{completion.route.title}</p>
                <span style={{...DIFFICULTY_STYLES[completion.route.difficulty], fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500'}}>{completion.route.difficulty}</span>
              </div>
              <div style={{display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', marginBottom: '12px'}}>
                <span>{completion.route.distanceKm} km</span>
                {completion.realTime && <span>{completion.realTime} min</span>}
              </div>
              <a href={"/routes/" + completion.route.id} style={{color: '#7c3aed', fontSize: '13px', fontWeight: '500', textDecoration: 'none'}}>Ver ruta</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
