import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Routes.jsx", "utf8")
c = c.replace("import { getRoutes } from '../services/routes.service.js'", "import { Link } from 'react-router-dom'\nimport { getRoutes } from '../services/routes.service.js'")
c = c.replace(/<a key={route.id} href={"\/routes\/" \+ route.id}/g, '<Link key={route.id} to={"/routes/" + route.id}')
c = c.replace(/<\/a>/g, "</Link>")
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Routes.jsx", c)
console.log("Listo")
