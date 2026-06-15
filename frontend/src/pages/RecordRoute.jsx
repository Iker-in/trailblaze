import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '../components/Navbar.jsx'

function RecordRoute() {
  const navigate = useNavigate()
  const [points, setPoints] = useState([])
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState('')
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
        const { latitude, longitude } = pos.coords
        setPoints((prev) => [...prev, [latitude, longitude]])
      },
      () => setError('No se pudo obtener tu ubicacion'),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )
  }

  const stopRecording = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setRecording(false)
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

  const handleContinue = () => {
    if (points.length < 2) {
      setError('Necesitas al menos 2 puntos para crear una ruta')
      return
    }
    const distanceKm = calculateDistance().toFixed(2)
    const [latitudeStart, longitudeStart] = points[0]
    sessionStorage.setItem('arventra_track', JSON.stringify({ trackPoints: points, distanceKm, latitudeStart, longitudeStart }))
    navigate('/routes/create')
  }

  const center = points.length > 0 ? points[points.length - 1] : [40.4168, -3.7038]

  return (
    <div style={{minHeight: '100vh', background: '#160d28'}}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 style={{color: 'white', fontSize: '24px', fontWeight: '500', marginBottom: '8px'}}>Grabar ruta</h1>
        <p style={{color: '#8b7aa3', fontSize: '14px', marginBottom: '20px'}}>
          {recording ? 'Grabando... ' + points.length + ' puntos ? ' + calculateDistance().toFixed(2) + ' km' : 'Presiona iniciar y comienza a caminar'}
        </p>

        {error && <div style={{background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '14px'}}>{error}</div>}

        <div style={{borderRadius: '14px', overflow: 'hidden', marginBottom: '20px', border: '1px solid #3d2a5c', height: '350px'}}>
          <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
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
            <button onClick={stopRecording} style={{flex: 1, background: '#450a0a', color: '#fca5a5', border: '1px solid #991b1b', borderRadius: '12px', padding: '14px', fontWeight: '500', fontSize: '15px', cursor: 'pointer'}}>
              Detener
            </button>
          )}
          {!recording && points.length > 1 && (
            <button onClick={handleContinue} style={{flex: 1, background: '#ec4899', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '500', fontSize: '15px', cursor: 'pointer'}}>
              Continuar y publicar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecordRoute