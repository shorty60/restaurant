const mongoose = require('mongoose') // 導入mongoose
const Restaurant = require('../restaurant') // 載入 restaurant model，使用model定義的schema
const restaurantDatas = require('../../restaurant.json').results // 導入JSON檔案做為種子資料內容

// 建立與MondoDB目標資料庫連線
mongoose.connect(process.env.MONGODB_URI)

// 取得連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB connection failed.')
})
db.once('open', () => {
  console.log('MongoDB connected, start writing seeds...')
  Restaurant.insertMany(restaurantDatas)
    .then(() => console.log('Seeds written!'))
    .catch(error => console.log(error))
})
