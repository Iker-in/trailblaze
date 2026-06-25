import { readFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", "utf8")
const lines = c.split("\n")
lines.forEach((l, i) => { if (l.includes("5") && (l.includes("photo") || l.includes("foto") || l.includes("limit"))) console.log(i+1, "->", l.trim()) })
