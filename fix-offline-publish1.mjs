import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RecordRoute.jsx", "utf8").split("\n")

// Fix 1: cambiar sessionStorage por localStorage en handleContinue
const sessionIdx = lines.findIndex(l => l.includes("sessionStorage.setItem('arventra_track'"))
lines[sessionIdx] = lines[sessionIdx].replace("sessionStorage.setItem", "localStorage.setItem")

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RecordRoute.jsx", lines.join("\n"))
console.log("Fix 1 listo")
