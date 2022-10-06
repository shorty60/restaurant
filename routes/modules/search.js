const express = require('express')
const router = express.Router()
const alert = require('alert')
const Restaurant = require('../../models/restaurant')

// http://localhost:3000/search => 搜尋功能
router.get('/', (req, res) => {
  if (!req.query.keyword) {
    return res.redirect('/')
  }
  let keyword = req.query.keyword.trim()
  const regKeyword = new RegExp(keyword, 'gi') //將keyword變數裡面的字串轉為正規表達式，flag gi表示ignore大小寫以及整個欄位搜尋

  return Restaurant.find({
    $or: [{ name: regKeyword }, { category: regKeyword }],
  })
    .lean()
    .then(restaurants => {
      if (!restaurants || !restaurants.length) {
        alert(
          `Oops!找不到您要的餐廳\n再試試別的關鍵字吧!\n\n\n按enter回所有清單`
        )
        keyword = ''
      }
      res.render('index', { restaurants, keyword })
    })
    .catch(error => {
      console.log(error)
      return res.redirect('error')
    })
})

module.exports = router
