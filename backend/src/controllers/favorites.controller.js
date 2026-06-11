import prisma from '../config/prisma.js'

export const addFavorite = async (req, res) => {
  try {
    const { id } = req.params
    const route = await prisma.route.findUnique({ where: { id } })
    if (!route) return res.status(404).json({ error: 'Ruta no encontrada' })

    const favorite = await prisma.favorite.create({
      data: { userId: req.userId, routeId: id }
    })
    res.status(201).json({ message: 'Ruta guardada en favoritos', favorite })
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'Ya esta en favoritos' })
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.favorite.deleteMany({
      where: { userId: req.userId, routeId: id }
    })
    res.json({ message: 'Ruta eliminada de favoritos' })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getFavoriteStatus = async (req, res) => {
  try {
    const { id } = req.params
    const favorite = await prisma.favorite.findUnique({
      where: { userId_routeId: { userId: req.userId, routeId: id } }
    })
    res.json({ isFavorite: !!favorite })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getUserFavorites = async (req, res) => {
  try {
    const { username } = req.params
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        route: {
          include: {
            user: { select: { id: true, username: true } },
            photos: { take: 1, orderBy: { order: 'asc' } },
            _count: { select: { completions: true } }
          }
        }
      }
    })
    res.json({ favorites: favorites.map(f => f.route) })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
