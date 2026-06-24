import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

const replacements = [
  ["#160d28", "#050B18"],
  ["#241640", "#0D1F35"],
  ["#3d2a5c", "#1A3050"],
  ["#ec4899", "#f43f5e"],
  ["#a78bb5", "#6B8CAE"],
  ["#8b7aa3", "#4A6480"],
  ["#5a4670", "#2A4A6A"],
  ["#fbbf24", "#fb923c"],
  ["#2e1065", "#0A1F3A"],
  ["#1a0a2e", "#071428"],
  ["#0d0820", "#030D16"],
  ["#0f172a", "#050B18"],
  ["#1e293b", "#0D1F35"],
  ["#334155", "#1A3050"],
  ["#475569", "#2A4A6A"],
  ["#64748b", "#4A6480"],
  ["#94a3b8", "#6B8CAE"],
  ["#7c3aed", "#f97316"]
]

const dirs = [
  "C:/proyectos/trailblaze/frontend/src/pages",
  "C:/proyectos/trailblaze/frontend/src/components",
  "C:/proyectos/trailblaze/frontend/src"
]

const processFile = (filePath) => {
  if (!filePath.endsWith(".jsx") && !filePath.endsWith(".css") && !filePath.endsWith(".js")) return
  let content = readFileSync(filePath, "utf8")
  let changed = false
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
      changed = true
    }
  }
  if (changed) {
    writeFileSync(filePath, content)
    console.log("Updated:", filePath)
  }
}

for (const dir of dirs) {
  try {
    const files = readdirSync(dir)
    for (const file of files) {
      const full = join(dir, file)
      if (statSync(full).isFile()) processFile(full)
    }
  } catch {}
}

console.log("Rebranding completo")
