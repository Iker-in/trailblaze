import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'
import { validationResult } from 'express-validator'
import crypto from 'crypto'
import { Resend } from 'resend'

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

const revokeToken = async (token) => {
  try {
    const decoded = jwt.decode(token)
    if (!decoded || !decoded.exp) return
    const expiresAt = new Date(decoded.exp * 1000)
    await prisma.revokedToken.create({ data: { token, expiresAt } })
  } catch (error) {
    console.error('Error revocando token:', error)
  }
}

const isTokenRevoked = async (token) => {
  const revoked = await prisma.revokedToken.findUnique({ where: { token } })
  return !!revoked
}

const cleanExpiredTokens = async () => {
  await prisma.revokedToken.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  })
}

export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, email, password } = req.body

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    })

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.email === email
          ? 'Este email ya esta registrado'
          : 'Este nombre de usuario ya esta en uso'
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { username, email, passwordHash }
    })

    const { accessToken, refreshToken } = generateTokens(user.id)
    setRefreshCookie(res, refreshToken)

    res.status(201).json({
      message: 'Cuenta creada exitosamente',
      token: accessToken,
      user: { id: user.id, username: user.username, email: user.email }
    })

  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash)

    if (!validPassword) {
      console.warn(`Login fallido para email: ${email} desde IP: ${req.ip}`)
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const { accessToken, refreshToken } = generateTokens(user.id)
    setRefreshCookie(res, refreshToken)

    res.json({
      message: 'Inicio de sesion exitoso',
      token: accessToken,
      user: { id: user.id, username: user.username, email: user.email }
    })

  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken

    if (!token) {
      return res.status(401).json({ error: 'No hay refresh token' })
    }

    const revoked = await isTokenRevoked(token)
    if (revoked) {
      return res.status(401).json({ error: 'Token revocado' })
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true }
    })

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }

    await revokeToken(token)

    const { accessToken, refreshToken } = generateTokens(user.id)
    setRefreshCookie(res, refreshToken)

    res.json({ token: accessToken, user })

  } catch (error) {
    res.status(401).json({ error: 'Refresh token invalido o expirado' })
  }
}

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    if (token) {
      await revokeToken(token)
      await cleanExpiredTokens()
    }
    res.clearCookie('refreshToken')
    res.json({ message: 'Sesion cerrada' })
  } catch (error) {
    console.error('Error en logout:', error)
    res.clearCookie('refreshToken')
    res.json({ message: 'Sesion cerrada' })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        points: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({ user })

  } catch (error) {
    console.error('Error en getMe:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const resend = new Resend(process.env.RESEND_API_KEY)

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    console.log('forgot-password request para:', email)
    const user = await prisma.user.findUnique({ where: { email } })

    // Siempre respondemos igual para no revelar si el email existe
    if (!user) return res.json({ message: 'Si ese email existe, recibirás un enlace en breve' })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    await prisma.passwordResetToken.create({
      data: { token, expiresAt, userId: user.id }
    })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    const emailResult = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: user.email,
  subject: 'Recupera tu contrasena — TrailBlaze',
  html: `<p>Hola ${user.username},</p>
         <p>Haz clic en el enlace para restablecer tu contrasena. Expira en 1 hora.</p>
         <a href="${resetUrl}">${resetUrl}</a>
         <p>Si no lo pediste, ignora este email.</p>`
})
console.log('Resend result:', JSON.stringify(emailResult))

    res.json({ message: 'Si ese email existe, recibirás un enlace en breve' })
  } catch (error) {
    console.error('Error en forgotPassword:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    const record = await prisma.passwordResetToken.findUnique({ where: { token } })

    if (!record || record.used || record.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Token invalido o expirado' })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash }
    })

    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true }
    })

    res.json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    console.error('Error en resetPassword:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}