import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8").split("\n")

// Añadir import de RouteFollowMap
const importIdx = lines.findIndex(l => l.includes("import RouteMap from '../components/RouteMap.jsx'"))
lines.splice(importIdx + 1, 0, "import RouteFollowMap from '../components/RouteFollowMap.jsx'")

// Añadir estado de seguimiento
const ratingIdx = lines.findIndex(l => l.includes("const [condition, setCondition] = useState(null)"))
lines.splice(ratingIdx, 0, "  const [showFollowMap, setShowFollowMap] = useState(false)")

// Reemplazar handleComplete con verificacion GPS
const handleCompleteIdx = lines.findIndex(l => l.includes("const handleComplete = async () => {"))
const handleCompleteEnd = lines.findIndex((l, i) => i > handleCompleteIdx && l.trim() === "}")
lines.splice(handleCompleteIdx, handleCompleteEnd - handleCompleteIdx + 1,
  "  const handleComplete = async () => {",
  "    if (!isAuthenticated) { navigate('/login'); return }",
  "    if (!route.latitudeStart || !route.longitudeStart) {",
  "      setCompleting(true)",
  "      try {",
  "        const data = await completeRoute(id)",
  "        setCompleted(true)",
  "        if (data.isFirstExplorer) alert('Eres el Primer Explorador de esta ruta!')",
  "      } catch (err) { setError(err.response?.data?.error || 'Error al completar la ruta') }",
  "      setCompleting(false)",
  "      return",
  "    }",
  "    setCompleting(true)",
  "    navigator.geolocation.getCurrentPosition(async (pos) => {",
  "      const userLat = pos.coords.latitude",
  "      const userLng = pos.coords.longitude",
  "      const getDistM = (p1lat, p1lng, p2lat, p2lng) => {",
  "        const R = 6371000",
  "        const dLat = (p2lat - p1lat) * Math.PI / 180",
  "        const dLon = (p2lng - p1lng) * Math.PI / 180",
  "        const a = Math.sin(dLat/2)**2 + Math.cos(p1lat*Math.PI/180) * Math.cos(p2lat*Math.PI/180) * Math.sin(dLon/2)**2",
  "        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))",
  "      }",
  "      const distToStart = getDistM(userLat, userLng, route.latitudeStart, route.longitudeStart)",
  "      const trackPoints = route.trackPoints || []",
  "      const endPoint = trackPoints.length > 0 ? trackPoints[trackPoints.length - 1] : null",
  "      const distToEnd = endPoint ? getDistM(userLat, userLng, endPoint[0], endPoint[1]) : Infinity",
  "      const nearStart = distToStart < 500",
  "      const nearEnd = distToEnd < 500",
  "      if (!nearStart && !nearEnd) {",
  "        setError('Debes estar cerca del inicio o del final de la ruta para completarla (radio de 500m)')",
  "        setCompleting(false)",
  "        return",
  "      }",
  "      try {",
  "        const data = await completeRoute(id)",
  "        setCompleted(true)",
  "        if (data.isFirstExplorer) alert('Eres el Primer Explorador de esta ruta!')",
  "      } catch (err) { setError(err.response?.data?.error || 'Error al completar la ruta') }",
  "      setCompleting(false)",
  "    }, () => {",
  "      setError('No se pudo obtener tu ubicacion GPS. Activa el GPS e intenta de nuevo.')",
  "      setCompleting(false)",
  "    }, { enableHighAccuracy: true, timeout: 10000 })",
  "  }"
)

// Añadir botón Seguir ruta junto al de completar
const completeButtonIdx = lines.findIndex(l => l.includes("isAuthenticated && route.userId !== user?.id"))
lines.splice(completeButtonIdx, 0,
  "              {route.trackPoints && route.trackPoints.length > 1 && (",
  "                <button onClick={() => setShowFollowMap(true)} style={{background: '#0D1F35', color: '#fb923c', border: '1px solid #fb923c', borderRadius: '10px', padding: '10px 20px', fontWeight: '500', fontSize: '14px', cursor: 'pointer'}}>",
  "                  🗺️ Seguir ruta",
  "                </button>",
  "              )}"
)

// Añadir RouteFollowMap al final del JSX antes del cierre
const lastDivIdx = lines.findLastIndex(l => l.trim() === "</div>")
lines.splice(lastDivIdx, 0,
  "      {showFollowMap && <RouteFollowMap route={route} onClose={() => setShowFollowMap(false)} />}"
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", lines.join("\n"))
console.log("Listo, lineas:", lines.length)
