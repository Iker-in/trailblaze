import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/routes/users.routes.js", "utf8")

c = c.replace(
  "router.get('/:username/favorites', getUserFavorites)",
  `router.get('/:username/favorites', getUserFavorites)

router.get('/:username/activity', async (req, res) => {
  try {
    const { username } = req.params
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const [completions, achievements, routes] = await Promise.all([
      prisma.routeCompletion.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { route: { select: { id: true, title: true } } }
      }),
      prisma.userAchievement.findMany({
        where: { userId: user.id },
        orderBy: { gainedAt: 'desc' },
        take: 10,
        include: { achievement: { select: { name: true, iconUrl: true } } }
      }),
      prisma.route.findMany({
        where: { userId: user.id, status: 'published' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, title: true, createdAt: true }
      })
    ])

    const activity = [
      ...completions.map(c => ({ type: 'completion', date: c.createdAt, routeId: c.route.id, routeTitle: c.route.title })),
      ...achievements.map(a => ({ type: 'achievement', date: a.gainedAt, name: a.achievement.name, icon: a.achievement.iconUrl })),
      ...routes.map(r => ({ type: 'route', date: r.createdAt, routeId: r.id, routeTitle: r.title }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15)

    res.json({ activity })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})`
)

writeFileSync("C:/proyectos/trailblaze/backend/src/routes/users.routes.js", c)
console.log("Listo")
