import prisma from '../config/prisma.js'
import cloudinary from '../config/cloudinary.js'

export const uploadPhoto = async (req, res) => {
  try {
    const { id } = req.params

    const route = await prisma.route.findUnique({ where: { id } })

    if (!route) {
      return res.status(404).json({ error: 'Ruta no encontrada' })
    }

    if (route.userId !== req.userId) {
      return res.status(403).json({ error: 'No tienes permiso para subir fotos a esta ruta' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se subio ninguna imagen' })
    }

    const photoCount = await prisma.routePhoto.count({ where: { routeId: id } })

    if (photoCount >= 5) {
      return res.status(400).json({ error: 'Maximo 5 fotos por ruta' })
    }

    const photo = await prisma.routePhoto.create({
      data: {
        url: req.file.path,
        routeId: id,
        order: photoCount
      }
    })

    res.status(201).json({ message: 'Foto subida exitosamente', photo })

  } catch (error) {
    console.error('Error al subir foto:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params

    const photo = await prisma.routePhoto.findUnique({
      where: { id: photoId },
      include: { route: true }
    })

    if (!photo) {
      return res.status(404).json({ error: 'Foto no encontrada' })
    }

    if (photo.route.userId !== req.userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta foto' })
    }

    const publicId = photo.url.split('/').slice(-2).join('/').split('.')[0]
    await cloudinary.uploader.destroy(`trailblaze/routes/${publicId}`)

    await prisma.routePhoto.delete({ where: { id: photoId } })

    res.json({ message: 'Foto eliminada exitosamente' })

  } catch (error) {
    console.error('Error al eliminar foto:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}