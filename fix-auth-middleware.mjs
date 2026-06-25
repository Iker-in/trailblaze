import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/middleware/auth.middleware.js", "utf8")

c = c.replace(
  `    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true }
    })

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }`,
  `    // Verificar si el token fue revocado
    const revoked = await prisma.revokedToken.findUnique({
      where: { token: token }
    })
    if (revoked) {
      return res.status(401).json({ error: 'Token revocado' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true }
    })

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }`
)

writeFileSync("C:/proyectos/trailblaze/backend/src/middleware/auth.middleware.js", c)
console.log("Listo")
