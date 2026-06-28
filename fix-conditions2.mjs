import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8").split("\n")

// Insertar estados nuevos en linea 42 (despues de ratingLoading)
const newStates = [
  "  const [condition, setCondition] = useState(null)",
  "  const [showConditionForm, setShowConditionForm] = useState(false)",
  "  const [submittingCondition, setSubmittingCondition] = useState(false)"
]
lines.splice(41, 0, ...newStates)

// Encontrar donde esta loadRoute y añadir fetch de condicion
const loadRouteIdx = lines.findIndex(l => l.includes("const ratingRes = await api.get('/routes/' + id + '/rating')"))
lines.splice(loadRouteIdx + 2, 0, 
  "      const condRes = await api.get('/routes/' + id + '/condition')",
  "      setCondition(condRes.data)"
)

// Encontrar handleShare y añadir funciones antes
const handleShareIdx = lines.findIndex(l => l.includes("const handleShare = () => {"))
const conditionFns = [
  "  const CONDITIONS = [",
  "    { value: 'excelente', label: 'Excelente condicion', emoji: '🟢' },",
  "    { value: 'humedo', label: 'Humedo / con lodo', emoji: '🟡' },",
  "    { value: 'vegetacion', label: 'Vegetacion densa', emoji: '🟡' },",
  "    { value: 'cerrado', label: 'Sendero cerrado', emoji: '🔴' },",
  "    { value: 'inundado', label: 'Zona inundada', emoji: '🔴' },",
  "    { value: 'equipo_especial', label: 'Requiere equipo especial', emoji: '⚠️' }",
  "  ]",
  "",
  "  const handleCondition = async (value) => {",
  "    setSubmittingCondition(true)",
  "    try {",
  "      await api.post('/routes/' + id + '/condition', { condition: value })",
  "      const res = await api.get('/routes/' + id + '/condition')",
  "      setCondition(res.data)",
  "      setShowConditionForm(false)",
  "    } catch {}",
  "    setSubmittingCondition(false)",
  "  }",
  "",
  "  const getFreshnessColor = (date) => {",
  "    if (!date) return '#4A6480'",
  "    const days = (Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)",
  "    if (days <= 7) return '#86efac'",
  "    if (days <= 20) return '#fde68a'",
  "    return '#4A6480'",
  "  }",
  "",
  "  const timeAgo = (date) => {",
  "    const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24))",
  "    if (days === 0) return 'hoy'",
  "    if (days === 1) return 'hace 1 dia'",
  "    return 'hace ' + days + ' dias'",
  "  }",
  ""
]
lines.splice(handleShareIdx, 0, ...conditionFns)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", lines.join("\n"))
console.log("Listo, lineas:", lines.length)
