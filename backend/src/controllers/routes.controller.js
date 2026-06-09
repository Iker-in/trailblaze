import xss from 'xss'
import prisma from '../config/prisma.js'
import { validationResult } from 'express-validator'
import { checkAndGrantAchievements } from '../services/achievements.service.js'
import { createNotification } from '../services/notifications.service.js'

export const createRoute = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, description, difficulty, distanceKm, elevationM, estimatedTime, latitudeStart, longitudeStart } = req.body
    const safeTitle = xss(title)
const safeDescription = xss(description)

   const route = await prisma.route.create({
  data: {
    title: safeTitle,
    description: safeDescription,
    difficulty,
    distanceKm: parseFloat(distanceKm),
    elevationM: elevationM && elevationM > 0 ? parseInt(elevationM) : null,
    estimatedTime: estimatedTime && estimatedTime > 0 ? parseInt(estimatedTime) : null,
    latitudeStart: latitudeStart ? parseFloat(latitudeStart) : null,
    longitudeStart: longitudeStart ? parseFloat(longitudeStart) : null,
    userId: req.userId
  },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true }
        }
      }
    })

    await checkAndGrantAchievements(req.userId)
    res.status(201).json({ message: 'Ruta creada exitosamente', route })

  } catch (error) {
    console.error('Error al crear ruta:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getRoutes = async (req, res) => {
  try {
    const { difficulty, page = 1, limit = 10, search, minDistance, maxDistance } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = { status: 'published' }
    if (difficulty) where.difficulty = difficulty
    if (search) where.title = { contains: search, mode: 'insensitive' }
    if (minDistance || maxDistance) {
      where.distanceKm = {}
      if (minDistance) where.distanceKm.gte = parseFloat(minDistance)
      if (maxDistance) where.distanceKm.lte = parseFloat(maxDistance)
    }

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
          photos: { take: 1, orderBy: { order: 'asc' } },
          _count: { select: { completions: true, comments: true } }
        }
      }),
      prisma.route.count({ where })
    ])

    res.json({
      routes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('Error al obtener rutas:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getRoute = async (req, res) => {
  try {
    const { id } = req.params

    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true }
        },
        photos: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { completions: true }
        }
      }
    })

    if (!route) {
      return res.status(404).json({ error: 'Ruta no encontrada' })
    }

    res.json({ route })

  } catch (error) {
    console.error('Error al obtener ruta:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const completeRoute = async (req, res) => {
  try {
    const { id } = req.params
    const { notes, realTime } = req.body

    const route = await prisma.route.findUnique({ where: { id } })
    if (!route) {
      return res.status(404).json({ error: 'Ruta no encontrada' })
    }

    const existing = await prisma.routeCompletion.findUnique({
      where: { userId_routeId: { userId: req.userId, routeId: id } }
    })

    if (existing) {
      return res.status(400).json({ error: 'Ya marcaste esta ruta como completada' })
    }

    const completion = await prisma.routeCompletion.create({
      data: {
        userId: req.userId,
        routeId: id,
        notes: notes || null,
        realTime: realTime ? parseInt(realTime) : null
      }
    })

    await prisma.user.update({
      where: { id: req.userId },
      data: { points: { increment: 10 } }
    })

    await checkAndGrantAchievements(req.userId)
    if (route.userId !== req.userId) {
  await createNotification(
    route.userId,
    'completion',
    req.username + ' completo tu ruta: ' + route.title
  )
}
    res.status(201).json({
      message: 'Ruta marcada como completada. +10 puntos',
      completion
    })

  } catch (error) {
    console.error('Error al completar ruta:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params

    const route = await prisma.route.findUnique({ where: { id } })

    if (!route) {
      return res.status(404).json({ error: 'Ruta no encontrada' })
    }

    if (route.userId !== req.userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta ruta' })
    }

    await prisma.route.delete({ where: { id } })

    res.json({ message: 'Ruta eliminada exitosamente' })

  } catch (error) {
    console.error('Error al eliminar ruta:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getPopularRoutes = async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      where: { status: 'published' },
      take: 6,
      orderBy: { completions: { _count: 'desc' } },
      include: {
        user: { select: { id: true, username: true } },
        photos: { take: 1, orderBy: { order: 'asc' } },
        _count: { select: { completions: true, comments: true } }
      }
    })
    res.json({ routes })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
export const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const following = await prisma.follow.findMany({
      where: { followerId: req.userId },
      select: { followingId: true }
    })

    if (following.length === 0) {
      return res.json({
        routes: [],
        pagination: { total: 0, page: 1, limit: parseInt(limit), totalPages: 0 }
      })
    }

    const followingIds = following.map(f => f.followingId)

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where: { userId: { in: followingIds }, status: 'published' },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
          photos: { take: 1, orderBy: { order: 'asc' } },
          _count: { select: { completions: true, comments: true } }
        }
      }),
      prisma.route.count({
        where: { userId: { in: followingIds }, status: 'published' }
      })
    ])

    res.json({
      routes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('Error al obtener feed:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
