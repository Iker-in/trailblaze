import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { addFavorite, removeFavorite, getFavoriteStatus, getUserFavorites } from '../controllers/favorites.controller.js'

const router = Router()

router.post('/:id/favorite', authenticate, addFavorite)
router.delete('/:id/favorite', authenticate, removeFavorite)
router.get('/:id/favorite-status', authenticate, getFavoriteStatus)

export default router
