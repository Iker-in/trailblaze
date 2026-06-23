import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")
c = c.replace("import { useParams, useNavigate } from 'react-router-dom'", "import { useParams, useNavigate, Link } from 'react-router-dom'")
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
