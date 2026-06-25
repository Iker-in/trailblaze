import { readFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/CreateRoute.jsx", "utf8")
const lines = c.split("\n")
lines.forEach((l, i) => { if (l.includes("photo") || l.includes("Photo") || l.includes("imagen") || l.includes("foto")) console.log(i+1, "->", l.trim()) })
