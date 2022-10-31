const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('../models/user')

module.exports = app => {
  // Ininitialize passport
  app.use(passport.initialize())
  app.use(passport.session())

  // Local Strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: 'This email has not neen registerd!',
            })
          }
          if (user.password !== password) {
            return done(null, false, {
              message: 'Email or password is incorrect!',
            })
          }
          return done(null, user)
        })
        .catch(error => {
          console.log(error)
          return done(error, false)
        })
    })
  )
  // serialize and deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => {
        console.log(error)
        return done(err, null)
      })
  })
}
