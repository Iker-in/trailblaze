import prisma from '../config/prisma.js'
import cloudinary, { uploadCompletionPhotoToCloudinary } from '../config/cloudinary.js'

const VALID_MOODS = ['increible', 'desafiante', 'relajante', 'inspiradora', 'agotadora']

export const updateCompletion = async (req, res) => {
  try {
    const { id } = req.params
    const { title, notes, mood } = req.body

    const completion = await prisma.routeCompletion.findUnique({ where: { id } })
    if (!completion) return res.status(404).json({ error: 'Aventura no encontrada' })
    if (completion.userId !== req.userId) return res.status(403).json({ error: 'No tienes permiso para editar esta aventura' })

    if (mood && !VALID_MOODS.includes(mood)) {
      return res.status(400).json({ error: 'Estado de animo invalido' })
    }

    const updated = await prisma.routeCompletion.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        notes: notes !== undefined ? notes : undefined,
        mood: mood !== undefined ? mood : undefined
      }
    })

    res.json({ message: 'Aventura actualizada', completion: updated })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const uploadCompletionPhoto = async (req, res) => {
  try {
    const { id } = req.params

    const completion = await prisma.routeCompletion.findUnique({ where: { id } })
    if (!completion) return res.status(404).json({ error: 'Aventura no encontrada' })
    if (completion.userId !== req.userId) return res.status(403).json({ error: 'No tienes permiso para subir fotos a esta aventura' })

    if (!req.file) return res.status(400).json({ error: 'No se subio ninguna imagen' })

    const photoCount = await prisma.completionPhoto.count({ where: { completionId: id } })
    if (photoCount >= 10) return res.status(400).json({ error: 'Maximo 10 fotos por aventura' })

    const result = await uploadCompletionPhotoToCloudinary(req.file.buffer)

    const photo = await prisma.completionPhoto.create({
      data: { url: result.secure_url, completionId: id, order: photoCount }
    })

    res.status(201).json({ message: 'Foto subida exitosamente', photo })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const deleteCompletionPhoto = async (req, res) => {
  try {
    const { photoId } = req.params

    const photo = await prisma.completionPhoto.findUnique({
      where: { id: photoId },
      include: { completion: true }
    })
    if (!photo) return res.status(404).json({ error: 'Foto no encontrada' })
    if (photo.completion.userId !== req.userId) return res.status(403).json({ error: 'No tienes permiso para eliminar esta foto' })

    const publicId = photo.url.split('/upload/')[1]?.split('.')[0]?.replace(/^v\d+\//, '')
    if (publicId) await cloudinary.uploader.destroy(publicId)

    await prisma.completionPhoto.delete({ where: { id: photoId } })

    res.json({ message: 'Foto eliminada exitosamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
