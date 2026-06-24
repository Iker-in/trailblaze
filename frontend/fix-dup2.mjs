import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", "utf8")
const lines = c.split("\n")
const filtered = []
let found = false
for (const line of lines) {
  if (line.includes("OfflineBanner") && line.includes("import")) {
    if (!found) { filtered.push(line); found = true }
  } else {
    filtered.push(line)
  }
}
writeFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", filtered.join("\n"))
console.log("Listo")
