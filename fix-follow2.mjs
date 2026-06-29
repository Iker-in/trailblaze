import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8").split("\n")

// 1. Añadir import RouteFollowMap
const importIdx = lines.findIndex(l => l.includes("import RouteMap from '../components/RouteMap.jsx'"))
lines.splice(importIdx + 1, 0, "import RouteFollowMap from '../components/RouteFollowMap.jsx'")

// 2. Añadir estado showFollowMap despues de ratingLoading
const ratingIdx = lines.findIndex(l => l.includes("const [ratingLoading, setRatingLoading] = useState(false)"))
lines.splice(ratingIdx + 1, 0, "  const [showFollowMap, setShowFollowMap] = useState(false)")

// 3. Añadir boton Seguir ruta antes del boton completar
const completeButtonIdx = lines.findIndex(l => l.includes("isAuthenticated && route.userId !== user?.id"))
lines.splice(completeButtonIdx, 0,
  "              {route.trackPoints && route.trackPoints.length > 1 && (",
  "                <button onClick={() => setShowFollowMap(true)} style={{background: '#0D1F35', color: '#fb923c', border: '1px solid #fb923c', borderRadius: '10px', padding: '10px 20px', fontWeight: '500', fontSize: '14px', cursor: 'pointer'}}>",
  "                  🗺️ Seguir ruta",
  "                </button>",
  "              )}"
)

// 4. Añadir RouteFollowMap antes del ultimo cierre del JSX
const lastDivIdx = lines.findLastIndex(l => l.trim() === "</div>")
lines.splice(lastDivIdx, 0,
  "      {showFollowMap && route && <RouteFollowMap route={route} onClose={() => setShowFollowMap(false)} />}"
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", lines.join("\n"))
console.log("Listo")
