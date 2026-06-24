import { readFileSync } from "fs"
const files = ["src/pages/EditRoute.jsx","src/pages/CreateRoute.jsx","src/pages/Achievements.jsx"]
for (const f of files) {
  const lines = readFileSync("C:/proyectos/trailblaze/frontend/" + f, "utf8").split("\n")
  lines.forEach((l, i) => { if (l.includes("<a href")) console.log(f + ":" + (i+1) + ": " + l.trim()) })
}
