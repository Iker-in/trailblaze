import prisma from '../config/prisma.js'

export const getRanking = async (req, res) => {
  try {
    const { limit = 20 } = req.query

    const users = await prisma.user.findMany({
      take: parseInt(limit),
      orderBy: { points: 'desc' },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        points: true,
        _count: {
          select: {
            routes: true,
            completions: true,
            followers: true
          }
        }
      }
    })

    const ranking = users.map((user, index) => ({
      position: index + 1,
      ...user
    }))

    res.json({ ranking })

  } catch (error) {
    console.error('Error al obtener ranking:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}