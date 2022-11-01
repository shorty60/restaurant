const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const sorting = require('../../utilities/sort')

// http://localhost:3000/ => index page
router.get('/', (req, res) => {
  noRestaurants = false
  const userId = req.user._id
  return Restaurant.find({ userId })
    .sort({ _id: 'asc' })
    .lean()
    .then(restaurants => {
      if (!restaurants.length) {
        noRestaurants = true
      }
      res.render('index', { restaurants, noRestaurants })
    })
    .catch(error => {
      console.error(error)
    })
})

// http://localhost:3000/search => 搜尋功能
router.get('/search', (req, res) => {
  const userId = req.user._id
  let keyword = req.query.keyword.trim()
  const regKeyword = new RegExp(keyword, 'gi') // 將keyword變數裡面的字串轉為正規表達式，flag gi表示ignore大小寫以及整個欄位搜尋
  const sortby = req.query.sortby
  const [sortCondition, sortBy] = sorting(sortby)
  let notFound = false

  return Restaurant.find({
    userId,
    $or: [{ name: regKeyword }, { category: regKeyword }],
  })
    .sort(sortCondition)
    .lean()
    .then(restaurants => {
      if (!restaurants || !restaurants.length) {
        notFound = true
        keyword = ''
      }
      res.render('index', { restaurants, keyword, sortBy, notFound })
    })
    .catch(error => {
      console.log(error)
      return res.redirect('error')
    })
})

module.exports = router
