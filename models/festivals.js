import mongoose from 'mongoose'

const Schema = mongoose.Schema

const festivalSchema = new Schema({
  title: {
    type: String,
    required: [true, '節慶名稱不能為空'],
    minlength: [1, '節慶名稱不能為空']
  },
  dateStart: {
    type: Date,
    required: [true, '日期不能為空'],
    default: Date.now
  },
  dateEnd: {
    type: Date,
    required: [true, '日期不能為空'],
    default: Date.now
  },
  description: {
    type: String
  },
  information: {
    type: String
  },
  host: {
    type: String
  },
  image: {
    type: String
  }
}, { versionKey: false })

export default mongoose.model('festivals', festivalSchema)
