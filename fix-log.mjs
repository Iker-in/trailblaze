import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", "utf8").split("\n")
const p2002Idx = lines.findIndex(l => l.includes("if (error.code === 'P2002')"))
lines.splice(p2002Idx + 1, 0, "      console.error('P2002 catch activado, intentando con UUID:', randomUUID())")
writeFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", lines.join("\n"))
console.log("Listo")
