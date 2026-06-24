import { Router } from 'express'
import { getRanking, getAnnualRanking } from '../controllers/ranking.controller.js'

const router = Router()

router.get('/', getRanking)
router.get('/annual', getAnnualRanking)

export default router