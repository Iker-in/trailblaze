import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/routes/routes.routes.js", "utf8")

c = c.replace(
  "import prisma from '../config/prisma.js'",
  ""
)

c = c.replace(
  "router.get('/popular', getPopularRoutes)",
  `router.get('/featured', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const completions = await prisma.routeCompletion.groupBy({
      by: ['routeId'],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: { routeId: true },
      orderBy: { _count: { routeId: 'desc' } },
      take: 1
    })
    if (completions.length === 0) {
      const route = await prisma.route.findFirst({
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
          photos: { take: 1, orderBy: { order: 'asc' } },
          _count: { select: { completions: true } }
        }
      })
      await prisma.$disconnect()
      return res.json({ route, completionsThisWeek: 0 })
    }
    const route = await prisma.route.findUnique({
      where: { id: completions[0].routeId },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        photos: { take: 1, orderBy: { order: 'asc' } },
        _count: { select: { completions: true } }
      }
    })
    await prisma.$disconnect()
    res.json({ route, completionsThisWeek: completions[0]._count.routeId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/popular', getPopularRoutes)`
)

writeFileSync("C:/proyectos/trailblaze/backend/src/routes/routes.routes.js", c)
console.log("Listo")
