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

// set body-parser
app.use(express.urlencoded({ extended: true }))
// Setting static files
app.use(express.static('public'))

////  Setting route
// http://localhost:3000/ => index page
app.get('/', (req, res) => {
  return Restaurant.find() //透過mongoose去資料庫拿所有資料
    .lean() // 將拿到的資料整理成乾淨的JS陣列
    .then(restaurants => {
      if (!restaurants.length) {
        alert('還沒有餐廳資料喔!\n快來新增第一筆吧!')
      }
      res.render('index', { restaurants })
    }) // 拿到後放入變數restaurants
    .catch(error => {
      console.error(error)
    }) // error handling
})

// http://localhost0/restaurants/:id => show page
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id) // 用從URL抓到的id來查詢資料庫
    .lean() // 整理成乾淨JS物件
    .then(restaurant => {
      if (!restaurant) {
        return res.render('error')
      }
      res.render('show', { restaurant })
    }) // 如果有在資料庫找到該id對應資料，請模板引擎render show模板
    .catch(error => {
      console.log(error)
      return res.render('error')
    }) // error handling
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

  return Restaurant.findById(id)
    .then(restaurant => {
      if (!restaurant) {
        return alert(`Oops! 找不到這個餐廳!抱歉`)
      }
      restaurant.name = restaurantUpdated.name
      restaurant.category = restaurantUpdated.category
      restaurant.image = restaurantUpdated.image
      restaurant.location = restaurantUpdated.location
      restaurant.phone = restaurantUpdated.phone
      restaurant.google_map = restaurantUpdated.google_map
      restaurant.rating = restaurantUpdated.rating
      restaurant.description = restaurantUpdated.description

      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}/`))
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
