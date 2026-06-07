import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { getNotifications, markAllRead } from '../controllers/notifications.controller.js'

const router = Router()

router.get('/', authenticate, getNotifications)
router.patch('/read', authenticate, markAllRead)

export default router