import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/CreateRoute.jsx", "utf8")
c = c.replace(
  "const files = Array.from(e.target.files).slice(0, 5)",
  "const files = Array.from(e.target.files).slice(0, 10)"
)
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/CreateRoute.jsx", c)
console.log("Listo")
