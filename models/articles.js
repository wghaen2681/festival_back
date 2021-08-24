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
    type: Boolean,
    default: true
  }
}, { versionKey: false })

export default mongoose.model('articles', ArticleSchema)
