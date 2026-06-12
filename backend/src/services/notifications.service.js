import prisma from '../config/prisma.js'

export const createNotification = async (userId, type, message, link = null) => {
  try {
    await prisma.notification.create({
      data: { userId, type, message, link }
    })
  } catch (error) {
    console.error('Error al crear notificacion:', error)
  }
}
