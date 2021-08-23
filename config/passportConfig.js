const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

/* require model */
const User = require('../models/userModel');
/* End require model */

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'no_tlp', passwordField: 'password' }, (username, password, done) => {
      /* Match User */
      User.findOne({
        where: {
          no_tlp: username
        }
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Username Is Not Register !' })
        }
        /* Match Password */
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Wrong Password !' })
          }
        });
      });
    })
  )
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({ where: { id: id } })
      .then(user => {
        const Userdata = {
          username: user.username
        }
        done(err, Userdata)
      }).catch(err => {
        done(null, err)
      });
  })
}