
import { useNavigate } from 'react-router-dom'
import { startTracking, updateTracking, stopTracking } from '../services/tracking.service.js'
import 'leaflet/dist/leaflet.css'
import Navbar from '../components/Navbar.jsx'
import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet'

function MapAutoCenter({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView(position, map.getZoom())
  }, [position])
  return null
}

function RecordRoute() {
  const navigate = useNavigate()
  const [points, setPoints] = useState([])
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState('')
  const [paused, setPaused] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [accuracy, setAccuracy] = useState(null)
  const [speed, setSpeed] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [trackingSessionId, setTrackingSessionId] = useState(null)
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const trackingIntervalRef = useRef(null)
  const [savedSession, setSavedSession] = useState(null)

useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (recording) {
      e.preventDefault()
      e.returnValue = ''
    }
  }
  window.addEventListener('beforeunload', handleBeforeUnload)
  return () => window.removeEventListener('beforeunload', handleBeforeUnload)
}, [recording])

// Detectar cambios de conectividad
  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // Recuperar sesion guardada al montar
  useEffect(() => {
    const saved = localStorage.getItem('arventra_recording_session')
    if (saved) {
      try {
        const session = JSON.parse(saved)
        if (session.points && session.points.length > 1) {
          setSavedSession(session)
        }
      } catch {}
    }
  }, [])

  // Guardar puntos en localStorage continuamente
  useEffect(() => {
    if (recording && points.length > 0) {
      localStorage.setItem('arventra_recording_session', JSON.stringify({
        points,
        elapsedSeconds,
        savedAt: Date.now()
      }))
    }
  }, [points, elapsedSeconds, recording])

const timerRef = useRef(null)
  const watchIdRef = useRef(null)

  

  const startRecording = () => {
    if (!navigator.geolocation) {
      setError('Tu dispositivo no soporta GPS')
      return
    }
    setError('')
    setPoints([])
    setRecording(true)
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
  const { latitude, longitude, altitude, accuracy, speed } = pos.coords
  setPoints((prev) => [...prev, [latitude, longitude, altitude]])
  setAccuracy(accuracy)
  setSpeed(speed)
},
      () => setError('No se pudo obtener tu ubicacion'),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
  }

  const pauseRecording = () => {
  if (watchIdRef.current !== null) {
    navigator.geolocation.clearWatch(watchIdRef.current)
    watchIdRef.current = null
    clearInterval(timerRef.current)
  }
  setPaused(true)
}

