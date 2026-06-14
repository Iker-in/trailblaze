import prisma from '../config/prisma.js'
import { validationResult } from 'express-validator'
import { createNotification } from '../services/notifications.service.js'

export const getComments = async (req, res) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 10 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { routeId: id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: { user: { select: { id: true, username: true, avatarUrl: true } } }
      }),
      prisma.comment.count({ where: { routeId: id } })
    ])

    res.json({
      comments,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const createComment = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const { content } = req.body

    const route = await prisma.route.findUnique({ where: { id } })
    if (!route) return res.status(404).json({ error: 'Ruta no encontrada' })

    const comment = await prisma.comment.create({
      data: { content, userId: req.userId, routeId: id },
      include: { user: { select: { id: true, username: true, avatarUrl: true } } }
    })

    if (route.userId !== req.userId) {
      await createNotification(route.userId, 'comment', req.username + ' comento en tu ruta: ' + route.title, '/routes/' + id)
    }

    res.status(201).json({ comment })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params

    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' })

    if (comment.userId !== req.userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' })
    }

    await prisma.comment.delete({ where: { id: commentId } })
    res.json({ message: 'Comentario eliminado' })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}