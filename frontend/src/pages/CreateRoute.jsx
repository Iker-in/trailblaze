import { useNavigate, Link } from "react-router-dom"
import { createRoute, uploadPhoto } from "../services/routes.service.js"
import Navbar from "../components/Navbar.jsx"
import { useState, useEffect } from "react"

function CreateRoute() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ title: "", description: "", difficulty: "facil" })
  const [trackSummary, setTrackSummary] = useState(null)
  const [trackData, setTrackData] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem("arventra_track")
    if (!saved) {
      navigate("/routes/create")
      return
    }
    const data = JSON.parse(saved)
    setTrackData(data.trackPoints)
    setTrackSummary({
      distanceKm: data.distanceKm,
      estimatedTime: data.estimatedTime,
      elevationM: data.elevationM,
      points: data.trackPoints.length
    })
  }, [navigate])

  const [photos, setPhotos] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 10)
    setPhotos(files)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const payload = {
        ...formData,
        estimatedTime: trackSummary.estimatedTime,
        trackPoints: JSON.stringify(trackData)
      }
      const data = await createRoute(payload)
      const routeId = data.route.id
      for (const photo of photos) { await uploadPhoto(routeId, photo) }
      localStorage.removeItem("arventra_track")
      navigate("/routes/" + routeId)
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? errors[0].msg : err.response?.data?.error || "Error al crear la ruta")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: "100%", background: "#050B18", border: "1px solid #1A3050", borderRadius: "10px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }
  const labelStyle = { color: "#6B8CAE", fontSize: "13px", display: "block", marginBottom: "6px" }

  if (!trackSummary) return null

  return (
    <div style={{minHeight: "100vh", background: "#050B18"}}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 style={{color: "white", marginBottom: "8px"}} className="text-2xl font-bold">Finalizar ruta</h1>
        <p style={{color: "#4A6480", fontSize: "13px", marginBottom: "24px"}}>Los datos del recorrido ya quedaron registrados por GPS. Solo falta contarnos sobre la ruta.</p>
        {error && <div style={{background: "#450a0a", border: "1px solid #991b1b", color: "#fca5a5", borderRadius: "10px", padding: "12px", marginBottom: "16px", fontSize: "14px"}}>{error}</div>}

        <div style={{background: "#0D1F35", border: "1px solid #4F9F55", borderRadius: "12px", padding: "16px", marginBottom: "16px"}}>
          <p style={{color: "#7BC47F", fontSize: "13px", fontWeight: "500", margin: "0 0 8px"}}>✅ Ruta grabada con GPS</p>
          <div style={{display: "flex", gap: "20px", flexWrap: "wrap"}}>
            <div>
              <p style={{color: "#4A6480", fontSize: "11px", margin: 0}}>Distancia</p>
              <p style={{color: "white", fontSize: "15px", fontWeight: "500", margin: 0}}>{trackSummary.distanceKm} km</p>
            </div>
            <div>
              <p style={{color: "#4A6480", fontSize: "11px", margin: 0}}>Elevacion</p>
              <p style={{color: "white", fontSize: "15px", fontWeight: "500", margin: 0}}>{trackSummary.elevationM} m</p>
            </div>
            <div>
              <p style={{color: "#4A6480", fontSize: "11px", margin: 0}}>Tiempo</p>
              <p style={{color: "white", fontSize: "15px", fontWeight: "500", margin: 0}}>{trackSummary.estimatedTime} min</p>
            </div>
            <div>
              <p style={{color: "#4A6480", fontSize: "11px", margin: 0}}>Puntos GPS</p>
              <p style={{color: "white", fontSize: "15px", fontWeight: "500", margin: 0}}>{trackSummary.points}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px"}}>
          <div>
            <label style={labelStyle}>Titulo</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Ruta al Cerro Verde" style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Descripcion</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe la ruta..." rows={4} style={{...inputStyle, resize: "vertical"}} required />
          </div>
          <div>
            <label style={labelStyle}>Dificultad</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} style={{...inputStyle, cursor: "pointer"}}>
              <option value="facil">Facil</option>
              <option value="moderado">Moderado</option>
              <option value="dificil">Dificil</option>
              <option value="experto">Experto</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Fotos (maximo 10)</label>
            <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{...inputStyle, cursor: "pointer"}} />
            {previews.length > 0 && (
              <div style={{display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap"}}>
                {previews.map((src, i) => (
                  <img key={i} src={src} style={{width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px", border: "1px solid #1A3050"}} />
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} style={{background: "#F2854D", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontWeight: "500", fontSize: "15px", cursor: "pointer", marginTop: "8px", opacity: loading ? 0.6 : 1}}>
            {loading ? "Publicando..." : "Publicar ruta"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateRoute
