import { Router } from 'express'
import { body } from 'express-validator'
import rateLimit from 'express-rate-limit'
import { register, login, getMe } from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos, espera 15 minutos' }
})

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('El username debe tener entre 3 y 30 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El username solo puede tener letras, numeros y guiones bajos'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email invalido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contrasena debe tener al menos 8 caracteres')
]

const loginValidation = [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').notEmpty()
]

router.post('/register', registerValidation, register)
router.post('/login', loginLimiter, loginValidation, login)
router.get('/me', authenticate, getMe)

export default router
