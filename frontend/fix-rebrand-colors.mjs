import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

function walk(dir, exts, results) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full, exts, results)
    else if (exts.some((e) => entry.endsWith(e))) results.push(full)
  }
  return results
}

const files = walk("C:/proyectos/trailblaze/frontend/src", [".jsx", ".css"], [])

const DEEP_PEACH = "#F2854D"
const LIGHT_PEACH = "#FFB88A"
const DEEP_GREEN = "#4F9F55"
const LIGHT_GREEN = "#7BC47F"

let changedFiles = 0

for (const file of files) {
  const content = readFileSync(file, "utf8")
  const lines = content.split("\n")
  let changed = false
  const isDeleteAccountModal = file.includes("DeleteAccountModal.jsx")

  const newLines = lines.map((line) => {
    let newLine = line

    if (newLine.includes("#f97316")) {
      const needsDeep = newLine.includes("background") || newLine.includes("Polyline") || newLine.includes("border")
      newLine = newLine.split("#f97316").join(needsDeep ? DEEP_PEACH : LIGHT_PEACH)
      changed = true
    }

    if (newLine.includes("#fb923c")) {
      newLine = newLine.split("#fb923c").join(LIGHT_PEACH)
      changed = true
    }

    if (newLine.includes("#f43f5e") && !isDeleteAccountModal) {
      const needsDeep = newLine.includes("background")
      newLine = newLine.split("#f43f5e").join(needsDeep ? DEEP_GREEN : LIGHT_GREEN)
      changed = true
    }

    return newLine
  })

  if (changed) {
    writeFileSync(file, newLines.join("\n"))
    changedFiles++
    console.log("Actualizado:", file)
  }
}

console.log("Total de archivos actualizados:", changedFiles)
