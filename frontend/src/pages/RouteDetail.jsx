import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRoute, completeRoute } from '../services/routes.service.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'
import RouteMap from '../components/RouteMap.jsx'

const DIFFICULTY_STYLES = {
  facil: { background: '#14532d', color: '#86efac' },
  moderado: { background: '#713f12', color: '#fde68a' },
  dificil: { background: '#7c2d12', color: '#fdba74' },
  experto: { background: '#450a0a', color: '#fca5a5' }
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
  const [currentPhoto, setCurrentPhoto] = useState(0)

  useEffect(() => { loadRoute() }, [id])

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
    if (!isAuthenticated) { navigate('/login'); return }
    setCompleting(true)
    try {
      const data = await completeRoute(id)
      setCompleted(true)
      setSuccessMsg(data.message)
      setRoute((prev) => ({ ...prev, _count: { completions: prev._count.completions + 1 } }))
    } catch (err) {
      setError(err.response?.data?.error || 'Error al completar la ruta')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) return <div style={{minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p style={{color: '#94a3b8'}}>Cargando...</p></div>

  if (error && !route) return (
    <div style={{minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <p style={{color: '#fca5a5', fontSize: '18px', marginBottom: '16px'}}>{error}</p>
        <a href="/routes" style={{color: '#7c3aed'}}>Volver a rutas</a>
      </div>
    </div>
  )

  return (
    <div style={{minHeight: '100vh', background: '#0f172a'}}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {successMsg && <div style={{background: '#14532d', border: '1px solid #16a34a', color: '#86efac', borderRadius: '12px', padding: '14px', marginBottom: '20px', fontWeight: '500'}}>{successMsg}</div>}
        {error && <div style={{background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', borderRadius: '12px', padding: '14px', marginBottom: '20px'}}>{error}</div>}

        <div style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden'}}>
          {route.photos && route.photos.length > 0 && (
            <div style={{position: 'relative'}}>
              <img src={route.photos[currentPhoto].url} alt={route.title} style={{width: '100%', height: '280px', objectFit: 'contain', background: '#0f172a'}} />
              {route.photos.length > 1 && (
                <div style={{position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px'}}>
                  {route.photos.map((_, i) => (
                    <button key={i} onClick={() => setCurrentPhoto(i)} style={{width: '8px', height: '8px', borderRadius: '50%', border: 'none', background: i === currentPhoto ? '#eab308' : 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0}} />
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{padding: '28px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
              <h1 style={{color: 'white', fontSize: '26px', fontWeight: '500', margin: 0}}>{route.title}</h1>
              <span style={{...DIFFICULTY_STYLES[route.difficulty], fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: '500', whiteSpace: 'nowrap', marginLeft: '12px'}}>{route.difficulty}</span>
            </div>

            <p style={{color: '#64748b', fontSize: '14px', marginBottom: '20px'}}>
              Publicada por{' '}
              <a href={"/profile/" + route.user.username} style={{color: '#ec4899', textDecoration: 'none', fontWeight: '500'}}>{route.user.username}</a>
            </p>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px'}}>
              {[
                { value: route.distanceKm, label: 'km' },
                route.elevationM && { value: route.elevationM, label: 'metros' },
                route.estimatedTime && { value: route.estimatedTime, label: 'minutos' }
              ].filter(Boolean).map((stat) => (
                <div key={stat.label} style={{background: '#0f172a', borderRadius: '12px', padding: '14px', textAlign: 'center', border: '1px solid #1e293b'}}>
                  <p style={{color: '#eab308', fontSize: '22px', fontWeight: '500', margin: 0}}>{stat.value}</p>
                  <p style={{color: '#64748b', fontSize: '13px', margin: 0}}>{stat.label}</p>
                </div>
              ))}
            </div>

            <RouteMap latitude={route.latitudeStart} longitude={route.longitudeStart} title={route.title} />

            <p style={{color: '#94a3b8', lineHeight: '1.7', marginBottom: '24px'}}>{route.description}</p>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #334155'}}>
              <p style={{color: '#475569', fontSize: '14px', margin: 0}}>Completada {route._count.completions} veces</p>
              {isAuthenticated && route.userId !== user?.id && (
                <button onClick={handleComplete} disabled={completing || completed} style={{background: completed ? '#14532d' : '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', opacity: completing ? 0.6 : 1}}>
                  {completed ? 'Completada' : completing ? 'Guardando...' : 'Marcar como completada'}
                </button>
              )}
              {!isAuthenticated && <a href="/login" style={{background: '#7c3aed', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: '500', fontSize: '14px', textDecoration: 'none'}}>Inicia sesion para completar</a>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteDetail
