import { readFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/CreateRoute.jsx", "utf8")
const lines = c.split("\n")
lines.forEach((l, i) => { if (i >= 37 && i <= 45) console.log(i+1, "->", l) })
