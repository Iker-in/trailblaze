import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import routeRoutes from './routes/routes.routes.js'
import userRoutes from './routes/users.routes.js'
import followRoutes from './routes/follows.routes.js'
import rankingRoutes from './routes/ranking.routes.js'
import photoRoutes from './routes/photos.routes.js'
import achievementRoutes from './routes/achievements.routes.js'
import notificationRoutes from './routes/notifications.routes.js'
import commentRoutes from './routes/comments.routes.js'
import prisma from './config/prisma.js'

dotenv.config()
const isProduction = process.env.NODE_ENV === 'production'

const app = express()
const PORT = process.env.PORT || 3000

// Seguridad - cabeceras HTTP
app.use(helmet())

// Logs de peticiones
app.use(morgan('dev'))

// Parsear JSON en el body de las peticiones
app.use(express.json())
app.use(cookieParser())

// Configuracion de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Rate limiting global - max 100 peticiones cada 15 minutos por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas peticiones, intenta mas tarde' }
})
app.use(limiter)
app.use('/api/auth', authRoutes)
app.use('/api/routes', routeRoutes)
app.use('/api/users', userRoutes)
app.use('/api/users', followRoutes)
app.use('/api/ranking', rankingRoutes)
app.use('/api/routes', photoRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/routes', commentRoutes)


// Ruta de salud - para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TrailBlaze API funcionando',
    timestamp: new Date().toISOString()
  })
})

app.get('/api/stats', async (req, res) => {
  try {
    const [users, routes, completions] = await Promise.all([
      prisma.user.count(),
      prisma.route.count({ where: { status: 'published' } }),
      prisma.routeCompletion.count()
    ])
    res.json({ users, routes, completions })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  const isDev = process.env.NODE_ENV !== 'production'
  res.status(500).json({
    error: 'Error interno del servidor',
    ...(isDev && { details: err.message })
  })

})
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})