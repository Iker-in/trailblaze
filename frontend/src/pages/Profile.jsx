import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getProfile, getUserRoutes, getUserCompletions, followUser, unfollowUser, getFollowStatus, updateProfile } from '../services/users.service.js'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'
import LoginPrompt from '../components/LoginPrompt.jsx'
import LevelBadge from '../components/LevelBadge.jsx'
import AdventureDetailModal from '../components/AdventureDetailModal.jsx'
import AdventureMap from '../components/AdventureMap.jsx'
import DeleteAccountModal from '../components/DeleteAccountModal.jsx'
import Skeleton from '../components/Skeleton.jsx'
import { toast } from 'sonner'
import Coachmark from '../components/Coachmark.jsx'


const MOOD_EMOJIS = {
  increible: '🤩',
  desafiante: '💪',
  relajante: '😌',
  inspiradora: '✨',
  agotadora: '🥵'
}

const DIFFICULTY_STYLES = {
  facil: { background: '#14532d', color: '#86efac' },
  moderado: { background: '#713f12', color: '#fde68a' },
  dificil: { background: '#7c2d12', color: '#fdba74' },
  experto: { background: '#450a0a', color: '#fca5a5' }
}

function Profile() {
  const { username } = useParams()
  const { user: currentUser, isAuthenticated } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [routes, setRoutes] = useState([])
  const [completions, setCompletions] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('routes')
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [activity, setActivity] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(null)
  const [followLoading, setFollowLoading] = useState(false)
  const [editingBio, setEditingBio] = useState(false)
  const [bioValue, setBioValue] = useState('')
  const [savingBio, setSavingBio] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [selectedCompletion, setSelectedCompletion] = useState(null)
  const [completionsView, setCompletionsView] = useState('list')
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const followRequestRef = useRef(false)
  const [completionsHidden, setCompletionsHidden] = useState(false)
const [activityHidden, setActivityHidden] = useState(false)

  const isOwnProfile = currentUser?.username === username

  useEffect(() => { loadProfile() }, [username])

useEffect(() => {
    if (currentUser && profile && !isOwnProfile) {
      getFollowStatus(username).then((data) => setIsFollowing(data.isFollowing)).catch(() => {})
    }
  }, [currentUser, Boolean(profile), isOwnProfile, username])

  useEffect(() => {
    if (tab === 'stats' && !stats) {
      setStatsLoading(true)
      api.get('/users/' + username + '/stats')
        .then(res => setStats(res.data))
        .catch(() => {})
        .finally(() => setStatsLoading(false))
    }
  }, [tab, username])

  useEffect(() => {
    if (tab === 'activity' && activity.length === 0) {
      setActivityLoading(true)
      api.get('/users/' + username + '/activity')
        .then(res => {
          setActivityHidden(!res.data.activityPublic)
          if (!res.data.hidden) setActivity(res.data.activity)
        })
        .catch(() => {})
        .finally(() => setActivityLoading(false))
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
      setCompletions(completionsData.hidden ? [] : completionsData.completions)
      setCompletionsHidden(!completionsData.completionsPublic)
      if (isOwnProfile) {
        const favRes = await api.get('/users/' + username + '/favorites')
        setFavorites(favRes.data.favorites || [])
      } else {
        setFavorites([])
      }
    } catch (err) {
      setError('Usuario no encontrado')
    } finally {
      setLoading(false)
    }
  }

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

 const handleFollow = async () => {
    if (followRequestRef.current || isFollowing === null) return
    followRequestRef.current = true
    const wasFollowing = isFollowing
    setIsFollowing(!wasFollowing)
    setProfile((prev) => ({ ...prev, _count: { ...prev._count, followers: prev._count.followers + (wasFollowing ? -1 : 1) } }))
    try {
      if (wasFollowing) {
        await unfollowUser(username)
      } else {
        await followUser(username)
      }
    } catch (err) {
      setIsFollowing(wasFollowing)
      setProfile((prev) => ({ ...prev, _count: { ...prev._count, followers: prev._count.followers + (wasFollowing ? 1 : -1) } }))
      toast.error('No se pudo actualizar el seguimiento. Intenta de nuevo.')
    } finally {
      followRequestRef.current = false
    }
  }

  const handleSaveBio = async () => {
    setSavingBio(true)
    try {
      const data = await updateProfile({ bio: bioValue })
      setProfile((prev) => ({ ...prev, bio: data.user.bio }))
      setEditingBio(false)
      toast.success('Bio actualizada')
    } catch (err) {
      toast.error('No se pudo guardar la bio. Intenta de nuevo.')
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
    toast.success('Foto de perfil actualizada')
  } catch (err) {
    toast.error(err.response?.data?.error || 'Error al subir la imagen')
  } finally {
    setUploadingAvatar(false)
  }
  }

  if (loading) return (
  <div style={{minHeight: '100vh', background: '#050B18'}}>
    <Navbar />
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '16px', padding: '24px', marginBottom: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px'}}>
          <Skeleton width="56px" height="56px" borderRadius="50%" />
          <div style={{flex: 1}}>
            <Skeleton height="20px" width="140px" style={{marginBottom: '8px'}} />
            <Skeleton height="14px" width="90px" style={{marginBottom: '8px'}} />
            <Skeleton height="14px" width="200px" />
          </div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px'}}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{background: '#050B18', borderRadius: '12px', padding: '14px', border: '1px solid #0D1F35'}}>
              <Skeleton height="22px" width="40px" style={{margin: '0 auto 6px'}} />
              <Skeleton height="11px" width="50px" style={{margin: '0 auto'}} />
            </div>
          ))}
        </div>
      </div>
      <div style={{display: 'flex', gap: '8px', marginBottom: '20px'}}>
        {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} width="100px" height="36px" borderRadius="10px" />)}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
        <Skeleton height="90px" borderRadius="14px" />
        <Skeleton height="90px" borderRadius="14px" />
        <Skeleton height="90px" borderRadius="14px" />
      </div>
    </div>
  </div>
)

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
    <img src={profile.avatarUrl} alt={profile.username} style={{width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7BC47F'}} />
  ) : (
    <div style={{width: '56px', height: '56px', borderRadius: '50%', background: '#F2854D', border: '2px solid #4F9F55', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '500', color: 'white'}}>
      {profile.username[0].toUpperCase()}
    </div>
  )}
  {isOwnProfile && (
    <label style={{position: 'absolute', bottom: 0, right: 0, background: '#FFB88A', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px'}}>
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
                      <button onClick={() => setEditingBio(true)} style={{color: '#F2854D', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: '0'}}>Editar</button>
                    )}
                  </div>
                )}
                {editingBio && (
                  <div style={{marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start'}}>
                    <textarea value={bioValue} onChange={(e) => setBioValue(e.target.value)} maxLength={300} rows={2} placeholder="Escribe algo sobre ti..." style={{background: '#050B18', border: '1px solid #4F9F55', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '13px', outline: 'none', resize: 'none', width: '220px'}} />
                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                      <button onClick={handleSaveBio} disabled={savingBio} style={{background: '#F2854D', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', opacity: savingBio ? 0.6 : 1}}>{savingBio ? '...' : 'Guardar'}</button>
                      <button onClick={() => setEditingBio(false)} style={{background: 'transparent', color: '#4A6480', border: '1px solid #1A3050', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer'}}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
           {currentUser && !isOwnProfile && (
              isFollowing === null ? (
                <Skeleton width="88px" height="36px" borderRadius="10px" />
              ) : (
                <button onClick={() => { if (!isAuthenticated) { setShowLoginPrompt(true) } else { handleFollow() } }} style={{background: isFollowing ? 'transparent' : '#F2854D', color: isFollowing ? '#6B8CAE' : 'white', border: isFollowing ? '1px solid #1A3050' : 'none', borderRadius: '10px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'transform 0.15s ease'}}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)' }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {isFollowing ? 'Siguiendo' : 'Seguir'}
                </button>
              )
            )}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px'}}>
            {[
              { value: profile.points, label: 'puntos', color: '#FFB88A' },
              { value: profile._count.routes, label: 'rutas', color: '#FFB88A' },
              { value: profile._count.completions, label: 'completadas', color: '#7BC47F' },
              { value: profile._count.followers, label: 'seguidores', color: '#6B8CAE' }
            ].map((stat) => (
              <div key={stat.label} style={{background: '#050B18', borderRadius: '12px', padding: '14px', textAlign: 'center', border: '1px solid #0D1F35'}}>
                <p style={{color: stat.color, fontSize: '22px', fontWeight: '500', margin: 0}}>{stat.value}</p>
                <p style={{color: '#4A6480', fontSize: '12px', margin: 0}}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {isOwnProfile && (
          <div style={{textAlign: 'right', marginBottom: '12px'}}>
            <button onClick={() => setShowDeleteAccount(true)} style={{background: 'none', border: 'none', color: '#4A6480', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline'}}>
              Eliminar mi cuenta
            </button>
          </div>
        )}

        <div style={{display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap'}}>

          {['routes', 'completions', ...(isOwnProfile ? ['favorites'] : []), 'stats', 'activity'].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{background: tab === t ? '#F2854D' : '#0D1F35', color: tab === t ? 'white' : '#6B8CAE', border: tab === t ? 'none' : '1px solid #1A3050', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}>
              {t === 'routes' ? 'Publicadas (' + routes.length + ')' : t === 'completions' ? 'Completadas (' + completions.length + ')' : t === 'favorites' ? 'Guardadas (' + favorites.length + ')' : t === 'stats' ? '📊 Stats' : '📈 Actividad'}
            </button>
          ))}
          {tab === 'completions' && (
            <div style={{display: 'flex', gap: '4px', marginLeft: 'auto', alignItems: 'center'}}>
              <button onClick={() => setCompletionsView('list')} style={{background: completionsView === 'list' ? '#1A3050' : 'transparent', color: completionsView === 'list' ? 'white' : '#6B8CAE', border: '1px solid #1A3050', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer'}}>📋 Lista</button>
              <Coachmark id="mapa_recuerdos" text="Mira todas tus aventuras en un mapa interactivo">
                <button onClick={() => setCompletionsView('map')} style={{background: completionsView === 'map' ? '#1A3050' : 'transparent', color: completionsView === 'map' ? 'white' : '#6B8CAE', border: '1px solid #1A3050', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer'}}>🗺️ Mapa</button>
              </Coachmark>
              {isOwnProfile && (
                <button onClick={() => {
                  const newHidden = !completionsHidden
                  setCompletionsHidden(newHidden)
                  api.patch('/users/me/completions-visibility', { completionsPublic: !newHidden })
                    .catch(() => { setCompletionsHidden(!newHidden); toast.error('No se pudo actualizar. Intenta de nuevo.') })
                }} style={{background: completionsHidden ? '#1A3050' : '#F2854D', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer'}}>
                  {completionsHidden ? '🔒 Privadas' : '🔓 Publicas'}
                </button>
              )}
            </div>
          )}
          {tab === 'activity' && isOwnProfile && (
            <button onClick={() => {
              const newHidden = !activityHidden
              setActivityHidden(newHidden)
              api.patch('/users/me/activity-visibility', { activityPublic: !newHidden })
                .catch(() => { setActivityHidden(!newHidden); toast.error('No se pudo actualizar. Intenta de nuevo.') })
            }} style={{marginLeft: 'auto', background: activityHidden ? '#1A3050' : '#F2854D', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer'}}>
              {activityHidden ? '🔒 Privada' : '🔓 Publica'}
            </button>
          )}
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
              <Link to={'/routes/' + route.id} style={{color: '#FFB88A', fontSize: '13px', fontWeight: '500', textDecoration: 'none'}}>Ver ruta</Link>
            </div>
          ))}
         {tab === 'completions' && completionsHidden && !isOwnProfile && <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#2A4A6A'}}>🔒 Este usuario mantiene sus completaciones privadas.</div>}
          {tab === 'completions' && !completionsHidden && completions.length === 0 && <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#2A4A6A'}}>No ha completado rutas todavia.</div>}
          {tab === 'completions' && completionsView === 'map' && completions.length > 0 && (
            <AdventureMap completions={completions} onSelect={setSelectedCompletion} />
          )}
          {tab === 'completions' && completionsView === 'list' && completions.map((completion) => (
  <div key={completion.id} onClick={() => setSelectedCompletion(completion)} style={{background: '#0D1F35', border: '1px solid #1A3050', borderLeft: '3px solid #4F9F55', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer'}}>
    {completion.photos && completion.photos.length > 0 && (
      <img src={completion.photos[0].url} alt="" style={{width: '100%', height: '160px', objectFit: 'cover'}} />
    )}
    <div style={{padding: '16px 20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
        <p style={{color: 'white', fontWeight: '500', margin: 0}}>
          {MOOD_EMOJIS[completion.mood] ? MOOD_EMOJIS[completion.mood] + ' ' : '🏔️ '}
          {completion.title || completion.route.title}
        </p>
        <span style={{...DIFFICULTY_STYLES[completion.route.difficulty], fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500'}}>{completion.route.difficulty}</span>
      </div>
      {completion.title && (
        <p style={{color: '#4A6480', fontSize: '12px', margin: '0 0 8px'}}>{completion.route.title}</p>
      )}
      <div style={{display: 'flex', gap: '16px', fontSize: '13px', color: '#4A6480', marginBottom: '10px'}}>
        <span>{completion.route.distanceKm} km</span>
        {completion.route.elevationM && <span>{completion.route.elevationM} m</span>}
        {completion.realTime && <span>{completion.realTime} min</span>}
        {completion.photos && completion.photos.length > 0 && <span>📸 {completion.photos.length}</span>}
      </div>
      {completion.notes && (
        <p style={{color: '#6B8CAE', fontSize: '13px', fontStyle: 'italic', margin: '0 0 10px', lineHeight: '1.5'}}>"{completion.notes}"</p>
      )}
      <Link to={'/routes/' + completion.route.id} onClick={(e) => e.stopPropagation()} style={{color: '#FFB88A', fontSize: '13px', fontWeight: '500', textDecoration: 'none'}}>Ver ruta</Link>
    </div>
  </div>
))}
          {tab === 'stats' && statsLoading && (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
              {[0, 1, 2, 3, 4, 5].map((index) => <Skeleton key={index} height="88px" borderRadius="12px" />)}
            </div>
          )}
          {tab === 'stats' && !statsLoading && stats && stats.hidden && <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#6B8CAE'}}>Este usuario tiene sus estadisticas privadas.</div>}
          {tab === 'stats' && !statsLoading && stats && !stats.hidden && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {isOwnProfile && (
                <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '14px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#6B8CAE', fontSize: '13px'}}>Estadisticas publicas</span>
                  <button onClick={() => {
                    setStats(s => ({...s, statsPublic: !s.statsPublic}))
                    api.patch('/users/me/stats-visibility', { statsPublic: !stats.statsPublic })
                      .catch(() => { setStats(s => ({...s, statsPublic: !s.statsPublic})); toast.error('No se pudo actualizar. Intenta de nuevo.') })
                      .catch(() => {})
                  }} style={{background: stats.statsPublic ? '#F2854D' : '#1A3050', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', fontWeight: '500'}}>
                    {stats.statsPublic ? 'Publicas' : 'Privadas'}
                  </button>
                </div>
              )}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                {[
                  { label: 'km totales', value: stats.totalKm, color: '#FFB88A' },
                  { label: 'metros subidos', value: stats.totalElevation + 'm', color: '#FFB88A' },
                  { label: 'rutas completadas', value: stats.totalCompletions, color: '#7BC47F' },
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
                  <p style={{color: '#FFB88A', fontSize: '13px', margin: 0}}>{stats.longestRoute.distanceKm} km</p>
                </div>
              )}
              {stats.highestElevation && (
                <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '12px', padding: '16px'}}>
                  <p style={{color: '#6B8CAE', fontSize: '12px', margin: '0 0 4px'}}>Mayor elevacion</p>
                  <p style={{color: 'white', fontSize: '15px', fontWeight: '500', margin: '0 0 2px'}}>{stats.highestElevation.title}</p>
                  <p style={{color: '#FFB88A', fontSize: '13px', margin: 0}}>{stats.highestElevation.elevationM} m</p>
                </div>
              )}
            </div>
          )}
          {tab === 'activity' && activityLoading && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {[0, 1, 2].map((index) => <Skeleton key={index} height="64px" borderRadius="12px" />)}
            </div>
          )}
          {tab === 'activity' && !activityLoading && activityHidden && !isOwnProfile && (
            <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#2A4A6A'}}>🔒 Este usuario mantiene su actividad privada.</div>
          )}
          {tab === 'activity' && !activityLoading && !activityHidden && activity.length === 0 && (
            <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#4A6480'}}>Sin actividad reciente.</div>
          )}
          {tab === 'activity' && !activityLoading && activity.map((item, i) => (
            <div key={i} style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'center'}}>
              <span style={{fontSize: '20px'}}>
                {item.type === 'completion' ? '✅' : item.type === 'achievement' ? (item.icon || '🏅') : '🗺️'}
              </span>
              <div style={{flex: 1}}>
                <p style={{color: 'white', fontSize: '13px', fontWeight: '500', margin: '0 0 2px'}}>
                  {item.type === 'completion' ? 'Completó ' + item.routeTitle : item.type === 'achievement' ? 'Ganó logro: ' + item.name : 'Publicó ' + item.routeTitle}
                </p>
                <p style={{color: '#4A6480', fontSize: '11px', margin: 0}}>
                  {new Date(item.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              {(item.type === 'completion' || item.type === 'route') && (
                <Link to={'/routes/' + item.routeId} style={{color: '#FFB88A', fontSize: '12px', textDecoration: 'none'}}>Ver</Link>
              )}
            </div>
          ))}
          {tab === 'favorites' && favorites.length === 0 && <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#2A4A6A'}}>No hay rutas guardadas todavia.</div>}
          {tab === 'favorites' && favorites.map((route) => (
            <div key={route.id} style={{background: '#0D1F35', border: '1px solid #1A3050', borderLeft: '3px solid #FFB88A', borderRadius: '14px', padding: '16px 20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <p style={{color: 'white', fontWeight: '500', margin: 0}}>{route.title}</p>
                <span style={{...DIFFICULTY_STYLES[route.difficulty], fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500'}}>{route.difficulty}</span>
              </div>
              <div style={{display: 'flex', gap: '16px', fontSize: '13px', color: '#4A6480', marginBottom: '12px'}}>
                <span>{route.distanceKm} km</span>
                <span>por {route.user.username}</span>
              </div>
              <Link to={'/routes/' + route.id} style={{color: '#FFB88A', fontSize: '13px', fontWeight: '500', textDecoration: 'none'}}>Ver ruta</Link>
            </div>
          ))}
          {selectedCompletion && <AdventureDetailModal completion={selectedCompletion} onClose={() => setSelectedCompletion(null)} />}
            {showDeleteAccount && <DeleteAccountModal onClose={() => setShowDeleteAccount(false)} />}
        </div>
      </div>
    </div>
  )
}

export default Profile
