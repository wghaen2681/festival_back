import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

import {
  newProduct,
  getProduct,
  editProduct,
  getAllProduct,
  getExtendProduct,
  getProductById
} from '../controllers/products.js'

const router = express.Router()

router.post('/', auth, upload, newProduct)
router.get('/', getProduct) // 取得上架商品
router.get('/all', getAllProduct) // 取得所有商品
router.get('/extend', getExtendProduct) // 取得相關商品
router.get('/:id', getProductById)
router.patch('/:id', auth, upload, editProduct)

export default router
