import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")

// Cambiar estado de boolean a numero
c = c.replace(
  "  const [completed, setCompleted] = useState(false)",
  "  const [completionCount, setCompletionCount] = useState(0)"
)

// Cambiar setCompleted(true) por incrementar contador
c = c.replace(
  "        setCompleted(true)",
  "        setCompletionCount(prev => prev + 1)"
)

// Cambiar el botón para permitir completar varias veces
c = c.replace(
  "<button onClick={handleComplete} disabled={completing || completed} style={{background: completed ? '#14532d' : '#f97316', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', opacity: completing ? 0.6 : 1}}>",
  "<button onClick={handleComplete} disabled={completing} style={{background: '#f97316', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', opacity: completing ? 0.6 : 1}}>"
)

// Cambiar el texto del botón
c = c.replace(
  "{completed ? 'Completada' : completing ? 'Guardando...' : 'Marcar como completada'}",
  "{completing ? 'Guardando...' : completionCount > 0 ? 'Completar nuevamente (' + completionCount + ')' : 'Marcar como completada'}"
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
