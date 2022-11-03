const express = require('express')
const { body, validationResult } = require('express-validator')
const assert = require('assert')
const router = express.Router()

const Restaurant = require('../../models/restaurant')
const { validators } = require('../../middleware/validation') // Include express-validator的驗證middleware
const { NoRestaurantError } = require('../../utilities/errortype') // Include errortype class define

// 進入新增餐廳頁面
router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增餐廳
router.post('/', validators, (req, res) => {
  const errors = validationResult(req)
  const extractedErrors = [] // 提取驗證結果的錯誤訊息

  // 如果express-validator驗證有誤，則顯示flash message給使用者
  if (!errors.isEmpty()) {
    errors.array().map(err => extractedErrors.push(err.msg))
    return res.status(400).render('new', {
      extractedErrors,
    })
  }

  // 整理要寫進資料庫的資料
  const userId = req.user._id
  const restaurant = req.body
  restaurant.rating = Number(restaurant.rating)
  restaurant.userId = userId

  // 寫入資料庫
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err)
      return res.redirect('/restaurants/new')
    })
})

// 進入 Detail 頁面
router.get('/:id', (req, res, next) => {
  const _id = req.params.id
  const userId = req.user._id

  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => {
      assert(restaurant, new NoRestaurantError('找不到這間餐廳'))
      return res.render('show', { restaurant })
    })
    .catch(err => {
      next(err) //把錯誤丟出去給error-handling middleware
    })
})

// 進入編輯頁面
router.get('/:id/edit', (req, res, next) => {
  const _id = req.params.id
  const userId = req.user._id

  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => {
      assert(restaurant, new NoRestaurantError('找不到這間餐廳'))
      return res.render('edit', { restaurant })
    })
    .catch(err => {
      next(err)
    })
})

// 送出餐廳更新資料
router.put('/:id', validators, (req, res, next) => {
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

  //整理要寫入資料庫的資料
  restaurant.rating = Number(restaurant.rating) // 處理rating data type

  return Restaurant.findOneAndUpdate({ _id, userId }, restaurant)
    .then(() => {
      return res.redirect(`/restaurants/${_id}/`)
    })
    .catch(err => {
      next(err)
    })
})

// 刪除餐廳
router.delete('/:id', (req, res, next) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      assert(restaurant, new NoRestaurantError('找不到這間餐廳'))
      return restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(err => {
      next(err)
    })
})

module.exports = router
