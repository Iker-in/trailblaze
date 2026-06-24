import { readFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/controllers/follows.controller.js", "utf8")
console.log(c.substring(900, 1400))
