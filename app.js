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
const MongoStore = require('connect-mongo')

const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = process.env.PORT

// Setting view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

// Setting expess-session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      autoRemove: 'native', // cookie到期時預設TTL也到期，把expire的session移除
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie存活時間 7 天，7天後清除cookie及session
    },
  })
)

// 對request做前處理
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

// 使用passport驗證
usePassport(app)

// connect-flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.loginFailed_msg = req.flash('error_messages')
  res.locals.extractedErrors = req.flash('errors')
  next()
})
// request送進路由
app.use(routes)

// Listen on localhost://3000
app.listen(port, () => {
  console.log(`Restaurant List is listening on http://localhost:${port}`)
})
