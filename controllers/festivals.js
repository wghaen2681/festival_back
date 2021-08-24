import festivals from '../models/festivals.js'

// 新增節慶的方法
export const newFestival = async (req, res) => {
  // 身份驗證
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  // 格式驗證 (For image file upload)
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    // 定義 result 為輸出資料的一個常數
    // 問題：festivals.create()看不太懂
    const result = await festivals.create({
      title: req.body.title,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      description: req.body.description,
      information: req.body.information,
      host: req.body.host,
      image: req.filepath
    })
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

// 取得所有未到期節慶的方法
export const getFestival = async (req, res) => {
  try {
    const result = await festivals.find({ due: false })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllFestival = async (req, res) => {
  try {
    const result = await festivals.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getUpcmingFestival = async (req, res) => {
  try {
    const result = await festivals.find({ dateStart: { $gt: new Date() } }).sort({ dateStart: 1 }) // 取得所有開始日期在今天以後的節慶，並依升冪排列
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getProgressFestival = async (req, res) => {
  try {
    const result = await festivals.find({ dateStart: { $lte: new Date() } }).find({ dateEnd: { $gte: new Date() } }).sort({ dateStart: -1 }) // 取得所有進行中的節慶，並依降冪排列
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getFestivalById = async (req, res) => {
  try {
    const result = await festivals.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無節慶' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getFestivalBySeason = async (req, res) => {
  try {
    const result = await festivals.aggregate([
      {
        $addFields: {
          // title: 1, // Mark it off by myself for it will change the title of the festivals.
          'dateStart2.year': {
            $toInt: {
              $substr: [
                '$dateStart', 0, 4
              ]
            }
          },
          'dateStart2.month': {
            $toInt: {
              $substr: [
                '$dateStart', 5, 2
              ]
            }
          },
          'dateStart2.day': {
            $toInt: {
              $substr: [
                '$dateStart', 8, 2
              ]
            }
          },
          'dateEnd2.year': {
            $toInt: {
              $substr: [
                '$dateEnd', 0, 4
              ]
            }
          },
          'dateEnd2.month': {
            $toInt: {
              $substr: [
                '$dateEnd', 5, 2
              ]
            }
          },
          'dateEnd2.day': {
            $toInt: {
              $substr: [
                '$dateEnd', 8, 2
              ]
            }
          }
        }
      }, {
        $addFields: {
          season: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [
                      {
                        $gte: [
                          '$dateStart2.month', 3
                        ]
                      }, {
                        $lte: [
                          '$dateStart2.month', 5
                        ]
                      }
                    ]
                  },
                  then: 1
                }, {
                  case: {
                    $and: [
                      {
                        $gte: [
                          '$dateStart2.month', 6
                        ]
                      }, {
                        $lte: [
                          '$dateStart2.month', 8
                        ]
                      }
                    ]
                  },
                  then: 2
                }, {
                  case: {
                    $and: [
                      {
                        $gte: [
                          '$dateStart2.month', 9
                        ]
                      }, {
                        $lte: [
                          '$dateStart2.month', 11
                        ]
                      }
                    ]
                  },
                  then: 3
                }, {
                  case: {
                    $or: [
                      {
                        $gte: [
                          '$dateStart2.month', 12
                        ]
                      }, {
                        $lte: [
                          '$dateStart2.month', 2
                        ]
                      }
                    ]
                  },
                  then: 4
                }
              ],
              default: null
            }
          }
        }
      }, {
        $match: {
          season: parseInt(req.params.season)
        }
      }
    ])
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editFestival = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    const data = {
      title: req.body.title,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      description: req.body.description,
      information: req.body.information,
      image: req.body.image,
      host: req.body.host
    }
    if (req.filepath) data.image = req.filepath
    const result = await festivals.findByIdAndUpdate(req.params.id, data, { new: true })
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
