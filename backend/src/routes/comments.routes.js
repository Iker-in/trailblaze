import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.middleware.js'
import { getComments, createComment, deleteComment } from '../controllers/comments.controller.js'

const router = Router()

router.get('/:id/comments', getComments)
router.post('/:id/comments', authenticate, [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('El comentario debe tener entre 1 y 500 caracteres')
], createComment)
router.delete('/:id/comments/:commentId', authenticate, deleteComment)

export default router