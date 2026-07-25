import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.middleware.js'
import { createRoute, getRoutes, getRoute, completeRoute, deleteRoute, getPopularRoutes, getFeed, updateRoute } from '../controllers/routes.controller.js'
import prisma from '../config/prisma.js'
import { getRouteWeather } from '../services/weather.service.js'

const router = Router()

const routeValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('El titulo debe tener entre 5 y 100 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('La descripcion debe tener entre 20 y 2000 caracteres'),
  body('difficulty')
    .isIn(['facil', 'moderado', 'dificil', 'experto'])
    .withMessage('Dificultad invalida')
]

router.get('/featured', async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const completions = await prisma.routeCompletion.groupBy({
      by: ['routeId'],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: { routeId: true },
      orderBy: { _count: { routeId: 'desc' } },
      take: 1
    })
    if (completions.length === 0) {
      const route = await prisma.route.findFirst({
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
          photos: { take: 1, orderBy: { order: 'asc' } },
          _count: { select: { completions: true } }
        }
      })
        return res.json({ route, completionsThisWeek: 0 })
    }
    const route = await prisma.route.findUnique({
      where: { id: completions[0].routeId },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        photos: { take: 1, orderBy: { order: 'asc' } },
        _count: { select: { completions: true } }
      }
    })
    res.json({ route, completionsThisWeek: completions[0]._count.routeId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/:id/weather', async (req, res) => {
  try {
    const { id } = req.params
    const route = await prisma.route.findUnique({ where: { id } })
    if (!route) return res.status(404).json({ error: 'Ruta no encontrada' })
    if (!route.latitudeStart || !route.longitudeStart) {
      return res.status(400).json({ error: 'Esta ruta no tiene coordenadas de inicio' })
    }
    const weather = await getRouteWeather(route.latitudeStart, route.longitudeStart)
    res.json(weather)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el clima' })
  }
})

router.get('/popular', getPopularRoutes)
router.get('/feed', authenticate, getFeed)
router.get('/', getRoutes)
router.get('/:id', getRoute)
router.post('/', authenticate, routeValidation, createRoute)
router.post('/:id/complete', authenticate, completeRoute)
router.delete('/:id', authenticate, deleteRoute)
router.patch('/:id', authenticate, routeValidation, updateRoute)

export default router
