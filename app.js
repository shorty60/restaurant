// Include required packages from node_modules and setting server related parameters
const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')

const restaurantsList = require('./restaurant.json').results //Include restaurants data from JSON file
// Setting view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Setting static files
app.use(express.static('public'))

////  Setting route
// http://localhost:3000/ => index page
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantsList })
})

// http://localhost0/restaurants/:id => show page
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantsList.find(
    (restaurant) => restaurant.id.toString() === req.params.id
  )
  res.render('show', { restaurant })
})

// http://localhost:3000/search => 搜尋功能
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const filterRestaurants = restaurantsList.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
    )
  })
  res.render('index', { restaurants: filterRestaurants, keyword })
})

// Listen on localhost://3000
app.listen(port, () => {
  console.log(`Restaurant List is listening on http://localhost:${port}`)
})
