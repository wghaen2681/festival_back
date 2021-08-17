import mongoose from 'mongoose'

const Schema = mongoose.Schema

const AssistSchema = new Schema({
  type: {
    type: String
  },
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
  image: {
    type: String
  },
  email: {
    type: String
  },
  state: {
    type: String,
    default: '尚未回覆'
  }
}, { versionKey: false })

export default mongoose.model('assists', AssistSchema)
