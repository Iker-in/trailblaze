import { writeFileSync } from 'fs'

writeFileSync('frontend/src/pages/CreateRoute.jsx', `import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoute, uploadPhoto } from '../services/routes.service.js'
import Navbar from '../components/Navbar.jsx'

function CreateRoute() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ title: '', description: '', difficulty: 'facil', distanceKm: '', elevationM: '', estimatedTime: '', latitudeStart: '', longitudeStart: '' })
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
        setFormData((prev) => ({
          ...prev,
          latitudeStart: pos.coords.latitude.toFixed(6),
          longitudeStart: pos.coords.longitude.toFixed(6)
        }))
        setLocating(false)
      },
      () => {
        setError('No se pudo obtener la ubicacion')
        setLocating(false)
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await createRoute(formData)
      const routeId = data.route.id
      for (const photo of photos) {
        await uploadPhoto(routeId, photo)
      }
      navigate('/routes/' + routeId)
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? errors[0].msg : err.response?.data?.error || 'Error al crear la ruta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-green-800 mb-6">Publicar nueva ruta</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titulo</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Ruta al Cerro Verde" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe la ruta..." rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="facil">Facil</option>
              <option value="moderado">Moderado</option>
              <option value="dificil">Dificil</option>
              <option value="experto">Experto</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Distancia (km)</label>
              <input type="number" name="distanceKm" value={formData.distanceKm} onChange={handleChange} placeholder="5.2" step="0.1" min="0.1" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Elevacion (m)</label>
              <input type="number" name="elevationM" value={formData.elevationM} onChange={handleChange} placeholder="320" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo (min)</label>
              <input type="number" name="estimatedTime" value={formData.estimatedTime} onChange={handleChange} placeholder="120" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicacion de inicio</label>
            <div className="flex gap-2">
              <input type="number" name="latitudeStart" value={formData.latitudeStart} onChange={handleChange} placeholder="Latitud" step="0.000001" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="number" name="longitudeStart" value={formData.longitudeStart} onChange={handleChange} placeholder="Longitud" step="0.000001" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <button type="button" onClick={handleGetLocation} disabled={locating} className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 disabled:opacity-50 whitespace-nowrap">
                {locating ? 'Obteniendo...' : 'Mi ubicacion'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Opcional. Usa el boton para obtener tu ubicacion actual.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fotos (maximo 5)</label>
            <input type="file" accept="image/*" multiple onChange={handlePhotos} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((src, i) => (
                  <img key={i} src={src} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 mt-2 disabled:opacity-50">
            {loading ? 'Publicando...' : 'Publicar ruta'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateRoute
`)

console.log('listo')