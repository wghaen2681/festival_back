import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: [true, '標題不能為空'],
    minlength: [1, '標題不能為空']
  },
  date: {
    type: Date,
    required: [true, '日期不能為空'],
    default: Date.now
  },
  content: {
    type: String
  },
  information: {
    type: String
  },
  image: {
    type: String
  },
  author: {
    type: String
  },
  weight: {
    type: Number
  },
  festival: {
    type: Schema.Types.ObjectId,
    ref: 'festivals',
    required: [true, '缺少節慶 ID']
  },
  published: {
    type: String,
    default: '只有我能看見'
  }
}, { versionKey: false })

export default mongoose.model('articles', ArticleSchema)
