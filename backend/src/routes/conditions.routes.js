import prisma from '../config/prisma.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { Router } from 'express'

const router = Router()

const VALID_CONDITIONS = [
  'excelente',
  'humedo',
  'vegetacion',
  'cerrado',
  'inundado',
  'equipo_especial'
]

router.post('/:id/condition', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { condition } = req.body
    if (!VALID_CONDITIONS.includes(condition)) {
      return res.status(400).json({ error: 'Condicion invalida' })
    }
    const route = await prisma.route.findUnique({ where: { id } })
    if (!route) return res.status(404).json({ error: 'Ruta no encontrada' })
    const created = await prisma.routeCondition.create({
      data: { userId: req.userId, routeId: id, condition },
      include: { user: { select: { username: true } } }
    })
    res.status(201).json({ condition: created })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/:id/condition', async (req, res) => {
  try {
    const { id } = req.params
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const conditions = await prisma.routeCondition.findMany({
      where: { routeId: id, createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { username: true } } }
    })
    const latest = conditions[0] || null
    res.json({ latest, history: conditions.slice(1, 5) })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
