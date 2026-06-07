import prisma from '../config/prisma.js'

export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: req.userId, read: false }
    })

    res.json({ notifications, unreadCount })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.userId, read: false },
      data: { read: true }
    })
    res.json({ message: 'Notificaciones marcadas como leidas' })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}