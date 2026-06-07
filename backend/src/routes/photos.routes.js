import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { upload } from '../config/cloudinary.js'
import { uploadPhoto, deletePhoto } from '../controllers/photos.controller.js'

const router = Router()

const handleUpload = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'La imagen es muy grande. Maximo 10MB.' })
      }
      return res.status(400).json({ error: 'Error al subir la imagen' })
    }
    next()
  })
}

router.post('/:id/photos', authenticate, handleUpload, uploadPhoto)
router.delete('/:id/photos/:photoId', authenticate, deletePhoto)

export default router