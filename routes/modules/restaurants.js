const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增餐廳
router.post('/', (req, res) => {
  const userId = req.user._id
  const restaurant = req.body
  restaurant.rating = Number(restaurant.rating)
  restaurant.image = restaurant.image.trim()
    ? restaurant.image.trim()
    : 'https://raw.githubusercontent.com/shorty60/restaurant/784587901e03a9914fac33a16f0884708a238d56/public/image/restaurant%20not%20found.png'
  restaurant.description = restaurant.description.trim()
    ? restaurant.description.trim()
    : '還沒有這間餐廳的介紹喔!快來幫我們認識這間餐廳吧!'
  restaurant.userId = userId

  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      return res.redirect('/restaurants/new')
    })
})

// 進入 Detail 頁面
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  let notInDatabase = false
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => {
      if (!restaurant) {
        notInDatabase = true
        return res.render('error', { notInDatabase })
      }
      res.render('show', { restaurant })
    })
    .catch(error => {
      console.log(error)
      return res.render('error')
    })
})

// 進入編輯頁面
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  let notInDatabase = false
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => {
      if (!restaurant) {
        notInDatabase = true
        return res.render('error', { notInDatabase })
      }
      res.render('edit', { restaurant })
    })
    .catch(error => {
      console.log(error)
      return res.render('error')
    })
})
// 送出餐廳更新資料
router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const restaurantUpdated = req.body
  restaurantUpdated.rating = Number(restaurantUpdated.rating) // 處理rating data type
  restaurantUpdated.image = restaurantUpdated.image.trim()
    ? restaurantUpdated.image.trim()
    : 'https://raw.githubusercontent.com/shorty60/restaurant/784587901e03a9914fac33a16f0884708a238d56/public/image/restaurant%20not%20found.png'
  restaurantUpdated.description = restaurantUpdated.description.trim()
    ? restaurantUpdated.description.trim()
    : '還沒有這間餐廳的介紹喔!快來幫我們認識這間餐廳吧!'

  return Restaurant.findOneAndUpdate({ _id, userId }, restaurantUpdated)
    .then(() => {
      return res.redirect(`/restaurants/${_id}/`)
    })
    .catch(error => {
      console.log(error)
      return res.render('error')
    })
})

// 刪除餐廳
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      if (!restaurant) {
        return
      }
      return restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      return res.render('error')
    })
})

module.exports = router
