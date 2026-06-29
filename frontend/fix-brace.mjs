import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8").split("\n")

// Encontrar las dos lineas "  }" seguidas antes de handleFavorite
const favIdx = lines.findIndex(l => l.includes("const handleFavorite = async () => {"))
// La linea favIdx-1 y favIdx-2 deben ser "  }" y "  }" - borrar uno
if (lines[favIdx-1].trim() === "}" && lines[favIdx-2].trim() === "}") {
  lines.splice(favIdx-1, 1)
  console.log("Eliminado } duplicado en linea:", favIdx-1)
}

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", lines.join("\n"))
