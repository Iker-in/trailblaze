import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", "utf8").split("\n")

// Encontrar y eliminar el bloque existing
const existingIdx = lines.findIndex(l => l.includes("const existing = await prisma.routeCompletion.findUnique({"))
const ifExistingIdx = lines.findIndex(l => l.includes("return res.status(400).json({ error: 'Ya marcaste esta ruta como completada' })"))

// Eliminar lineas: existing query (3 lineas) y if existing (3 lineas)
// Primero eliminar el if (existing) block
lines.splice(ifExistingIdx - 1, 3) // quita "if (existing) {", "return...", "}"

// Luego eliminar el findUnique block
const existingIdx2 = lines.findIndex(l => l.includes("const existing = await prisma.routeCompletion.findUnique({"))
lines.splice(existingIdx2, 3) // quita las 3 lineas del findUnique

writeFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", lines.join("\n"))
console.log("Listo")
