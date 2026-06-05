import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { upload } from '../config/cloudinary.js'
import { uploadPhoto, deletePhoto } from '../controllers/photos.controller.js'

const router = Router()

router.post('/:id/photos', authenticate, upload.single('photo'), uploadPhoto)
router.delete('/:id/photos/:photoId', authenticate, deletePhoto)

export default router