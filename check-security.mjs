import { readFileSync } from "fs"
const files = [
  "C:/proyectos/trailblaze/backend/src/index.js",
  "C:/proyectos/trailblaze/backend/src/middleware/auth.middleware.js"
]
for (const f of files) {
  console.log("\n=== " + f + " ===")
  console.log(readFileSync(f, "utf8"))
}
