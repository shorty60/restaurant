if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require('bcryptjs')
// Include restaurant and user model
const Restaurant = require('../restaurant')
const User = require('../user')
// Inclde seed data
const restaurantDatas = require('./restaurant.json').results // 導入JSON檔案做為種子資料內容
const usersDatas = require('./users.json').users
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('start writing seeds...')
  Promise.all(
    usersDatas.map(async user => {
      const { name, email, password, restaurantIndex } = user
      await bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, password: hash }))
        .then(user => {
          const restaurants = []
          for (i = 0; i < restaurantIndex.length; i++) {
            restaurantDatas[restaurantIndex[i]].userId = user._id // 新增userId屬性進去restaurant物件
            restaurants.push(restaurantDatas[restaurantIndex[i]]) // 把新鄒userId的餐廳物件推進restaurants陣列
          }
          return Restaurant.insertMany(restaurants) // restaurants陣列整個寫入資料庫，all or nothing
        })
    })
  )
    .then(() => {
      console.log('Seeds written!')
      db.close()
    })
    .catch(error => console.log(error))
    .finally(() => {
      console.log(
        'Process end! Please type "npm run start" to run the project.'
      )
      process.exit()
    })
})
