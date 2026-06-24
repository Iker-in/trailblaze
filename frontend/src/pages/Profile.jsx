import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getProfile, getUserRoutes, getUserCompletions, followUser, unfollowUser, getFollowStatus, updateProfile } from '../services/users.service.js'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'
import LoginPrompt from '../components/LoginPrompt.jsx'
import LevelBadge from '../components/LevelBadge.jsx'

const DIFFICULTY_STYLES = {
  facil: { background: '#14532d', color: '#86efac' },
  moderado: { background: '#713f12', color: '#fde68a' },
  dificil: { background: '#7c2d12', color: '#fdba74' },
  experto: { background: '#450a0a', color: '#fca5a5' }
}

function Profile() {
  const { username } = useParams()
  const { user: currentUser } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [routes, setRoutes] = useState([])
  const [completions, setCompletions] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('routes')
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [editingBio, setEditingBio] = useState(false)
  const [bioValue, setBioValue] = useState('')
  const [savingBio, setSavingBio] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const isOwnProfile = currentUser?.username === username

  useEffect(() => { loadProfile() }, [username])

  useEffect(() => {
    if (currentUser && profile && !isOwnProfile) {
      getFollowStatus(username).then((data) => setIsFollowing(data.isFollowing)).catch(() => {})
    }
  }, [profile])

  useEffect(() => {
    if (tab === 'stats' && !stats) {
      setStatsLoading(true)
      api.get('/users/' + username + '/stats')
        .then(res => setStats(res.data))
        .catch(() => {})
        .finally(() => setStatsLoading(false))
    }
  }, [tab, username])

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
      const favRes = await api.get('/users/' + username + '/favorites').catch(() => ({ data: { favorites: [] } }))
      setFavorites(favRes.data.favorites || [])
    } catch (err) {
      setError('Usuario no encontrado')
    } finally {
      setLoading(false)
    }
  }

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

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

  const handleAvatarChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  setUploadingAvatar(true)
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await api.patch('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    setProfile((prev) => ({ ...prev, avatarUrl: res.data.user.avatarUrl }))
  } catch (err) {
    alert(err.response?.data?.error || 'Error al subir la imagen')
    console.error(err)
  } finally {
    setUploadingAvatar(false)
  }
}

  if (loading) return <div style={{minHeight: '100vh', background: '#050B18', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p style={{color: '#6B8CAE'}}>Cargando perfil...</p></div>
  if (error) return <div style={{minHeight: '100vh', background: '#050B18', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p style={{color: '#fca5a5'}}>{error}</p></div>



  return (
    <div style={{minHeight: '100vh', background: '#050B18'}}>
      <Helmet>
        <title>{profile.username} - ARVENTRA</title>
        <meta name="description" content={profile.bio || 'Perfil de ' + profile.username + ' en ARVENTRA'} />
        <meta property="og:title" content={profile.username + ' en ARVENTRA'} />
        <meta property="og:description" content={profile.bio || 'Senderista en ARVENTRA'} />
        <meta property="og:url" content={'https://arventra.app/profile/' + profile.username} />
        <meta property="og:type" content="profile" />
      </Helmet>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '16px', padding: '24px', marginBottom: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div style={{position: 'relative', width: '56px', height: '56px'}}>
  {profile.avatarUrl ? (
    <img src={profile.avatarUrl} alt={profile.username} style={{width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f43f5e'}} />
  ) : (
    <div style={{width: '56px', height: '56px', borderRadius: '50%', background: '#f97316', border: '2px solid #f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '500', color: 'white'}}>
      {profile.username[0].toUpperCase()}
    </div>
  )}
  {isOwnProfile && (
    <label style={{position: 'absolute', bottom: 0, right: 0, background: '#fb923c', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px'}}>
      {uploadingAvatar ? '...' : '+'}
      <input type="file" accept="image/*" onChange={handleAvatarChange} style={{display: 'none'}} />
    </label>
  )}
</div>
              <div>
                <h1 style={{color: 'white', fontSize: '20px', fontWeight: '500', margin: 0}}>{profile.username}</h1>
<div style={{marginTop: '6px'}}>
  <LevelBadge points={profile.points} size="sm" />
</div>
                {!editingBio && (
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px'}}>
                    {profile.bio
                      ? <p style={{color: '#6B8CAE', fontSize: '14px', margin: 0}}>{profile.bio}</p>
                      : <p style={{color: '#2A4A6A', fontSize: '13px', margin: 0}}>Sin bio todavia</p>
                    }
                    {isOwnProfile && (
                      <button onClick={() => setEditingBio(true)} style={{color: '#f97316', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: '0'}}>Editar</button>
                    )}
                  </div>
                )}
                {editingBio && (
                  <div style={{marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start'}}>
                    <textarea value={bioValue} onChange={(e) => setBioValue(e.target.value)} maxLength={300} rows={2} placeholder="Escribe algo sobre ti..." style={{background: '#050B18', border: '1px solid #f43f5e', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '13px', outline: 'none', resize: 'none', width: '220px'}} />
                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                      <button onClick={handleSaveBio} disabled={savingBio} style={{background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', opacity: savingBio ? 0.6 : 1}}>{savingBio ? '...' : 'Guardar'}</button>
                      <button onClick={() => setEditingBio(false)} style={{background: 'transparent', color: '#4A6480', border: '1px solid #1A3050', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer'}}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {currentUser && !isOwnProfile && (
              <button onClick={() => { if (!isAuthenticated) { setShowLoginPrompt(true) } else { handleFollow() } }} disabled={followLoading} style={{background: isFollowing ? 'transparent' : '#f97316', color: isFollowing ? '#6B8CAE' : 'white', border: isFollowing ? '1px solid #1A3050' : 'none', borderRadius: '10px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', opacity: followLoading ? 0.6 : 1}}>
                {followLoading ? '...' : isFollowing ? 'Siguiendo' : 'Seguir'}
              </button>
            )}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px'}}>
            {[
              { value: profile.points, label: 'puntos', color: '#fb923c' },
              { value: profile._count.routes, label: 'rutas', color: '#f97316' },
              { value: profile._count.completions, label: 'completadas', color: '#f43f5e' },
              { value: profile._count.followers, label: 'seguidores', color: '#6B8CAE' }
            ].map((stat) => (
              <div key={stat.label} style={{background: '#050B18', borderRadius: '12px', padding: '14px', textAlign: 'center', border: '1px solid #0D1F35'}}>
                <p style={{color: stat.color, fontSize: '22px', fontWeight: '500', margin: 0}}>{stat.value}</p>
                <p style={{color: '#4A6480', fontSize: '12px', margin: 0}}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{display: 'flex', gap: '8px', marginBottom: '20px'}}>
          {['routes', 'completions', 'favorites', 'stats'].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{background: tab === t ? '#f97316' : '#0D1F35', color: tab === t ? 'white' : '#6B8CAE', border: tab === t ? 'none' : '1px solid #1A3050', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}>
              {t === 'routes' ? 'Publicadas (' + routes.length + ')' : t === 'completions' ? 'Completadas (' + completions.length + ')' : t === 'favorites' ? 'Guardadas (' + favorites.length + ')' : '📊 Stats'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {tab === 'routes' && routes.length === 0 && <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#2A4A6A'}}>No ha publicado rutas todavia.</div>}
          {tab === 'routes' && routes.map((route) => (
            <div key={route.id} style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '14px', padding: '16px 20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <p style={{color: 'white', fontWeight: '500', margin: 0}}>{route.title}</p>
                <span style={{...DIFFICULTY_STYLES[route.difficulty], fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500'}}>{route.difficulty}</span>
              </div>
              <div style={{display: 'flex', gap: '16px', fontSize: '13px', color: '#4A6480', marginBottom: '12px'}}>
                <span>{route.distanceKm} km</span>
                <span>completada {route._count.completions} veces</span>
              </div>
              <Link to={'/routes/' + route.id} style={{color: '#f97316', fontSize: '13px', fontWeight: '500', textDecoration: 'none'}}>Ver ruta</Link>
            </div>
          ))}
          {tab === 'completions' && completions.length === 0 && <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#2A4A6A'}}>No ha completado rutas todavia.</div>}
          {tab === 'completions' && completions.map((completion) => (
            <div key={completion.id} style={{background: '#0D1F35', border: '1px solid #1A3050', borderLeft: '3px solid #f43f5e', borderRadius: '14px', padding: '16px 20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <p style={{color: 'white', fontWeight: '500', margin: 0}}>{completion.route.title}</p>
                <span style={{...DIFFICULTY_STYLES[completion.route.difficulty], fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500'}}>{completion.route.difficulty}</span>
              </div>
              <div style={{display: 'flex', gap: '16px', fontSize: '13px', color: '#4A6480', marginBottom: '12px'}}>
                <span>{completion.route.distanceKm} km</span>
                {completion.realTime && <span>{completion.realTime} min</span>}
              </div>
              <Link to={'/routes/' + completion.route.id} style={{color: '#f97316', fontSize: '13px', fontWeight: '500', textDecoration: 'none'}}>Ver ruta</Link>
            </div>
          ))}
          {tab === 'stats' && statsLoading && <div style={{textAlign: 'center', padding: '40px', color: '#6B8CAE'}}>Cargando estadisticas...</div>}
          {tab === 'stats' && !statsLoading && stats && stats.hidden && <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#6B8CAE'}}>Este usuario tiene sus estadisticas privadas.</div>}
          {tab === 'stats' && !statsLoading && stats && !stats.hidden && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {isOwnProfile && (
                <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '14px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#6B8CAE', fontSize: '13px'}}>Estadisticas publicas</span>
                  <button onClick={() => {
                    api.patch('/users/me/stats-visibility', { statsPublic: !stats.statsPublic })
                      .then(() => setStats(s => ({...s, statsPublic: !s.statsPublic})))
                      .catch(() => {})
                  }} style={{background: stats.statsPublic ? '#f97316' : '#1A3050', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', fontWeight: '500'}}>
                    {stats.statsPublic ? 'Publicas' : 'Privadas'}
                  </button>
                </div>
              )}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                {[
                  { label: 'km totales', value: stats.totalKm, color: '#f97316' },
                  { label: 'metros subidos', value: stats.totalElevation + 'm', color: '#fb923c' },
                  { label: 'rutas completadas', value: stats.totalCompletions, color: '#f43f5e' },
                  { label: 'rutas faciles', value: stats.byDifficulty?.facil || 0, color: '#86efac' },
                  { label: 'rutas moderadas', value: stats.byDifficulty?.moderado || 0, color: '#fde68a' },
                  { label: 'rutas expertas', value: (stats.byDifficulty?.dificil || 0) + (stats.byDifficulty?.experto || 0), color: '#fca5a5' }
                ].map(s => (
                  <div key={s.label} style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '12px', padding: '16px', textAlign: 'center'}}>
                    <p style={{color: s.color, fontSize: '28px', fontWeight: '500', margin: '0 0 4px'}}>{s.value}</p>
                    <p style={{color: '#4A6480', fontSize: '12px', margin: 0}}>{s.label}</p>
                  </div>
                ))}
              </div>
              {stats.longestRoute && (
                <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '12px', padding: '16px'}}>
                  <p style={{color: '#6B8CAE', fontSize: '12px', margin: '0 0 4px'}}>Ruta mas larga</p>
                  <p style={{color: 'white', fontSize: '15px', fontWeight: '500', margin: '0 0 2px'}}>{stats.longestRoute.title}</p>
                  <p style={{color: '#f97316', fontSize: '13px', margin: 0}}>{stats.longestRoute.distanceKm} km</p>
                </div>
              )}
              {stats.highestElevation && (
                <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '12px', padding: '16px'}}>
                  <p style={{color: '#6B8CAE', fontSize: '12px', margin: '0 0 4px'}}>Mayor elevacion</p>
                  <p style={{color: 'white', fontSize: '15px', fontWeight: '500', margin: '0 0 2px'}}>{stats.highestElevation.title}</p>
                  <p style={{color: '#fb923c', fontSize: '13px', margin: 0}}>{stats.highestElevation.elevationM} m</p>
                </div>
              )}
            </div>
          )}
          {tab === 'favorites' && favorites.length === 0 && <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#2A4A6A'}}>No hay rutas guardadas todavia.</div>}
          {tab === 'favorites' && favorites.map((route) => (
            <div key={route.id} style={{background: '#0D1F35', border: '1px solid #1A3050', borderLeft: '3px solid #fb923c', borderRadius: '14px', padding: '16px 20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <p style={{color: 'white', fontWeight: '500', margin: 0}}>{route.title}</p>
                <span style={{...DIFFICULTY_STYLES[route.difficulty], fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500'}}>{route.difficulty}</span>
              </div>
              <div style={{display: 'flex', gap: '16px', fontSize: '13px', color: '#4A6480', marginBottom: '12px'}}>
                <span>{route.distanceKm} km</span>
                <span>por {route.user.username}</span>
              </div>
              <Link to={'/routes/' + route.id} style={{color: '#f97316', fontSize: '13px', fontWeight: '500', textDecoration: 'none'}}>Ver ruta</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile