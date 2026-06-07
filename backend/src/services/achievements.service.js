import prisma from '../config/prisma.js'

export const checkAndGrantAchievements = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            routes: true,
            completions: true,
            followers: true
          }
        }
      }
    })

    if (!user) return

    const allAchievements = await prisma.achievement.findMany()
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId }
    })

    const earnedIds = new Set(userAchievements.map((ua) => ua.achievementId))
    const newAchievements = []

    for (const achievement of allAchievements) {
      if (earnedIds.has(achievement.id)) continue

      let earned = false

      switch (achievement.criterio) {
        case 'completions_1':
          earned = user._count.completions >= 1
          break
        case 'completions_5':
          earned = user._count.completions >= 5
          break
        case 'completions_10':
          earned = user._count.completions >= 10
          break
        case 'routes_1':
          earned = user._count.routes >= 1
          break
        case 'routes_5':
          earned = user._count.routes >= 5
          break
        case 'followers_1':
          earned = user._count.followers >= 1
          break
        case 'points_100':
          earned = user.points >= 100
          break
        case 'points_500':
          earned = user.points >= 500
          break
      }

      if (earned) {
        await prisma.userAchievement.create({
          data: { userId, achievementId: achievement.id }
        })
        await prisma.user.update({
          where: { id: userId },
          data: { points: { increment: achievement.points } }
        })
        newAchievements.push(achievement)
      }
    }

    return newAchievements

  } catch (error) {
    console.error('Error al verificar logros:', error)
    return []
  }
}