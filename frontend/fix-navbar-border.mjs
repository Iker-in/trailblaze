import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/components/Navbar.jsx", "utf8")
c = c.replace('borderBottom: "1px solid #f43f5e"', 'borderBottom: "1px solid #1A3050"')
c = c.replace('border: "1px solid #f43f5e"', 'border: "none"')
writeFileSync("C:/proyectos/trailblaze/frontend/src/components/Navbar.jsx", c)
console.log("Listo")
