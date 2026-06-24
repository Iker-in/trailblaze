import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/routes/users.routes.js", "utf8")

c = c.replace(
  `router.get('/:username/stats', async (req, res) => {
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
    }`,
  `router.get('/:username/stats', async (req, res) => {
  try {
    const { username } = req.params
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    let isOwner = false
    if (req.headers.authorization) {
      try {
        const { default: jwt } = await import('jsonwebtoken')
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        isOwner = decoded.userId === user.id
      } catch {}
    }

    if (!user.statsPublic && !isOwner) {
      return res.json({ hidden: true })
    }`
)

writeFileSync("C:/proyectos/trailblaze/backend/src/routes/users.routes.js", c)
console.log("Listo")
