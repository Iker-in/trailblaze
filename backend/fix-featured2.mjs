import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/routes/routes.routes.js", "utf8")

c = c.replace(
  "import { createRoute, getRoutes, getRoute, completeRoute, deleteRoute, getPopularRoutes, getFeed, updateRoute } from '../controllers/routes.controller.js'",
  "import { createRoute, getRoutes, getRoute, completeRoute, deleteRoute, getPopularRoutes, getFeed, updateRoute } from '../controllers/routes.controller.js'\nimport prisma from '../config/prisma.js'"
)

c = c.replace(
  `router.get('/featured', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()`,
  `router.get('/featured', async (req, res) => {
  try {`
)

c = c.replace(
  "    await prisma.$disconnect()\n      return res.json({ route, completionsThisWeek: 0 })",
  "      return res.json({ route, completionsThisWeek: 0 })"
)

c = c.replace(
  "    await prisma.$disconnect()\n    res.json({ route, completionsThisWeek: completions[0]._count.routeId })",
  "    res.json({ route, completionsThisWeek: completions[0]._count.routeId })"
)

writeFileSync("C:/proyectos/trailblaze/backend/src/routes/routes.routes.js", c)
console.log("Listo")
