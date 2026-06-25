import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.middleware.js'
import prisma from '../config/prisma.js'
import { getUserFavorites } from '../controllers/favorites.controller.js'
import { getProfile, getUserRoutes, getUserCompletions, updateProfile, searchUsers, updateAvatar } from '../controllers/users.controller.js'
import { upload } from '../config/cloudinary.js'

const router = Router()
router.get('/search', searchUsers)

router.get('/me/following-ranking', authenticate, async (req, res) => {
  try {
    const follows = await prisma.follow.findMany({
      where: { followerId: req.userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            points: true,
            _count: { select: { routes: true, completions: true } }
          }
        }
      }
    })
    const me = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, username: true, avatarUrl: true, points: true, _count: { select: { routes: true, completions: true } } }
    })
    const all = [me, ...follows.map(f => f.following)]
    const ranking = all
      .sort((a, b) => b.points - a.points)
      .map((u, i) => ({ ...u, position: i + 1, routes: u._count.routes, completions: u._count.completions }))
    res.json({ ranking })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/:username', getProfile)
router.get('/:username/routes', getUserRoutes)
router.get('/:username/completions', getUserCompletions)
router.patch('/me/stats-visibility', authenticate, async (req, res) => {
  try {
    const { statsPublic } = req.body
    await prisma.user.update({
      where: { id: req.userId },
      data: { statsPublic: Boolean(statsPublic) }
    })
    res.json({ ok: true, statsPublic: Boolean(statsPublic) })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.patch('/me/profile', authenticate, [
  body('bio').optional().trim().isLength({ max: 300 }).withMessage('La bio no puede superar 300 caracteres')
], updateProfile)

router.get('/:username/achievements', async (req, res) => {
  try {
    const { username } = req.params
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const achievements = await prisma.userAchievement.findMany({
      where: { userId: user.id },
      include: { achievement: true }
    })
    res.json({ achievements })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})


router.get('/:username/favorites', getUserFavorites)

router.get('/:username/activity', async (req, res) => {
  try {
    const { username } = req.params
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const [completions, achievements, routes] = await Promise.all([
      prisma.routeCompletion.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { route: { select: { id: true, title: true } } }
      }),
      prisma.userAchievement.findMany({
        where: { userId: user.id },
        orderBy: { gainedAt: 'desc' },
        take: 10,
        include: { achievement: { select: { name: true, iconUrl: true } } }
      }),
      prisma.route.findMany({
        where: { userId: user.id, status: 'published' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, title: true, createdAt: true }
      })
    ])

    const activity = [
      ...completions.map(c => ({ type: 'completion', date: c.createdAt, routeId: c.route.id, routeTitle: c.route.title })),
      ...achievements.map(a => ({ type: 'achievement', date: a.gainedAt, name: a.achievement.name, icon: a.achievement.iconUrl })),
      ...routes.map(r => ({ type: 'route', date: r.createdAt, routeId: r.id, routeTitle: r.title }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15)

    res.json({ activity })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/:username/stats', async (req, res) => {
  try {
    const { username } = req.params
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    let isOwner = false
    if (req.headers.authorization) {
      try {
        const { default: jwt } = await import('jsonwebtoken')
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        isOwner = decoded.userId === user.id
      } catch {}
    }

    if (!user.statsPublic && !isOwner) {
      return res.json({ hidden: true })
    }

    const completions = await prisma.routeCompletion.findMany({
      where: { userId: user.id },
      include: { route: { select: { distanceKm: true, elevationM: true, difficulty: true, title: true } } }
    })

    const totalKm = completions.reduce((sum, c) => sum + (c.route.distanceKm || 0), 0)
    const totalElevation = completions.reduce((sum, c) => sum + (c.route.elevationM || 0), 0)
    const byDifficulty = { facil: 0, moderado: 0, dificil: 0, experto: 0 }
    let longestRoute = null
    let highestElevation = null

    for (const c of completions) {
      if (c.route.difficulty) byDifficulty[c.route.difficulty]++
      if (!longestRoute || c.route.distanceKm > longestRoute.distanceKm) longestRoute = c.route
      if (!highestElevation || c.route.elevationM > highestElevation.elevationM) highestElevation = c.route
    }

    res.json({
      hidden: false,
      statsPublic: user.statsPublic,
      totalKm: Math.round(totalKm * 10) / 10,
      totalElevation: Math.round(totalElevation),
      totalCompletions: completions.length,
      byDifficulty,
      longestRoute,
      highestElevation
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

import multer from 'multer'
const avatarUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } })

router.patch('/me/avatar', authenticate, (req, res, next) => {
  avatarUpload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) return res.status(400).json({ error: 'La imagen no puede superar 2MB' })
    if (err) return res.status(500).json({ error: 'Error al subir imagen' })
    next()
  })
}, updateAvatar)

export default router