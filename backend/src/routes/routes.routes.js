import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.middleware.js'
import { createRoute, getRoutes, getRoute, completeRoute, deleteRoute, getPopularRoutes, getFeed, updateRoute } from '../controllers/routes.controller.js'

const router = Router()

const routeValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('El titulo debe tener entre 5 y 100 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('La descripcion debe tener entre 20 y 2000 caracteres'),
  body('difficulty')
    .isIn(['facil', 'moderado', 'dificil', 'experto'])
    .withMessage('Dificultad invalida'),
  body('distanceKm')
    .isFloat({ min: 0.1, max: 500 })
    .withMessage('La distancia debe ser entre 0.1 y 500 km')
]

router.get('/popular', getPopularRoutes)
router.get('/feed', authenticate, getFeed)
router.get('/', getRoutes)
router.get('/:id', getRoute)
router.post('/', authenticate, routeValidation, createRoute)
router.post('/:id/complete', authenticate, completeRoute)
router.delete('/:id', authenticate, deleteRoute)
router.patch('/:id', authenticate, routeValidation, updateRoute)

export default router
