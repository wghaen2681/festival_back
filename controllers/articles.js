import articles from '../models/articles.js'
import festivals from '../models/festivals.js'

export const newArticle = async (req, res) => {
  // 格式驗證
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    const festival = await festivals.findOne({ title: req.body.festival })
    const process = {
      title: req.body.title,
      content: req.body.content,
      information: req.body.information,
      image: req.filepath,
      author: req.body.author,
      weight: req.body.weight,
      festival: festival._id, // 透過節慶名稱找到節慶 id
      published: req.body.published
    }
    if (req.body.date) {
      process.date = req.body.date
    }
    const result = await articles.create(process)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getArticle = async (req, res) => {
  try {
    const result = await articles.find({ published: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllArticle = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    const result = await articles.find().populate('festival')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getArticleById = async (req, res) => {
  try {
    const result = await articles.findById(req.params.id).populate('festival')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無商品' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getArticleByAuthor = async (req, res) => {
  try {
    const result = await articles.find({ author: req.params.id } && { published: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無文章' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getArticleByFestival = async (req, res) => {
  try {
    const result = await articles.find({ festival: req.params.festival }) // Question: How to get articles oriented in certain festival?
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無文章' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const editArticle = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    const festival = await festivals.findOne({ title: req.body.festival })
    const process = {
      title: req.body.title,
      content: req.body.content,
      information: req.body.information,
      author: req.body.author,
      weight: req.body.weight,
      festival: festival._id, // 透過節慶名稱找到節慶 id
      published: req.body.published
    }
    if (req.body.date) {
      process.date = req.body.date
    }
    if (req.filepath) process.image = req.filepath
    const result = await articles.findByIdAndUpdate(req.params.id, process, { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
