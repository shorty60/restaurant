const express = require('express')
const alert = require('alert')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// http://localhost0/restaurants/new => 進入 Add new restaurant 頁面
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
      alert('Something error...')
      return res.redirect('/restaurants/new')
    })
})

// http://localhost0/restaurants/:id => 進入 Detail 頁面
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      if (!restaurant) {
        return res.render('error')
      }
      res.render('show', { restaurant })
    })
    .catch(error => {
      console.log(error)
      return res.render('error')
    })
})

// http://localhost:3000/:id/edit => 進入編輯頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      if (!restaurant) {
        return res.render('error')
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
        return alert(`Oops! 找不到這個餐廳!抱歉`)
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
