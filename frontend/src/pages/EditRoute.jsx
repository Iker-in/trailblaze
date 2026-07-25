import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../services/api.js"
import Navbar from "../components/Navbar.jsx"
import Skeleton from "../components/Skeleton.jsx"

function EditRoute() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ title: "", description: "", difficulty: "facil" })
  const [routeStats, setRouteStats] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    api.get("/routes/" + id).then((res) => {
      const r = res.data.route
      setFormData({ title: r.title, description: r.description, difficulty: r.difficulty })
      setRouteStats({ distanceKm: r.distanceKm, elevationM: r.elevationM, estimatedTime: r.estimatedTime })
    }).catch(() => setError("Ruta no encontrada")).finally(() => setFetching(false))
  }, [id])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.patch("/routes/" + id, formData)
      navigate("/routes/" + id)
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? errors[0].msg : err.response?.data?.error || "Error al actualizar la ruta")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: "100%", background: "#050B18", border: "1px solid #1A3050", borderRadius: "10px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }
  const labelStyle = { color: "#6B8CAE", fontSize: "13px", display: "block", marginBottom: "6px" }

  if (fetching) return (
    <div style={{minHeight: "100vh", background: "#050B18"}}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Skeleton height="24px" width="140px" style={{marginBottom: "24px"}} />
        <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px"}}>
          <div>
            <Skeleton height="13px" width="60px" style={{marginBottom: "6px"}} />
            <Skeleton height="42px" borderRadius="10px" />
          </div>
          <div>
            <Skeleton height="13px" width="90px" style={{marginBottom: "6px"}} />
            <Skeleton height="90px" borderRadius="10px" />
          </div>
          <div>
            <Skeleton height="13px" width="70px" style={{marginBottom: "6px"}} />
            <Skeleton height="42px" borderRadius="10px" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{minHeight: "100vh", background: "#050B18"}}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 style={{color: "white", marginBottom: "8px", fontSize: "24px", fontWeight: "500"}}>Editar ruta</h1>
        <p style={{color: "#4A6480", fontSize: "13px", marginBottom: "20px"}}>La distancia, elevacion y tiempo se registraron con GPS y no se pueden modificar.</p>
        {error && <div style={{background: "#450a0a", border: "1px solid #991b1b", color: "#fca5a5", borderRadius: "10px", padding: "12px", marginBottom: "16px", fontSize: "14px"}}>{error}</div>}

        {routeStats && (
          <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "12px", padding: "16px", marginBottom: "16px", display: "flex", gap: "20px", flexWrap: "wrap"}}>
            <div>
              <p style={{color: "#4A6480", fontSize: "11px", margin: 0}}>Distancia</p>
              <p style={{color: "white", fontSize: "15px", fontWeight: "500", margin: 0}}>{routeStats.distanceKm} km</p>
            </div>
            <div>
              <p style={{color: "#4A6480", fontSize: "11px", margin: 0}}>Elevacion</p>
              <p style={{color: "white", fontSize: "15px", fontWeight: "500", margin: 0}}>{routeStats.elevationM || 0} m</p>
            </div>
            <div>
              <p style={{color: "#4A6480", fontSize: "11px", margin: 0}}>Tiempo</p>
              <p style={{color: "white", fontSize: "15px", fontWeight: "500", margin: 0}}>{routeStats.estimatedTime || 0} min</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px"}}>
          <div>
            <label style={labelStyle}>Titulo</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Descripcion</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} style={{...inputStyle, resize: "vertical"}} required />
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
          <div style={{display: "flex", gap: "12px"}}>
            <button type="submit" disabled={loading} style={{flex: 1, background: "#F2854D", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontWeight: "500", fontSize: "15px", cursor: "pointer", opacity: loading ? 0.6 : 1}}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
            <button type="button" onClick={() => navigate("/routes/" + id)} style={{background: "transparent", color: "#6B8CAE", border: "1px solid #1A3050", borderRadius: "12px", padding: "14px 20px", fontSize: "15px", cursor: "pointer"}}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRoute
