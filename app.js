// Include required packages from node_modules and setting server related parameters
const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const alert = require('alert')
const restaurants = require('./restaurant.json').results //Include restaurants data from JSON file

// Setting view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Setting static files
app.use(express.static('public'))

////  Setting route
// http://localhost:3000/ => index page
app.get('/', (req, res) => {
  res.render('index', { restaurants })
})

// http://localhost0/restaurants/:id => show page
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurants.find(
    (restaurant) => restaurant.id.toString() === req.params.id
  )
  res.render('show', { restaurant })
})

// http://localhost:3000/search => 搜尋功能
app.get('/search', (req, res) => {
  let keyword = req.query.keyword.trim()
  const filterRestaurants = restaurants.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
    )
  })
  //若filterRestaurants是undefined或null，或是長度為0，表示找不到關鍵字
  if (!filterRestaurants || !filterRestaurants.length) {
    alert(`Oops!找不到您要的餐廳\n再試試別的關鍵字吧!\n\n\n按enter回所有清單`)
    keyword = ''
  }

  res.render('index', { restaurants: filterRestaurants, keyword })
})

// Listen on localhost://3000
app.listen(port, () => {
  console.log(`Restaurant List is listening on http://localhost:${port}`)
})
