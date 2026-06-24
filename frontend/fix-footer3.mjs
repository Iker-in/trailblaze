import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", "utf8").split("\n")
// Encontrar la línea de export default Home y quitar el footer mal puesto
const exportIdx = lines.findIndex(l => l.includes("export default Home"))
// Quitar líneas del footer mal puesto (después del export)
lines = lines.slice(0, exportIdx + 1)
// Insertar footer antes del cierre correcto
// Buscar el último </div></div>)
let insertIdx = -1
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === ')') { insertIdx = i; break }
}
lines.splice(insertIdx, 0, '      <div style={{textAlign: "center", padding: "20px", borderTop: "1px solid #1A3050", marginTop: "20px"}}>', '        <Link to="/privacy" style={{color: "#4A6480", fontSize: "12px", textDecoration: "none"}}>Politica de Privacidad</Link>', '      </div>')
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", lines.join("\n"))
console.log("Listo")