const resumeRecording = () => {
  setPaused(false)
  watchIdRef.current = navigator.geolocation.watchPosition(
    (pos) => {
  const { latitude, longitude, altitude, accuracy, speed } = pos.coords
  setPoints((prev) => [...prev, [latitude, longitude, altitude]])
  setAccuracy(accuracy)
  setSpeed(speed)
},
    () => setError('No se pudo obtener tu ubicacion'),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  )
  timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
}

  const stopRecording = () => {
  if (watchIdRef.current !== null) {
    navigator.geolocation.clearWatch(watchIdRef.current)
    watchIdRef.current = null
  }
  setRecording(false)
  setPaused(false)
  clearInterval(timerRef.current)
  localStorage.removeItem('arventra_recording_session')
  if (trackingEnabled) {
    stopTracking().catch(() => {})
    clearInterval(trackingIntervalRef.current)
    setTrackingSessionId(null)
    setTrackingEnabled(false)
  }
}

  const calculateDistance = () => {
    if (points.length < 2) return 0
    let total = 0
    for (let i = 1; i < points.length; i++) {
      const [lat1, lon1] = points[i - 1]
      const [lat2, lon2] = points[i]
      const R = 6371
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
      total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }
    return total
  }

  const calculateElevationGain = () => {
  let gain = 0
  for (let i = 1; i < points.length; i++) {
    const alt1 = points[i - 1][2]
    const alt2 = points[i][2]
    if (alt1 != null && alt2 != null && alt2 > alt1) {
      gain += alt2 - alt1
    }
  }
  return Math.round(gain)
}

  const formatTime = (s) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return (h > 0 ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0')
}

  const handleContinue = () => {
  if (points.length < 2) {
    setError('Necesitas al menos 2 puntos para crear una ruta')
    return
  }
  const distanceKm = calculateDistance().toFixed(2)
  const estimatedTime = Math.round(elapsedSeconds / 60)
  const elevationM = calculateElevationGain()
  const [latitudeStart, longitudeStart] = points[0]
  localStorage.setItem('arventra_track', JSON.stringify({ trackPoints: points, distanceKm, estimatedTime, elevationM, latitudeStart, longitudeStart }))
  navigate('/routes/create')
}

  const center = points.length > 0 ? points[points.length - 1] : [40.4168, -3.7038]

  return (
    <div style={{minHeight: '100vh', background: '#050B18'}}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 style={{color: 'white', fontSize: '24px', fontWeight: '500', marginBottom: '8px'}}>Grabar ruta</h1>
        <p style={{color: '#4A6480', fontSize: '14px', marginBottom: '20px'}}>
  {recording ? (paused ? 'Pausado' : 'Grabando') + ' · ' + formatTime(elapsedSeconds) + ' · ' + calculateDistance().toFixed(2) + ' km · ' + calculateElevationGain() + ' m' : 'Presiona iniciar y comienza a caminar'}
</p>

{recording && accuracy !== null && (
  <div style={{display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap'}}>
    <p style={{color: accuracy <= 15 ? '#86efac' : accuracy <= 30 ? '#fde68a' : '#fca5a5', fontSize: '12px', margin: 0}}>
      {accuracy <= 15 ? 'GPS buena' : accuracy <= 30 ? 'GPS regular' : 'GPS debil'} (±{Math.round(accuracy)}m)
    </p>
    {speed !== null && speed >= 0 && (
      <p style={{color: '#fb923c', fontSize: '12px', margin: 0}}>
        🚀 {(speed * 3.6).toFixed(1)} km/h
      </p>
    )}
  </div>
)}

        {!isOnline && (
          <div style={{background: '#422006', border: '1px solid #f97316', color: '#fdba74', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span>📵</span>
            <span>Modo offline — el GPS sigue grabando, los mapas pueden no cargar</span>
          </div>
        )}

        {savedSession && !recording && (
          <div style={{background: '#071428', border: '1px solid #f43f5e', borderRadius: '12px', padding: '14px', marginBottom: '16px'}}>
            <p style={{color: '#f43f5e', fontSize: '14px', fontWeight: '500', margin: '0 0 8px'}}>Grabacion interrumpida detectada</p>
            <p style={{color: '#6B8CAE', fontSize: '13px', margin: '0 0 12px'}}>{savedSession.points.length} puntos guardados</p>
            <div style={{display: 'flex', gap: '8px'}}>
              <button onClick={() => {
                setPoints(savedSession.points)
                setElapsedSeconds(savedSession.elapsedSeconds || 0)
                setSavedSession(null)
              }} style={{flex: 1, background: '#f43f5e', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '13px', cursor: 'pointer'}}>
                Recuperar
              </button>
              <button onClick={() => {
                localStorage.removeItem('arventra_recording_session')
                setSavedSession(null)
              }} style={{flex: 1, background: '#0D1F35', color: '#6B8CAE', border: '1px solid #1A3050', borderRadius: '8px', padding: '8px', fontSize: '13px', cursor: 'pointer'}}>
                Descartar
              </button>
            </div>
          </div>
        )}

        {error && <div style={{background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '14px'}}>{error}</div>}

        <div style={{borderRadius: '14px', overflow: 'hidden', marginBottom: '20px', border: '1px solid #1A3050', height: '350px'}}>
          <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.length > 0 && <MapAutoCenter position={points[points.length - 1]} />}
            {points.length > 1 && <Polyline positions={points} color="#f97316" weight={4} />}
            {points.length > 0 && <Marker position={points[points.length - 1]} />}
          </MapContainer>
        </div>

        <div style={{display: 'flex', gap: '12px'}}>
  {!recording ? (
    <button onClick={startRecording} style={{flex: 1, background: '#f97316', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '500', fontSize: '15px', cursor: 'pointer'}}>
      Iniciar grabacion
    </button>
  ) : (
    <>
      {!paused ? (
        <button onClick={pauseRecording} style={{flex: 1, background: '#0D1F35', color: '#fb923c', border: '1px solid #1A3050', borderRadius: '12px', padding: '14px', fontWeight: '500', fontSize: '15px', cursor: 'pointer'}}>
          Pausar
        </button>
      ) : (
        <button onClick={resumeRecording} style={{flex: 1, background: '#f97316', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '500', fontSize: '15px', cursor: 'pointer'}}>
          Reanudar
        </button>
      )}
      <button onClick={stopRecording} style={{flex: 1, background: '#450a0a', color: '#fca5a5', border: '1px solid #991b1b', borderRadius: '12px', padding: '14px', fontWeight: '500', fontSize: '15px', cursor: 'pointer'}}>
        Detener
      </button>
    </>
  )}
  {recording && isOnline && (
    <div style={{marginTop: '16px', padding: '14px', background: '#071428', border: '1px solid #1A3050', borderRadius: '12px'}}>
      {!trackingEnabled ? (
        <button onClick={async () => {
          if (points.length > 0) {
            try {
              const [lat, lng] = points[points.length - 1]
              const res = await startTracking(lat, lng)
              setTrackingSessionId(res.data.sessionId)
              setTrackingEnabled(true)
              trackingIntervalRef.current = setInterval(() => {
                if (points.length > 0) {
                  const [la, lo] = points[points.length - 1]
                  updateTracking(la, lo).catch(() => {})
                }
              }, 30000)
            } catch {}
          }
        }} style={{width: '100%', background: '#f43f5e', color: 'white', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer'}}>
          🛡️ Activar seguimiento de seguridad
        </button>
      ) : (
        <div>
          <p style={{color: '#86efac', fontSize: '13px', margin: '0 0 8px'}}>✅ Seguimiento activo</p>
          <p style={{color: '#6B8CAE', fontSize: '12px', margin: '0 0 10px'}}>Comparte este link con tu contacto de emergencia:</p>
          <div style={{background: '#050B18', borderRadius: '8px', padding: '8px 10px', marginBottom: '10px'}}>
            <p style={{color: '#fb923c', fontSize: '11px', margin: 0, wordBreak: 'break-all'}}>
              {window.location.origin + '/#/track/' + trackingSessionId}
            </p>
          </div>
          <button onClick={() => {
            navigator.clipboard.writeText(window.location.origin + '/#/track/' + trackingSessionId)
          }} style={{width: '100%', background: '#0D1F35', color: '#fb923c', border: '1px solid #1A3050', borderRadius: '10px', padding: '8px', fontSize: '13px', cursor: 'pointer'}}>
            Copiar link
          </button>
        </div>
      )}
    </div>
  )}

  {!recording && points.length > 1 && (
    <button onClick={handleContinue} style={{flex: 1, background: '#f43f5e', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '500', fontSize: '15px', cursor: 'pointer'}}>
      Continuar y publicar
    </button>
  )}
</div>
      </div>
    </div>
  )
}

export default RecordRoute