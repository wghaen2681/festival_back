import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

import {
  newAssist,
  getAssist,
  editAssist,
  getAllAssist,
  getAssistById
} from '../controllers/assists.js'

const router = express.Router()

router.post('/', newAssist)
router.get('/', getAssist)
router.get('/all', getAllAssist)
router.get('/:id', getAssistById)
router.patch('/:id', auth, upload, editAssist)

export default router
