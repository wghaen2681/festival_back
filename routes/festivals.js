import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

import {
  newFestival,
  getFestival,
  editFestival,
  getAllFestival,
  getUpcmingFestival,
  getProgressFestival,
  getFestivalById,
  getFestivalBySeason
} from '../controllers/festivals.js'

const router = express.Router()

router.post('/', auth, upload, newFestival)
router.get('/', getFestival)
router.get('/all', getAllFestival)
router.get('/upcoming', getUpcmingFestival)
router.get('/progress', getProgressFestival)
router.get('/:id', getFestivalById)
router.get('/season/:season', getFestivalBySeason)
router.patch('/:id', auth, upload, editFestival)

export default router
