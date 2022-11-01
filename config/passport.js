const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports = app => {
  // Ininitialize passport
  app.use(passport.initialize())
  app.use(passport.session())

  // Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      (req, email, password, done) => {
        User.findOne({ email })
          .then(user => {
            if (!user) {
              return done(
                null,
                false,
                req.flash(
                  'error_messages',
                  'This email has not neen registerd!'
                )
              )
            }
            return bcrypt.compare(password, user.password).then(isMatched => {
              if (!isMatched) {
                return done(
                  null,
                  false,
                  req.flash('error_messages', 'Email or password incorrect.')
                )
              }
              return done(null, user)
            })
          })
          .catch(error => {
            console.log(error)
            return done(error, false)
          })
      }
    )
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
