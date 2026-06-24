import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/routes/users.routes.js", "utf8")

c = c.replace(
  "router.patch('/me/profile', authenticate,",
  `router.patch('/me/stats-visibility', authenticate, async (req, res) => {
  try {
    const { statsPublic } = req.body
    await prisma.user.update({
      where: { id: req.userId },
      data: { statsPublic: Boolean(statsPublic) }
    })
    res.json({ ok: true, statsPublic: Boolean(statsPublic) })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.patch('/me/profile', authenticate,`
)

writeFileSync("C:/proyectos/trailblaze/backend/src/routes/users.routes.js", c)
console.log("Listo")
