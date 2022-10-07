const Restaurant = require('../restaurant') // 載入 restaurant model，使用model定義的schema
const restaurantDatas = require('./restaurant.json').results // 導入JSON檔案做為種子資料內容
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('start writing seeds...')
  Restaurant.insertMany(restaurantDatas)
    .then(() => console.log('Seeds written!'))
    .catch(error => console.log(error))
})
