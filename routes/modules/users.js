const express = require('express')
const passport = require('passport')

const router = express.Router()

const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
)

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  let { name, email, password, confirmPassword } = req.body
  if (!name) {
    name = 'Mr./Ms user'
  }

  if (password !== confirmPassword) {
    console.log('兩次密碼不符合')
    return res.render('register', {
      name,
      email,
      password,
      confirmPassword,
    })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('User already exist')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword,
        })
      }
      return User.create({ name, email, password })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
    .catch(error => {
      console.log(error)
    })
})

module.exports = router
