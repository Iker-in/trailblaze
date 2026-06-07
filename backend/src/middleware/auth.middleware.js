import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true }
    })

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }

    req.userId = user.id
    req.username = user.username

    next()

  } catch (error) {
    return res.status(401).json({ error: 'Token invalido o expirado' })
  }
}
