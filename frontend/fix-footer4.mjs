import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", "utf8").split("\n")

// Quitar todas las lineas del footer mal puesto
lines = lines.filter(l => !l.includes("Politica de Privacidad") && !l.includes("/privacy"))

// Encontrar la linea "    </div>" que cierra el max-w-5xl div (penultimo </div> antes del return cierre)
// Buscar desde atras: )  =>  }  =>  </div>  =>  </div>  => aqui insertar
let closeCount = 0
let insertIdx = -1
for (let i = lines.length - 1; i >= 0; i--) {
  const t = lines[i].trim()
  if (t === ')') { closeCount++ }
  if (closeCount === 1 && t === '</div>' ) {
    insertIdx = i
    break
  }
}

console.log("Inserting at line:", insertIdx, "->", lines[insertIdx])

lines.splice(insertIdx, 0, 
  '        <div style={{textAlign: "center", padding: "20px", borderTop: "1px solid #1A3050", marginTop: "20px"}}>',
  '          <Link to="/privacy" style={{color: "#4A6480", fontSize: "12px", textDecoration: "none"}}>Politica de Privacidad</Link>',
  '        </div>'
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", lines.join("\n"))
console.log("Listo")
