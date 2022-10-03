// Include required packages from node_modules and setting server related parameters
const express = require('express')
const exphbs = require('express-handlebars')
const alert = require('alert')
const mongoose = require('mongoose') // 載入mongoose

const Restaurant = require('./models/restaurant') // 載入restaurant model
const app = express()
const port = 3000

// 設定mongoDB連線
mongoose.connect(process.env.MONGODB_URI)
// 取得連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('Error on MongoDB connection!')
})

db.once('open', () => {
  console.log('MongoDB connected')
})

// Setting view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Setting static files
app.use(express.static('public'))

////  Setting route
// http://localhost:3000/ => index page
app.get('/', (req, res) => {
  return Restaurant.find() //透過mongoose去資料庫拿所有資料
    .lean() // 將拿到的資料整理成乾淨的JS陣列
    .then(restaurants => res.render('index', { restaurants })) // 拿到後放入變數restaurants
    .catch(error => console.error(error)) // error handling
})

// http://localhost0/restaurants/:id => show page
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurants.find(
    restaurant => restaurant.id.toString() === req.params.id
  )
  res.render('show', { restaurant })
})

// http://localhost:3000/search => 搜尋功能
app.get('/search', (req, res) => {
  if (!req.query.keyword) {
    return res.redirect('/')
  }
  let keyword = req.query.keyword.trim()
  const filterRestaurants = restaurants.filter(restaurant => {
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
