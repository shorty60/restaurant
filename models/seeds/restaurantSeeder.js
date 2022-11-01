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
    usersDatas.map(user => {
      const { name, email, password, restaurantIndex } = user

      return User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      }).then(user => {
        const restaurants = restaurantIndex.map(index => {
          const restaurant = restaurantDatas[index]
          restaurant.userId = user._id
          return restaurant
        })

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
