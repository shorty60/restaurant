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
  restaurantDatas.forEach(data => {
    Restaurant.create({
      _id: data.id,
      name: data.name,
      name_en: data.name_en,
      category: data.category,
      image: data.image,
      location: data.location,
      phone: data.phone,
      google_map: data.google_map,
      rating: data.rating,
      description: data.description,
    })
  })
  console.log('Seeds written!')
})
