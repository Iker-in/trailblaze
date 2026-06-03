import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { followUser, unfollowUser, getFollowStatus } from '../controllers/follows.controller.js'

const router = Router()

router.post('/:username/follow', authenticate, followUser)
router.delete('/:username/follow', authenticate, unfollowUser)
router.get('/:username/follow-status', authenticate, getFollowStatus)

export default router