const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增餐廳
router.post('/', (req, res) => {
  const restaurant = req.body
  restaurant.rating = Number(restaurant.rating)

  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      return res.redirect('/restaurants/new')
    })
})

// 進入 Detail 頁面
router.get('/:id', (req, res) => {
  const id = req.params.id
  let notInDatabase = false
  return Restaurant.findById(id)
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
  const id = req.params.id
  let notInDatabase = false
  return Restaurant.findById(id)
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
  const id = req.params.id
  const restaurantUpdated = req.body
  restaurantUpdated.rating = Number(restaurantUpdated.rating) // 處理rating data type

  return Restaurant.findByIdAndUpdate(id, restaurantUpdated)
    .then(() => {
      return res.redirect(`/restaurants/${id}/`)
    })
    .catch(error => {
      console.log(error)
      return res.render('error')
    })
})

// 刪除餐廳
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
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
