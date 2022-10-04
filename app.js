// Include required packages from node_modules and setting server related parameters
const express = require('express')
const exphbs = require('express-handlebars')
const alert = require('alert')
const mongoose = require('mongoose')

const Restaurant = require('./models/restaurant')
const app = express()
const port = 3000

// 設定mongoDB連線
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => {
  console.log('Error on MongoDB connection!')
})

db.once('open', () => {
  console.log('MongoDB connected')
})

// Setting view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

// set body-parser
app.use(express.urlencoded({ extended: true }))
// Setting static files
app.use(express.static('public'))

////  Setting route
// http://localhost:3000/ => index page
app.get('/', (req, res) => {
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

//http://localhost0/restaurants/new => Add new restaurant
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  const restaurant = req.body
  restaurant.rating = Number(restaurant.rating)

  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      alert('Something error...')
      return res.redirect('/restaurants/new')
    })
})

// http://localhost0/restaurants/:id => show page
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      if (!restaurant) {
        return res.render('error')
      }
      res.render('show', { restaurant })
    })
    .catch(error => {
      console.log(error)
      return res.render('error')
    })
})

// http://localhost:3000/search => 搜尋功能
app.get('/search', (req, res) => {
  if (!req.query.keyword) {
    return res.redirect('/')
  }
  let keyword = req.query.keyword.trim()
  return Restaurant.find()
    .lean()
    .then(restaurants => {
      const filterRestaurants = restaurants.filter(restaurant => {
        return (
          restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
          restaurant.category.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      //若filterRestaurants是undefined或null，或是長度為0，表示找不到關鍵字
      if (!filterRestaurants || !filterRestaurants.length) {
        alert(
          `Oops!找不到您要的餐廳\n再試試別的關鍵字吧!\n\n\n按enter回所有清單`
        )
        keyword = ''
      }

      res.render('index', { restaurants: filterRestaurants, keyword })
    })
    .catch(error => {
      console.log(error)
      return res.redirect('error')
    })
})

// http://localhost:3000/:id/edit => 進入編輯頁面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      if (!restaurant) {
        return res.render('error')
      }
      res.render('edit', { restaurant })
    })
    .catch(error => {
      console.log(error)
      return res.render('error')
    })
})

app.post('/restaurants/:id/edit/', (req, res) => {
  const id = req.params.id
  const restaurantUpdated = req.body
  restaurantUpdated.rating = Number(restaurantUpdated.rating) // 處理rating data type

  return Restaurant.findByIdAndUpdate(id, restaurantUpdated)
    .then(() => {
      return res.redirect(`/restaurants/${id}/`)
    })
    .catch(error => {
      console.log(error)
      return res.render('error')
    })
})

// Delete function
app.post('/restaurants/:id/delete/', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      if (!restaurant) {
        return alert(`Oops! 找不到這個餐廳!抱歉`)
      }
      return restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      return res.render('error')
    })
})

// Listen on localhost://3000
app.listen(port, () => {
  console.log(`Restaurant List is listening on http://localhost:${port}`)
})
