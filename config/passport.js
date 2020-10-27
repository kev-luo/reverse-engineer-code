var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");

// Telling passport we want to use a Local Strategy to authenticate a request. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than the default parameter name 'username'
  {
    usernameField: "email"
  },
  function(email, password, done) {
    // When a user tries to sign in we use sequelize to find an instance in the Users table where the email matches the email input by the user
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function(dbUser) {
      // If there's no user with the given email
      if (!dbUser) {
        // verify callback invokes done with false as an arg indicating authentication failed
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      else if (!dbUser.validPassword(password)) {
        // verify callback invokes done with false as an arg indicating authentication failed
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      // If none of the above, return the user
      // dbUser contains the user object along with several other keys
      return done(null, dbUser);
    });
  }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// serializes user instance to the session. 
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

// obj is just the user object. passport.session uses deserialized obj and asigns it to req.user
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
