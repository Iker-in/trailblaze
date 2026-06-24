import express from 'express'
import { startTracking, updateTracking, stopTracking, getTracking } from '../controllers/tracking.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/start', authenticate, startTracking)
router.patch('/update', authenticate, updateTracking)
router.delete('/stop', authenticate, stopTracking)
router.get('/:sessionId', getTracking)

export default router
