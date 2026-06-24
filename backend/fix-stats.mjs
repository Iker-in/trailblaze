import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/routes/users.routes.js", "utf8")

c = c.replace(
  "router.get('/:username/favorites', getUserFavorites)",
  `router.get('/:username/favorites', getUserFavorites)

router.get('/:username/stats', async (req, res) => {
  try {
    const { username } = req.params
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const isOwner = req.headers.authorization && (() => {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const jwt = await import('jsonwebtoken')
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET)
        return decoded.userId === user.id
      } catch { return false }
    })()

    if (!user.statsPublic && !isOwner) {
      return res.json({ hidden: true })
    }

    const completions = await prisma.routeCompletion.findMany({
      where: { userId: user.id },
      include: { route: { select: { distanceKm: true, elevationM: true, difficulty: true, title: true } } }
    })

    const totalKm = completions.reduce((sum, c) => sum + (c.route.distanceKm || 0), 0)
    const totalElevation = completions.reduce((sum, c) => sum + (c.route.elevationM || 0), 0)
    const byDifficulty = { facil: 0, moderado: 0, dificil: 0, experto: 0 }
    let longestRoute = null
    let highestElevation = null

    for (const c of completions) {
      if (c.route.difficulty) byDifficulty[c.route.difficulty]++
      if (!longestRoute || c.route.distanceKm > longestRoute.distanceKm) longestRoute = c.route
      if (!highestElevation || c.route.elevationM > highestElevation.elevationM) highestElevation = c.route
    }

    res.json({
      hidden: false,
      statsPublic: user.statsPublic,
      totalKm: Math.round(totalKm * 10) / 10,
      totalElevation: Math.round(totalElevation),
      totalCompletions: completions.length,
      byDifficulty,
      longestRoute,
      highestElevation
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})`
)

writeFileSync("C:/proyectos/trailblaze/backend/src/routes/users.routes.js", c)
console.log("Listo")
