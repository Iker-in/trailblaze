import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", "utf8").split("\n")
const p2002Idx = lines.findIndex(l => l.includes("if (error.code === 'P2002')"))
const p2002End = lines.findIndex((l, i) => i > p2002Idx + 3 && l.trim() === "}")

const newBlock = [
  "      if (error.code === 'P2002') {",
  "        try {",
  "          const newId = randomUUID()",
  "          await prisma.$executeRawUnsafe(",
  "            `INSERT INTO route_completions (id, \"userId\", \"routeId\", notes, \"realTime\", \"createdAt\") VALUES ($1, $2, $3, $4, $5, NOW())`,",
  "            newId, req.userId, id, req.body.notes || null, req.body.realTime ? parseInt(req.body.realTime) : null",
  "          )",
  "          return res.status(201).json({ message: 'Ruta completada', isFirstExplorer: false })",
  "        } catch (e2) {",
  "          console.error('Error en SQL raw:', e2)",
  "          return res.status(500).json({ error: 'Error al completar la ruta' })",
  "        }",
  "      }"
]

lines.splice(p2002Idx, p2002End - p2002Idx + 1, ...newBlock)
writeFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", lines.join("\n"))
console.log("Listo")
