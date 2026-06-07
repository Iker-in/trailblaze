import { Router } from 'express'
import prisma from '../config/prisma.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { points: 'asc' }
    })
    res.json({ achievements })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router