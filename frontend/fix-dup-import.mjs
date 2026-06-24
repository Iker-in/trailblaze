import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", "utf8")
c = c.replace(
  'import OfflineBanner from "./components/OfflineBanner.jsx";\nimport OfflineBanner from "./components/OfflineBanner.jsx";',
  'import OfflineBanner from "./components/OfflineBanner.jsx";'
)
writeFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", c)
console.log("Listo")
