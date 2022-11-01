const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()

const Restaurant = require('../../models/restaurant')
const { validators } = require('../../middleware/validation') // Incluse express-validator的驗證middleware

router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增餐廳
router.post('/', validators, (req, res) => {
  const errors = validationResult(req)
  const extractedErrors = [] // 提取驗證結果的錯誤訊息

  if (!errors.isEmpty()) {
    errors.array().map(err => extractedErrors.push(err.msg))
    return res.status(400).render('new', {
      extractedErrors,
    })
  }

  const userId = req.user._id
  const restaurant = req.body
  restaurant.rating = Number(restaurant.rating)
  restaurant.image = restaurant.image
    ? restaurant.image
    : 'https://raw.githubusercontent.com/shorty60/restaurant/784587901e03a9914fac33a16f0884708a238d56/public/image/restaurant%20not%20found.png'
  restaurant.description = restaurant.description
    ? restaurant.description
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
router.put('/:id', validators, (req, res) => {
  const errors = validationResult(req)
  const extractedErrors = [] // 提取驗證結果的錯誤訊息

  const _id = req.params.id
  const userId = req.user._id
  const restaurant = req.body

  // 驗證不通過，留在編輯頁面並會收到flash message
  if (!errors.isEmpty()) {
    errors.array().map(err => extractedErrors.push(err.msg))
    req.flash('errors', extractedErrors)
    return res.status(400).redirect(`/restaurants/${_id}/edit`)
  }

  restaurant.rating = Number(restaurant.rating) // 處理rating data type
  restaurant.image = restaurant.image
    ? restaurant.image
    : 'https://raw.githubusercontent.com/shorty60/restaurant/784587901e03a9914fac33a16f0884708a238d56/public/image/restaurant%20not%20found.png'
  restaurant.description = restaurant.description
    ? restaurant.description
    : '還沒有這間餐廳的介紹喔!快來幫我們認識這間餐廳吧!'

  return Restaurant.findOneAndUpdate({ _id, userId }, restaurant)
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
