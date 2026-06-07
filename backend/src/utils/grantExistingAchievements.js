import prisma from '../config/prisma.js'
import { checkAndGrantAchievements } from '../services/achievements.service.js'

const grantAll = async () => {
  const users = await prisma.user.findMany({ select: { id: true, username: true } })
  
  for (const user of users) {
    console.log('Verificando logros para:', user.username)
    const newAchievements = await checkAndGrantAchievements(user.id)
    if (newAchievements.length > 0) {
      console.log('Logros otorgados:', newAchievements.map((a) => a.name).join(', '))
    }
  }

  console.log('Listo')
  await prisma.$disconnect()
}

grantAll().catch(console.error)