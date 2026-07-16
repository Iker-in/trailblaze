import { writeFileSync } from "fs"

const content = `import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { upload } from '../config/cloudinary.js'
import { updateCompletion, uploadCompletionPhoto, deleteCompletionPhoto } from '../controllers/completions.controller.js'

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

router.patch('/:id', authenticate, updateCompletion)
router.post('/:id/photos', authenticate, handleUpload, uploadCompletionPhoto)
router.delete('/photos/:photoId', authenticate, deleteCompletionPhoto)

export default router
`

writeFileSync("C:/proyectos/trailblaze/backend/src/routes/completions.routes.js", content)
console.log("completions.routes.js creado")
