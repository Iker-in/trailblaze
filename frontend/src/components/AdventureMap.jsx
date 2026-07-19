import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Link } from "react-router-dom"
import { useEffect } from "react"


delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 10 })
    }
  }, [points, map])
  return null
}

function AdventureMap({ completions, onSelect }) {
  const withCoords = completions.filter((c) => c.route.latitudeStart && c.route.longitudeStart)
  const points = withCoords.map((c) => [c.route.latitudeStart, c.route.longitudeStart])

  if (points.length === 0) {
    return (
      <div style={{background: "#0D1F35", borderRadius: "14px", padding: "32px", textAlign: "center", color: "#2A4A6A"}}>
        Ninguna de tus aventuras tiene ubicacion registrada todavia.
      </div>
    )
  }

  return (
    <div style={{borderRadius: "14px", overflow: "hidden", border: "1px solid #1A3050", height: "420px"}}>
      <MapContainer center={points[0]} zoom={6} style={{height: "100%", width: "100%"}}>
        <TileLayer
  attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url={`https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${import.meta.env.VITE_THUNDERFOREST_API_KEY}`}
/>
        <FitBounds points={points} />
        {withCoords.map((c) => (
          <Marker key={c.id} position={[c.route.latitudeStart, c.route.longitudeStart]}>
            <Popup>
              <div style={{minWidth: "180px"}}>
                {c.photos && c.photos.length > 0 && (
                  <img src={c.photos[0].url} alt="" style={{width: "100%", height: "90px", objectFit: "cover", borderRadius: "6px", marginBottom: "6px"}} />
                )}
                <p style={{fontWeight: 600, margin: "0 0 4px", fontSize: "13px"}}>{c.title || c.route.title}</p>
                <p style={{fontSize: "11px", opacity: 0.7, margin: "0 0 8px"}}>
                  {new Date(c.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <div style={{display: "flex", gap: "6px"}}>
                  <button onClick={() => onSelect(c)} style={{background: "#F2854D", color: "white", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "11px", cursor: "pointer"}}>Ver recuerdo</button>
                  <Link to={"/routes/" + c.route.id} style={{background: "#1A3050", color: "white", borderRadius: "6px", padding: "5px 10px", fontSize: "11px", textDecoration: "none"}}>Ver ruta</Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default AdventureMap
