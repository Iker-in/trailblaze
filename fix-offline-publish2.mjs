import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/CreateRoute.jsx", "utf8")
c = c.split("sessionStorage").join("localStorage")
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/CreateRoute.jsx", c)
console.log("Listo")
