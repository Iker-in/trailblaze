import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", "utf8")
const lines = c.split("\n")
const filtered = []
const seen = new Set()
for (const line of lines) {
  if (line.trim().startsWith("import")) {
    const key = line.trim()
    if (!seen.has(key)) { seen.add(key); filtered.push(line) }
  } else {
    filtered.push(line)
  }
}
writeFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", filtered.join("\n"))
console.log("Listo")
