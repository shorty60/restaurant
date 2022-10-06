const express = require('express')
const alert = require('alert')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

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

module.exports = router
