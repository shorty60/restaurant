// Incliude required packages from node_modules and setting server related parameters
const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')

const restaurantsList = require('./restaurant.json').results
// setting virw engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// setting route
// http://localhost/restaurants => index page
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantsList })
})

// http://localhost/restaurants/:id => show page
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantsList.find(
    (restaurant) => restaurant.id.toString() === req.params.id
  )
  res.render('show', { restaurant })
})

// listen on localhost://3000
app.listen(port, () => {
  console.log(`Restaurant List is listening on http://localhost:${port}`)
})
