import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.middleware.js'
import { createRoute, getRoutes, getRoute, completeRoute, deleteRoute, getPopularRoutes, getFeed, updateRoute } from '../controllers/routes.controller.js'

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
    .withMessage('Dificultad invalida'),
  body('distanceKm')
    .isFloat({ min: 0.1, max: 500 })
    .withMessage('La distancia debe ser entre 0.1 y 500 km')
    ,
  body('elevationM')
  .optional()
  .isInt({ min: 0 })
  .withMessage('La elevacion no puede ser negativa'),
body('estimatedTime')
  .optional()
  .isInt({ min: 0 })
  .withMessage('El tiempo no puede ser negativo'),
]

router.get('/featured', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
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
      await prisma.$disconnect()
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
    await prisma.$disconnect()
    res.json({ route, completionsThisWeek: completions[0]._count.routeId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
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
