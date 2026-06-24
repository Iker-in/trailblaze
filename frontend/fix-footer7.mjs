import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", "utf8").split("\n")
const exportIdx = lines.findIndex(l => l.trim() === "export default Home")
const insertIdx = exportIdx - 4
lines.splice(insertIdx, 0,
  '      <div style={{textAlign: "center", padding: "20px", borderTop: "1px solid #1A3050", marginTop: "20px"}}>',
  '        <Link to="/privacy" style={{color: "#4A6480", fontSize: "12px", textDecoration: "none"}}>Politica de Privacidad</Link>',
  '      </div>'
)
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", lines.join("\n"))
console.log("Listo")
