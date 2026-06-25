import prisma from '../config/prisma.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { Router } from 'express'

const router = Router()

router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { rating } = req.body
    if (rating !== 1 && rating !== -1) return res.status(400).json({ error: 'Rating invalido' })
    const route = await prisma.route.findUnique({ where: { id } })
    if (!route) return res.status(404).json({ error: 'Ruta no encontrada' })
    if (route.userId === req.userId) return res.status(400).json({ error: 'No puedes valorar tu propia ruta' })
    const existing = await prisma.routeRating.findUnique({
      where: { userId_routeId: { userId: req.userId, routeId: id } }
    })
    if (existing) {
      if (existing.rating === rating) {
        await prisma.routeRating.delete({ where: { id: existing.id } })
        return res.json({ message: 'Valoracion eliminada', rating: null })
      }
      const updated = await prisma.routeRating.update({
        where: { id: existing.id },
        data: { rating, updatedAt: new Date() }
      })
      return res.json({ message: 'Valoracion actualizada', rating: updated.rating })
    }
    const created = await prisma.routeRating.create({
      data: { userId: req.userId, routeId: id, rating, updatedAt: new Date() }
    })
    res.status(201).json({ message: 'Valoracion guardada', rating: created.rating })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/:id/rating', async (req, res) => {
  try {
    const { id } = req.params
    const ratings = await prisma.routeRating.groupBy({
      by: ['rating'],
      where: { routeId: id },
      _count: { rating: true }
    })
    const thumbsUp = ratings.find(r => r.rating === 1)?._count.rating || 0
    const thumbsDown = ratings.find(r => r.rating === -1)?._count.rating || 0
    let userRating = null
    const authHeader = req.headers.authorization
    if (authHeader) {
      try {
        const { default: jwt } = await import('jsonwebtoken')
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const existing = await prisma.routeRating.findUnique({
          where: { userId_routeId: { userId: decoded.userId, routeId: id } }
        })
        if (existing) userRating = existing.rating
      } catch {}
    }
    res.json({ thumbsUp, thumbsDown, userRating })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
