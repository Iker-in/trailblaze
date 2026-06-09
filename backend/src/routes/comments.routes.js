import { Router } from 'express'
import { body } from 'express-validator'
import { rateLimit } from 'express-rate-limit'
import { authenticate } from '../middleware/auth.middleware.js'
import { getComments, createComment, deleteComment } from '../controllers/comments.controller.js'

const router = Router()

const commentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.userId || req.ip,
  message: { error: 'Demasiados comentarios. Espera unos minutos antes de comentar de nuevo.' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.get('/:id/comments', getComments)
router.post('/:id/comments', authenticate, commentLimiter, [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('El comentario debe tener entre 1 y 500 caracteres')
], createComment)
router.delete('/:id/comments/:commentId', authenticate, deleteComment)

export default router
