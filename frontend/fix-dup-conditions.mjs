import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")
const lines = c.split("\n")
const filtered = []
const seenLines = new Set()
for (const line of lines) {
  const trimmed = line.trim()
  if (trimmed.startsWith("const [condition") || 
      trimmed.startsWith("const [showConditionForm") || 
      trimmed.startsWith("const [submittingCondition") ||
      trimmed.startsWith("const CONDITIONS =")) {
    if (!seenLines.has(trimmed)) { seenLines.add(trimmed); filtered.push(line) }
  } else {
    filtered.push(line)
  }
}
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", filtered.join("\n"))
console.log("Listo")
