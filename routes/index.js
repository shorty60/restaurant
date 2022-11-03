const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')
const errorHandling = require('../middleware/errorhandling')


router.use('/users', users)
router.use('/auth', auth)
router.use('/restaurants', authenticator, restaurants)
router.use('/', authenticator, home)

router.use('*', (req, res) => {
  res.status(404).render('notfound')
})

router.use(errorHandling)

module.exports = router
