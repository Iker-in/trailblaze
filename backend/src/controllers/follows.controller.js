import prisma from '../config/prisma.js'
import { checkAndGrantAchievements } from '../services/achievements.service.js'

export const followUser = async (req, res) => {
  try {
    const { username } = req.params

    const userToFollow = await prisma.user.findUnique({ where: { username } })
    if (!userToFollow) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (userToFollow.id === req.userId) {
      return res.status(400).json({ error: 'No puedes seguirte a ti mismo' })
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: userToFollow.id
        }
      }
    })

    if (existing) {
      return res.status(400).json({ error: 'Ya sigues a este usuario' })
    }

    await prisma.follow.create({
      data: {
        followerId: req.userId,
        followingId: userToFollow.id
      }
    })

    await checkAndGrantAchievements(userToFollow.id)
    res.status(201).json({ message: `Ahora sigues a ${username}` })

  } catch (error) {
    console.error('Error al seguir usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const unfollowUser = async (req, res) => {
  try {
    const { username } = req.params

    const userToUnfollow = await prisma.user.findUnique({ where: { username } })
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: userToUnfollow.id
        }
      }
    })

    if (!existing) {
      return res.status(400).json({ error: 'No sigues a este usuario' })
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: userToUnfollow.id
        }
      }
    })

    res.json({ message: `Dejaste de seguir a ${username}` })

  } catch (error) {
    console.error('Error al dejar de seguir:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getFollowStatus = async (req, res) => {
  try {
    const { username } = req.params

    const userToCheck = await prisma.user.findUnique({ where: { username } })
    if (!userToCheck) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: userToCheck.id
        }
      }
    })

    res.json({ isFollowing: !!follow })

  } catch (error) {
    console.error('Error al verificar seguimiento:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}