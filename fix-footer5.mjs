import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", "utf8").split("\n")

// Encontrar la linea exacta "}export default Home" o "export default Home"
const exportIdx = lines.findIndex(l => l.trim() === "export default Home")
console.log("export en linea:", exportIdx)
console.log("lineas anteriores:", lines[exportIdx-3], "|", lines[exportIdx-2], "|", lines[exportIdx-1])

// Insertar footer en la linea exportIdx - 2 (antes del cierre del return)
lines.splice(exportIdx - 2, 0,
  '        <div style={{textAlign: "center", padding: "20px", borderTop: "1px solid #1A3050", marginTop: "20px"}}>',
  '          <Link to="/privacy" style={{color: "#4A6480", fontSize: "12px", textDecoration: "none"}}>Politica de Privacidad</Link>',
  '        </div>'
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", lines.join("\n"))
console.log("Listo")
