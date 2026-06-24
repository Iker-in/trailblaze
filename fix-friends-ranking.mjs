import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/routes/users.routes.js", "utf8")

c = c.replace(
  "router.get('/search', searchUsers)",
  `router.get('/search', searchUsers)

router.get('/me/following-ranking', authenticate, async (req, res) => {
  try {
    const follows = await prisma.follow.findMany({
      where: { followerId: req.userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            points: true,
            _count: { select: { routes: true, completions: true } }
          }
        }
      }
    })
    const me = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, username: true, avatarUrl: true, points: true, _count: { select: { routes: true, completions: true } } }
    })
    const all = [me, ...follows.map(f => f.following)]
    const ranking = all
      .sort((a, b) => b.points - a.points)
      .map((u, i) => ({ ...u, position: i + 1, routes: u._count.routes, completions: u._count.completions }))
    res.json({ ranking })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})`
)

writeFileSync("C:/proyectos/trailblaze/backend/src/routes/users.routes.js", c)
console.log("Listo")
