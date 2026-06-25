import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/controllers/photos.controller.js", "utf8")
c = c.replace("if (photoCount >= 5)", "if (photoCount >= 10)")
c = c.replace("'Maximo 5 fotos por ruta'", "'Maximo 10 fotos por ruta'")
writeFileSync("C:/proyectos/trailblaze/backend/src/controllers/photos.controller.js", c)
console.log("Listo")
