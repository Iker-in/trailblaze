import { readFileSync, writeFileSync } from "fs"

// Añadir al controller
let c = readFileSync("C:/proyectos/trailblaze/backend/src/controllers/ranking.controller.js", "utf8")
c = c + `
export const getAnnualRanking = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear()
    const start = new Date(year, 0, 1)
    const end = new Date(year + 1, 0, 1)

    const completions = await prisma.routeCompletion.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: start, lt: end } },
      _count: { routeId: true }
    })

    if (completions.length === 0) return res.json({ ranking: [], year })

    const userIds = completions.map(c => c.userId)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, avatarUrl: true, points: true }
    })

    const ranking = completions
      .map(c => {
        const user = users.find(u => u.id === c.userId)
        return { ...user, completionsThisYear: c._count.routeId }
      })
      .sort((a, b) => b.completionsThisYear - a.completionsThisYear)
      .map((u, i) => ({ ...u, position: i + 1 }))

    res.json({ ranking, year })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
`
writeFileSync("C:/proyectos/trailblaze/backend/src/controllers/ranking.controller.js", c)

// Añadir ruta
let r = readFileSync("C:/proyectos/trailblaze/backend/src/routes/ranking.routes.js", "utf8")
r = r.replace(
  "import { getRanking } from '../controllers/ranking.controller.js'",
  "import { getRanking, getAnnualRanking } from '../controllers/ranking.controller.js'"
)
r = r.replace(
  "router.get('/', getRanking)",
  "router.get('/', getRanking)\nrouter.get('/annual', getAnnualRanking)"
)
writeFileSync("C:/proyectos/trailblaze/backend/src/routes/ranking.routes.js", r)
console.log("Listo")
