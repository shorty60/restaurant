const express = require('express')
const assert = require('assert')

const router = express.Router()
const Restaurant = require('../../models/restaurant')
const sorting = require('../../utilities/sort')
const { NoRestaurantError } = require('../../utilities/errortype')

// http://localhost:3000/ => index page
router.get('/', (req, res, next) => {
  const userId = req.user._id
  return Restaurant.find({ userId })
    .sort({ _id: 'asc' })
    .lean()
    .then(restaurants => {
      assert(
        restaurants.length,
        new NoRestaurantError('目前還沒有餐廳，快來新增第一筆吧!')
      )
      res.render('index', { restaurants })
    })
    .catch(err => {
      next(err)
    })
})

// http://localhost:3000/search => 搜尋功能
router.get('/search', (req, res, next) => {
  const userId = req.user._id
  let keyword = req.query.keyword.trim()
  const regKeyword = new RegExp(keyword, 'gi') // 將keyword變數裡面的字串轉為正規表達式，flag gi表示ignore大小寫以及整個欄位搜尋
  const sortby = req.query.sortby
  const [sortCondition, sortBy] = sorting(sortby)

  return Restaurant.find({
    userId,
    $or: [{ name: regKeyword }, { category: regKeyword }],
  })
    .sort(sortCondition)
    .lean()
    .then(restaurants => {
      assert(
        restaurants.length,
        new NoRestaurantError('找不到您要的餐廳喔，試試別的關鍵字吧! 按enter鍵回到首頁')
      )
      res.render('index', { restaurants, keyword, sortBy })
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router
