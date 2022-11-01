// Include required packages from node_modules and setting server related parameters
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
if (process.env.Node_ENV !== 'production') {
  require('dotenv').config()
}
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')

const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = 3000

// Setting view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

// Setting expess-session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
)

// 對request做前處理
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.loginFailed_msg = req.flash('error_messages')
  next()
})
// request送進路由
app.use(routes)

// Listen on localhost://3000
app.listen(port, () => {
  console.log(`Restaurant List is listening on http://localhost:${port}`)
})
