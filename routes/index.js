const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')
const { NoRestaurantError } = require('../utilities/errortype') // Include errortype class define

router.use('/users', users)
router.use('/auth', auth)
router.use('/restaurants', authenticator, restaurants)
router.use('/', authenticator, home)

router.use('*', (req, res) => {
  res.status(404).render('notfound')
})

router.use((err, req, res, next) => {
  // 找不到餐廳的錯誤處理->顯示首頁以及flash-message
  if (err instanceof NoRestaurantError) {
    const notFoundRestaurant = err.message
    return res.render('index', { notFoundRestaurant })
  }

  errors.push = 'Sorry, we encounter some problem... please try again later'
  req.flash(errors)
  console.log(err)
  res.status(500).render('error')
})

module.exports = router
