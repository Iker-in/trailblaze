import prisma from '../config/prisma.js'

export const startTracking = async (req, res) => {
  try {
    const { lastLat, lastLng } = req.body
    await prisma.liveSession.updateMany({
      where: { userId: req.userId, active: true },
      data: { active: false }
    })
    const session = await prisma.liveSession.create({
      data: { userId: req.userId, lastLat, lastLng, updatedAt: new Date() }
    })
    res.status(201).json({ sessionId: session.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al iniciar tracking' })
  }
}

export const updateTracking = async (req, res) => {
  try {
    const { lastLat, lastLng } = req.body
    const session = await prisma.liveSession.findFirst({
      where: { userId: req.userId, active: true }
    })
    if (!session) return res.status(404).json({ error: 'Sesion no encontrada' })
    await prisma.liveSession.update({
      where: { id: session.id },
      data: { lastLat, lastLng, updatedAt: new Date() }
    })
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tracking' })
  }
}

export const stopTracking = async (req, res) => {
  try {
    await prisma.liveSession.updateMany({
      where: { userId: req.userId, active: true },
      data: { active: false }
    })
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Error al detener tracking' })
  }
}

export const getTracking = async (req, res) => {
  try {
    const { sessionId } = req.params
    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: { user: { select: { username: true, avatarUrl: true } } }
    })
    if (!session) return res.status(404).json({ error: 'Sesion no encontrada' })
    res.json({ session })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tracking' })
  }
}
