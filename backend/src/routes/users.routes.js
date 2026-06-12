import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.middleware.js'
import prisma from '../config/prisma.js'
import { getUserFavorites } from '../controllers/favorites.controller.js'
import { getProfile, getUserRoutes, getUserCompletions, updateProfile, searchUsers, updateAvatar } from '../controllers/users.controller.js'
import { upload } from '../config/cloudinary.js'

const router = Router()

router.get('/:username', getProfile)
router.get('/:username/routes', getUserRoutes)
router.get('/:username/completions', getUserCompletions)
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

router.get('/search', searchUsers)

router.get('/:username/favorites', getUserFavorites)

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