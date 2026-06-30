import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", "utf8").split("\n")
const dupIdx = lines.findIndex(l => l.includes("const { randomUUID } = await import('crypto')"))
if (dupIdx !== -1) {
  lines.splice(dupIdx, 1)
  console.log("Eliminada linea duplicada en:", dupIdx)
}
writeFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", lines.join("\n"))
