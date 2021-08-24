import express from 'express'
import auth from '../middleware/auth.js'
import {
  register,
  login,
  logout,
  addCart,
  getCart,
  editCartSize,
  editCartAmount,
  checkout,
  getorders,
  getallorders,
  extend,
  getuserinfo,
  getalluserinfo,
  getUserInfoById,
  editUserInfoById,
  getOrderById
} from '../controllers/users.js'

const router = express.Router()

router.post('/', register)
router.get('/', auth, getuserinfo)
router.get('/all', getalluserinfo) // 取得所有會員路由
router.get('/id/:id', getUserInfoById)
router.patch('/id/:id', editUserInfoById)
router.post('/login', login)
router.delete('/logout', auth, logout)
router.post('/cart', auth, addCart)
router.get('/cart', auth, getCart)
router.patch('/cart/size', auth, editCartSize)
router.patch('/cart/amount', auth, editCartAmount)
router.post('/checkout', auth, checkout)
router.get('/orders', auth, getorders)
router.get('/orders/all', getallorders)
router.get('/orders/:id', auth, getOrderById)
router.post('/extend', auth, extend)

export default router
