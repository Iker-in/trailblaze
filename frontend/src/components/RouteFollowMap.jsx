import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
})

function MapCenter({ position }) {
  const map = useMap()
  useEffect(() => { if (position) map.setView(position, map.getZoom()) }, [position])
  return null
}

function RouteFollowMap({ route, onClose }) {
  const [userPos, setUserPos] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [error, setError] = useState("")
  const watchRef = useRef(null)
  const trackPoints = route.trackPoints || []
  const startPos = [route.latitudeStart, route.longitudeStart]
  const endPos = trackPoints.length > 0 ? trackPoints[trackPoints.length - 1] : null

  const getDistanceM = (p1, p2) => {
    const R = 6371000
    const dLat = (p2[0] - p1[0]) * Math.PI / 180
    const dLon = (p2[1] - p1[1]) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(p1[0]*Math.PI/180) * Math.cos(p2[0]*Math.PI/180) * Math.sin(dLon/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  useEffect(() => {
    if (!navigator.geolocation) { setError("GPS no disponible"); return }
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude])
        setAccuracy(pos.coords.accuracy)
      },
      () => setError("No se pudo obtener tu ubicacion"),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )
    return () => { if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current) }
  }, [])

  const distToStart = userPos ? getDistanceM(userPos, startPos) : null
  const distToEnd = userPos && endPos ? getDistanceM(userPos, endPos) : null
  const nearStart = distToStart && distToStart < 500
  const nearEnd = distToEnd && distToEnd < 500

  return (
    <div style={{position: "fixed", inset: 0, background: "#050B18", zIndex: 9999, display: "flex", flexDirection: "column"}}>
      <div style={{padding: "12px 16px", background: "#0D1F35", borderBottom: "1px solid #1A3050", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <p style={{color: "white", fontWeight: "500", fontSize: "15px", margin: 0}}>{route.title}</p>
          {userPos && accuracy && (
            <p style={{color: accuracy <= 15 ? "#86efac" : accuracy <= 30 ? "#fde68a" : "#fca5a5", fontSize: "11px", margin: 0}}>
              GPS {accuracy <= 15 ? "bueno" : accuracy <= 30 ? "regular" : "debil"} (±{Math.round(accuracy)}m)
            </p>
          )}
        </div>
        <button onClick={onClose} style={{background: "#1A3050", border: "none", color: "white", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px"}}>Cerrar</button>
      </div>

      {error && <div style={{background: "#450a0a", color: "#fca5a5", padding: "10px 16px", fontSize: "13px"}}>{error}</div>}

      <div style={{flex: 1}}>
        <MapContainer center={startPos} zoom={14} style={{height: "100%", width: "100%"}}>
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {trackPoints.length > 1 && <Polyline positions={trackPoints} color="#f97316" weight={4} />}
          <Marker position={startPos} />
          {userPos && (
            <>
              <MapCenter position={userPos} />
              <Marker position={userPos} icon={L.divIcon({ className: "", html: '<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(59,130,246,0.8)"></div>', iconSize: [16,16], iconAnchor: [8,8] })} />
            </>
          )}
        </MapContainer>
      </div>

      <div style={{padding: "16px", background: "#0D1F35", borderTop: "1px solid #1A3050"}}>
        {!userPos ? (
          <p style={{color: "#6B8CAE", fontSize: "13px", textAlign: "center", margin: 0}}>Obteniendo tu ubicacion...</p>
        ) : (
          <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
            <div style={{textAlign: "center"}}>
              <p style={{color: nearStart ? "#86efac" : "#6B8CAE", fontSize: "12px", margin: "0 0 2px"}}>Punto de inicio</p>
              <p style={{color: nearStart ? "#86efac" : "white", fontSize: "14px", fontWeight: "500", margin: 0}}>
                {nearStart ? "✅ Estas aqui" : Math.round(distToStart) + "m"}
              </p>
            </div>
            {endPos && (
              <div style={{textAlign: "center"}}>
                <p style={{color: nearEnd ? "#86efac" : "#6B8CAE", fontSize: "12px", margin: "0 0 2px"}}>Punto final</p>
                <p style={{color: nearEnd ? "#86efac" : "white", fontSize: "14px", fontWeight: "500", margin: 0}}>
                  {nearEnd ? "✅ Llegaste" : Math.round(distToEnd) + "m"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RouteFollowMap
