import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/index.js", "utf8")
c = c.replace("})// force rebuild", "})")
writeFileSync("C:/proyectos/trailblaze/backend/src/index.js", c)
console.log("Listo")
