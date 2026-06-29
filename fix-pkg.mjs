import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/package.json", "utf8")
const pkg = JSON.parse(c)
pkg.scripts.build = "npx prisma generate"
pkg.scripts.start = "node src/index.js"
writeFileSync("C:/proyectos/trailblaze/backend/package.json", JSON.stringify(pkg, null, 2))
console.log("Listo")
