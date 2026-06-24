import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
})

function LiveTrack() {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [error, setError] = useState("")
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchSession = async () => {
    try {
      const res = await fetch("https://trailblaze-production-204a.up.railway.app/api/tracking/" + sessionId)
      const data = await res.json()
      if (data.session) {
        setSession(data.session)
        setLastUpdate(new Date())
      } else {
        setError("Sesion no encontrada")
      }
    } catch {
      setError("Error al obtener ubicacion")
    }
  }

  useEffect(() => {
    fetchSession()
    const interval = setInterval(fetchSession, 30000)
    return () => clearInterval(interval)
  }, [sessionId])

  return (
    <div style={{minHeight: "100vh", background: "#050B18"}}>
      <div style={{background: "#030D16", borderBottom: "1px solid #f43f5e", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <Link to="/" style={{display: "flex", alignItems: "center", gap: "8px", textDecoration: "none"}}>
          <img src="/logo.png" alt="ARVENTRA" style={{width: "32px", height: "32px", borderRadius: "6px"}} />
          <span style={{color: "#fb923c", fontSize: "18px", fontWeight: "bold"}}>ARVENTRA</span>
        </Link>
        <span style={{color: "#f43f5e", fontSize: "13px", fontWeight: "500"}}>🛡️ Seguimiento en vivo</span>
      </div>

      <div style={{maxWidth: "600px", margin: "0 auto", padding: "24px 16px"}}>
        {error ? (
          <div style={{background: "#450a0a", border: "1px solid #991b1b", color: "#fca5a5", borderRadius: "12px", padding: "20px", textAlign: "center"}}>
            <p style={{margin: 0}}>{error}</p>
          </div>
        ) : !session ? (
          <div style={{textAlign: "center", padding: "60px", color: "#6B8CAE"}}>Cargando ubicacion...</div>
        ) : (
          <>
            <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "14px", padding: "16px", marginBottom: "16px"}}>
              <p style={{color: "#fb923c", fontSize: "15px", fontWeight: "500", margin: "0 0 4px"}}>
                {session.user.username} está en ruta
              </p>
              <p style={{color: "#6B8CAE", fontSize: "12px", margin: "0 0 4px"}}>
                {session.active ? "🟢 Seguimiento activo" : "🔴 Seguimiento finalizado"}
              </p>
              {lastUpdate && (
                <p style={{color: "#2A4A6A", fontSize: "11px", margin: 0}}>
                  Ultima actualización: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>

            <div style={{borderRadius: "14px", overflow: "hidden", border: "1px solid #1A3050", height: "400px"}}>
              <MapContainer center={[session.lastLat, session.lastLng]} zoom={15} style={{height: "100%", width: "100%"}}>
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[session.lastLat, session.lastLng]}>
                  <Popup>{session.user.username}</Popup>
                </Marker>
              </MapContainer>
            </div>

            <p style={{color: "#2A4A6A", fontSize: "11px", textAlign: "center", marginTop: "12px"}}>
              El mapa se actualiza automaticamente cada 30 segundos
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default LiveTrack
