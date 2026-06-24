import { readFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", "utf8").split("\n")
const exportIdx = lines.findIndex(l => l.trim() === "export default Home")
for (let i = exportIdx - 6; i <= exportIdx; i++) {
  console.log(i, "->", lines[i])
}
