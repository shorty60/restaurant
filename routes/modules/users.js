const express = require('express')
const passport = require('passport')
const session = require('express-session')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

const router = express.Router()

const User = require('../../models/user')
const { userValidator } = require('../../middleware/validation')

// 進入登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// passport驗證路由
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
)
// 登出路由
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
    req.flash('success_msg', '你已經成功登出!')
    return res.redirect('/users/login')
  })
})

// 進入註冊驗面
router.get('/register', (req, res) => {
  res.render('register')
})

// 使用者送出註冊資料
router.post('/register', userValidator, (req, res, next) => {
  let { name, email, password, confirmPassword } = req.body
  const errors = validationResult(req)
  const extractedErrors = [] // 提取驗證結果的錯誤訊息

  if (!errors.isEmpty()) {
    errors.array().map(err => extractedErrors.push(err.msg))
  }
  if (password !== confirmPassword) {
    extractedErrors.push('密碼與確認密碼不相符')
  }
  if (extractedErrors.length) {
    return res.status(400).render('register', {
      extractedErrors,
      name,
      email,
      password,
      confirmPassword,
    })
  }

  if (!name) {
    name = 'Mr./Ms user'
  } // name如果沒有填寫，代入一個預設值，確保進入資料庫有名稱

  User.findOne({ email }).then(user => {
    if (user) {
      extractedErrors.push('這個email已經註冊過了')

      return res.render('register', {
        extractedErrors,
        name,
        email,
        password,
        confirmPassword,
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => res.redirect('/'))
      .catch(err => next(err))
  })
})

module.exports = router
