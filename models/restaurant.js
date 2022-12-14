const mongoose = require('mongoose') // 載入mongoose
const Schema = mongoose.Schema // 把mongoose.Schema方法存到Schema變數
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  google_map: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
