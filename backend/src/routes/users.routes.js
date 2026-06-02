import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.middleware.js'
import {
  getProfile,
  getUserRoutes,
  getUserCompletions,
  updateProfile
} from '../controllers/users.controller.js'

const router = Router()

router.get('/:username', getProfile)
router.get('/:username/routes', getUserRoutes)
router.get('/:username/completions', getUserCompletions)
router.patch('/me/profile', authenticate, [
  body('bio').optional().trim().isLength({ max: 300 }).withMessage('La bio no puede superar 300 caracteres')
], updateProfile)

export default router