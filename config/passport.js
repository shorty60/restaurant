const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
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
  // FB OAuth
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:  process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName'],
      },
      (accessToken, refreshToken, profile, done) => {
        let { name, email } = profile._json
        if (!name) {
          name = 'User' //若抓不到使用者名稱，填一個值
        }
        User.findOne({ email }).then(user => {
          if (user) {
            return done(null, user)
          }
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => User.create({ name, email, password: hash }))
            .then(user => done(null, user))
            .catch(error => done(error, false))
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
