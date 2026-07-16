import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/backend/src/services/weather.service.js", "utf8").split("\n")
const idx = lines.findIndex(l => l.includes("const url ="))
if (idx === -1) {
  console.log("No se encontro la linea a corregir - revisa el archivo manualmente")
} else {
  lines[idx] = "  const url = \x27https://api.openweathermap.org/data/2.5/forecast?lat=\x27 + lat + \x27&lon=\x27 + lng + \x27&appid=\x27 + apiKey + \x27&units=metric&lang=es\x27"
  writeFileSync("C:/proyectos/trailblaze/backend/src/services/weather.service.js", lines.join("\n"))
  console.log("Linea corregida")
}
