import { writeFileSync } from "fs"

const content = `import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {withCoords.map((c) => (
          <Marker
            key={c.id}
            position={[c.route.latitudeStart, c.route.longitudeStart]}
            eventHandlers={{ click: () => onSelect(c) }}
          />
        ))}
      </MapContainer>
    </div>
  )
}

export default AdventureMap
`

writeFileSync("C:/proyectos/trailblaze/frontend/src/components/AdventureMap.jsx", content)
console.log("AdventureMap.jsx creado")
