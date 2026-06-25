import { readFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")
const lines = c.split("\n")
lines.forEach((l, i) => { if (l.includes("photo") || l.includes("Photo")) console.log(i+1, "->", l.trim()) })
