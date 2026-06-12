import prisma from '../config/prisma.js'
import { validationResult } from 'express-validator'

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        points: true,
        createdAt: true,
        _count: {
          select: {
            routes: true,
            completions: true,
            followers: true,
            following: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({ user })

  } catch (error) {
    console.error('Error al obtener perfil:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getUserRoutes = async (req, res) => {
  try {
    const { username } = req.params

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const routes = await prisma.route.findMany({
      where: { userId: user.id, status: 'published' },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { completions: true } }
      }
    })

    res.json({ routes })

  } catch (error) {
    console.error('Error al obtener rutas del usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getUserCompletions = async (req, res) => {
  try {
    const { username } = req.params

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const completions = await prisma.routeCompletion.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        route: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            distanceKm: true
          }
        }
      }
    })

    res.json({ completions })

  } catch (error) {
    console.error('Error al obtener completaciones:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { bio } = req.body

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { bio },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        points: true
      }
    })

    res.json({ message: 'Perfil actualizado', user })

  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.json({ users: [] })

    const users = await prisma.user.findMany({
      where: {
        username: { contains: q, mode: 'insensitive' }
      },
      take: 10,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        points: true,
        _count: {
          select: { routes: true, followers: true }
        }
      }
    })

    res.json({ users })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
import { v2 as cloudinary } from 'cloudinary'
import { upload } from '../config/cloudinary.js'

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envio ninguna imagen' })

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'trailblaze/avatars', transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }] },
        (error, result) => error ? reject(error) : resolve(result)
      )
      stream.end(req.file.buffer)
    })

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { avatarUrl: result.secure_url },
      select: { id: true, username: true, avatarUrl: true }
    })

    res.json({ message: 'Avatar actualizado', user })
  } catch (error) {
    console.error('Error al actualizar avatar:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
