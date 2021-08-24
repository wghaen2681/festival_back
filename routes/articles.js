import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

import {
  newArticle,
  getArticle,
  editArticle,
  getAllArticle,
  getArticleById,
  getArticleByAuthor,
  getArticleByFestival
} from '../controllers/articles.js'

const router = express.Router()

router.post('/', upload, newArticle)
router.get('/', getArticle)
router.get('/all', auth, getAllArticle)
router.get('/:id', getArticleById) // 透過文章 id 尋找文章
router.get('/author/:id', getArticleByAuthor) // 透過作者尋找文章
router.get('/festival/:festival', getArticleByFestival) // 透過節慶 id 尋找文章
router.patch('/:id', upload, editArticle)

export default router
