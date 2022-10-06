const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const search = require('./modules/search')

router.use('/', home)
router.use('/search', search)
router.use('/restaurants', restaurants)

module.exports = router
