const express = require('express')
const alert = require('alert')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const sorting = require('../../utilities/sort')

// http://localhost:3000/ => index page
router.get('/', (req, res) => {
  return Restaurant.find()
    .lean()
    .then(restaurants => {
      if (!restaurants.length) {
        alert('還沒有餐廳資料喔!\n快來新增第一筆吧!')
      }
      res.render('index', { restaurants })
    })
    .catch(error => {
      console.error(error)
    })
})

// http://localhost:3000/search => 搜尋功能
router.get('/search', (req, res) => {
  let keyword = req.query.keyword.trim()
  const regKeyword = new RegExp(keyword, 'gi') // 將keyword變數裡面的字串轉為正規表達式，flag gi表示ignore大小寫以及整個欄位搜尋
  const sortby = req.query.sortby
  const [ sortCondition, sortBy ]= sorting(sortby)

  return Restaurant.find({
    $or: [{ name: regKeyword }, { category: regKeyword }],
  })
    .sort(sortCondition)
    .lean()
    .then(restaurants => {
      if (!restaurants || !restaurants.length) {
        alert(
          `Oops!找不到您要的餐廳\n再試試別的關鍵字吧!\n\n\n按enter回所有清單`
        )
        keyword = ''
      }
      res.render('index', { restaurants, keyword, sortBy })
    })
    .catch(error => {
      console.log(error)
      return res.redirect('error')
    })
})

module.exports = router
