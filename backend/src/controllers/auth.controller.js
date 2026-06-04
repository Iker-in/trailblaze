import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'
import { validationResult } from 'express-validator'

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

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true }
    })

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }

    const { accessToken, refreshToken } = generateTokens(user.id)
    setRefreshCookie(res, refreshToken)

    res.json({ token: accessToken, user })

  } catch (error) {
    res.status(401).json({ error: 'Refresh token invalido o expirado' })
  }
}

export const logout = async (req, res) => {
  res.clearCookie('refreshToken')
  res.json({ message: 'Sesion cerrada' })
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