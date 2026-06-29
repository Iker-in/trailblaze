import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8").split("\n")

const start = lines.findIndex(l => l.includes("const handleComplete = async () => {"))
const end = lines.findIndex((l, i) => i > start + 3 && l.trim() === "}")

const newHandleComplete = [
  "  const handleComplete = async () => {",
  "    if (!isAuthenticated) { navigate('/login'); return }",
  "    setCompleting(true)",
  "    const doComplete = async () => {",
  "      try {",
  "        const data = await completeRoute(id)",
  "        setCompleted(true)",
  "        setSuccessMsg(data.message)",
  "        setRoute((prev) => ({ ...prev, _count: { completions: prev._count.completions + 1 } }))",
  "      } catch (err) {",
  "        setError(err.response?.data?.error || 'Error al completar la ruta')",
  "      } finally {",
  "        setCompleting(false)",
  "      }",
  "    }",
  "    if (!route.latitudeStart || !route.longitudeStart || !navigator.geolocation) {",
  "      await doComplete(); return",
  "    }",
  "    navigator.geolocation.getCurrentPosition(async (pos) => {",
  "      const uLat = pos.coords.latitude",
  "      const uLng = pos.coords.longitude",
  "      const distM = (a1, o1, a2, o2) => {",
  "        const R = 6371000, dA = (a2-a1)*Math.PI/180, dO = (o2-o1)*Math.PI/180",
  "        const a = Math.sin(dA/2)**2 + Math.cos(a1*Math.PI/180)*Math.cos(a2*Math.PI/180)*Math.sin(dO/2)**2",
  "        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a))",
  "      }",
  "      const dStart = distM(uLat, uLng, route.latitudeStart, route.longitudeStart)",
  "      const tp = route.trackPoints || []",
  "      const last = tp.length > 0 ? tp[tp.length-1] : null",
  "      const dEnd = last ? distM(uLat, uLng, last[0], last[1]) : Infinity",
  "      if (dStart > 500 && dEnd > 500) {",
  "        setError('Debes estar cerca del inicio o final de la ruta para completarla (radio 500m)')",
  "        setCompleting(false); return",
  "      }",
  "      await doComplete()",
  "    }, async () => {",
  "      setError('No se pudo obtener tu GPS. Activa la ubicacion e intenta de nuevo.')",
  "      setCompleting(false)",
  "    }, { enableHighAccuracy: true, timeout: 10000 })",
  "  }"
]

lines.splice(start, end - start + 1, ...newHandleComplete)
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", lines.join("\n"))
console.log("Listo, lineas:", lines.length)
