import prisma from '../config/prisma.js'

export const createNotification = async (userId, type, message) => {
  try {
    await prisma.notification.create({
      data: { userId, type, message }
    })
  } catch (error) {
    console.error('Error al crear notificacion:', error)
  }
}