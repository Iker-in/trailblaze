
import { useNavigate, Link } from 'react-router-dom'
import { createRoute, uploadPhoto } from '../services/routes.service.js'
import Navbar from '../components/Navbar.jsx'
import { useState, useEffect } from 'react'

function CreateRoute() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ title: '', description: '', difficulty: 'facil', distanceKm: '', elevationM: '', estimatedTime: '', latitudeStart: '', longitudeStart: '' })
  
const [trackData, setTrackData] = useState(null)

useEffect(() => {
  const saved = sessionStorage.getItem('arventra_track')
  if (saved) {
    const data = JSON.parse(saved)
    setTrackData(data.trackPoints)
    setFormData((prev) => ({
  ...prev,
  distanceKm: data.distanceKm,
  estimatedTime: data.estimatedTime,
  elevationM: data.elevationM,
  latitudeStart: data.latitudeStart,
  longitudeStart: data.longitudeStart
}))
    sessionStorage.removeItem('arventra_track')
  }
}, [])

  const [photos, setPhotos] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    setPhotos(files)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const handleGetLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({ ...prev, latitudeStart: pos.coords.latitude.toFixed(6), longitudeStart: pos.coords.longitude.toFixed(6) }))
        setLocating(false)
      },
      () => { setError('No se pudo obtener la ubicacion'); setLocating(false) }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = trackData ? { ...formData, trackPoints: JSON.stringify(trackData) } : formData
const data = await createRoute(payload)
      const routeId = data.route.id
      for (const photo of photos) { await uploadPhoto(routeId, photo) }
      navigate('/routes/' + routeId)
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? errors[0].msg : err.response?.data?.error || 'Error al crear la ruta')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', background: '#050B18', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { color: '#6B8CAE', fontSize: '13px', display: 'block', marginBottom: '6px' }

  return (
    <div style={{minHeight: '100vh', background: '#050B18'}}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 style={{color: 'white', marginBottom: '24px'}} className="text-2xl font-bold">Publicar nueva ruta</h1>
        {error && <div style={{background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '14px'}}>{error}</div>}
        {!trackData && (
  <Link to="/routes/record" style={{display: 'block', background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '12px', padding: '14px', marginBottom: '16px', textDecoration: 'none', textAlign: 'center', color: '#f97316', fontSize: '14px', fontWeight: '500'}}>
    📍 Grabar ruta con GPS en vivo
  </Link>
)}
{trackData && (
  <div style={{background: '#0D1F35', border: '1px solid #f43f5e', borderRadius: '12px', padding: '12px', marginBottom: '16px', textAlign: 'center', color: '#f43f5e', fontSize: '13px'}}>
    Ruta grabada con {trackData.length} puntos GPS ({formData.distanceKm} km)
  </div>
)}
        <form onSubmit={handleSubmit} style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px'}}>
          <div>
            <label style={labelStyle}>Titulo</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Ruta al Cerro Verde" style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Descripcion</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe la ruta..." rows={4} style={{...inputStyle, resize: 'vertical'}} required />
          </div>
          <div>
            <label style={labelStyle}>Dificultad</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} style={{...inputStyle, cursor: 'pointer'}}>
              <option value="facil">Facil</option>
              <option value="moderado">Moderado</option>
              <option value="dificil">Dificil</option>
              <option value="experto">Experto</option>
            </select>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
            <div style={{flex: 1}}>
              <label style={labelStyle}>Distancia (km)</label>
              <input type="number" name="distanceKm" value={formData.distanceKm} onChange={handleChange} placeholder="5.2" step="0.1" min="0.1" style={inputStyle} required />
            </div>
            <div style={{flex: 1}}>
              <label style={labelStyle}>Elevacion (m)</label>
              <input type="number" name="elevationM" value={formData.elevationM} onChange={handleChange} placeholder="320" style={inputStyle} />
            </div>
            <div style={{flex: 1}}>
              <label style={labelStyle}>Tiempo (min)</label>
              <input type="number" name="estimatedTime" value={formData.estimatedTime} onChange={handleChange} placeholder="120" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Ubicacion de inicio</label>
            <div style={{display: 'flex', gap: '8px'}}>
              <input type="number" name="latitudeStart" value={formData.latitudeStart} onChange={handleChange} placeholder="Latitud" step="0.000001" style={{...inputStyle, flex: 1}} />
              <input type="number" name="longitudeStart" value={formData.longitudeStart} onChange={handleChange} placeholder="Longitud" step="0.000001" style={{...inputStyle, flex: 1}} />
              <button type="button" onClick={handleGetLocation} disabled={locating} style={{background: '#1e3a5f', color: '#93c5fd', border: '1px solid #1e40af', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', opacity: locating ? 0.6 : 1}}>
                {locating ? 'Obteniendo...' : 'Mi ubicacion'}
              </button>
            </div>
            <p style={{color: '#2A4A6A', fontSize: '12px', marginTop: '6px'}}>Opcional. Usa el boton para obtener tu ubicacion actual.</p>
          </div>
          <div>
            <label style={labelStyle}>Fotos (maximo 5)</label>
            <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{...inputStyle, cursor: 'pointer'}} />
            {previews.length > 0 && (
              <div style={{display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap'}}>
                {previews.map((src, i) => (
                  <img key={i} src={src} style={{width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #1A3050'}} />
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} style={{background: '#f97316', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '500', fontSize: '15px', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.6 : 1}}>
            {loading ? 'Publicando...' : 'Publicar ruta'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateRoute
